import React from "react";
import { Box, Button, Typography, Paper, Divider, Stack, Collapse, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Chip, Tooltip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useStudy } from "./StudyContext";

export function TopBarTimer({ onOpenAdmin }) {
  const { timeRemaining, phase, handleDone, uid } = useStudy();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const showTimer = phase === "explore" || phase === "task";
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Button size="small" variant="text" onClick={onOpenAdmin} sx={{ fontSize: 11, minWidth:0, p:0, textTransform:'none', color:'#bbb' }}>UID: {uid}</Button>
      {showTimer && (
        <Typography variant="button">
          {String(timeRemaining.min).padStart(2, "0")}:{String(timeRemaining.sec).padStart(2, "0")}
        </Typography>
      )}
      {showTimer && (
        <>
          <Button color="warning" variant="contained" size="small" onClick={() => setConfirmOpen(true)}>Done</Button>
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Finish early?</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to submit this step now?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button color="primary" variant="contained" onClick={() => { setConfirmOpen(false); handleDone("early_done"); }}>Confirm</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export function WelcomeScreen() {
  const { uid, beginStudy } = useStudy();
  return (
    <Paper sx={{ m: 4, p: 4 }}>
      <Typography variant="h5" gutterBottom>Welcome to the study</Typography>
      <Typography gutterBottom>Your UID: <b>{uid}</b></Typography>
      <Box mt={2}><Button variant="contained" onClick={beginStudy}>Start Study</Button></Box>
    </Paper>
  );
}

export function FullscreenWelcome({ onNext }) {
  const { setExplicitGroup, group } = useStudy();
  const [selection, setSelection] = React.useState(group || null);
  const handleProceed = () => {
    setExplicitGroup(selection === 'A' ? 'merlin-first' : 'tikz-first');
    onNext();
  };
  return (
    <Box sx={{ position: 'fixed', inset: 0, bgcolor: '#0e0e0e', color: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <Box sx={{ maxWidth: 800, p: 4 }}>
        <Typography variant="h4" gutterBottom>Welcome to our study</Typography>
        <Typography gutterBottom>
          You are asked to recreate objects in the following exercises. This survey evaluates the tools, not your performance.
          You can access the docs at any time using the Docs link.
        </Typography>
        <Typography sx={{ mt:3 }} gutterBottom>Please select your assigned group:</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant={selection==='A'?'contained':'outlined'} onClick={()=>setSelection('A')}>Group A</Button>
          <Button variant={selection==='B'?'contained':'outlined'} onClick={()=>setSelection('B')}>Group B</Button>
        </Stack>
        <Box mt={4}><Button variant="contained" size="large" onClick={handleProceed} disabled={!selection || selection === "not-yet-set"} >Continue</Button></Box>
      </Box>
    </Box>
  );
}

export function FullscreenPretask({ title, subtaskInfo, onStart }) {
  return (
    <Box sx={{ position: 'fixed', inset: 0, bgcolor: '#0e0e0e', color: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <Box sx={{ maxWidth: 800, p: 4 }}>
        <Typography variant="h5" gutterBottom>{title}</Typography>
        {subtaskInfo && (
          <Typography variant="h6" gutterBottom sx={{ opacity: 0.8 }}>
            {subtaskInfo}
          </Typography>
        )}
        <Box mt={3}><Button variant="contained" size="large" onClick={onStart}>Start Exercise</Button></Box>
      </Box>
    </Box>
  );
}

export function PreTaskScreen({ title, onStart, description, children }) {
  const [open, setOpen] = React.useState(true);
  return (
    <Paper sx={{ m: 2, p: 2}} >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">{title}</Typography>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle2">Task description</Typography>
        <IconButton size="small" onClick={() => setOpen(!open)}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Stack>
      <Collapse in={open}>
        <Box mt={1}>{description || children}</Box>
      </Collapse>
    </Paper>
  );
}

export function ProgressBar() {
  const { tasks, taskIndex, currentTask, currentSubtask, subtaskIndex } = useStudy();
  return (
    <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #333', bgcolor: '#111', color: '#ddd', display: 'flex', gap: 1, alignItems: 'center' }}>
      {tasks.map((t, i) => (
        <Box key={t.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={t.title} color={i === taskIndex ? 'primary' : 'default'} size="small" />
          {t.hasSubtasks && i === taskIndex && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {t.subtasks.map((s, si) => (
                <Chip key={s.id} label={s.kind.toUpperCase()} color={si === subtaskIndex ? 'primary' : 'default'} size="small" variant="outlined" />
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

// Admin modal (triggered externally). Not exported by default UI but component provided.
export function AdminModal({ open, onClose }) {
  const { adminEnabled, enableAdmin, adminSetPosition, tasks, resetForNewParticipant, uid, flushLogs } = useStudy();
  const [pwd, setPwd] = React.useState('');
  const [error, setError] = React.useState('');
  const [view, setView] = React.useState('jump'); // jump | logs

  // Load logs lazily
  const [logs, setLogs] = React.useState([]);
  React.useEffect(() => {
    if (open && adminEnabled && view === 'logs') {
      try {
        // ensure buffer is flushed so logs include recent events
        flushLogs();
        const key = `merlin_study_logs_${uid}`;
        const raw = localStorage.getItem(key) || '[]';
        setLogs(JSON.parse(raw));
      } catch { setLogs([]); }
    }
  }, [open, adminEnabled, view, uid]);

  const handleExportLogs = () => {
    try {
      const key = `merlin_study_logs_${uid}`;
      const data = localStorage.getItem(key) || '[]';
      const blob = new Blob([data], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${uid}_logs.json`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    } catch {}
  };

  const handleEnable = () => {
    const ok = enableAdmin(pwd);
    if (!ok) setError('Incorrect password'); else setError('');
  };

  const handleTaskClick = (taskIdx, subIdx) => {
    adminSetPosition(taskIdx, subIdx || 0, 'pretask');
    onClose && onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Admin Dashboard</DialogTitle>
      <DialogContent dividers>
        {!adminEnabled && (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb:2 }}>
            <TextField label="Password" size="small" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleEnable()} />
            <Button variant="contained" onClick={handleEnable}>Unlock</Button>
            {error && <Typography color="error" variant="caption">{error}</Typography>}
          </Stack>
        )}
        {adminEnabled && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant={view==='jump'?'contained':'outlined'} onClick={()=>setView('jump')}>Jump</Button>
              <Button size="small" variant={view==='logs'?'contained':'outlined'} onClick={()=>setView('logs')}>Logs</Button>
              <Tooltip title="Generate a new participant id and reset progress">
                <Button size="small" color="warning" onClick={resetForNewParticipant}>Reset Participant</Button>
              </Tooltip>
            </Stack>
            {view === 'jump' && (
              <Stack spacing={2}>
                <Typography variant="subtitle2">Jump to Exercise</Typography>
                <Stack spacing={1}>
                  {tasks.map((t,i)=> (
                    <Paper key={t.id} variant="outlined" sx={{ p:1 }}>
                      <Stack spacing={1}>
                        <Button size="small" variant="text" onClick={()=>handleTaskClick(i,0)} sx={{ justifyContent:'flex-start' }}>{t.title}</Button>
                        {t.hasSubtasks && (
                          <Stack direction="row" spacing={1} sx={{ flexWrap:'wrap' }}>
                            {t.subtasks.map((s,si)=> (
                              <Chip key={s.id} label={`${s.kind.toUpperCase()}`} onClick={()=>handleTaskClick(i,si)} size="small" />
                            ))}
                          </Stack>
                        )}
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            )}
            {view === 'logs' && (
              <Box sx={{ maxHeight: 300, overflow: 'auto', fontFamily: 'monospace', fontSize: 12, bgcolor: '#111', p:1 }}>
                {logs.slice().reverse().map(l => <div key={l.t}>{new Date(l.t).toLocaleTimeString()} | {l.type}</div>)}
                {logs.length === 0 && <Typography variant="caption" sx={{ opacity:0.7 }}>No logs yet</Typography>}
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export function FinishedScreen({ uid, onOpenAdmin }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleDownloadBackup = () => {
    try {
      const allCookies = document.cookie;
      const ls = {};
      for (let i=0;i<localStorage.length;i++) {
        const k = localStorage.key(i);
        ls[k] = localStorage.getItem(k);
      }
      const blob = new Blob([JSON.stringify({ cookies: allCookies, localStorage: ls }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${uid}_backup.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 100);
    } catch {}
  };
  const handleClearAll = () => {
    try {
      document.cookie.split('; ').forEach(c => {
        const name = c.split('=')[0];
        if (name) document.cookie = `${name}=; max-age=0; path=/`;
      });
      localStorage.clear();
      window.location.reload();
    } catch {}
  };
  return (
    <Box sx={{ position: 'fixed', inset:0, bgcolor:'#0e0e0e', color:'#eee', display:'flex', alignItems:'center', justifyContent:'center', p:4, zIndex:1200 }}>
      <Box sx={{ maxWidth:640 }}>
        <Typography variant="h4" gutterBottom>Thank you!</Typography>
        <Typography gutterBottom>You have completed all exercises. Your participant ID: <b>{uid}</b></Typography>
        <Typography gutterBottom>1. Please download a backup of your data (in case of submission issues).</Typography>
        <Typography gutterBottom>2. Then continue to the final survey.</Typography>
        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="outlined" onClick={handleDownloadBackup}>Download Backup File</Button>
          <Button variant="contained" color="primary" onClick={()=>window.open(`https://tally.so/r/placeholder?uid=${encodeURIComponent(uid)}`, '_blank')}>Open Survey</Button>
          <Button variant="text" onClick={()=>setMenuOpen(o=>!o)}>More …</Button>
        </Stack>
        {menuOpen && (
          <Stack mt={2} spacing={1} sx={{ bgcolor:'#181818', p:2, border:'1px solid #333', borderRadius:1 }}>
            <Button size="small" color="error" onClick={handleClearAll}>Clear Data and End Study</Button>
            <Button size="small" onClick={onOpenAdmin}>Admin Panel</Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
}



