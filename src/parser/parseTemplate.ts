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
): TemplateParser => {
  const parser = new TemplateParser(htmlSource);

  // 1. Meta tags in head - processed first, important for SEO and viewport settings
  if (options.headMetaTags?.length) {
    parser.upsertHeadMetaTags(options.headMetaTags);
  }

  // 2. Favicon in head - processed second, typically placed early in <head> before title tag
  if (options.favicon) {
    parser.upsertFaviconTag(
      options.favicon.href,
      options.favicon.rel,
      options.favicon.attributes
    );
  }

  // 3. Title tag in head - processed third to ensure it appears at the beginning of <head>, after favicon tag
  if (options.title) {
    parser.upsertTitleTag(options.title);
  }

  // 4. External stylesheets in head- processed fourth, loaded before inline styles after title tag
  if (options.headStyles?.length) {
    parser.upsertHeadStyles(options.headStyles);
  }

  // 5. Inline styles in head- processed fifth, can override external styles after external styles tag
  if (options.headInlineStyles?.length) {
    parser.upsertHeadInlineStyles(options.headInlineStyles);
  }

  // 6. External scripts in head - processed sixth, loaded before inline scripts after inline styles tag
  if (options.headScripts?.length) {
    parser.upsertHeadScripts(options.headScripts);
  }

  // 7. Inline scripts in head - processed seventh, executed after external scripts after external scripts tag
  if (options.headInlineScripts?.length) {
    parser.upsertHeadInlineScripts(options.headInlineScripts);
  }

  // 8. Body scripts - processed last, typically placed at end of <body> for performance after inline scripts tag
  if (options.bodyScripts?.length) {
    parser.upsertBodyScripts(options.bodyScripts);
  }

  return parser;
};
