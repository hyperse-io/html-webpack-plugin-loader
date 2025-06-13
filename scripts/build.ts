import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Format, Options } from 'tsup';
import { build } from 'tsup';

const getDirname = (url: string, subDir = '') => {
  return join(dirname(fileURLToPath(url)), subDir);
};

async function buildAll() {
  const externals = ['webpack'];
  const entries: Record<string, Omit<Options, 'entry'> & { entry: string }> = {
    'src/index.ts': {
      format: ['esm'],
      entry: 'index',
      dts: true,
      clean: true,
      external: externals,
      outExtension: undefined,
    },
    'src/loader/htmlLoader.ts': {
      format: ['cjs'],
      entry: 'loader/htmlLoader',
      dts: false,
      clean: false,
      external: externals,
      outExtension() {
        return {
          js: `.cjs`,
        };
      },
    },
  };

  for (const [key, value] of Object.entries(entries)) {
    const { format, entry, dts, clean, outExtension } = value;
    await build({
      splitting: false,
      treeshake: true,
      tsconfig: getDirname(import.meta.url, '../tsconfig.build.json'),
      entry: {
        [entry]: key,
      },
      dts,
      clean,
      outExtension,
      format: format as Format[],
    });
  }
}
(async () => {
  const dist = getDirname(import.meta.url, '../dist');
  if (existsSync(dist)) {
    await rm(dist, {
      recursive: true,
    });
  }
  await buildAll();
})();
