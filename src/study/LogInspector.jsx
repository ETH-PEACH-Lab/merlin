import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, IconButton, Stack, TextField, Typography, Select, MenuItem, Tabs, Tab, List, ListItemButton, ListItemText, Chip, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CodeEditor from '../components/CodeEditor';
import MermaidRenderer from '../components/MermaidRenderer';
import TikzRenderer from './TikzRenderer';
import parseText from '../parser/parseText.mjs';
import compiler from '../compiler/compiler.mjs';

function collectColumns(logs) { const cols = new Set(); logs.forEach(l => Object.keys(l).forEach(k => cols.add(k))); return Array.from(cols); }
function formatTime(t) { try { return new Date(t).toLocaleTimeString(); } catch { return t; } }

// Minimal CSV parser that handles quotes and commas inside quoted fields
function parseCSV(text) {
  const rows = [];
  let cur = '';
  let inQuotes = false;
  let row = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') { cur += '"'; i++; }
      else { inQuotes = !inQuotes; }
      continue;
    }
    if (!inQuotes && (ch === ',')) { row.push(cur); cur = ''; continue; }
    if (!inQuotes && (ch === '\n')) { row.push(cur); rows.push(row); row = []; cur = ''; continue; }
    if (!inQuotes && (ch === '\r') && next === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; i++; continue; }
    if (!inQuotes && (ch === '\r')) { row.push(cur); rows.push(row); row = []; cur = ''; continue; }
    cur += ch;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  const headers = (rows.shift() || []).map(h => (h || '').trim());
  const objects = rows.filter(r => r.some(cell => (cell||'').trim().length)).map(r => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = r[idx] === undefined ? '' : r[idx]; });
    return obj;
  });
  return { headers, rows: objects };
}

function toNumberOrNull(v) { const n = Number(v); return Number.isFinite(n) ? n : null; }
function parseTimestampMs(v) {
  if (v == null) return null;
  if (typeof v === 'number') return v > 1e12 ? v : Math.round(v * 1000);
  const s = String(v).trim();
  if (!s) return null;
  // Numeric seconds or millis
  const maybeNum = Number(s);
  if (Number.isFinite(maybeNum)) return maybeNum > 1e12 ? maybeNum : Math.round(maybeNum * 1000);
  const d = Date.parse(s);
  return Number.isNaN(d) ? null : d;
}

function normalizeKind(k) { if (!k) return k; const s = String(k); return s.startsWith('merlin') ? 'merlin' : s; }

// Map PostHog CSV row objects into our internal log format
function mapPosthogRowsToLogs(rows) {
  const byUid = new Map();
  const find = (obj, keys) => {
    for (const k of keys) {
      const hit = Object.keys(obj).find(h => h === k || h.endsWith(`.${k}`));
      if (hit && obj[hit] != null && String(obj[hit]).length) return obj[hit];
    }
    return null;
  };
  rows.forEach(r => {
    // Event name
    const type = find(r, ['event']) || find(r, ['*\.event']);
    // Timestamps
    const tsRaw = find(r, ['*.properties.timestamp']);
    const t = parseTimestampMs(tsRaw);
    // UID / distinct id
    const uid = find(r, ['properties.user_id', 'distinct_id', '*.distinct_id', 'Person .id']) || find(r, ['*.properties.user_id']);
    if (!type || !t || !uid) return; // skip unusable
    const log = { t, type: String(type), uid: String(uid) };
    // Selected properties
    const phase = find(r, ['properties.study_phase']);
    if (phase) log.phase = phase;
    const taskIndex = find(r, ['properties.task_index']);
    if (taskIndex != null && String(taskIndex).length) log.taskIndex = toNumberOrNull(taskIndex);
    const subtaskIndex = find(r, ['properties.subtask_index']);
    if (subtaskIndex != null && String(subtaskIndex).length) log.subtaskIndex = toNumberOrNull(subtaskIndex);
    const taskId = find(r, ['properties.taskId']); if (taskId) log.taskId = taskId;
    const subtaskId = find(r, ['properties.subtaskId']); if (subtaskId) log.subtaskId = subtaskId;
    const kind = find(r, ['properties.kind']); if (kind) log.kind = normalizeKind(kind);
    const editor = find(r, ['properties.editor']); if (editor) log.editor = normalizeKind(editor);
    const reason = find(r, ['properties.reason']); if (reason) log.reason = reason;
    const durationMs = find(r, ['properties.durationMs']); if (durationMs != null) log.durationMs = toNumberOrNull(durationMs);
    const code = find(r, ['properties.code']); if (code) log.code = code;
    const codeLen = find(r, ['properties.codeLen', 'properties.codeLength']); if (codeLen != null) log.codeLen = toNumberOrNull(codeLen);
    const codeContext = find(r, ['properties.codeContext']); if (codeContext) log.codeContext = codeContext;
    const merlinCode = find(r, ['properties.merlinCode']); if (merlinCode) log.merlinCode = merlinCode;
    const merlinCodeLen = find(r, ['properties.merlinCodeLen']); if (merlinCodeLen != null) log.merlinCodeLen = toNumberOrNull(merlinCodeLen);
    const tikzCode = find(r, ['properties.tikzCode']); if (tikzCode) log.tikzCode = tikzCode;
    const tikzCodeLen = find(r, ['properties.tikzCodeLen']); if (tikzCodeLen != null) log.tikzCodeLen = toNumberOrNull(tikzCodeLen);
    // Error info (if present)
    const errLine = find(r, ['properties.error.line']); if (errLine != null) log.error = { ...(log.error||{}), line: toNumberOrNull(errLine) };
    const errCol = find(r, ['properties.error.col']); if (errCol != null) log.error = { ...(log.error||{}), col: toNumberOrNull(errCol) };
    const errMsg = find(r, ['properties.error.message']); if (errMsg) log.error = { ...(log.error||{}), message: errMsg };
    // Attach group if present
    const group = find(r, ['properties.group']); if (group) log.group = group;
    // Push to map
    if (!byUid.has(log.uid)) byUid.set(log.uid, []);
    byUid.get(log.uid).push(log);
  });
  // Sort each uid's logs by time
  const participants = Array.from(byUid.entries()).map(([uid, logs]) => ({ uid, logs: logs.sort((a,b)=>a.t-b.t), codes: {} }));
  return participants;
}

