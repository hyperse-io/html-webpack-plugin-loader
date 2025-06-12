import { type DefaultTreeAdapterTypes } from 'parse5';
import { upsertHeadMetaTags } from '../../src/parser/upsertHeadMetaTags.js';
import { parseDocument } from '../../src/utils/parseDocument.js';

describe('upsertHeadMetaTags', () => {
  it('should add new tags to head', () => {
    const { head } = parseDocument('<head></head>');

    const tags = ['<meta name="description" content="test">'];

    upsertHeadMetaTags(head, tags);

    expect(head.childNodes).toHaveLength(1);
    expect(head.childNodes[0].nodeName).toBe('meta');
    expect(
      (head.childNodes[0] as DefaultTreeAdapterTypes.Element).attrs
    ).toEqual([
      { name: 'name', value: 'description' },
      { name: 'content', value: 'test' },
    ]);
  });

  it('should replace existing tags with matching attributes', () => {
    const { head } = parseDocument(
      '<head><meta name="description" content="old"></head>'
    );

    const tags = ['<meta name="description" content="new">'];

    upsertHeadMetaTags(head, tags);

    expect(head.childNodes).toHaveLength(1);
    expect(
      (head.childNodes[0] as DefaultTreeAdapterTypes.Element).attrs
    ).toEqual([
      { name: 'name', value: 'description' },
      { name: 'content', value: 'new' },
    ]);
  });

  it('should not replace tags with different attributes', () => {
    const { head } = parseDocument(
      '<head><meta name="keywords" content="test"></head>'
    );

    const tags = ['<meta name="description" content="test">'];

    upsertHeadMetaTags(head, tags);

    expect(head.childNodes).toHaveLength(2);
  });
});
