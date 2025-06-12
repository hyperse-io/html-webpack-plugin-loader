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

- 🔄 Fluent API for HTML manipulation
- 🎯 Precise control over HTML document structure
- 📦 Easy integration with webpack
- 🚀 TypeScript support
- 🔍 Built-in support for common HTML modifications:
- 📝 Title tag management
- 🎨 Favicon handling
- 📱 Viewport meta tag control
- 📋 Meta tags management
- 💅 Style injection
- 📜 Script injection (both inline and external)
- 🔄 Head and body modifications

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

// Chain methods to modify the template
const modifiedHtml = parser
  .upsertTitleTag('My Page Title')
  .upsertFaviconTag('/favicon.ico')
  .upsertViewportTag(
    '<meta name="viewport" content="width=device-width, initial-scale=1">'
  )
  .upsertHeadMetaTags([
    '<meta name="description" content="My page description">',
  ])
  .upsertHeadStyles(['<style>body { margin: 0; }</style>'])
  .upsertHeadScripts([{ src: '/main.js' }])
  .upsertHeadInlineScripts(['<script>console.log("Hello");</script>'])
  .upsertBodyScripts([{ src: '/app.js' }])
  .serialize();
```

#### Available Methods

- `upsertTitleTag(title: string)`: Updates or inserts the page title
- `upsertFaviconTag(favicon: string)`: Updates or inserts the favicon link
- `upsertViewportTag(viewport: string)`: Updates or inserts the viewport meta tag
- `upsertHeadMetaTags(tags: string[])`: Updates or inserts meta tags in the head
- `upsertHeadStyles(styles: string[])`: Updates or inserts style tags in the head
- `upsertHeadScripts(scripts: ScriptItem[])`: Updates or inserts script tags in the head
- `upsertHeadInlineScripts(scripts: string[])`: Updates or inserts inline scripts in the head
- `upsertBodyScripts(scripts: ScriptItem[])`: Updates or inserts script tags in the body
- `serialize()`: Converts the modified document back to HTML string

## Contributing

Contributions are welcome! Please read our [contributing guidelines](https://github.com/hyperse-io/.github/blob/main/CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
