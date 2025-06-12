import type { DefaultTreeAdapterTypes } from 'parse5';
import { upsertHeadStyles } from '../../src/parser/upsertHeadStyles.js';
import { parseDocument } from '../../src/utils/parseDocument.js';

// Unit tests
describe('upsertHeadStyles', () => {
  it('should add stylesheet links when none exist', () => {
    const { head } = parseDocument('<head></head>');
    const styles = ['/style1.css', '/style2.css'];

    upsertHeadStyles(head, styles);

    expect(head.childNodes).toHaveLength(2);

    const link1 = head.childNodes[0] as DefaultTreeAdapterTypes.Element;
    expect(link1.nodeName).toBe('link');
    expect(link1.attrs).toEqual([
      { name: 'rel', value: 'stylesheet' },
      { name: 'href', value: '/style1.css' },
    ]);

    const link2 = head.childNodes[1] as DefaultTreeAdapterTypes.Element;
    expect(link2.attrs).toEqual([
      { name: 'rel', value: 'stylesheet' },
      { name: 'href', value: '/style2.css' },
    ]);
  });

  it('should replace existing stylesheet links', () => {
    const { head } = parseDocument(
      '<head><link rel="stylesheet" href="/old-style.css"></head>'
    );

    upsertHeadStyles(head, ['/old-style.css']);

    expect(head.childNodes).toHaveLength(1);
    const linkNode = head.childNodes[0] as DefaultTreeAdapterTypes.Element;
    expect(linkNode.attrs).toEqual([
      { name: 'rel', value: 'stylesheet' },
      { name: 'href', value: '/old-style.css' },
    ]);
  });

  it('should handle empty styles array', () => {
    const { head } = parseDocument('<head></head>');

    upsertHeadStyles(head, []);

    expect(head.childNodes).toHaveLength(0);
  });
});
