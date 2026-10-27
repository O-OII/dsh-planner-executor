/**
 * Host observation component of DSH Planner–Executor.
 *
 * It registers one small, pure session projection that attributes local child
 * catalog entries to the parent turn that created them, so the browser half can
 * show the most recent finished turn without reading history or guessing from
 * wall-clock windows. No status or verification files are written.
 * @module dsh-agent-activity
 */


import z from '@deepseek-ai/schemastery'

export const Config = z.object({
  locale: z.union(['auto', 'en', 'zh-CN']).default('zh-CN').volatile(),
}).i18n({
  en: { locale: 'Panel language (default Simplified Chinese); auto follows the DSH locale service' },
  zh: { locale: '面板语言（默认简体中文）；auto 跟随 DSH locale 服务' },
})

/** Cordis plugin name used by loader diagnostics. */
export const name = 'subagent-activity'

/** Wait for the web client bundle registry and the projection registry. */
export const inject = ['clientModules', 'sessionProjections']

/** Unique projection key; deliberately namespaced to avoid generic-key collisions. */
export const SUBAGENT_TURNS_KEY = 'localSubagentActivityTurns'

/** Local child creation version emitted by the shipped catalog writer. */
const LOCAL_CATALOG_VERSION = 0

/** Bound the diagnostic unknown list; unknown ids are never shown as a turn. */
const UNKNOWN_LIMIT = 64

/**
 * Throw a projection-schema validation error.
 * @param {string} message - validation detail.
 * @returns {never} never returns.
 */
function invalid(message) {
  throw new Error(`${SUBAGENT_TURNS_KEY}: ${message}`)
}

/**
 * Whether a value is a plain object (not array/null).
 * @param {unknown} value - candidate.
 * @returns {value is Record<string, unknown>} plain-object check.
 */
function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Require an exact key set; projection state is checkpointed and must not grow
 * silently.
 * @param {Record<string, unknown>} value - object.
 * @param {string[]} keys - exact keys.
 * @param {string} label - field path for errors.
 */
function exactKeys(value, keys, label) {
  if (!isRecord(value)) invalid(`${label} must be an object`)
  const actual = Object.keys(value)
  if (actual.length !== keys.length || keys.some((key) => !Object.hasOwn(value, key))) {
    invalid(`${label} must have exactly ${keys.join(', ')}`)
  }
}

/**
 * Require a non-negative safe integer.
 * @param {unknown} value - candidate.
 * @param {string} label - field path.
 * @returns {number} validated number.
 */
function safeCount(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) invalid(`${label} must be a non-negative safe integer`)
  return value
}

/**
 * Validate a finite non-negative timestamp.
 * @param {unknown} value - candidate.
 * @param {string} label - field path.
 * @returns {number | null} timestamp or null.
 */
function timestampOrNull(value, label) {
  if (value === null) return null
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) invalid(`${label} must be null or a non-negative timestamp`)
  return value
}

/**
 * Validate a child-id array: unique, non-empty strings.
 * @param {unknown} value - candidate.
 * @param {string} label - field path.
 * @returns {string[]} validated ids.
 */
function childIds(value, label) {
  if (!Array.isArray(value)) invalid(`${label} must be an array`)
  const seen = new Set()
  for (const id of value) {
    if (typeof id !== 'string' || id === '') invalid(`${label} must contain non-empty strings`)
    if (seen.has(id)) invalid(`${label} must not contain duplicate ids`)
    seen.add(id)
  }
  return value
}

/**
 * Validate one `{turn, childIds}` group.
 * @param {unknown} value - candidate.
 * @param {string} label - field path.
 * @returns {{ turn: number, childIds: string[] }} validated group.
 */
function turnGroup(value, label) {
  exactKeys(value, ['turn', 'childIds'], label)
  return { turn: safeCount(value.turn, `${label}.turn`), childIds: childIds(value.childIds, `${label}.childIds`) }
}

/**
 * Validate the bounded recent-groups array (newest first).
 * @param {unknown} value - candidate.
 * @param {string} label - field path.
 * @returns {Array<{ turn: number, childIds: string[] }>} validated groups.
 */
