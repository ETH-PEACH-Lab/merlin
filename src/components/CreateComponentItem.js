import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, 
         ListItem, ListItemText,TextField } from "@mui/material";

export const CreateComponentItem = ({name, icon, createFunction}) => {
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
      <ListItem>
        <Button onClick={handleOpenPopup} startIcon={icon}>
          <ListItemText>{name}</ListItemText>
        </Button>
      </ListItem>
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText>
          Enter the values of the {name.toLowerCase()} comma-separated.
        </DialogContentText>
        <form onSubmit={handleCreateComponent}>
          <TextField autoFocus required margin="dense" id="name"
            name="values" label="Values" fullWidth variant="standard"
          />
          <DialogActions>
            <Button onClick={handleClosePopup}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  </React.Fragment>
  );
}