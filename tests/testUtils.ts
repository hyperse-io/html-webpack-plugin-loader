import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Configuration } from 'webpack';
import { webpack } from 'webpack';

export const getDirname = (url: string, ...paths: string[]) => {
  return join(dirname(fileURLToPath(url)), ...paths);
};

export const testWebpackPlugin = (
  webpackConfig: Configuration,
  htmlDist: string
) => {
  return new Promise<string>((resolve, reject) => {
    webpack(
      {
        ...webpackConfig,
        mode: 'development',
        optimization: {
          minimize: false,
        },
        stats: 'verbose',
      },
      (err, _stats) => {
        if (err) {
          reject(err);
          return;
        }
        const html = readFileSync(join(htmlDist, 'index.html'), 'utf-8');
        resolve(html);
      }
    );
  });
};
