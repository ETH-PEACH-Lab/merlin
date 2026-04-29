import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Popover,
  SvgIcon,
  TextField,
  Select,
  Tooltip,
  InputLabel,
  MenuItem,
  FormControl,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import BorderStyleIcon from "@mui/icons-material/BorderStyle";
import LabelIcon from "@mui/icons-material/Label";
import TextRotateVerticalIcon from "@mui/icons-material/TextRotateVertical";
import Circle from "@uiw/react-color-circle";
import { useParseCompile } from "../context/ParseCompileContext";
import LineStyleIcon from "@mui/icons-material/LineStyle";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import {
  parseInspectorIndex,
  createUnitData,
  getComponentFields,
  getColors,
} from "../utils/dslUtils.mjs";
import {
  addEdgeIcon,
  removeEdgeIcon,
  addColumnIcon,
  addRowIcon,
  removeColumnIcon,
  removeRowIcon,
} from "./CustomIcons";

const DynamicInput = ({
  fieldKey,
  label,
  value,
  onChange,
  onUpdate,
  onRemove,
  onEditEdge,
  error,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "edit-unit-popover" : undefined;
  const [annotation, setAnnotation] = React.useState({
    side: null,
    value: null,
  });

  const [shapeStacked, setShapeStacked] = React.useState({
    depth: null,
    height: null,
    width: null,
  });

  const [shapeFlatten, setShapeFlatten] = React.useState({
    rows: null,
    columns: null,
  });

  const handleOpenPopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const getIcon = (name) => {
    switch (name) {
      case "add":
        return <AddIcon></AddIcon>;
      case "remove":
        return <ClearIcon></ClearIcon>;
      case "value":
        return <EditIcon></EditIcon>;
      case "color":
        return (
          <FormatColorFillIcon
            sx={{ color: value !== null ? value : "#ffffff" }}
          ></FormatColorFillIcon>
        );
      case "stroke":
        return (
          <BorderStyleIcon sx={{ color: value !== null ? value : "#ffffff" }} />
        );
      case "shapeEdge":
        return <LineStyleIcon />;
      case "shapeStacked":
        return <ViewInArIcon />;
      case "shapeFlatten":
        return <ViewInArIcon />;
      case "layout":
        return <ViewStreamIcon />;
      case "anchorGroup":
        return <GpsFixedIcon />;
      case "annotation":
        return <LabelIcon sx={{ color: value !== null ? value : "#ffffff" }} />;
      case "arrow":
        return <TextRotateVerticalIcon></TextRotateVerticalIcon>;
      case "addEdge":
        return <SvgIcon component={addEdgeIcon}></SvgIcon>;
      case "removeEdge":
        return <SvgIcon component={removeEdgeIcon}></SvgIcon>;
      case "addChild":
        return <AddIcon></AddIcon>;
      case "removeSubtree":
        return <SvgIcon component={removeEdgeIcon}></SvgIcon>;
      case "addRow":
        return <SvgIcon component={addRowIcon}></SvgIcon>;
      case "removeRow":
        return <SvgIcon component={removeRowIcon}></SvgIcon>;
      case "addColumn":
        return <SvgIcon component={addColumnIcon}></SvgIcon>;
      case "removeColumn":
        return <SvgIcon component={removeColumnIcon}></SvgIcon>;
      default:
        return <RectangleOutlinedIcon></RectangleOutlinedIcon>;
    }
  };

  const handleKeyDown = (ev) => {
    if (ev.key === "Enter") {
      onUpdate(fieldKey, value);
      ev.preventDefault();
    }
  };

  // For adding or removing edges, we wait for another node to be selected
  if (["addEdge", "removeEdge"].includes(fieldKey)) {
    return (
      <Tooltip title={label}>
        <span style={{ marginLeft: "10px", marginRight: "10px" }}>
          <IconButton
            disabled={error !== null}
            size="small"
            onClick={(e) => {
              onEditEdge(e, fieldKey);
            }}
            sx={{ fill: error !== null ? "gray" : "white" }}
          >
            {getIcon(fieldKey)}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  // For any type of remove, there is no need for any input field
  if (
    ["remove", "removeSubtree", "removeRow", "removeColumn"].includes(fieldKey)
  ) {
    return (
      <Tooltip title={label}>
        <span style={{ marginLeft: "10px", marginRight: "10px" }}>
          <IconButton
            disabled={error !== null}
            size="small"
            onClick={(e) => {
              onRemove(e, fieldKey);
            }}
            sx={{ fill: error !== null ? "gray" : "white" }}
          >
            {getIcon(fieldKey)}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  if (["shapeStacked", "shapeFlatten"].includes(fieldKey)) {
    return (
      <React.Fragment>
        <Tooltip title={label} sx={{ mr: 5 }}>
          <span style={{ marginLeft: "10px", marginRight: "10px" }}>
            <IconButton
              disabled={error !== null}
              aria-describedby={id}
              onClick={handleOpenPopup}
              sx={{ fill: error !== null ? "gray" : "white" }}
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
          sx={{ pointerEvents: "none" }}
        >
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                p: "15px 10px 10px 10px",
                minWidth: 220,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                {fieldKey === "shapeStacked" && (
                  <>
                    <TextField
                      size="small"
                      type="number"
                      label="D"
                      value={shapeStacked.depth}
                      onChange={(e) => {
                        const nextShapeStacked = {
                          ...shapeStacked,
                          depth: e.target.value,
                        };
                        setShapeStacked(nextShapeStacked);
                        onChange(fieldKey, nextShapeStacked);
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                        handleKeyDown;
                      }}
                      sx={{
                        width: 72,
                        '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button':
                          {
                            WebkitAppearance: "none",
                            MozAppearance: "textfield",
                            margin: 0,
                          },
                      }}
                    />
                    <Typography variant="body2">×</Typography>
                  </>
                )}

                <TextField
                  size="small"
                  type="number"
                  label="H"
                  value={
                    fieldKey === "shapeStacked"
                      ? shapeStacked.height
                      : shapeFlatten.rows
                  }
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: 1, // optional: whole numbers only
                    },
                  }}
                  onChange={(e) => {
                    if (fieldKey === "shapeStacked") {
                      const nextShapeStacked = {
                        ...shapeStacked,
                        height: e.target.value,
                      };
                      setShapeStacked(nextShapeStacked);
                      onChange(fieldKey, nextShapeStacked);
                    } else {
                      const nextShapeFlatten = {
                        ...shapeFlatten,
                        rows: e.target.value,
                      };
                      setShapeFlatten(nextShapeFlatten);
                      onChange(fieldKey, nextShapeFlatten);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                    handleKeyDown;
                  }}
                  sx={{
                    width: 72,
                    '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button':
                      {
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                        margin: 0,
                      },
                  }}
                />
                <Typography variant="body2">×</Typography>

                <TextField
                  size="small"
                  type="number"
                  label="W"
                  value={
                    fieldKey === "shapeStacked"
                      ? shapeStacked.width
                      : shapeFlatten.columns
                  }
                  onChange={(e) => {
                    if (fieldKey === "shapeStacked") {
                      const nextShapeStacked = {
                        ...shapeStacked,
                        width: e.target.value,
                      };
                      setShapeStacked(nextShapeStacked);
                      onChange(fieldKey, nextShapeStacked);
                    } else {
                      const nextShapeFlatten = {
                        ...shapeFlatten,
                        columns: e.target.value,
                      };
                      setShapeFlatten(nextShapeFlatten);
                      onChange(fieldKey, nextShapeFlatten);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                    handleKeyDown;
                  }}
                  sx={{
                    width: 72,
                    '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button':
                      {
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                        margin: 0,
                      },
                  }}
                />
              </Stack>
            </Box>
          </>
        </Popover>
      </React.Fragment>
    );
  }

  // Regular text/number inputs
  if (
    [
      "add",
      "value",
      "color",
      "arrow",
      "stroke",
      "addRow",
      "addColumn",
      "addChild",
      "shapeEdge",
      "annotation",
      "layout",
    ].includes(fieldKey)
  ) {
    return (
      <React.Fragment>
        <Tooltip title={label} sx={{ mr: 5 }}>
          <span style={{ marginLeft: "10px", marginRight: "10px" }}>
            <IconButton
              disabled={error !== null}
              aria-describedby={id}
              onClick={handleOpenPopup}
              sx={{ fill: error !== null ? "gray" : "white" }}
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
          sx={{ pointerEvents: "none" }}
        >
          {fieldKey === "color" || fieldKey === "stroke" ? (
            <div style={{ width: 256, padding: "5px" }}>
              <Circle
                colors={getColors()}
                color={value}
                onChange={(selectedColor) => {
                  onUpdate(fieldKey, selectedColor.hex);
                }}
              />
            </div>
          ) : (
            <>
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    p: "15px 10px 10px 10px",
                    minWidth: 220,
                  }}
                >
                  {fieldKey === "annotation" && (
                    <FormControl fullWidth size="small">
                      <InputLabel>Side</InputLabel>
                      <Select
                        label="Side"
                        defaultValue={""}
                        onChange={(e) => {
                          setAnnotation((prev) => ({
                            ...prev,
                            side: e.target.value,
                          }));
                        }}
                      >
                        <MenuItem value="top">top</MenuItem>
                        <MenuItem value="bottom">bottom</MenuItem>
                        <MenuItem value="left">left</MenuItem>
                        <MenuItem value="right">right</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  {fieldKey === "shapeEdge" && (
                    <FormControl fullWidth size="small">
                      <InputLabel>Style</InputLabel>
                      <Select
                        label={"Style"}
                        defaultValue={""}
                        onChange={(e) => {
                          onUpdate(fieldKey, e.target.value);
                          e.preventDefault();
                        }}
                      >
                        <MenuItem value="straight">straight</MenuItem>
                        <MenuItem value="bow">bow</MenuItem>
                        <MenuItem value="arc">arc</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                  {fieldKey === "layout" && (
                    <FormControl fullWidth size="small">
                      <InputLabel>Layout</InputLabel>
                      <Select
                        label={"Layout Group"}
                        defaultValue={""}
                        onChange={(e) => {
                          onUpdate(fieldKey, e.target.value);
                          e.preventDefault();
                        }}
                      >
                        <MenuItem value="horizontal">horizontal</MenuItem>
                        <MenuItem value="vertical">vertical</MenuItem>
                        <MenuItem value="grid">grid</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  {fieldKey !== "shapeEdge" && fieldKey !== "layout" && (
                    <TextField
                      label={
                        fieldKey === "addRow" || fieldKey === "addColumn"
                          ? "Enter values comma-separated"
                          : "Enter a value"
                      }
                      value={
                        value !== null &&
                        value !== undefined &&
                        value !== "null"
                          ? fieldKey === "annotation"
                            ? annotation.value
                            : value
                          : ""
                      }
                      size="small"
                      fullWidth
                      onChange={(e) => {
                        if (fieldKey === "annotation") {
                          const nextAnnotation = {
                            ...annotation,
                            value: e.target.value,
                          };
                          setAnnotation(nextAnnotation);
                          onChange(fieldKey, nextAnnotation);
                        } else {
                          onChange(fieldKey, e.target.value);
                        }
                      }}
                      onKeyDown={handleKeyDown}
                    />
                  )}
                </Box>
              </>
            </>
          )}
        </Popover>
      </React.Fragment>
    );
  }
};

export const UnitEditor = ({
  inspectorIndex,
  currentPage,
  unitAnchorEl,
  setUnitAnchorEl,
  setEdgeTarget,
}) => {
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
      const parsedInfo = parseInspectorIndex(
        inspectorIndex,
        pages,
        currentPage,
      );
      const unitData = createUnitData(parsedInfo);

      if (unitData) {
        setUnitData(unitData);
        if (unitAnchorEl) {
          unitPopoverEnter();
        }
      }
    }
  }, [inspectorIndex, currentPage, pages]);

  useEffect(() => {
    if (!unitAnchorEl) {
      unitPopoverLeave();
    }
  }, [unitAnchorEl]);

  const handleAddUnit = (value, addCommand) => {
    addUnit(
      currentUnitData.page,
      currentUnitData.name,
      currentUnitData.type,
      value,
      currentUnitData.coordinates,
      currentUnitData.nodes,
      null,
      addCommand,
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
      removeCommand,
      currentUnitData.fieldKey,
    );
  };

  const handleEditEdge = (event, editCommand) => {
    unitPopoverLeave();
    setEdgeTarget({
      page: currentUnitData.page,
      name: currentUnitData.name,
      firstNode: currentUnitData.nodes,
      nodes: currentUnitData.allNodes,
      command: editCommand,
    });
  };

  const handleFieldChange = (fieldKey, value) => {
    setUnitData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleFieldUpdate = (fieldKey, value) => {
    unitPopoverLeave();
    if (["add", "addRow", "addColumn", "addChild"].includes(fieldKey)) {
      handleAddUnit(value, fieldKey);
    } else {
      updateValue(
        currentUnitData.page,
        currentUnitData.name,
        currentUnitData.coordinates,
        fieldKey,
        value,
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
      sx={{ pointerEvents: "none" }}
    >
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

        {currentUnitData &&
          currentUnitData.type &&
          Object.entries(getComponentFields(currentUnitData.type))
            .filter(([fieldKey]) => {
              if (
                fieldKey === "shapeEdge" &&
                !currentUnitData.coordinates.isEdge &&
                !currentUnitData.coordinates.isDiagramEdge
              ) {
                return false;
              }

              if (
                fieldKey === "stroke" &&
                (currentUnitData.coordinates.isEdge ||
                  currentUnitData.coordinates.isGroup ||
                  currentUnitData.coordinates.isBlock ||
                  (currentUnitData.coordinates.isNode &&
                    currentUnitData.coordinates.type === "text") ||
                  currentUnitData.coordinates.isDiagramEdge)
              ) {
                return false;
              }

              if (
                fieldKey === "annotation" &&
                (currentUnitData.coordinates.isEdge ||
                  currentUnitData.coordinates.isDiagramEdge)
              ) {
                return false;
              }

              if (fieldKey === "value") {
                if (
                  currentUnitData.coordinates.isGroup ||
                  currentUnitData.coordinates.isBlock
                ) {
                  return false;
                }
              }

              if (fieldKey === "layout") {
                if (
                  !currentUnitData.coordinates.isGroup &&
                  !currentUnitData.coordinates.isBlock
                ) {
                  return false;
                }
              }

              if (
                currentUnitData.coordinates.type === "flatten" ||
                currentUnitData.coordinates.type === "fullyConnected" ||
                currentUnitData.coordinates.type === "stacked"
              ) {
                if (fieldKey === "stroke") {
                  return false;
                }
                if (fieldKey === "value") {
                  return false;
                }
              }

              if (fieldKey === "shapeStacked") {
                if (currentUnitData.coordinates.type !== "stacked") {
                  return false;
                }
              }

              if (fieldKey === "shapeFlatten") {
                if (currentUnitData.coordinates.type !== "flatten") {
                  return false;
                }
              }

              if (currentUnitData.coordinates.type === "fullyConnected") {
                if (fieldKey === "color") {
                  return false;
                }
              }

              return true;
            })
            .map(([fieldKey, label]) => (
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
            ))}
      </Box>
    </Popover>
  );
};
