import fs from "fs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
// import replace from "@rollup/plugin-replace";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { dts } from "rollup-plugin-dts";

const pkg = JSON.parse(await fs.promises.readFile("./package.json"));
const version = pkg.version;

fs.rmSync("dist", { recursive: true, force: true });

const strProduct = "Dynamsoft Mobile Web Capture JS Edition Bundle";

const terser_format = {
  // this func is run by eval in worker, so can't use variable outside
  comments: function (node, comment) {
    const text = comment.value;
    const type = comment.type;
    if (type == "comment2") {
      // multiline comment
      const strProduct = "Dynamsoft Mobile Web Capture JS Edition Bundle";
      const regDyComment = new RegExp(String.raw`@product\s${strProduct}`, "i");
      return regDyComment.test(text);
    }
  },
};

const banner = `/*!
* Dynamsoft Mobile Web Capture JavaScript Library
* @product ${strProduct}
* @website http://www.dynamsoft.com
* @copyright Copyright ${new Date().getUTCFullYear()}, Dynamsoft Corporation
* @author Dynamsoft
* @version ${version}
* @fileoverview Dynamsoft Mobile Web Capture (MWC) is an advanced sample designed to extend the features of Dynamsoft Mobile Document Scanner (MDS) with multi-document management, annotation, and uploading.
* More info on MWC: https://www.dynamsoft.com/mobile-document-scanner/docs/web/code-gallery/mobile-web-capture/index.html
*/`;

const plugin_terser_es6 = terser({ ecma: 6, format: terser_format });
const plugin_terser_es5 = terser({ ecma: 5, format: terser_format });

const external = [
  "dynamsoft-document-scanner",
  "dynamsoft-document-viewer",
];

const globals = {
  "dynamsoft-document-scanner": "Dynamsoft.DDS",
  "dynamsoft-document-viewer": "Dynamsoft",
};

export default [
  // 1. Full bundle
  {
    input: "src/mwc.bundle.ts",
    plugins: [
      nodeResolve({ browser: true }),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        sourceMap: false,
      }),
      plugin_terser_es5,
      {
        writeBundle(options, bundle) {
          let txt = fs
            .readFileSync("dist/mwc.bundle.js", { encoding: "utf8" })
            .replace(/Dynamsoft=\{\}/, "Dynamsoft=t.Dynamsoft||{}");
          fs.writeFileSync("dist/mwc.bundle.js", txt);
        },
      },
    ],
    output: [
      {
        file: "dist/mwc.bundle.js",
        format: "umd",
        name: "Dynamsoft",
        banner: banner,
        exports: "named",
        sourcemap: false,
      },
    ],
  },
  // 2. Standard UMD bundle
  {
    input: "src/mwc.ts",
    external,
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        sourceMap: false,
      }),
      plugin_terser_es5,
    ],
    output: [
      {
        file: "dist/mwc.js",
        format: "umd",
        name: "Dynamsoft",
        globals,
        banner: banner,
        exports: "named",
        sourcemap: false,
        extend: true,
      },
    ],
  },
  // 3. ESM bundle
  {
    input: "src/mwc.bundle.esm.ts",
    plugins: [
      nodeResolve({ browser: true }),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        sourceMap: false,
      }),
      plugin_terser_es6,
    ],
    output: [
      {
        file: "dist/mwc.bundle.mjs",
        format: "es",
        banner: banner,
        exports: "named",
        sourcemap: false,
      },
    ],
  },
  // 4. ESM with externals
  {
    input: "src/mwc.ts",
    external,
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        sourceMap: false,
      }),
      plugin_terser_es6,
    ],
    output: [
      {
        file: "dist/mwc.mjs",
        format: "es",
        banner: banner,
        exports: "named",
        sourcemap: false,
      },
    ],
  },
  // 5. No-content ESM
  {
    input: "src/mwc.no-content-bundle.esm.ts",
    external,
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        sourceMap: false,
      }),
      plugin_terser_es6,
    ],
    output: [
      {
        file: "dist/mwc.no-content-bundle.esm.js",
        format: "es",
        banner: banner,
        exports: "named",
        sourcemap: false,
      },
    ],
  },
  // 6. Type declarations for CommonJS/UMD
  {
    input: "src/mwc.ts",
    external,
    plugins: [
      dts(),
      {
        writeBundle(options, bundle) {
          let txt = fs.readFileSync("dist/mwc.d.ts", { encoding: "utf8" }).replace(/([{,]) type /g, "$1 ");
          fs.writeFileSync("dist/mwc.d.ts", txt);
        },
      },
    ],
    output: [
      {
        file: "dist/mwc.d.ts",
        format: "es",
      },
    ],
  },
  // 7. Type declarations for ESM
  {
    input: "dist/types/mwc.bundle.esm.d.ts",
    plugins: [
      dts(),
      {
        // https://rollupjs.org/guide/en/#writebundle
        writeBundle(options, bundle) {
          fs.rmSync("dist/types", { recursive: true, force: true });
          // change `export { type A }` to `export { A }`,
          // so project use old typescript still works.
          let txt = fs.readFileSync("dist/mwc.bundle.esm.d.ts", { encoding: "utf8" }).replace(/([{,]) type /g, "$1 ");
          fs.writeFileSync("dist/mwc.bundle.esm.d.ts", txt);
        },
      },
    ],
    output: [
      {
        file: "dist/mwc.bundle.esm.d.ts",
        format: "es",
      },
    ],
  },
];
