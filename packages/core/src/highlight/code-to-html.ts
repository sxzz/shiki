import type {
  CodeToHastOptions,
  ShikiInternal,
  ShikiTransformerContextCommon,
} from '@shikijs/types'
import { toHtml } from 'hast-util-to-html'
import { getIsAsync } from 'quansync'
import { quansync } from 'quansync/macro'
import { getTransformers } from './_get-transformers'
import { $codeToHast } from './code-to-hast'
import { codeToTokens } from './code-to-tokens'

export const hastToHtml = toHtml

/**
 * Get highlighted code in HTML.
 */
export const $codeToHtml = quansync(async (
  internal: ShikiInternal,
  code: string,
  options: CodeToHastOptions,
): Promise<string> => {
  const codeToHast = await getIsAsync() ? $codeToHast.async : $codeToHast.sync
  const context: ShikiTransformerContextCommon<boolean> = {
    meta: {},
    options,
    codeToHast: (_code, _options) => codeToHast(internal, _code, _options),
    codeToTokens: (_code, _options) => codeToTokens(internal, _code, _options),
  }

  let result = hastToHtml(await $codeToHast(internal, code, options, context))
  for (const transformer of getTransformers(options))
    result = await transformer.postprocess?.call(context, result, options) || result

  return result
})
