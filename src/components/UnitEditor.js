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
} from "@mui/material";
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import { useParseCompile } from "../context/ParseCompileContext";
import { 
  parseInspectorIndex, 
  createUnitData, 
  getComponentFields, 
  convertValueToType,
  getFieldDropdownOptions
} from "../compiler/dslUtils.mjs";

const DynamicInput = ({ fieldKey, fieldConfig, value, onChange, onUpdate }) => {
  const [label, inputType] = fieldConfig;
  
  const handleBlur = () => {
    if (!value) return;
    const convertedValue = convertValueToType(value, inputType);
    onUpdate(fieldKey, convertedValue);
  };

  const handleKeyDown = (ev) => {
    if (ev.key === 'Enter') {
      ev.target.blur();
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
    }
  };

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    onChange(fieldKey, newValue);
    onUpdate(fieldKey, newValue);
  };

  // Define dropdown options for specific text properties
  const dropdownOptions = getFieldDropdownOptions(fieldKey);
  const useDropdown = dropdownOptions.length > 0;

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

  // Regular text/number inputs
  return (
 inputType == "color" ? (
      <div>
        <IconButton size="small">
          <input style={{opacity: 0, position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}} type="color" onChange={handleColorChange}/>
          <FormatColorFillIcon></FormatColorFillIcon>
        </IconButton>
      </div>
    ) : (
    <TextField
      label={label}
      id={`${fieldKey}-input`}
      value={value !== null && value !== undefined && value !== "null" ? value :  ""}
      size="small"
      type="text"
      helperText={
        fieldKey === "id" 
          ? "The unit id is unchangeable" 
          : inputType === "number_or_string" 
            ? "Accepts numbers or text" 
            : (fieldKey === "fontSize" || fieldKey === "lineSpacing" || fieldKey === "width" || fieldKey === "height")
              ? "Enter a positive number"
              : ""
      }
      onChange={ (e) => {
        let newValue = e.target.value;
        
        // Validate number inputs for text properties
        if ((fieldKey === "fontSize" || fieldKey === "lineSpacing" || fieldKey === "width" || fieldKey === "height") && newValue !== "") {
          // Allow only positive numbers and decimal points
          if (!/^\d*\.?\d*$/.test(newValue)) {
            return; // Don't update if invalid
          }
        }
        
        onChange(fieldKey, newValue);
      }}
      onBlur={inputType === "color" ? undefined : handleBlur}
      onKeyDown={inputType === "color" ? undefined : handleKeyDown}
    />
    )
  );
};

export const UnitEditor = ({
  inspectorIndex,
  currentPage,
}) => {
  const defaultUnitValue = {
    displayId: "the unit id can't be changed",
    coordinates: null,
    type: null,
  };
  const [currentUnitData, setUnitData] = useState(defaultUnitValue);
  const { pages, updateValue } = useParseCompile();

  useEffect(() => {
    if (inspectorIndex) {
      const parsedInfo = parseInspectorIndex(inspectorIndex, pages, currentPage);
      const unitData = createUnitData(parsedInfo);
      
      if (unitData) {
        setUnitData(unitData);
      }
    }
  }, [inspectorIndex, currentPage, pages]);

  const handleFieldChange = (fieldKey, value) => {
    setUnitData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const handleFieldUpdate = (fieldKey, value) => {
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
          <div>
            <div>
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
                  />
                ))
              }
            </div>
          </div>
        </Box>
    </div>
  );
};

