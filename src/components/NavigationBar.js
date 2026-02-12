import React, { useState } from 'react';
import { Collapse, Drawer, List, ListItemText, ListItemButton, Tab, Box } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useTheme } from '@mui/material/styles';

const NavigationBar = ({ examples, savedItems, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [value, setValue] = React.useState('1');
  const [openGroups, setOpenGroups] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const handleGroupClick = (groupName) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
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
      <TabContext value={value}>
        <Box sx={{ borderBottom: theme.palette.border, width: "100%" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Examples" value="1" sx={{
              textTransform: "none",
              p: "5px 5px",
              height: "40px"
            }} />
            <Tab label="Saved" value="2" sx={{
              textTransform: "none",
              p: "5px 5px",
              height: "40px"
            }} />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 0 }}>
          <List sx={{ display: 'flex', flexDirection: 'column' }}>
            {examples.map((group, index) => (
              <React.Fragment key={index}>
                <ListItemButton
                  onClick={() => handleGroupClick(group.groupName)}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: "flex-start", padding: "0px 0px 0px 20px" }}
                >
                  <ListItemText primary={group.groupName}
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: '15px',
                      }
                    }}
                  />
                </ListItemButton>
                <Collapse in={!!openGroups[group.groupName]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {group.items.map((item, index) => (

                      <ListItemButton
                        key={item.id}
                        selected={selectedIndex === index}
                        onClick={() => { onSelect(item); setSelectedIndex(index) }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          padding: "0px 0px 0px 40px"
                        }}
                      >
                        <ListItemText primary={item.title}
                          sx={{
                            "& .MuiTypography-root": {
                              fontSize: '15px',
                            }
                          }}
                        />
                      </ListItemButton>

                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
      </TabContext>
    </Drawer>
  )
};

export default NavigationBar;
