import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { error } from "moo";

// Generate a unique ID for participants
const generateUid = () => {
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `P-${Date.now().toString().slice(-6)}-${rnd}`;
};

// Minimal persistent state in cookie; detailed logs in localStorage
const COOKIE_KEY = "merlin_study_state";

const DEFAULT_TASKS = [
  // Task 1 has two subtasks (Merlin and TikZ) with 10 min each; order randomized per participant
  { id: "task1", title: "Task 1 – Array Visualization", durationMin: 20, hasSubtasks: true, subtasks: [
    { id: "t1a-merlin", kind: "merlin", durationMin: 10 },
    { id: "t1b-tikz", kind: "tikz", durationMin: 10 },
  ]},
  // Task 2 – Binary Tree Traversal
  { id: "task2", title: "Task 2 – Binary Tree Traversal", durationMin: 20, kind: "merlin" },
  // Task 3 – Positioning and Text
  { id: "task3", title: "Task 3 – Positioning and Text", durationMin: 10, kind: "merlin" },
  // Task 4 – 123 Pattern: Applying Modifications
  { id: "task4", title: "Task 4 – 123 Pattern: Applying Modifications", durationMin: 10, kind: "merlin" },
  // Task 5 – Matrix Border Highlighting
  { id: "task5", title: "Task 5 – Matrix Border Highlighting", durationMin: 10, kind: "merlin" },
];

const StudyContext = createContext(null);

