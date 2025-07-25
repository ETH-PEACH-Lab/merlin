import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, 
         ListItem, ListItemText,TextField, SvgIcon } from "@mui/material";

export const CreateComponentItem = ({name, icon, text, formFields, createFunction}) => {
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
        <Button onClick={handleOpenPopup}>
          <ListItemText><SvgIcon component={icon}></SvgIcon> {name}</ListItemText>
        </Button>
      </ListItem>
      <Dialog open={openPopup} onClose={handleClosePopup} fullWidth> 
        <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText>
          {text}
        </DialogContentText>
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
}