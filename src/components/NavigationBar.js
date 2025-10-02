import React from 'react';
import './NavigationBar.css';
import { Drawer, List, ListItemText, ListItemButton, Tab, Typography, Box } from '@mui/material';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useStudy } from "../study/StudyContext";

const NavigationBar = ({ items, savedItems, onSelect, activeTab, onTabChange }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [value, setValue] = React.useState('1');
  const { phase, currentKind } = useStudy();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (phase === 'task' && currentKind === 'merlin') return null;
  return (
    <Drawer
      id="component-nav-drawer"
      sx={{
        width: 180,
        '& .MuiDrawer-paper': {
          width: 180
        },
        borderRight: "1px solid #444"
      }}
      variant="permanent"
      open={true}
      anchor="left"
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: "100%" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Examples" value="1" sx={{
              fontSize: "0.75rem",
              p: "5px 5px",
              height: "20px"
            }} />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 0 }}>
          <List dense>
            {items.map((item, index) => (
              <ListItemButton
                key={item.id}
                selected={selectedIndex === index}
                onClick={() => { onSelect(item); setSelectedIndex(index) }}
              >
                <ListItemText sx={{ pl: 2 }}>{item.title}</ListItemText>
              </ListItemButton>
            ))
            }
          </List>
        </TabPanel>
      </TabContext>
    </Drawer>
  )
};

export default NavigationBar;