export function StudyProvider({ children }) {
  const posthog = usePostHog();
  
  // Check if PostHog is properly initialized
  const isPostHogReady = posthog && typeof posthog.capture === 'function';
  
  const [uid, setUid] = useState(() => {
    try {
      const existing = localStorage.getItem('merlin_study_uid');
      if (existing) return existing;
    } catch {}
    return generateUid();
  });
  
  // Callback to get current merlinCode (set by App.jsx)
  const [getCurrentMerlinCode, setGetCurrentMerlinCode] = useState(() => () => '');
  
  const [phase, setPhase] = useState(() => {
    try {
      const existing = localStorage.getItem('merlin_study_phase');
      if (existing) return existing;
    } catch {}
    return 'idle';
  });
  const [group, setGroup] = useState(null); // "merlin-first" | "tikz-first"
  const [taskIndex, setTaskIndex] = useState(0);
  const [subtaskIndex, setSubtaskIndex] = useState(0);
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [studyMode, setStudyMode] = useState(true);
  // Track when a task actually started to compute completion time
  const [taskStartMs, setTaskStartMs] = useState(null);
  // Admin mode state
  const [adminEnabled, setAdminEnabled] = useState(false);

  // Timer
  const [deadlineMs, setDeadlineMs] = useState(null);
  const [nowMs, setNowMs] = useState(Date.now());
  const timerRef = useRef(null);

  // Logs are stored per uid in localStorage; we buffer events in memory for low overhead
  const logSessionId = useMemo(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, []);
  const logBufferRef = useRef([]);

  // TikZ code per subtask; Merlin code handled externally via ParseCompileContext
  const [tikzCodeByTask, setTikzCodeByTask] = useState({});
  const [merlinCodeByTask, setMerlinCodeByTask] = useState({});
  const [codesLoaded, setCodesLoaded] = useState(false);
  const codesKey = useMemo(() => (uid ? `merlin_study_codes_${uid}` : null), [uid]);

  const currentTask = tasks[taskIndex] || null;
  const isCurrentTaskWithSubtasks = currentTask?.hasSubtasks === true;
  const currentSubtask = isCurrentTaskWithSubtasks ? currentTask.subtasks?.[subtaskIndex] : null;
  const currentKind = currentSubtask?.kind || currentTask?.kind || null; // "merlin" | "tikz"

  // Helpers
  const msRemaining = deadlineMs ? Math.max(0, deadlineMs - nowMs) : 0;
  const timeRemaining = {
    totalMs: msRemaining,
    min: Math.floor(msRemaining / 60000),
    sec: Math.floor((msRemaining % 60000) / 1000),
  };

  // Persist minimal state in cookie
  const persistCookie = (state) => {
    try {
      const data = {
        uid,
        phase,
        group,
        taskIndex,
        subtaskIndex,
        deadlineMs,
        ...state,
      };
      const encoded = encodeURIComponent(JSON.stringify(data));
      document.cookie = `${COOKIE_KEY}=${encoded}; max-age=31536000; path=/`;
    } catch {}
  };

  const loadCookie = () => {
    try {
      const cookie = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE_KEY}=`));
      if (!cookie) return null;
      const raw = decodeURIComponent(cookie.split("=")[1]);
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };



  // Init from cookie or create new UID
  useEffect(() => {
    const saved = loadCookie();
    if (saved?.uid) {
      setUid(saved.uid);
      setPhase(saved.phase || "idle");
      setGroup(saved.group || null);
      // Ensure task order reflects saved group (affects subtask indexing and code keys)
      if (saved.group) {
        applyGroupToTasks(saved.group);
      }
      setTaskIndex(saved.taskIndex ?? 0);
      setSubtaskIndex(saved.subtaskIndex ?? 0);
      setDeadlineMs(saved.deadlineMs || null);
    } else {
      const newUid = generateUid();
      setUid(newUid);
      setPhase("idle");
      setGroup(null);
      persistCookie({ uid: newUid, phase: "idle" });
    }
  }, []);

  // Timer tick
  useEffect(() => {
    if (!deadlineMs) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setNowMs(Date.now()), 1000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [deadlineMs]);

  // Auto transition on timeout
  useEffect(() => {
    if (!deadlineMs) return;
    if (Date.now() >= deadlineMs) {
      handleTimeUp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowMs, deadlineMs]);

  // Logging helpers
  const logKey = useMemo(() => (uid ? `merlin_study_logs_${uid}` : null), [uid]);

  const flushLogs = () => {
    try {
      if (!logKey) return;
      const existing = JSON.parse(localStorage.getItem(logKey) || "[]");
      const merged = existing.concat(logBufferRef.current);
      localStorage.setItem(logKey, JSON.stringify(merged));
      logBufferRef.current = [];
    } catch {}
  };

  useEffect(() => {
    // Flush aggressively on common lifecycle events to avoid losing buffered logs
    const onBeforeUnload = () => flushLogs();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushLogs();
    };
    const onPageHide = () => flushLogs();
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    // Also flush periodically while there is buffered data (fallback for browsers throttling lifecycle events)
    const intervalId = setInterval(() => {
      if (logBufferRef.current && logBufferRef.current.length > 0) flushLogs();
    }, 5000);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      clearInterval(intervalId);
    };
  }, []);

  const logEvent = (type, payload = {}) => {
    const event = {
      t: Date.now(),
      sid: logSessionId,
      uid,
      phase,
      taskIndex,
      subtaskIndex,
      type,
      ...payload,
    };
    console.log('logEvent', event.type, event);
    
    // Send to PostHog if available
    try {
      if (isPostHogReady) {
        posthog.capture(type, {
          ...payload,
          session_id: logSessionId,
          user_id: uid,
          study_phase: phase,
          task_index: taskIndex,
          subtask_index: subtaskIndex,
          timestamp: event.t,
        });
      }
    } catch (error) {
      console.warn('Failed to send event to PostHog:', error);
    }
    
    // Also store locally
    logBufferRef.current.push(event);
    // Flush sooner to minimize data loss on refresh/navigation
    const criticalTypes = new Set(['start_task', 'done_clicked', 'advance_task', 'advance_subtask', 'study_finished', 'task_completed']);
    if (logBufferRef.current.length >= 10 || criticalTypes.has(type)) {
      flushLogs();
    }
  };

  // Public actions
  const applyGroupToTasks = (g) => {
    setTasks((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const t1 = clone[0];
      if (t1?.hasSubtasks && t1.subtasks?.length === 2) {
        // reset to default order first
        t1.subtasks = [...DEFAULT_TASKS[0].subtasks];
        if (g === "tikz-first") {
          t1.subtasks = [t1.subtasks[1], t1.subtasks[0]];
        }
      }
      return clone;
    });
  };

  const setExplicitGroup = (g) => {
    setGroup(g);
    applyGroupToTasks(g);
    persistCookie({ group: g });
    logEvent('group_set', { group: g });
  };

  const beginStudy = () => {
    // If group already chosen (explicit), reuse; else randomize
    setPhase("welcome");
    persistCookie({ phase: "welcome", group: "not-yet-set", deadlineMs: null });
    
    // Identify user in PostHog
    try {
      if (isPostHogReady) {
        posthog.identify(uid, {
          group: "not-yet-set",
          study_mode: true,
        });
      }
    } catch (error) {
      console.warn('Failed to identify user in PostHog:', error);
    }
    
    logEvent("begin_study", { group: "not-yet-set", studyMode: true });
  };

  const proceedToFirstExercise = () => {
    setPhase("pretask");
    setTaskIndex(0);
    setSubtaskIndex(0);
    setDeadlineMs(null);
    persistCookie({ phase: "pretask", taskIndex: 0, subtaskIndex: 0, deadlineMs: null });
    logEvent("to_first_exercise");
  };

  const startCurrentTaskOrSubtask = () => {
    const target = currentSubtask || currentTask;
    if (!target) return;
    const durationMs = (target.durationMin ?? currentTask?.durationMin ?? 0) * 60 * 1000;
    setPhase("task");
    setDeadlineMs(Date.now() + durationMs);
    setTaskStartMs(Date.now());
    persistCookie({ phase: "task", deadlineMs: Date.now() + durationMs, taskIndex, subtaskIndex });
    logEvent("start_task", { taskId: currentTask?.id, subtaskId: currentSubtask?.id || null, durationMs });
  };

  const handleDone = (reason = "user_done") => {
    logEvent("done_clicked", { reason });
    handleTimeUp();
  };

  const handleTimeUp = (currentMerlinCode = null) => {
    // Compute completion info before advancing
    try {
      const finishedAt = Date.now();
      const elapsedMs = taskStartMs ? Math.max(0, finishedAt - taskStartMs) : null;
      const key = `${currentTask?.id}:${subtaskIndex}`;
  const tikz = tikzCodeByTask[key] || "";
  const merlin = (currentMerlinCode != null ? currentMerlinCode : (typeof getCurrentMerlinCode === 'function' ? getCurrentMerlinCode() : "")) || merlinCodeByTask[key] || "";
      const taskId = currentTask?.id;
      const subtaskId = currentSubtask?.id || null;
      const kind = currentSubtask?.kind || currentTask?.kind || null;
      logEvent("task_completed", {
        taskId,
        subtaskId,
        kind,
        elapsedMs,
        deadlineMsOriginal: deadlineMs,
        tikzCodeLen: tikz.length,
        merlinCodeLen: merlin.length,
        tikzCode: tikz,
        merlinCode: merlin,
      });
      // Emit unified snapshots for each non-empty code with consistent shape
      if (taskId) {
        if (tikz && tikz.trim()) {
          logEvent("task_code_snapshot", { taskId, subtaskId, kind: 'tikz', code: tikz, codeLen: tikz.length });
        }
        if (merlin && merlin.trim()) {
          logEvent("task_code_snapshot", { taskId, subtaskId, kind: 'merlin', code: merlin, codeLen: merlin.length });
        }
      }
    } catch (error) {
      console.log("Error logging task completion", { taskId: currentTask?.id, subtaskId: currentSubtask?.id, kind: currentKind }, error );
    }
    setTaskStartMs(null);
    setDeadlineMs(null);
    // Advance to the next subtask/task or finish
    if (isCurrentTaskWithSubtasks && subtaskIndex + 1 < (currentTask?.subtasks?.length || 0)) {
      setSubtaskIndex((i) => i + 1);
      setPhase("pretask");
      persistCookie({ phase: "pretask", subtaskIndex: subtaskIndex + 1, deadlineMs: null });
      logEvent("advance_subtask");
    } else if (taskIndex + 1 < tasks.length) {
      setTaskIndex((i) => i + 1);
      setSubtaskIndex(0);
      setPhase("pretask");
      persistCookie({ phase: "pretask", taskIndex: taskIndex + 1, subtaskIndex: 0, deadlineMs: null });
      logEvent("advance_task");
    } else {
      setPhase("finished");
      persistCookie({ phase: "finished", deadlineMs: null });
      logEvent("study_finished");
      flushLogs();
    }
  };

  const saveTikzCode = (code) => {
    const key = `${currentTask?.id}:${subtaskIndex}`;
    setTikzCodeByTask((prev) => ({ ...prev, [key]: code }));
    try {
      if (codesKey) {
        const raw = localStorage.getItem(codesKey);
        const payload = raw ? JSON.parse(raw) : { tikz: {}, merlin: {} };
        payload.tikz = { ...(payload.tikz || {}), [key]: code };
        localStorage.setItem(codesKey, JSON.stringify(payload));
      }
    } catch {}
    console.log('tikzCodeByTask', tikzCodeByTask);
    logEvent("tikz_code_change", { codeLength: code?.length || 0 });
  };

  const getTikzCode = () => {
    const key = `${currentTask?.id}:${subtaskIndex}`;
    return tikzCodeByTask[key] || "";
  };

  const saveMerlinCode = (code) => {
    const key = `${currentTask?.id}:${subtaskIndex}`;
    setMerlinCodeByTask((prev) => ({ ...prev, [key]: code }));
  };

  const getMerlinCode = () => {
    const key = `${currentTask?.id}:${subtaskIndex}`;
    return merlinCodeByTask[key] || "";
  };

  // Persist codes to localStorage
  useEffect(() => {
    if (!codesKey) return;
    try {
      const payload = { tikz: tikzCodeByTask, merlin: merlinCodeByTask };
      localStorage.setItem(codesKey, JSON.stringify(payload));
    } catch {}
  }, [codesKey, tikzCodeByTask, merlinCodeByTask]);

  // Load codes from localStorage (merge; never overwrite in-memory values)
  useEffect(() => {
    if (!codesKey) return;
    try {
      const raw = localStorage.getItem(codesKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.tikz && typeof parsed.tikz === 'object') {
          setTikzCodeByTask(prev => ({ ...parsed.tikz, ...prev }));
        }
        if (parsed?.merlin && typeof parsed.merlin === 'object') {
          setMerlinCodeByTask(prev => ({ ...parsed.merlin, ...prev }));
        }
      }
      setCodesLoaded(true);
    } catch {
      // Ensure these critical events are persisted immediately so the inspector sees them
      flushLogs();
      setCodesLoaded(true);
    }
  }, [codesKey]);

  // Simple admin override via URL: ?admin=peach
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const admin = params.get('admin');
      if (admin === 'peach') {
        // expose a simple reset on window for admins
        window.__resetStudy = () => {
          document.cookie = `${COOKIE_KEY}=; max-age=0; path=/`;
          if (logKey) localStorage.removeItem(logKey);
          if (codesKey) localStorage.removeItem(codesKey);
          window.location.href = window.location.pathname;
        };
      }
    } catch {}
  }, [logKey, codesKey]);

  const exportLogs = () => {
    flushLogs();
    try {
      const data = localStorage.getItem(logKey) || "[]";
      const blob = new Blob([data], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${uid}_logs.json`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    } catch {}
  };

  // Centralized pending error coordination (shared for Merlin and TikZ)
  const pendingErrorRef = useRef({
    kind: null,       // 'merlin' | 'tikz'
    type: null,       // event type string
    payload: null,    // structured payload to be logged if timer elapses
    signature: null,  // dedupe key to avoid racing swaps
    timerId: null,
  });

  const computeSig = (type, payload) => {
    try {
      const base = `${type}:${payload?.error?.line || 0}:${payload?.error?.col || 0}:${(payload?.error?.message || '').slice(0, 120)}`;
      let h = 0;
      for (let i = 0; i < base.length; i++) { h = ((h << 5) - h) + base.charCodeAt(i); h |= 0; }
      return String(h);
    } catch { return '0'; }
  };

  // Remember the most recent error and arm a 1s timer; do not log yet
  const rememberError = (kind, type, payload) => {
    try {
      if (!kind || !type || !payload) return;
      // Clear any existing timer
      if (pendingErrorRef.current.timerId) {
        clearTimeout(pendingErrorRef.current.timerId);
        pendingErrorRef.current.timerId = null;
      }
      const signature = computeSig(type, payload);
      pendingErrorRef.current = { kind, type, payload, signature, timerId: null };
      // Arm timer for 1 second of inactivity
      pendingErrorRef.current.timerId = setTimeout(() => {
        const current = pendingErrorRef.current;
        if (!current) return;
        // If still the same pending error (no success/reset happened), finally log it
        try {
          logEvent(current.type, current.payload || {});
        } catch {}
        // Clear after logging
        pendingErrorRef.current = { kind: null, type: null, payload: null, signature: null, timerId: null };
      }, 3000);
    } catch {}
  };

  // Reset the 1s timer on each editor change (do not clear the pending error payload)
  const notifyEditorChange = (kind) => {
    try {
      const cur = pendingErrorRef.current;
      if (!cur || !cur.kind || cur.kind !== kind) return;
      if (cur.timerId) {
        clearTimeout(cur.timerId);
        cur.timerId = null;
      }
      // Re-arm for another 1s
      cur.timerId = setTimeout(() => {
        const current = pendingErrorRef.current;
        if (!current) return;
        try {
          console.warn("logging error", current.type, current.payload);
          logEvent(current.type, current.payload || {});
        } catch {}
        pendingErrorRef.current = { kind: null, type: null, payload: null, signature: null, timerId: null };
      }, 1000);
    } catch {}
  };

  // If a successful render/compile occurs inside the window, discard the pending error entirely
  const notifySuccess = (kind) => {
    try {
      const cur = pendingErrorRef.current;
      if (!cur || !cur.kind || cur.kind !== kind) return;
      if (cur.timerId) {
        clearTimeout(cur.timerId);
      }
      pendingErrorRef.current = { kind: null, type: null, payload: null, signature: null, timerId: null };
    } catch {}
  };

  // Admin override
  const enableAdmin = (password) => {
    if (password === 'wizard') {
      setAdminEnabled(true);
      return true;
    }
    return false;
  };
  const adminSetPosition = (ti, sti, newPhase = 'pretask') => {
    if (!adminEnabled) return;
    // Log admin jump with timing relative to current task
    try {
      const now = Date.now();
      const elapsedMs = phase === 'task' && taskStartMs ? Math.max(0, now - taskStartMs) : null;
      const remainingMs = deadlineMs ? Math.max(0, deadlineMs - now) : null;
      const fromTask = tasks[taskIndex];
      const fromSub = fromTask?.subtasks?.[subtaskIndex] || null;
      const toTask = tasks[ti];
      const toSub = toTask?.subtasks?.[Math.max(0, Math.min((toTask?.subtasks?.length || 1) - 1, sti))] || null;
      

      
      logEvent('admin_set_position', {
        from: {
          taskIndex,
          subtaskIndex,
          phase,
          taskId: fromTask?.id || null,
          subtaskId: fromSub?.id || null,
          kind: (fromSub?.kind || fromTask?.kind || null),
        },
        to: {
          taskIndex: ti,
          subtaskIndex: sti,
          phase: newPhase,
          taskId: toTask?.id || null,
          subtaskId: toSub?.id || null,
          kind: (toSub?.kind || toTask?.kind || null),
        },
        timing: {
          elapsedMs,
          remainingMs,
        },
      });
    } catch {}
    setTaskIndex(Math.max(0, Math.min(tasks.length - 1, ti)));
    const stLen = tasks[ti]?.subtasks?.length || 0;
    setSubtaskIndex(Math.max(0, Math.min(Math.max(0, stLen - 1), sti)));
    setPhase(newPhase);
    setDeadlineMs(null);
    persistCookie({ phase: newPhase, taskIndex: ti, subtaskIndex: sti, deadlineMs: null });
  };

  const resetForNewParticipant = () => {
    const newUid = generateUid();
    setUid(newUid);
    setPhase('idle');
    setTaskIndex(0);
    setSubtaskIndex(0);
    setDeadlineMs(null);
    setGroup(null);
    setAdminEnabled(false);
    persistCookie({ uid: newUid, phase: 'idle', taskIndex: 0, subtaskIndex: 0, deadlineMs: null, group: null });
    logEvent('new_participant');
  };

  const value = useMemo(() => ({
    // identity and state
    uid, phase, group, studyMode,
    taskIndex, subtaskIndex, tasks, currentTask, currentSubtask, currentKind,
    timeRemaining, deadlineMs,
    // actions
    beginStudy, proceedToFirstExercise, startCurrentTaskOrSubtask, handleDone, handleTimeUp,
    // code for tikz/merlin persistence
    tikzCode: getTikzCode(), saveTikzCode,
    saveMerlinCode, merlinCode: getMerlinCode(),
    // callback to get current merlinCode
    setCurrentMerlinCodeCallback: setGetCurrentMerlinCode,
    // logging
    logEvent, exportLogs, flushLogs,
    // admin
    adminEnabled, enableAdmin, adminSetPosition, resetForNewParticipant, setExplicitGroup,
    // internal state
    codesLoaded,
    // centralized error coordination
    rememberError,
    notifyEditorChange,
    notifySuccess,
  }), [
    uid,
    phase,
    group,
    studyMode,
    taskIndex,
    subtaskIndex,
    tasks,
    currentTask,
    currentSubtask,
    currentKind,
    timeRemaining.totalMs,
    // Ensure context updates immediately when code changes
    tikzCodeByTask,
    merlinCodeByTask,
    getCurrentMerlinCode,
    adminEnabled,
    codesLoaded,
  ]);

  return (
    <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy must be used within StudyProvider");
  return ctx;
}


