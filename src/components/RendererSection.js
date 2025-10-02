import React, { useState, useRef, useEffect } from "react";
import MermaidRenderer from "./MermaidRenderer";
import { ElementEditor } from "./ElementEditor";
import { CreateComponentItem } from "./CreateComponentItem";
import Button from '@mui/material/Button';
import { Box, Typography, ListItemText, Popover, ListItem, List, IconButton,
         Tooltip, TextField, Snackbar, Alert } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ShapeLineIcon from '@mui/icons-material/ShapeLine';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SlideshowIcon from '@mui/icons-material/Slideshow';
import SettingsIcon from '@mui/icons-material/Settings';
import WebIcon from '@mui/icons-material/Web';
import GifBox from '@mui/icons-material/GifBox';
import Movie from '@mui/icons-material/Movie';
import { useParseCompile } from "../context/ParseCompileContext";
import { createShareableUrl, copyToClipboard } from "../utils/urlSharing";
import { arrayIcon, stackIcon, matrixIcon, linkedListIcon, treeIcon, graphIcon, textIcon } from "./CustomIcons";
import { useStudy } from "../study/StudyContext";


const RendererSection = ({
  mermaidCode,
  handleExport,
  handleSave,
  mermaidRef,
  exampleSvg,
  updateInspector,
  inspectorIndex,
  currentPage,
  setCurrentPage,
  onOpenCustomExport,
}) => {
  const [svgElement, updateSvgElement] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  
  const { pages, addPage, removePage, unparsedCode, createComponent, updateCompiledSize } = useParseCompile();
  // Measure the stable outer container to avoid feedback from inner content resize
  const containerMeasureRef = React.useRef(null);
  // Refs to subtract non-diagram UI from height
  const topToolbar1Ref = React.useRef(null);
  const topToolbar2Ref = React.useRef(null);
  const bottomPageControlsRef = React.useRef(null);
  const { phase, currentKind, logEvent } = useStudy();
  const inStudyTask = phase === 'task';

  const handleAddPage = () => {
    const pageBefore = (pages.length === 0) ? 0 : currentPage;
    addPage(pageBefore);
    setCurrentPage(pageBefore + 1);
  };

  const handleRemovePage = () => {
    const pageBefore = currentPage;
    removePage(pageBefore);
    if (pageBefore > 1) {
      setCurrentPage(pageBefore - 1);
    } else {
      setCurrentPage(1);
    }
  };

  const handleExpand1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl1(null);
  };

  const handleExpand2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl2(null);
  };

  const handleClickPrev = () => {
    const newCurrentPage = currentPage - 1 >= 1? currentPage - 1 : 1 ;
    setCurrentPage(newCurrentPage);
    if (inStudyTask) logEvent('navigate_page', { direction: 'prev', page: newCurrentPage });
  };

  const handleClickNext = () => {
    const newCurrentPage = currentPage + 1 <= pages.length ? currentPage + 1 : pages.length;
    setCurrentPage(newCurrentPage);
    if (inStudyTask) logEvent('navigate_page', { direction: 'next', page: newCurrentPage });
  };

  const handleShare = async () => {
    try {
      const shareableUrl = createShareableUrl(unparsedCode);
      if (shareableUrl) {
        const success = await copyToClipboard(shareableUrl);
        if (success) {
          setSnackbarMessage('Shareable URL copied to clipboard!');
          setSnackbarSeverity('success');
          if (inStudyTask) logEvent('share_url', { kind: currentKind, success: true });

        } else {
          setSnackbarMessage('Failed to copy URL to clipboard');
          setSnackbarSeverity('error');
          if (inStudyTask) logEvent('share_url', { kind: currentKind, success: false });

        }
      } else {
        setSnackbarMessage('Failed to create shareable URL');
        setSnackbarSeverity('error');
        if (inStudyTask) logEvent('share_url', { kind: currentKind, success: false });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setSnackbarMessage('Error creating shareable URL');
      setSnackbarSeverity('error');
      if (inStudyTask) logEvent('share_url', { kind: currentKind, success: false, error: String(error) });
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const open1 = Boolean(anchorEl1);
  const id1 = open1 ? 'simple-popover1' : undefined;
  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? 'simple-popover2' : undefined;

  // Size updates: in study tasks, prefer window resize + explicit events; otherwise use ResizeObserver
  React.useEffect(() => {
    const SAFE_MARGIN = 12; // px margin to avoid scrollbar flicker at boundary
    const parsePx = (v) => {
      const n = parseFloat(v);
      return Number.isNaN(n) ? 0 : n;
    };
    const measureAndUpdate = (force = false) => {
      const el = containerMeasureRef.current;
      if (!el || !updateCompiledSize) return;
      const rect = el.getBoundingClientRect();
      let reservedH = 0;
      const addEl = (elRef) => {
        const el = elRef?.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        reservedH += r.height + parsePx(cs.marginTop) + parsePx(cs.marginBottom);
      };
      // In non-study mode, subtract both top toolbars
      if (!inStudyTask) {
        addEl(topToolbar1Ref);
        addEl(topToolbar2Ref);
      }
      // Always subtract page controls at the bottom
      addEl(bottomPageControlsRef);
      const w = Math.max(1, Math.round(rect.width) - SAFE_MARGIN);
      const h = Math.max(1, Math.round(rect.height - reservedH) - SAFE_MARGIN);
      updateCompiledSize(w, h, force);
    };

    if (inStudyTask) {
      let t = null;
      const onWinResize = () => {
        if (t) clearTimeout(t);
        t = setTimeout(() => measureAndUpdate(false), 120);
      };
      window.addEventListener('resize', onWinResize);
      // Initial measurement after mount/layout
      const init = setTimeout(() => measureAndUpdate(true), 80);
      return () => { window.removeEventListener('resize', onWinResize); if (t) clearTimeout(t); clearTimeout(init); };
    }

    // Non-study: track live container changes via ResizeObserver
    const target = containerMeasureRef.current;
    if (!target || !updateCompiledSize) return;
    let frame = null;
    let lastW = 0, lastH = 0;
    const ro = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      // Recompute using reserved UI heights on each callback
      const rect = target.getBoundingClientRect();
      let reservedH = 0;
      const addEl = (elRef) => {
        const el = elRef?.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        reservedH += r.height + parsePx(cs.marginTop) + parsePx(cs.marginBottom);
      };
      addEl(topToolbar1Ref);
      addEl(topToolbar2Ref);
      addEl(bottomPageControlsRef);
      const rw = Math.max(1, Math.round(rect.width) - SAFE_MARGIN);
      const rh = Math.max(1, Math.round(rect.height - reservedH) - SAFE_MARGIN);
      if (Math.abs(rw - lastW) < 2 && Math.abs(rh - lastH) < 2) return;
      lastW = rw; lastH = rh;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => updateCompiledSize(rw, rh));
    });
    ro.observe(target);
    const timeout = setTimeout(() => measureAndUpdate(false), 60);
    return () => { if (frame) cancelAnimationFrame(frame); ro.disconnect(); clearTimeout(timeout); };
  }, [updateCompiledSize, inStudyTask]);


  return (
    <div
      className="SvgRenderContent"
      ref={containerMeasureRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {/* Toolbars hidden in study tasks */}
      {!inStudyTask && (
        <Box ref={topToolbar1Ref} sx={{
          paddingRight: 1,
          display: "grid",
          gridAutoFlow: "column",
          alignItems: "center",
          borderBottom: "1px solid #444",

        }}>
          <Box display="flex">
            <Box display="flex" flex={"1 1 0px"} alignItems={'center'}>
              <Typography variant="overline" sx={{ pl: 2 }}>Page Controls</Typography>
            </Box>
            <Box sx={{ display: "flex", borderRight: "1px solid #444" }}>
              <Tooltip title="Add a Page">
              <span>
                <IconButton onClick={handleAddPage} sx={{ mr: 1 }} size="small">
                  <AddIcon sx={{ fontSize: 20 }}></AddIcon>
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Remove Current Page">
              <span>
                <IconButton disabled={currentPage === 1 || pages.length === 0} onClick={handleRemovePage} sx={{ mr: 1 }} size="small">
                  <DeleteIcon sx={{ fontSize: 20 }}></DeleteIcon>
                </IconButton>
              </span>
            </Tooltip>
            </Box>
          </Box>
          <Box display="flex">
            <Box display="flex" flex={"1 1 0px"} alignItems={'center'} borderLeft={"1px solid #444"} >
              <Typography variant="overline" sx={{ pl: 2 }}>Export Controls</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Tooltip title={pages.length === 0 ? "No pages to export" : "Export"}>
                <span>
                  <IconButton aria-describedby={id1} onClick={handleExpand1} sx={{ mr: 1 }} size="small" disabled={pages.length === 0}>
                    <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                  </IconButton>
                </span>
              </Tooltip>
              {/* Popover content omitted for brevity; unchanged */}
            </Box>
          </Box>
        </Box>
      )}
      {!inStudyTask && (
        <Box ref={topToolbar2Ref} sx={{
          paddingRight: 1,
          display: "flex",
          flexGrow: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #444"
        }}>
          <Box display="flex" flex={"1 1 0px"} alignItems={'center'}>
            <Typography variant="overline" sx={{ pl: 2 }}>Component Controls</Typography>
          </Box>
          {/* Creation popover retained in non-study mode; omitted in study */}
        </Box>
      )}


      <div
        ref={mermaidRef}
        style={{
          flex: 1,
            width: '100%',
          minHeight: 0,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'flex-start'
        }}
        data-study-mode={inStudyTask}
      >
        <MermaidRenderer
          text={mermaidCode}
          update={updateSvgElement}
          exampleSvg={exampleSvg}
          currentPage={currentPage}
        />
      </div>
      {/* Disable unit HUD during study */}
      {!inStudyTask && (
        <ElementEditor svgElement={svgElement} updateInspector={updateInspector} inspectorIndex={inspectorIndex} currentPage={currentPage}/>
      )}
      
      {(pages && pages.length === 0) ? (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          No pages to show.
        </Typography>
      ) : (
        <Box
          ref={bottomPageControlsRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
            minHeight: '40px'
          }}
        >
          <Button onClick={handleClickPrev} variant="contained" style={{ fontSize: "12px", marginRight: "15px", maxWidth: '80px', maxHeight: '25px', minWidth: '40px', minHeight: '25px' }}>Prev</Button>
          <Button onClick={handleClickNext} variant="contained" style={{ fontSize: "12px", marginRight: "15px", maxWidth: '80px', maxHeight: '25px', minWidth: '40px', minHeight: '25px' }}>Next</Button>
          {currentPage}/{pages.length}
        </Box>
      )}
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
        '&.MuiSnackbar-root': { top: '150px' },
      }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RendererSection;
