import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Popover,
  TextField,
  Tooltip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import TextRotateVerticalIcon from '@mui/icons-material/TextRotateVertical';
import { useParseCompile } from "../context/ParseCompileContext";
import { 
  parseInspectorIndex, 
  createUnitData, 
  getComponentFields, 
  convertValueToType,
} from "../compiler/dslUtils.mjs";


const DynamicInput = ({ fieldKey, fieldConfig, value, onChange, onUpdate, onRemove, leaveFunction }) => {
  const [label, inputType] = fieldConfig;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'edit-unit-text-input-popover' : undefined;
  
  const handleOpenPopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopup = () => {
    leaveFunction();
    setAnchorEl(null);
  };

  const getIcon = (name) => {
    switch (name){
      case "Value":
        return <EditIcon></EditIcon>
      case "Color":
        return <FormatColorFillIcon></FormatColorFillIcon>
      case "Arrow Label": 
        return <TextRotateVerticalIcon></TextRotateVerticalIcon>
      case "Remove":
        return <ClearIcon></ClearIcon>;
      case "Add":
        return <AddIcon></AddIcon>;
      default: 
        return <RectangleOutlinedIcon></RectangleOutlinedIcon>
    }
  };
  
  const handleBlur = () => {
    if (!value) return;
    const convertedValue = convertValueToType(value, inputType);
    onUpdate(fieldKey, convertedValue);
  };

  const handleKeyDown = (ev) => {
    if (ev.key === 'Enter') {
      ev.target.blur();
      leaveFunction();
      ev.preventDefault();
    }
  };

  const handleColorChange = (e) => {
    const newValue = e.target.value;
    onChange(fieldKey, newValue);
    const convertedValue = convertValueToType(newValue, inputType);
    onUpdate(fieldKey, convertedValue);
    leaveFunction();
  };

  const handleFieldChange = (e) => {
    let newValue = e.target.value;
    onChange(fieldKey, newValue);
  };

  if (!["Color", "Value", "Arrow Label", "Remove", "Add"].includes(label)){
    return;
  }

  if (inputType == "remove"){
    return (
       <Tooltip title={label}>
        <span style={{marginLeft: "10px", marginRight: "10px"}}>
          <IconButton size="small" onClick={onRemove}>
            {getIcon(label)}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  // For the color field, use a color picker
  if (inputType == "color"){
    return (
       <Tooltip title={label}>
        <span style={{marginLeft: "10px", marginRight: "10px"}}>
          <IconButton size="small">
            <input style={{opacity: 0, position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}} type="color" onChange={handleColorChange}/>
            {getIcon(label)}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  // Regular text/number inputs
  return (
    <React.Fragment>
      <Tooltip title={label} sx={{ mr: 5 }}>
        <span style={{marginLeft: "10px", marginRight: "10px"}}>
          <IconButton                 
            aria-describedby={id}
            onClick={handleOpenPopup}>
              {getIcon(label)}
          </IconButton>
        </span>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        onMouseLeave={handleClosePopup}
        slotProps={{ paper: { sx: { pointerEvents: "auto" } } }}
        sx={{ pointerEvents: "none" }}>
          <TextField
            label={label}
            value={value !== null && value !== undefined && value !== "null" ? value :  ""}
            size="small"
            onChange={handleFieldChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{margin: "15px 10px 10px 10px"}}
          />
      </Popover>
  </React.Fragment>
  );
};

export const UnitEditor = ({
  inspectorIndex,
  currentPage,
  leaveFunction,
}) => {
  const defaultUnitValue = {
    displayId: "the unit id can't be changed",
    coordinates: null,
    type: null,
  };
  const [currentUnitData, setUnitData] = useState(defaultUnitValue);
  const { pages, updateValue, addUnit, removeUnit } = useParseCompile();

  useEffect(() => {
    if (inspectorIndex) {
      const parsedInfo = parseInspectorIndex(inspectorIndex, pages, currentPage);
      const unitData = createUnitData(parsedInfo);
      
      if (unitData) {
        setUnitData(unitData);
      }
    }
  }, [inspectorIndex, currentPage, pages]);

  const handleAddUnit = (value) => {
    addUnit(
          currentUnitData.page,
          currentUnitData.name,
          currentUnitData.type,
          currentUnitData.coordinates,
          value
    );
  };

  const handleRemoveUnit = () => {
    leaveFunction();
    removeUnit(
          currentUnitData.page,
          currentUnitData.name,
          currentUnitData.coordinates
    );
  };

  const handleFieldChange = (fieldKey, value) => {
    setUnitData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const handleFieldUpdate = (fieldKey, value) => {
    if (fieldKey === "add"){
      handleAddUnit(value);
      return;
    }
    if (inspectorIndex && fieldKey !== "id") {
      // Handle position field (no coordinates needed)
      if (fieldKey === "position") {
        updateValue(
          currentUnitData.page,
          currentUnitData.name,
          null, // No coordinates for position field
          fieldKey,
          value
        );
      }
      // Handle text global properties (no coordinates needed)
      else if (currentUnitData.type === "text" && ["lineSpacing", "width", "height"].includes(fieldKey)) {
        updateValue(
          currentUnitData.page,
          currentUnitData.name,
          null, // No coordinates for global text properties
          fieldKey,
          value
        );
      }
      // Handle text per-line properties (need coordinates, but use null coordinates if not available)
      else if (currentUnitData.type === "text" && ["value", "fontSize", "color", "fontWeight", "fontFamily", "align"].includes(fieldKey)) {
        updateValue(
          currentUnitData.page,
          currentUnitData.name,
          currentUnitData.coordinates, // Use coordinates if available, null if not
          fieldKey,
          value
        );
      }
      // Handle array/matrix fields (coordinates required)
      else if (currentUnitData.coordinates) {
        updateValue(
          currentUnitData.page,
          currentUnitData.name,
          currentUnitData.coordinates,
          fieldKey,
          value
        );
      }
    }
  };


  return (
    <div>
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
          {currentUnitData.type && 
            Object.entries(getComponentFields(currentUnitData.type)).map(([fieldKey, fieldConfig]) => (
              <DynamicInput
                key={fieldKey}
                fieldKey={fieldKey}
                fieldConfig={fieldConfig}
                value={currentUnitData[fieldKey]}
                onChange={handleFieldChange}
                onUpdate={handleFieldUpdate}
                onRemove={handleRemoveUnit}
                leaveFunction={leaveFunction}
              />
            ))
          }
        </Box>
    </div>
  );
};

