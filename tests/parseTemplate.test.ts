import { parseTemplate } from '../src/parser/parseTemplate.js';
import { TemplateParser } from '../src/parser/TemplateParser.js';
import type { StyleInlineItem, StyleItem } from '../src/types.js';
import type { ScriptItem } from '../src/types.js';
import type { ScriptInlineItem } from '../src/types.js';

describe('parseTemplate', () => {
  it('should create parser with empty options', () => {
    const parser = parseTemplate('<html><head></head><body></body></html>');
    expect(parser).toBeInstanceOf(TemplateParser);
  });

  it('should update title when provided', () => {
    const parser = parseTemplate('<html><head></head></html>', {
      title: 'Test Title',
    })
      .upsertTitleTag('Test Title')
      .upsertTitleTag('Test Title 2');
    const result = parser.serialize();
    expect(result).toContain('<title>Test Title 2</title>');
  });

  it('should corrent upsert body script by order', () => {
    const parser = parseTemplate('<html><body></body></html>', {
      bodyScripts: [
        { id: 'script1', src: 'script1.js', position: 'beginning', order: 1 },
        { id: 'script2', src: 'script2.js', position: 'beginning', order: 2 },
      ],
    });
    const result = parser
      .upsertBodyScripts([
        { id: 'script2', src: 'script2.js', position: 'beginning', order: 2 },
      ])
      .upsertBodyScripts([
        { id: 'script2', src: 'script2.js', position: 'beginning', order: 2 },
      ])
      .serialize();
    expect(result).toContain('<script id="script1" src="script1.js"></script>');
    expect(result).toContain('<script id="script2" src="script2.js"></script>');
  });

  it('should update favicon when provided', () => {
    const parser = parseTemplate('<html><head></head></html>', {
      favicon: {
        href: '/favicon.ico',
        rel: 'icon',
        attributes: {
          sizes: '32x32',
        },
      },
    });
    expect(parser.serialize()).toContain(
      '<link rel="icon" href="/favicon.ico" sizes="32x32">'
    );
  });

  it('should update meta tags when provided', () => {
    const metaTags = ['<meta name="description" content="Test">'];
    const parser = parseTemplate('<html><head></head></html>', {
      headMetaTags: metaTags,
    });
    expect(parser.serialize()).toContain(
      '<meta name="description" content="Test">'
    );
  });

  it('should update head styles when provided', () => {
    const styles: StyleItem[] = [
      {
        href: 'style.css',
        id: 'style1',
        position: 'beginning',
      },
    ];
    const parser = parseTemplate('<html><head></head></html>', {
      headStyles: styles,
    });
    expect(parser.serialize()).toContain(
      '<link rel="stylesheet" href="style.css" id="style1">'
    );
  });

  it('should update inline styles when provided', () => {
    const inlineStyles: StyleInlineItem[] = [
      {
        content: 'body {}',
        id: 'style1',
        position: 'beginning',
      },
    ];
    const parser = parseTemplate('<html><head></head></html>', {
      headInlineStyles: inlineStyles,
    });
    expect(parser.serialize()).toContain('<style id="style1">body {}</style>');
  });

  it('should update head scripts when provided', () => {
    const scripts: ScriptItem[] = [
      {
        src: 'script.js',
        id: 'script1',
        position: 'beginning',
      },
    ];
    const parser = parseTemplate('<html><head></head></html>', {
      headScripts: scripts,
    });
    expect(parser.serialize()).toContain(
      '<script id="script1" src="script.js"></script>'
    );
  });

  it('should update head inline scripts when provided', () => {
    const inlineScripts: ScriptInlineItem[] = [
      {
        content: 'console.log()',
        id: 'script1',
        position: 'beginning',
      },
    ];
    const parser = parseTemplate('<html><head></head></html>', {
      headInlineScripts: inlineScripts,
    });
    expect(parser.serialize()).toContain(
      '<script id="script1">console.log()</script>'
    );
  });

  it('should update body scripts when provided', () => {
    const bodyScripts: ScriptItem[] = [
      {
        src: 'script.js',
        id: 'script1',
        position: 'beginning',
      },
    ];
    const parser = parseTemplate('<html><head></head><body></body></html>', {
      bodyScripts: bodyScripts,
    });
    expect(parser.serialize()).toContain(
      '<script id="script1" src="script.js"></script>'
    );
  });
});
