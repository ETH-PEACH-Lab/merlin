import React, { useState } from "react";
import MermaidRenderer from "./MermaidRenderer";
import { ElementEditor } from "./ElementEditor";
import Button from '@mui/material/Button';
import { Box, Typography, Card, CardContent, ListItemIcon, ListItemText, Popover, ListItem, List, IconButton } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ShapeLineIcon from '@mui/icons-material/ShapeLine';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const RendererSection = (({
  mermaidCode,
  handleExport,
  handleSave,
  mermaidRef,
  updateCode, 
  exampleSvg
}) => {
  const [svgElement, updateSvgElement] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleExpand = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
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
        borderBottom:"1px solid #444"
      }}>
        <Box display="flex" flexGrow={1} alignItems={'center'} >
          <Typography variant="overline" sx={{pl: 2}}>Diagram Renderer</Typography>
        </Box>
        <Box sx={{ display: "flex" }}>
          <IconButton aria-describedby={id} onClick={handleExpand} sx={{mr:1}} size="small">
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
          <IconButton onClick={handleSave} size="small">
            <SaveIcon sx={{ fontSize: 20 }}></SaveIcon>
          </IconButton>
        </Box>
        {/* <div className="buttons-container">
          <Button variant="outlined" onClick={handleDownload}>
            Download SVG
          </Button>
          <div className="dropdown">
            <button className="export-button">Export</button>
            <div className="dropdown-content">
              <button onClick={() => handleExport("png")}>Export as PNG</button>
              <button onClick={() => handleExport("pdf")}>Export as PDF</button>
            </div>
          </div>
          <button onClick={handleSave} className="save-button">
            Save
          </button>
        </div> */}

      </Box>

      <div
        ref={mermaidRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "top",
          height: "100%",
        }}
      >
        <Card sx={
          {
            height: "80%",
            width: "100%",
            borderRadius: '0'
          }
        }>
          <CardContent>
            <MermaidRenderer text={mermaidCode} update={updateSvgElement} />
            <ElementEditor svgElement={svgElement} updateCode={updateCode} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
});

export default RendererSection;
