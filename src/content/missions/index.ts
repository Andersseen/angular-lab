import type { MissionMeta } from '../../app/core/models/mission.model';
import { ASYNC_DATA_MISSION } from './async-data';
import { COMPONENT_COMMUNICATION_MISSION } from './component-communication';
import { DATA_TABLE_SORT_MISSION } from './data-table-sort';
import { DEPENDENCY_INJECTION_MISSION } from './dependency-injection';
import { DERIVED_VALUES_MISSION } from './derived-values';
import { DOM_PLAYGROUND_MISSION } from './dom-playground';
import { EFFECT_SYNC_MISSION } from './effect-sync';
import { EVENTS_AND_STATE_MISSION } from './events-and-state';
import { FORM_VALIDATION_MISSION } from './form-validation';
import { LIST_SEARCH_MISSION } from './list-search';
import { ROUTING_MISSION } from './modern-routing';
import { REACTIVE_SIGNALS_MISSION } from './reactive-signals';

/**
 * The mission library. To add a mission, create a `./<id>.ts` file that exports a
 * `MissionMeta` and register it here — no engine/service code needs to change.
 * Order here is the authoring order; the catalog sorts for display by track + difficulty.
 */
export const MISSIONS: readonly MissionMeta[] = [
  // Track: Fundamentals
  DOM_PLAYGROUND_MISSION,
  EVENTS_AND_STATE_MISSION,
  REACTIVE_SIGNALS_MISSION,
  COMPONENT_COMMUNICATION_MISSION,

  // Track: Reactivity with Signals
  DERIVED_VALUES_MISSION,
  EFFECT_SYNC_MISSION,
  LIST_SEARCH_MISSION,
  DEPENDENCY_INJECTION_MISSION,

  // Track: Routing & Data
  ROUTING_MISSION,
  FORM_VALIDATION_MISSION,
  ASYNC_DATA_MISSION,
  DATA_TABLE_SORT_MISSION,
];
