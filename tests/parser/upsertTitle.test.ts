import type { DefaultTreeAdapterTypes } from 'parse5';
import { upsertTitle } from '../../src/parser/upsertTitle.js';
import { parseDocument } from '../../src/utils/parseDocument.js';

describe('upsertTitle', () => {
  it('should update existing title tag', () => {
    const { head } = parseDocument('<head><title>Old Title</title></head>');

    upsertTitle(head, 'New Title');

    const titleNode = head.childNodes[0] as DefaultTreeAdapterTypes.Element;
    const textNode = titleNode
      .childNodes[0] as DefaultTreeAdapterTypes.TextNode;

    expect(titleNode.nodeName).toBe('title');
    expect(textNode.value).toBe('New Title');
  });

  it('should create new title tag if none exists', () => {
    const { head } = parseDocument('<head></head>');

    upsertTitle(head, 'New Title');

    const titleNode = head.childNodes[0] as DefaultTreeAdapterTypes.Element;
    const textNode = titleNode
      .childNodes[0] as DefaultTreeAdapterTypes.TextNode;

    expect(titleNode.nodeName).toBe('title');
    expect(textNode.value).toBe('New Title');
  });
});