export default function LogInspector({ open, onClose, currentUid }) {
  const [rawLogs, setRawLogs] = useState([]);
  const [availableSets, setAvailableSets] = useState([]);
  const [activeUid, setActiveUid] = useState(currentUid || '');
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [visibleCols, setVisibleCols] = useState(['t','type','taskIndex','subtaskIndex','phase']);
  const [uploadMessage, setUploadMessage] = useState('');
  const [view, setView] = useState('logs'); // 'logs' | 'exercises' | 'cohort' | 'cohortCode'
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  // codesByTask structure: { [taskId]: { merlin?: string, tikz?: string, otherKinds... } }
  const [codesByTask, setCodesByTask] = useState({});
  const [fallbackCodesByTask, setFallbackCodesByTask] = useState({});
  const [selectedLogEntry, setSelectedLogEntry] = useState(null);
  const [exerciseCode, setExerciseCode] = useState('');
  const [copied, setCopied] = useState(false);
  // Render preview dialog state
  const [renderOpen, setRenderOpen] = useState(false);
  const [renderKind, setRenderKind] = useState(''); // 'merlin' | 'tikz'
  const [renderCode, setRenderCode] = useState('');
  const [renderMermaid, setRenderMermaid] = useState('');
  const [renderError, setRenderError] = useState('');
  const [renderPage, setRenderPage] = useState(1);
  const [renderPagesCount, setRenderPagesCount] = useState(1);
  const openRender = (kind, code) => {
    const kindNorm = (kind && typeof kind === 'string' && kind.startsWith('merlin')) ? 'merlin' : kind;
    setRenderKind(kindNorm || 'merlin');
    setRenderCode(code || '');
    setRenderMermaid('');
    setRenderError('');
    setRenderPage(1);
    setRenderPagesCount(1);
    if (!code || !code.trim()) {
      setRenderError('No code to render.');
      setRenderOpen(true);
      return;
    }
    if (kindNorm === 'tikz') {
      setRenderOpen(true);
      return;
    }
    try {
      const parsed = parseText(code);
      const { mermaidString, compiled_pages } = compiler(parsed);
      setRenderMermaid(mermaidString || '');
      setRenderPagesCount((compiled_pages && compiled_pages.length) ? compiled_pages.length : 1);
      setRenderOpen(true);
    } catch (e) {
      setRenderError('Failed to compile Merlin Lite code: ' + (e?.message || String(e)));
      setRenderOpen(true);
    }
  };

  // Cohort analysis state (multi-participant)
  const [cohortSets, setCohortSets] = useState([]); // [{ uid, logs }]
  const [cohortMessage, setCohortMessage] = useState('');
  const [hiddenUids, setHiddenUids] = useState([]); // list of hidden participants
  const [cohortOnlyCompleted, setCohortOnlyCompleted] = useState(false);
  const [cohortTaskFilter, setCohortTaskFilter] = useState(''); // e.g., task1 or task1:tikz
  const [cohortAttempts, setCohortAttempts] = useState([]); // aggregated rows
  // Cohort code per exercise
  const [cohortCodeTaskId, setCohortCodeTaskId] = useState('');
  const [cohortCodes, setCohortCodes] = useState([]); // [{ uid, taskId, kind, code, codeLen, source }]
  // Map uid -> group label ('A' for merlin first, 'B' for tikz first)
  const cohortGroups = useMemo(() => {
    const m = {};
    cohortSets.forEach(({ uid, logs }) => {
      const sorted = [...(logs || [])].sort((a, b) => (a.t || 0) - (b.t || 0));
      // Prefer the most recent explicit group_set event with a non-neutral group
      const lastGroupEvt = [...sorted].reverse().find(l => l?.type === 'group_set' && l.group && l.group !== 'not-yet-set');
      if (lastGroupEvt) {
        const g = String(lastGroupEvt.group || '').toLowerCase();
        m[uid] = g.includes('tikz') ? 'B' : (g.includes('merlin') ? 'A' : '');
        return;
      }
      // Fallback: infer from first start_task kind
      const firstKindStart = sorted.find(l => l?.type === 'start_task' && (l?.kind === 'tikz' || (typeof l?.kind === 'string' && l.kind.startsWith('merlin'))));
      if (firstKindStart) {
        const k = (typeof firstKindStart.kind === 'string' && firstKindStart.kind.startsWith('merlin')) ? 'merlin' : firstKindStart.kind;
        m[uid] = k === 'tikz' ? 'B' : 'A';
      } else {
        m[uid] = '';
      }
    });
    return m;
  }, [cohortSets]);

  const visibleCohortSets = useMemo(() => cohortSets.filter(s => !hiddenUids.includes(s.uid)), [cohortSets, hiddenUids]);
  const hideUid = (uid) => {
    setHiddenUids(prev => prev.includes(uid) ? prev : [...prev, uid]);
    setSelectedCohortUid(prev => (prev === uid ? '' : prev));
  };
  const unhideUid = (uid) => setHiddenUids(prev => prev.filter(u => u !== uid));
  const clearHidden = () => setHiddenUids([]);
  const [selectedCohortUid, setSelectedCohortUid] = useState('');
  const filteredCohortSets = useMemo(
    () => (selectedCohortUid ? visibleCohortSets.filter(s => s.uid === selectedCohortUid) : visibleCohortSets),
    [visibleCohortSets, selectedCohortUid]
  );

  const hideParticipantsWithOneOrLessAttempts = () => {
    try {
      const counts = new Map();
      cohortAttempts.forEach(a => {
        counts.set(a.uid, (counts.get(a.uid) || 0) + 1);
      });
      const toHide = visibleCohortSets
        .filter(s => (counts.get(s.uid) || 0) <= 1)
        .map(s => s.uid);
      if (!toHide.length) return;
      setHiddenUids(prev => Array.from(new Set([...(prev||[]), ...toHide])));
      // Clear selection if it becomes hidden
      setSelectedCohortUid(prev => (toHide.includes(prev) ? '' : prev));
    } catch {}
  };

  // Merge participants (combine two UIDs into one)
  const [mergeLeft, setMergeLeft] = useState('');
  const [mergeRight, setMergeRight] = useState('');
  const [mergeTarget, setMergeTarget] = useState('');
  const allUids = useMemo(() => Array.from(new Set(cohortSets.map(s => s.uid))).sort(), [cohortSets]);
  const mergeCodes = (a = {}, b = {}) => {
    const out = { ...(a || {}) };
    Object.entries(b || {}).forEach(([taskId, kinds]) => {
      const bucket = out[taskId] || {};
      Object.entries(kinds || {}).forEach(([kind, code]) => {
        const existing = bucket[kind];
        // prefer longer non-empty code
        if (!existing || (code && code.length > existing.length)) {
          bucket[kind] = code;
        }
      });
      out[taskId] = bucket;
    });
    return out;
  };
  const doMergeParticipants = () => {
    const left = mergeLeft.trim();
    const right = mergeRight.trim();
    if (!left || !right || left === right) return;
    const tgt = (mergeTarget.trim() || left);
    const leftEntry = cohortSets.find(s => s.uid === left);
    const rightEntry = cohortSets.find(s => s.uid === right);
    if (!leftEntry || !rightEntry) return;
    const merged = {
      uid: tgt,
      logs: [...(leftEntry.logs||[]), ...(rightEntry.logs||[])],
      codes: mergeCodes(leftEntry.codes, rightEntry.codes)
    };
    const remainder = cohortSets.filter(s => s.uid !== left && s.uid !== right);
    // If target already exists as separate, merge into it as well
    const existingTarget = remainder.find(s => s.uid === tgt);
    let newSets;
    if (existingTarget) {
      const updatedTarget = {
        uid: tgt,
        logs: [...(existingTarget.logs||[]), ...(merged.logs||[])],
        codes: mergeCodes(existingTarget.codes, merged.codes)
      };
      newSets = remainder.filter(s => s.uid !== tgt).concat(updatedTarget);
    } else {
      newSets = remainder.concat(merged);
    }
    setCohortSets(newSets);
    setHiddenUids(prev => prev.filter(u => u !== left && u !== right && u !== tgt));
    setCohortMessage(`Merged ${left} + ${right} into ${tgt}.`);
    // reset selectors
    setMergeLeft(''); setMergeRight(''); setMergeTarget('');
  };

  useEffect(() => {
    if (!open) return;
    const sets = [];
    const codes = {};
    for (let i=0;i<localStorage.length;i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('merlin_study_logs_')) {
        try {
          const logs = JSON.parse(localStorage.getItem(k) || '[]');
          const uid = k.replace('merlin_study_logs_','');
          sets.push({ uid, key:k, count: logs.length, logs });
        } catch {}
      } else if (k && k.startsWith('taskCode_')) {
        // Accept both formats:
        // 1) key: taskCode_task1_merlin -> value: "<code string>"
        // 2) key: taskCode_* -> value: { taskId, kind, code }
        try {
          const raw = localStorage.getItem(k);
          let parsed;
          try { parsed = JSON.parse(raw ?? ''); } catch { parsed = raw; }
          let codeStr = '';
          let taskId = '';
          let kind = '';
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            codeStr = parsed.code || '';
            taskId = parsed.taskId || '';
            kind = parsed.kind || '';
          } else if (typeof parsed === 'string') {
            codeStr = parsed;
            // Derive taskId/kind from key name: taskCode_<taskId>_<kind>
            const keyBody = k.slice('taskCode_'.length);
            const lastUnderscore = keyBody.lastIndexOf('_');
            if (lastUnderscore > 0) {
              taskId = keyBody.slice(0, lastUnderscore);
              kind = keyBody.slice(lastUnderscore + 1);
            }
          }
          if (codeStr && taskId) {
            const kindNorm = kind && kind.startsWith && kind.startsWith('merlin') ? 'merlin' : (kind || 'unknown');
            codes[taskId] = { ...(codes[taskId]||{}), [kindNorm]: codeStr };
          }
        } catch {}
      }
    }
    setAvailableSets(sets);
    setCodesByTask(codes);
    if (sets.length === 0) {
      setRawLogs([]);
      if (activeUid) setActiveUid('');
      return;
    }
    const firstNonEmpty = sets.find(s => s.count > 0) || sets[0];
    // Keep current if valid; else switch to first non-empty (otherwise first)
    const chosen = sets.find(s => s.uid === activeUid) || firstNonEmpty;
    if (chosen.uid !== activeUid) setActiveUid(chosen.uid);
    setRawLogs(chosen.logs);
  }, [open]);

  useEffect(() => {
    if (activeUid === '*') {
      // Aggregate all logs
      const agg = availableSets.flatMap(s => s.logs);
      setRawLogs(agg);
      return;
    }
    const chosen = availableSets.find(s => s.uid === activeUid);
    if (chosen) setRawLogs(chosen.logs);
  }, [activeUid, availableSets]);

  // Ensure activeUid always matches available sets to avoid MUI out-of-range warnings
  useEffect(() => {
    if (activeUid && activeUid !== '*' && !availableSets.some(s => s.uid === activeUid)) {
      const nextNonEmpty = availableSets.find(s=>s.count>0)?.uid || availableSets[0]?.uid || '';
      if (nextNonEmpty !== activeUid) setActiveUid(nextNonEmpty);
    }
  }, [activeUid, availableSets]);

  const allColumns = useMemo(() => collectColumns(rawLogs), [rawLogs]);
  const types = useMemo(() => Array.from(new Set(rawLogs.map(l=>l.type).filter(Boolean))).sort(), [rawLogs]);

  const filtered = useMemo(() => rawLogs.filter(l => {
    if (filter) { const blob = JSON.stringify(l).toLowerCase(); if (!blob.includes(filter.toLowerCase())) return false; }
    if (typeFilter && l.type !== typeFilter) return false; return true;
  }), [rawLogs, filter, typeFilter]);

  // Build exercise summaries whenever rawLogs change
  useEffect(() => {
    // We expect logs sorted by time; ensure order
    const sorted = [...rawLogs].sort((a,b)=> (a.t||0) - (b.t||0));
    const list = [];
    const currentByTaskIndex = new Map();
  const pushExercise = (ex) => { if (!ex.endTime) ex.endTime = ex.lastEventTime || ex.startTime; ex.durationMs = ex.endTime - ex.startTime; ex.primaryKind = ex.lastEditor || (ex.kindsUsed.has('merlin') ? 'merlin' : (Array.from(ex.kindsUsed)[0] || null)); list.push(ex); };
  sorted.forEach(l => {
      const tIdx = l.taskIndex;
      if (l.type === 'start_task') {
        // close previous exercise with same index if lingering
        if (currentByTaskIndex.has(tIdx)) {
          pushExercise(currentByTaskIndex.get(tIdx));
        }
        // Unique id: include start timestamp
        // Distinguish subtasks via subtaskId or kind so task1 merlin vs tikz separate
        const baseTaskId = l.taskId || `task${tIdx}`;
        const variantSuffix = l.subtaskId ? `:${l.subtaskId}` : (l.kind ? `:${l.kind}` : '');
        const taskId = baseTaskId + variantSuffix;
        currentByTaskIndex.set(tIdx, {
          id: `${l.uid}-${tIdx}-${taskId}-${l.t}`,
          taskIndex: tIdx,
          taskId,
          startTime: l.t,
          endTime: null,
          durationMs: null,
          events: 0,
          counts: {},
          firstPhase: l.phase,
          lastPhase: l.phase,
          lastEventTime: l.t,
          kindsUsed: new Set(),
          lastEditor: l.kind || null
        });
      }
      const ex = currentByTaskIndex.get(tIdx);
      if (ex) {
        ex.events += 1;
        ex.lastEventTime = l.t;
        ex.lastPhase = l.phase;
        ex.counts[l.type] = (ex.counts[l.type]||0)+1;
        if (l.editor) {
          const norm = l.editor.startsWith('merlin') ? 'merlin' : l.editor;
          ex.kindsUsed.add(norm);
          ex.lastEditor = norm;
        }
        if (l.type === 'done_clicked' || l.type === 'advance_task') {
          // finalize exercise
          ex.endTime = l.t;
          pushExercise(ex);
          currentByTaskIndex.delete(tIdx);
        }
      }
    });
    // finalize any open ones
    currentByTaskIndex.forEach(ex => pushExercise(ex));
    // derive high-level metrics
    list.forEach(ex => {
      ex.metrics = {
        parseErrors: (ex.counts['merlin_parse_error']||0) + (ex.counts['merlin_parse_error_immediate']||0),
        compileErrors: (ex.counts['merlin_compile_error']||0) + (ex.counts['merlin_compile_error_visible']||0) + (ex.counts['tikz_render_error']||0),
        suggestionsAccepted: ex.counts['suggest_accept']||0,
        copies: ex.counts['editor_copy']||0,
        pastes: ex.counts['editor_paste']||0,
        navigations: ex.counts['open_docs']+ex.counts['hover_link_open']||0
      };
    });
    setExercises(list);
    if (list.length && !selectedExerciseId) setSelectedExerciseId(list[0].id);
  }, [rawLogs, selectedExerciseId]);

  // Build fallback code snapshots from codeContext fields when explicit taskCode_ entry absent
  useEffect(() => {
    const latestByTask = {};
    rawLogs.forEach(l => {
      if (l.type === 'task_code_snapshot' && l.taskId && l.subtaskId && l.code) {
        // Key under the specific subtask variant
        const variantKey = `${l.taskId}:${l.subtaskId}`;
        latestByTask[variantKey] = l.code;
      } else if (l.codeContext && l.taskIndex != null) {
        // Fallback: infer from exercise mapping
        const ex = exercises.find(e => e.taskIndex === l.taskIndex);
        const taskId = ex?.taskId || `task${l.taskIndex}`;
        latestByTask[taskId] = l.codeContext;
      }
    });
    setFallbackCodesByTask(latestByTask);
  }, [rawLogs, exercises]);

  const selectedExercise = exercises.find(e => e.id === selectedExerciseId) || null;
  const exerciseLogs = useMemo(() => {
    if (!selectedExercise) return [];
  return rawLogs.filter(l => l.taskIndex === selectedExercise.taskIndex && l.t >= selectedExercise.startTime && l.t <= selectedExercise.endTime);
  }, [rawLogs, selectedExercise]);

  // Update code editor value when exercise changes
  useEffect(() => {
    if (selectedExercise) {
      const taskCodes = codesByTask[selectedExercise.taskId] || codesByTask[selectedExercise.taskId.split(':')[0]];
      // Also try base task id without suffix
      const baseId = selectedExercise.taskId.split(':')[0];
      const baseTaskCodes = taskCodes || codesByTask[baseId];
  if (taskCodes) {
        // Prefer primary kind, else first available
        const pk = selectedExercise.primaryKind;
        if (pk && taskCodes[pk]) {
          setExerciseCode(taskCodes[pk]);
          return;
        }
        const first = Object.values(taskCodes).find(v=>v && v.trim());
        if (first) { setExerciseCode(first); return; }
      } else if (baseTaskCodes) {
        const pk = selectedExercise.primaryKind;
        if (pk && baseTaskCodes[pk]) { setExerciseCode(baseTaskCodes[pk]); return; }
        const first = Object.values(baseTaskCodes).find(v=>v && v.trim());
        if (first) { setExerciseCode(first); return; }
      }
      const variantKey = selectedExercise.id.split('-').slice(2,3)[0];
      if (fallbackCodesByTask[variantKey]) {
        setExerciseCode(fallbackCodesByTask[variantKey]);
      } else if (fallbackCodesByTask[baseId]) {
        setExerciseCode(fallbackCodesByTask[baseId]);
      } else {
        setExerciseCode('');
      }
    } else {
      setExerciseCode('');
    }
  }, [selectedExercise, codesByTask, fallbackCodesByTask]);

  const handleCopyLog = () => {
    if (!selectedLogEntry) return;
    try { navigator.clipboard.writeText(JSON.stringify(selectedLogEntry, null, 2)); setCopied(true); setTimeout(()=>setCopied(false),1500); } catch {}
  };

  const toggleColumn = (col) => { setVisibleCols(cols => cols.includes(col)? cols.filter(c=>c!==col) : [...cols, col]); };

  const exportCSV = () => { if (!filtered.length) return; const cols = visibleCols; const header = cols.join(','); const rows = filtered.map(l => cols.map(c => JSON.stringify(l[c] ?? '')).join(',')); const blob = new Blob([header+'\n'+rows.join('\n')], { type:'text/csv' }); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${activeUid||'logs'}_filtered.csv`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),100); };
  const exportExerciseCSV = () => { if (!selectedExercise || !exerciseLogs.length) return; const cols = visibleCols; const header = cols.join(','); const rows = exerciseLogs.map(l => cols.map(c => JSON.stringify(l[c] ?? '')).join(',')); const blob = new Blob([header+'\n'+rows.join('\n')], { type:'text/csv' }); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`exercise_${selectedExercise.taskId}_logs.csv`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),100); };

  // ===== Cohort helpers =====
  const handleCohortUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setCohortMessage('');
    const readPromises = files.map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          const participants = [];
          // Build a code map from taskCode_* keys for this file
          const codeMap = {};
          Object.entries(json.localStorage || {}).forEach(([k,val]) => {
            if (k.startsWith('taskCode_')) {
              try {
                let parsed;
                try { parsed = JSON.parse(val ?? ''); } catch { parsed = val; }
                let codeStr = '';
                let taskId = '';
                let kind = '';
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                  codeStr = parsed.code || '';
                  taskId = parsed.taskId || '';
                  kind = parsed.kind || '';
                } else if (typeof parsed === 'string') {
                  codeStr = parsed;
                  const keyBody = k.slice('taskCode_'.length);
                  const lastUnderscore = keyBody.lastIndexOf('_');
                  if (lastUnderscore > 0) {
                    taskId = keyBody.slice(0, lastUnderscore);
                    kind = keyBody.slice(lastUnderscore + 1);
                  }
                }
                if (codeStr && taskId) {
                  const kindNorm = kind && kind.startsWith && kind.startsWith('merlin') ? 'merlin' : (kind || 'unknown');
                  codeMap[taskId] = { ...(codeMap[taskId]||{}), [kindNorm]: codeStr };
                }
              } catch {}
            }
          });
          // Now gather participants (logs) and attach the parsed codes
          Object.entries(json.localStorage || {}).forEach(([k,val]) => {
            if (k.startsWith('merlin_study_logs_')) {
              try {
                const logs = JSON.parse(val||'[]');
                const uid = k.replace('merlin_study_logs_','');
                participants.push({ uid, logs, codes: codeMap });
              } catch {}
            }
          });
          resolve(participants);
        } catch (err) {
          resolve([]);
        }
      };
      reader.readAsText(file);
    }));
    Promise.all(readPromises).then(results => {
      const merged = results.flat();
      setCohortSets(merged);
      setCohortMessage(`Loaded ${merged.length} participant set(s).`);
    });
  };

  // Build attempts whenever cohortSets or filters change
  useEffect(() => {
    if (!filteredCohortSets.length) { setCohortAttempts([]); return; }
    const attempts = [];
    filteredCohortSets.forEach(({ uid, logs }) => {
      const sorted = [...logs].sort((a,b)=> (a.t||0) - (b.t||0));
      const currentByIndex = new Map();
      const closeAttempt = (rec) => {
        if (!rec) return;
        if (!rec.endTime) rec.endTime = rec.lastTime || rec.startTime;
        rec.elapsedMs = rec.endTime - rec.startTime;
        // completed if we saw done_clicked or task_completed within window
        rec.completed = rec.counts['done_clicked']>0 || rec.counts['task_completed']>0;
        attempts.push(rec);
      };
      for (const l of sorted) {
        const idx = l.taskIndex;
        if (l.type === 'start_task') {
          if (currentByIndex.has(idx)) closeAttempt(currentByIndex.get(idx));
          const baseTaskId = l.taskId || `task${idx}`;
          const variantSuffix = l.subtaskId ? `:${l.subtaskId}` : (l.kind ? `:${l.kind}` : '');
          const taskId = baseTaskId + variantSuffix;
          currentByIndex.set(idx, {
            uid,
            taskIndex: idx,
            taskId,
            kind: l.kind || null,
            startTime: l.t,
            endTime: null,
            lastTime: l.t,
            counts: {}
          });
          continue;
        }
        const rec = currentByIndex.get(idx);
        if (!rec) continue;
        rec.lastTime = l.t;
        rec.counts[l.type] = (rec.counts[l.type]||0)+1;
        if (l.type === 'done_clicked' || l.type === 'advance_task') {
          rec.endTime = l.t;
          closeAttempt(rec);
          currentByIndex.delete(idx);
        }
      }
      currentByIndex.forEach(closeAttempt);
    });
    // Map to export shape and apply filters
    let rows = attempts.map(a => ({
      uid: a.uid,
      taskId: a.taskId,
      taskIndex: a.taskIndex,
      group: cohortGroups[a.uid] || '',
      startTime: a.startTime,
      endTime: a.endTime,
      elapsedMs: a.elapsedMs,
      completed: a.completed,
      parseErrors: (a.counts['merlin_parse_error']||0) + (a.counts['merlin_parse_error_immediate']||0),
      compileErrors: (a.counts['merlin_compile_error']||0) + (a.counts['merlin_compile_error_visible']||0) + (a.counts['tikz_render_error']||0),
      suggests: (a.counts['suggest_accept']||0),
      copies: (a.counts['editor_copy']||0),
      pastes: (a.counts['editor_paste']||0),
      docClicks: (a.counts['open_docs']||0) + (a.counts['hover_link_open']||0),
      events: Object.values(a.counts).reduce((s,n)=>s+n,0),
    }));
    if (cohortOnlyCompleted) rows = rows.filter(r => r.completed);
    if (cohortTaskFilter && cohortTaskFilter.trim()) {
      const q = cohortTaskFilter.trim().toLowerCase();
      rows = rows.filter(r => (r.taskId||'').toLowerCase().includes(q));
    }
    setCohortAttempts(rows);
  }, [filteredCohortSets, cohortOnlyCompleted, cohortTaskFilter, cohortGroups]);

  const exportCohortAttemptsCSV = () => {
    if (!cohortAttempts.length) return;
    const cols = ['uid','taskId','taskIndex','group','startTime','endTime','elapsedMs','completed','parseErrors','compileErrors','suggests','copies','pastes','docClicks','events'];
    const header = cols.join(',');
    const rows = cohortAttempts.map(r => cols.map(c => JSON.stringify(r[c] ?? '')).join(','));
    const blob = new Blob([header+'\n'+rows.join('\n')], { type:'text/csv' });
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='cohort_attempts.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),100);
  };

  const exportCohortLogsCSV = () => {
    if (!cohortSets.length) return;
    // Flatten all participant logs into one CSV for R
    const all = cohortSets.flatMap(s => s.logs.map(l => ({...l, uid: s.uid })));
    const cols = collectColumns(all);
    const header = cols.join(',');
    const rows = all.map(l => cols.map(c => JSON.stringify(l[c] ?? '')).join(','));
    const blob = new Blob([header+'\n'+rows.join('\n')], { type:'text/csv' });
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='cohort_all_logs.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),100);
  };

  // Upload PostHog CSV (works for both single-user logs and cohort participants)
  const handleUploadPosthogCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadMessage('');
    setCohortMessage('');
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        const parsed = parseCSV(text);
        const participants = mapPosthogRowsToLogs(parsed.rows);
        if (!participants.length) {
          setUploadMessage('No valid PostHog rows found.');
          return;
        }
        // Populate cohort view
        setCohortSets(participants);
        setCohortMessage(`Loaded ${participants.length} participant set(s) from PostHog CSV.`);
        // Also populate single-user selector for convenience
        const sets = participants.map(p => ({ uid: p.uid, key: `posthog_${p.uid}`, count: p.logs.length, logs: p.logs }));
        setAvailableSets(sets);
        const total = sets.reduce((a,s)=>a+s.count,0);
        const firstNonEmpty = sets.find(s=>s.count>0) || sets[0];
        if (sets.filter(s=>s.count>0).length > 1) setActiveUid('*'); else setActiveUid(firstNonEmpty?.uid || '');
        setRawLogs(firstNonEmpty?.logs || []);
        setUploadMessage(total?`Loaded ${total} PostHog log rows across ${sets.length} set(s).`:'No usable PostHog logs.');
      } catch (err) {
        setUploadMessage('Failed to parse PostHog CSV: ' + (err?.message || 'unknown error'));
      }
    };
    reader.readAsText(file);
  };

  // Default selection for cohort code task when attempts appear
  useEffect(() => {
    if (!cohortAttempts.length) { setCohortCodeTaskId(''); return; }
    if (!cohortCodeTaskId) {
      const first = cohortAttempts[0]?.taskId || '';
      setCohortCodeTaskId(first);
    }
  }, [cohortAttempts]);

  // Build cohort codes per selected exercise
  useEffect(() => {
    if (!cohortCodeTaskId || !filteredCohortSets.length) { setCohortCodes([]); return; }
    const baseTask = cohortCodeTaskId.split(':')[0];
    const suffix = cohortCodeTaskId.includes(':') ? cohortCodeTaskId.split(':').slice(1).join(':') : '';
    const kindFromSuffix = suffix && suffix.includes('-') ? suffix.split('-').slice(-1)[0] : (suffix === 'merlin' || suffix === 'tikz' ? suffix : '');
    const normalizeKind = (k) => (k && k.startsWith && k.startsWith('merlin') ? 'merlin' : k);
    const rows = [];
    filteredCohortSets.forEach(({ uid, logs, codes }) => {
      const attemptsForTask = cohortAttempts
        .filter(a => a.uid === uid && a.taskId === cohortCodeTaskId)
        .sort((a,b)=> (b.endTime||0)-(a.endTime||0));
      const attempt = attemptsForTask[0];
      if (!attempt) { rows.push({ uid, taskId: cohortCodeTaskId, kind: '', code: '', codeLen: 0, source: 'none' }); return; }
      const kindNorm = kindFromSuffix || normalizeKind(attempt.kind);
      const start = attempt.startTime, end = attempt.endTime || Number.MAX_SAFE_INTEGER;
      const sorted = [...logs].sort((a,b)=> (a.t||0)-(b.t||0));
      const inWindow = sorted.filter(l => (l.t||0) >= start && (l.t||0) <= end);
      // First, try to read from uploaded codes map (full code stored in localStorage backups)
      let codeFromMap = '';
      if (codes && (codes[cohortCodeTaskId] || codes[baseTask])) {
        const entry = codes[cohortCodeTaskId] || codes[baseTask];
        if (suffix && entry[suffix]) codeFromMap = entry[suffix];
        else if (kindNorm && entry[kindNorm]) codeFromMap = entry[kindNorm];
        else {
          const first = Object.values(entry).find(v => v && typeof v === 'string' && v.trim());
          if (first) codeFromMap = first;
        }
      }
      if (codeFromMap) {
        const code = codeFromMap;
        rows.push({ uid, taskId: cohortCodeTaskId, kind: kindNorm || '', code, codeLen: (code||'').length, source: 'localStorage' });
        return;
      }
      // Prefer task_code_snapshot events
      const matchingSnapshots = inWindow.filter(l => l.type === 'task_code_snapshot' && l.taskId === baseTask && (
        (suffix && (l.subtaskId === suffix || normalizeKind(l.kind) === suffix)) || (!suffix)
      ));
      let code = '';
      let source = 'none';
      if (matchingSnapshots.length) {
        const snap = matchingSnapshots[matchingSnapshots.length - 1];
        code = snap.code || '';
        source = 'snapshot';
      } else {
        // Fallback: last available codeContext in window, prefer matching editor kind
        const withContext = inWindow.filter(l => !!l.codeContext);
        let ctx = withContext.reverse().find(l => normalizeKind(l.editor) === kindNorm)?.codeContext;
        if (!ctx && withContext.length) ctx = withContext[0].codeContext;
        if (ctx) { code = ctx; source = 'context'; }
      }
      rows.push({ uid, taskId: cohortCodeTaskId, kind: kindNorm || '', code, codeLen: (code||'').length, source });
    });
    setCohortCodes(rows);
  }, [cohortCodeTaskId, filteredCohortSets, cohortAttempts]);

  const exportCohortCodesCSV = () => {
    if (!cohortCodes.length) return;
    const cols = ['uid','taskId','kind','codeLen','source','code'];
    const header = cols.join(',');
    const rows = cohortCodes.map(r => cols.map(c => JSON.stringify(r[c] ?? '')).join(','));
    const blob = new Blob([header+'\n'+rows.join('\n')], { type:'text/csv' });
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`cohort_codes_${(cohortCodeTaskId||'task').replace(/[^a-z0-9_:-]/gi,'_')}.csv`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),100);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadMessage('');
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        if (!json?.localStorage) {
          setUploadMessage('No localStorage object found in file.');
          return;
        }
        const sets=[];
        const codeMap={};
        Object.entries(json.localStorage).forEach(([k,val])=>{
          if(k.startsWith('merlin_study_logs_')) {
            try {
              const logs = JSON.parse(val||'[]');
              const uid=k.replace('merlin_study_logs_','');
              sets.push({ uid, key:k, count:logs.length, logs });
            } catch (err) {
              // Collect parse issues silently; could be non-array
            }
          } else if (k.startsWith('taskCode_')) {
            // Accept both value formats: plain string code, or JSON object { taskId, kind, code }
            try {
              let parsed;
              try { parsed = JSON.parse(val ?? ''); } catch { parsed = val; }
              let codeStr = '';
              let taskId = '';
              let kind = '';
              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                codeStr = parsed.code || '';
                taskId = parsed.taskId || '';
                kind = parsed.kind || '';
              } else if (typeof parsed === 'string') {
                codeStr = parsed;
                const keyBody = k.slice('taskCode_'.length);
                const lastUnderscore = keyBody.lastIndexOf('_');
                if (lastUnderscore > 0) {
                  taskId = keyBody.slice(0, lastUnderscore);
                  kind = keyBody.slice(lastUnderscore + 1);
                }
              }
              if (codeStr && taskId) {
                const kindNorm = kind && kind.startsWith && kind.startsWith('merlin') ? 'merlin' : (kind || 'unknown');
                codeMap[taskId] = { ...(codeMap[taskId]||{}), [kindNorm]: codeStr };
              }
            } catch {}
          }
        });
        if (sets.length) {
          setAvailableSets(sets);
          setCodesByTask(codeMap);
          // Prefer first non-empty set; if multiple sets, offer aggregate view '*'
          const firstNonEmpty = sets.find(s=>s.count>0) || sets[0];
          setActiveUid(firstNonEmpty.count && sets.filter(s=>s.count>0).length>1 ? '*' : firstNonEmpty.uid);
          setRawLogs(firstNonEmpty.logs);
          setFilter('');
          setTypeFilter('');
          const total = sets.reduce((a,s)=>a+s.count,0);
            setUploadMessage(total?`Loaded ${total} log entries across ${sets.length} set(s).`:'No log entries inside provided sets (all empty).');
        } else {
          setUploadMessage('No keys starting with "merlin_study_logs_" found.');
        }
      } catch (err) {
        setUploadMessage('Failed to parse JSON: '+(err?.message||'unknown error'));
      }
    };
    reader.readAsText(file);
  };

  if (!open) return null;

  return (
    <>
  <Box sx={{ position:'fixed', inset:0, bgcolor:'#0c0c0c', color:'#ddd', zIndex:1200, display:'flex', flexDirection:'column' }}>
      <Box sx={{ display:'flex', alignItems:'center', gap:2, p:1, borderBottom:'1px solid #222' }}>
        <Typography variant="h6" sx={{ flexGrow:1 }}>Log Inspector</Typography>
        <Tabs value={view} onChange={(e,v)=>setView(v)} textColor="inherit" indicatorColor="secondary" sx={{ minHeight:36, '& .MuiTab-root':{minHeight:36} }}>
          <Tab value="logs" label="Logs" />
          <Tab value="exercises" label={`Exercises (${exercises.length})`} />
          <Tab value="cohort" label="Cohort" />
          <Tab value="cohortCode" label="Cohort Code" />
        </Tabs>
        <Select size="small" value={(activeUid==='*'||availableSets.some(s=>s.uid===activeUid))?activeUid:''} onChange={e=>setActiveUid(e.target.value)} displayEmpty sx={{ minWidth:180 }}>
          {availableSets.filter(s=>s.count>0).length>1 && <MenuItem value="*">All ({availableSets.reduce((a,s)=>a+s.count,0)})</MenuItem>}
          {availableSets.map(s => <MenuItem key={s.uid} value={s.uid}>{s.uid} ({s.count})</MenuItem>)}
          {!availableSets.length && <MenuItem value="">(none)</MenuItem>}
        </Select>
        <TextField size="small" label="Filter" value={filter} onChange={e=>setFilter(e.target.value)} />
        <Select size="small" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} displayEmpty sx={{ minWidth:120 }}>
          <MenuItem value="">All types</MenuItem>
          {types.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
        <Button size="small" variant="outlined" component="label">Upload Backup<input hidden type="file" accept="application/json" onChange={handleUpload} /></Button>
        <Button size="small" variant="outlined" component="label">Upload PostHog CSV<input hidden type="file" accept=".csv,text/csv" onChange={handleUploadPosthogCSV} /></Button>
        {view==='logs' && <Button size="small" variant="outlined" onClick={exportCSV} disabled={!filtered.length}>Export CSV</Button>}
        {view==='exercises' && <Button size="small" variant="outlined" onClick={exportExerciseCSV} disabled={!exerciseLogs.length}>Export Exercise CSV</Button>}
        {view==='cohort' && (
          <>
            <Button size="small" variant="outlined" component="label">Upload Participants<input hidden type="file" accept="application/json" multiple onChange={(e)=>handleCohortUpload(e)} /></Button>
            <Button size="small" variant="outlined" onClick={()=>exportCohortAttemptsCSV()} disabled={!cohortAttempts.length}>Export Attempts CSV</Button>
            <Button size="small" variant="outlined" onClick={()=>exportCohortLogsCSV()} disabled={!cohortSets.length}>Export All Logs CSV</Button>
          </>
        )}
        {view==='cohortCode' && (
          <>
            <Button size="small" variant="outlined" component="label">Upload Participants<input hidden type="file" accept="application/json" multiple onChange={(e)=>handleCohortUpload(e)} /></Button>
            <Select size="small" value={cohortCodeTaskId} onChange={(e)=>setCohortCodeTaskId(e.target.value)} displayEmpty sx={{ minWidth:220 }}>
              <MenuItem value="">Select exercise</MenuItem>
              {Array.from(new Set(cohortAttempts.map(a=>a.taskId))).map(tid => (
                <MenuItem key={tid} value={tid}>{tid}</MenuItem>
              ))}
            </Select>
            <Button size="small" variant="outlined" onClick={()=>exportCohortCodesCSV()} disabled={!cohortCodes.length}>Export Codes CSV</Button>
          </>
        )}
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      {view==='logs' && (
        <>
          <Box sx={{ display:'flex', borderBottom:'1px solid #222', p:1, flexWrap:'wrap', gap:1 }}>
            {allColumns.map(c => (
              <FormControlLabel key={c} control={<Checkbox size="small" checked={visibleCols.includes(c)} onChange={()=>toggleColumn(c)} />} label={c} />
            ))}
          </Box>
          <Box sx={{ flex:1, overflow:'auto', fontSize:12, fontFamily:'Consolas, monospace', display:'flex', flexDirection:'column' }}>
            {uploadMessage && (
              <Box sx={{ p:1, borderBottom:'1px solid #222', fontStyle:'italic', opacity:0.8 }}>{uploadMessage}</Box>
            )}
            <table style={{ borderCollapse:'collapse', width:'100%' }}>
              <thead>
                <tr>
                  {visibleCols.map(c => <th key={c} style={{ position:'sticky', top:0, background:'#111', borderBottom:'1px solid #333', padding:'4px 6px', textAlign:'left' }}>{c==='t'?'time':c}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l,i) => (
                  <tr key={i} style={{ borderBottom:'1px solid #222', cursor:'pointer', backgroundColor: selectedLogEntry===l?'#222':'unset' }} onClick={()=>setSelectedLogEntry(l)}>
                    {visibleCols.map(c => (
                      <td key={c} style={{ padding:'2px 6px', verticalAlign:'top', whiteSpace:'pre-wrap' }}>
                        {c==='t' ? formatTime(l[c]) : typeof l[c] === 'object' ? JSON.stringify(l[c]) : String(l[c] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={visibleCols.length} style={{ padding:16, textAlign:'center', opacity:0.6 }}>
                    {rawLogs.length ? 'No log entries match current filters' : 'No log entries'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </Box>
        </>
      )}
      {view==='exercises' && (
        <Box sx={{ flex:1, display:'flex', minHeight:0 }}>
          <Box sx={{ width:300, borderRight:'1px solid #222', display:'flex', flexDirection:'column' }}>
            <Box sx={{ p:1, borderBottom:'1px solid #222', fontSize:12, opacity:0.8 }}>Exercises derived from logs</Box>
            <List dense disablePadding sx={{ flex:1, overflow:'auto' }}>
              {exercises.map((ex, idx) => {
                const s = formatTime(ex.startTime);
                const dur = ex.durationMs != null ? Math.round(ex.durationMs/1000) : 0;
                return (
                  <ListItemButton key={ex.id} selected={ex.id===selectedExerciseId} onClick={()=>setSelectedExerciseId(ex.id)} alignItems="flex-start" sx={{ py:0.5, px:1 }}>
                    <ListItemText
                      primary={<Box sx={{ display:'flex', gap:1, alignItems:'center' }}>
                        <span style={{ fontWeight:600 }}>
                          {idx === 0 ? 'Introduction' : (ex.taskId||`Task ${ex.taskIndex}`)}
                        </span>
                        <Chip size="small" label={`${dur}s`} sx={{ height:18 }} />
                      </Box>}
                      secondary={<Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, mt:0.5 }}>
                        <Chip size="small" label={`parse ${ex.metrics.parseErrors}`} color={ex.metrics.parseErrors?'warning':'default'} />
                        <Chip size="small" label={`compile ${ex.metrics.compileErrors}`} color={ex.metrics.compileErrors?'error':'default'} />
                        <Chip size="small" label={`suggest ${ex.metrics.suggestionsAccepted}`} />
                        <Chip size="small" label={`copy ${ex.metrics.copies}`} />
                        <Chip size="small" label={`paste ${ex.metrics.pastes}`} />
                        <Chip size="small" label={`nav ${ex.metrics.navigations}`} />
                      </Box>}
                      primaryTypographyProps={{ component: 'div' }}
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItemButton>
                );
              })}
              {!exercises.length && <Box sx={{ p:2, fontSize:12, opacity:0.6 }}>No exercises detected</Box>}
            </List>
          </Box>
          <Box sx={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
            {selectedExercise && (
              <>
                <Box sx={{ p:1, borderBottom:'1px solid #222', display:'flex', flexDirection:'column', gap:1 }}>
                  <Box sx={{ display:'flex', flexWrap:'wrap', gap:2, alignItems:'center' }}>
                    {/* If first exercise, label Introduction */}
                    <Typography variant="subtitle1" sx={{ fontWeight:600 }}>
                      {selectedExercise.events <= 1
                        ? 'Introduction'
                        : `${selectedExercise.taskId} (index ${selectedExercise.taskIndex})`}
                    </Typography>
                    <Chip size="small" label={`Duration ${(selectedExercise.durationMs/1000).toFixed(1)}s`} />
                    <Chip size="small" label={`${exerciseLogs.length} events`} />
                  </Box>
                  <Box sx={{ display:'flex', gap:1, flexWrap:'wrap' }}>
                    <Chip size="small" label={`parse errors ${selectedExercise.metrics.parseErrors}`} color={selectedExercise.metrics.parseErrors?'warning':'default'} />
                    <Chip size="small" label={`compile errors ${selectedExercise.metrics.compileErrors}`} color={selectedExercise.metrics.compileErrors?'error':'default'} />
                    <Chip size="small" label={`suggestions ${selectedExercise.metrics.suggestionsAccepted}`} />
                    <Chip size="small" label={`copies ${selectedExercise.metrics.copies}`} />
                    <Chip size="small" label={`pastes ${selectedExercise.metrics.pastes}`} />
                    <Chip size="small" label={`navigations ${selectedExercise.metrics.navigations}`} />
                  </Box>
                </Box>
                <Box sx={{ flex:1, overflow:'auto', borderTop:'1px solid #222' }}>
                  <table style={{ borderCollapse:'collapse', width:'100%', fontSize:12, fontFamily:'Consolas, monospace' }}>
                    <thead>
                      <tr>
                        {visibleCols.map(c => <th key={c} style={{ position:'sticky', top:0, background:'#111', borderBottom:'1px solid #333', padding:'4px 6px', textAlign:'left' }}>{c==='t'?'time':c}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {exerciseLogs.map((l,i)=>(
                        <tr key={i} style={{ borderBottom:'1px solid #222', cursor:'pointer', backgroundColor: selectedLogEntry===l?'#222':'unset' }} onClick={()=>setSelectedLogEntry(l)}>
                          {visibleCols.map(c => (
                            <td key={c} style={{ padding:'2px 6px', verticalAlign:'top', whiteSpace:'pre-wrap' }}>
                              {c==='t' ? formatTime(l[c]) : typeof l[c] === 'object' ? JSON.stringify(l[c]) : String(l[c] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {!exerciseLogs.length && (<tr><td colSpan={visibleCols.length} style={{ padding:16, textAlign:'center', opacity:0.6 }}>No logs for exercise</td></tr>)}
                    </tbody>
                  </table>
                </Box>
                <Box sx={{ height:250, borderTop:'1px solid #222', display:'flex', flexDirection:'column' }}>
                  <Box sx={{ p:0.5, display:'flex', alignItems:'center', gap:1, borderBottom:'1px solid #222', fontSize:12 }}>
                    <Typography variant="caption" sx={{ flexGrow:1, opacity:0.7 }}>Exercise Code Editor ({selectedExercise.taskId})</Typography>
                    <Button size="small" disabled={!exerciseCode} onClick={()=>{ try{navigator.clipboard.writeText(exerciseCode);}catch{} }}>Copy Code</Button>
                    <Button size="small" variant="outlined" disabled={!exerciseCode} onClick={()=>openRender(selectedExercise.primaryKind || 'merlin', exerciseCode)}>Render</Button>
                  </Box>
                  <Box sx={{ flex:1, minHeight:0 }}>
                    <CodeEditor value={exerciseCode} onChange={setExerciseCode} fontSize={12} />
                  </Box>
                </Box>
              </>
            )}
            {!selectedExercise && <Box sx={{ p:2, fontSize:12, opacity:0.6 }}>Select an exercise to view details</Box>}
          </Box>
        </Box>
      )}
      {view==='cohort' && (
        <Box sx={{ flex:1, display:'flex', minHeight:0 }}>
          <Box sx={{ width:300, borderRight:'1px solid #222', display:'flex', flexDirection:'column' }}>
            <Box sx={{ p:1, borderBottom:'1px solid #222', fontSize:12, opacity:0.8, display:'flex', alignItems:'center', gap:1 }}>
              <span>Participants ({visibleCohortSets.length}/{cohortSets.length})</span>
              {!!hiddenUids.length && <Button size="small" onClick={clearHidden}>Unhide all</Button>}
              <Button size="small" onClick={hideParticipantsWithOneOrLessAttempts}>Hide ≤1 attempts</Button>
              {!!selectedCohortUid && <Button size="small" onClick={()=>setSelectedCohortUid('')}>Clear selection</Button>}
            </Box>
            <Box sx={{ p:1, display:'flex', flexDirection:'column', gap:1 }}>
              <FormControlLabel control={<Checkbox size="small" checked={cohortOnlyCompleted} onChange={(e)=>setCohortOnlyCompleted(e.target.checked)} />} label="Only completed" />
              <TextField size="small" label="Task filter (e.g., task1 or task1:tikz)" value={cohortTaskFilter} onChange={e=>setCohortTaskFilter(e.target.value)} />
              <Divider sx={{ my:1, borderColor:'#222' }} />
              <Typography variant="caption" sx={{ opacity:0.8 }}>Merge participants</Typography>
              <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={1}>
                  <Select size="small" value={mergeLeft} onChange={(e)=>setMergeLeft(e.target.value)} displayEmpty sx={{ flex:1 }}>
                    <MenuItem value="">Left UID</MenuItem>
                    {allUids.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                  </Select>
                  <Select size="small" value={mergeRight} onChange={(e)=>setMergeRight(e.target.value)} displayEmpty sx={{ flex:1 }}>
                    <MenuItem value="">Right UID</MenuItem>
                    {allUids.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                  </Select>
                </Stack>
                <TextField size="small" label="Target UID (optional)" value={mergeTarget} onChange={(e)=>setMergeTarget(e.target.value)} placeholder="defaults to Left UID" />
                <Button size="small" variant="outlined" onClick={doMergeParticipants} disabled={!mergeLeft || !mergeRight || mergeLeft===mergeRight}>Merge</Button>
              </Stack>
            </Box>
            <List dense disablePadding sx={{ flex:1, overflow:'auto' }}>
              {visibleCohortSets.map(s => (
                <ListItemButton
                  key={s.uid}
                  alignItems="flex-start"
                  selected={selectedCohortUid === s.uid}
                  onClick={()=> setSelectedCohortUid(prev => prev === s.uid ? '' : s.uid)}
                  sx={{ py:0.5, px:1 }}
                >
                  <ListItemText
                    primary={<Box sx={{ display:'flex', gap:1, alignItems:'center' }}>
                      <span style={{ fontWeight:600 }}>{s.uid}</span>
                      <Chip size="small" label={`${s.logs.length} logs`} sx={{ height:18 }} />
                      <IconButton size="small" title="Hide" onClick={(e)=>{ e.stopPropagation(); hideUid(s.uid); }}>
                        <VisibilityOffIcon fontSize="small" />
                      </IconButton>
                    </Box>}
                    secondary={<Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, mt:0.5 }}>
                      <Chip size="small" label={`attempts ${cohortAttempts.filter(a=>a.uid===s.uid).length}`} />
                    </Box>}
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                </ListItemButton>
              ))}
              {!cohortSets.length && <Box sx={{ p:2, fontSize:12, opacity:0.6 }}>Upload participant JSON files to analyze</Box>}
            </List>
            {cohortMessage && <Box sx={{ p:1, borderTop:'1px solid #222', fontSize:12, opacity:0.8 }}>{cohortMessage}</Box>}
          </Box>
          <Box sx={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
            <Box sx={{ p:1, borderBottom:'1px solid #222', display:'flex', gap:2, alignItems:'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight:600 }}>Attempts summary</Typography>
              <Chip size="small" label={`${cohortAttempts.length} rows`} />
            </Box>
            <Box sx={{ flex:1, overflow:'auto' }}>
              <table style={{ borderCollapse:'collapse', width:'100%', fontSize:12, fontFamily:'Consolas, monospace' }}>
                <thead>
                  <tr>
                    {['uid','taskId','taskIndex','group','startTime','endTime','elapsedMs','completed','parseErrors','compileErrors','suggests','copies','pastes','docClicks','events'].map(h => (
                      <th key={h} style={{ position:'sticky', top:0, background:'#111', borderBottom:'1px solid #333', padding:'4px 6px', textAlign:'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cohortAttempts.map((a,i)=>(
                    <tr key={i} style={{ borderBottom:'1px solid #222' }}>
                      <td style={{ padding:'2px 6px' }}>{a.uid}</td>
                      <td style={{ padding:'2px 6px' }}>{a.taskId}</td>
                      <td style={{ padding:'2px 6px' }}>{a.taskIndex}</td>
                      <td style={{ padding:'2px 6px' }}>{a.group||''}</td>
                      <td style={{ padding:'2px 6px' }}>{formatTime(a.startTime)}</td>
                      <td style={{ padding:'2px 6px' }}>{formatTime(a.endTime)}</td>
                      <td style={{ padding:'2px 6px' }}>{a.elapsedMs!=null?Math.round(a.elapsedMs):''}</td>
                      <td style={{ padding:'2px 6px' }}>{a.completed?1:0}</td>
                      <td style={{ padding:'2px 6px' }}>{a.parseErrors}</td>
                      <td style={{ padding:'2px 6px' }}>{a.compileErrors}</td>
                      <td style={{ padding:'2px 6px' }}>{a.suggests}</td>
                      <td style={{ padding:'2px 6px' }}>{a.copies}</td>
                      <td style={{ padding:'2px 6px' }}>{a.pastes}</td>
                      <td style={{ padding:'2px 6px' }}>{a.docClicks}</td>
                      <td style={{ padding:'2px 6px' }}>{a.events}</td>
                    </tr>
                  ))}
                  {!cohortAttempts.length && (
                    <tr><td colSpan={15} style={{ padding:16, textAlign:'center', opacity:0.6 }}>No attempts to display</td></tr>
                  )}
                </tbody>
              </table>
            </Box>
          </Box>
        </Box>
      )}
      {view==='cohortCode' && (
        <Box sx={{ flex:1, display:'flex', minHeight:0 }}>
          <Box sx={{ width:300, borderRight:'1px solid #222', display:'flex', flexDirection:'column' }}>
            <Box sx={{ p:1, borderBottom:'1px solid #222', fontSize:12, opacity:0.8, display:'flex', alignItems:'center', gap:1 }}>
              <span>Participants ({visibleCohortSets.length}/{cohortSets.length})</span>
              {!!hiddenUids.length && <Button size="small" onClick={clearHidden}>Unhide all</Button>}
              <Button size="small" onClick={hideParticipantsWithOneOrLessAttempts}>Hide ≤1 attempts</Button>
              {!!selectedCohortUid && <Button size="small" onClick={()=>setSelectedCohortUid('')}>Clear selection</Button>}
            </Box>
            <List dense disablePadding sx={{ flex:1, overflow:'auto' }}>
              {visibleCohortSets.map(s => (
                <ListItemButton
                  key={s.uid}
                  alignItems="flex-start"
                  selected={selectedCohortUid === s.uid}
                  onClick={()=> setSelectedCohortUid(prev => prev === s.uid ? '' : s.uid)}
                  sx={{ py:0.5, px:1 }}
                >
                  <ListItemText
                    primary={<Box sx={{ display:'flex', gap:1, alignItems:'center' }}>
                      <span style={{ fontWeight:600 }}>{s.uid}</span>
                      <Chip size="small" label={`${cohortAttempts.filter(a=>a.uid===s.uid).length} attempts`} sx={{ height:18 }} />
                      <IconButton size="small" title="Hide" onClick={(e)=>{ e.stopPropagation(); hideUid(s.uid); }}>
                        <VisibilityOffIcon fontSize="small" />
                      </IconButton>
                    </Box>}
                    secondary={<Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, mt:0.5 }}>
                      <Chip size="small" label={`${(cohortCodes.find(c=>c.uid===s.uid && c.taskId===cohortCodeTaskId)?.codeLen||0)} chars`} />
                      <Chip size="small" label={`group ${cohortAttempts.find(a=>a.uid===s.uid)?.group||'n/a'}`} />
                    </Box>}
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                </ListItemButton>
              ))}
              {!cohortSets.length && <Box sx={{ p:2, fontSize:12, opacity:0.6 }}>Upload participant JSON files</Box>}
            </List>
          </Box>
          <Box sx={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
            <Box sx={{ p:1, borderBottom:'1px solid #222', display:'flex', gap:2, alignItems:'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight:600 }}>Codes for {cohortCodeTaskId || '...'}</Typography>
              <Chip size="small" label={`${cohortCodes.length} participants`} />
            </Box>
            <Box sx={{ flex:1, overflow:'auto', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(420px, 1fr))', gap:1, p:1 }}>
              {cohortCodes.map(row => (
                <Box key={`${row.uid}-${row.taskId}`} sx={{ border:'1px solid #222', borderRadius:1, display:'flex', flexDirection:'column', minHeight:220 }}>
                  <Box sx={{ p:0.5, display:'flex', alignItems:'center', gap:1, borderBottom:'1px solid #222', fontSize:12 }}>
                    <Typography variant="caption" sx={{ flexGrow:1, opacity:0.8 }}>{row.uid} · {row.kind || 'unknown'} · {row.source}</Typography>
                    <Chip size="small" label={`${row.codeLen} chars; ${cohortAttempts.find(a=>a.uid===row.uid)?.group||'n/a'}`} />
                    <Button size="small" onClick={()=>{ try{navigator.clipboard.writeText(row.code || '');}catch{} }}>Copy</Button>
                    <Button size="small" variant="outlined" disabled={!row.code} onClick={()=>openRender(row.kind || 'merlin', row.code || '')}>Render</Button>
                  </Box>
                  <Box sx={{ flex:1, minHeight:0 }}>
                    <CodeEditor value={row.code || ''} onChange={()=>{}} fontSize={12} />
                  </Box>
                </Box>
              ))}
              {!cohortCodes.length && (
                <Box sx={{ p:2, fontSize:12, opacity:0.6 }}>Select an exercise and upload participants to view code</Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
  </Box>
  <Dialog open={!!selectedLogEntry} onClose={()=>setSelectedLogEntry(null)} maxWidth="md" fullWidth sx={{ zIndex: 1700 }}>
      <DialogTitle sx={{ display:'flex', alignItems:'center', gap:1 }}>
        Log Entry Details
        <Box sx={{ ml:'auto', display:'flex', gap:1 }}>
          <Button size="small" startIcon={<ContentCopyIcon />} onClick={handleCopyLog}>{copied? 'Copied' : 'Copy JSON'}</Button>
          <IconButton size="small" onClick={()=>setSelectedLogEntry(null)}><CloseIcon fontSize="small" /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor:'#111' }}>
        {selectedLogEntry && (
          <Box component="pre" sx={{ m:0, p:1, fontSize:12, whiteSpace:'pre-wrap', fontFamily:'Consolas, monospace' }}>
            {JSON.stringify(selectedLogEntry, null, 2)}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setSelectedLogEntry(null)}>Close</Button>
      </DialogActions>
  </Dialog>
  {/* Render preview dialog */}
  <Dialog open={renderOpen} onClose={()=>setRenderOpen(false)} maxWidth="lg" fullWidth sx={{ zIndex: 2200 }}>
    <DialogTitle sx={{ display:'flex', alignItems:'center', gap:1 }}>
      Render Preview · {renderKind || 'merlin'}
      <Box sx={{ ml:'auto', display:'flex', gap:1 }}>
        {renderKind === 'merlin' && renderPagesCount > 1 && (
          <>
            <Button size="small" onClick={()=>setRenderPage(p => Math.max(1, p-1))} disabled={renderPage<=1}>Prev</Button>
            <Typography variant="caption" sx={{ alignSelf:'center' }}>{renderPage}/{renderPagesCount}</Typography>
            <Button size="small" onClick={()=>setRenderPage(p => Math.min(renderPagesCount, p+1))} disabled={renderPage>=renderPagesCount}>Next</Button>
          </>
        )}
        <IconButton size="small" onClick={()=>setRenderOpen(false)}><CloseIcon fontSize="small" /></IconButton>
      </Box>
    </DialogTitle>
  <DialogContent dividers sx={{ bgcolor:'#111', display: 'flex', flexDirection: 'column', minHeight: 420 }}>
      {!!renderError && (
        <Box sx={{ p:1, color:'#f99', fontFamily:'Consolas, monospace', whiteSpace:'pre-wrap' }}>{renderError}</Box>
      )}
      {!renderError && renderKind === 'tikz' && (
        <Box sx={{ height: 420 }}>
          <TikzRenderer code={renderCode} />
        </Box>
      )}
      {!renderError && renderKind === 'merlin' && (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'auto', p: 1 }}>
          <MermaidRenderer text={renderMermaid} update={()=>{}} currentPage={renderPage} />
        </Box>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={()=>setRenderOpen(false)}>Close</Button>
    </DialogActions>
  </Dialog>
  </>
  );
}
