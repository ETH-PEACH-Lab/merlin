import React, { useEffect, useState } from "react";
import "./ElementEditor.css";
import { UnitEditor } from "./UnitEditor";
import { ComponentEditor } from "./ComponentEditor"
import { Dialog, DialogContent, Popover} from "@mui/material";

export const ElementEditor = ({svgElement, updateInspector, inspectorIndex, currentPage}) => {
  useEffect(()=>{
    initListener();
  }, [svgElement])

  const initListener = () => {
    if(svgElement){
      svgElement.addEventListener("click", onClick);
      svgElement.addEventListener("mouseout", onMouseOut);
    }
  }

  const [unitAnchorEl, setUnitAnchorEl] = useState(null);
  const [componentAnchorEl, setComponentAnchorEl] = useState(null);
  const unitToolbarOpen = Boolean(unitAnchorEl);
  const unitToolbar = unitToolbarOpen ? "unit-toolbar-popover" : undefined;
  const componentToolbarOpen = Boolean(componentAnchorEl);
  const componentToolbar = componentToolbarOpen ? "component-toolbar-popover" : undefined;

  const unitPopoverEnter = (target) => {
    target.setAttribute("stroke", "green");
    setUnitAnchorEl(target);
  };

  const unitPopoverLeave = () => {
    setUnitAnchorEl(null);
  };

  const componentPopoverEnter = (target) => {
    setComponentAnchorEl(target);
  };

  const componentPopoverLeave = () => {
    setComponentAnchorEl(null);
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

  const onClick = (e) =>{
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

    if (typeof target === "undefined" || e.target.parentElement !== target.parentElement){
      unitPopoverLeave();
    }
    else if (e.detail === 2) {
      unitPopoverLeave();
      updateInspector(unitID, componentID, pageID);
      componentPopoverEnter(target);
    }
    else {
      updateInspector(unitID, componentID, pageID);
      unitPopoverEnter(target);
    }
  }

  return (
    <React.Fragment>
      <Popover
        id={componentToolbar}
        open={componentToolbarOpen}
        anchorEl={componentAnchorEl}
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
        <div>
          <ComponentEditor inspectorIndex={inspectorIndex} currentPage={currentPage} leaveFunction={componentPopoverLeave}/>
        </div>
      </Popover>
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
        <div>
          <UnitEditor inspectorIndex={inspectorIndex} currentPage={currentPage} leaveFunction={unitPopoverLeave}/>
        </div>
      </Popover>
    </React.Fragment>
  );
}