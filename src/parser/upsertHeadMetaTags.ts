import { type DefaultTreeAdapterTypes, parseFragment } from 'parse5';

/**
 * Upsert the head html tags
 * @param head - The head element
 * @param tags - The tags to upsert
 */
export const upsertHeadMetaTags = (
  head: DefaultTreeAdapterTypes.Element,
  tags: string[]
) => {
  // Remove existing tags with matching nodeName and attributes
  tags.forEach((tag) => {
    const parsedTag = parseFragment(tag)
      .childNodes[0] as DefaultTreeAdapterTypes.Element;

    if (parsedTag.nodeName !== 'meta') return;

    const parsedNameAttr = parsedTag.attrs?.find(
      (attr) => attr.name === 'name'
    );
    if (!parsedNameAttr) return;

    const existingTagIndex = head.childNodes.findIndex((node) => {
      if (node.nodeName !== 'meta') return false;

      const nodeElement = node as DefaultTreeAdapterTypes.Element;
      const nodeNameAttr = nodeElement.attrs?.find(
        (attr) => attr.name === 'name'
      );

      return nodeNameAttr?.value === parsedNameAttr.value;
    });

    if (existingTagIndex > -1) {
      head.childNodes.splice(existingTagIndex, 1);
    }
  });

  // Add new tags in reverse order to maintain proper sequence when using unshift
  const parsedTags = tags.map(
    (tag) => parseFragment(tag).childNodes[0] as DefaultTreeAdapterTypes.Element
  );

  // Insert in reverse order so they appear in the correct sequence
  parsedTags.reverse().forEach((tag) => {
    head.childNodes.unshift(tag);
  });
};
