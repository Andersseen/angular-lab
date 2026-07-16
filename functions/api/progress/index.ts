import type { PagesFunction } from '@cloudflare/workers-types';
import { getAuthenticatedUserId } from '../_session';

interface Env {
  DB: D1Database;
}

interface ProgressRow {
  mission_id: string;
  current_step_id: string;
  step_code: string;
  completed: number;
  completed_at: number | null;
  updated_at: number;
}

interface ProgressPayload {
  missionId: unknown;
  currentStepId: unknown;
  stepCode: unknown;
  completed: unknown;
  updatedAt: unknown;
}

const MAX_STEP_CODE_LENGTH = 200_000;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function unauthorized(): Response {
  return json({ error: 'Authentication required.' }, 401);
}

function parseStepCode(raw: string): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch {
    // Fall through to the default.
  }
  return {};
}

function rowToEntry(row: ProgressRow) {
  return {
    missionId: row.mission_id,
    currentStepId: row.current_step_id,
    stepCode: parseStepCode(row.step_code),
    completed: row.completed === 1,
    completedAt: row.completed_at,
    updatedAt: row.updated_at,
  };
}

function validatePayload(payload: ProgressPayload): string | undefined {
  if (typeof payload.missionId !== 'string' || payload.missionId.length === 0 || payload.missionId.length > 200) {
    return 'missionId must be a non-empty string.';
  }
  if (typeof payload.currentStepId !== 'string') {
    return 'currentStepId must be a string.';
  }
  if (
    typeof payload.stepCode !== 'object' ||
    payload.stepCode === null ||
    Array.isArray(payload.stepCode) ||
    !Object.values(payload.stepCode).every((value) => typeof value === 'string')
  ) {
    return 'stepCode must be an object mapping step ids to code strings.';
  }
  if (JSON.stringify(payload.stepCode).length > MAX_STEP_CODE_LENGTH) {
    return 'stepCode is too large.';
  }
  if (typeof payload.completed !== 'boolean') {
    return 'completed must be a boolean.';
  }
  if (typeof payload.updatedAt !== 'number' || !Number.isFinite(payload.updatedAt) || payload.updatedAt < 0) {
    return 'updatedAt must be a non-negative number.';
  }
  return undefined;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return unauthorized();
    }

    const { results } = await env.DB.prepare(
      `SELECT mission_id, current_step_id, step_code, completed, completed_at, updated_at
       FROM progress
       WHERE user_id = ?
       ORDER BY updated_at DESC`
    )
      .bind(userId)
      .all<ProgressRow>();

    return json({ progress: (results ?? []).map(rowToEntry) });
  } catch (error) {
    console.error('Progress GET error:', error);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const userId = await getAuthenticatedUserId(request, env);
    if (!userId) {
      return unauthorized();
    }

    let payload: ProgressPayload;
    try {
      payload = (await request.json()) as ProgressPayload;
    } catch {
      return json({ error: 'Invalid JSON body.' }, 400);
    }

    const validationError = validatePayload(payload);
    if (validationError) {
      return json({ error: validationError }, 400);
    }

    const missionId = payload.missionId as string;
    const updatedAt = payload.updatedAt as number;

    const existing = await env.DB.prepare(
      `SELECT mission_id, current_step_id, step_code, completed, completed_at, updated_at
       FROM progress
       WHERE user_id = ? AND mission_id = ?`
    )
      .bind(userId, missionId)
      .first<ProgressRow>();

    // Never let an older entry overwrite a newer one (see specs/progress.md).
    if (existing && existing.updated_at > updatedAt) {
      return json({ progress: rowToEntry(existing), conflict: true });
    }

    const completed = payload.completed as boolean;
    const completedAt = completed ? (existing?.completed_at ?? Date.now()) : null;

    await env.DB.prepare(
      `INSERT OR REPLACE INTO progress
        (user_id, mission_id, current_step_id, step_code, completed, completed_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        userId,
        missionId,
        payload.currentStepId as string,
        JSON.stringify(payload.stepCode),
        completed ? 1 : 0,
        completedAt,
        updatedAt
      )
      .run();

    return json({
      progress: {
        missionId,
        currentStepId: payload.currentStepId,
        stepCode: payload.stepCode,
        completed,
        completedAt,
        updatedAt,
      },
    });
  } catch (error) {
    console.error('Progress PUT error:', error);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
};
