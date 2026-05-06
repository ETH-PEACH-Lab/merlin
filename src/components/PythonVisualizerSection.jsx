import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
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
  Add,
  Delete,
  Grid3x3,
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

const PythonVisualizerSection = () => {
  const theme = useTheme();
  const mermaidRef = useRef(null);

  const [pythonCode, setPythonCode] = useState(`# Write Python code here`);
  const [executionResult, setExecutionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editableMerlinCode, setEditableMerlinCode] = useState('');
  const [compiledMerlin, setCompiledMerlin] = useState('');
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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
    if (editableMerlinCode) {
      try {
        const compiled = parseAndCompileDSL(editableMerlinCode);
        setCompiledMerlin(compiled);

        const extractedPages = extractPagesFromDSL(editableMerlinCode);
        const currentPageCount = extractedPages.length;
        const previousPageCount = previousPageCountRef.current;
        
        console.log(`Page count: prev=${previousPageCount}, current=${currentPageCount}, currentPage=${currentPage}`);
        
        setPages(extractedPages);
        
        if (extractedPages.length > 0 && currentPage > extractedPages.length) {
          console.log(`Adjusting currentPage from ${currentPage} to ${extractedPages.length}`);
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
  };

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setExecutionResult(null);
    setCurrentPage(1);

    try {
      console.log('Executing Python code...');
      const result = await pyodideExecutor.execute(pythonCode, 1000);

      if (result.success === false) {
        setError({
          message: result.error,
          type: result.errorType,
          traceback: result.errorTraceback,
        });
      } else {
        setExecutionResult(result);
    
        try {
          const merlinCode = snapshotsToMerlinDSL_Pipeline(
            result.snapshots,
            pythonCode
          );
          console.log('Generated Merlin DSL:', merlinCode);
          console.log('DSL length:', merlinCode?.length);
          setEditableMerlinCode(merlinCode);
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
  };



  const handleAddPage = () => {
    if (pages.length === 0) {
      showSnackbar('No pages in visualization', 'error');
      return;
    }
    const newPageNum = Math.max(...pages) + 1;
    const newCode = editableMerlinCode + `\n\npage ${newPageNum}\n  // New page content`;
    setEditableMerlinCode(newCode);
  };

  const handleDeletePage = () => {
    if (pages.length <= 1) {
      showSnackbar('Cannot delete the only page', 'error');
      return;
    }

    const pageRegex = new RegExp(`page\\s+${currentPage}\\b[\\s\\S]*?(?=page\\s+\\d|$)`, 'gi');
    const newCode = editableMerlinCode.replace(pageRegex, '').trim();
    setEditableMerlinCode(newCode);

    const newPages = extractPagesFromDSL(newCode);
    if (newPages.length > 0) {
      setCurrentPage(newPages[0]);
    }
  };

  const handlePrevPage = () => {
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      setCurrentPage(pages[currentIndex - 1]);
    }
  };

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
            p: 2,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrow />}
            onClick={handleExecute}
            disabled={loading || !pythonCode.trim()}
          >
            {loading ? 'Running...' : 'Run Code'}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Clear />}
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </Button>

          {loading && (
            <CircularProgress size={24} sx={{ ml: 1 }} />
          )}

          {executionResult && !error && (
            <Typography variant="body2" color="success.main" sx={{ ml: 'auto' }}>
              ✓ {executionResult.snapshots?.length || 0} snapshots
            </Typography>
          )}
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
            }}
          >
            {/* Python Code Editor */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
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
              <Box sx={{ flex: 1, minHeight: 0 }}>
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
                {error && (
                  <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {error.type || 'Error'}
                      </Typography>
                      <Typography variant="body2">
                        {error.message}
                      </Typography>
                      {error.traceback && (
                        <Box
                          sx={{
                            mt: 1,
                            p: 1,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            overflow: 'auto',
                            maxHeight: '150px',
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {error.traceback}
                        </Box>
                      )}
                    </Alert>
                  </Box>
                )}
                {!loading && (
                  <PythonCodeEditor
                    value={pythonCode}
                    onChange={setPythonCode}
                  />
                )}
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
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    onClick={handlePrevPage}
                    variant="contained"
                    disabled={pages.length <= 1 || pages.indexOf(currentPage) === 0}
                    style={{ fontSize: "12px", marginRight: "15px", maxWidth: '80px', maxHeight: '25px', minWidth: '40px', minHeight: '25px' }}
                  >
                    Prev
                  </Button>
                  <Button
                    onClick={handleNextPage}
                    variant="contained"
                    disabled={pages.length <= 1 || pages.indexOf(currentPage) === pages.length - 1}
                    style={{ fontSize: "12px", marginRight: "15px", maxWidth: '80px', maxHeight: '25px', minWidth: '40px', minHeight: '25px' }}
                  >
                    Next
                  </Button>
                  <Typography variant="caption">
                    {currentPage}/{pages.length}
                  </Typography>
                  <Tooltip title="Add Page">
                    <IconButton size="small" onClick={handleAddPage}>
                      <Add fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Page">
                    <IconButton
                      size="small"
                      onClick={handleDeletePage}
                      disabled={pages.length <= 1}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Set Grid Size">
                    <IconButton size="small" onClick={handleOpenGridDialog}>
                      <Grid3x3 fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
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
