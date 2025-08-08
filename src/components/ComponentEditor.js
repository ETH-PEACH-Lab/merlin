import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, TextField, Tooltip } from "@mui/material";
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import { useParseCompile } from "../context/ParseCompileContext";
import { parseInspectorIndex, createComponentData } from "../compiler/dslUtils.mjs";


export const ComponentEditor = ({ inspectorIndex, currentPage, leaveFunction }) => {
  const [currentComponentData, setCurrentComponentData] = useState(null);
  const [prevComponentData, setPrevComponentData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const { pages, updateValues, updateUnitStyles } = useParseCompile();

  useEffect(() => {
    if (inspectorIndex) {
      const parsedInfo = parseInspectorIndex(inspectorIndex, pages, currentPage);
      const componentData = createComponentData(parsedInfo);
      
      if (componentData) {
        setCurrentComponentData(componentData);
        setPrevComponentData(componentData);
      }
    }
  }, [inspectorIndex, currentPage, pages]);

    
  const handleOpenDialog = (event, type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFieldChange = (e) => {
    setCurrentComponentData({ ...currentComponentData, [e.target.name]: e.target.value });
  };

  const handleEditComponent = (event) => {
    event.preventDefault();
    // Update the values, this can include adding or removing values
    if (typeof currentComponentData["value"] === 'string'){
      updateValues(
        currentComponentData.page,
        currentComponentData.name,
        currentComponentData.type,
        "value",
        prevComponentData["value"],
        currentComponentData["value"].split(',').map(( value ) => value.trim())
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
        typeof currentComponentData["edges"] === 'string' ? currentComponentData["edges"].split(',').map(( value ) => value.trim()) : null
      );
    }
    // For arrows and colors update the styles
    ["color", "arrow"].forEach(fieldKey => {
      if (typeof currentComponentData[fieldKey] === 'string'){
        updateUnitStyles(
          currentComponentData.page,
          currentComponentData.name,
          fieldKey,
          currentComponentData[fieldKey].split(',').map(( value ) => value.trim())
        );
      }
    });
    leaveFunction();
  };

  const getIcon = (name) => {
    switch (name){
      case "styling":
        return <FormatShapesIcon></FormatShapesIcon>;
      case "text":
        return <TextFormatIcon></TextFormatIcon>;
      case "position":
        return <Grid3x3Icon></Grid3x3Icon>;
      default: 
        return <RectangleOutlinedIcon></RectangleOutlinedIcon>
    }
  };

  const getTextField = (name, label, values, specialType="") => {
    var valuesFormatted = values;

    if (values instanceof Array){
      if (specialType === "nodes"){
        valuesFormatted = values.map(( value ) => value + ":" + currentComponentData.value[values.indexOf(value)]);
      }
      else if (specialType === "edges"){
        valuesFormatted = values.map(( value ) => value.start + "-" + value.end);
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
          getTextField("nodes", "Nodes", currentComponentData?.nodes, "nodes") : 
          getTextField("value", "Values", currentComponentData?.value) 
        }
        {(currentComponentData.type === "tree" || currentComponentData.type === "graph") ? 
          getTextField("edges", "Edges", currentComponentData?.edges, "edges") : null
        }
        {getTextField("color", "Colors", currentComponentData?.color)}
        {getTextField("arrow", "Arrows", currentComponentData?.arrow)}
      </div>
      );
    case "Text":
      return (
        <div>
          {getTextField("text_above", "Text above", currentComponentData?.above)}
          {getTextField("text_below", "Text below", currentComponentData?.below)}
          {getTextField("text_left", "Text left", currentComponentData?.left)}
          {getTextField("text_right", "Text right", currentComponentData?.right)}
        </div>
      );
    case "Position":
      return (
        <div>
          {getTextField("position", "Position", currentComponentData?.position)}
        </div>
      );
    }
  }

  return (
    <React.Fragment>
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
          Object.entries({styling: "Styling", text: "Text", position: "Position"}).map(([fieldKey, label]) => (
          <Tooltip title={label} key={fieldKey}>
              <span style={{marginLeft: "10px", marginRight: "10px"}}>
              <IconButton size="small" onClick={(e) => {handleOpenDialog(e, label);}}>
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
              <Button onClick={leaveFunction}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
          }        
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

