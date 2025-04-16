import type { ShikiTransformer, TransformerOptions } from '@shikijs/types'
import { transformerDecorations } from '../transformer-decorations'

const builtInTransformers: ShikiTransformer[] = [
  /* @__PURE__ */ transformerDecorations(),
]

export function getTransformers(options: TransformerOptions): ShikiTransformer<boolean>[] {
  return [
    ...options.transformers || [],
    ...builtInTransformers,
  ]
}
