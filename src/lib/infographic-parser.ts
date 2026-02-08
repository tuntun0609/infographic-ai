/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: <复杂项目> */
/**
 * Infographic DSL Parser & Serializer
 *
 * Parses the AntV Infographic DSL text format into structured data,
 * and serializes structured data back into DSL text.
 */

export interface InfographicItem {
  label?: string
  desc?: string
  value?: string
  icon?: string
  time?: string
  id?: string // for relation nodes
  children?: InfographicItem[]
}

export interface InfographicTheme {
  mode?: string // light/dark or omitted
  palette?: string[] // color values
  stylize?: string // rough/pattern/etc
}

export interface InfographicRelation {
  raw: string // raw relation line like "A - approves -> B"
}

export interface InfographicData {
  template: string
  title?: string
  desc?: string
  dataField: string // lists/sequences/compares/items/root/nodes/values
  items: InfographicItem[]
  relations?: InfographicRelation[]
  theme?: InfographicTheme
}

// Indentation helpers
const INDENT_REGEX = /^(\s*)/
function getIndent(line: string): number {
  const match = line.match(INDENT_REGEX)
  return match ? match[1].length : 0
}

/**
 * Parse an infographic DSL string into structured data.
 */
export function parseInfographic(content: string): InfographicData | null {
  const lines = content.split('\n')
  if (lines.length === 0) {
    return null
  }

  // Parse template name from first line
  const firstLine = lines[0].trim()
  if (!firstLine.startsWith('infographic ')) {
    return null
  }
  const template = firstLine.replace('infographic ', '').trim()

  let title: string | undefined
  let desc: string | undefined
  let dataField = 'items'
  let items: InfographicItem[] = []
  let relations: InfographicRelation[] = []
  let theme: InfographicTheme | undefined

  // Find sections: data and theme
  let dataStartLine = -1
  let themeStartLine = -1

  for (let i = 1; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (trimmed === 'data' && getIndent(lines[i]) === 0) {
      dataStartLine = i
    } else if (trimmed.startsWith('theme') && getIndent(lines[i]) === 0) {
      themeStartLine = i
    }
  }

  // Parse data section
  if (dataStartLine >= 0) {
    const dataEndLine =
      themeStartLine > dataStartLine ? themeStartLine : lines.length
    const dataLines = lines.slice(dataStartLine + 1, dataEndLine)

    // Parse top-level data fields (title, desc, and data field)
    let i = 0
    while (i < dataLines.length) {
      const line = dataLines[i]
      const trimmed = line.trim()
      if (!trimmed) {
        i++
        continue
      }

      const indent = getIndent(line)
      if (indent === 2) {
        if (trimmed.startsWith('title ')) {
          title = trimmed.replace('title ', '')
        } else if (trimmed.startsWith('desc ')) {
          desc = trimmed.replace('desc ', '')
        } else if (trimmed.startsWith('order ')) {
          // skip order directive
        } else if (
          [
            'lists',
            'sequences',
            'compares',
            'items',
            'values',
            'nodes',
          ].includes(trimmed)
        ) {
          dataField = trimmed
          // Parse items array starting from next line
          i++
          items = parseItemsList(dataLines, i, 4)
          break
        } else if (trimmed === 'root') {
          dataField = 'root'
          // Parse root as a single item with children
          i++
          const rootItem = parseRootItem(dataLines, i, 4)
          if (rootItem) {
            items = [rootItem]
          }
          break
        } else if (trimmed === 'relations') {
          // We already parsed nodes above, now parse relations
          // This case shouldn't hit because 'nodes' breaks early
        }
      }
      i++
    }

    // For relation templates, parse both nodes and relations
    if (template.startsWith('relation-')) {
      items = []
      relations = []
      let parsingNodes = false
      let parsingRelations = false
      let nodesStartIdx = -1

      for (let j = 0; j < dataLines.length; j++) {
        const line = dataLines[j]
        const trimmed = line.trim()
        const indent = getIndent(line)

        if (indent === 2 && trimmed === 'nodes') {
          parsingNodes = true
          parsingRelations = false
          dataField = 'nodes'
          nodesStartIdx = j + 1
        } else if (indent === 2 && trimmed === 'relations') {
          if (parsingNodes && nodesStartIdx >= 0) {
            items = parseItemsList(dataLines, nodesStartIdx, 4)
          }
          parsingNodes = false
          parsingRelations = true
        } else if (parsingRelations && indent >= 4) {
          relations.push({ raw: trimmed })
        }
      }

      // If nodes were the last section
      if (parsingNodes && nodesStartIdx >= 0 && items.length === 0) {
        items = parseItemsList(dataLines, nodesStartIdx, 4)
      }
    }
  }

  // Parse theme section
  if (themeStartLine >= 0) {
    theme = parseTheme(lines, themeStartLine)
  }

  return {
    template,
    title,
    desc,
    dataField,
    items,
    relations: relations.length > 0 ? relations : undefined,
    theme,
  }
}

