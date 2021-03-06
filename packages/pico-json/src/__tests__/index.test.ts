import * as pico from "..";

const simpleObj: Record<string, unknown> = {
  undefined_: undefined,
  null_: null,
  false_: false,
  true_: true,
  string_: "hellö 🤣😂😍",
  int_0: 0,
  int_1: 1,
  int_n1: -1,
  int_1000: 1000,
  int_n1000: -1000,
  int_1000000: 1000000,
  int_n1000000: -1000000,
  int_1000000000: 1000000000,
  int_n1000000000: -1000000000,
  someint: 1450725865, // failed once
  float_0: 0.5,
  float_1: 1.5,
  float_n1: -1.5,
  float_1000: 1000.5,
  float_n1000: -1000.5,
  // check that we don't mess up builtin property names
  constructor: "a",
  __proto__: "b",
  toString: "c",
  prototype: "d",
  defineProperty: "e",
};

// some more keys
for (let i = 0; i < 1000; i++) {
  simpleObj[i] = i;
}

test("Decoding encoded values should equal", () => {
  const testCases = [[], [1], [false], [false, true], simpleObj, Object.values(simpleObj), { a: simpleObj, b: simpleObj, arr: [simpleObj, simpleObj] }];

  for (const data of testCases) {
    expect(pico.decode(pico.encode(data))).toEqual(data);
  }
});

test("Huge array", () => {
  const data = [...new Int8Array(70000).map((_) => 99)];
  expect(pico.decode(pico.encode(data))).toEqual(data);
});

test("Unknown flag should throw Error", () => {
  const buf = Buffer.alloc(2);
  buf[0] = 1;
  buf[1] = 240;
  expect(() => pico.decode(buf)).toThrowError(`Unknown flag: 240`);
});

test("Function should throw Error", () => {
  expect(() =>
    pico.encode(() => {
      /**/
    }),
  ).toThrowError(`Unsupported object type: function`);
});
