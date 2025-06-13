import HtmlWebpackPlugin from 'html-webpack-plugin';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'vitest';
import { getDirname, testWebpackPlugin } from './testUtils.js';

const fixtureCwd = getDirname(import.meta.url, './fixtures/basic');
const fixtureDist = join(fixtureCwd, 'dist');

describe('htmlPluginBasic', () => {
  beforeEach(() => {
    if (existsSync(fixtureDist)) {
      rmSync(fixtureDist, { recursive: true });
    }
  });

  it('should return the correct html', async () => {
    const result = await testWebpackPlugin({
      entry: join(fixtureCwd, './index.js'),
      output: {
        path: fixtureDist,
        filename: 'index_bundle.js',
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: join(fixtureCwd, '../index.html'),
        }),
      ],
    });
    expect(result).toBe(true);
  });
});
