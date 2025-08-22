import React, { useEffect, useState } from "react";
import "./ElementEditor.css";
import { UnitEditor } from "./UnitEditor";
import { ComponentEditor } from "./ComponentEditor"

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

  const [unitTarget, setUnitTarget] = useState(null);
  const [componentTarget, setComponentTarget] = useState(null);

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
      setUnitTarget(null);
      setComponentTarget(null);
    }
    else if (e.detail === 2) {
      setUnitTarget(null);
      updateInspector(unitID, componentID, pageID);
      setComponentTarget(target);
    }
    else {
      updateInspector(unitID, componentID, pageID);
      setUnitTarget(target);
    }
  }

  return (
    <React.Fragment>
      <ComponentEditor inspectorIndex={inspectorIndex} currentPage={currentPage} componentAnchorEl={componentTarget} setComponentAnchorEl={setComponentTarget}/>
      <UnitEditor inspectorIndex={inspectorIndex} currentPage={currentPage} unitAnchorEl={unitTarget} setUnitAnchorEl={setUnitTarget}/>
    </React.Fragment>
  );
}