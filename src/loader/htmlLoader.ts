import { getOptions } from 'loader-utils';
import type { LoaderContext } from 'webpack';

// Define the loader options type
interface LoaderOptions {
  transform?: boolean;
  // Add more option types as needed
}

export default function htmlLoader(
  this: LoaderContext<LoaderOptions>,
  source: string
): string {
  // Get and validate options
  const options = getOptions(this) as LoaderOptions;

  // Get the resource path
  if (!/\.html$/.test(this.resourcePath)) {
    return source;
  }

  // Example transformation
  let transformedSource = source;
  if (options.transform) {
    // Add your transformation logic here
    transformedSource = source.toUpperCase(); // Example transformation
  }

  // You can use this.emitFile to emit additional files
  // this.emitFile('output.txt', 'Some content');

  // You can use this.callback for async operations
  // this.callback(null, transformedSource, sourceMap, meta);

  // Return the transformed source
  return `module.exports.default = module.exports = ${JSON.stringify(transformedSource)}`;
}
