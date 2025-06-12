import { type RunLoaderOption, runLoaders } from 'loader-runner';

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
