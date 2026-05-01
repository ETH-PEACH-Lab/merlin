import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kfnqilfpltdaaxpmhjui.supabase.co";
const supabaseAnonKey = "sb_publishable_xEpOe2rXBUe34KtksX_SFw_ow-P1TQu";

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

function safeJsonParse(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function createSessionId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function getStudyMeta() {
  const params = new URLSearchParams(window.location.search);

  const participantId = params.get("participant") || "unknown_participant";
  const studyId = params.get("study") || "unknown_study";
  const condition = params.get("condition") || "default";

  const sessionStorageKey = `nnlive_session_${participantId}_${studyId}`;
  let sessionId =
    params.get("session") || localStorage.getItem(sessionStorageKey);

  if (!sessionId) {
    sessionId = createSessionId();
    localStorage.setItem(sessionStorageKey, sessionId);
  }

  return {
    participantId,
    studyId,
    condition,
    sessionId,
  };
}

const meta = getStudyMeta();

const EVENTS_KEY = `nnlive_events_${meta.participantId}_${meta.studyId}_${meta.sessionId}`;
const ACTIVE_TASK_KEY = `nnlive_active_task_${meta.participantId}_${meta.studyId}_${meta.sessionId}`;

export function getCodeStats(unparsedCode, pages) {
  return {
    codeLength: unparsedCode?.length || 0,
    lineCount: unparsedCode ? unparsedCode.split("\n").length : 0,
    pageCount: pages?.length || 0,
  };
}

export function readStudyEvents() {
  const parsed = safeJsonParse(localStorage.getItem(EVENTS_KEY), []);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed;
}

export function clearStudyEvents() {
  localStorage.removeItem(EVENTS_KEY);
  localStorage.removeItem(ACTIVE_TASK_KEY);
}

export function setActiveTask(task) {
  const activeTask = {
    id: task.id,
    title: task.title,
    startedAt: Date.now(),
    startedAtIso: new Date().toISOString(),
  };

  localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(activeTask));
  return activeTask;
}

export function getActiveTask() {
  return safeJsonParse(localStorage.getItem(ACTIVE_TASK_KEY), null);
}

export function clearActiveTask() {
  localStorage.removeItem(ACTIVE_TASK_KEY);
}

export function getActiveTaskElapsedMs() {
  const activeTask = getActiveTask();

  if (!activeTask?.startedAt) {
    return null;
  }

  return Date.now() - activeTask.startedAt;
}

export function recordStudyEvent(event, details = {}) {
  const activeTask = getActiveTask();

  const entry = {
    ...meta,
    event,
    timestamp: new Date().toISOString(),
    activeTaskId: activeTask?.id || null,
    activeTaskTitle: activeTask?.title || null,
    taskElapsedMs: getActiveTaskElapsedMs(),
    url: window.location.href,
    details,
  };

  const existingEvents = readStudyEvents();
  existingEvents.push(entry);

  localStorage.setItem(EVENTS_KEY, JSON.stringify(existingEvents));

  console.log("[study-event]", entry);
}

export async function submitStudyPayload(payload) {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const { error } = await supabase.from("study_submissions").insert({
    participant_id: payload.participantId,
    study_id: payload.studyId,
    condition: payload.condition,
    session_id: payload.sessionId,
    submitted_at: payload.submittedAt,
    payload,
  });

  if (error) {
    throw error;
  }

  return { submitted: true };
}

export function downloadStudyPayload(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${meta.participantId}_${meta.studyId}_${meta.sessionId}_study.json`;

  document.body.appendChild(link);
  link.click();

  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
}
