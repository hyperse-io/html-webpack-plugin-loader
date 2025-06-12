import { type DefaultTreeAdapterTypes } from 'parse5';
import { upsertHeadInlineScripts } from '../../src/parser/upsertHeadInlineScripts.js';
import { parseDocument } from '../../src/utils/parseDocument.js';

describe('upsertHeadInlineScripts', () => {
  it('should add new inline scripts to head', () => {
    const { head } = parseDocument('<head></head>');
    const scripts = ['console.log("test1")', 'console.log("test2")'];

    upsertHeadInlineScripts(head, scripts);

    expect(head.childNodes).toHaveLength(2);
    expect(
      (head.childNodes[0] as DefaultTreeAdapterTypes.Element).nodeName
    ).toBe('script');
    expect(
      (
        (head.childNodes[0] as DefaultTreeAdapterTypes.Element)
          .childNodes[0] as DefaultTreeAdapterTypes.TextNode
      ).value
    ).toBe('console.log("test1")');
    expect(
      (head.childNodes[1] as DefaultTreeAdapterTypes.Element).nodeName
    ).toBe('script');
    expect(
      (
        (head.childNodes[1] as DefaultTreeAdapterTypes.Element)
          .childNodes[0] as DefaultTreeAdapterTypes.TextNode
      ).value
    ).toBe('console.log("test2")');
  });

  it('should replace existing scripts with matching content', () => {
    const { head } = parseDocument(
      '<head><script>console.log("test1")</script></head>'
    );
    const scripts = ['console.log("test1")', 'console.log("test2")'];

    upsertHeadInlineScripts(head, scripts);

    expect(head.childNodes).toHaveLength(2);
    expect(
      (head.childNodes[0] as DefaultTreeAdapterTypes.Element).nodeName
    ).toBe('script');
    expect(
      (
        (head.childNodes[0] as DefaultTreeAdapterTypes.Element)
          .childNodes[0] as DefaultTreeAdapterTypes.TextNode
      ).value
    ).toBe('console.log("test1")');
    expect(
      (head.childNodes[1] as DefaultTreeAdapterTypes.Element).nodeName
    ).toBe('script');
    expect(
      (
        (head.childNodes[1] as DefaultTreeAdapterTypes.Element)
          .childNodes[0] as DefaultTreeAdapterTypes.TextNode
      ).value
    ).toBe('console.log("test2")');
  });
});
