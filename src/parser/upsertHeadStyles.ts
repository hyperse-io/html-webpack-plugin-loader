import { type DefaultTreeAdapterTypes, parseFragment } from 'parse5';
import type { StyleItem } from '../types.js';

/**
 * Upsert the head styles
 * @param head - The head element
 * @param styles - The styles to upsert (hrefs)
 */
export const upsertHeadStyles = (
  head: DefaultTreeAdapterTypes.Element,
  styles: StyleItem[]
) => {
  // Sort styles by order (smaller numbers first)
  const sortedStyles = [...styles].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  // Remove existing stylesheet links with matching hrefs
  sortedStyles.forEach((style) => {
    const existingStyleIndex = head.childNodes.findIndex(
      (node) =>
        node.nodeName === 'link' &&
        (node as DefaultTreeAdapterTypes.Element).attrs?.find(
          (attr) => attr.name === 'rel' && attr.value === 'stylesheet'
        ) &&
        (node as DefaultTreeAdapterTypes.Element).attrs?.find(
          (attr) => attr.name === 'id' && attr.value === style.id
        )
    );

    if (existingStyleIndex > -1) {
      head.childNodes.splice(existingStyleIndex, 1);
    }
  });

  // Create new style nodes
  const styleTags = sortedStyles.map((style) => {
    const styleNode = parseFragment(
      `<link rel="stylesheet" href="${style.href}" id="${style.id}" data-order="${style.order}" data-position="${style.position}"></link>`
    ).childNodes[0] as DefaultTreeAdapterTypes.Element;

    return styleNode;
  });

  // Split styles by position
  const beginningStyles = sortedStyles.reduce<
    DefaultTreeAdapterTypes.Element[]
  >((acc, style, index) => {
    if (style.position === 'beginning') {
      acc.push(styleTags[index]);
    }
    return acc;
  }, []);

  const endStyles = sortedStyles.reduce<DefaultTreeAdapterTypes.Element[]>(
    (acc, style, index) => {
      if (style.position === 'end') {
        acc.push(styleTags[index]);
      }
      return acc;
    },
    []
  );

  // Add beginning styles
  beginningStyles.reverse().forEach((styleNode) => {
    head.childNodes.unshift(styleNode);
  });

  // Add end styles
  endStyles.forEach((styleNode) => {
    head.childNodes.push(styleNode);
  });
};
