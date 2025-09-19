import React, { useEffect, useState } from "react";
import { Box, IconButton, Popover, SvgIcon, TextField, Tooltip} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import TextRotateVerticalIcon from '@mui/icons-material/TextRotateVertical';
import Circle from "@uiw/react-color-circle";
import { useParseCompile } from "../context/ParseCompileContext";
import { parseInspectorIndex, createUnitData, getComponentFields, getColors } from "../compiler/dslUtils.mjs";
import { addEdgeIcon, removeEdgeIcon, addColumnIcon, addRowIcon, removeColumnIcon, removeRowIcon } from "./CustomIcons";


const DynamicInput = ({ fieldKey, label, value, onChange, onUpdate, onRemove, onEditEdge, error }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'edit-unit-popover' : undefined;
  
  const handleOpenPopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const getIcon = (name) => {
    switch (name){
      case "add":
        return <AddIcon></AddIcon>;
      case "remove":
        return <ClearIcon></ClearIcon>;
      case "value":
        return <EditIcon></EditIcon>;
      case "color":
        return <FormatColorFillIcon sx={{ color: (value !== null) ? value : "#ffffff" }}></FormatColorFillIcon>;
      case "arrow": 
        return <TextRotateVerticalIcon></TextRotateVerticalIcon>;
      case "addEdge":
        return <SvgIcon component={addEdgeIcon}></SvgIcon> 
      case "removeEdge":
        return <SvgIcon component={removeEdgeIcon}></SvgIcon> 
      case "addChild":
        return <AddIcon></AddIcon>;
      case "removeSubtree":
        return  <SvgIcon component={removeEdgeIcon}></SvgIcon> 
      case "addRow":
        return  <SvgIcon component={addRowIcon}></SvgIcon> 
      case "removeRow":
        return  <SvgIcon component={removeRowIcon}></SvgIcon> 
      case "addColumn":
        return  <SvgIcon component={addColumnIcon}></SvgIcon> 
      case "removeColumn":
        return  <SvgIcon component={removeColumnIcon}></SvgIcon> 
      default: 
        return <RectangleOutlinedIcon></RectangleOutlinedIcon>
    }
  };

  const handleKeyDown = (ev) => {
    if (ev.key === 'Enter') {
      onUpdate(fieldKey, value);
      ev.preventDefault();
    }
  };

  // For adding or removing edges, we wait for another node to be selected
  if (["addEdge", "removeEdge"].includes(fieldKey)){
    return (
      <Tooltip title={label}>
        <span style={{marginLeft: "10px", marginRight: "10px"}}>
          <IconButton
            disabled={error !== null}
            size="small"
            onClick={(e) => {onEditEdge(e, fieldKey);}}
            sx={{ fill: (error !== null) ? 'gray' : 'white' }}
          >
            {getIcon(fieldKey)}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  // For any type of remove, there is no need for any input field
  if (["remove", "removeSubtree", "removeRow", "removeColumn"].includes(fieldKey)){
    return (
       <Tooltip title={label}>
        <span style={{marginLeft: "10px", marginRight: "10px"}}>
          <IconButton 
            disabled={error !== null} 
            size="small" 
            onClick={(e) => {onRemove(e, fieldKey);}} 
            sx={{ fill: (error !== null) ? 'gray' : 'white' }}
          >
            {getIcon(fieldKey)}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  // Regular text/number inputs
  if (["add", "value", "color", "arrow", "addRow", "addColumn", "addChild"].includes(fieldKey)){
    return (
      <React.Fragment>
        <Tooltip title={label} sx={{ mr: 5 }}>
          <span style={{marginLeft: "10px", marginRight: "10px"}}>
            <IconButton
              disabled={error !== null}                 
              aria-describedby={id}
              onClick={handleOpenPopup}
              sx={{ fill: (error !== null) ? 'gray' : 'white' }}
            >
                {getIcon(fieldKey)}
            </IconButton>
          </span>
        </Tooltip>
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

            {fieldKey === "color" ? (
              <div style={{ width: 256, padding: "5px" }}>
                <Circle colors={getColors()} color={value} onChange={(selectedColor) => {onUpdate(fieldKey, selectedColor.hex);}} />
              </div>
            ) : ( 
              <TextField
                label={fieldKey === "addRow" || fieldKey === "addColumn" ? "Enter values comma-separated" : "Enter a value"}
                value={value !== null && value !== undefined && value !== "null" ? value :  ""}
                size="small"
                onChange={(e) => {onChange(fieldKey, e.target.value);}}
                onKeyDown={handleKeyDown}
                style={{margin: "15px 10px 10px 10px"}}
              />
            )}
        </Popover>
      </React.Fragment>
    );
  }
};

export const UnitEditor = ({inspectorIndex, currentPage, unitAnchorEl, setUnitAnchorEl, setEdgeTarget}) => {

  const [currentUnitData, setUnitData] = useState(null);
  const unitToolbarOpen = Boolean(unitAnchorEl);
  const unitToolbar = unitToolbarOpen ? "unit-toolbar-popover" : undefined;
  const { pages, updateValue, addUnit, removeUnit, error } = useParseCompile();

  const unitPopoverEnter = () => {
    unitAnchorEl.setAttribute("stroke", "#90cafd");
  };

  const unitPopoverLeave = () => {
    setUnitAnchorEl(null);
  };

  useEffect(() => {
    if (inspectorIndex) {
      const parsedInfo = parseInspectorIndex(inspectorIndex, pages, currentPage);
      const unitData = createUnitData(parsedInfo);
      
      if (unitData) {
        setUnitData(unitData);
        if (unitAnchorEl){
          unitPopoverEnter();
        }
      }
    }
  }, [inspectorIndex, currentPage, pages]);

  useEffect(() => {
    if (!unitAnchorEl){
      unitPopoverLeave();
    }

  },[unitAnchorEl])

  const handleAddUnit = (value, addCommand) => {
    addUnit(
          currentUnitData.page,
          currentUnitData.name,
          currentUnitData.type,
          value,
          currentUnitData.coordinates,
          currentUnitData.nodes,
          null,
          addCommand
    );
  };

  const handleRemoveUnit = (event, removeCommand) => {
    unitPopoverLeave();
    removeUnit(
          currentUnitData.page,
          currentUnitData.name,
          currentUnitData.type,
          currentUnitData.coordinates,
          currentUnitData.nodes,
          removeCommand
    );
  };

  const handleEditEdge = (event, editCommand) => {
    unitPopoverLeave();
    setEdgeTarget({page: currentUnitData.page, name: currentUnitData.name, firstNode: currentUnitData.nodes,
      nodes: currentUnitData.allNodes, command: editCommand});
  }

  const handleFieldChange = (fieldKey, value) => {
    setUnitData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const handleFieldUpdate = (fieldKey, value) => {
    unitPopoverLeave();
    if (["add", "addRow", "addColumn", "addChild"].includes(fieldKey)){
      handleAddUnit(value, fieldKey);
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
  <Popover
    id={unitToolbar}
    open={unitToolbarOpen}
    anchorEl={unitAnchorEl}
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
      {currentUnitData && currentUnitData.type && 
        Object.entries(getComponentFields(currentUnitData.type)).map(([fieldKey, label]) => (
          <DynamicInput
            key={fieldKey}
            fieldKey={fieldKey}
            label={label}
            value={currentUnitData[fieldKey]}
            onChange={handleFieldChange}
            onUpdate={handleFieldUpdate}
            onRemove={handleRemoveUnit}
            onEditEdge={handleEditEdge}
            error={error}
          />
        ))
      }
    </Box>
    </Popover>
  );
};

