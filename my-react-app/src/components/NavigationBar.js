import React from 'react';
import './NavigationBar.css';
import { Drawer, List, ListItemText, ListItemButton, ListSubheader, Typography } from '@mui/material';


const NavigationBar = ({ items, savedItems, onSelect, activeTab, onTabChange }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

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
      <List dense>
        <Typography sx={{pl: 2}} variant='overline'>Examples</Typography>
        {activeTab === 'examples' ? (
          items.map((item, index) => (
            <ListItemButton
              key={item.id}
              selected={selectedIndex === index}
              onClick={() => { onSelect(item); setSelectedIndex(index)}}
            >
              <ListItemText sx={{ pl: 2 }}>{item.title}</ListItemText>
            </ListItemButton>
          ))
        ) : savedItems.length > 0 ? (
          savedItems.map((item, index) => (
            <ListItemButton
              key={item.timestamp}
              onClick={() => {onSelect(item); setSelectedIndex(index)}}
            >
              <ListItemText sx={{ pl: 2 }}>{new Date(item.timestamp).toLocaleString()}</ListItemText>
            </ListItemButton>
          ))
        ) : (
          <ListItemText sx={{ pl: 2 }}>No saved diagrams</ListItemText>
        )}
      </List>
    </Drawer>
  )
};

export default NavigationBar;
