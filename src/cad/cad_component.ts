import { z } from "zod"
import { point3, asset, type Point3, type Asset } from "../common"
import { rotation, length, type Rotation, type Length } from "../units"
import { layer_ref, type LayerRef } from "src/pcb"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  cad_model_axis_directions,
  type CadModelAxisDirection,
} from "./cad_model_conventions"

export const cad_component = z
  .object({
    type: z.literal("cad_component"),
    cad_component_id: z.string(),
    pcb_component_id: z.string(),
    source_component_id: z.string(),
    position: point3,
    rotation: point3.optional(),
    size: point3.optional(),
    layer: layer_ref.optional(),
    subcircuit_id: z.string().optional(),

    // These are all ways to generate/load the 3d model
    footprinter_string: z.string().optional(),
    model_obj_url: z.string().optional(),
    model_stl_url: z.string().optional(),
    model_3mf_url: z.string().optional(),
    model_gltf_url: z.string().optional(),
    model_glb_url: z.string().optional(),
    model_step_url: z.string().optional(),
    model_wrl_url: z.string().optional(),
    model_asset: asset.optional(),
    model_unit_to_mm_scale_factor: z.number().optional(),
    model_board_normal_direction: z
      .enum(cad_model_axis_directions)
      .optional()
      .describe(
        'The direction in the model\'s coordinate space that is considered "up" or "coming out of the board surface"',
      ),
    model_origin_position: point3.optional(),
    model_bounds: z
      .object({ min: point3, max: point3 })
      .optional()
      .describe(
        "Axis-aligned extent of the model measured in its own coordinate frame -- the same frame as model_origin_position, with model_board_normal_direction naming the axis that leaves the board (default z+). Because model_origin_position is the point placed on the board surface, a consumer can split the model about that surface without loading the mesh: for a positive normal the outward reach is max[axis] - origin[axis], and for a negative one it is origin[axis] - min[axis]. `size` cannot do this: it carries the extent but not where the box sits relative to the origin, and the box is generally not centered on it. These bounds are the model's own, before model_unit_to_mm_scale_factor and model_object_fit scaling are applied.",
      ),
    model_origin_alignment: z
      .enum([
        "unknown",
        "center",
        "center_of_component_on_board_surface",
        "bottom_center_of_component",
      ] as const)
      .optional(),
    model_object_fit: z
      .enum(["contain_within_bounds", "fill_bounds"] as const)
      .optional()
      .default("contain_within_bounds"),
    model_jscad: z.any().optional(),
    show_as_translucent_model: z.boolean().optional(),
    show_as_bounding_box: z.boolean().optional(),
    anchor_alignment: z
      .enum(["center", "center_of_component_on_board_surface"] as const)
      .optional()
      .default("center"),
  })
  .describe("Defines a component on the PCB")

export type CadComponentInput = z.input<typeof cad_component>
type InferredCadComponent = z.infer<typeof cad_component>

export type CadComponentAnchorAlignment = NonNullable<
  InferredCadComponent["anchor_alignment"]
>

export interface CadComponent {
  type: "cad_component"
  cad_component_id: string
  pcb_component_id: string
  source_component_id: string
  position: Point3
  rotation?: Point3
  size?: Point3
  layer?: LayerRef
  subcircuit_id?: string
  footprinter_string?: string
  model_obj_url?: string
  model_stl_url?: string
  model_3mf_url?: string
  model_gltf_url?: string
  model_glb_url?: string
  model_step_url?: string
  model_wrl_url?: string
  model_asset?: Asset
  model_unit_to_mm_scale_factor?: number
  model_board_normal_direction?: CadModelAxisDirection
  model_origin_position?: Point3
  model_bounds?: { min: Point3; max: Point3 }
  model_origin_alignment?:
    | "unknown"
    | "center"
    | "center_of_component_on_board_surface"
    | "bottom_center_of_component"
  model_object_fit: "contain_within_bounds" | "fill_bounds"
  model_jscad?: any
  show_as_translucent_model?: boolean
  show_as_bounding_box?: boolean
  anchor_alignment: CadComponentAnchorAlignment
}

expectTypesMatch<CadComponent, InferredCadComponent>(true)
