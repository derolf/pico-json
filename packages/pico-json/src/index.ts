export function encode(obj: unknown): Buffer {
  const encoder = new Encoder();
  encoder.put(obj);
  return encoder.finish();
}

export function decode(buf: Buffer): unknown {
  const decoder = new Decoder(buf);
  return decoder.get();
}

const FLAG_SHIFT = 4;
const FLAG_VALUE_MASK = 15;

const OBJECT = 0 << FLAG_SHIFT;
const ARRAY = 1 << FLAG_SHIFT;
const STRING = 2 << FLAG_SHIFT;
const FLOAT = 3 << FLAG_SHIFT;
const POSITIVE_INT = 4 << FLAG_SHIFT;
const NEGATIVE_INT = 5 << FLAG_SHIFT;
const UNDEFINED = 6 << FLAG_SHIFT;
const NULL = 7 << FLAG_SHIFT;
const FALSE = 8 << FLAG_SHIFT;
const TRUE = 9 << FLAG_SHIFT;

const BUFFER_SIZE = 65536;

class Encoder {
  _buffer = Buffer.alloc(BUFFER_SIZE);
  _length = 0;
  _buffers: Buffer[] = [];

  _flagBuffer = Buffer.alloc(BUFFER_SIZE);
  _flagLength = 0;

  _keys: Record<string, number> = {};
  _keysCount = 0;

  /**
   * After calling finish, the encoder can't be used anymore!
   */
  finish(): Buffer {
    this._buffers.push(this._buffer.subarray(0, this._length), this._flagBuffer.subarray(0, this._flagLength).reverse());
    return Buffer.concat(this._buffers);
  }

  put(value: unknown): void {
    switch (typeof value) {
      case "number":
        if ((value | 0) === value) {
          if (value >= 0) {
            this._putFlagValue(POSITIVE_INT, value);
          } else {
            this._putFlagValue(NEGATIVE_INT, -(value + 1));
          }
        } else {
          this._putFlagValue(FLOAT, 0);
          this._reserve(8);
          this._buffer.writeDoubleLE(value, this._length);
          this._length += 8;
        }
        return;
      case "string": {
        this._putFlagValue(STRING, value.length);
        this._putString(value);
        return;
      }
      case "boolean":
        this._putFlagValue(value ? TRUE : FALSE, 0);
        return;
      case "undefined":
        this._putFlagValue(UNDEFINED, 0);
        return;
    }

    if (Array.isArray(value)) {
      this._putFlagValue(ARRAY, value.length);
      for (const e of value) {
        this.put(e);
      }
      return;
    }

    if (value === null) {
      this._putFlagValue(NULL, 0);
      return;
    }

    // object

    const entries = Object.entries(value as Record<string, unknown>);
    this._putFlagValue(OBJECT, entries.length);

    for (const [key, value] of entries) {
      let keyIndex = this._keys[key];
      if (keyIndex === undefined) {
        keyIndex = this._keysCount++;
        this._keys[key] = keyIndex;
        this._putVarInt(key.length);
        this._putString(key);
      }
      this._putFlagVarInt(keyIndex);
      this.put(value);
    }
  }

  _reserve(amount: number) {
    const length = this._length + amount;
    if (length <= this._buffer.length) {
      return;
    }
    this._buffers.push(this._buffer.subarray(0, this._length));
    this._buffer = Buffer.alloc(Math.max(amount, BUFFER_SIZE));
    this._length = 0;
  }

  _reserveFlag(amount: number) {
    const length = this._flagLength + amount;
    if (length <= this._flagBuffer.length) {
      return;
    }
    const newBuffer = Buffer.alloc(length * 2);
    this._flagBuffer.copy(newBuffer, 0, 0, this._flagLength);
    this._flagBuffer = newBuffer;
  }

  // does not store length!
  _putString(value: string): void {
    // note: I had a version which uses Buffer.from(value) and stored these, but it was actually MUCH slower!!!
    const len = value.length;
    for (let i = 0; i < len; i++) {
      this._putVarInt(value.charCodeAt(i));
    }
  }

