import React, { useEffect, useState } from 'react';
import './ElementEditor.css';
import Popover from '@mui/material/Popover';

export const ElementEditor = ({svgElement, updateInspector}) => {
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
        let target = e.target.parentElement.getElementsByTagName("rect")[0];
        if (target.classList.contains('arrayElement')) {
            if (anchorEl == target || (typeof e.relatedTarget !== 'undefined' && e.relatedTarget !== null && e.relatedTarget.id === 'preview')) {
              popoverLeave();
            }
        }
    }

    const onMouseOver = (e) =>{
        let target = e.target.parentElement.getElementsByTagName("rect")[0];
        if (e.target.parentElement !== target.parentElement){
          return;
        }

        if (target.classList.contains('arrayElement')){
            target.setAttribute("stroke", "green");
            setAnchorEl(target);
            popoverEnter();
        }

    
        // Traverse up the DOM tree to find the nearest <g class="unit"> element
        while (target && !target.classList.contains('unit')) {
            target = target.parentElement;
        }
        const unitID = target? target.id: null;

        // Traverse up the DOM tree to find the nearest <g class="component"> element
        while (target && !target.classList.contains('component')) {
            target = target.parentElement;
        }
        const componentID = target? target.id: null;

        // Traverse up the DOM tree to find the nearest <g class="page"> element
        while (target && !target.classList.contains('page')) {
            target = target.parentElement;
        }
        const pageID = target?target.id: null;

        //updateInspector(unitID, componentID, pageID);

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
    return <div>
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
        <div id='mouse-over-popover-div'>Toolbar</div>
      </Popover>
    </div>
}