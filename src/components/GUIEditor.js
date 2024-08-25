import React, { useEffect, useState } from 'react';
import { Button, Box, Tooltip, Typography, Chip, AppBar, Grid, IconButton, List, ListItem, TextField, FormControlLabel, Switch } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { fillParsedDsl } from './fillParsedDSL';
import { reconstructDSL } from './reconstructDSL';
import { hardcodeData } from '../hardcode/data';
import { findLastDrawCoveringIndex, evaluateExpression, findComponentIdxByName } from './GuiHelper';

const GUIEditor = ({ inspectorIndex, setCode1, parsedCode1 }) => {
    const defaultUnitValue = { value: '0', color: '#000', isArrow: false, isIndex: false }
    const [currentUnitData, setUnitData] = useState(defaultUnitValue);

    useEffect(() => {
        if (inspectorIndex) {
            let lastPageDraw = findLastDrawCoveringIndex(parsedCode1, parseInt(inspectorIndex.pageID.slice(4)));
            let page_idx = lastPageDraw["page_index"];
            let target_page = parseInt(inspectorIndex.pageID.slice(4));
            let component_idx = lastPageDraw.show[parseInt(inspectorIndex.componentID.slice(10))]["component_index"];
            let component_name = lastPageDraw.show[parseInt(inspectorIndex.componentID.slice(10))]["component_name"];
            let component_idx_dsl = evaluateExpression(component_idx, page_idx, target_page);
            let component_id_dsl = findComponentIdxByName(parsedCode1, component_name);
            let unit_id_dsl = inspectorIndex.unitID.slice(5);
            const findSelectedComponents = parsedCode1["data"][component_id_dsl];
            const findSelectedComponents_type = parsedCode1["data"][component_id_dsl]["type"];
            const findSelectedComponentData = findSelectedComponents["attributes"];
            let findUnitData = {};
            switch (findSelectedComponents_type) {
                case "array":
                case "stack":
                case "tree":
                case "linkedlist":
                case "graph":
                    findUnitData = {
                        value: findSelectedComponentData["value"][component_idx_dsl][parseInt(unit_id_dsl)],
                        color: findSelectedComponentData["color"][component_idx_dsl][parseInt(unit_id_dsl)],
                        arrow: findSelectedComponentData["arrow"][component_idx_dsl][parseInt(unit_id_dsl)],
                        isArrow: false, 
                        isIndex: false
                    };
                    break;
                case "matrix":
                    let row = parseInt(unit_id_dsl.slice(1, -1).split(',')[0]);
                    let col = parseInt(unit_id_dsl.slice(1, -1).split(',')[1]);
                    findUnitData = {
                        value: findSelectedComponentData["value"][component_idx_dsl][row][col],
                        color: findSelectedComponentData["color"][component_idx_dsl][row][col],
                        arrow: findSelectedComponentData["arrow"][component_idx_dsl][row][col],
                        isArrow: false, 
                        isIndex: false
                    };
                    break;
                default:
                    console.log('GUI EDITOR - findUnitData, no matching component type!');
            }

            // console.log("findUnitData: ", findUnitData);
            if (findUnitData) setUnitData(findUnitData)
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

        let updatedParsedCode1 = { ...parsedCode1};

        let lastPageDraw = findLastDrawCoveringIndex(updatedParsedCode1, parseInt(inspectorIndex.pageID.slice(4)));
        let page_idx = lastPageDraw["page_index"];
        let target_page = parseInt(inspectorIndex.pageID.slice(4));
        let component_idx = lastPageDraw.show[parseInt(inspectorIndex.componentID.slice(10))]["component_index"];
        let component_name = lastPageDraw.show[parseInt(inspectorIndex.componentID.slice(10))]["component_name"];
        let component_idx_dsl = evaluateExpression(component_idx, page_idx, target_page);
        let component_id_dsl = findComponentIdxByName(updatedParsedCode1, component_name);
        let unit_id_dsl = inspectorIndex.unitID.slice(5);
        const findSelectedComponents = updatedParsedCode1["data"][component_id_dsl];
        const findSelectedComponents_type = updatedParsedCode1["data"][component_id_dsl]["type"];
        const findSelectedComponentData = findSelectedComponents["attributes"];
        let findUnitData = {};
        switch (findSelectedComponents_type) {
            case "array":
            case "stack":
            case "tree":
            case "linkedlist":
            case "graph":
                findSelectedComponentData["value"][component_idx_dsl][parseInt(unit_id_dsl)] = currentUnitData.value;
                findSelectedComponentData["color"][component_idx_dsl][parseInt(unit_id_dsl)] = currentUnitData.color;
                break;
            case "matrix":
                let row = parseInt(unit_id_dsl.slice(1, -1).split(',')[0]);
                let col = parseInt(unit_id_dsl.slice(1, -1).split(',')[1]);
                findSelectedComponentData["value"][component_idx_dsl][row][col] = currentUnitData.value;
                findSelectedComponentData["color"][component_idx_dsl][row][col] = currentUnitData.color;
                break;
            default:
                console.log('GUI EDITOR - findUnitData, no matching component type!');
        }
        console.log("GUIeditor Uupdate updatedParsedCode1:\n", updatedParsedCode1);
        let updatedCode1 = reconstructDSL(updatedParsedCode1);
        setCode1(updatedCode1);
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
