import { type Length, length } from "src/units"
import { non_negative_length, positive_length } from "./enclosure_dimension"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

/**
 * Every aperture dimension is named `aperture_*` and is measured in the frame of
 * the enclosure face it pierces, never in board or enclosure axes, because the
 * same opening maps to different world axes on different faces:
 *
 * | Face | `width` | `height` | `depth` |
 * | --- | --- | --- | --- |
 * | `x_pos`, `x_neg` | Y | Z | X |
 * | `y_pos`, `y_neg` | X | Z | Y |
 * | `z_pos`, `z_neg` | part-local | part-local | Z |
 *
 * So on any side face `height` is the vertical (board Z) dimension and
 * `width` runs along the wall. The prefix keeps these distinct from an
 * enclosure's own width/height/depth, which are plain X/Y/Z.
 */
const source_cutout_aperture_base = z.object({
  type: z.literal("source_cutout_aperture"),
  source_cutout_aperture_id: z.string(),
  source_component_id: z.string(),
  margin: non_negative_length.optional(),
  /**
   * Move the opening's center across the face it pierces, along the same two
   * axes its width and height are measured in. Both may be negative.
   *
   * These replace an earlier z_extent_above_board, which only made sense on the
   * four walls: on the lid and the floor an opening does not move in Z at all,
   * so a "Z extent" had no meaning there.
   *
   * Zero means wherever the part puts it. On a side face the opening is centered
   * on the part's body above the board, taken from the model's measured bounds;
   * on the lid or the floor it is centered on the part's own position, and both
   * offsets turn with the part.
   *
   * height_dimension_offset runs outward from the mounting surface on a side
   * face -- up for a top-mounted part, down for a bottom-mounted one -- so, like
   * the default it shifts, it describes the part rather than where the part was
   * placed. A negative value pulls the opening back toward and past the board,
   * which is what a cable jacket fatter than its connector needs.
   */
  width_dimension_offset: length.optional(),
  height_dimension_offset: length.optional(),
  /**
   * Opening size along the normal of the face -- how far the cut is projected
   * inboard, so nothing inside the enclosure obstructs the part.
   *
   * This is the third aperture dimension, not a board-Z measurement: on a side
   * face it runs horizontally, along X or Y. The vertical dimension of a side
   * aperture is `height`.
   *
   * What it cuts is the material along that normal, which is generally not the
   * face it entered: a large `z_pos` opening in a corner relieves the side walls
   * it overlaps. It is rendered as authored, so a depth greater than the space
   * behind the face reaches the shell on the far side and cuts that too.
   *
   * Normally derived from the part's CAD body; authored only when that bounding
   * box is wrong for the purpose.
   */
  depth: non_negative_length.optional(),
})

export const source_cutout_aperture_rect = source_cutout_aperture_base.extend({
  shape: z.literal("rect"),
  width: positive_length,
  height: positive_length,
})

export const source_cutout_aperture_pill = source_cutout_aperture_base.extend({
  shape: z.literal("pill"),
  width: positive_length,
  height: positive_length,
})

export const source_cutout_aperture_circle = source_cutout_aperture_base.extend(
  {
    shape: z.literal("circle"),
    radius: positive_length,
  },
)

export const source_cutout_aperture = z
  .discriminatedUnion("shape", [
    source_cutout_aperture_rect,
    source_cutout_aperture_pill,
    source_cutout_aperture_circle,
  ])
  .describe(
    "Defines a part-owned aperture required in an enclosing mechanical body",
  )

export interface SourceApertureBase {
  type: "source_cutout_aperture"
  source_cutout_aperture_id: string
  source_component_id: string
  margin?: Length
  width_dimension_offset?: Length
  height_dimension_offset?: Length
  depth?: Length
}

export interface SourceRectCutoutAperture extends SourceApertureBase {
  shape: "rect"
  width: Length
  height: Length
}

export interface SourcePillCutoutAperture extends SourceApertureBase {
  shape: "pill"
  width: Length
  height: Length
}

export interface SourceCircleCutoutAperture extends SourceApertureBase {
  shape: "circle"
  radius: Length
}

/**
 * Defines a part-owned aperture required in an enclosing mechanical body.
 */
export type SourceCutoutAperture =
  | SourceRectCutoutAperture
  | SourcePillCutoutAperture
  | SourceCircleCutoutAperture

export type SourceCutoutApertureInput = z.input<typeof source_cutout_aperture>
type InferredSourceCutoutAperture = z.infer<typeof source_cutout_aperture>

expectTypesMatch<SourceCutoutAperture, InferredSourceCutoutAperture>(true)
