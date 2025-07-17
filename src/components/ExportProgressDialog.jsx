import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

const ExportProgressDialog = ({ open, title, current, total, message }) => {
  const isIndeterminate = total === 0 || current === 0;
  const progress = isIndeterminate ? 0 : (current / total) * 100;

  return (
    <Dialog 
      open={open} 
      disableEscapeKeyDown 
      PaperProps={{
        sx: { minWidth: 400, padding: 2 }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        {title || 'Exporting...'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {isIndeterminate ? (
            <CircularProgress size={60} />
          ) : (
            <Box sx={{ width: '100%' }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {current} of {total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(progress)}%
                </Typography>
              </Box>
            </Box>
          )}
          
          <Typography 
            variant="body1" 
            sx={{ textAlign: 'center', minHeight: '1.5em' }}
          >
            {message || 'Processing...'}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExportProgressDialog;
