import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, FormControl,
  FormControlLabel, FormLabel, InputLabel, IconButton, MenuItem, Popover, Select, Radio, RadioGroup,
  TextField, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import Circle from "@uiw/react-color-circle";
import { useParseCompile } from "../context/ParseCompileContext";
import { parseInspectorIndex, createUnitData, getFieldDropdownOptions, getColors } from "../utils/dslUtils.mjs";


export const TextEditor = ({ inspectorIndex, currentPage, textAnchorEl, setTextAnchorEl }) => {
  const textToolbarOpen = Boolean(textAnchorEl);
  const textToolbar = textToolbarOpen ? "text-toolbar-popover" : undefined;
  const [currentTextData, setCurrentTextData] = useState(null);
  const [prevTextData, setPrevTextData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'edit-unit-popover' : undefined;
  const { pages, updateValue, updateText, updatePosition, removeComponent, error } = useParseCompile();
    
  const textPopoverEnter = () => {
    textAnchorEl.setAttribute("stroke", "#90cafd");
  };

  const handleOpenPopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const textPopoverLeave = () => {
    setOpenDialog(false);
    setTextAnchorEl(null);
  };

  useEffect(() => {
    if (inspectorIndex) {
      const parsedInfo = parseInspectorIndex(inspectorIndex, pages, currentPage);
      const textData = createUnitData(parsedInfo);
      
      if (textData) {
        setCurrentTextData(textData);
        setPrevTextData(textData);
        if (textAnchorEl){
          textPopoverEnter();
        }
      }
    }
  }, [inspectorIndex, currentPage, pages]);
    
  useEffect(() => {
    if (!textAnchorEl){
      textPopoverLeave();
    }
  },[textAnchorEl])

  const handleToolbarClick = (event, type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFieldChange = (e) => {
    setCurrentTextData({ ...currentTextData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (fieldKey, value) => {
    setCurrentTextData({ ...currentTextData, [fieldKey]: value });
  };

  const handleColorChange = (selectedColor) =>{
    textPopoverLeave();
    updateValue(
      currentTextData.page,
      currentTextData.name,
      currentTextData.coordinates,
      "color",
      selectedColor.hex
    );
  }

  const handleEditText = (event) => {
    event.preventDefault();
    textPopoverLeave();
    if (dialogType === "remove"){
      removeComponent(currentTextData.page, currentTextData.name);
      return;
    }
    ["width", "height", "fontSize", "lineSpacing", "value", "align", "fontWeight", "fontFamily"].forEach(fieldKey => {
      if (currentTextData[fieldKey] !== "" && currentTextData[fieldKey] !== prevTextData[fieldKey]){
        updateText(
          currentTextData.page,
          currentTextData.name,
          currentTextData.type,
          currentTextData.coordinates["index"],
          fieldKey,
          currentTextData[fieldKey]
        );
      }
    });
    if (currentTextData["position"] !== "" && currentTextData["position"] !== prevTextData["position"]){
      updatePosition(
        currentTextData.page,
        currentTextData.name,
        currentTextData["position"]
      );
    }
  };

  const getIcon = (name, value) => {
    switch (name){
      case "text":
        return <EditIcon></EditIcon>;
      case "color":
        return <FormatColorFillIcon sx={{ color: (value !== null) ? value : "#ffffff" }}></FormatColorFillIcon>;
      case "font":
        return <FormatItalicIcon></FormatItalicIcon>
      case "position":
        return <Grid3x3Icon></Grid3x3Icon>;
      case "remove":
        return <DeleteIcon></DeleteIcon>;
      default: 
        return <RectangleOutlinedIcon></RectangleOutlinedIcon>
    }
  };

  const getTextField = (name, label, values, specialField="") => {
    var valuesFormatted = values;

    if (values instanceof Array){
      if (specialField === "nodes"){
        valuesFormatted = values.map(( value ) => value + ":" + currentTextData.value[values.indexOf(value)]);
      }
      else if (specialField === "edges"){
        valuesFormatted = values.map(( value ) => value.start + "-" + value.end);
      }
      else if (textType === "matrix"){
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
    case "font":
      return (
      <div>
          {getTextField("fontSize", "Font Size (as a number with no unit)", currentTextData?.fontSize)}
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="font-family-select-label">Font Family</InputLabel>
            <Select
              labelId="font-family-select-label"
              id="font-family-select"
              label="Font Family"
              name="fontFamily"
              value={currentTextData?.fontFamily}
              onChange={(e) => {handleSelectChange("fontFamily", e.target.value);}}
            >
          {getFieldDropdownOptions("fontFamily").map((option) => (
            <MenuItem key={option.value} value={option.value} name={option.value}>
              {option.label}
            </MenuItem>
          ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="font-weight-select-label">Font Weight</InputLabel>
            <Select
              labelId="font-weight-select-label"
              id="font-weight-select"
              label="Font Weight"
              value={currentTextData?.fontWeight}
              onChange={(e) => {handleSelectChange("fontWeight", e.target.value);}}
            >
          {getFieldDropdownOptions("fontWeight").map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
            </Select>
          </FormControl>
          {getTextField("lineSpacing", "Line Spacing (as a number with no unit)", currentTextData?.lineSpacing)}
      </div>
      );
    case "text":
      return (
        <div>
          {getTextField("value", "Text", currentTextData?.value)}
        </div>
      );
    case "position":
      return (
        <div>
          <FormLabel id="demo-row-radio-buttons-group-label">Align</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="align"
              value={currentTextData?.align}
              onChange={handleFieldChange}
            >
              <FormControlLabel value="left" control={<Radio />} label="Left"/>
              <FormControlLabel value="center" control={<Radio />} label="Center" />
              <FormControlLabel value="right" control={<Radio />} label="Right" />
            </RadioGroup>
          {getTextField("height", "Height (as a number with no unit)", currentTextData?.height)}
          {getTextField("width", "Width (as a number with no unit)", currentTextData?.width)}
          {getTextField("position", "Position (comma-separated, for example: 1,1)", currentTextData?.position)}
        </div>
      );
    case "remove":
      return (
        <div>
          <DialogContentText>
            Do you really want to delete this text? <br></br> 
            This action also deletes all styling commands for this text on the following pages
            up until the text is shown again.
          </DialogContentText>
        </div>
      );
    }
  }

  return (
    <Popover
      id={textToolbar}
      open={textToolbarOpen}
      anchorEl={textAnchorEl}
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
        text="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          p: "5px 15px",
        }}
        noValidate
        autoComplete="off"
      >
        
        {/* Dynamically generate inputs based on type definition */}
        {currentTextData &&
          Object.entries({remove: "Remove", text: "Edit Text", color: "Edit Color", font: "Edit Font", position: "Edit Position"}).map(([fieldKey, label]) => (
          <Tooltip title={label} key={fieldKey}>
              <span style={{marginLeft: "10px", marginRight: "10px"}}>
                {fieldKey === "color" ? (
                  <IconButton
                    disabled={error !== null}                 
                    aria-describedby={id}
                    onClick={handleOpenPopup}
                    sx={{ fill: (error !== null) ? 'gray' : 'white' }}
                  >
                      {getIcon(fieldKey, currentTextData[fieldKey])}
                  </IconButton>
                  ) : (
                  <IconButton disabled={error !== null} size="small" onClick={(e) => {handleToolbarClick(e, fieldKey);}}>
                    {getIcon(fieldKey, currentTextData[fieldKey])}
                  </IconButton>)
                }
              </span>
          </Tooltip>
        ))
        }
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
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
          <div style={{ width: 256, padding: "5px" }}>
            <Circle colors={getColors()} color={currentTextData?.color} onChange={(selectedColor) => {handleColorChange(selectedColor)}} />
          </div>
      </Popover>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth> 
        <DialogContent sx={{ paddingBottom: 0 }}>
          {currentTextData &&
          <form onSubmit={handleEditText}>
              {getDialogFields()}
            <DialogActions>
              <Button onClick={textPopoverLeave}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
          }        
        </DialogContent>
      </Dialog>
    </Popover>
  );
};