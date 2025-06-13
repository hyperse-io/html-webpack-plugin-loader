import type { LoaderContext } from 'webpack';
import { parseTemplate } from '../parser/parseTemplate.js';

// Define the loader options type
interface LoaderOptions {
  title?: string;
  favicon?: string;
  headMetaTags?: string[];
  headStyles?: string[];
  headScripts?: string[];
  headInlineScripts?: string[];
  bodyScripts?: string[];
  bodyInlineScripts?: string[];
}

export default function htmlLoader(
  this: LoaderContext<LoaderOptions>,
  source: string
): string {
  // Get and validate options
  const options = this.getOptions;

  // Skip .js files (unless it's explicitly enforced)
  if (!/\.html$/.test(this.resourcePath)) {
    return source;
  }

  // Example transformation
  const transformedSource = parseTemplate(source);

  // You can use this.emitFile to emit additional files
  // this.emitFile('output.txt', 'Some content');

  // You can use this.callback for async operations
  // this.callback(null, transformedSource, sourceMap, meta);

  // Return the transformed source
  return `export default ${JSON.stringify(transformedSource)}`;
}
