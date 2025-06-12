export type ScriptItem = {
  /**
   * The src of the script
   */
  src: string;
  /**
   * The position of the script, 'beginning' for beginning of head, 'end' for end of head
   * The position of the script, 'beginning' for beginning of body, 'end' for end of body
   */
  position: 'beginning' | 'end';
  /**
   * The order of the script, smaller numbers are loaded first
   */
  order?: number;
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
  favicon?: string;
  /**
   * The viewport of the page
   */
  viewport?: string;
  /**
   * The head inline scripts
   */
  headInlineScripts?: string[];
  /**
   * The head html meta tags of the page
   */
  headMetaTags?: string[];
  /**
   * The head styles of the page
   */
  headStyles?: string[];
  /**
   * The head scripts of the page
   */
  headScripts?: ScriptItem[];
  /**
   * The body scripts of the page
   */
  bodyScripts?: ScriptItem[];
}
