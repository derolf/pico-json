# pico-json

Zero dependencies, small, fast, vanilla TypeScript object serializer with very compact binary format that is also quite compressible via lz4 and deflate.

## Design goals

- Vanilla TypeScript (no native code)
- Zero dependencies (except `Buffer` polyfill, see below)
- Small (<300 LOC)
- Compact binary format (usually beats `msgpack` and others[<sup>[1]</sup>](#f1))
- Fast encoding and decoding (competitive with `msgpack` and others[<sup>[1]</sup>](#f1))

<span id="f1">[1]</span>: Benchmarks can be found [here](https://github.com/derolf/pico-json/tree/master/packages/benchmark).

## How to use it

Please note that `pico-json` uses `Buffer` under the hood. So, if you want to use it in a browser environment, please provide an appropriate polyfill.

The `pico-json` package just exports two functions:

```TypeScript
function encode(obj: unknown): Buffer;
function decode(buf: Buffer): unknown;
```

To encode an object into a `Buffer`, do:

```TypeScript
import { encode } from "pico-json";

const obj = { 'foo': 'bar' };
const buf = encode(obj);
```

To decode an object from a `Buffer`, do:

```TypeScript
import { decode } from "pico-json";

const buf = ...;
const obj = decode(buf);
```

That's all.

## Supported types

Pretty much everything you can encode with `JSON.stringify` should be encodable with `pico-json`.

In detail, the following types are supported by `pico-json`:

- `boolean`
- `number` (double and ints)
- `string`
- `undefined`
- `null` value
- Arrays of supported types
- Objects with `string` keys and values of supported types

## Contribution

PRs welcome!
