import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  ListItem,
  ListItemText,
  Box,
  SvgIcon,
  Typography,
} from "@mui/material";

export const CreateComponentItem = ({
  name,
  icon,
  text,
  formFields,
  createFunction,
}) => {
  const [openPopup, setOpenPopup] = React.useState(false);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleCreateComponent = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    createFunction(formJson);
    handleClosePopup();
  };

  return (
    <React.Fragment>
      <ListItem disablePadding>
        <Button
          fullWidth
          onClick={handleOpenPopup}
          sx={{
            justifyContent: "flex-start",
            textAlign: "left",
            px: 1.0,
            py: 1.0,
          }}
        >
          <Box
            sx={{
              width: 48,
              minWidth: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              mr: 2,
            }}
          >
            <SvgIcon
              component={icon}
              inheritViewBox
              sx={{
                fontSize: 32,
                display: "block",
              }}
            />
          </Box>

          <Typography sx={{ lineHeight: 1.1 }}>{name}</Typography>
        </Button>
      </ListItem>
      <Dialog open={openPopup} onClose={handleClosePopup} fullWidth>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <DialogContentText>{text}</DialogContentText>
          <form onSubmit={handleCreateComponent}>
            {formFields}
            <DialogActions>
              <Button onClick={handleClosePopup}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
