import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Format, InlineConfig } from 'tsdown';
import { build } from 'tsdown';

const getDirname = (url: string, subDir = '') => {
  return join(dirname(fileURLToPath(url)), subDir);
};

async function buildAll() {
  const deps: InlineConfig['deps'] = { neverBundle: ['webpack'] };
  const entries: Record<
    string,
    Omit<InlineConfig, 'entry'> & { entry: Record<string, string> }
  > = {
    'src/index.ts': {
      format: ['esm', 'cjs'] as Format[],
      entry: { index: 'src/index.ts' },
      dts: true,
      clean: true,
      deps,
      hash: false,
      outExtensions({ format }) {
        return {
          js: format === 'cjs' ? '.cjs' : '.js',
          dts: '.d.ts',
        };
      },
    },
    'src/loader/htmlLoader.ts': {
      format: ['cjs'] as Format[],
      entry: { 'loader/htmlLoader': 'src/loader/htmlLoader.ts' },
      dts: false,
      clean: false,
      deps,
      hash: false,
      outExtensions() {
        return {
          js: `.cjs`,
        };
      },
    },
  };

  for (const [, value] of Object.entries(entries)) {
    const { entry, ...rest } = value;
    await build({
      treeshake: true,
      tsconfig: getDirname(import.meta.url, '../tsconfig.build.json'),
      outDir: getDirname(import.meta.url, '../dist'),
      entry,
      ...rest,
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
