import * as pico from "pico-json";
import fetch from "node-fetch";
import { hrtime } from "process";
import * as zlib from "zlib";
import * as msgpack from "@msgpack/msgpack";
import * as bson from "bson";
import * as lz4 from "lz4";

const urls = [
  { url: "https://raw.githubusercontent.com/airframesio/data/f4612c9d6387d54b13be62d3b95733a49b9555b4/json/noaa/tafs.json", count: 10 },
  { url: "https://raw.githubusercontent.com/sveltejs/svelte/master/package-lock.json", count: 10 },
  { url: "https://raw.githubusercontent.com/google-map-react/google-map-react-examples/master/public/places.json", count: 100 },
  { url: "https://jsonplaceholder.typicode.com/posts", count: 100 },
  { url: "https://jsonplaceholder.typicode.com/comments", count: 100 },
  { url: "https://jsonplaceholder.typicode.com/albums", count: 100 },
  { url: "https://jsonplaceholder.typicode.com/photos", count: 100 },
];

function measure(data: unknown, count: number, codec: Codec) {
  let encodeTime = 0;
  let decodeTime = 0;
  let length = 0;

  // warmup
  for (let i = 0; i < count; i++) {
    codec.decode(codec.encode(data));
  }

  // measure encode
  let buf: Buffer | undefined;
  let start = hrtime.bigint();
  for (let i = 0; i < count; i++) {
    buf = codec.encode(data);
  }
  encodeTime += Number(hrtime.bigint() - start) / count / 1000;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  buf = buf!;

  length += buf.length;

  // measure decode
  start = hrtime.bigint();
  for (let i = 0; i < count; i++) {
    codec.decode(buf);
  }
  decodeTime += Number(hrtime.bigint() - start) / count / 1000;

  return { name: codec.name, length, "encodeTime[µS]": encodeTime, "decodeTime[µS]": decodeTime };
}

type Codec = {
  name: string;
  encode: (d: unknown) => Buffer;
  decode: (buf: Buffer) => unknown;
};

const withDeflate = (codec: Codec) => ({
  name: `${codec.name} deflate`,
  encode: (d: unknown) => zlib.deflateSync(codec.encode(d)),
  decode: (buf: Buffer) => codec.decode(zlib.inflateSync(buf)),
});

const withLz4 = (codec: Codec) => ({
  name: `${codec.name} lz4`,
  encode: (d: unknown) => lz4.encode(codec.encode(d)),
  decode: (buf: Buffer) => codec.decode(lz4.decode(buf)),
});

const codecs: Codec[] = [
  { name: "pico-json", encode: pico.encode, decode: pico.decode },
  { name: "json", encode: (d) => Buffer.from(JSON.stringify(d)), decode: (buf) => JSON.parse(buf.toString()) },
  { name: "msgpack", encode: (d) => Buffer.from(msgpack.encode(d)), decode: (buf) => msgpack.decode(buf) },
  { name: "bson", encode: (d) => Buffer.from(bson.serialize(d)), decode: (buf) => bson.deserialize(buf) },
];

const deflateCodecs = codecs.map(withDeflate);
const lz4Codecs = codecs.map(withLz4);

function run(data: unknown, count: number, codecs: Codec[]) {
  const results = codecs.map((_) => measure(data, count, _));
  results.sort((a, b) => a.length - b.length);
  const maxes = results.reduce((a, b) => {
    const r = {} as typeof results[0];
    for (const k of Object.keys(a)) {
      r[k] = a[k] > b[k] ? a[k] : b[k];
    }
    return r;
  });
  const enriched = results.map((result) => {
    const r: Record<string, unknown> = {};
    for (const k of Object.keys(result)) {
      const v = result[k];
      if (typeof v !== "number") {
        r[k] = v;
        continue;
      }
      r[k] = Math.round(v);
      r[`% ${k}`] = Math.round((v * 100) / maxes[k]);
    }
    return r;
  });
  console.log(`| ${Object.keys(enriched[0]).join(" | ")} |`);
  console.log(
    `| ${Object.keys(enriched[0])
      .map(() => "---")
      .join(" | ")} |`,
  );
  for (const r of enriched) {
    console.log(`| ${Object.values(r).join(" | ")} |`);
  }
}

async function main() {
  console.log("# Benchmark");
  for (const { url, count } of urls) {
    console.log();
    console.log(`## ${url}`);
    console.log();
    console.log(`Averaging over ${count} repetitions`);
    console.log();

    const data = await (await fetch(url)).json();

    console.log("### Without compression");
    console.log();

    run(data, count, codecs);

    console.log();
    console.log("### With deflate");
    console.log();

    run(data, count, deflateCodecs);

    console.log();
    console.log("### With lz4");
    console.log();

    run(data, count, lz4Codecs);
  }
}

main();
