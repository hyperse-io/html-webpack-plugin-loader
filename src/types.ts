/**
 * The position of the script
 */
export type Position = 'beginning' | 'end';

/**
 * The base script item
 */
export type HtmlItemBase = {
  /**
   * The id of the script
   */
  id: string;
  /**
   * The position of the script, 'beginning' for beginning of head, 'end' for end of head
   * The position of the script, 'beginning' for beginning of body, 'end' for end of body
   */
  position: Position;
  /**
   * The order of the script, smaller numbers are loaded first
   */
  order?: number;
};

export type StyleItem = HtmlItemBase & {
  /**
   * The href of the style
   */
  href: string;
};

/**
 * The inline style item
 */
export type StyleInlineItem = HtmlItemBase & {
  /**
   * The content of the style
   */
  content: string;
};

/**
 * The inline script item
 */
export type ScriptionInlineItem = HtmlItemBase & {
  /**
   * The content of the script
   */
  content: string;
};

export type ScriptItem = HtmlItemBase & {
  /**
   * The src of the script, the id
   */
  src: string;
  /**
   * The type of the script
   */
  type?: string;
  /**
   * Whether the script should be loaded asynchronously
   */
  async?: boolean;
  /**
   * Whether the script should be loaded after the page has loaded
   */
  defer?: boolean;
  /**
   * The cross origin of the script
   */
  crossOrigin?: string;
  /**
   * The integrity of the script
   */
  integrity?: string;
  /**
   * The nonce of the script
   */
  nonce?: string;
};

/**
 * The favicon item
 */
export type FaviconItem = {
  /**
   * The href of the favicon
   */
  href: string;
  /**
   * The rel attribute of the favicon tag
   */
  rel: string;
  /**
   * The attributes of the favicon tag
   */
  attributes: Record<string, string>;
};

/**
 * The options for the template
 */
export interface TemplateOptions {
  /**
   * The title of the page
   */
  title?: string;
  /**
   * The favicon of the page
   */
  favicon?: FaviconItem;
  /**
   * The head html meta tags of the page
   */
  headMetaTags?: string[];
  /**
   * The head styles of the page
   */
  headStyles?: StyleItem[];
  /**
   * The head scripts of the page
   */
  headScripts?: ScriptItem[];
  /**
   * The body scripts of the page
   */
  bodyScripts?: ScriptItem[];
  /**
   * The head inline scripts
   */
  headInlineScripts?: ScriptionInlineItem[];
  /**
   * The head inline styles
   */
  headInlineStyles?: StyleInlineItem[];
}
