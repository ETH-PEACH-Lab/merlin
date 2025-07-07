import React, { useEffect, useState } from "react";
import MermaidRenderer from "./MermaidRenderer";
import { ElementEditor } from "./ElementEditor";
import Button from '@mui/material/Button';
import { Box, Typography, Card, CardContent, ListItemIcon, ListItemText, Popover, ListItem, List, IconButton, ButtonGroup, Tooltip, Snackbar, Alert } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ShapeLineIcon from '@mui/icons-material/ShapeLine';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
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
  
  const { pages, addPage, removePage, unparsedCode } = useParseCompile();

  const handleAddPage = () => {
    console.log(currentPage)
    const pageBefore = currentPage;
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
        display: "grid",
        gridAutoFlow: "column",
        gridAutoColumns: "1fr",
        alignItems: "center",
        borderBottom: "1px solid #444"
      }}>
        <Box display="flex">
          <Box display="flex" flex={"1 1 0px"} alignItems={'center'}>
            <Typography variant="overline" sx={{ pl: 2 }}>Page Controls</Typography>
          </Box>
          <Box sx={{ display: "flex", borderRight: "1px solid #444" }}>
            <Tooltip title="Add a Page">
            <span>
              <IconButton
                disabled={currentPage === 1 || pages.length === 0}
                onClick={handleAddPage}
                sx={{ mr: 1 }}
                size="small"
              >
                <AddIcon sx={{ fontSize: 20 }}></AddIcon>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Remove Current Page">
            <span>
              <IconButton
                disabled={currentPage === 1 || pages.length === 0}
                onClick={handleRemovePage}
                sx={{ mr: 1 }}
                size="small"
              >
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
            <Tooltip title="Download">
              <span>
                <IconButton
                  aria-describedby={id}
                  onClick={handleExpand}
                  sx={{ mr: 1 }}
                  size="small"
                >
                  <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                </IconButton>
              </span>
            </Tooltip>
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
            <Tooltip title="Share via URL">
              <span>
                <IconButton
                  aria-describedby={id}
                  onClick={handleShare}
                  sx={{ mr: 1 }}
                  size="small"
                >
                  <ShareIcon sx={{ fontSize: 20 }}></ShareIcon>
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Save">
              <span>
                <IconButton
                  aria-describedby={id}
                  onClick={handleSave}
                  sx={{ mr: 1 }}
                  size="small"
                >
                  <SaveIcon sx={{ fontSize: 20 }}></SaveIcon>
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <Box sx={{
        paddingRight: 1,
        display: "flex",
        flexGrow: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #444"
      }}>
        <Box display="flex" flex={"1 1 0px"} alignItems={'center'}>
          <Typography variant="overline" sx={{ pl: 2 }}>Component Controls</Typography>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Tooltip title="Create a Component">
            <span>
              <IconButton
                aria-describedby={id}
                onClick={handleExpand}
                sx={{ mr: 1 }}
                size="small"
              >
                <Typography aria-describedby={id} variant="overline" >New</Typography>
                <AddIcon sx={{ fontSize: 20 }}></AddIcon>
              </IconButton>
            </span>
          </Tooltip>
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
                <Button onClick={() => handleCreateArray} startIcon={<RectangleOutlinedIcon />}>
                  <ListItemText>Array</ListItemText>
                </Button>
              </ListItem>
              <ListItem>
                <Button onClick={() => handleCreateStack} startIcon={<RectangleOutlinedIcon />}>
                  <ListItemText>Stack</ListItemText>
                </Button>
              </ListItem>
              <ListItem>
                <Button onClick={() => handleCreateTree} startIcon={<RectangleOutlinedIcon />}>
                  <ListItemText>Tree</ListItemText>
                </Button>
              </ListItem>
              <ListItem>
                <Button onClick={() => handleCreateLinkedList} startIcon={<RectangleOutlinedIcon />}>
                  <ListItemText>Linked List</ListItemText>
                </Button>
              </ListItem>
              <ListItem>
                <Button onClick={() => handleCreateMatrix} startIcon={<RectangleOutlinedIcon />}>
                  <ListItemText>Matrix</ListItemText>
                </Button>
              </ListItem>
              <ListItem>
                <Button onClick={() => handleCreateGraph} startIcon={<RectangleOutlinedIcon />}>
                  <ListItemText>Graph</ListItemText>
                </Button>
              </ListItem>
            </List>
          </Popover>
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
