import React, { useEffect, useState } from 'react';
import './ElementEditor.css';
import { UnitEditor } from "./UnitEditor";
import Popover from '@mui/material/Popover';

export const ElementEditor = ({svgElement, updateInspector, inspectorIndex, currentPage}) => {
    useEffect(()=>{
        initListener();
    }, [svgElement])

    const initListener = () => {
        if(svgElement){
            svgElement.addEventListener('mouseover', onMouseOver);
            svgElement.addEventListener('mouseout', onMouseOut);
        }
    }

  const [anchorEl, setAnchorEl] = React.useState(null);

    const onMouseOut = (e) => {
        let target = e.target.parentElement.getElementsByTagName("rect")[0] || e.target.parentElement.getElementsByTagName("circle")[0];
        // Remove the highlight & close the toolbar if we are moving away from the unit
        if (typeof e.relatedTarget !== 'undefined' && e.relatedTarget !== null && (e.target.parentElement !== e.relatedTarget.parentElement)){
          // Unless we move to the toolbar
          let toolbar = document.getElementById("mouse-over-popover-div");
          if (typeof toolbar !== 'undefined' && toolbar !== null && toolbar.contains(e.relatedTarget)){
            return;
          }
          target.setAttribute("stroke", "black");
          popoverLeave();
        }
    }

    const onMouseOver = (e) =>{
        let target = e.target.parentElement.getElementsByTagName("rect")[0] || e.target.parentElement.getElementsByTagName("circle")[0];
        if (e.target.parentElement !== target.parentElement){
          return;
        }

        let current = target;

    
        // Traverse up the DOM tree to find the nearest <g class="unit"> element
        while (current && !current.classList.contains('unit')) {
            current = current.parentElement;
        }
        const unitID = current? current.id: null;

        // Traverse up the DOM tree to find the nearest <g class="component"> element
        while (current && !current.classList.contains('component')) {
            current = current.parentElement;
        }
        const componentID = current? current.id: null;

        // Traverse up the DOM tree to find the nearest <g class="page"> element
        while (current && !current.classList.contains('page')) {
            current = current.parentElement;
        }
        const pageID = current?current.id: null;

        updateInspector(unitID, componentID, pageID);

        target.setAttribute("stroke", "green");
        setAnchorEl(target);
        popoverEnter();

    }

  const [openedPopover, setOpenedPopover] = useState(false);

  const popoverEnter = () => {
    setOpenedPopover(true);
  };

  const popoverLeave = () => {
    if (typeof anchorEl !== 'undefined' && anchorEl !== null) {
      anchorEl.setAttribute("stroke", "black");
    }
    setAnchorEl(null);
    setOpenedPopover(false);
  };
    return <div id='mouse-over-popover-div2'>
      <Popover
        id='mouse-over-popover'
        open={openedPopover}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        onMouseLeave={popoverLeave}
        slotProps={{ paper: { sx: { pointerEvents: "auto" } } }}
        sx={{ pointerEvents: "none" }}>
        <div id='mouse-over-popover-div'>
          <UnitEditor inspectorIndex={inspectorIndex} currentPage={currentPage}/>
        </div>
      </Popover>
    </div>
}