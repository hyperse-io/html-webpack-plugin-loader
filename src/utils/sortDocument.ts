import { type DefaultTreeAdapterTypes } from 'parse5';

/**
 * Sort the document by the data-order attribute within specific positions
 * @param document - The document to sort
 * @returns The sorted document
 */
export const sortDocument = (document: DefaultTreeAdapterTypes.Document) => {
  const sortedDocument = { ...document };

  // Get html element
  const html = document.childNodes.find(
    (node) => node.nodeName === 'html'
  ) as DefaultTreeAdapterTypes.Element;

  if (!html) {
    return sortedDocument;
  }

  // Get head and body elements
  const head = html.childNodes.find(
    (node) => node.nodeName === 'head'
  ) as DefaultTreeAdapterTypes.Element;

  const body = html.childNodes.find(
    (node) => node.nodeName === 'body'
  ) as DefaultTreeAdapterTypes.Element;

  if (head) {
    // 1. filter styles, <link rel="stylesheet" id="" data-order="" data-position="beginning" /> or <styles id="" data-order="" data-position="end" /> within <head /> group by data-position
    sortNodesByPosition(head, ['link', 'style'], (node) => {
      const elementNode = node as DefaultTreeAdapterTypes.Element;
      // Check if node has all required attributes: id, data-order, data-position
      const hasId = elementNode.attrs?.find((attr) => attr.name === 'id');
      const hasOrder = elementNode.attrs?.find(
        (attr) => attr.name === 'data-order'
      );
      const hasPosition = elementNode.attrs?.find(
        (attr) => attr.name === 'data-position'
      );

      if (!hasId || !hasOrder || !hasPosition) {
        return false;
      }

      // For link elements, only consider stylesheet links
      if (node.nodeName === 'link') {
        const isStylesheet = elementNode.attrs?.find(
          (attr) => attr.name === 'rel' && attr.value === 'stylesheet'
        );
        return !!isStylesheet;
      }
      return true; // For style elements
    });

    // 2. filter all scripts, <script id="" src="" data-order="" data-position="beginning" ></script>  or <script id="" data-order="" data-position="end" >var inline="";</script> within <head /> group by data-position
    sortNodesByPosition(head, ['script'], (node) => {
      const elementNode = node as DefaultTreeAdapterTypes.Element;
      // Check if node has all required attributes: id, data-order, data-position
      const hasId = elementNode.attrs?.find((attr) => attr.name === 'id');
      const hasOrder = elementNode.attrs?.find(
        (attr) => attr.name === 'data-order'
      );
      const hasPosition = elementNode.attrs?.find(
        (attr) => attr.name === 'data-position'
      );

      return !!(hasId && hasOrder && hasPosition);
    });

    // Clean up data-order and data-position attributes from head
    cleanupSortingAttributes(head);
  }

  if (body) {
    // 3. filter all scripts, <script id="" src="" data-order="" data-position="beginning" ></script> or <script id="" data-order="" data-position="beginning" >var inline="";</script> within <body /> group by data-position
    sortNodesByPosition(body, ['script'], (node) => {
      const elementNode = node as DefaultTreeAdapterTypes.Element;
      // Check if node has all required attributes: id, data-order, data-position
      const hasId = elementNode.attrs?.find((attr) => attr.name === 'id');
      const hasOrder = elementNode.attrs?.find(
        (attr) => attr.name === 'data-order'
      );
      const hasPosition = elementNode.attrs?.find(
        (attr) => attr.name === 'data-position'
      );

      return !!(hasId && hasOrder && hasPosition);
    });

    // Clean up data-order and data-position attributes from body
    cleanupSortingAttributes(body);
  }

  // 4. resort all nodes by data-order and data-position
  // This step is already handled by the above functions

  return sortedDocument;
};

/**
 * Sort nodes by data-position and data-order within an element
 * @param element - The element to sort nodes in
 * @param nodeNames - Array of node names to sort
 * @param filterFn - Filter function to determine which nodes to sort
 */
const sortNodesByPosition = (
  element: DefaultTreeAdapterTypes.Element,
  nodeNames: string[],
  filterFn: (node: DefaultTreeAdapterTypes.Node) => boolean
) => {
  const beginningNodes: Array<{
    node: DefaultTreeAdapterTypes.Element;
    order: number;
  }> = [];

  const endNodes: Array<{
    node: DefaultTreeAdapterTypes.Element;
    order: number;
  }> = [];

  // Collect all matching nodes and separate by position
  element.childNodes.forEach((node) => {
    if (nodeNames.includes(node.nodeName) && filterFn(node)) {
      const elementNode = node as DefaultTreeAdapterTypes.Element;
      const orderAttr = elementNode.attrs?.find(
        (attr) => attr.name === 'data-order'
      );
      const positionAttr = elementNode.attrs?.find(
        (attr) => attr.name === 'data-position'
      );

      if (orderAttr && positionAttr) {
        const order = parseInt(orderAttr.value, 10) || 0;
        const nodeInfo = { node: elementNode, order };

        if (positionAttr.value === 'beginning') {
          beginningNodes.push(nodeInfo);
        } else if (positionAttr.value === 'end') {
          endNodes.push(nodeInfo);
        }
      }
    }
  });

  // Remove all collected nodes from their current positions
  [...beginningNodes, ...endNodes].forEach(({ node }) => {
    const index = element.childNodes.indexOf(node);
    if (index > -1) {
      element.childNodes.splice(index, 1);
    }
  });

  // Sort beginning nodes by order (ascending)
  beginningNodes.sort((a, b) => a.order - b.order);

  // Sort end nodes by order (ascending)
  endNodes.sort((a, b) => a.order - b.order);

  // Insert beginning nodes at the start of the element
  beginningNodes.reverse().forEach(({ node }) => {
    element.childNodes.unshift(node);
  });

  // Insert end nodes at the end of the element
  endNodes.forEach(({ node }) => {
    element.childNodes.push(node);
  });
};

/**
 * Remove data-order and data-position attributes from all child nodes recursively
 * @param element - The element to clean up attributes from
 */
const cleanupSortingAttributes = (element: DefaultTreeAdapterTypes.Element) => {
  // Clean up attributes from the current element
  if (element.attrs) {
    element.attrs = element.attrs.filter(
      (attr) => attr.name !== 'data-order' && attr.name !== 'data-position'
    );
  }

  // Recursively clean up attributes from all child nodes
  element.childNodes.forEach((node) => {
    if (
      node.nodeName &&
      node.nodeName !== '#text' &&
      node.nodeName !== '#comment'
    ) {
      const childElement = node as DefaultTreeAdapterTypes.Element;
      cleanupSortingAttributes(childElement);
    }
  });
};
