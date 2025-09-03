import { parseTemplate } from '../src/parser/parseTemplate.js';
import { TemplateParser } from '../src/parser/TemplateParser.js';
import type { TemplateOptions } from '../src/types.js';

describe('parseTemplate with correct DOM order', () => {
  it('should create parser with empty options', () => {
    const parser = parseTemplate('<html><head></head><body></body></html>');
    expect(parser).toBeInstanceOf(TemplateParser);
  });

  it('should maintain correct DOM order for all elements in head and remove sorting attributes', () => {
    const htmlSource = '<html><head></head><body></body></html>';
    const options: TemplateOptions = {
      title: 'Test Page Title',
      favicon: {
        href: '/favicon.ico',
        rel: 'icon',
        attributes: { sizes: '32x32' },
      },
      headMetaTags: [
        '<meta name="description" content="Test description">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      ],
      headStyles: [
        {
          id: 'main-css',
          href: '/styles/main.css',
          position: 'beginning',
          order: 1,
        },
        {
          id: 'vendor-css',
          href: '/styles/vendor.css',
          position: 'end',
          order: 2,
        },
      ],
      headInlineStyles: [
        {
          id: 'critical-css',
          content: 'body { margin: 0; }',
          position: 'beginning',
          order: 0,
        },
      ],
      headScripts: [
        {
          id: 'vendor-js',
          src: '/scripts/vendor.js',
          position: 'end',
          order: 2,
        },
        {
          id: 'main-js',
          src: '/scripts/main.js',
          position: 'beginning',
          order: 1,
        },
      ],
      headInlineScripts: [
        {
          id: 'inline-js',
          content: 'console.log("Hello");',
          position: 'end',
          order: 3,
        },
      ],
    };

    const result = parseTemplate(htmlSource, options).serialize();

    // Extract head content for order validation
    const headMatch = result.match(/<head>([\s\S]*?)<\/head>/);
    expect(headMatch).toBeTruthy();

    const headContent = headMatch![1];

    // Check that all expected elements are present
    expect(headContent).toContain('<title>Test Page Title</title>');
    expect(headContent).toContain(
      '<link rel="icon" href="/favicon.ico" sizes="32x32">'
    );
    expect(headContent).toContain(
      '<meta name="description" content="Test description">'
    );
    expect(headContent).toContain(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    );
    expect(headContent).toContain(
      '<link rel="stylesheet" href="/styles/main.css" id="main-css">'
    );
    expect(headContent).toContain(
      '<link rel="stylesheet" href="/styles/vendor.css" id="vendor-css">'
    );
    expect(headContent).toContain(
      '<style id="critical-css">body { margin: 0; }</style>'
    );
    expect(headContent).toContain(
      '<script id="main-js" src="/scripts/main.js"></script>'
    );
    expect(headContent).toContain(
      '<script id="vendor-js" src="/scripts/vendor.js"></script>'
    );
    expect(headContent).toContain(
      '<script id="inline-js">console.log("Hello");</script>'
    );

    // Check that sorting attributes are NOT present in final output
    expect(headContent).not.toContain('data-order');
    expect(headContent).not.toContain('data-position');

    // Verify order: critical-css should come before main-css, and main-js should come before vendor-js
    const criticalCssIndex = headContent.indexOf('id="critical-css"');
    const mainCssIndex = headContent.indexOf('id="main-css"');
    const mainJsIndex = headContent.indexOf('id="main-js"');
    const vendorJsIndex = headContent.indexOf('id="vendor-js"');

    expect(criticalCssIndex).toBeLessThan(mainCssIndex);
    expect(mainJsIndex).toBeLessThan(vendorJsIndex);
  });
});
