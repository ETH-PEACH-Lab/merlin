import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import TextRotateVerticalIcon from '@mui/icons-material/TextRotateVertical';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { useParseCompile } from "../context/ParseCompileContext";
import { EditUnitItem } from "./EditUnitItem";
import { 
  parseInspectorIndex, 
  createUnitData, 
  getComponentFields, 
  getAdditionalGUIFields,
  convertValueToType,
  getFieldDropdownOptions
} from "../compiler/dslUtils.mjs";


const DynamicInput = ({ fieldKey, fieldConfig, value, onChange, onUpdate, onRemove, leaveFunction }) => {
  const [label, inputType] = fieldConfig;

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
    // For color inputs, immediately update since color picker doesn't work well with blur
    if (inputType === "color") {
      const convertedValue = convertValueToType(newValue, inputType);
      onUpdate(fieldKey, convertedValue);
      leaveFunction();
    }
  };

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    onChange(fieldKey, newValue);
    onUpdate(fieldKey, newValue);
  };

  const handleFieldChange = (e) => {
    let newValue = e.target.value;
    
    // Validate number inputs for text properties
    if ((fieldKey === "fontSize" || fieldKey === "lineSpacing" || fieldKey === "width" || fieldKey === "height") && newValue !== "") {
      // Allow only positive numbers and decimal points
      if (!/^\d*\.?\d*$/.test(newValue)) {
        return; // Don't update if invalid
      }
    }

    onChange(fieldKey, newValue);
  };

  // Define dropdown options for specific text properties
  const dropdownOptions = getFieldDropdownOptions(fieldKey);
  const useDropdown = dropdownOptions.length > 0;

  if (!["Color", "Value", "Arrow Label", "Remove", "Add"].includes(label)){
    return;
  }

  // For boolean inputs, use a Switch component instead of TextField
  if (inputType === "boolean") {
    const boolValue = value === "true" || value === true;
    return (
      <FormControlLabel
        control={
          <Switch
            checked={boolValue}
            onChange={(e) => {
              const newValue = e.target.checked;
              onChange(fieldKey, newValue);
              onUpdate(fieldKey, newValue);
            }}
            disabled={fieldKey === "id"}
          />
        }
        label={label}
        sx={{ m: 1, width: "25ch" }}
      />
    );
  }

  // For dropdown fields, use Select component
  if (useDropdown) {
    return (
      <FormControl sx={{ m: 1, width: "25ch" }} size="small">
        <InputLabel id={`${fieldKey}-select-label`}>{label}</InputLabel>
        <Select
          labelId={`${fieldKey}-select-label`}
          id={`${fieldKey}-select`}
          value={value !== null && value !== undefined && value !== "null" ? value : ""}
          label={label}
          onChange={handleSelectChange}
          disabled={fieldKey === "id"}
        >
          {dropdownOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (inputType === "add"){
    return (
      <EditUnitItem
        name={label}
        icon={getIcon(label)}
        leaveFunction={leaveFunction}
        formFields={<TextField
        label={label}
        id={`${fieldKey}-input`}
        size="small"
        onChange={handleFieldChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{margin: "15px 10px 10px 10px"}}
      />}>
      </EditUnitItem>
    );
  }

  if (inputType == "remove"){
    return (
       <Tooltip title={label}>
        <span style={{marginLeft: "10px", marginRight: "10px"}}>
          <IconButton size="small" onClick={onRemove}>
            <ClearIcon></ClearIcon>
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
    <EditUnitItem
      name={label}
      icon={getIcon(label)}
      leaveFunction={leaveFunction}
      formFields={<TextField
      label={label}
      id={`${fieldKey}-input`}
      value={value !== null && value !== undefined && value !== "null" ? value :  ""}
      size="small"
      onChange={handleFieldChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={{margin: "15px 10px 10px 10px"}}
    />}
    >
    </EditUnitItem>
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
            Object.entries(getAdditionalGUIFields(currentUnitData.type)).map(([fieldKey, fieldConfig]) => (
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
          {currentUnitData.type && 
            Object.entries(getComponentFields(currentUnitData.type)).map(([fieldKey, fieldConfig]) => (
              <DynamicInput
                key={fieldKey}
                fieldKey={fieldKey}
                fieldConfig={fieldConfig}
                value={currentUnitData[fieldKey]}
                onChange={handleFieldChange}
                onUpdate={handleFieldUpdate}
                leaveFunction={leaveFunction}
              />
            ))
          }
        </Box>
    </div>
  );
};

