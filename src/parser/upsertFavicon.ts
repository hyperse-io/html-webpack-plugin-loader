import { type DefaultTreeAdapterTypes, parseFragment } from 'parse5';

/**
 * Upserts a favicon link tag into the head element. The tag is inserted after the last meta tag,
 * or at the beginning of head if no meta tags exist. If a link tag with the same rel attribute
 * already exists, it will be replaced.
 * @param head - The head element
 * @param favicon - The favicon to upsert
 * @param rel - The rel attribute value
 * @param attributes - The attributes to add to the link tag
 */
export const upsertFavicon = (
  head: DefaultTreeAdapterTypes.Element,
  href: string,
  rel: string = 'icon',
  attributes: Record<string, string> = {}
) => {
  // Remove existing link with same rel if exists
  const existingLinkIndex = head.childNodes.findIndex(
    (node) =>
      node.nodeName === 'link' &&
      (node as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'rel' && attr.value === rel
      )
  );

  if (existingLinkIndex > -1) {
    head.childNodes.splice(existingLinkIndex, 1);
  }

  // Build attributes string
  const attributesString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  const linkNode = parseFragment(
    `<link rel="${rel}" href="${href}" ${attributesString}>`
  ).childNodes[0] as DefaultTreeAdapterTypes.Element;

  let lastMetaIndex = -1;

  // Find the last meta tag position
  for (let i = 0; i < head.childNodes.length; i++) {
    if (head.childNodes[i].nodeName === 'meta') {
      lastMetaIndex = i;
    }
  }

  const insertIndex = lastMetaIndex >= 0 ? lastMetaIndex + 1 : 0;

  // Insert at the found position
  head.childNodes.splice(insertIndex, 0, linkNode);
};
