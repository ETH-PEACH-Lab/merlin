import React, { useEffect, useState } from 'react';
import { Button, Box, Tooltip, Typography, Chip, AppBar, Grid, IconButton, List, ListItem, TextField, FormControlLabel, Switch } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { hardcodeData } from '../hardcode/data';

const GUIEditor = ({ inspectorIndex }) => {
    const defaultUnitValue = { value: '0', color: '#000', isArrow: false, isIndex: false }
    const [currentUnitData, setUnitData] = useState(defaultUnitValue);

    useEffect(() => {
        if (inspectorIndex) {
            const findUnitData = hardcodeData.filter(e => e.unitID == inspectorIndex.unitID && e.componentID == inspectorIndex.componentID && e.pageID == inspectorIndex.pageID)
            if (findUnitData.length > 0) setUnitData(findUnitData[0])
            else setUnitData(defaultUnitValue)
        }
    }, [inspectorIndex])

    const handleAddPage = () => {
        // TODO: This is the place for handling add page
        console.log('add a new page', inspectorIndex.pageID);

    }

    const handleRemovePage = () => {
        // TODO: This is the place for handling remove page
        console.log('remove current page', inspectorIndex.pageID);

    }

    const handleUpdate = () => {
        // TODO: This is the place for handling update data values
        console.log('query index:', inspectorIndex);
        console.log('new data:', currentUnitData);
    }

    return <div>
        <Box sx={{
            paddingRight: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #444",
            borderTop: "1px solid #444"
        }}>
            <Box display="flex" flexGrow={1}>
                <Typography variant="overline" sx={{ pl: 2 }}>Unit Inspector</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
                <Tooltip title="Add a Page">
                    <IconButton onClick={handleAddPage} sx={{ mr: 1 }} size="small">
                        <AddIcon sx={{ fontSize: 20 }}></AddIcon>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Remove current Page">
                    <IconButton onClick={handleRemovePage} sx={{ mr: 1 }} size="small">
                        <DeleteIcon sx={{ fontSize: 20 }}></DeleteIcon>
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
        {inspectorIndex &&
            <Box component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    p: "5px 15px"
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <Box display="flex" flexGrow={1} alignItems={'center'} sx={{
                        '& > *': { mr: 1 }
                    }}>
                        <Typography variant='overline'>Current Selection:</Typography>
                        <Chip label={inspectorIndex.unitID} size="small" />
                        <Chip label={inspectorIndex.componentID} size="small" />
                        <Chip label={inspectorIndex.pageID} size="small" />
                    </Box>
                </div>
                <div>
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
                        label="Background Color"
                        id="outlined-size-small"
                        value={currentUnitData.color}
                        size="small"
                        onChange={(e) => {
                            setUnitData({ ...currentUnitData, color: e.target.value });
                        }}
                    />
                    <FormControlLabel control={<Switch checked={currentUnitData.isArrow} onChange={(e) => {
                        setUnitData({ ...currentUnitData, isArrow: e.target.checked });
                    }} />} label="IsArrow" />
                    <FormControlLabel control={<Switch checked={currentUnitData.isIndex} onChange={(e) => {
                        setUnitData({ ...currentUnitData, isIndex: e.target.checked });
                    }} />} label="IsIndex" />
                    <Button variant="contained" onClick={handleUpdate}>Update</Button>
                </div>
            </Box>
        }
    </div>
}

export default GUIEditor;
