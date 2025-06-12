import { type DefaultTreeAdapterTypes, parseFragment } from 'parse5';

/**
 * Upsert the inline scripts
 * @param body - The body element
 * @param scripts - The sorted script items to upsert, javascript code
 */
export const upsertHeadInlineScripts = (
  head: DefaultTreeAdapterTypes.Element,
  scripts: string[]
) => {
  // Remove existing inline scripts with matching content
  scripts.forEach((script) => {
    const existingScriptIndex = head.childNodes.findIndex(
      (node) =>
        node.nodeName === 'script' &&
        (
          (node as DefaultTreeAdapterTypes.Element)
            .childNodes?.[0] as DefaultTreeAdapterTypes.TextNode
        )?.value === script
    );

    if (existingScriptIndex > -1) {
      head.childNodes.splice(existingScriptIndex, 1);
    }
  });

  // Add new inline scripts
  scripts.forEach((script) => {
    const scriptNode = parseFragment(`<script>${script}</script>`)
      .childNodes[0] as DefaultTreeAdapterTypes.Element;

    head.childNodes.push(scriptNode);
  });
};
