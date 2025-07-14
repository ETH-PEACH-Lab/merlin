import React, { useEffect, useState } from "react";
import MermaidRenderer from "./MermaidRenderer";
import { ElementEditor } from "./ElementEditor";
import Button from '@mui/material/Button';
import { Box, Typography, Card, CardContent, ListItemIcon, ListItemText, Popover, ListItem, List, IconButton, ButtonGroup, Snackbar, Alert } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ShapeLineIcon from '@mui/icons-material/ShapeLine';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import { useParseCompile } from "../context/ParseCompileContext";
import { createShareableUrl, copyToClipboard } from "../utils/urlSharing";

const RendererSection = ({
  mermaidCode,
  handleExport,
  handleSave,
  mermaidRef,
  exampleSvg,
  updateInspector,
  currentPage,
  setCurrentPage,
}) => {
  const [svgElement, updateSvgElement] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const { pages, unparsedCode } = useParseCompile();


  const handleExpand = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickPrev = () => {
    const newCurrentPage = currentPage - 1 >= 1? currentPage - 1 : 1 ;
    setCurrentPage(newCurrentPage);
  };

  const handleClickNext = () => {
    const newCurrentPage = currentPage + 1 <= pages.length ? currentPage + 1 : pages.length;
    setCurrentPage(newCurrentPage);
  };

  const handleShare = async () => {
    try {
      const shareableUrl = createShareableUrl(unparsedCode);
      if (shareableUrl) {
        const success = await copyToClipboard(shareableUrl);
        if (success) {
          setSnackbarMessage('Shareable URL copied to clipboard!');
          setSnackbarSeverity('success');
        } else {
          setSnackbarMessage('Failed to copy URL to clipboard');
          setSnackbarSeverity('error');
        }
      } else {
        setSnackbarMessage('Failed to create shareable URL');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setSnackbarMessage('Error creating shareable URL');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div
      className="SvgRenderContent"
      style={{
        width: `100%`,
        overflow: "auto",
        position: "relative",
      }}
    >
      <Box sx={{
        paddingRight: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #444"
      }}>
        <Box display="flex" flexGrow={1} alignItems={'center'}>
          <Typography variant="overline" sx={{ pl: 2 }}>Diagram Renderer</Typography>
        </Box>
        <Box sx={{ display: "flex" }}>
          <IconButton aria-describedby={id} onClick={handleExpand} sx={{ mr: 1 }} size="small">
            <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
          </IconButton>
          <Popover id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}>
            <List>
              <ListItem>
                <Button onClick={() => { handleExport('svg') }} startIcon={<ShapeLineIcon />}>
                  <ListItemText>SVG</ListItemText>
                </Button>
              </ListItem>
              <ListItem>
                <Button onClick={() => handleExport('png')} startIcon={<ImageIcon />}>
                  <ListItemText>PNG</ListItemText>
                </Button>
              </ListItem>
              <ListItem>
                <Button onClick={() => handleExport('pdf')} startIcon={<PictureAsPdfIcon />}>
                  <ListItemText>PDF</ListItemText>
                </Button>
              </ListItem>
            </List>
          </Popover>
          <IconButton onClick={handleShare} size="small" sx={{ mr: 1 }} title="Share via URL">
            <ShareIcon sx={{ fontSize: 20 }}></ShareIcon>
          </IconButton>
          <IconButton onClick={handleSave} size="small">
            <SaveIcon sx={{ fontSize: 20 }}></SaveIcon>
          </IconButton>
        </Box>
      </Box>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "top",
          height: "100%",
        }}
      >
        <Card sx={{ width: "100%", borderRadius: '0' }}>
          <CardContent>
            <div ref={mermaidRef}>
              <MermaidRenderer text={mermaidCode} update={updateSvgElement} exampleSvg={exampleSvg}  currentPage={currentPage} />
            </div>
            <ElementEditor svgElement={svgElement} updateInspector={updateInspector} />
            
            {(pages && pages.length === 0) ? (
              <Typography sx={{ mt: 2, textAlign: 'center' }}>
                No pages to show.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2,
                }}
              >
                <Button onClick={handleClickPrev} variant="contained" style={{ fontSize: "12px", marginRight: "15px", maxWidth: '80px', maxHeight: '25px', minWidth: '40px', minHeight: '25px' }}>Prev</Button>
                <Button onClick={handleClickNext} variant="contained" style={{ fontSize: "12px", marginRight: "15px", maxWidth: '80px', maxHeight: '25px', minWidth: '40px', minHeight: '25px' }}>Next</Button>
                {currentPage}/{pages.length}
              </Box>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RendererSection;
