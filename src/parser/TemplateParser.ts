import { type DefaultTreeAdapterTypes, parseFragment, serialize } from 'parse5';
import type {
  ScriptInlineItem,
  ScriptItem,
  StyleInlineItem,
  StyleItem,
} from '../types.js';
import { parseDocument } from '../utils/parseDocument.js';
import { sortDocument } from '../utils/sortDocument.js';
import { upsertBodySctipts } from './upsertBodySctipts.js';
import { upsertFavicon } from './upsertFavicon.js';
import { upsertHeadInlineScripts } from './upsertHeadInlineScripts.js';
import { upsertHeadInlineStyles } from './upsertHeadInlineStyles.js';
import { upsertHeadMetaTags } from './upsertHeadMetaTags.js';
import { upsertHeadStyles } from './upsertHeadStyles.js';
import { upsertScripts } from './upsertScripts.js';
import { upsertTitle } from './upsertTitle.js';

export class TemplateParser {
  protected readonly document: DefaultTreeAdapterTypes.Document;
  protected readonly head: DefaultTreeAdapterTypes.Element;
  protected readonly body: DefaultTreeAdapterTypes.Element;
  protected readonly html: DefaultTreeAdapterTypes.Element;

  constructor(htmlSource: string) {
    const { document, head, body, html } = parseDocument(htmlSource);
    this.document = document;
    this.html = html;
    this.head = head;
    this.body = body;
  }

  /**
   * Upsert the title tag - inserts at beginning of <head>
   * @param title - The title to upsert
   * @returns The TemplateParser instance
   */
  public upsertTitleTag(title: string): TemplateParser {
    upsertTitle(this.head, title);
    return this;
  }

  /**
   * Upsert the favicon tag - inserts at beginning of <head> after title tag
   * @param href - The favicon to upsert
   * @param rel - The rel attribute of the favicon tag
   * @param attributes - The attributes of the favicon tag
   * @returns The TemplateParser instance
   */
  public upsertFaviconTag(
    href: string,
    rel: string = 'icon',
    attributes: Record<string, string> = {}
  ): TemplateParser {
    upsertFavicon(this.head, href, rel, attributes);
    return this;
  }

  /**
   * Upsert meta tags in <head> - inserts at beginning for SEO priority
   * @param tags - The meta tags to upsert
   * @returns The TemplateParser instance
   */
  public upsertHeadMetaTags(tags: string[]): TemplateParser {
    upsertHeadMetaTags(this.head, tags);
    return this;
  }

  /**
   * Upsert external stylesheets in <head> - supports position-based insertion
   * @param styles - The external styles to upsert
   * @returns The TemplateParser instance
   */
  public upsertHeadStyles(styles: StyleItem[]): TemplateParser {
    upsertHeadStyles(this.head, styles);
    return this;
  }

  /**
   * Upsert inline styles in <head> - supports position-based insertion
   * @param styles - The inline styles to upsert
   * @returns The TemplateParser instance
   */
  public upsertHeadInlineStyles(styles: StyleInlineItem[]): TemplateParser {
    upsertHeadInlineStyles(this.head, styles);
    return this;
  }

  /**
   * Upsert external scripts in <head> - supports position-based insertion
   * @param scripts - The external scripts to upsert
   * @returns The TemplateParser instance
   */
  public upsertHeadScripts(scripts: ScriptItem[]): TemplateParser {
    upsertScripts(this.head, scripts);
    return this;
  }

  /**
   * Upsert inline scripts in <head> - supports position-based insertion
   * @param scripts - The inline scripts to upsert
   * @returns The TemplateParser instance
   */
  public upsertHeadInlineScripts(scripts: ScriptInlineItem[]): TemplateParser {
    upsertHeadInlineScripts(this.head, scripts);
    return this;
  }

  /**
   * Upsert scripts in <body> - supports position-based insertion, typically at end for performance
   * @param scripts - The scripts to upsert
   * @returns The TemplateParser instance
   */
  public upsertBodyScripts(scripts: ScriptItem[]): TemplateParser {
    upsertBodySctipts(this.body, scripts);
    return this;
  }

  /**
   * Serialize the document to html string
   * @returns The serialized html string
   */
  public serialize(): string {
    const sortedDocument = sortDocument(this.document);
    return serialize(sortedDocument);
  }

  /**
   * Parse a fragment of html
   * @param html - The html fragment to parse
   * @returns The parsed document fragment
   */
  public parseFragment(html: string): DefaultTreeAdapterTypes.DocumentFragment {
    return parseFragment(html);
  }
}
