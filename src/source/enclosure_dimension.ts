import { length } from "src/units"

/**
 * Dimension guards for the enclosure records.
 *
 * `length` accepts any number, which is right for a coordinate but wrong for a
 * physical span: a wall cannot be -2mm thick, and an opening cannot be -5mm
 * wide. Such a value is always an authoring mistake, and left unchecked it
 * reaches a CSG kernel as an inside-out solid whose failure names a JSCAD
 * primitive rather than the field that was wrong.
 *
 * Kept out of `src/units` deliberately: these are the enclosure records'
 * expectations, not new general-purpose unit types.
 */
export const positive_length = length.refine(
  (v) => v > 0,
  "must be a positive length",
)

export const non_negative_length = length.refine(
  (v) => v >= 0,
  "must not be negative",
)