/**
 * Parse a list of items starting at the given line index with expected indent.
 */
function parseItemsList(
  lines: string[],
  startIdx: number,
  baseIndent: number
): InfographicItem[] {
  const items: InfographicItem[] = []
  let i = startIdx

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed) {
      i++
      continue
    }

    const indent = getIndent(line)

    // If indent is less than baseIndent, we've exited this block
    if (indent < baseIndent) {
      break
    }

    if (indent === baseIndent && trimmed.startsWith('- ')) {
      // New item
      const item: InfographicItem = {}
      const firstField = trimmed.substring(2) // remove "- "
      parseItemField(item, firstField)

      // Parse subsequent fields at baseIndent + 2
      i++
      while (i < lines.length) {
        const nextLine = lines[i]
        const nextTrimmed = nextLine.trim()
        if (!nextTrimmed) {
          i++
          continue
        }

        const nextIndent = getIndent(nextLine)

        if (nextIndent <= baseIndent) {
          break // Back to same or higher level
        }

        if (nextIndent === baseIndent + 2) {
          if (nextTrimmed === 'children') {
            // Parse children items
            i++
            item.children = parseItemsList(lines, i, baseIndent + 4)
            // Skip past children
            while (i < lines.length) {
              const childLine = lines[i]
              if (!childLine.trim()) {
                i++
                continue
              }
              if (getIndent(childLine) <= baseIndent + 2) {
                break
              }
              i++
            }
          } else {
            parseItemField(item, nextTrimmed)
            i++
          }
        } else if (nextIndent > baseIndent + 2) {
          // skip deeper nested content we don't handle
          i++
        } else {
          break
        }
      }

      items.push(item)
    } else {
      i++
    }
  }

  return items
}

/**
 * Parse a root item (for hierarchy-* templates).
 */
function parseRootItem(
  lines: string[],
  startIdx: number,
  baseIndent: number
): InfographicItem | null {
  const item: InfographicItem = {}
  let i = startIdx

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed) {
      i++
      continue
    }

    const indent = getIndent(line)
    if (indent < baseIndent) {
      break
    }

    if (indent === baseIndent) {
      if (trimmed === 'children') {
        i++
        item.children = parseItemsList(lines, i, baseIndent + 2)
        break
      }
      parseItemField(item, trimmed)
    }
    i++
  }

  return item.label || item.children ? item : null
}

/**
 * Parse a single field like "label Foo" and set it on the item.
 */
function parseItemField(item: InfographicItem, field: string) {
  const spaceIndex = field.indexOf(' ')
  if (spaceIndex === -1) {
    return
  }

  const key = field.substring(0, spaceIndex)
  const val = field.substring(spaceIndex + 1)

  switch (key) {
    case 'label':
      item.label = val
      break
    case 'desc':
      item.desc = val
      break
    case 'value':
      item.value = val
      break
    case 'icon':
      item.icon = val
      break
    case 'time':
      item.time = val
      break
    case 'id':
      item.id = val
      break
    default:
      // Ignore unknown field types
      break
  }
}

/**
 * Parse theme section.
 */
function parseTheme(lines: string[], themeLineIdx: number): InfographicTheme {
  const theme: InfographicTheme = {}
  const themeLine = lines[themeLineIdx].trim()

  // "theme" or "theme light" or "theme dark"
  const themeParts = themeLine.split(' ')
  if (themeParts.length > 1) {
    theme.mode = themeParts[1]
  }

  let i = themeLineIdx + 1
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed) {
      i++
      continue
    }

    const indent = getIndent(line)
    if (indent === 0) {
      break // New top-level section
    }

    if (indent === 2) {
      if (trimmed.startsWith('palette')) {
        const inlineVal = trimmed.replace('palette', '').trim()
        if (inlineVal) {
          // Inline palette like "palette antv" or "palette #fff,#000,..."
          if (inlineVal.includes(',') || inlineVal.startsWith('#')) {
            theme.palette = inlineVal.split(',').map((c) => c.trim())
          } else {
            theme.palette = [inlineVal]
          }
        } else {
          // Multi-line palette
          theme.palette = []
          i++
          while (i < lines.length) {
            const pLine = lines[i]
            const pTrimmed = pLine.trim()
            if (!pTrimmed || getIndent(pLine) < 4) {
              break
            }
            if (pTrimmed.startsWith('- ')) {
              theme.palette.push(pTrimmed.substring(2).trim())
            }
            i++
          }
          continue
        }
      } else if (trimmed.startsWith('stylize ')) {
        theme.stylize = trimmed.replace('stylize ', '').trim()
      }
    }
    i++
  }

  return theme
}

