import { z } from 'zod'

// 信息图的 schema（存储在 JSON 数组中）
export const InfographicSchema = z.object({
  id: z.string().describe('Unique identifier for the infographic'),
  content: z
    .string()
    .describe('The AntV Infographic syntax string for the infographic'),
})

// 创建 slide 的 schema
export const CreateSlideSchema = z.object({
  title: z.string().describe('The title of the slide'),
  infographics: z
    .array(InfographicSchema)
    .min(1)
    .describe('Array of infographics that make up the slide'),
})

// 更新 slide 的 schema（可以更新标题和信息图）
export const UpdateSlideSchema = z.object({
  id: z.string().describe('The ID of the slide to update'),
  infographic: z
    .object(InfographicSchema)
    .optional()
    .describe('The new infographic for the slide'),
})

// 删除 slide 的 schema
export const DeleteSlideSchema = z.object({
  id: z.string().describe('The ID of the slide to delete'),
})

export type Infographic = z.infer<typeof InfographicSchema>
export type CreateSlide = z.infer<typeof CreateSlideSchema>
export type UpdateSlide = z.infer<typeof UpdateSlideSchema>
export type DeleteSlide = z.infer<typeof DeleteSlideSchema>
