import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Tooltip,
  Typography,
  Chip,
  AppBar,
  Grid,
  IconButton,
  List,
  ListItem,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
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
    <TextField
      label={label}
      id={`${fieldKey}-input`}
      value={value !== null && value !== undefined && value !== "null" ? value : (inputType === "color" ? "#ffffff" : "")}
      size="small"
      type={inputType === "number" || inputType === "number_or_string" ? "text" : inputType === "color" ? "color" : "text"}
      disabled={fieldKey === "id"}
      helperText={
        fieldKey === "id" 
          ? "The unit id is unchangeable" 
          : inputType === "number_or_string" 
            ? "Accepts numbers or text" 
            : (fieldKey === "fontSize" || fieldKey === "lineSpacing" || fieldKey === "width" || fieldKey === "height")
              ? "Enter a positive number"
              : ""
      }
      onChange={inputType === "color" ? handleColorChange : (e) => {
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
  );
};

const GUIEditor = ({
  inspectorIndex,
  currentPage,
  setCurrentPage,
  dslEditorEditable,
  setDslEditorEditable,
}) => {
  const defaultUnitValue = {
    displayId: "the unit id can't be changed",
    coordinates: null,
    type: null,
  };
  const [currentUnitData, setUnitData] = useState(defaultUnitValue);
  const { pages, addPage, removePage, updateValue } = useParseCompile();

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

  const handleAddPage = () => {
    const lengthBefore = pages.length;
    addPage();
    setCurrentPage(lengthBefore + 1);
  };

  const handleRemovePage = () => {
    const lengthBefore = pages.length;
    removePage();
    if (lengthBefore > 1) {
      setCurrentPage(lengthBefore - 1);
    } else {
      setCurrentPage(1);
    }
  };

  return (
    <div>
      <Box
        sx={{
          paddingRight: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #444",
          borderTop: "1px solid #444",
        }}
      >
        <Box display="flex" flexGrow={1}>
          <Typography variant="overline" sx={{ pl: 2 }}>
            Unit Inspector
          </Typography>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Tooltip title="Add a Page">
            <span>
              <IconButton
                disabled={!(currentPage === pages.length)}
                onClick={handleAddPage}
                sx={{ mr: 1 }}
                size="small"
              >
                <AddIcon sx={{ fontSize: 20 }}></AddIcon>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Remove last Page">
            <span>
              <IconButton
                disabled={!(currentPage === pages.length) || pages.length <= 1}
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
      {inspectorIndex ? (
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
            p: "5px 15px",
          }}
          noValidate
          autoComplete="off"
        >
          {/* Combined Current Selection and Update Button in one row */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between" // Ensures Update button is on the right
            sx={{
              "& > *": { mr: 1 },
              marginBottom: 2, // Optional spacing
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="overline">Current Selection:</Typography>
              <Chip label={`Page ${currentUnitData.page+1}`} size="small" sx={{ ml: 1 }} />
              <Chip
                label={`Component ${currentUnitData.component+1} - ${currentUnitData.name}`}
                size="small"
                sx={{ ml: 1 }}
              />
              <Chip label={`Unit ${currentUnitData.displayId}`} size="small" sx={{ ml: 1 }} />
              <Chip
                label={`Type ${currentUnitData.type}`}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          </Box>
          <div>
            <div>
              {/* Show ID field for non-array types */}
              {currentUnitData.type !== "array" && (
                <DynamicInput
                  fieldKey="id"
                  fieldConfig={["Id", "text"]}
                  value={currentUnitData.displayId}
                  onChange={handleFieldChange}
                  onUpdate={handleFieldUpdate}
                />
              )}
              
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
      ) : (
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          <Typography variant="body2">
            Select a unit to inspect its properties.
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default GUIEditor;
