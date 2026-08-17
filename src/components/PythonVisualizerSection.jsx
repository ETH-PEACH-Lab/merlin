import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from '@mui/material';
import {
  PlayArrow,
  Clear,
  Grid3x3,
  NavigateBefore,
  NavigateNext,
  LastPage,
  PlayCircleOutline,
  PauseCircleOutline,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import NavigationBar from './NavigationBar';
import PythonCodeEditor from './PythonCodeEditor';
import MermaidRenderer from './MermaidRenderer';
import { pyodideExecutor } from '../executor/pyodideExecutor';
import { snapshotsToMerlinDSL_Pipeline} from '../utils/snapshotToMerlinConverter.mjs';
import { pythonExamples } from '../pythonExamples';
import parseText from '../parser/parseText.mjs';
import compiler from '../compiler/compiler.mjs';

/**
 * Python Visualizer tab. Ties the code editor, the Pyodide executor, and the
 * Merlin renderer together into a step-through visualization.
 *
 * Flow:
 *   1. User writes Python and hits Run → `handleExecute` runs it in the traced
 *      worker (`pyodideExecutor.execute`), yielding execution snapshots.
 *   2. `snapshotsToMerlinDSL_Pipeline(snapshots)` turns those snapshots into
 *      Merlin DSL (one page per meaningful state change) plus a `snapshotToPage`
 *      map (`stp[i]` = the 1-based page to show when stepping to snapshot i).
 *   3. The DSL is parsed/compiled and rendered; stepping the snapshot index
 *      drives the visible page via `snapshotToPage`, looking one snapshot ahead
 *      so the diagram shows state *after* the highlighted line runs.
 */
const PythonVisualizerSection = () => {
  const theme = useTheme();
  const mermaidRef = useRef(null);

  const [pythonCode, setPythonCode] = useState(`# Write Python code here`);
  const [executionResult, setExecutionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState(0);

  const [editableMerlinCode, setEditableMerlinCode] = useState('');
  const [compiledMerlin, setCompiledMerlin] = useState('');
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // Maps each snapshot index to the page it should display.
  const [snapshotToPage, setSnapshotToPage] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(140);
  const playIntervalMs = 1000;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openGridDialog, setOpenGridDialog] = useState(false);
  const [leftWidth, setLeftWidth] = useState(window.innerWidth * 0.4);
  const previousPageCountRef = useRef(0);

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + e.clientX - startX;
      const minWidth = 300;
      const maxWidth = window.innerWidth - 300;
      if (newWidth > minWidth && newWidth < maxWidth) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Drag the horizontal divider above the console to resize its height.
  // Dragging up grows the console; dragging down shrinks it.
  const handleConsoleResize = (e) => {
    const startY = e.clientY;
    const startHeight = consoleHeight;

    const handleMouseMove = (e) => {
      const newHeight = startHeight + (startY - e.clientY);
      const minHeight = 40;
      const maxHeight = window.innerHeight - 200;
      if (newHeight > minHeight && newHeight < maxHeight) {
        setConsoleHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const extractPagesFromDSL = (dslCode) => {
    if (!dslCode) return [];
    
    const lines = dslCode.split('\n');
    let pageCount = 0;

    for (const line of lines) {
      if (/^\s*page\b/.test(line)) {
        pageCount++;
      }
    }
    
    if (pageCount === 0) {
      return [1];
    }
    
    const pageNumbers = [];
    for (let i = 1; i <= pageCount; i++) {
      pageNumbers.push(i);
    }
    
    console.log('Extracted pages from DSL:', pageNumbers, 'Total pages:', pageCount);
    return pageNumbers;
  };

  useEffect(() => {
    if (!isPlaying) return;
    const total = executionResult?.snapshots?.length || 0;
    if (total === 0) {
      setIsPlaying(false);
      return;
    }
    const id = setInterval(() => {
      setCurrentSnapshotIndex((prev) => {
        if (prev >= total - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playIntervalMs);
    return () => clearInterval(id);
  }, [isPlaying, executionResult]);

  // Drive the visualization page from the snapshot index so that stepping
  // through snapshots automatically advances the diagram. We look one snapshot
  // ahead so the visualization shows the state *after* the highlighted line
  // executes, keeping the code highlight and visualization in sync.
  useEffect(() => {
    if (snapshotToPage.length === 0) return;
    const nextIdx = Math.min(currentSnapshotIndex + 1, snapshotToPage.length - 1);
    const page = snapshotToPage[nextIdx];
    if (page && page !== currentPage) {
      setCurrentPage(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSnapshotIndex, snapshotToPage]);

  useEffect(() => {
    if (editableMerlinCode) {
      try {
        const compiled = parseAndCompileDSL(editableMerlinCode);
        setCompiledMerlin(compiled);

        const extractedPages = extractPagesFromDSL(editableMerlinCode);
        const currentPageCount = extractedPages.length;

        setPages(extractedPages);

        if (extractedPages.length > 0 && currentPage > extractedPages.length) {
          setCurrentPage(extractedPages[extractedPages.length - 1]);
        }
        
        previousPageCountRef.current = currentPageCount;
      } catch (e) {
        console.error("Error processing DSL: ", e);
        setCompiledMerlin('');
      }
    } else {
      setCompiledMerlin('');
      setPages([]);
      setCurrentPage(1);
      previousPageCountRef.current = 0;
    }
  }, [editableMerlinCode]);

  const parseAndCompileDSL = (dslCode) => {
    if (!dslCode) {
      console.warn('No DSL code to compile');
      return '';
    }

    try {
      console.log('Parsing DSL:', dslCode.substring(0, 200));
      const parsed = parseText(dslCode);
      console.log('Parsed successfully');

      if (!parsed) {
        console.warn('Parsing returned null');
        return '';
      }

      const { mermaidString, compiled_pages } = compiler(parsed);
      console.log('Compiled successfully, pages:', compiled_pages?.length);
      console.log('Mermaid output:', mermaidString?.substring(0, 200));

      return mermaidString || '';
    } catch (error) {
      console.error('Failed to parse/compile DSL:', error);
      return '';
    }
  };
  const handleSelectExample = (item) => {
    setPythonCode(item.userCode);
    setExecutionResult(null);
    setError(null);
    setEditableMerlinCode('');
    setCompiledMerlin('');
    setPages([]);
    setCurrentPage(1);
    setSnapshotToPage([]);
    setIsPlaying(false);
  };

  /**
   * Run the current Python code and build the visualization. Executes in the
   * traced worker, then on success converts the snapshots to Merlin DSL and
   * stores both the editable DSL and the snapshot→page map. On failure, surfaces
   * the structured error (compile/runtime) into `error` state. Always clears the
   * loading flag when done.
   */
  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setExecutionResult(null);
    setCurrentPage(1);
    setCurrentSnapshotIndex(0);

    try {
      const result = await pyodideExecutor.execute(pythonCode, 1000);

      if (result.success === false) {
        setError({
          message: result.error,
          type: result.errorType,
          traceback: result.errorTraceback,
          phase: result.phase,
          line: result.errorLine,
          offset: result.errorOffset,
          text: result.errorText,
          stdout: result.stdout,
        });
      } else {
        setExecutionResult(result);
    
        try {
          const { dsl: merlinCode, snapshotToPage: stp } = snapshotsToMerlinDSL_Pipeline(
            result.snapshots,
            pythonCode
          );
          setEditableMerlinCode(merlinCode);
          setSnapshotToPage(stp);
        } catch (conversionError) {
          console.error('Failed to convert snapshots to Merlin DSL:', conversionError);
        }
      }
    } catch (err) {
      setError({
        message: err.message,
        type: 'ExecutionError',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetPageGrid = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const gridSize = formData.get('gridSize');
    
    if (!gridSize) {
      showSnackbar('Please enter a grid size', 'error');
      return;
    }
    
    const parts = gridSize.split(/[x\s]+/).filter(p => p);
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
      showSnackbar('Invalid grid format. Use "2x2" or "2 2"', 'error');
      return;
    }
    
    const lines = editableMerlinCode.split('\n');
    let pageCount = 0;
    let pageLineIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*page\s*/.test(lines[i])) {
        pageCount++;
        if (pageCount === currentPage) {
          pageLineIndex = i;
          break;
        }
      }
    }
    
    if (pageLineIndex >= 0) {
      lines[pageLineIndex] = `page ${gridSize}`;
      setEditableMerlinCode(lines.join('\n'));
      showSnackbar(`Grid size set to ${gridSize}`, 'success');
    } else {
      showSnackbar('Could not find page to set grid', 'error');
    }
    
    setOpenGridDialog(false);
  };
  
  const handleOpenGridDialog = () => {
    setOpenGridDialog(true);
  };
  
  const handleCloseGridDialog = () => {
    setOpenGridDialog(false);
  };


  const handleClear = () => {
    setPythonCode('');
    setExecutionResult(null);
    setError(null);
    setEditableMerlinCode('');
    setCompiledMerlin('');
    setPages([]);
    setCurrentPage(1);
    setCurrentSnapshotIndex(0);
    setSnapshotToPage([]);
    setIsPlaying(false);
  };



  /** Step the visible page one back within `pages` (no-op at the first page). */
  const handlePrevPage = () => {
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      setCurrentPage(pages[currentIndex - 1]);
    }
  };

  /** Step the visible page one forward within `pages` (no-op at the last page). */
  const handleNextPage = () => {
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1]);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleUpdateSvgElement = (svgElement) => {
    console.log('SVG element updated:', svgElement);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        bgcolor: 'background.default',
      }}
    >
      {/* Column 1: Examples Sidebar using NavigationBar */}
      <NavigationBar 
        examples={pythonExamples}
        savedItems={[]}
        onSelect={handleSelectExample}
      />

      {/* Main Content Area (Columns 2-4) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          flex: 1,
        }}
      >
        {/* Top Toolbar */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            px: 2,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            alignItems: 'center',
            height: '40px',
            minHeight: '40px',
            maxHeight: '40px',
          }}
        >
          <Tooltip title={loading ? 'Running...' : 'Run Code'}>
            <span>
              <IconButton
                color="primary"
                size="small"
                onClick={handleExecute}
                disabled={loading || !pythonCode.trim()}
              >
                <PlayArrow fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Clear">
            <span>
              <IconButton
                color="secondary"
                size="small"
                onClick={handleClear}
                disabled={loading}
              >
                <Clear fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {loading && (
            <CircularProgress size={24} sx={{ ml: 1 }} />
          )}

          {(() => {
            const totalSnapshots = executionResult?.snapshots?.length || 0;
            const inSnapshotMode = totalSnapshots > 0 && snapshotToPage.length > 0;
            const canPrev = inSnapshotMode
              ? currentSnapshotIndex > 0
              : pages.length > 1 && pages.indexOf(currentPage) > 0;
            const canNext = inSnapshotMode
              ? currentSnapshotIndex < totalSnapshots - 1
              : pages.length > 1 && pages.indexOf(currentPage) < pages.length - 1;
            const onPrev = inSnapshotMode
              ? () => setCurrentSnapshotIndex(Math.max(0, currentSnapshotIndex - 1))
              : handlePrevPage;
            const onNext = inSnapshotMode
              ? () => setCurrentSnapshotIndex(Math.min(totalSnapshots - 1, currentSnapshotIndex + 1))
              : handleNextPage;
            const onSkipToEnd = inSnapshotMode
              ? () => setCurrentSnapshotIndex(totalSnapshots - 1)
              : () => setCurrentPage(pages[pages.length - 1]);
            const label = inSnapshotMode
              ? `Step ${currentSnapshotIndex + 1}/${totalSnapshots}`
              : pages.length > 0
                ? `Page ${currentPage}/${pages.length}`
                : '';

            if (!inSnapshotMode && pages.length === 0) return null;

            const togglePlay = () => {
              if (isPlaying) {
                setIsPlaying(false);
                return;
              }
              // If we're at the last snapshot, restart from the beginning.
              if (inSnapshotMode && currentSnapshotIndex >= totalSnapshots - 1) {
                setCurrentSnapshotIndex(0);
              }
              setIsPlaying(true);
            };

            return (
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <Tooltip title="Previous">
                  <span>
                    <IconButton size="small" onClick={onPrev} disabled={!canPrev}>
                      <NavigateBefore fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Next">
                  <span>
                    <IconButton size="small" onClick={onNext} disabled={!canNext}>
                      <NavigateNext fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Skip to End">
                  <span>
                    <IconButton size="small" onClick={onSkipToEnd} disabled={!canNext}>
                      <LastPage fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                {inSnapshotMode && (
                  <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
                    <span>
                      <IconButton
                        size="small"
                        onClick={togglePlay}
                        disabled={totalSnapshots === 0}
                      >
                        {isPlaying
                          ? <PauseCircleOutline fontSize="small" />
                          : <PlayCircleOutline fontSize="small" />}
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
                <Typography variant="caption" sx={{ ml: 0.5 }}>{label}</Typography>
              </Box>
            );
          })()}

        </Box>

        {/* 2-Column Content Layout: Left (Python) | Divider | Right (Visualization) */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            minHeight: 0,
            overflow: 'hidden',
            gap: 0,
          }}
        >
          {/* Left Column: Python Editor */}
          <Box
            sx={{
              width: leftWidth,
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid',
              borderColor: 'divider',
              minWidth: 0,
              minHeight: 0,
            }}
          >
            {/* Python Code Editor */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                minHeight: 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: theme.palette.sectionHeaderColor,
                  px: 2,
                  height: '40px',
                  minHeight: '40px',
                  maxHeight: '40px',
                }}
              >
                <Typography variant="body2">
                  Python Editor
                </Typography>
              </Box>
              {/* zIndex:0 + position:relative makes this its OWN stacking
                  context so Monaco's high internal z-indices stay contained
                  here and can't paint/capture over the console bar below. */}
              <Box sx={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', zIndex: 0 }}>
                {loading && (
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="textSecondary">
                      Initializing Pyodide...
                    </Typography>
                  </Box>
                )}
                {!loading && (
                  <PythonCodeEditor
                    value={pythonCode}
                    onChange={setPythonCode}
                    currentLineNumber={
                      (() => {
                        const line = executionResult?.snapshots[currentSnapshotIndex]?.line || null;
                        return line === 'return' ? null : line;
                      })()
                    }
                    errorLineNumber={error?.line ?? null}
                    errorMessage={error ? `${error.type}: ${error.message}` : ''}
                  />
                )}
              </Box>

              {/* Draggable horizontal divider to resize the console height */}
              <div
                onMouseDown={handleConsoleResize}
                style={{
                  height: '5px',
                  cursor: 'row-resize',
                  backgroundColor: theme.palette.divider,
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 2,
                }}
              />

              {/* Console output panel (synced to the current step) */}
              <Box
                sx={{
                  height: consoleHeight,
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: theme.palette.sectionHeaderColor,
                    px: 2,
                    height: '32px',
                    minHeight: '32px',
                    userSelect: 'none',
                  }}
                >
                  <Typography variant="body2">Console</Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    p: 1,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {(() => {
                    // Error case: show any partial output produced before the
                    // crash, then a concise red one-liner.
                    if (error) {
                      const partial = error.stdout || '';
                      const summary = `${error.type}: ${error.message}${error.line ? ` (line ${error.line})` : ''}`;
                      const sep = partial && !partial.endsWith('\n') ? '\n' : '';
                      return (
                        <>
                          {partial}{sep}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            {summary}
                          </Box>
                        </>
                      );
                    }
                    const stdout = executionResult?.stdout || '';
                    if (!stdout) {
                      return (
                        <Typography variant="caption" color="textSecondary">
                          No output
                        </Typography>
                      );
                    }
                    // stdout_len on a snapshot is the output produced *before*
                    // its line runs. To show output *after* the highlighted
                    // line executes (matching the one-ahead visualization
                    // sync), read the next snapshot's length; past the end,
                    // the program has finished so show the full output.
                    const snapshots = executionResult?.snapshots || [];
                    const nextIdx = currentSnapshotIndex + 1;
                    const len = nextIdx >= snapshots.length
                      ? stdout.length
                      : snapshots[nextIdx]?.stdout_len;
                    return stdout.slice(0, len ?? stdout.length);
                  })()}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Draggable Divider */}
          <div
            style={{
              width: '5px',
              cursor: 'col-resize',
              backgroundColor: theme.palette.divider,
              position: 'relative',
              zIndex: 1,
            }}
            onMouseDown={handleMouseDown}
          />

          {/* Right Column: Merlin Visualization + Controls */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            {/* Visualization Header with Page Controls */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: theme.palette.sectionHeaderColor,
                px: 2,
                height: '40px',
                minHeight: '40px',
                maxHeight: '40px',
              }}
            >
              <Typography variant="body2">
                Visualization
              </Typography>
              {pages.length > 0 && (
                <Tooltip title="Set Grid Size">
                  <IconButton size="small" onClick={handleOpenGridDialog}>
                    <Grid3x3 fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Visualization Renderer */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                overflow: 'hidden',
              }}
            >
              {!editableMerlinCode && (
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    No visualization yet
                  </Typography>
                </Box>
              )}
              {editableMerlinCode && (
                <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden"}}>
                  <MermaidRenderer
                    text={compiledMerlin}
                    update={handleUpdateSvgElement}
                    currentPage={currentPage}
                  />
                </div>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Grid Size Dialog */}
      <Dialog open={openGridDialog} onClose={handleCloseGridDialog} fullWidth>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <DialogContentText>
            Enter the grid size for the current page (e.g., 2x2 or 3x3)
          </DialogContentText>
          <form onSubmit={handleSetPageGrid}>
            <TextField
              autoFocus
              required
              margin="dense"
              name="gridSize"
              label="Grid size"
              placeholder="2x2"
              fullWidth
              variant="standard"
            />
            <DialogActions>
              <Button onClick={handleCloseGridDialog}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default PythonVisualizerSection;
