import * as React from 'react';
import { IconButton, Popover, Tooltip } from "@mui/material";

export const EditUnitItem = ({name, icon, formFields}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenPopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopup = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <React.Fragment>
      <Tooltip title={name} sx={{ mr: 5 }}>
        <span style={{marginLeft: "10px", marginRight: "10px"}}>
          <IconButton                 
            aria-describedby={id}
            onClick={handleOpenPopup}>
              {icon}
          </IconButton>
        </span>
      </Tooltip>
      <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          onMouseLeave={handleClosePopup}
          slotProps={{ paper: { sx: { pointerEvents: "auto" } } }}
          sx={{ pointerEvents: "none" }}>
            {formFields}
      </Popover>
  </React.Fragment>
  );
}