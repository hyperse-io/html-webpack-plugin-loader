import type { DefaultTreeAdapterTypes } from 'parse5';
import { serialize } from 'parse5';
import type { ScriptItem } from '../types.js';
import { parseDocument } from '../utils/parseDocument.js';
import { upsertFavicon } from './upsertFavicon.js';
import { upsertHeadInlineScripts } from './upsertHeadInlineScripts.js';
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
   * @param favicon - The favicon to upsert
   * @returns The TemplateParser instance
   */
  public upsertFaviconTag(favicon: string): TemplateParser {
    upsertFavicon(this.head, favicon);
    return this;
  }

  /**
   * Upsert the viewport tag
   * @param viewport - The viewport to upsert
   * @returns The TemplateParser instance
   */
  public upsertViewportTag(viewport: string): TemplateParser {
    upsertHeadInlineScripts(this.head, [viewport]);
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
  public upsertHeadStyles(styles: string[]): TemplateParser {
    upsertHeadStyles(this.head, styles);
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
  public upsertHeadInlineScripts(scripts: string[]): TemplateParser {
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
