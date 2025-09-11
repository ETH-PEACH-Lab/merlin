import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, Popover, TextField, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import TitleIcon from '@mui/icons-material/Title';
import { useParseCompile } from "../context/ParseCompileContext";
import { parseInspectorIndex, createComponentData } from "../compiler/dslUtils.mjs";


export const ComponentEditor = ({ inspectorIndex, currentPage, componentAnchorEl, setComponentAnchorEl }) => {
  const componentToolbarOpen = Boolean(componentAnchorEl);
  const componentToolbar = componentToolbarOpen ? "component-toolbar-popover" : undefined;
  const [currentComponentData, setCurrentComponentData] = useState(null);
  const [prevComponentData, setPrevComponentData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const { pages, updateValues, updateUnitStyles, updateText, updatePosition, removeComponent } = useParseCompile();
    
  
  const componentPopoverEnter = () => {
    componentAnchorEl.setAttribute("stroke", "#90cafd");
  };

  const componentPopoverLeave = () => {
    setOpenDialog(false);
    setComponentAnchorEl(null);
  };

  useEffect(() => {
    if (inspectorIndex) {
      const parsedInfo = parseInspectorIndex(inspectorIndex, pages, currentPage);
      const componentData = createComponentData(parsedInfo);
      
      if (componentData) {
        setCurrentComponentData(componentData);
        setPrevComponentData(componentData);
        if (componentAnchorEl){
          componentPopoverEnter();
        }
      }
    }
  }, [inspectorIndex, currentPage, pages]);
    
  useEffect(() => {
    if (!componentAnchorEl){
      componentPopoverLeave();
    }
  },[componentAnchorEl])

  const handleToolbarClick = (event, type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFieldChange = (e) => {
    setCurrentComponentData({ ...currentComponentData, [e.target.name]: e.target.value });
  };

  const parseUserInput = (input, componentType) => {
    if (componentType === "matrix"){
      return input.split('],').map(( row ) =>  row.replaceAll("[", "").replaceAll("]", "").split(","));
    }
    return input.split(',').map(( value ) => value.trim());
  }

  const handleEditComponent = (event) => {
    event.preventDefault();
    componentPopoverLeave();
    if (dialogType === "Remove"){
      removeComponent(currentComponentData.name);
      return;
    }


    // Update the values, this can include adding or removing values
    if (typeof currentComponentData["value"] === 'string'){
      updateValues(
        currentComponentData.page,
        currentComponentData.name,
        currentComponentData.type,
        "value",
        prevComponentData["value"],
        parseUserInput(currentComponentData["value"], currentComponentData.type)
      );
    }
    // Update the nodes, edges and values
    else if (typeof currentComponentData["nodes"] === 'string' || typeof currentComponentData["edges"] === 'string'){
      updateValues(
        currentComponentData.page,
        currentComponentData.name,
        currentComponentData.type,
        "nodes",
        prevComponentData["nodes"],
        currentComponentData["nodes"],
        prevComponentData["edges"].map(( edge ) => edge.start + "-" + edge.end),
        typeof currentComponentData["edges"] === 'string' ? parseUserInput(currentComponentData["edges"], currentComponentData.type) : null
      );
    }
    // For arrows and colors update the styles
    ["color", "arrow"].forEach(fieldKey => {
      if (typeof currentComponentData[fieldKey] === 'string'){
        updateUnitStyles(
          currentComponentData.page,
          currentComponentData.name,
          fieldKey,
          parseUserInput(currentComponentData[fieldKey], currentComponentData.type)
        );
      }
    });
    ["text_above", "text_below", "text_left", "text_right"].forEach(fieldKey => {
      if (currentComponentData[fieldKey] !== "" && currentComponentData[fieldKey] !== prevComponentData[fieldKey]){
        updateText(
          currentComponentData.page,
          currentComponentData.name,
          fieldKey,
          currentComponentData[fieldKey]
        );
      }
    });
    if (currentComponentData["position"] !== "" && currentComponentData["position"] !== prevComponentData["position"]){
      updatePosition(
        currentComponentData.page,
        currentComponentData.name,
        currentComponentData["position"]
      );
    }
    componentPopoverLeave();
  };

  const getIcon = (name) => {
    switch (name){
      case "styling":
        return <FormatShapesIcon></FormatShapesIcon>;
      case "text":
        return <TitleIcon></TitleIcon>;
      case "position":
        return <Grid3x3Icon></Grid3x3Icon>;
      case "remove":
        return <DeleteIcon></DeleteIcon>;
      default: 
        return <RectangleOutlinedIcon></RectangleOutlinedIcon>
    }
  };

  const getTextField = (name, label, values, componentType, specialField="") => {
    var valuesFormatted = values;

    if (values instanceof Array){
      if (specialField === "nodes"){
        valuesFormatted = values.map(( value ) => value + ":" + currentComponentData.value[values.indexOf(value)]);
      }
      else if (specialField === "edges"){
        valuesFormatted = values.map(( value ) => value.start + "-" + value.end);
      }
      else if (componentType === "matrix"){
        valuesFormatted = values.map(( row ) => "[" + row.map(( value ) => (value === null) ? "_" : value) + "]");
      }
      else{
        valuesFormatted = values.map(( value ) => (value === null) ? "_" : value);
      }
    }
    return <TextField name={name} label={label} value={valuesFormatted} margin="dense" 
                      fullWidth variant="standard" onChange={handleFieldChange}/>;
  };

  const getDialogFields = () =>{
    switch (dialogType){
    case "Styling":
      return (
      <div>
        {(currentComponentData.type === "tree" || currentComponentData.type === "graph" || currentComponentData.type === "linkedlist") ? 
          getTextField("nodes", "Nodes", currentComponentData?.nodes, currentComponentData?.type, "nodes") : 
          getTextField("value", "Values", currentComponentData?.value, currentComponentData?.type) 
        }
        {(currentComponentData.type === "tree" || currentComponentData.type === "graph") ? 
          getTextField("edges", "Edges", currentComponentData?.edges, currentComponentData?.type, "edges") : null
        }
        {getTextField("color", "Colors", currentComponentData?.color, currentComponentData?.type)}
        {getTextField("arrow", "Arrows", currentComponentData?.arrow, currentComponentData?.type)}
      </div>
      );
    case "Text":
      return (
        <div>
          {getTextField("text_above", "Text above", currentComponentData?.text_above, currentComponentData?.type)}
          {getTextField("text_below", "Text below", currentComponentData?.text_below, currentComponentData?.type)}
          {getTextField("text_left", "Text left", currentComponentData?.text_left, currentComponentData?.type)}
          {getTextField("text_right", "Text right", currentComponentData?.text_right, currentComponentData?.type)}
        </div>
      );
    case "Position":
      return (
        <div>
          {getTextField("position", "Position", currentComponentData?.position, currentComponentData?.type)}
        </div>
      );
    case "Remove":
      return (
        <div>
          <DialogContentText>
            Do you really want to delete this component? It will be deleted from all pages.
          </DialogContentText>
        </div>
      );

    }
  }

  return (
    <Popover
      id={componentToolbar}
      open={componentToolbarOpen}
      anchorEl={componentAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      slotProps={{ paper: { sx: { pointerEvents: "auto" } } }}
      sx={{ pointerEvents: "none" }}>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          p: "5px 15px",
        }}
        noValidate
        autoComplete="off"
      >
        
        {/* Dynamically generate inputs based on type definition */}
        {currentComponentData &&
          Object.entries({remove: "Remove", styling: "Structure & Styling", text: "Text", position: "Position"}).map(([fieldKey, label]) => (
          <Tooltip title={label} key={fieldKey}>
              <span style={{marginLeft: "10px", marginRight: "10px"}}>
              <IconButton size="small" onClick={(e) => {handleToolbarClick(e, label);}}>
                  {getIcon(fieldKey)}
              </IconButton>
              </span>
          </Tooltip>
        ))
        }
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth> 
        <DialogContent sx={{ paddingBottom: 0 }}>
          {currentComponentData &&
          <form onSubmit={handleEditComponent}>
              {getDialogFields()}
            <DialogActions>
              <Button onClick={componentPopoverLeave}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
          }        
        </DialogContent>
      </Dialog>
    </Popover>
  );
};

