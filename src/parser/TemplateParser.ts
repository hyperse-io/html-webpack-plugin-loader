import type { DefaultTreeAdapterTypes } from 'parse5';
import { serialize } from 'parse5';
import type {
  ScriptInlineItem,
  ScriptItem,
  StyleInlineItem,
  StyleItem,
} from '../types.js';
import { parseDocument } from '../utils/parseDocument.js';
import { upsertFavicon } from './upsertFavicon.js';
import { upsertHeadInlineScripts } from './upsertHeadInlineScripts.js';
import { upsertHeadInlineStyles } from './upsertHeadInlineStyles.js';
import { upsertHeadMetaTags } from './upsertHeadMetaTags.js';
import { upsertHeadStyles } from './upsertHeadStyles.js';
import { upsertScripts } from './upsertScripts.js';
import { upsertTitle } from './upsertTitle.js';

export class TemplateParser {
  private document: DefaultTreeAdapterTypes.Document;
  private head: DefaultTreeAdapterTypes.Element;
  private body: DefaultTreeAdapterTypes.Element;

  constructor(htmlSource: string) {
    const { document, head, body } = parseDocument(htmlSource);
    this.document = document;
    this.head = head;
    this.body = body;
  }

  /**
   * Upsert the title tag
   * @param title - The title to upsert
   * @returns The TemplateParser instance
   */
  public upsertTitleTag(title: string): TemplateParser {
    upsertTitle(this.head, title);
    return this;
  }

  /**
   * Upsert the favicon tag
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
   * Upsert the head before html tags
   * @param tags - The tags to upsert
   * @returns The TemplateParser instance
   */
  public upsertHeadMetaTags(tags: string[]): TemplateParser {
    upsertHeadMetaTags(this.head, tags);
    return this;
  }

  /**
   * Upsert the head before styles
   * @param styles - The styles to upsert
   * @returns The TemplateParser instance
   */
  public upsertHeadStyles(styles: StyleItem[]): TemplateParser {
    upsertHeadStyles(this.head, styles);
    return this;
  }

  /**
   * Upsert the head inline styles
   * @param styles - The styles to upsert
   * @returns The TemplateParser instance
   */
  public upsertHeadInlineStyles(styles: StyleInlineItem[]): TemplateParser {
    upsertHeadInlineStyles(this.head, styles);
    return this;
  }

  /**
   * Upsert the head before scripts
   * @param scripts - The scripts to upsert
   * @returns The TemplateParser instance
   */
  public upsertHeadScripts(scripts: ScriptItem[]): TemplateParser {
    upsertScripts(this.head, scripts);
    return this;
  }

  /**
   * Upsert the inline scripts
   * @param scripts - The scripts to upsert
   * @returns The TemplateParser instance
   */
  public upsertHeadInlineScripts(scripts: ScriptInlineItem[]): TemplateParser {
    upsertHeadInlineScripts(this.body, scripts);
    return this;
  }

  /**
   * Upsert the body after scripts
   * @param scripts - The scripts to upsert
   * @returns The TemplateParser instance
   */
  public upsertBodyScripts(scripts: ScriptItem[]): TemplateParser {
    upsertScripts(this.body, scripts);
    return this;
  }

  /**
   * Serialize the document to html string
   * @returns The serialized html string
   */
  public serialize(): string {
    return serialize(this.document);
  }
}
