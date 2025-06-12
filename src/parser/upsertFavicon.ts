import { type DefaultTreeAdapterTypes, parseFragment } from 'parse5';

/**
 * Upsert the favicon tag
 * @param head - The head element
 * @param favicon - The favicon to upsert
 * @param rel - The rel attribute value
 * @param attributes - The attributes to add to the link tag
 */
export const upsertFavicon = (
  head: DefaultTreeAdapterTypes.Element,
  favicon: string,
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
    `<link rel="${rel}" href="${favicon}" ${attributesString}>`
  ).childNodes[0] as DefaultTreeAdapterTypes.Element;

  head.childNodes.push(linkNode);
};
