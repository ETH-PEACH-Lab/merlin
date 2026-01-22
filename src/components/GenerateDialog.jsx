import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Grid, CircularProgress, Typography } from '@mui/material';

const GenerateDialog = ({ open, onClose, onCodeGenerated }) => {
  const [problemDescription, setProblemDescription] = useState('');
  const [referenceImplementation, setReferenceImplementation] = useState('');
  const [instanceText, setInstanceText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (open) {
      setProblemDescription('');
      setReferenceImplementation('');
      setInstanceText('');
      setIsGenerating(false);
    }
  }, [open]);

  const handleCreate = async () => {
    const content = {
      problemDescription,
      referenceImplementation,
      instance: instanceText
    };
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/save-input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('File saved to generate/input.txt');
        console.log('Generation completed successfully');
        
        // Load the generated code into the editor
        if (result.generatedCode && onCodeGenerated) {
          onCodeGenerated(result.generatedCode);
        }
        
        setIsGenerating(false);
        onClose();
      } else {
        console.error('Error:', result.error);
        alert('Error: ' + result.error);
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Error saving file: ' + error.message);
      setIsGenerating(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { padding: 1 } }}
    >
      <DialogTitle>
        Automatically Generate Visualization
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Problem Description"
                placeholder="Describe the problem to generate"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                fullWidth
                multiline
                minRows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reference Implementation"
                placeholder="Paste or write the reference implementation"
                value={referenceImplementation}
                onChange={(e) => setReferenceImplementation(e.target.value)}
                fullWidth
                multiline
                minRows={6}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Instance"
                placeholder="Provide a specific instance"
                value={instanceText}
                onChange={(e) => setInstanceText(e.target.value)}
                fullWidth
                multiline
                minRows={3}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 2, flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} color="inherit" disabled={isGenerating}>Cancel</Button>
          <Button 
            onClick={handleCreate} 
            variant="contained" 
            disabled={isGenerating}
            startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </Box>
        {isGenerating && (
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
            Generation may take up to 2 minutes
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GenerateDialog;
