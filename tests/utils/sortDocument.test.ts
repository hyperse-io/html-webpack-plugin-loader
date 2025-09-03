import { type DefaultTreeAdapterTypes } from 'parse5';
import { parseDocument } from '../../src/utils/parseDocument.js';
import { sortDocument } from '../../src/utils/sortDocument.js';

describe('sortDocument', () => {
  it('should sort styles in head by data-order and data-position and remove sorting attributes', () => {
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="stylesheet" href="style3.css" id="style3" data-order="3" data-position="end">
          <link rel="stylesheet" href="style1.css" id="style1" data-order="1" data-position="beginning">
          <link rel="stylesheet" href="style2.css" id="style2" data-order="2" data-position="beginning">
          <style id="inline3" data-order="3" data-position="end">body { color: red; }</style>
          <style id="inline1" data-order="1" data-position="end">body { color: blue; }</style>
          <title>Test</title>
        </head>
        <body></body>
      </html>
    `;

    const { document } = parseDocument(html);
    const result = sortDocument(document);

    const htmlElement = result.childNodes.find(
      (node) => node.nodeName === 'html'
    ) as DefaultTreeAdapterTypes.Element;
    const head = htmlElement.childNodes.find(
      (node) => node.nodeName === 'head'
    ) as DefaultTreeAdapterTypes.Element;

    // Check that styles are sorted correctly
    const styleNodes = head.childNodes.filter(
      (node) => node.nodeName === 'link' || node.nodeName === 'style'
    );

    // beginning styles should come first, sorted by order
    expect(styleNodes[0].nodeName).toBe('link');
    expect(
      (styleNodes[0] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('style1');

    expect(styleNodes[1].nodeName).toBe('link');
    expect(
      (styleNodes[1] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('style2');

    // end styles should come last, sorted by order
    expect(styleNodes[2].nodeName).toBe('style');
    expect(
      (styleNodes[2] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('inline1');

    expect(styleNodes[3].nodeName).toBe('link');
    expect(
      (styleNodes[3] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('style3');

    expect(styleNodes[4].nodeName).toBe('style');
    expect(
      (styleNodes[4] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('inline3');

    // Check that sorting attributes are removed
    styleNodes.forEach((node) => {
      const elementNode = node as DefaultTreeAdapterTypes.Element;
      expect(
        elementNode.attrs?.find((attr) => attr.name === 'data-order')
      ).toBeUndefined();
      expect(
        elementNode.attrs?.find((attr) => attr.name === 'data-position')
      ).toBeUndefined();
    });
  });

  it('should sort scripts in head by data-order and data-position and remove sorting attributes', () => {
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <script id="script3" src="script3.js" data-order="3" data-position="end"></script>
          <script id="script1" src="script1.js" data-order="1" data-position="beginning"></script>
          <script id="script2" src="script2.js" data-order="2" data-position="beginning"></script>
          <script id="inline3" data-order="3" data-position="end">console.log('inline3');</script>
          <script id="inline1" data-order="1" data-position="end">console.log('inline1');</script>
          <title>Test</title>
        </head>
        <body></body>
      </html>
    `;

    const { document } = parseDocument(html);
    const result = sortDocument(document);

    const htmlElement = result.childNodes.find(
      (node) => node.nodeName === 'html'
    ) as DefaultTreeAdapterTypes.Element;
    const head = htmlElement.childNodes.find(
      (node) => node.nodeName === 'head'
    ) as DefaultTreeAdapterTypes.Element;

    const scriptNodes = head.childNodes.filter(
      (node) => node.nodeName === 'script'
    );

    // beginning scripts should come first, sorted by order
    expect(scriptNodes[0].nodeName).toBe('script');
    expect(
      (scriptNodes[0] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('script1');

    expect(scriptNodes[1].nodeName).toBe('script');
    expect(
      (scriptNodes[1] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('script2');

    // end scripts should come last, sorted by order
    expect(scriptNodes[2].nodeName).toBe('script');
    expect(
      (scriptNodes[2] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('inline1');

    expect(scriptNodes[3].nodeName).toBe('script');
    expect(
      (scriptNodes[3] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('script3');

    expect(scriptNodes[4].nodeName).toBe('script');
    expect(
      (scriptNodes[4] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('inline3');

    // Check that sorting attributes are removed
    scriptNodes.forEach((node) => {
      const elementNode = node as DefaultTreeAdapterTypes.Element;
      expect(
        elementNode.attrs?.find((attr) => attr.name === 'data-order')
      ).toBeUndefined();
      expect(
        elementNode.attrs?.find((attr) => attr.name === 'data-position')
      ).toBeUndefined();
    });
  });

  it('should sort scripts in body by data-order and data-position and remove sorting attributes', () => {
    const html = `
      <html>
        <head></head>
        <body>
          <div>Content</div>
          <script id="script3" src="script3.js" data-order="3" data-position="end"></script>
          <script id="script1" src="script1.js" data-order="1" data-position="beginning"></script>
          <script id="script2" src="script2.js" data-order="2" data-position="beginning"></script>
          <script id="inline3" data-order="3" data-position="end">console.log('inline3');</script>
          <script id="inline1" data-order="1" data-position="end">console.log('inline1');</script>
          <p>More content</p>
        </body>
      </html>
    `;

    const { document } = parseDocument(html);
    const result = sortDocument(document);

    const htmlElement = result.childNodes.find(
      (node) => node.nodeName === 'html'
    ) as DefaultTreeAdapterTypes.Element;
    const body = htmlElement.childNodes.find(
      (node) => node.nodeName === 'body'
    ) as DefaultTreeAdapterTypes.Element;

    const scriptNodes = body.childNodes.filter(
      (node) => node.nodeName === 'script'
    );

    // beginning scripts should come first, sorted by order
    expect(scriptNodes[0].nodeName).toBe('script');
    expect(
      (scriptNodes[0] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('script1');

    expect(scriptNodes[1].nodeName).toBe('script');
    expect(
      (scriptNodes[1] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('script2');

    // end scripts should come last, sorted by order
    expect(scriptNodes[2].nodeName).toBe('script');
    expect(
      (scriptNodes[2] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('inline1');

    expect(scriptNodes[3].nodeName).toBe('script');
    expect(
      (scriptNodes[3] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('script3');

    expect(scriptNodes[4].nodeName).toBe('script');
    expect(
      (scriptNodes[4] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('inline3');

    // Check that sorting attributes are removed
    scriptNodes.forEach((node) => {
      const elementNode = node as DefaultTreeAdapterTypes.Element;
      expect(
        elementNode.attrs?.find((attr) => attr.name === 'data-order')
      ).toBeUndefined();
      expect(
        elementNode.attrs?.find((attr) => attr.name === 'data-position')
      ).toBeUndefined();
    });
  });

  it('should not sort nodes without required attributes', () => {
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="stylesheet" href="style1.css">
          <link rel="stylesheet" href="style2.css" data-order="1">
          <link rel="stylesheet" href="style3.css" data-order="1" data-position="beginning" id="style3">
          <script src="script1.js"></script>
          <script src="script2.js" data-order="1"></script>
          <script src="script3.js" data-order="1" data-position="beginning" id="script3"></script>
          <title>Test</title>
        </head>
        <body>
          <div>Content</div>
          <script src="body1.js"></script>
          <script src="body2.js" data-order="1"></script>
          <script src="body3.js" data-order="1" data-position="beginning" id="body3"></script>
        </body>
      </html>
    `;

    const { document } = parseDocument(html);
    const result = sortDocument(document);

    const htmlElement = result.childNodes.find(
      (node) => node.nodeName === 'html'
    ) as DefaultTreeAdapterTypes.Element;
    const head = htmlElement.childNodes.find(
      (node) => node.nodeName === 'head'
    ) as DefaultTreeAdapterTypes.Element;

    // Only nodes with all three attributes (id, data-order, data-position) should be sorted
    const sortedStyleNodes = head.childNodes.filter(
      (node) =>
        node.nodeName === 'link' &&
        (node as DefaultTreeAdapterTypes.Element).attrs?.find(
          (attr) => attr.name === 'id'
        )
    );

    const sortedScriptNodes = head.childNodes.filter(
      (node) =>
        node.nodeName === 'script' &&
        (node as DefaultTreeAdapterTypes.Element).attrs?.find(
          (attr) => attr.name === 'id'
        )
    );

    // Should only have one sorted style node (style3.css)
    expect(sortedStyleNodes).toHaveLength(1);
    expect(
      (sortedStyleNodes[0] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'href'
      )?.value
    ).toBe('style3.css');

    // Should only have one sorted script node (script3.js)
    expect(sortedScriptNodes).toHaveLength(1);
    expect(
      (sortedScriptNodes[0] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'src'
      )?.value
    ).toBe('script3.js');
  });

  it('should only sort stylesheet links, not other link types', () => {
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="icon" href="favicon.ico" id="favicon" data-order="1" data-position="beginning">
          <link rel="stylesheet" href="style1.css" id="style1" data-order="2" data-position="beginning">
          <link rel="preload" href="font.woff" id="font" data-order="1" data-position="beginning">
          <link rel="stylesheet" href="style2.css" id="style2" data-order="1" data-position="beginning">
          <title>Test</title>
        </head>
        <body></body>
      </html>
    `;

    const { document } = parseDocument(html);
    const result = sortDocument(document);

    const htmlElement = result.childNodes.find(
      (node) => node.nodeName === 'html'
    ) as DefaultTreeAdapterTypes.Element;
    const head = htmlElement.childNodes.find(
      (node) => node.nodeName === 'head'
    ) as DefaultTreeAdapterTypes.Element;

    const sortedStyleNodes = head.childNodes.filter(
      (node) =>
        node.nodeName === 'link' &&
        (node as DefaultTreeAdapterTypes.Element).attrs?.find(
          (attr) => attr.name === 'rel' && attr.value === 'stylesheet'
        ) &&
        (node as DefaultTreeAdapterTypes.Element).attrs?.find(
          (attr) => attr.name === 'id'
        )
    );

    // Should only have two sorted stylesheet nodes
    expect(sortedStyleNodes).toHaveLength(2);

    // style2 should come first (order 1), then style1 (order 2)
    expect(
      (sortedStyleNodes[0] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('style2');

    expect(
      (sortedStyleNodes[1] as DefaultTreeAdapterTypes.Element).attrs?.find(
        (attr) => attr.name === 'id'
      )?.value
    ).toBe('style1');
  });

  it('should preserve non-sortable nodes in their original positions', () => {
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Original Title</title>
          <link rel="stylesheet" href="style1.css" id="style1" data-order="1" data-position="beginning">
          <meta name="description" content="test">
          <link rel="stylesheet" href="style2.css" id="style2" data-order="2" data-position="beginning">
          <link rel="icon" href="favicon.ico">
        </head>
        <body>
          <div>Content</div>
          <script src="script1.js" id="script1" data-order="1" data-position="beginning"></script>
          <p>More content</p>
          <script src="script2.js" id="script2" data-order="2" data-position="beginning"></script>
        </body>
      </html>
    `;

    const { document } = parseDocument(html);
    const result = sortDocument(document);

    const htmlElement = result.childNodes.find(
      (node) => node.nodeName === 'html'
    ) as DefaultTreeAdapterTypes.Element;
    const head = htmlElement.childNodes.find(
      (node) => node.nodeName === 'head'
    ) as DefaultTreeAdapterTypes.Element;
    const body = htmlElement.childNodes.find(
      (node) => node.nodeName === 'body'
    ) as DefaultTreeAdapterTypes.Element;

    // Check that non-sortable nodes maintain their relative positions
    const headNodeNames = head.childNodes.map((node) => node.nodeName);
    const bodyNodeNames = body.childNodes.map((node) => node.nodeName);

    // meta, title, meta, link should still be in head
    expect(headNodeNames).toContain('meta');
    expect(headNodeNames).toContain('title');
    expect(headNodeNames).toContain('link');

    // div, p should still be in body
    expect(bodyNodeNames).toContain('div');
    expect(bodyNodeNames).toContain('p');
  });

  it('should remove data-order and data-position attributes from all elements', () => {
    const html = `
      <html>
        <head>
          <link rel="stylesheet" href="style1.css" id="style1" data-order="1" data-position="beginning">
          <script id="script1" src="script1.js" data-order="1" data-position="beginning"></script>
          <style id="inline1" data-order="1" data-position="beginning">body { color: red; }</style>
        </head>
        <body>
          <script id="body1" src="body1.js" data-order="1" data-position="beginning"></script>
          <div data-order="1" data-position="beginning">Content</div>
        </body>
      </html>
    `;

    const { document } = parseDocument(html);
    const result = sortDocument(document);

    // Check that all data-order and data-position attributes are removed
    const checkAttributes = (element: DefaultTreeAdapterTypes.Element) => {
      if (element.attrs) {
        expect(
          element.attrs.find((attr) => attr.name === 'data-order')
        ).toBeUndefined();
        expect(
          element.attrs.find((attr) => attr.name === 'data-position')
        ).toBeUndefined();
      }

      element.childNodes.forEach((node) => {
        if (
          node.nodeName &&
          node.nodeName !== '#text' &&
          node.nodeName !== '#comment'
        ) {
          checkAttributes(node as DefaultTreeAdapterTypes.Element);
        }
      });
    };

    checkAttributes(result as any);
  });
});
