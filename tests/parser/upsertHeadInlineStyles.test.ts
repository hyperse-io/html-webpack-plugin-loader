import type { DefaultTreeAdapterTypes } from 'parse5';
import { upsertHeadInlineStyles } from '../../src/parser/upsertHeadInlineStyles.js';
import type { StyleInlineItem } from '../../src/types.js';
import { parseDocument } from '../../src/utils/parseDocument.js';

// Unit tests
describe('upsertHeadInlineStyles', () => {
  let head: DefaultTreeAdapterTypes.Element;

  beforeEach(() => {
    const { head: headElement } = parseDocument(
      '<head><style id="existing-style">body { color: red; }</style></head>'
    );
    head = headElement;
  });

  it('should add inline styles in correct order based on order property', () => {
    const styles: StyleInlineItem[] = [
      { id: 'style2', content: 'h2 {}', position: 'end', order: 2 },
      { id: 'style1', content: 'h1 {}', position: 'end', order: 1 },
    ];

    upsertHeadInlineStyles(head, styles);

    expect(head.childNodes.length).toBe(3);
    expect(
      (head.childNodes[1] as DefaultTreeAdapterTypes.Element).attrs
    ).toContainEqual({ name: 'id', value: 'style1' });
    expect(
      (head.childNodes[2] as DefaultTreeAdapterTypes.Element).attrs
    ).toContainEqual({ name: 'id', value: 'style2' });
  });

  it('should add styles at beginning and end correctly', () => {
    const styles: StyleInlineItem[] = [
      { id: 'end-style', content: 'p {}', position: 'end' },
      { id: 'beginning-style', content: 'div {}', position: 'beginning' },
    ];

    upsertHeadInlineStyles(head, styles);

    expect(
      (head.childNodes[0] as DefaultTreeAdapterTypes.Element).attrs
    ).toContainEqual({ name: 'id', value: 'beginning-style' });
    expect(
      (head.childNodes[2] as DefaultTreeAdapterTypes.Element).attrs
    ).toContainEqual({ name: 'id', value: 'end-style' });
  });

  it('should remove existing styles with matching ids', () => {
    const styles: StyleInlineItem[] = [
      { id: 'existing-style', content: 'new-style {}', position: 'end' },
    ];

    upsertHeadInlineStyles(head, styles);

    expect(head.childNodes.length).toBe(1);
    const styleNode = head.childNodes[0] as DefaultTreeAdapterTypes.Element;
    expect(styleNode.attrs).toContainEqual({
      name: 'id',
      value: 'existing-style',
    });
    expect(
      (styleNode.childNodes[0] as DefaultTreeAdapterTypes.TextNode).value
    ).toBe('new-style {}');
  });

  it('should handle empty styles array', () => {
    upsertHeadInlineStyles(head, []);
    expect(head.childNodes.length).toBe(1);
  });
});
