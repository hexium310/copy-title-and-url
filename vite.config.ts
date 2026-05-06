import path from "node:path";

import license from "rollup-plugin-license";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import zipPack from "vite-plugin-zip-pack";

import { name, version } from "./package.json";

const fixedEntryFileNames = [
  "src/background/index.ts",
];

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  return {
    resolve: {
      tsconfigPaths: true,
    },
    build: {
      rolldownOptions: {
        input: [
          "src/background/index.ts",
        ],
        output: {
          entryFileNames: (chunkInfo) => {
            const fixedEntryFileName = fixedEntryFileNames.find((v) => chunkInfo.facadeModuleId?.includes(v));
            const base = fixedEntryFileName ? path.basename(path.dirname(fixedEntryFileName)) : "[name]-[hash]";
            return `${base}.js`;
          },
        },
      },
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: "README.md",
            dest: ".",
          },
          {
            src: "LICENSE",
            dest: ".",
          },
          {
            src: "THIRD_PARTY/",
            dest: ".",
          },
        ],
      }),
      license({
        thirdParty: {
          output: {
            file: "dist/dependencies.txt",
          },
        },
      }),
      !isDevelopment && zipPack({
        outDir: "release",
        outFileName: `${name}-${version}.xpi`,
      }),
    ],
  };
});
