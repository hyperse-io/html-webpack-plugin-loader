import type { DefaultTreeAdapterTypes } from 'parse5';
import { upsertHeadStyles } from '../../src/parser/upsertHeadStyles.js';
import type { StyleItem } from '../../src/types.js';
import { parseDocument } from '../../src/utils/parseDocument.js';

// Unit tests
describe('upsertHeadStyles', () => {
  it('should add styles in correct order based on order property', () => {
    const { head } = parseDocument(
      '<head><link rel="stylesheet" href="/style1.css" id="style1"></link><link rel="stylesheet" href="/style2.css" id="style2"></link></head>'
    );
    const styles: StyleItem[] = [
      { href: '/style1.css', id: 'style1', position: 'end', order: 2 },
      { href: '/style2.css', id: 'style2', position: 'beginning', order: 1 },
      { href: '/style3.css', id: 'style3', position: 'end', order: 1 },
    ];
    upsertHeadStyles(head, styles);

    expect(head.childNodes).toHaveLength(3);

    const link1 = head.childNodes[0] as DefaultTreeAdapterTypes.Element;
    expect(link1.attrs).toEqual([
      { name: 'rel', value: 'stylesheet' },
      { name: 'href', value: '/style2.css' },
      { name: 'id', value: 'style2' },
      { name: 'data-order', value: '1' },
      { name: 'data-position', value: 'beginning' },
    ]);

    const link2 = head.childNodes[1] as DefaultTreeAdapterTypes.Element;
    expect(link2.attrs).toEqual([
      { name: 'rel', value: 'stylesheet' },
      { name: 'href', value: '/style3.css' },
      { name: 'id', value: 'style3' },
      { name: 'data-order', value: '1' },
      { name: 'data-position', value: 'end' },
    ]);

    const link3 = head.childNodes[2] as DefaultTreeAdapterTypes.Element;
    expect(link3.attrs).toEqual([
      { name: 'rel', value: 'stylesheet' },
      { name: 'href', value: '/style1.css' },
      { name: 'id', value: 'style1' },
      { name: 'data-order', value: '2' },
      { name: 'data-position', value: 'end' },
    ]);
  });

  it('should add stylesheet links when none exist', () => {
    const { head } = parseDocument('<head></head>');
    const styles: StyleItem[] = [
      { href: '/style1.css', id: 'style1', position: 'beginning', order: 1 },
      { href: '/style2.css', id: 'style2', position: 'end', order: 1 },
    ];

    upsertHeadStyles(head, styles);

    expect(head.childNodes).toHaveLength(2);

    const link1 = head.childNodes[0] as DefaultTreeAdapterTypes.Element;
    expect(link1.nodeName).toBe('link');
    expect(link1.attrs).toEqual([
      { name: 'rel', value: 'stylesheet' },
      { name: 'href', value: '/style1.css' },
      { name: 'id', value: 'style1' },
      { name: 'data-order', value: '1' },
      { name: 'data-position', value: 'beginning' },
    ]);

    const link2 = head.childNodes[1] as DefaultTreeAdapterTypes.Element;
    expect(link2.attrs).toEqual([
      { name: 'rel', value: 'stylesheet' },
      { name: 'href', value: '/style2.css' },
      { name: 'id', value: 'style2' },
      { name: 'data-order', value: '1' },
      { name: 'data-position', value: 'end' },
    ]);
  });

  it('should replace existing stylesheet links', () => {
    const { head } = parseDocument(
      '<head><link rel="stylesheet" href="/old-style.css" id="old-style"></head>'
    );

    upsertHeadStyles(head, [
      {
        href: '/old-style.css',
        id: 'old-style',
        position: 'beginning',
        order: 1,
      },
    ]);

    expect(head.childNodes).toHaveLength(1);
    const linkNode = head.childNodes[0] as DefaultTreeAdapterTypes.Element;
    expect(linkNode.attrs).toEqual([
      { name: 'rel', value: 'stylesheet' },
      { name: 'href', value: '/old-style.css' },
      { name: 'id', value: 'old-style' },
      { name: 'data-order', value: '1' },
      { name: 'data-position', value: 'beginning' },
    ]);
  });

  it('should handle empty styles array', () => {
    const { head } = parseDocument('<head></head>');

    upsertHeadStyles(head, []);

    expect(head.childNodes).toHaveLength(0);
  });
});
