import React, { useEffect, useState } from "react";
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { TabContext } from '@mui/lab';
import { Button, DialogActions, Box, TextField } from "@mui/material";
import { useParseCompile } from "../context/ParseCompileContext";
import { parseInspectorIndex, createComponentData } from "../compiler/dslUtils.mjs";

export const ComponentEditor = ({inspectorIndex, currentPage, leaveFunction}) => {

  const [value, setValue] = useState("1");
  const [currentComponentData, setCurrentComponentData] = useState(null);
  const [prevComponentData, setPrevComponentData] = useState(null);
  const { pages, updateValues } = useParseCompile();

  useEffect(() => {
    if (inspectorIndex) {
      const parsedInfo = parseInspectorIndex(inspectorIndex, pages, currentPage);
      const componentData = createComponentData(parsedInfo);
      
      if (componentData) {
        setCurrentComponentData(componentData);
        setPrevComponentData(componentData);
      }
    }
  }, [inspectorIndex, currentPage, pages]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFieldChange = (e) => {
    setCurrentComponentData({ ...currentComponentData, [e.target.name]: e.target.value });
  };

  const handleEditComponent = (event) => {
    event.preventDefault();
    ["nodes", "edges", "value", "color", "arrow"].forEach(fieldKey => {
      const newValue = currentComponentData[fieldKey]
      if (typeof newValue === 'string' || newValue instanceof String){
        const newValueParsed = newValue.split(',').map(( value ) => value.trim());
        updateValues(currentComponentData.type, currentComponentData.name, currentComponentData.page, fieldKey, prevComponentData[fieldKey], newValueParsed);
      }
    })
    leaveFunction();
  };


  return (
    <React.Fragment>
      {currentComponentData &&
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
            <TextField id="textField1" name="value" label="Values" value={currentComponentData?.value} margin="dense" fullWidth variant="standard" onChange={handleFieldChange}/>
            <TextField name="color" label="Colors" value={currentComponentData?.color?.map(( value ) => (value === null) ? "_" : value)} margin="dense" fullWidth variant="standard"/>
            <TextField name="arrow" label="Arrows" value={currentComponentData?.arrow?.map(( value ) => (value === null) ? "_" : value)} margin="dense" fullWidth variant="standard"/>
          </TabPanel>
          <TabPanel value="2">Set structure
            <TextField name="nodes" label="Nodes" margin="dense" fullWidth variant="standard"/>
            <TextField name="edges" label="Edges" margin="dense" fullWidth variant="standard"/>
          </TabPanel>
          <TabPanel value="3">
            <TextField name="text_above" label="Text above" margin="dense" fullWidth variant="standard"/>
            <TextField name="text_below" label="Text below" margin="dense" fullWidth variant="standard"/>
            <TextField name="text_left"  label="Text left"  margin="dense" fullWidth variant="standard"/>
            <TextField name="text_right" label="Text right" margin="dense" fullWidth variant="standard"/>
          </TabPanel>
          <TabPanel value="4">{currentComponentData?.value}</TabPanel>
        </TabContext>
        <DialogActions>
          <Button onClick={leaveFunction}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </form>
      }
    </React.Fragment>
  );
}