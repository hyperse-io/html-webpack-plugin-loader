import type { DefaultTreeAdapterTypes } from 'parse5';
import { upsertFavicon } from '../../src/parser/upsertFavicon.js';
import { parseDocument } from '../../src/utils/parseDocument.js';

describe('upsertFavicon', () => {
  it('should add favicon link when none exists', () => {
    const { head } = parseDocument('<head></head>');

    upsertFavicon(head, '/favicon.ico');

    const linkNode = head.childNodes[0] as DefaultTreeAdapterTypes.Element;
    expect(linkNode.nodeName).toBe('link');
    expect(linkNode.attrs).toEqual([
      { name: 'rel', value: 'icon' },
      { name: 'href', value: '/favicon.ico' },
    ]);
  });

  it('should replace existing favicon link', () => {
    const { head } = parseDocument(
      '<head><link rel="icon" href="/old-favicon.ico"></head>'
    );

    upsertFavicon(head, '/new-favicon.ico');

    expect(head.childNodes).toHaveLength(1);
    const linkNode = head.childNodes[0] as DefaultTreeAdapterTypes.Element;
    expect(linkNode.attrs).toEqual([
      { name: 'rel', value: 'icon' },
      { name: 'href', value: '/new-favicon.ico' },
    ]);
  });

  it('should add custom rel and attributes', () => {
    const { head } = parseDocument('<head></head>');

    upsertFavicon(head, '/favicon.png', 'apple-touch-icon', {
      sizes: '180x180',
      type: 'image/png',
    });

    const linkNode = head.childNodes[0] as DefaultTreeAdapterTypes.Element;
    expect(linkNode.attrs).toEqual([
      { name: 'rel', value: 'apple-touch-icon' },
      { name: 'href', value: '/favicon.png' },
      { name: 'sizes', value: '180x180' },
      { name: 'type', value: 'image/png' },
    ]);
  });

  it('should handle shortcut icon rel attribute', () => {
    const { head } = parseDocument('<head></head>');

    upsertFavicon(head, '/favicon.ico', 'shortcut icon');

    const linkNode = head.childNodes[0] as DefaultTreeAdapterTypes.Element;
    expect(linkNode.attrs).toEqual([
      { name: 'rel', value: 'shortcut icon' },
      { name: 'href', value: '/favicon.ico' },
    ]);
  });

  it('should handle multiple favicons with same href but different rel', () => {
    const { head } = parseDocument('<head></head>');

    upsertFavicon(head, '/favicon.ico', 'icon');
    upsertFavicon(head, '/favicon.ico', 'shortcut icon');

    expect(head.childNodes).toHaveLength(2);

    const shortcutIconNode = head
      .childNodes[0] as DefaultTreeAdapterTypes.Element;
    expect(shortcutIconNode.attrs).toEqual([
      { name: 'rel', value: 'shortcut icon' },
      { name: 'href', value: '/favicon.ico' },
    ]);

    const iconNode = head.childNodes[1] as DefaultTreeAdapterTypes.Element;
    expect(iconNode.attrs).toEqual([
      { name: 'rel', value: 'icon' },
      { name: 'href', value: '/favicon.ico' },
    ]);
  });
});
