import React, { useEffect, useState } from "react";
import "./ElementEditor.css";
import { UnitEditor } from "./UnitEditor";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Popover, Box, TextField } from "@mui/material";
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { TabContext } from '@mui/lab';

export const ElementEditor = ({svgElement, updateInspector, inspectorIndex, currentPage}) => {
  useEffect(()=>{
    initListener();
  }, [svgElement])

  const initListener = () => {
    if(svgElement){
      svgElement.addEventListener("click", onClick);
      svgElement.addEventListener("mouseout", onMouseOut);
      svgElement.addEventListener("dblclick", onDoubleClick);
    }
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "mouse-over-popover" : undefined;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
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

  const handleEditComponent = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    handleCloseDialog();
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

  const onDoubleClick = (e) => {
    let current = e.target;
  
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

    if (!componentID) return;
    // popoverLeave();
    // handleOpenDialog();


  };

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
        <form onSubmit={handleEditComponent}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                <Tab label="Values" value="1" />
                <Tab label="Structure" value="2" />
                <Tab label="Text" value="3" />
                <Tab label="Position" value="4" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <TextField margin="dense" name="values" label="Values" fullWidth variant="standard"/>
              <TextField margin="dense" name="colors" label="Colors" fullWidth variant="standard"/>
              <TextField margin="dense" name="arrows" label="Arrows" fullWidth variant="standard"/>
              <TextField margin="dense" name="nodes" label="Nodes" fullWidth variant="standard"/>
              <TextField margin="dense" name="edges" label="Edges" fullWidth variant="standard"/>
            </TabPanel>
            <TabPanel value="2">Set structure</TabPanel>
            <TabPanel value="3">
              <TextField margin="dense" name="text_above" label="Text above" fullWidth variant="standard"/>
              <TextField margin="dense" name="text_below" label="Text below" fullWidth variant="standard"/>
              <TextField margin="dense" name="text_left" label="Text left" fullWidth variant="standard"/>
              <TextField margin="dense" name="text_right" label="Text right" fullWidth variant="standard"/>
            </TabPanel>
            <TabPanel value="4">Set position</TabPanel>
          </TabContext>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
          </form>
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