import { type DefaultTreeAdapterTypes, parseFragment } from 'parse5';
import type { ScriptInlineItem } from '../types.js';

/**
 * Upsert the inline scripts
 * @param head - The body element
 * @param scripts - The sorted script items to upsert, javascript code
 */
export const upsertHeadInlineScripts = (
  head: DefaultTreeAdapterTypes.Element,
  scripts: ScriptInlineItem[]
) => {
  // Remove existing inline scripts with matching content
  scripts.forEach((script) => {
    const existingScriptIndex = head.childNodes.findIndex(
      (node) =>
        node.nodeName === 'script' &&
        (node as DefaultTreeAdapterTypes.Element).attrs?.find(
          (attr) => attr.name === 'id' && attr.value === script.id
        )
    );

    if (existingScriptIndex > -1) {
      head.childNodes.splice(existingScriptIndex, 1);
    }
  });

  // Add new inline scripts
  // Sort scripts by order (smaller numbers first)
  const sortedScripts = [...scripts].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  // Create script nodes
  const scriptTags = sortedScripts.map((script) => {
    const scriptNode = parseFragment(
      `<script id="${script.id}" data-order="${script.order}" data-position="${script.position}">${script.content}</script>`
    ).childNodes[0] as DefaultTreeAdapterTypes.Element;
    return scriptNode;
  });

  // Split scripts by position
  const beginningScripts = sortedScripts.reduce<
    DefaultTreeAdapterTypes.Element[]
  >((acc, script, index) => {
    if (script.position === 'beginning') {
      acc.push(scriptTags[index]);
    }
    return acc;
  }, []);

  const endScripts = sortedScripts.reduce<DefaultTreeAdapterTypes.Element[]>(
    (acc, script, index) => {
      if (script.position === 'end') {
        acc.push(scriptTags[index]);
      }
      return acc;
    },
    []
  );

  // Add beginning scripts
  beginningScripts.reverse().forEach((scriptNode) => {
    head.childNodes.unshift(scriptNode);
  });

  // Add end scripts
  endScripts.forEach((scriptNode) => {
    head.childNodes.push(scriptNode);
  });
};
