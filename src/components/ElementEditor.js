import React, { useEffect, useState } from "react";
import "./ElementEditor.css";
import { UnitEditor } from "./UnitEditor";
import { ComponentEditor } from "./ComponentEditor"
import { Dialog, DialogContent, Popover} from "@mui/material";
import { useParseCompile } from "../context/ParseCompileContext";

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

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "mouse-over-popover" : undefined;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [componentData, setComponentData] = React.useState(null);
  const { pages } = useParseCompile();
  
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const popoverEnter = (target) => {
    target.setAttribute("stroke", "green");
    setAnchorEl(target);
  };

  const popoverLeave = () => {
    setAnchorEl(null);
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
      popoverLeave();
    }
    else if (e.detail === 2) {
      popoverLeave();
      updateInspector(unitID, componentID, pageID);
      handleOpenDialog();
    }
    else {
      updateInspector(unitID, componentID, pageID);
      popoverEnter(target);
    }
  }

  return (
    <React.Fragment>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth> 
        <DialogContent sx={{ paddingBottom: 0 }}>
          <ComponentEditor inspectorIndex={inspectorIndex} currentPage={currentPage} leaveFunction={handleCloseDialog}/>
        </DialogContent>
      </Dialog>
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
        <div id="mouse-over-popover-div">
          <UnitEditor inspectorIndex={inspectorIndex} currentPage={currentPage} leaveFunction={popoverLeave}/>
        </div>
      </Popover>
    </React.Fragment>
  );
}