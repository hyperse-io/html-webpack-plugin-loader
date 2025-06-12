import { parseFragment } from 'parse5';
import { type DefaultTreeAdapterTypes } from 'parse5';

/**
 * Upsert the title tag
 * @param head - The head element
 * @param title - The title to upsert
 */
export const upsertTitle = (
  head: DefaultTreeAdapterTypes.Element,
  title: string
) => {
  const titleNode = head.childNodes?.find(
    (node) => node.nodeName === 'title'
  ) as DefaultTreeAdapterTypes.Element | undefined;

  if (titleNode) {
    titleNode.childNodes = [
      {
        nodeName: '#text',
        value: title,
        parentNode: titleNode,
      } as DefaultTreeAdapterTypes.ChildNode,
    ];
  } else {
    const newTitle = parseFragment('<title></title>')
      .childNodes[0] as DefaultTreeAdapterTypes.Element;

    newTitle.childNodes = [
      {
        nodeName: '#text',
        value: title,
        parentNode: newTitle,
      } as DefaultTreeAdapterTypes.ChildNode,
    ];

    head.childNodes.unshift(newTitle);
  }
};
