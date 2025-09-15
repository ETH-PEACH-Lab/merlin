import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import "./ElementEditor.css";
import { UnitEditor } from "./UnitEditor";
import { ComponentEditor } from "./ComponentEditor"
import { useParseCompile } from "../context/ParseCompileContext";

export const ElementEditor = ({svgElement, updateInspector, inspectorIndex, currentPage}) => {

  const [edgeTarget, setEdgeTarget] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const id = snackbarOpen ? 'edit-edge-snackbar' : undefined;
  const [unitTarget, setUnitTarget] = useState(null);
  const [componentTarget, setComponentTarget] = useState(null);

  const { editEdge } = useParseCompile();

  useEffect(()=> {
    initListener();
  }, [svgElement])

  useEffect(() => {
    if (edgeTarget){
      setSnackbarOpen(true);
    }
  }, [edgeTarget]);

  useEffect(()=> {
    if (snackbarOpen){
      document.getElementById("edit-edge-snackbar").dataset.page=edgeTarget.page;
      document.getElementById("edit-edge-snackbar").dataset.name=edgeTarget.name;
      document.getElementById("edit-edge-snackbar").dataset.nodes=edgeTarget.nodes;
      document.getElementById("edit-edge-snackbar").dataset.firstNode=edgeTarget.firstNode;
      document.getElementById("edit-edge-snackbar").dataset.command=edgeTarget.command;
    }
  }, [snackbarOpen])

  const initListener = () => {
    if(svgElement){
      svgElement.addEventListener("click", onClick);
      svgElement.addEventListener("mouseout", onMouseOut);
    }
    document.getElementsByClassName("container")[0].addEventListener("click", onDocumentClick);
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onMouseOut = (e) => {
    let target = e.target.parentElement.getElementsByTagName("rect")[0] || e.target.parentElement.getElementsByTagName("circle")[0];
    if (typeof target === "undefined" ){
      return;
    }
    // Remove the highlight & close the toolbar if we are moving away from the unit
    if (typeof e.relatedTarget !== "undefined" && e.relatedTarget !== null && (e.target.parentElement !== e.relatedTarget.parentElement)){
      // Unless we move to the toolbar
      let toolbar = document.getElementById("mouse-over-popover-div");
      if (typeof toolbar !== "undefined" && toolbar !== null && toolbar.contains(e.relatedTarget)){
        return;
      }
      target.setAttribute("stroke", "black");
    }
  }

  const onDocumentClick = (e) => {
    setUnitTarget(null);
    setComponentTarget(null);
  }

  const onClick = (e) =>{
    e.stopPropagation();
    let target = e.target.parentElement.getElementsByTagName("rect")[0] || e.target.parentElement.getElementsByTagName("circle")[0];
    let current = target;
  
    // Traverse up the DOM tree to find the nearest <g class="unit"> element
    while (current && !current.classList.contains("unit")) {
        current = current.parentElement;
    }
    const unitID = current? current.id: null;

    // Traverse up the DOM tree to find the nearest <g class="component"> element
    while (current && !current.classList.contains("component")) {
        current = current.parentElement;
    }
    const componentID = current? current.id: null;

    // Traverse up the DOM tree to find the nearest <g class="page"> element
    while (current && !current.classList.contains("page")) {
        current = current.parentElement;
    }
    const pageID = current?current.id: null;

    // If the user did not click on a unit, close the toolbar
    if (typeof target === "undefined" || e.target.parentElement !== target.parentElement){
      setUnitTarget(null);
      setComponentTarget(null);
    }
    // If the snackbar asked the user to select another unit, add or remove the edge
    else if (document.getElementById("edit-edge-snackbar")){
      handleSnackbarClose();
      editEdge(document.getElementById("edit-edge-snackbar").dataset, unitID.slice(5));
    }
    // If the user double-clicked on a unit, open the component menu
    else if (e.detail === 2) {
      setUnitTarget(null);
      updateInspector(unitID, componentID, pageID);
      setComponentTarget(target);
    }
    // Otherwise, open the unit menu
    else {
      updateInspector(unitID, componentID, pageID);
      setUnitTarget(target);
    }
  }

  return (
    <React.Fragment>
      <ComponentEditor inspectorIndex={inspectorIndex} currentPage={currentPage} componentAnchorEl={componentTarget} setComponentAnchorEl={setComponentTarget}/>
      <UnitEditor inspectorIndex={inspectorIndex} currentPage={currentPage} unitAnchorEl={unitTarget} setUnitAnchorEl={setUnitTarget} setEdgeTarget={setEdgeTarget}/>
      <Snackbar 
        open={snackbarOpen} 
        id={id}
        autoHideDuration={null} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
        '&.MuiSnackbar-root': { top: '150px' },
        }}
      >
        <Alert onClose={handleSnackbarClose} severity={'info'} sx={{ width: '100%' }}>
          Select a second node by clicking on it.
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}