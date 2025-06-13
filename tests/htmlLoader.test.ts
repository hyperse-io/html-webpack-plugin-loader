import fs from 'fs';
import { describe, expect, it } from 'vitest';
import { getDirname, testLoader } from './testUtils.js';

describe('htmlLoader', () => {
  it('should return the correct html', async () => {
    const result = await testLoader({
      resource: getDirname(import.meta.url, './fixtures/index.html'),
      loaders: [getDirname(import.meta.url, '../dist/loader/htmlLoader.cjs')],
      context: {
        loaderOptions: {
          /* options */
        },
      },
      readResource: fs.readFile.bind(fs),
    });
    expect(result).toBe(true);
  });
});