/**
 * Serialize structured infographic data back into DSL string.
 */
export function serializeInfographic(data: InfographicData): string {
  const lines: string[] = []

  // Template line
  lines.push(`infographic ${data.template}`)

  // Data section
  lines.push('data')

  if (data.title) {
    lines.push(`  title ${data.title}`)
  }
  if (data.desc) {
    lines.push(`  desc ${data.desc}`)
  }

  if (data.dataField === 'root' && data.items.length > 0) {
    // Root structure (hierarchy-*)
    lines.push('  root')
    serializeRootItem(data.items[0], lines, 4)
  } else if (
    data.dataField === 'nodes' &&
    data.template.startsWith('relation-')
  ) {
    // Relation template with nodes + relations
    lines.push('  nodes')
    for (const item of data.items) {
      serializeItem(item, lines, 4)
    }
    if (data.relations && data.relations.length > 0) {
      lines.push('  relations')
      for (const rel of data.relations) {
        lines.push(`    ${rel.raw}`)
      }
    }
  } else {
    // Standard list-based data
    lines.push(`  ${data.dataField}`)
    for (const item of data.items) {
      serializeItem(item, lines, 4)
    }
  }

  // Theme section
  if (data.theme) {
    const { mode, palette, stylize } = data.theme
    const themeLine = mode ? `theme ${mode}` : 'theme'
    lines.push(themeLine)

    if (palette && palette.length > 0) {
      if (palette.length === 1 && !palette[0].startsWith('#')) {
        // Named palette like "antv"
        lines.push(`  palette ${palette[0]}`)
      } else {
        // Color list - use inline comma format
        lines.push(`  palette ${palette.join(',')}`)
      }
    }

    if (stylize) {
      lines.push(`  stylize ${stylize}`)
    }
  }

  return lines.join('\n')
}

function serializeItem(item: InfographicItem, lines: string[], indent: number) {
  const prefix = ' '.repeat(indent)
  const childPrefix = ' '.repeat(indent + 2)

  // First field on the "- " line
  const firstField = getFirstField(item)
  lines.push(`${prefix}- ${firstField}`)

  // Remaining fields
  const fields = getOtherFields(item)
  for (const f of fields) {
    lines.push(`${childPrefix}${f}`)
  }

  // Children
  if (item.children && item.children.length > 0) {
    lines.push(`${childPrefix}children`)
    for (const child of item.children) {
      serializeItem(child, lines, indent + 4)
    }
  }
}

function serializeRootItem(
  item: InfographicItem,
  lines: string[],
  indent: number
) {
  const prefix = ' '.repeat(indent)

  if (item.label) {
    lines.push(`${prefix}label ${item.label}`)
  }
  if (item.desc) {
    lines.push(`${prefix}desc ${item.desc}`)
  }
  if (item.icon) {
    lines.push(`${prefix}icon ${item.icon}`)
  }

  if (item.children && item.children.length > 0) {
    lines.push(`${prefix}children`)
    for (const child of item.children) {
      serializeItem(child, lines, indent + 2)
    }
  }
}

function getFirstField(item: InfographicItem): string {
  // Priority: id > label > time > desc > value > icon
  if (item.id) {
    return `id ${item.id}`
  }
  if (item.label) {
    return `label ${item.label}`
  }
  if (item.time) {
    return `time ${item.time}`
  }
  if (item.desc) {
    return `desc ${item.desc}`
  }
  if (item.value) {
    return `value ${item.value}`
  }
  if (item.icon) {
    return `icon ${item.icon}`
  }
  return 'label '
}

function getOtherFields(item: InfographicItem): string[] {
  const fields: string[] = []
  const first = getFirstFieldKey(item)

  if (item.id && first !== 'id') {
    fields.push(`id ${item.id}`)
  }
  if (item.label && first !== 'label') {
    fields.push(`label ${item.label}`)
  }
  if (item.time && first !== 'time') {
    fields.push(`time ${item.time}`)
  }
  if (item.desc && first !== 'desc') {
    fields.push(`desc ${item.desc}`)
  }
  if (item.value && first !== 'value') {
    fields.push(`value ${item.value}`)
  }
  if (item.icon && first !== 'icon') {
    fields.push(`icon ${item.icon}`)
  }

  return fields
}

