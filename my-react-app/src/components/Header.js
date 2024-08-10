import React from 'react';
import { Button, Box, Toolbar, Typography, AppBar, Grid, IconButton } from '@mui/material';
import GitHubIcon from "@mui/icons-material/GitHub"

// Import the image directly
import appIcon from "../public/empty.png";


const Header = () => {
    return (
        <AppBar position="static" color="primary" sx={{
            justifyContent: "space-between",
            flexDirection: "row",
            padding: '5px 16px',
            borderBottom: '1px solid #444'
        }}>

            <Box display="flex" flexGrow={1} alignItems={'center'}>
                <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase'}}>Intuition Vis</Typography>
            </Box>
            <Box display="flex">
                <Toolbar disableGutters >
                    <Grid container justifyContent="space-between" alignItems="center">
                    <IconButton
            href="https://github.com/ETH-PEACH-Lab/intuition-vis-test"
            target="_blank"
            rel="noreferrer"
            size="large"
          >
            <GitHubIcon />
          </IconButton>
                        <Button variant="text" color="inherit">Docs</Button>
                        <Button variant="text" color="inherit">Tutorial</Button>
                        <Button variant="text" color="inherit" href="https://eth-peach-lab.github.io/intuition-visualisation/" target="_blank">Intuition Viewer</Button>
                    </Grid>
                </Toolbar>
            </Box>
        </AppBar>
    )
}

export default Header