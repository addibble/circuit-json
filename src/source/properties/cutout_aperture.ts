import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const cutout_aperture_shapes = [
  "rect",
  "rounded_rect",
  "circle",
  "d_shape",
] as const

export type CutoutApertureShape = (typeof cutout_aperture_shapes)[number]

export interface CutoutAperture {
  shape: CutoutApertureShape
  width_mm?: number
  height_mm?: number
  diameter_mm?: number
  corner_radius_mm?: number
  flat_offset_mm?: number
  z_center_above_board_mm?: number
  margin_mm?: number
}

export const cutout_aperture = z.object({
  shape: z.enum(cutout_aperture_shapes),
  width_mm: z.number().optional(),
  height_mm: z.number().optional(),
  diameter_mm: z.number().optional(),
  corner_radius_mm: z.number().optional(),
  flat_offset_mm: z.number().optional(),
  z_center_above_board_mm: z.number().optional(),
  margin_mm: z.number().optional(),
})

type InferredCutoutAperture = z.infer<typeof cutout_aperture>

expectTypesMatch<CutoutAperture, InferredCutoutAperture>(true)