function getFirstFieldKey(item: InfographicItem): string {
  if (item.id) {
    return 'id'
  }
  if (item.label) {
    return 'label'
  }
  if (item.time) {
    return 'time'
  }
  if (item.desc) {
    return 'desc'
  }
  if (item.value) {
    return 'value'
  }
  if (item.icon) {
    return 'icon'
  }
  return 'label'
}

/**
 * Get the expected data field name for a template.
 */
export function getDataFieldForTemplate(template: string): string {
  if (template.startsWith('list-')) {
    return 'lists'
  }
  if (template.startsWith('sequence-')) {
    return 'sequences'
  }
  if (template.startsWith('compare-')) {
    return 'compares'
  }
  if (template.startsWith('chart-')) {
    return 'values'
  }
  if (template.startsWith('relation-')) {
    return 'nodes'
  }
  if (template === 'hierarchy-structure') {
    return 'items'
  }
  if (template.startsWith('hierarchy-')) {
    return 'root'
  }
  return 'items'
}

/**
 * Template definitions grouped by category.
 */
export const TEMPLATE_GROUPS = [
  {
    label: '列表 (List)',
    templates: [
      'list-row-horizontal-icon-arrow',
      'list-column-done-list',
      'list-column-simple-vertical-arrow',
      'list-column-vertical-icon-arrow',
      'list-grid-badge-card',
      'list-grid-candy-card-lite',
      'list-grid-ribbon-card',
      'list-sector-plain-text',
      'list-zigzag-down-compact-card',
      'list-zigzag-down-simple',
      'list-zigzag-up-compact-card',
      'list-zigzag-up-simple',
    ],
  },
  {
    label: '序列 (Sequence)',
    templates: [
      'sequence-timeline-rounded-rect-node',
      'sequence-timeline-simple',
      'sequence-ascending-stairs-3d-underline-text',
      'sequence-ascending-steps',
      'sequence-circular-simple',
      'sequence-color-snake-steps-horizontal-icon-line',
      'sequence-cylinders-3d-simple',
      'sequence-filter-mesh-simple',
      'sequence-funnel-simple',
      'sequence-horizontal-zigzag-underline-text',
      'sequence-mountain-underline-text',
      'sequence-pyramid-simple',
      'sequence-roadmap-vertical-plain-text',
      'sequence-roadmap-vertical-simple',
      'sequence-snake-steps-compact-card',
      'sequence-snake-steps-simple',
      'sequence-snake-steps-underline-text',
      'sequence-stairs-front-compact-card',
      'sequence-stairs-front-pill-badge',
      'sequence-zigzag-pucks-3d-simple',
      'sequence-zigzag-steps-underline-text',
    ],
  },
  {
    label: '图表 (Chart)',
    templates: [
      'chart-bar-plain-text',
      'chart-column-simple',
      'chart-line-plain-text',
      'chart-pie-compact-card',
      'chart-pie-donut-pill-badge',
      'chart-pie-donut-plain-text',
      'chart-pie-plain-text',
      'chart-wordcloud',
    ],
  },
  {
    label: '对比 (Compare)',
    templates: [
      'compare-binary-horizontal-badge-card-arrow',
      'compare-binary-horizontal-simple-fold',
      'compare-binary-horizontal-underline-text-vs',
      'compare-hierarchy-left-right-circle-node-pill-badge',
      'compare-hierarchy-row-letter-card-rounded-rect-node',
      'compare-quadrant-quarter-circular',
      'compare-quadrant-quarter-simple-card',
      'compare-swot',
    ],
  },
  {
    label: '层级 (Hierarchy)',
    templates: [
      'hierarchy-mindmap-branch-gradient-capsule-item',
      'hierarchy-mindmap-level-gradient-compact-card',
      'hierarchy-structure',
      'hierarchy-tree-curved-line-rounded-rect-node',
      'hierarchy-tree-tech-style-badge-card',
      'hierarchy-tree-tech-style-capsule-item',
    ],
  },
  {
    label: '关系 (Relation)',
    templates: [
      'relation-dagre-flow-tb-animated-badge-card',
      'relation-dagre-flow-tb-animated-simple-circle-node',
      'relation-dagre-flow-tb-badge-card',
      'relation-dagre-flow-tb-simple-circle-node',
    ],
  },
] as const
