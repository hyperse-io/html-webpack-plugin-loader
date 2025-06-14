import HtmlWebpackPlugin from 'html-webpack-plugin';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { getDirname, testWebpackPlugin } from './testUtils.js';

const fixtureCwd = getDirname(import.meta.url, './fixtures/loader');
const fixtureDist = join(fixtureCwd, 'dist');

describe('htmlPluginLoader', () => {
  beforeEach(() => {
    if (existsSync(fixtureDist)) {
      rmSync(fixtureDist, { recursive: true });
    }
  });

  it('should return the correct html with webpack loader', async () => {
    const loader = require.resolve(
      '@hyperse/html-webpack-plugin-loader/loader'
    );
    const result = await testWebpackPlugin(
      {
        entry: join(fixtureCwd, './index.js'),
        output: {
          path: fixtureDist,
          filename: 'index_bundle.js',
        },
        plugins: [
          new HtmlWebpackPlugin({
            inject: 'body',
            template: `${loader}!${join(fixtureCwd, '../index.html')}`,
            templateParameters: {
              title: 'default title',
              favicon: {
                href: 'default favicon',
                rel: 'icon',
                attributes: {},
              },
            },
          }),
        ],
      },
      fixtureDist
    );
    expect(result).toContain('<title>default title</title>');
    expect(result).toContain('<link rel="icon" href="default favicon">');
  });
});
