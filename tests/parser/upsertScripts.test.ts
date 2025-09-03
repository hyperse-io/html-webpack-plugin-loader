import { type DefaultTreeAdapterTypes, parseFragment } from 'parse5';
import { upsertScripts } from '../../src/parser/upsertScripts.js';
import type { ScriptItem } from '../../src/types.js';
import { parseDocument } from '../../src/utils/parseDocument.js';

// Unit tests
describe('upsertScripts', () => {
  let element: DefaultTreeAdapterTypes.Element;

  beforeEach(() => {
    const { head } = parseDocument(
      '<head><meta charset="utf-8" /><script src="default.js"></script></head>'
    );
    element = head;
  });

  it('should add scripts in correct order based on order property', () => {
    const scripts: ScriptItem[] = [
      { id: 'script2', src: 'script2.js', position: 'end', order: 2 },
      { id: 'script1', src: 'script1.js', position: 'end', order: 1 },
    ];

    upsertScripts(element, scripts);

    expect(element.childNodes.length).toBe(4);

    expect(
      (element.childNodes[2] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'src'
      )?.value
    ).toBe('script1.js');
    expect(
      (element.childNodes[3] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'src'
      )?.value
    ).toBe('script2.js');
  });

  it('should add scripts at beginning and end correctly', () => {
    const scripts: ScriptItem[] = [
      { id: 'end-script', src: 'end.js', position: 'end', order: 1 },
      {
        id: 'beginning-script',
        src: 'beginning.js',
        position: 'beginning',
        order: 1,
      },
    ];

    upsertScripts(element, scripts);

    expect(
      (element.childNodes[0] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'src'
      )?.value
    ).toBe('beginning.js');
    expect(
      (element.childNodes[3] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'src'
      )?.value
    ).toBe('end.js');
  });

  it('should remove existing scripts with matching src', () => {
    const existingScript = parseFragment(
      '<script id="test-script" src="test.js"></script>'
    ).childNodes[0];
    element.childNodes.push(existingScript as DefaultTreeAdapterTypes.Element);

    const scripts: ScriptItem[] = [
      { id: 'test-script', src: 'test.js', position: 'end', order: 1 },
    ];
    const scripts2: ScriptItem[] = [
      { id: 'test-script', src: 'test2.js', position: 'end', order: 1 },
    ];
    upsertScripts(element, scripts);
    upsertScripts(element, scripts2);

    expect(element.childNodes.length).toBe(3);
    expect(
      (element.childNodes[2] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'src'
      )?.value
    ).toBe('test2.js');
  });

  it('should add all script attributes correctly', () => {
    const scripts: ScriptItem[] = [
      {
        id: 'test-script',
        src: 'test.js',
        position: 'end',
        order: 1,
        type: 'module',
        async: true,
        defer: true,
        crossOrigin: 'anonymous',
        integrity: 'sha384-hash',
        nonce: 'abc123',
      },
    ];

    upsertScripts(element, scripts);

    const scriptNode = element.childNodes[2] as DefaultTreeAdapterTypes.Element;
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
});
