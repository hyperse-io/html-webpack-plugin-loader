import type { LoaderContext } from 'webpack';
import { parseTemplate } from '../parser/parseTemplate.js';

// Define the loader options type
interface LoaderOptions {
  force?: boolean;
}

export default function htmlLoader(
  this: LoaderContext<LoaderOptions>,
  source: string
): string {
  // Get and validate options
  const options = this.getOptions();
  const force = options.force || false;

  const allLoadersButThisOne = this.loaders.filter(
    (loader) => loader.normal !== module.exports
  );

  // This loader shouldn't kick in if there is any other loader (unless it's explicitly enforced)
  if (allLoadersButThisOne.length > 0 && !force) {
    return source;
  }

  // Allow only one html-webpack-plugin loader to allow loader options in the webpack config
  const htmlWebpackPluginLoaders = this.loaders.filter(
    (loader) => loader.normal === module.exports
  );

  const lastHtmlWebpackPluginLoader =
    htmlWebpackPluginLoaders[htmlWebpackPluginLoaders.length - 1];
  if (this.loaders[this.loaderIndex] !== lastHtmlWebpackPluginLoader) {
    return source;
  }

  // Skip .js files (unless it's explicitly enforced)
  if (!/\.html$/.test(this.resourcePath)) {
    return source;
  }

  // Convert the source into a string that can be executed by vm.Script
  return [
    'const { TemplateParser } = eval("require")(' +
      JSON.stringify(require.resolve('../index.cjs')) +
      ');',
    'const parseTemplate = ' + parseTemplate.toString() + ';',
    'const source = ' + JSON.stringify(source) + ';',
    'module.exports = (function(templateParams) { ',
    'return parseTemplate(source, templateParams || {}).serialize();',
    '});',
  ].join('');
}
