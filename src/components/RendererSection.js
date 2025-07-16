import React, { useEffect, useState } from "react";
import MermaidRenderer from "./MermaidRenderer";
import { ElementEditor } from "./ElementEditor";
import { CreateComponentItem } from "./CreateComponentItem";
import Button from '@mui/material/Button';
import { Box, Typography, Card, CardContent, ListItemIcon, ListItemText, Popover, ListItem, List, IconButton, ButtonGroup,
         Tooltip, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from "@mui/material";
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
  inspectorIndex,
  currentPage,
  setCurrentPage,
}) => {
  const [svgElement, updateSvgElement] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  
  const { pages, addPage, removePage, unparsedCode, createComponent } = useParseCompile();

  const handleAddPage = () => {
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
  const open1 = Boolean(anchorEl1);
  const id1 = open1 ? 'simple-popover1' : undefined;
  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? 'simple-popover2' : undefined;


  return (
    <div
      className="SvgRenderContent"
      style={{
        width: `100%`,
        height: "100%",
        position: "relative",
        display: "grid",
        gridTemplateRows: "min-content min-content 1fr min-content"
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
                  aria-describedby={id1}
                  onClick={handleExpand1}
                  sx={{ mr: 1 }}
                  size="small"
                >
                  <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                </IconButton>
              </span>
            </Tooltip>
            <Popover id={id1}
              open={open1}
              anchorEl={anchorEl1}
              onClose={handleClose1}
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
                <IconButton onClick={handleSave} size="small">
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
                aria-describedby={id2}
                onClick={handleExpand2}
                sx={{ mr: 1 }}
                size="small"
              >
                <Typography aria-describedby={id2} variant="overline" >New</Typography>
                <AddIcon sx={{ fontSize: 20 }}></AddIcon>
              </IconButton>
            </span>
          </Tooltip>
          <Popover id={id2}
            open={open2}
            anchorEl={anchorEl2}
            onClose={handleCloseDropdown}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}>
            <List>
              <CreateComponentItem 
                name={"Array"} 
                icon={<RectangleOutlinedIcon />}
                text={"Enter the values of the array comma-separated. Eg: 1, 2, 3"}
                formFields={<TextField autoFocus required margin="dense"
                  name="values" label="Values" fullWidth variant="standard"/>
                }
                createFunction={(formJson) => {
                  const values = formJson.values.split(',').map(( value ) => value.trim());
                  const colors = Array(values.length).fill(null);
                  const arrows = Array(values.length).fill(null);

                  createComponent("array", {value: values, color: colors, arrow: arrows}, currentPage);
                  handleCloseDropdown();
                }} 
              />
              <CreateComponentItem 
                name={"Stack"} 
                icon={<RectangleOutlinedIcon />}
                text={"Enter the values of the stack comma-separated. Eg: 1, 2, 3"}
                formFields={<TextField autoFocus required margin="dense"
                  name="values" label="Values" fullWidth variant="standard"/>
                }
                createFunction={(formJson) => {
                  const values = formJson.values.split(',').map(( value ) => value.trim());
                  const colors = Array(values.length).fill(null);
                  const arrows = Array(values.length).fill(null);

                  createComponent("stack", {value: values, color: colors, arrow: arrows}, currentPage);
                  handleCloseDropdown();
                }} 
              />
              <CreateComponentItem 
                name={"Matrix"} 
                icon={<RectangleOutlinedIcon />}
                text={`Enter the values in a row comma-separated and use a semicolon
                        to begin a new row. Eg: 1, 2, 3; 4, 5, 6`}
                formFields={<TextField autoFocus required margin="dense"
                  name="values" label="Values" fullWidth variant="standard"/>
                }
                createFunction={(formJson) => {
                  // TODO maybe also trim the strings
                  const values = formJson.values.split(';').map((x)=>x.split(','));
                  const colors = Array(values.length).fill(Array(values[0].length).fill(null));
                  const arrows = Array(values.length).fill(Array(values[0].length).fill(null));

                  createComponent("matrix", {value: values, color: colors, arrow: arrows}, currentPage);
                  handleCloseDropdown();
                }} 
              />
              <CreateComponentItem 
                name={"Linked List"} 
                icon={<RectangleOutlinedIcon />}
                text={"Enter the values of the linked list comma-separated. Eg: 1, 2, 3"}
                formFields={<TextField autoFocus required margin="dense"
                  name="values" label="Values" fullWidth variant="standard"/>
                }
                createFunction={(formJson) => {
                  const values = formJson.values.split(',').map(( value ) => value.trim());
                  const nodes = [...Array(values.length).keys()]
                  const colors = Array(values.length).fill(null);
                  const arrows = Array(values.length).fill(null);

                  createComponent("linkedlist", {nodes: nodes, value: values, color: colors, arrow: arrows}, currentPage);
                  handleCloseDropdown();
                }} 
              />              
              <CreateComponentItem 
                name={"Tree"} 
                icon={<RectangleOutlinedIcon />}
                text={`Enter the edges separated by a - (Eg parent-child1, parent-child2) and optionally give the nodes 
                  a value (Eg parent: p, child1: c1).`}
                formFields={
                  <React.Fragment>
                    <TextField autoFocus required margin="dense"
                      name="edges" label="Edges" fullWidth variant="standard"/>
                    <TextField autoFocus margin="dense"
                      name="values" label="Values" fullWidth variant="standard"/>
                  </React.Fragment>
                }
                createFunction={(formJson) => {
               const edgeStrings = formJson.edges.split(',').map(( value ) => value.replace(" ", ""));
                  let nodesSet = new Set();
                  let edgeSet = new Set();

                  edgeStrings.forEach(edge => {
                    if (edge.length === 2){
                      var node1 = edge.split('-')[0];
                      var node2 = 'n' + edge.split('-')[1];
                      // Fix in case the node id starts with a number
                      var node1Cleaned = (node1[0].toUpperCase() != node1[0].toLowerCase()) ? node1 : ('n' + node1)
                      var node2Cleaned = (node2[0].toUpperCase() != node2[0].toLowerCase()) ? node2 : ('n' + node2)
                      nodesSet.add(node1Cleaned);
                      nodesSet.add(node2Cleaned);
                      edgeSet.add({start: node1Cleaned, end: node2Cleaned});
                    }
                  });

                  if (edgeSet.size === 0){
                    handleCloseDropdown();
                    return;
                  }

                  const nodes = Array.from(nodesSet);
                  const edges = Array.from(edgeSet);
                  const values = Array(nodes.length).fill(null);

                  const nodesValuesMap = formJson.values.split(',').map(( value ) => value.replace(" ", ""));
                  nodesValuesMap.forEach(function (item) {
                    var node = item.split(':')[0];
                    var nodeCleaned = (node[0].toUpperCase() != node[0].toLowerCase()) ? node : ('n' + node)
                    var index = nodes.indexOf(nodeCleaned);
                    if (index != -1) {
                      values[index] = item.split(':')[1];
                    }
                  }); 

                  const colors = Array(nodes.length).fill(null);
                  const arrows = Array(nodes.length).fill(null);

                  createComponent("tree", {nodes: nodes, children: edges, value: values, color: colors, 
                    arrow: arrows}, currentPage);
                  handleCloseDropdown();
                }} 
              />
              <CreateComponentItem 
                name={"Graph"} 
                icon={<RectangleOutlinedIcon />}
                text={`Enter the edges separated by a - (Eg n1-n2, n2-n3) and optionally give the nodes 
                  a value (Eg n1: 1, n2: 2).`}
                formFields={
                  <React.Fragment>
                    <TextField autoFocus required margin="dense"
                      name="edges" label="Edges" fullWidth variant="standard"/>
                    <TextField autoFocus margin="dense"
                      name="values" label="Values" fullWidth variant="standard"/>
                  </React.Fragment>
                }
                createFunction={(formJson) => {
                  const edgeStrings = formJson.edges.split(',').map(( value ) => value.replace(" ", ""));
                  let nodesSet = new Set();
                  let edgeSet = new Set();

                  edgeStrings.forEach(edge => {
                    if (edge.length === 2){
                      var node1 = edge.split('-')[0];
                      var node2 = 'n' + edge.split('-')[1];
                      // Fix in case the node id starts with a number
                      var node1Cleaned = (node1[0].toUpperCase() != node1[0].toLowerCase()) ? node1 : ('n' + node1)
                      var node2Cleaned = (node2[0].toUpperCase() != node2[0].toLowerCase()) ? node2 : ('n' + node2)
                      nodesSet.add(node1Cleaned);
                      nodesSet.add(node2Cleaned);
                      edgeSet.add({start: node1Cleaned, end: node2Cleaned});
                    }
                  });

                  if (edgeSet.size === 0){
                    handleCloseDropdown();
                    return;
                  }

                  const nodes = Array.from(nodesSet);
                  const edges = Array.from(edgeSet);
                  const values = Array(nodes.length).fill(null);

                  const nodesValuesMap = formJson.values.split(',').map(( value ) => value.replace(" ", ""));
                  nodesValuesMap.forEach(function (item) {
                    var node = item.split(':')[0];
                    var nodeCleaned = (node[0].toUpperCase() != node[0].toLowerCase()) ? node : ('n' + node)
                    var index = nodes.indexOf(nodeCleaned);
                    if (index != -1) {
                      values[index] = item.split(':')[1];
                    }
                  }); 

                  const colors = Array(nodes.length).fill(null);
                  const arrows = Array(nodes.length).fill(null);
                  const hidden = Array(nodes.length).fill(false);

                  createComponent("graph", {nodes: nodes, edges: edges, value: values, color: colors, 
                    arrow: arrows, hidden: hidden}, currentPage);
                  handleCloseDropdown();
                }} 
              />
            </List>
          </Popover>
        </Box>
      </Box>


      <div ref={mermaidRef} style={{ maxHeight: "100%", overflow: "hidden", width: "100%"}}>
        <MermaidRenderer text={mermaidCode} update={updateSvgElement} exampleSvg={exampleSvg}  currentPage={currentPage} />
      </div>
      <ElementEditor svgElement={svgElement} updateInspector={updateInspector} inspectorIndex={inspectorIndex} currentPage={currentPage}/>
      
      <div>
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
