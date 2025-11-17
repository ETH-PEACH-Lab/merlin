import React from 'react';
import { Button, Box, Toolbar, Typography, AppBar, Grid, IconButton, SvgIcon } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub"
import { merlinIcon } from './CustomIcons';

const Header = () => {
    return (
        <AppBar position="static" sx={{
            justifyContent: "space-between",
            flexDirection: "row",
            padding: "2px 15px",
            borderBottom: "1px solid #606770",
        }}>

            <Box display="flex" flexGrow={1} alignItems={"center"}>
                <SvgIcon component={merlinIcon}></SvgIcon>
                <Typography sx={{ fontWeight: "bold" }}>
                    &nbsp;
                    Merlin
                </Typography>
            </Box>
            <Box display="flex">
                <Toolbar disableGutters >
                    <Grid container justifyContent="space-between" alignItems="center" textTransform={"lowercase"}>
                        <IconButton
                            href="https://github.com/ETH-PEACH-Lab/merlin"
                            target="_blank"
                            rel="noreferrer"
                            size="large"
                        >
                            <GitHubIcon />
                        </IconButton>
                        <Button sx={{ textTransform: 'none' }} variant="text" color="inherit" href="https://eth-peach-lab.github.io/merlin-docs/docs/getting-started" target="_blank">Documentation</Button>
                        <Button sx={{ textTransform: 'none' }} variant="text" color="inherit" href="https://eth-peach-lab.github.io/merlin-docs/development" target="_blank">Development</Button>
                    </Grid>
                </Toolbar>
            </Box>
        </AppBar>
    )
}

export default Header