import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import pkg from "../package.json" with { type: "json" };
import manifest from "../public/manifest.json" with { type: "json" };

type Json = Record<string, unknown>;

interface Target {
  data: Json;
  output: string;
}

const buildManifest = (version: string): Json => {
  const newManifest = { ...manifest, version };

  return newManifest;
};

const buildUpdates = (id: string, version: string): Json => {
  const updates = {
    addons: {
      [id]: {
        updates: [
          {
            version,
            update_link: `https://github.com/hexium310/copy-title-and-url/releases/download/${version}/copy-title-and-url-${version}.xpi`,
          },
        ],
      },
    },
  };

  return updates;
};

const writeFiles = async (targets: Target[]): Promise<void> => {
  await Promise.all(targets.map(({ data, output }) => {
    return writeFile(output, JSON.stringify(data, null, 2).concat("\n"))
      .then(() => {
        console.log(`${output} was updated.`);
      })
      .catch((reason: unknown) => {
        console.error(`faield to write ${output}:`, reason);
      });
  }));
};

const { version } = pkg;
const { id } = manifest.browser_specific_settings.gecko;

const targets = [
  {
    data: buildManifest(version),
    output: fileURLToPath(new URL("../public/manifest.json", import.meta.url)),
  },
  {
    data: buildUpdates(id, version),
    output: fileURLToPath(new URL("../updates.json", import.meta.url)),
  },
] satisfies Target[];

await writeFiles(targets);
