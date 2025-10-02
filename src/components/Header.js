import React from 'react';
import { Button, Box, Toolbar, Typography, AppBar, Menu, MenuItem } from '@mui/material';
import { TopBarTimer } from "../study/StudyUI";
import { useStudy } from "../study/StudyContext";


const Header = ({ onOpenAdmin }) => {
    const { phase, beginStudy, resetForNewParticipant, currentKind, logEvent } = useStudy();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleOpenDocs = (e) => setAnchorEl(e.currentTarget);
    const handleCloseDocs = () => setAnchorEl(null);
    const handleClickMerlinDocs = () => {
      logEvent && logEvent('open_docs', { source: 'header', kind: 'merlin', url: 'https://eth-peach-lab.github.io/merlin-docs/' });

      window.open('https://eth-peach-lab.github.io/merlin-docs/', '_blank');
      handleCloseDocs();
    };
    const handleClickTikzDocs = (type) => {
      const url = type === 'shapes' ? 'https://tikz.dev/tikz-shapes' : 'https://tikz.dev/tikz-arrows';
      logEvent && logEvent('open_docs', { source: 'header', kind: 'tikz', type, url });

      window.open(url, '_blank');
      handleCloseDocs();
    };
    return (
        <AppBar position="static" sx={{
            justifyContent: "space-between",
            flexDirection: "row",
            padding: '2px 15px',
            borderBottom: '1px solid #444',
            backgroundColor: '#000'
        }}>

            <Box display="flex" flexGrow={1} alignItems={'center'}>
                <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase'}}>Merlin Study 🧙🏼‍♂️🪄 </Typography>
            </Box>
            <Box display="flex">
                <Toolbar disableGutters>
                    {currentKind === 'tikz' ? (
                      <>
                        <Button variant="text" color="inherit" onClick={handleOpenDocs}>TikZ Docs</Button>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseDocs} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                          <MenuItem onClick={()=>handleClickTikzDocs('shapes')}>Nodes and Edges</MenuItem>
                          <MenuItem onClick={()=>handleClickTikzDocs('arrows')}>Arrows</MenuItem>
                        </Menu>
                      </>
                    ) : (
                      <Button variant="text" color="inherit" href='https://eth-peach-lab.github.io/merlin-docs/' target="_blank" onClick={handleClickMerlinDocs}>Merlin Lite Docs</Button>
                    )}
                    {phase === 'idle' && (
                      <Button sx={{ ml: 1 }} variant="contained" color="primary" onClick={beginStudy}>Start Study</Button>
                    )}
                    {phase === 'finished' && (
                      <Button sx={{ ml: 1 }} variant="contained" color="warning" onClick={resetForNewParticipant}>Restart Study</Button>
                    )}
                    <Box ml={2}><TopBarTimer onOpenAdmin={onOpenAdmin} /></Box>
                </Toolbar>
            </Box>
        </AppBar>
    )
}

export default Header