import type { TemplateOptions } from '../types.js';
import { TemplateParser } from './TemplateParser.js';

/**
 * Parse the template
 * @param htmlSource - The html source
 * @param options - The options
 * @returns The parsed template
 */
export const parseTemplate = (
  htmlSource: string,
  options: TemplateOptions = {}
): string => {
  const parser = new TemplateParser(htmlSource);

  if (options.title) {
    parser.upsertTitleTag(options.title);
  }

  if (options.favicon) {
    parser.upsertFaviconTag(
      options.favicon.href,
      options.favicon.rel,
      options.favicon.attributes
    );
  }

  if (options.headMetaTags?.length) {
    parser.upsertHeadMetaTags(options.headMetaTags);
  }

  if (options.headStyles?.length) {
    parser.upsertHeadStyles(options.headStyles);
  }

  if (options.headScripts?.length) {
    parser.upsertHeadScripts(options.headScripts);
  }

  if (options.headInlineScripts?.length) {
    parser.upsertHeadInlineScripts(options.headInlineScripts);
  }

  if (options.bodyScripts?.length) {
    parser.upsertBodyScripts(options.bodyScripts);
  }

  return parser.serialize();
};
