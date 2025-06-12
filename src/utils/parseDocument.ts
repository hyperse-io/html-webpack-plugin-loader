import { parse as parse5Parse } from 'parse5';
import { type DefaultTreeAdapterTypes } from 'parse5';

/**
 * Parse the document
 * @param htmlSource - The html source
 * @returns The parsed document
 */
export const parseDocument = (htmlSource: string) => {
  const document = parse5Parse(htmlSource);
  const html = document.childNodes.find(
    (node) => node.nodeName === 'html'
  ) as DefaultTreeAdapterTypes.Element;

  const head = html?.childNodes.find(
    (node) => node.nodeName === 'head'
  ) as DefaultTreeAdapterTypes.Element;

  const body = html?.childNodes.find(
    (node) => node.nodeName === 'body'
  ) as DefaultTreeAdapterTypes.Element;

  // Note: It should not throw error if head or body is missing
  // It will return body, head with empty childNodes
  if (!head || !body) {
    throw new Error('Invalid HTML template: missing <head> or <body> tags');
  }

  return { document, html, head, body };
};
