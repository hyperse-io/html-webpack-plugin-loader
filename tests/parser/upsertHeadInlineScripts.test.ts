import { type DefaultTreeAdapterTypes } from 'parse5';
import { upsertHeadInlineScripts } from '../../src/parser/upsertHeadInlineScripts.js';
import type { ScriptInlineItem } from '../../src/types.js';
import { parseDocument } from '../../src/utils/parseDocument.js';

describe('upsertHeadInlineScripts', () => {
  const createScripts = (contents: string[]): ScriptInlineItem[] => {
    return contents.map((content, index) => ({
      id: `script-${index}`,
      position: 'beginning',
      content,
      order: index + 1,
    }));
  };

  it('should add new inline scripts to head', () => {
    const { head } = parseDocument('<head></head>');
    const scripts = createScripts([
      'console.log("test1")',
      'console.log("test2")',
    ]);

    upsertHeadInlineScripts(head, scripts);

    expect(head.childNodes).toHaveLength(2);
    scripts.forEach((script, index) => {
      const scriptNode = head.childNodes[
        index
      ] as DefaultTreeAdapterTypes.Element;
      expect(scriptNode.nodeName).toBe('script');
      expect(scriptNode.attrs).toContainEqual({
        name: 'id',
        value: script.id,
      });
      expect(
        (scriptNode.childNodes[0] as DefaultTreeAdapterTypes.TextNode).value
      ).toBe(script.content);
    });
  });

  it('should replace existing scripts with matching content', () => {
    const { head } = parseDocument(
      '<head><script id="script-0">console.log("test1")</script></head>'
    );
    const scripts = createScripts([
      'console.log("test1")',
      'console.log("test2")',
    ]);

    upsertHeadInlineScripts(head, scripts);

    expect(head.childNodes).toHaveLength(2);
    scripts.forEach((script, index) => {
      const scriptNode = head.childNodes[
        index
      ] as DefaultTreeAdapterTypes.Element;
      expect(scriptNode.nodeName).toBe('script');
      expect(scriptNode.attrs).toContainEqual({
        name: 'id',
        value: script.id,
      });
      expect(
        (scriptNode.childNodes[0] as DefaultTreeAdapterTypes.TextNode).value
      ).toBe(script.content);
    });
  });
});