function recentTurns(value, label) {
  if (!Array.isArray(value) || value.length > 2) invalid(`${label} must be an array of at most two groups`)
  const turns = new Set()
  return value.map((group, index) => {
    const parsed = turnGroup(group, `${label}[${index}]`)
    if (turns.has(parsed.turn)) invalid(`${label} must not contain duplicate turns`)
    turns.add(parsed.turn)
    return parsed
  })
}

/**
 * Strict state schema consumed by `ctx.sessionProjections` (`.parse` is the
 * registry contract). It validates every field instead of passing values
 * through.
 */
export const stateSchema = {
  /**
   * @param {unknown} value - checkpoint or fold state.
   * @returns {Record<string, any>} validated state.
   */
  parse(value) {
    exactKeys(
      value,
      ['inheritedEventCount', 'currentTurn', 'currentTurnStartedAt', 'currentChildIds', 'lastTurns', 'unknownChildIds'],
      'state',
    )
    const inheritedEventCount = safeCount(value.inheritedEventCount, 'state.inheritedEventCount')
    const currentTurn = value.currentTurn === null ? null : safeCount(value.currentTurn, 'state.currentTurn')
    const currentTurnStartedAt = timestampOrNull(value.currentTurnStartedAt, 'state.currentTurnStartedAt')
    const currentChildIds = childIds(value.currentChildIds, 'state.currentChildIds')
    const lastTurns = recentTurns(value.lastTurns, 'state.lastTurns')
    const unknownChildIds = childIds(value.unknownChildIds, 'state.unknownChildIds')
    if (currentTurn === null && (currentTurnStartedAt !== null || currentChildIds.length > 0)) {
      invalid('state has current turn data without a currentTurn')
    }
    return {
      inheritedEventCount,
      currentTurn,
      currentTurnStartedAt,
      currentChildIds,
      lastTurns,
      unknownChildIds,
    }
  },
}

/**
 * Strict wire schema; only the current turn number, the last finished turn with
 * local children, and bounded unknown ids are published.
 */
export const viewSchema = {
  /**
   * @param {unknown} value - wire view.
   * @returns {Record<string, any>} validated view.
   */
  parse(value) {
    exactKeys(value, ['currentTurn', 'lastTurns', 'unknownChildIds'], 'view')
    return {
      currentTurn: value.currentTurn === null ? null : safeCount(value.currentTurn, 'view.currentTurn'),
      lastTurns: recentTurns(value.lastTurns, 'view.lastTurns'),
      unknownChildIds: childIds(value.unknownChildIds, 'view.unknownChildIds'),
    }
  },
}

/**
 * Attach one catalog child to the current turn only when the record is a
 * current-version local creation that is not a late/duplicate member.
 * @param {Record<string, any>} state - fold state.
 * @param {Record<string, any>} event - catalog event.
 * @returns {Record<string, any>} next state.
 */
function applyCatalog(state, event) {
  const data = event.data
  const childId = data?.childId
  if (typeof childId !== 'string' || childId === '') return state
  if (state.currentChildIds.includes(childId) || state.unknownChildIds.includes(childId)) return state
  if (state.lastTurns.some((group) => group.childIds.includes(childId))) return state

  const version = data?.version
  const mode = data?.mode
  const createdAt = data?.childCreatedAt
  const localMode = mode === 'one-shot' || mode === 'continuable'
  // Version 2 is an external execution with no local child. It is known to be
  // irrelevant rather than unknown.
  if (version === 2 || mode === 'external') return state
  // Only the version emitted by local creation is attributable. Migrated v1,
  // unknown modes, malformed timestamps, and children created before the
  // current turn started stay conservatively unknown.
  if (
    version !== LOCAL_CATALOG_VERSION ||
    !localMode ||
    typeof createdAt !== 'number' ||
    !Number.isFinite(createdAt) ||
    state.currentTurn === null ||
    state.currentTurnStartedAt === null ||
    createdAt < state.currentTurnStartedAt
  ) {
    if (state.unknownChildIds.length >= UNKNOWN_LIMIT) return state
    return { ...state, unknownChildIds: [...state.unknownChildIds, childId] }
  }
  return { ...state, currentChildIds: [...state.currentChildIds, childId] }
}

