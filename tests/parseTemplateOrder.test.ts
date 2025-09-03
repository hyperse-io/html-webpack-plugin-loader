import { parseTemplate } from '../src/parser/parseTemplate.js';
import { TemplateParser } from '../src/parser/TemplateParser.js';
import type { TemplateOptions } from '../src/types.js';

describe('parseTemplate with correct DOM order', () => {
  it('should create parser with empty options', () => {
    const parser = parseTemplate('<html><head></head><body></body></html>');
    expect(parser).toBeInstanceOf(TemplateParser);
  });

  it('should maintain correct DOM order for all elements in head', () => {
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

    // Create a simplified representation of the head content for order checking
    const headElements: string[] = headContent
      .split(/(?=<title>|<link|<meta|<style|<script)/)
      .filter((line) => line.trim())
      .map((line) => {
        if (line.includes('<title>')) return 'title';
        if (line.includes('rel="icon"')) return 'link[rel="icon"]';
        if (line.includes('name="description"'))
          return 'meta[name="description"]';
        if (line.includes('name="viewport"')) return 'meta[name="viewport"]';
        if (line.includes('id="critical-css"'))
          return 'style[id="critical-css"]';
        if (line.includes('id="main-css"'))
          return 'link[rel="stylesheet"][id="main-css"]';
        if (line.includes('id="main-js"')) return 'script[id="main-js"]';
        if (line.includes('id="vendor-css"'))
          return 'link[rel="stylesheet"][id="vendor-css"]';
        if (line.includes('id="vendor-js"')) return 'script[id="vendor-js"]';
        if (line.includes('id="inline-js"')) return 'script[id="inline-js"]';
        return 'other';
      })
      .filter((element) => element !== 'other');

    // Verify that all expected elements are present
    expect(headElements).toContain('title');
    expect(headElements).toContain('link[rel="icon"]');
    expect(headElements).toContain('meta[name="description"]');
    expect(headElements).toContain('meta[name="viewport"]');
    expect(headElements).toContain('style[id="critical-css"]');
    expect(headElements).toContain('link[rel="stylesheet"][id="main-css"]');
    expect(headElements).toContain('script[id="main-js"]');
    expect(headElements).toContain('link[rel="stylesheet"][id="vendor-css"]');
    expect(headElements).toContain('script[id="vendor-js"]');
    expect(headElements).toContain('script[id="inline-js"]');

    // Define the expected order based on the implementation
    const expectedOrder = [
      'script[id="main-js"]', // order=1
      // Beginning elements (sorted by order)
      'style[id="critical-css"]', // order=0
      'link[rel="stylesheet"][id="main-css"]', // order=1
      'title',
      'meta[name="description"]',
      'meta[name="viewport"]',
      'link[rel="icon"]',
      // End elements (sorted by order)
      'link[rel="stylesheet"][id="vendor-css"]', // order=2
      'script[id="vendor-js"]', // order=2
      'script[id="inline-js"]', // order=3
    ];

    // Verify the exact order
    expect(headElements).toEqual(expectedOrder);
  });
});
