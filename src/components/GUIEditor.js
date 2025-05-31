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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  findLastDrawCoveringIndex,
  evaluateExpression,
  findComponentIdxByName,
} from "./GuiHelper";
import { useParseCompile } from "../context/ParseCompileContext";

// Types for all the components
const types = {
  array: {
    value: ["Value", "number"],
    color: ["Color", "color"],
    arrow: ["Arrow Label", "string"],
  },
  graph: {
    value: ["Value", "number"],
    color: ["Color", "color"],
    arrow: ["Arrow Label", "string"],
    hidden: ["Hidden", "boolean"],
  },
  tree: {
    value: ["Value", "number"],
    color: ["Color", "color"],
    arrow: ["Arrow Label", "string"],
  },
  linkedlist: {
    value: ["Value", "number"],
    color: ["Color", "color"],
    arrow: ["Arrow Label", "string"],
  },
};

const DynamicInput = ({ fieldKey, fieldConfig, value, onChange, onUpdate }) => {
  const [label, inputType] = fieldConfig;
  
  const convertValueToType = (value, type) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }
    
    switch (type) {
      case "number":
        const numValue = Number(value);
        return isNaN(numValue) ? null : numValue;
      case "boolean":
        if (typeof value === "boolean") return value;
        if (typeof value === "string") {
          const lowerValue = value.toLowerCase().trim();
          return lowerValue === "true" || lowerValue === "1";
        }
        return Boolean(value);
      case "color":
      case "string":
      default:
        return String(value);
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

  return (
    <TextField
      label={label}
      id={`${fieldKey}-input`}
      value={value !== null && value !== undefined && value !== "null" ? value : (inputType === "color" ? "#ffffff" : "")}
      size="small"
      type={inputType === "number" ? "number" : inputType === "color" ? "color" : "text"}
      disabled={fieldKey === "id"}
      helperText={fieldKey === "id" ? "The unit id is unchangeable" : ""}
      onChange={inputType === "color" ? handleColorChange : (e) => onChange(fieldKey, e.target.value)}
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
    id: "the unit id can't be changed",
    value: "input unit value",
    color: "input unit color",
    arrow: "input arrow label ",
    hidden: "input false or true",
    isIndex: false,
  };
  const [currentUnitData, setUnitData] = useState(defaultUnitValue);
  const { pages, addPage, removePage, updateValue } = useParseCompile();

  useEffect(() => {
    if (inspectorIndex) {
      const page_idx = currentPage - 1; // Convert to zero-based index
      const component_idx = parseInt(inspectorIndex.componentID.slice(10));
      const unit_idx_all = parseInt(inspectorIndex.unitID.slice(5), 10);
      const component = pages[page_idx][component_idx];

      const unit_idx = findVisibleUnitIndex(component, unit_idx_all);

      // Dynamically build unit data based on component type
      const unitData = {
        idx: unit_idx,
        component: component_idx,
        name: component.name,
        page: page_idx,
        type: component.type,
      };

      // Add fields based on type definition
      if (types[component.type]) {
        Object.keys(types[component.type]).forEach(fieldKey => {
          unitData[fieldKey] = component.body?.[fieldKey]?.[unit_idx] ?? "null";
        });
      }

      setUnitData(unitData);
    }
  }, [inspectorIndex, currentPage]);

  const findVisibleUnitIndex = (component, unitIdx) => {
    // Find i'th visible unit index in the component
    if (!component.body || !component.body.value) return 0;
    
    const hidden = component.body.hidden || [];

    // Loop through hidden array
    let visibleCount = 0;
    for (let i = 0; i < component.body.value.length; i++) {
      if (!hidden[i]) {
        if (visibleCount === unitIdx) {
          return i; // Return the index of the visible unit
        }
        visibleCount++;
      }
    }
    return 0;
  };

  
  const handleFieldChange = (fieldKey, value) => {
    setUnitData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const handleFieldUpdate = (fieldKey, value) => {
    if (inspectorIndex && fieldKey !== "id") {
      updateValue(
        currentUnitData.page,
        currentUnitData.name,
        currentUnitData.idx,
        fieldKey,
        value
      );
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
              <Chip label={`Unit ${currentUnitData.idx}`} size="small" sx={{ ml: 1 }} />
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
                  value={currentUnitData.idx}
                  onChange={handleFieldChange}
                  onUpdate={handleFieldUpdate}
                />
              )}
              
              {/* Dynamically generate inputs based on type definition */}
              {currentUnitData.type && types[currentUnitData.type] && 
                Object.entries(types[currentUnitData.type]).map(([fieldKey, fieldConfig]) => (
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
