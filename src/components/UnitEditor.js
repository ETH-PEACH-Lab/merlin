import React, { useEffect, useState } from "react";
import { Box, IconButton, Popover, TextField, Tooltip, SvgIcon } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import TextRotateVerticalIcon from '@mui/icons-material/TextRotateVertical';
import { useParseCompile } from "../context/ParseCompileContext";
import { parseInspectorIndex, createUnitData, getComponentFields } from "../compiler/dslUtils.mjs";
import { removeSubtreeIcon, addColumnIcon, addRowIcon, removeColumnIcon, removeRowIcon } from "./CustomIcons";


const DynamicInput = ({ fieldKey, label, value, onChange, onUpdate, onRemove, leaveFunction }) => {
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
      case "Add":
        return <AddIcon></AddIcon>;
      case "Remove":
        return <ClearIcon></ClearIcon>;
      case "Value":
        return <EditIcon></EditIcon>;
      case "Color":
        return <FormatColorFillIcon></FormatColorFillIcon>;
      case "Add Arrow": 
        return <TextRotateVerticalIcon></TextRotateVerticalIcon>;
      case "Remove Subtree":
        return  <SvgIcon component={removeSubtreeIcon}></SvgIcon> 
      case "Add Row":
        return  <SvgIcon component={addRowIcon}></SvgIcon> 
      case "Remove Row":
        return  <SvgIcon component={removeRowIcon}></SvgIcon> 
      case "Add Column":
        return  <SvgIcon component={addColumnIcon}></SvgIcon> 
      case "Remove Column":
        return  <SvgIcon component={removeColumnIcon}></SvgIcon> 
      default: 
        return <RectangleOutlinedIcon></RectangleOutlinedIcon>
    }
  };
  
  // TODO Check if this is needed
  const handleBlur = () => {
    onUpdate(fieldKey, value);
  };

  const handleKeyDown = (ev) => {
    if (ev.key === 'Enter') {
      onUpdate(fieldKey, value);
      ev.preventDefault();
    }
  };

  // For any type of remove, there is no need for any input field
  if (["Remove", "Remove Subtree", "Remove Row", "Remove Column"].includes(label)){
    return (
       <Tooltip title={label}>
        <span style={{marginLeft: "10px", marginRight: "10px"}}>
          <IconButton size="small" onClick={(e) => {onRemove(e, label);}}>
            {getIcon(label)}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  // For the color field, use a color picker
  if (label === "Color"){
    return (
       <Tooltip title={label}>
        <span style={{marginLeft: "10px", marginRight: "10px"}}>
          <IconButton size="small">
            <input type="color" onChange={(e) => {onUpdate(fieldKey, e.target.value);}}
                   style={{opacity: 0, position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}/>
            {getIcon(label)}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  // Regular text/number inputs
  if (["Add", "Value", "Add Arrow"].includes(label)){
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
              onChange={(e) => {onChange(fieldKey, e.target.value);}}
              // onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              style={{margin: "15px 10px 10px 10px"}}
            />
        </Popover>
      </React.Fragment>
    );
  }
};

export const UnitEditor = ({
  inspectorIndex,
  currentPage,
  leaveFunction,
}) => {
  const defaultUnitValue = {
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
          currentUnitData.nodes,
          value
    );
  };

  const handleRemoveUnit = (event, removeType) => {
    leaveFunction();
    removeUnit(
          currentUnitData.page,
          currentUnitData.name,
          currentUnitData.type,
          currentUnitData.coordinates,
          currentUnitData.nodes,
          removeType
    );
  };

  const handleFieldChange = (fieldKey, value) => {
    setUnitData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const handleFieldUpdate = (fieldKey, value) => {
    leaveFunction();
    if (fieldKey === "add"){
      handleAddUnit(value);
    } 
    else {
      updateValue(
        currentUnitData.page,
        currentUnitData.name,
        currentUnitData.coordinates,
        fieldKey,
        value
      );
    }
  };

  return (
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
        Object.entries(getComponentFields(currentUnitData.type)).map(([fieldKey, label]) => (
          <DynamicInput
            key={fieldKey}
            fieldKey={fieldKey}
            label={label}
            value={currentUnitData[fieldKey]}
            onChange={handleFieldChange}
            onUpdate={handleFieldUpdate}
            onRemove={handleRemoveUnit}
            leaveFunction={leaveFunction}
          />
        ))
      }
    </Box>
  );
};

