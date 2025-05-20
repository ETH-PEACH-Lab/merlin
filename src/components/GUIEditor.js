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

const GUIEditor = ({
  inspectorIndex,
  setCode1,
  parsedCode1,
  setParsedCode1,
  code1,
  currentPage,
  totalPages,
  setCurrentPage,
  setTotalPages,
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
  const { pages } = useParseCompile();


  useEffect(() => {
    if (inspectorIndex) {
      const page_idx = parseInt(inspectorIndex.pageID.slice(4));
      const component_idx = parseInt(inspectorIndex.componentID.slice(10));
      const unit_idx = inspectorIndex.unitID.slice(5);
      const component = pages[page_idx][component_idx];
      const value = component.body?.value?.[unit_idx] ?? "null";
      const color = component.body?.color?.[unit_idx] ?? "null";
      const arrow = component.body?.arrow?.[unit_idx] ?? "null";
      

      setUnitData(
        {
          id: unit_idx,
          component: component_idx,
          name: component.name,
          page: page_idx,
          type: component.type,
          value: value,
          color: color,
          arrow: arrow,
        }
      )
    }
  }, [inspectorIndex]);

  const handleAddPage = () => {
    // TODO: This is the place for handling add page
    /*
    console.log("add a new page, current page: ", `page${currentPage - 1}`);

    let filledParsedCode1 = fillParsedDsl(parsedCode1);

    // console.log('handleAddPage filledParsedCode1:\n', filledParsedCode1);

    let lastPageDraw = findLastDrawCoveringIndex(
      filledParsedCode1,
      currentPage - 1
    );
    let page_idx = lastPageDraw["page_index"];
    let target_page = currentPage - 1;

    lastPageDraw.show.forEach((component_show) => {
      let component_idx = component_show["component_index"];
      let component_name = component_show["component_name"];
      let component_idx_dsl = evaluateExpression(
        component_idx,
        page_idx,
        target_page
      ); // which page to copy in component
      let component_id_dsl = findComponentIdxByName(
        filledParsedCode1,
        component_name
      ); // which component in data

      let targetAttributes =
        filledParsedCode1["data"][component_id_dsl]["attributes"];

      // copy target page, edge in graph is a special case
      Object.entries(targetAttributes).forEach(([key, value]) => {
        if (!(key === "edge" && component_idx_dsl + 1 > value.length)) {
          value.splice(
            component_idx_dsl + 1,
            0,
            value[component_idx_dsl].slice()
          );
        }
      });

      console.log(
        "idx: ",
        component_idx,
        "\nname: ",
        component_name,
        "\ncomponent_idx_dsl: ",
        component_idx_dsl,
        "\ncomponent_id_dsl",
        component_id_dsl,
        "\nto copy: ",
        filledParsedCode1["data"][component_id_dsl],
        "\nafter copy: ",
        filledParsedCode1["data"]
      );
    });
    lastPageDraw["range"]["end"] += 1;

    // let component_idx = lastPageDraw.show[parseInt(inspectorIndex.componentID.slice(10))]["component_index"];
    // let component_name = lastPageDraw.show[parseInt(inspectorIndex.componentID.slice(10))]["component_name"];
    // let component_idx_dsl = evaluateExpression(component_idx, page_idx, target_page);
    // let component_id_dsl = findComponentIdxByName(parsedCode1, component_name);
    // let unit_id_dsl = inspectorIndex.unitID.slice(5);

    let updatedCode1 = reconstructDSL(filledParsedCode1);
    setCode1(updatedCode1);
    // setCurrentPage(currentPage => currentPage + 1);
    // setDslEditorEditable(false);
    setTotalPages((totalPages) => totalPages + 1);
    */
  };

  const handleRemovePage = () => {
    // TODO: This is the place for handling remove page
    /*
    console.log("remove current page: ", currentPage - 1);

    let filledParsedCode1 = fillParsedDsl(parsedCode1);

    // console.log('handleAddPage filledParsedCode1:\n', filledParsedCode1);
    setCurrentPage((currentPage) => currentPage - 1);

    let lastPageDraw = findLastDrawCoveringIndex(
      filledParsedCode1,
      currentPage - 1
    );
    let page_idx = lastPageDraw["page_index"];
    let target_page = currentPage - 1;

    lastPageDraw.show.forEach((component_show) => {
      let component_idx = component_show["component_index"];
      let component_name = component_show["component_name"];
      let component_idx_dsl = evaluateExpression(
        component_idx,
        page_idx,
        target_page
      ); // which page to copy in component
      let component_id_dsl = findComponentIdxByName(
        filledParsedCode1,
        component_name
      ); // which component in data

      let targetAttributes =
        filledParsedCode1["data"][component_id_dsl]["attributes"];

      // delete target page, edge in graph is a special case
      Object.entries(targetAttributes).forEach(([key, value]) => {
        if (!(key === "edge" && component_idx_dsl - 1 < 0)) {
          value.splice(component_idx_dsl, 1);
        }
      });

      // console.log("idx: ", component_idx,
      //     "\nname: ", component_name,
      //     "\ncomponent_idx_dsl: ", component_idx_dsl,
      //     "\ncomponent_id_dsl", component_id_dsl,
      //     "\nto delete: ", filledParsedCode1["data"][component_id_dsl],
      //     "\nafter delete: ", filledParsedCode1["data"],
      // );
    });

    lastPageDraw["range"]["end"] -= 1;

    let updatedCode1 = reconstructDSL(filledParsedCode1);
    setCode1(updatedCode1);
    // setDslEditorEditable(false);
    */
  };

  const handleUpdate = () => {
    // TODO: This is the place for handling update data values
    console.log("query index:", inspectorIndex);
    console.log("new data:", currentUnitData);

    /*
    let updatedParsedCode1 = { ...parsedCode1 };

    let lastPageDraw = findLastDrawCoveringIndex(
      updatedParsedCode1,
      parseInt(inspectorIndex.pageID.slice(4))
    );
    let page_idx = lastPageDraw["page_index"];
    let target_page = parseInt(inspectorIndex.pageID.slice(4));
    let component_idx =
      lastPageDraw.show[parseInt(inspectorIndex.componentID.slice(10))][
        "component_index"
      ];
    let component_name =
      lastPageDraw.show[parseInt(inspectorIndex.componentID.slice(10))][
        "component_name"
      ];
    let component_idx_dsl = evaluateExpression(
      component_idx,
      page_idx,
      target_page
    );
    let component_id_dsl = findComponentIdxByName(
      updatedParsedCode1,
      component_name
    );
    let unit_id_dsl = inspectorIndex.unitID.slice(5);
    const findSelectedComponents = updatedParsedCode1["data"][component_id_dsl];
    const findSelectedComponents_type =
      updatedParsedCode1["data"][component_id_dsl]["type"];
    const findSelectedComponentData = findSelectedComponents["attributes"];
    let findUnitData = {};
    switch (findSelectedComponents_type) {
      case "array":
      case "stack":
        findSelectedComponentData["structure"][component_idx_dsl][
          parseInt(unit_id_dsl)
        ] = currentUnitData.value != "" ? currentUnitData.value : "null";
        findSelectedComponentData["value"][component_idx_dsl][
          parseInt(unit_id_dsl)
        ] = currentUnitData.value != "" ? currentUnitData.value : "null";
        findSelectedComponentData["color"][component_idx_dsl][
          parseInt(unit_id_dsl)
        ] = currentUnitData.color != "" ? currentUnitData.color : "null";
        findSelectedComponentData["arrow"][component_idx_dsl][
          parseInt(unit_id_dsl)
        ] = currentUnitData.arrow != "" ? currentUnitData.arrow : "null";
        findSelectedComponentData["hidden"][component_idx_dsl][
          parseInt(unit_id_dsl)
        ] = currentUnitData.hidden != "" ? currentUnitData.hidden : "false";
        break;
      case "tree":
      case "linkedlist":
      case "graph":
        findSelectedComponentData["value"][component_idx_dsl][
          parseInt(unit_id_dsl)
        ] = currentUnitData.value != "" ? currentUnitData.value : "null";
        findSelectedComponentData["color"][component_idx_dsl][
          parseInt(unit_id_dsl)
        ] = currentUnitData.color != "" ? currentUnitData.color : "null";
        findSelectedComponentData["arrow"][component_idx_dsl][
          parseInt(unit_id_dsl)
        ] = currentUnitData.arrow != "" ? currentUnitData.arrow : "null";
        findSelectedComponentData["hidden"][component_idx_dsl][
          parseInt(unit_id_dsl)
        ] = currentUnitData.hidden != "" ? currentUnitData.hidden : "false";
        console.log(
          "debug findSelectedComponentData\n",
          findSelectedComponentData
        );
        break;
      case "matrix":
        let row = parseInt(unit_id_dsl.slice(1, -1).split(",")[0]);
        let col = parseInt(unit_id_dsl.slice(1, -1).split(",")[1]);
        findSelectedComponentData["value"][component_idx_dsl][row][col] =
          currentUnitData.value != "" ? currentUnitData.value : "null";
        findSelectedComponentData["color"][component_idx_dsl][row][col] =
          currentUnitData.color != "" ? currentUnitData.color : "null";
        findSelectedComponentData["arrow"][component_idx_dsl][row][col] =
          currentUnitData.arrow != "" ? currentUnitData.arrow : "null";
        findSelectedComponentData["hidden"][component_idx_dsl][row][col] =
          currentUnitData.hidden != "" ? currentUnitData.hidden : "false";
        break;
      default:
        console.log("GUI EDITOR - findUnitData, no matching component type!");
    }
    // console.log('GUIEditor updatedParserdCode1: ', updatedParsedCode1);
    let updatedCode1 = reconstructDSL(updatedParsedCode1);
    setCode1(updatedCode1);
    // setDslEditorEditable(false);
    */
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
            <IconButton
              disabled={!(currentPage === totalPages)}
              onClick={handleAddPage}
              sx={{ mr: 1 }}
              size="small"
            >
              <AddIcon sx={{ fontSize: 20 }}></AddIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove last Page">
            <IconButton
              disabled={!(currentPage === totalPages) || totalPages <= 1}
              onClick={handleRemovePage}
              sx={{ mr: 1 }}
              size="small"
            >
              <DeleteIcon sx={{ fontSize: 20 }}></DeleteIcon>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {inspectorIndex && (
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
              <Chip label={`Unit ${currentUnitData.id}`} size="small" sx={{ ml: 1 }} />
              <Chip
                label={`Type ${currentUnitData.type}`}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={handleUpdate}
              sx={{ mr: 8 }}
            >
              Update
            </Button>
          </Box>
          <div>
            <div>
              {(currentUnitData.type == "graph" ||
                currentUnitData.type == "tree" ||
                currentUnitData.type == "linkedlist") && (
                <TextField
                  label="Id"
                  disabled="true"
                  id="outlined-size-small"
                  helperText="The unit id is unchangeable"
                  value={currentUnitData.id}
                  size="small"
                  onChange={(e) => {
                    setUnitData({ ...currentUnitData, value: e.target.value });
                  }}
                />
              )}
              <TextField
                label="Value"
                id="outlined-size-small"
                value={currentUnitData.value}
                size="small"
                onChange={(e) => {
                  setUnitData({ ...currentUnitData, value: e.target.value });
                }}
              />
              <TextField
                label="Unit Color"
                id="outlined-size-small"
                value={currentUnitData.color}
                size="small"
                onBlur={(test) => (console.log(test))}
                onKeyDown={(ev) => {
                  console.log(`Pressed keyCode ${ev.key}`);
                  if (ev.key === 'Enter') {
                    // Lose focus on the input field
                    ev.target.blur();
                    ev.preventDefault();
                  }
                }}
                onSubmit={(e) => {
                  console.log("onSubmit", e);
                  setUnitData({ ...currentUnitData, color: e.target.value });
                }}
                onChange={(e) => {
                  setUnitData({ ...currentUnitData, color: e.target.value });
                }}
              />
              <TextField
                label="Arrow Label"
                id="outlined-size-small"
                value={currentUnitData.arrow}
                size="small"
                onChange={(e) => {
                  setUnitData({ ...currentUnitData, arrow: e.target.value });
                }}
              />
              {currentUnitData.type == "graph" && (
                <TextField
                  label="Hidden"
                  id="outlined-size-small"
                  value={currentUnitData.hidden}
                  size="small"
                  onChange={(e) => {
                    setUnitData({ ...currentUnitData, hidden: e.target.value });
                  }}
                />
              )}
            </div>
          </div>
        </Box>
      )}
    </div>
  );
};

export default GUIEditor;