/**
 * Pure fold. Every unrelated event returns the same state reference so the
 * registry's Object.is gate publishes nothing.
 * @param {Record<string, any>} state - previous state.
 * @param {Record<string, any>} event - committed session event.
 * @returns {Record<string, any>} next state.
 */
export function foldSubagentTurns(state, event) {
  // Fork-inherited prefix: its parent history is not this child session's own
  // turns and must never populate a previous-turn group.
  if (typeof event?.seq === 'number' && event.seq < state.inheritedEventCount) return state

  if (event?.type === 'turn/start') {
    const turn = event.data?.turn
    if (!Number.isSafeInteger(turn) || turn < 0) return state
    const highest = Math.max(
      state.currentTurn ?? -1,
      ...state.lastTurns.map((group) => group.turn),
      -1,
    )
    // A replayed/old start must not move the fold backwards or reset a newer
    // current turn.
    if (turn <= highest) return state
    return {
      ...state,
      currentTurn: turn,
      currentTurnStartedAt: typeof event.time === 'number' && Number.isFinite(event.time) ? event.time : null,
      currentChildIds: [],
    }
  }

  if (event?.type === 'subagent/catalog') return applyCatalog(state, event)

  if (event?.type === 'turn/end') {
    const turn = event.data?.turn
    if (!Number.isSafeInteger(turn) || state.currentTurn === null || turn !== state.currentTurn) return state
    const lastTurns =
      state.currentChildIds.length === 0
        ? state.lastTurns
        : [{ turn: state.currentTurn, childIds: [...state.currentChildIds] }, ...state.lastTurns].slice(0, 2)
    return {
      ...state,
      currentTurn: null,
      currentTurnStartedAt: null,
      currentChildIds: [],
      lastTurns,
    }
  }

  return state
}

// Stable view per state object: snapshots must not manufacture a fresh object
// for an unchanged state and spuriously notify carriers.
const viewCache = new WeakMap()

/**
 * Memoized client view.
 * @param {Record<string, any>} state - validated fold state.
 * @returns {{ currentTurn: number | null, lastTurns: Array<{ turn: number, childIds: string[] }>, unknownChildIds: string[] }} wire view.
 */
export function viewSubagentTurns(state) {
  const cached = viewCache.get(state)
  if (cached !== undefined) return cached
  const view = {
    currentTurn: state.currentTurn,
    lastTurns: state.lastTurns,
    unknownChildIds: state.unknownChildIds,
  }
  viewCache.set(state, view)
  return view
}

/**
 * The projection definition registered with `ctx.sessionProjections`.
 * Contract fields match the host registry: key, stateVersion, stateSchema,
 * init(header, inheritedEventCount), synchronous apply, and wire schemas.
 */
export const localSubagentActivityTurnsDefinition = {
  key: SUBAGENT_TURNS_KEY,
  stateVersion: 2,
  stateSchema,
  /**
   * @param {Record<string, any>} _header - session header.
   * @param {number} inheritedEventCount - fork-inherited prefix length.
   * @returns {Record<string, any>} initial state.
   */
  init: (_header, inheritedEventCount) => ({
    inheritedEventCount: Number.isSafeInteger(inheritedEventCount) && inheritedEventCount >= 0 ? inheritedEventCount : 0,
    currentTurn: null,
    currentTurnStartedAt: null,
    currentChildIds: [],
    lastTurns: [],
    unknownChildIds: [],
  }),
  apply: foldSubagentTurns,
  wire: { viewSchema, view: viewSubagentTurns },
}

/**
 * Register the projection through the real registry entry point. The registry
 * owns replay/checkpointing; this function never reads history itself.
 * @param {{ register: (definition: Record<string, unknown>) => unknown } | undefined} registry - `ctx.sessionProjections`.
 * @returns {unknown} the registry disposer, when available.
 */
export function registerLocalSubagentActivityTurns(registry) {
  if (registry === undefined || registry === null || typeof registry.register !== 'function') return undefined
  return registry.register(localSubagentActivityTurnsDefinition)
}

/**
 * Mount the host half.
 * @param {import('@deepseek-ai/cordis').Context} ctx - host context.
 */
export function apply(ctx) {
  registerLocalSubagentActivityTurns(ctx.sessionProjections)
}
