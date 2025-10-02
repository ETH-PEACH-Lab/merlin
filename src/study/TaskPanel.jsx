import React, { useState, useEffect } from 'react';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Controlled collapsible TaskPanel. Parent can pass `collapsed` & `onToggle`.
// Falls back to internal state when uncontrolled (no `collapsed` prop).
export default function TaskPanel({
  title = 'Task Description',
  children,
  defaultOpen = true,
  collapsed: controlledCollapsed,
  onToggle,
  style = {}
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(!defaultOpen);
  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const toggle = () => {
    if (!isControlled) setInternalCollapsed(!collapsed);
    onToggle && onToggle(!collapsed);
  };

  // Fire a resize event when collapse state changes so diagrams/layout can re-measure
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [collapsed]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        ...style
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'rgba(24,24,24,1)' },
          height: '40px',
          minHeight: '40px',
          maxHeight: '40px',
          backgroundColor: '#121212',
          userSelect: 'none',
          flex: '0 0 auto'
        }}
        onClick={toggle}
      >
        <Typography variant="overline">{title}</Typography>
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'}>
          <IconButton size="small">
            {collapsed ? <ExpandMoreIcon sx={{ fontSize: 18 }} /> : <ExpandLessIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>
      </Box>
      {!collapsed && (
        <div style={{ flex: '1 1 auto', minHeight: 0, overflow: 'auto', padding: 16 }}>
          {children}
        </div>
      )}
    </div>
  );
}

// End TaskPanel.jsx
// (Trailing artifacts removed)







