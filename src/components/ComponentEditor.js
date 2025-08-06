import React, { useEffect, useState } from "react";
import { Box, IconButton, Popover, TextField, Tooltip, SvgIcon } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import TextRotateVerticalIcon from '@mui/icons-material/TextRotateVertical';
import { useParseCompile } from "../context/ParseCompileContext";
import { Button, DialogActions, Dialog, DialogContent } from "@mui/material";
import { parseInspectorIndex, createComponentData } from "../compiler/dslUtils.mjs";


export const ComponentEditor = ({ inspectorIndex, currentPage, leaveFunction }) => {
  const [currentComponentData, setCurrentComponentData] = useState(null);
  const [prevComponentData, setPrevComponentData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const { pages, updateValues } = useParseCompile();
  
  const handleOpenDialog = (event, type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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

  const handleFieldChange = (e) => {
    setCurrentComponentData({ ...currentComponentData, [e.target.name]: e.target.value });
  };

  const handleEditComponent = (event) => {
    console.log(currentComponentData);
    event.preventDefault();
    ["nodes", "edges", "value", "color", "arrow"].forEach(fieldKey => {
      const newValue = currentComponentData[fieldKey]
      if (typeof newValue === 'string' || newValue instanceof String){
        const newValueParsed = newValue.split(',').map(( value ) => value.trim());
        updateValues(currentComponentData.type, currentComponentData.name, currentComponentData.page, fieldKey, prevComponentData[fieldKey], newValueParsed);
      }
    })
    leaveFunction();
  };

  const displayValue = (value) => {
    if (value === null || typeof value === 'string' || value instanceof String){
      return value;
    }
    return value.map(( value ) => (value === null) ? "_" : value);
  };

  const getIcon = (name) => {
    switch (name){
      case "styling":
        return <AddIcon></AddIcon>;
      case "structure":
        return <ClearIcon></ClearIcon>;
      case "text":
        return <EditIcon></EditIcon>;
      case "postion":
        return <FormatColorFillIcon></FormatColorFillIcon>;
      default: 
        return <RectangleOutlinedIcon></RectangleOutlinedIcon>
    }
  };

  const getDialogFields = () =>{
    switch (dialogType){
    case "Styling":
      return (
        <div>
          <TextField name="value" label="Values" value={displayValue(currentComponentData?.value)} margin="dense" fullWidth variant="standard" onChange={handleFieldChange}/>
          <TextField name="color" label="Colors" value={displayValue(currentComponentData?.color)} margin="dense" fullWidth variant="standard" onChange={handleFieldChange}/>
          <TextField name="arrow" label="Arrows" value={displayValue(currentComponentData?.arrow)} margin="dense" fullWidth variant="standard" onChange={handleFieldChange}/>
        </div>
      );
    case "Structure":
      return (
        <div>
          <TextField name="nodes" label="Nodes" value={displayValue(currentComponentData?.nodes)} margin="dense" fullWidth variant="standard" onChange={handleFieldChange}/>
          <TextField name="edges" label="Edges" value={displayValue(currentComponentData?.edges)} margin="dense" fullWidth variant="standard" onChange={handleFieldChange}/>        
        </div>
      );
    case "Text":
      return (
        <div>
          <TextField name="text_above" label="Text above" value={currentComponentData?.above} margin="dense" fullWidth variant="standard" onChange={handleFieldChange}/>
          <TextField name="text_below" label="Text below" value={currentComponentData?.below} margin="dense" fullWidth variant="standard" onChange={handleFieldChange}/>
          <TextField name="text_left"  label="Text left"  value={currentComponentData?.left}  margin="dense" fullWidth variant="standard" onChange={handleFieldChange}/>
          <TextField name="text_right" label="Text right" value={currentComponentData?.right} margin="dense" fullWidth variant="standard" onChange={handleFieldChange}/>
        </div>
      );
    case "Position":
      return (
        <div>
          <TextField name="position" label="Position" value="" margin="dense" fullWidth variant="standard" onChange={handleFieldChange}/>
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
          Object.entries({styling: "Styling", structure: "Structure", text: "Text", position: "Position"}).map(([fieldKey, label]) => (
          <Tooltip title={label}>
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

