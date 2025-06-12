import { parseDocument } from '../../src/utils/parseDocument.js';

describe('parseDocument', () => {
  it('should parse valid HTML document', () => {
    const html =
      '<html><head><meta charset="utf-8"></head><body></body></html>';
    const result = parseDocument(html);

    expect(result.document).toBeDefined();
    expect(result.html.nodeName).toBe('html');
    expect(result.head.nodeName).toBe('head');
    expect(result.body.nodeName).toBe('body');
    expect(result.head.childNodes.length).toBe(1);
  });

  it('should not throw error if head tag is missing', () => {
    const html = '<html><body></body></html>';
    const result = parseDocument(html);
    expect(result.head.childNodes.length).toBe(0);
    expect(result.body.childNodes.length).toBe(0);
  });

  it('should not throw error if body tag is missing', () => {
    const html = '<html><head></head></html>';
    const result = parseDocument(html);

    expect(result.head.childNodes.length).toBe(0);
    expect(result.body.childNodes.length).toBe(0);
  });
});
