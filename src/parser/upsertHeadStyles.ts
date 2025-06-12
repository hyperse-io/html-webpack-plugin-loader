import { type DefaultTreeAdapterTypes, parseFragment } from 'parse5';

/**
 * Upsert the head styles
 * @param head - The head element
 * @param styles - The styles to upsert (hrefs)
 */
export const upsertHeadStyles = (
  head: DefaultTreeAdapterTypes.Element,
  styles: string[]
) => {
  // Remove existing stylesheet links with matching hrefs
  styles.forEach((style) => {
    const existingStyleIndex = head.childNodes.findIndex(
      (node) =>
        node.nodeName === 'link' &&
        (node as DefaultTreeAdapterTypes.Element).attrs?.find(
          (attr) => attr.name === 'rel' && attr.value === 'stylesheet'
        ) &&
        (node as DefaultTreeAdapterTypes.Element).attrs?.find(
          (attr) => attr.name === 'href' && attr.value === style
        )
    );

    if (existingStyleIndex > -1) {
      head.childNodes.splice(existingStyleIndex, 1);
    }
  });

  // Add new stylesheet links
  styles.forEach((style) => {
    const linkNode = parseFragment(`<link rel="stylesheet" href="${style}">`)
      .childNodes[0] as DefaultTreeAdapterTypes.Element;

    head.childNodes.push(linkNode);
  });
};
