import React from 'react';
import { Drawer, List, ListItemText, ListItemButton, Tab, Typography, Box } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useTheme } from '@mui/material/styles';

const NavigationBar = ({ items, savedItems, onSelect, activeTab, onTabChange }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = useTheme();

  return (
    <Drawer
      id="component-nav-drawer"
      sx={{
        width: 180,
        '& .MuiDrawer-paper': {
          width: 180,
          borderRight: theme.palette.border,
        },
      }}
      variant="permanent"
      open={true}
      anchor="left"
    >
      <TabContext value={value} sx={{ backgroundColor: "#ff00ff"}}>
        <Box sx={{ borderBottom: theme.palette.border, width: "100%" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Examples" value="1" sx={{
              fontSize: "0.75rem",
              p: "5px 5px",
              height: "20px"
            }} />
            <Tab label="Saved" value="2" sx={{
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
        <TabPanel value="2" sx={{p:0}}><List dense>
          {savedItems.length > 0 ? 
          (
            savedItems.map((item, index) => (
              <ListItemButton
                key={item.timestamp}
                selected={selectedIndex === index}
                onClick={() => { onSelect(item); setSelectedIndex(index) }}
              >
                <ListItemText sx={{ pl: 2 }}>{new Date(item.timestamp).toLocaleString()}</ListItemText>
              </ListItemButton>
            ))
          ) : (
            <ListItemText sx={{ pl: 2 }}>No saved diagrams</ListItemText>)}
        </List></TabPanel>
      </TabContext>
    </Drawer>
  )
};

export default NavigationBar;
