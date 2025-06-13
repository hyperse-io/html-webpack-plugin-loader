import { type RunLoaderOption, runLoaders } from 'loader-runner';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import webpack from 'webpack';

export const getDirname = (url: string, ...paths: string[]) => {
  return join(dirname(fileURLToPath(url)), ...paths);
};

export const testLoader = (options: RunLoaderOption) => {
  return new Promise((resolve, reject) => {
    runLoaders(options, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export const testWebpackPlugin = (webpackConfig: webpack.Configuration) => {
  return new Promise<webpack.Stats | undefined>((resolve, reject) => {
    webpack(
      {
        ...webpackConfig,
        mode: 'development',
        optimization: {
          minimize: false,
        },
      },
      (err, stats) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(stats);
      }
    );
  });
};
