import { type DefaultTreeAdapterTypes, parseFragment } from 'parse5';
import type { ScriptItem } from '../types.js';

/**
 * Upsert the head scripts
 * @param element - The element to upsert the scripts into `head` | `body`
 * @param scripts - The scripts to upsert
 */
export const upsertScripts = (
  element: DefaultTreeAdapterTypes.Element,
  scripts: ScriptItem[]
) => {
  // Sort scripts by order (smaller numbers first)
  const sortedScripts = [...scripts].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  // Remove existing scripts with matching srcs
  sortedScripts.forEach((script) => {
    const existingScriptIndex = element.childNodes.findIndex(
      (node) =>
        node.nodeName === 'script' &&
        (node as DefaultTreeAdapterTypes.Element).attrs?.find(
          (attr) => attr.name === 'id' && attr.value === script.id
        )
    );

    if (existingScriptIndex > -1) {
      element.childNodes.splice(existingScriptIndex, 1);
    }
  });

  // Create new script nodes
  const scriptTags = sortedScripts.map((script) => {
    const scriptNode = parseFragment(
      `<script id="${script.id}" src="${script.src}" data-order="${script.order}" data-position="${script.position}"></script>`
    ).childNodes[0] as DefaultTreeAdapterTypes.Element;

    if (script.type) {
      scriptNode.attrs?.push({ name: 'type', value: script.type });
    }

    if (script.async) {
      scriptNode.attrs?.push({ name: 'async', value: 'true' });
    }

    if (script.defer) {
      scriptNode.attrs?.push({ name: 'defer', value: 'true' });
    }

    if (script.crossOrigin) {
      scriptNode.attrs?.push({
        name: 'crossorigin',
        value: script.crossOrigin,
      });
    }

    if (script.integrity) {
      scriptNode.attrs?.push({ name: 'integrity', value: script.integrity });
    }

    if (script.nonce) {
      scriptNode.attrs?.push({ name: 'nonce', value: script.nonce });
    }

    return scriptNode;
  });

  // Add script tags based on position
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
    element.childNodes.unshift(scriptNode);
  });

  // Add end scripts
  endScripts.forEach((scriptNode) => {
    element.childNodes.push(scriptNode);
  });
};
