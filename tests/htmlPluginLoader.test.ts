import HtmlWebpackPlugin from 'html-webpack-plugin';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import type { TemplateOptions } from '../src/types.js';
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
              headMetaTags: [
                '<meta name="description" content="default description">',
              ],
              headStyles: [
                {
                  id: 'style1',
                  href: 'style1.css',
                  position: 'beginning',
                },
              ],
              headInlineStyles: [
                {
                  id: 'style1',
                  content: 'p {}',
                  position: 'beginning',
                },
              ],
              headScripts: [
                {
                  id: 'script1',
                  src: 'script1.js',
                  position: 'beginning',
                },
              ],
              headInlineScripts: [
                {
                  id: 'script2',
                  content: 'console.log("script2")',
                  position: 'end',
                },
              ],
              bodyScripts: [
                {
                  id: 'script3',
                  src: 'script3.js',
                  position: 'end',
                },
              ],
            } satisfies TemplateOptions,
          }),
        ],
      },
      fixtureDist
    );
    expect(result).toContain('<title>default title</title>');
    expect(result).toContain('<link rel="icon" href="default favicon">');
    expect(result).toContain(
      '<meta name="description" content="default description">'
    );
    expect(result).toContain('<style id="style1">p {}</style>');
    expect(result).toContain(
      '<link rel="stylesheet" href="style1.css" id="style1">'
    );
    expect(result).toContain('<script id="script1" src="script1.js"></script>');
    expect(result).toContain(
      '<script id="script2">console.log("script2")</script>'
    );
    expect(result).toContain('<script id="script3" src="script3.js"></script>');
  });
});
