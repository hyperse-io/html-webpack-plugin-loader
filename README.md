# @hyperse/html-webpack-plugin-loader

A powerful HTML template parser and manipulator for webpack applications, providing a fluent API for modifying HTML templates with ease.

<p align="left">
  <a aria-label="Build" href="https://github.com/hyperse-io/html-webpack-plugin-loader/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/actions/workflow/status/hyperse-io/html-webpack-plugin-loader/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="stable version" href="https://www.npmjs.com/package/@hyperse/html-webpack-plugin-loader">
    <img alt="stable version" src="https://img.shields.io/npm/v/%40hyperse%2Fhtml-webpack-plugin-loader?branch=main&label=version&logo=npm&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/hyperse-io/html-webpack-plugin-loader/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hyperse-io/html-webpack-plugin-loader?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/hyperse-io/html-webpack-plugin-loader/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/hyperse-io/html-webpack-plugin-loader?style=flat-quare&labelColor=000000" />
  </a>
</p>

A TypeScript-based HTML template parser that provides a fluent API for manipulating HTML documents. This package is designed to work seamlessly with webpack applications, allowing you to easily modify HTML templates during the build process.

## Features

## Features

- 🔄 Fluent API for HTML manipulation
- 🎯 Precise control over HTML document structure
- 📦 Easy integration with webpack
- 🚀 TypeScript support
- 🔍 Built-in support for common HTML modifications:
- 📝 Title tag management
- 🎨 Favicon handling with customizable attributes
- 📱 Meta tags management
- 💅 Style injection (both external and inline)
- 📜 Script injection (both external and inline)
- 🔄 Head and body modifications with position control

## Installation

```bash
npm install --save @hyperse/html-webpack-plugin-loader
```

## API Reference

### TemplateParser

The main class that provides HTML template manipulation capabilities.

```typescript
import { TemplateParser } from '@hyperse/html-webpack-plugin-loader';

// Create a new parser instance
const parser = new TemplateParser(htmlSource);

// Define template options
const templateOptions: TemplateOptions = {
  // Set page title
  title: 'My Page Title',

  // Set website favicon with custom attributes
  favicon: {
    href: '/favicon.ico',
    rel: 'icon',
    attributes: {
      type: 'image/x-icon',
      sizes: '32x32',
    },
  },

  // Set meta tags in head
  headMetaTags: ['<meta name="description" content="My page description">'],

  // Set external styles in head
  headStyles: [
    {
      id: 'main-css',
      href: '/styles/main.css',
      position: 'end',
      order: 1,
    },
  ],

  // Set inline styles in head
  headInlineStyles: [
    {
      id: 'critical-css',
      content: 'body { margin: 0; }',
      position: 'beginning',
      order: 0,
    },
  ],

  // Set external scripts in head
  headScripts: [
    {
      id: 'main-js',
      src: '/main.js',
      position: 'end',
      type: 'module',
      async: true,
      defer: false,
      crossOrigin: 'anonymous',
      integrity: 'sha384-hash',
      nonce: 'abc123',
      order: 1,
    },
  ],

  // Set inline scripts in head
  headInlineScripts: [
    {
      id: 'inline-script',
      content: 'console.log("Hello");',
      position: 'end',
      order: 2,
    },
  ],

  // Set scripts in body
  bodyScripts: [
    {
      id: 'app-js',
      src: '/app.js',
      position: 'end',
      type: 'module',
      async: true,
      defer: false,
      order: 1,
    },
  ],
};

// Use template options to modify HTML
const modifiedHtml = parser
  .upsertTitleTag(templateOptions.title)
  .upsertFaviconTag(
    templateOptions.favicon.href,
    templateOptions.favicon.rel,
    templateOptions.favicon.attributes
  )
  .upsertHeadMetaTags(templateOptions.headMetaTags)
  .upsertHeadStyles(templateOptions.headStyles)
  .upsertHeadInlineStyles(templateOptions.headInlineStyles)
  .upsertHeadScripts(templateOptions.headScripts)
  .upsertHeadInlineScripts(templateOptions.headInlineScripts)
  .upsertBodyScripts(templateOptions.bodyScripts)
  .serialize();
```

#### Available Methods

- `upsertTitleTag(title: string)`: Updates or inserts the page title
- `upsertFaviconTag(href: string, rel?: string, attributes?: Record<string, string>)`: Updates or inserts the favicon link with optional rel and custom attributes
- `upsertHeadMetaTags(tags: string[])`: Updates or inserts meta tags in the head
- `upsertHeadStyles(styles: StyleItem[])`: Updates or inserts external style links in the head
- `upsertHeadInlineStyles(styles: StyleInlineItem[])`: Updates or inserts inline style tags in the head
- `upsertHeadScripts(scripts: ScriptItem[])`: Updates or inserts external script tags in the head
- `upsertHeadInlineScripts(scripts: ScriptionInlineItem[])`: Updates or inserts inline script tags in the head
- `upsertBodyScripts(scripts: ScriptItem[])`: Updates or inserts script tags in the body
- `serialize()`: Converts the modified document back to HTML string

#### `parseTemplate` Function

A utility function that provides a convenient way to parse and modify HTML templates in a single step.

```typescript
import { parseTemplate } from '@hyperse/html-webpack-plugin-loader';

// Parse and modify HTML template in one go
const modifiedHtml = parseTemplate(htmlSource, templateOptions);
```

The `parseTemplate` function is a shorthand for creating a `TemplateParser` instance and applying all template modifications at once. It accepts two parameters:

- `htmlSource: string`: The source HTML template to parse and modify
- `options: TemplateOptions`: The template modification options (same as described above)

This function is particularly useful when you want to perform all template modifications in a single operation without manually chaining multiple method calls.

#### Type Definitions

```typescript
type Position = 'beginning' | 'end';

interface HtmlItemBase {
  id: string;
  position: Position;
  order?: number;
}

interface StyleItem extends HtmlItemBase {
  href: string;
}

interface StyleInlineItem extends HtmlItemBase {
  content: string;
}

interface ScriptItem extends HtmlItemBase {
  src: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
  crossOrigin?: string;
  integrity?: string;
  nonce?: string;
}

interface ScriptionInlineItem extends HtmlItemBase {
  content: string;
}

interface FaviconItem {
  href: string;
  rel: string;
  attributes: Record<string, string>;
}

interface TemplateOptions {
  title?: string;
  favicon?: FaviconItem;
  headMetaTags?: string[];
  headStyles?: StyleItem[];
  headInlineStyles?: StyleInlineItem[];
  headScripts?: ScriptItem[];
  headInlineScripts?: ScriptionInlineItem[];
  bodyScripts?: ScriptItem[];
}
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](https://github.com/hyperse-io/.github/blob/main/CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
