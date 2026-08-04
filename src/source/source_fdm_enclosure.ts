import type { Length } from "src/units"
import { non_negative_length, positive_length } from "./enclosure_dimension"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_fdm_enclosure = z
  .object({
    type: z.literal("source_fdm_enclosure"),
    source_fdm_enclosure_id: z.string(),
    source_assembly_device_id: z.string(),
    source_board_id: z.string(),
    name: z.string().optional(),
    width: positive_length.optional(),
    height: positive_length.optional(),
    depth: positive_length.optional(),
    wall_thickness: positive_length,
    floor_thickness: positive_length.optional(),
    lid_thickness: positive_length.optional(),
    board_clearance: non_negative_length.optional(),
    standoff_height: non_negative_length.optional(),
    top_headroom: non_negative_length.optional(),
    lid_lip_depth: non_negative_length.optional(),
    disable_cutouts: z.boolean().optional(),
  })
  .describe(
    "Defines an FDM enclosure associated with an assembly device and source board",
  )

export type SourceFdmEnclosureInput = z.input<typeof source_fdm_enclosure>
type InferredSourceFdmEnclosure = z.infer<typeof source_fdm_enclosure>

/**
 * Defines an FDM enclosure associated with an assembly device and source board.
 */
export interface SourceFdmEnclosure {
  type: "source_fdm_enclosure"
  source_fdm_enclosure_id: string
  source_assembly_device_id: string
  source_board_id: string
  name?: string
  width?: Length
  height?: Length
  depth?: Length
  wall_thickness: Length
  floor_thickness?: Length
  lid_thickness?: Length
  board_clearance?: Length
  standoff_height?: Length
  top_headroom?: Length
  lid_lip_depth?: Length
  disable_cutouts?: boolean
}

expectTypesMatch<SourceFdmEnclosure, InferredSourceFdmEnclosure>(true)