  _putVarInt(value: number): void {
    this._reserve(10);
    while ((value & ~0x7f) !== 0) {
      this._buffer.writeUInt8((value & 0x7f) | 0x80, this._length);
      this._length++;
      value >>= 7;
    }
    this._buffer.writeUInt8(value & 0x7f, this._length);
    this._length++;
  }

  _putFlagVarInt(value: number): void {
    this._reserveFlag(10);
    while ((value & ~0x7f) !== 0) {
      this._flagBuffer.writeUInt8((value & 0x7f) | 0x80, this._flagLength);
      this._flagLength++;
      value >>= 7;
    }
    this._flagBuffer.writeUInt8(value & 0x7f, this._flagLength);
    this._flagLength++;
  }

  _putFlagValue(flag: number, value: number): void {
    this._reserveFlag(1);

    if (value < FLAG_VALUE_MASK) {
      this._flagBuffer.writeUInt8(flag | value, this._flagLength);
      this._flagLength++;
      return;
    }

    this._flagBuffer.writeUInt8(flag | FLAG_VALUE_MASK, this._flagLength);
    this._flagLength++;
    this._putVarInt(value);
  }
}

class Decoder {
  constructor(buffer: Buffer) {
    this._buffer = buffer;
    this._flagOffset = buffer.length - 1;
  }

  readonly _buffer: Buffer;
  _offset = 0;
  _flagOffset: number;
  readonly _keys: string[] = [];

  get(): unknown {
    const flagValue = this._buffer.readUInt8(this._flagOffset);
    this._flagOffset--;
    const flag = flagValue & ~FLAG_VALUE_MASK;
    switch (flag) {
      case UNDEFINED:
        return undefined;
      case NULL:
        return null;
      case FALSE:
        return false;
      case TRUE:
        return true;
      case POSITIVE_INT:
        return this._getFlagValue(flagValue);
      case NEGATIVE_INT:
        return -this._getFlagValue(flagValue) - 1;
      case FLOAT: {
        const result = this._buffer.readDoubleLE(this._offset);
        this._offset += 8;
        return result;
      }
      case STRING: {
        return this._getString(this._getFlagValue(flagValue));
      }
      case ARRAY: {
        const size = this._getFlagValue(flagValue);
        const result = new Array<unknown>(size);
        for (let i = 0; i < size; i++) {
          result[i] = this.get();
        }
        return result;
      }
      case OBJECT: {
        const result: Record<string, unknown> = {};

        const size = this._getFlagValue(flagValue);
        for (let i = 0; i < size; i++) {
          let key: string;
          const keyIndex = this._getFlagVarInt();
          if (keyIndex < this._keys.length) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            key = this._keys[keyIndex]!;
          } else {
            key = this._getString(this._getVarInt());
            this._keys.push(key);
          }
          result[key] = this.get();
        }

        return result;
      }
      default:
        throw new Error(`Unknown flag: ${flag}`);
    }
  }

  _getFlagValue(flagValue: number): number {
    const value = flagValue & FLAG_VALUE_MASK;
    if (value < FLAG_VALUE_MASK) {
      return value;
    }
    return this._getVarInt();
  }

  _getString(len: number): string {
    const codes = new Array<number>(len);
    for (let i = 0; i < len; i++) {
      codes[i] = this._getVarInt();
    }
    return String.fromCharCode(...codes);
  }

  _getVarInt(): number {
    let value = 0;
    let shift = 0;
    for (;;) {
      const b = this._buffer.readUInt8(this._offset);
      this._offset++;
      value |= (b & 0x7f) << shift;
      if (0 === (b & 0x80)) {
        return value;
      }
      shift += 7;
    }
  }

  _getFlagVarInt(): number {
    let value = 0;
    let shift = 0;
    for (;;) {
      const b = this._buffer.readUInt8(this._flagOffset);
      this._flagOffset--;
      value |= (b & 0x7f) << shift;
      if (0 === (b & 0x80)) {
        return value;
      }
      shift += 7;
    }
  }
}
