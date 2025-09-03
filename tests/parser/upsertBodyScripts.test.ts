import { type DefaultTreeAdapterTypes } from 'parse5';
import { upsertBodySctipts } from '../../src/parser/upsertBodySctipts.js';
import type { ScriptItem } from '../../src/types.js';
import { parseDocument } from '../../src/utils/parseDocument.js';

describe('upsertBodyScripts', () => {
  let body: DefaultTreeAdapterTypes.Element;

  beforeEach(() => {
    const document = parseDocument(
      '<html><head></head><body><div>Content</div><script src="existing.js"></script></body></html>'
    );
    body = document.body;
  });

  it('should add scripts to body in correct order based on order property', () => {
    const scripts: ScriptItem[] = [
      { id: 'script2', src: 'script2.js', position: 'end', order: 2 },
      { id: 'script1', src: 'script1.js', position: 'end', order: 1 },
    ];

    upsertBodySctipts(body, scripts);

    expect(body.childNodes.length).toBe(4); // div, existing script, script1, script2

    // Check that scripts are added in correct order
    const script1 = body.childNodes[2] as DefaultTreeAdapterTypes.Element;
    const script2 = body.childNodes[3] as DefaultTreeAdapterTypes.Element;

    expect(script1.attrs?.find((attr) => attr.name === 'src')?.value).toBe(
      'script1.js'
    );
    expect(script2.attrs?.find((attr) => attr.name === 'src')?.value).toBe(
      'script2.js'
    );
  });

  it('should add scripts at beginning and end of body correctly', () => {
    const scripts: ScriptItem[] = [
      {
        id: 'beginning-script-2',
        src: 'beginning-2.js',
        position: 'beginning',
        order: 2,
      },
      { id: 'end-script-1', src: 'end-1.js', position: 'end', order: 1 },
      {
        id: 'beginning-script-1',
        src: 'beginning-1.js',
        position: 'beginning',
        order: 1,
      },
      { id: 'end-script-2', src: 'end-2.js', position: 'end', order: 2 },
    ];

    upsertBodySctipts(body, scripts);

    expect(body.childNodes.length).toBe(6);

    // beginning script should be first
    expect(
      (body.childNodes[0] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'src'
      )?.value
    ).toBe('beginning-1.js');

    // end script should be last
    expect(
      (body.childNodes[5] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'src'
      )?.value
    ).toBe('end-2.js');
  });

  it('should remove existing scripts with matching id', () => {
    const scripts: ScriptItem[] = [
      { id: 'existing-script', src: 'existing.js', position: 'end', order: 2 },
    ];
    const updatedScripts: ScriptItem[] = [
      { id: 'existing-script', src: 'updated.js', position: 'end', order: 2 },
    ];

    upsertBodySctipts(body, scripts);
    upsertBodySctipts(body, updatedScripts);

    // Should have only one script with the updated src
    const scriptNodes = body.childNodes.filter(
      (node) => node.nodeName === 'script'
    ) as DefaultTreeAdapterTypes.Element[];

    expect(scriptNodes.length).toBe(2);
    const existedScripts = scriptNodes.find((s) =>
      s.attrs?.find(
        (attr) => attr.name === 'id' && attr.value === 'existing-script'
      )
    );
    expect(existedScripts?.attrs.find((s) => s.name === 'src')?.value).toBe(
      'updated.js'
    );
  });

  it('should add all script attributes correctly', () => {
    const scripts: ScriptItem[] = [
      {
        id: 'test-script',
        src: 'test.js',
        position: 'end',
        order: 2,
        type: 'module',
        async: true,
        defer: true,
        crossOrigin: 'anonymous',
        integrity: 'sha384-hash',
        nonce: 'abc123',
      },
    ];

    upsertBodySctipts(body, scripts);

    const scriptNode = body.childNodes[2] as DefaultTreeAdapterTypes.Element;
    expect(scriptNode.attrs?.find((attr) => attr.name === 'type')?.value).toBe(
      'module'
    );
    expect(scriptNode.attrs?.find((attr) => attr.name === 'async')?.value).toBe(
      'true'
    );
    expect(scriptNode.attrs?.find((attr) => attr.name === 'defer')?.value).toBe(
      'true'
    );
    expect(
      scriptNode.attrs?.find((attr) => attr.name === 'crossorigin')?.value
    ).toBe('anonymous');
    expect(
      scriptNode.attrs?.find((attr) => attr.name === 'integrity')?.value
    ).toBe('sha384-hash');
    expect(scriptNode.attrs?.find((attr) => attr.name === 'nonce')?.value).toBe(
      'abc123'
    );
  });

  it('should handle empty scripts array', () => {
    const initialLength = body.childNodes.length;

    upsertBodySctipts(body, []);

    expect(body.childNodes.length).toBe(initialLength);
  });

  it('should handle scripts with default position (end)', () => {
    const scripts: ScriptItem[] = [
      { id: 'default-script', src: 'default.js', position: 'end', order: 2 }, // no position specified
    ];

    upsertBodySctipts(body, scripts);

    // Should be added at the end
    expect(
      (body.childNodes[2] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'src'
      )?.value
    ).toBe('default.js');
  });

  it('should preserve existing body content when adding scripts', () => {
    const scripts: ScriptItem[] = [
      { id: 'new-script', src: 'new.js', position: 'end', order: 2 },
    ];

    upsertBodySctipts(body, scripts);

    // Original content should still be there
    expect(body.childNodes[0].nodeName).toBe('div');
    expect(
      (
        (body.childNodes[0] as DefaultTreeAdapterTypes.Element)
          .childNodes[0] as DefaultTreeAdapterTypes.TextNode
      ).value
    ).toBe('Content');

    // Original script should still be there
    expect(
      (body.childNodes[1] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'src'
      )?.value
    ).toBe('existing.js');
  });
});
