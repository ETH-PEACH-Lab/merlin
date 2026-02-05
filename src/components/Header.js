import React from 'react';
import { Button, Box, Toolbar, Typography, AppBar, SvgIcon } from "@mui/material";
import { merlinIcon } from './CustomIcons';

const Header = () => {
    return (
        <AppBar position="static" sx={{
            flexDirection: "row",
            padding: "2px 15px",
            maxHeight: "60px"
        }}>

            <Box display="flex" flexGrow={1} alignItems={"center"}>
                <Box display="flex">
                    <SvgIcon component={merlinIcon}></SvgIcon>
                    <Typography sx={{ fontWeight: "bold", marginRight: "10px", paddingRight: "8px", fontSize: "16px" }}>
                        <a href="https://eth-peach-lab.github.io/merlin-docs/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            &nbsp;
                            Merlin
                        </a>
                    </Typography>
                </Box>
                <Button href="https://eth-peach-lab.github.io/merlin-docs/docs/getting-started" target="_blank">Documentation</Button>
                <Button href="https://eth-peach-lab.github.io/merlin-docs/development" target="_blank">Development</Button>
                <Button sx={{ color: "#a94fd8" }} href="https://eth-peach-lab.github.io/merlin" target="_blank">Merlin Editor</Button>
            </Box>
            <Box display="flex" alignItems={"right"}>
                <Toolbar disableGutters>
                    <Button href="https://github.com/ETH-PEACH-Lab/merlin" target="_blank">GitHub</Button>
                </Toolbar>
            </Box>
        </AppBar>
    )
}

export default Header