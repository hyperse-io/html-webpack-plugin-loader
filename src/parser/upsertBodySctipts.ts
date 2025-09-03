import { type DefaultTreeAdapterTypes } from 'parse5';
import type { ScriptItem } from '../types.js';
import { upsertScripts } from './upsertScripts.js';

/**
 * Updates the body scripts
 * @param body - The body element
 * @param scripts - The scripts to update
 * @returns The updated body element
 */
export const upsertBodySctipts = (
  body: DefaultTreeAdapterTypes.Element,
  scripts: ScriptItem[]
) => {
  return upsertScripts(body, scripts);
};
