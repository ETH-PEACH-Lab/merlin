import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@mui/material';

const EXPORT_FORMATS = [
  { value: 'png', label: 'PNG Image' },
  { value: 'pdf', label: 'PDF Document' },
  { value: 'svg', label: 'SVG Vector' },
  { value: 'pptx', label: 'PowerPoint Presentation' },
  { value: 'html', label: 'HTML Document' },
  { value: 'video', label: 'Video (WebM/MP4)' },
  { value: 'gif', label: 'Animated GIF/PNG' },
];

const PRESET_SIZES = [
  { label: 'HD (1920×1080)', width: 1920, height: 1080 },
  { label: '4K (3840×2160)', width: 3840, height: 2160 },
  { label: 'Full HD (1920×1080)', width: 1920, height: 1080 },
  { label: 'WQHD (2560×1440)', width: 2560, height: 1440 },
  { label: 'Standard PowerPoint (1024×768)', width: 1024, height: 768 }, // Standard PowerPoint 4:3
  { label: 'A4 Portrait (2480×3508)', width: 2480, height: 3508 },
  { label: 'A4 Landscape (3508×2480)', width: 3508, height: 2480 },
  { label: 'Letter Portrait (2550×3300)', width: 2550, height: 3300 },
  { label: 'Letter Landscape (3300×2550)', width: 3300, height: 2550 },
  { label: 'Custom', width: 0, height: 0 },
];

const CustomExportDialog = ({ 
  open, 
  onClose, 
  onExport,
  compiledMerlin,
  pages,
  mermaidRef,
  currentPage = 1
}) => {
  const [format, setFormat] = useState('png');
  const [preset, setPreset] = useState(PRESET_SIZES[0]);
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const [renderQuality, setRenderQuality] = useState(0.5);
  
  // Video-specific settings (with raw input for better UX)
  const [frameDuration, setFrameDuration] = useState(1000); // ms
  const [frameDurationInput, setFrameDurationInput] = useState('1'); // seconds, string for input
  const [videoFormat, setVideoFormat] = useState('mp4'); // webm or mp4

  // GIF-specific settings (with raw input for better UX)
  const [gifQuality, setGifQuality] = useState(10);
  const [gifQualityInput, setGifQualityInput] = useState('10');
  const [gifRepeat, setGifRepeat] = useState(0);
  const [gifRepeatInput, setGifRepeatInput] = useState('0');
  
  // Page selection state
  const [pageSelection, setPageSelection] = useState('all');
  const [selectedPage, setSelectedPage] = useState(currentPage);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(pages?.length || 1);

  // Update range end when pages change
  useEffect(() => {
    if (pages && pages.length > 0) {
      setRangeEnd(pages.length);
      // Ensure selected page is within bounds
      if (currentPage > pages.length) {
        setSelectedPage(1);
      } else {
        setSelectedPage(currentPage);
      }
    }
  }, [pages, currentPage]);

  const handlePresetChange = (event) => {
    const selectedPreset = PRESET_SIZES.find(p => p.label === event.target.value);
    setPreset(selectedPreset);
    if (selectedPreset.width > 0) {
      setCustomWidth(selectedPreset.width);
      setCustomHeight(selectedPreset.height);
    }
  };

  const handleExport = () => {
    const width = preset.label === 'Custom' ? customWidth : preset.width;
    const height = preset.label === 'Custom' ? customHeight : preset.height;
    
    // Create page selection config instead of passing actual pages
    let pageSelectionConfig = {};
    if (pages && pages.length > 1) {
      if (pageSelection === 'single') {
        pageSelectionConfig = {
          pageSelection: 'single',
          selectedPage: selectedPage
        };
      } else if (pageSelection === 'range') {
        const start = Math.max(1, Math.min(rangeStart, pages.length));
        const end = Math.max(start, Math.min(rangeEnd, pages.length));
        pageSelectionConfig = {
          pageSelection: 'range',
          rangeStart: start,
          rangeEnd: end
        };
      } else {
        pageSelectionConfig = {
          pageSelection: 'all'
        };
      }
    }
    
    const customConfig = {
      width: width,
      height: height,
      renderAt: (format === 'svg' || format === 'html') ? 1.0 : renderQuality, // No scaling for SVG/HTML
      ...pageSelectionConfig, // Pass page selection config instead of pages
      // Add format-specific defaults
      ...(format === 'pdf' && { orientation: width > height ? 'landscape' : 'portrait' }),
      ...(format === 'pptx' && { 
        slideWidth: 10, 
        slideHeight: (10 * height) / width 
      }),
      ...(format === 'png' && { useHighDPI: true }),
      ...(format === 'video' && { 
        frameDuration: frameDuration,
        fps: 30,
        format: videoFormat
      }),
      ...(format === 'gif' && { 
        frameDuration: frameDuration,
        quality: gifQuality,
        repeat: gifRepeat
      }),
    };

    onExport(format, customConfig);
    onClose();
  };

  const isCustom = preset.label === 'Custom';
  const finalWidth = isCustom ? customWidth : preset.width;
  const finalHeight = isCustom ? customHeight : preset.height;

  // Calculate how many pages will be exported
  const getExportedPagesInfo = () => {
    if (!pages || pages.length === 0) return 'No pages';
    if (pages.length === 1) return '1 page';
    
    if (pageSelection === 'all') {
      return `${pages.length} pages`;
    } else if (pageSelection === 'single') {
      return `1 page (Page ${selectedPage})`;
    } else if (pageSelection === 'range') {
      const start = Math.max(1, Math.min(rangeStart, pages.length));
      const end = Math.max(start, Math.min(rangeEnd, pages.length));
      const count = end - start + 1;
      return count === 1 ? `1 page (Page ${start})` : `${count} pages (Pages ${start}-${end})`;
    }
    return 'Unknown';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { padding: 1 }
      }}
    >
      <DialogTitle>
        Custom Export Settings
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* Format Selection */}
          <FormControl fullWidth>
            <InputLabel>Export Format</InputLabel>
            <Select
              value={format}
              label="Export Format"
              onChange={(e) => setFormat(e.target.value)}
            >
              {EXPORT_FORMATS.map((fmt) => (
                <MenuItem key={fmt.value} value={fmt.value}>
                  {fmt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Size Preset Selection */}
          <FormControl fullWidth>
            <InputLabel>Size Preset</InputLabel>
            <Select
              value={preset.label}
              label="Size Preset"
              onChange={handlePresetChange}
            >
              {PRESET_SIZES.map((size) => (
                <MenuItem key={size.label} value={size.label}>
                  {size.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Custom Dimensions */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Width (px)"
                type="number"
                value={finalWidth}
                onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1920)}
                disabled={!isCustom}
                inputProps={{ min: 100, max: 10000 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Height (px)"
                type="number"
                value={finalHeight}
                onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1080)}
                disabled={!isCustom}
                inputProps={{ min: 100, max: 10000 }}
              />
            </Grid>
          </Grid>

          {/* Render Quality */}
          {(format !== 'svg' && format !== 'html' && format !== 'video') && (
            <FormControl fullWidth>
              <InputLabel>Render Quality</InputLabel>
              <Select
                value={renderQuality}
                label="Render Quality"
                onChange={(e) => setRenderQuality(e.target.value)}
              >
                <MenuItem value={0.25}>Ultra High (4x upscale)</MenuItem>
                <MenuItem value={0.5}>High (2x upscale)</MenuItem>
                <MenuItem value={0.75}>Medium (1.33x upscale)</MenuItem>
                <MenuItem value={1.0}>Native (no upscale)</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Video-specific Settings */}
          {format === 'video' && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Video Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Frame Duration (seconds)"
                    type="number"
                    value={frameDurationInput}
                    onChange={(e) => setFrameDurationInput(e.target.value)}
                    onBlur={() => {
                      let val = parseFloat(frameDurationInput);
                      if (isNaN(val) || val < 0.1 || val > 10) {
                        setFrameDurationInput((frameDuration / 1000).toString());
                      } else {
                        setFrameDuration(Math.round(val * 1000));
                        setFrameDurationInput(val.toString());
                      }
                    }}
                    inputProps={{ min: 0.1, max: 10, step: 0.1 }}
                    helperText="How long each page is shown"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Video Format</InputLabel>
                    <Select
                      value={videoFormat}
                      label="Video Format"
                      onChange={(e) => setVideoFormat(e.target.value)}
                    >
                      <MenuItem value="webm">WebM (VP9)</MenuItem>
                      <MenuItem value="mp4">MP4 (H.264)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {(!pages || pages.length <= 1) && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Video export requires multiple pages
                </Typography>
              )}
            </Box>
          )}

          {/* GIF-specific Settings */}
          {format === 'gif' && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                GIF Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Frame Duration (seconds)"
                    type="number"
                    value={frameDurationInput}
                    onChange={(e) => setFrameDurationInput(e.target.value)}
                    onBlur={() => {
                      let val = parseFloat(frameDurationInput);
                      if (isNaN(val) || val < 0.1 || val > 10) {
                        setFrameDurationInput((frameDuration / 1000).toString());
                      } else {
                        setFrameDuration(Math.round(val * 1000));
                        setFrameDurationInput(val.toString());
                      }
                    }}
                    inputProps={{ min: 0.1, max: 10, step: 0.1 }}
                    helperText="How long each page is shown"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Quality"
                    type="number"
                    value={gifQualityInput}
                    onChange={(e) => setGifQualityInput(e.target.value)}
                    onBlur={() => {
                      let val = parseInt(gifQualityInput);
                      if (isNaN(val) || val < 1 || val > 20) {
                        setGifQualityInput(gifQuality.toString());
                      } else {
                        setGifQuality(val);
                        setGifQualityInput(val.toString());
                      }
                    }}
                    inputProps={{ min: 1, max: 20, step: 1 }}
                    helperText="1=best quality, 20=smallest file"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Loop Count"
                    type="number"
                    value={gifRepeatInput}
                    onChange={(e) => setGifRepeatInput(e.target.value)}
                    onBlur={() => {
                      let val = parseInt(gifRepeatInput);
                      if (isNaN(val) || val < 0 || val > 100) {
                        setGifRepeatInput(gifRepeat.toString());
                      } else {
                        setGifRepeat(val);
                        setGifRepeatInput(val.toString());
                      }
                    }}
                    inputProps={{ min: 0, max: 100, step: 1 }}
                    helperText="0=infinite loop"
                  />
                </Grid>
              </Grid>
              {(!pages || pages.length <= 1) && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  GIF export requires multiple pages
                </Typography>
              )}
            </Box>
          )}

          {/* Page Selection */}
          {pages && pages.length > 1 && (
            <Box>
              <FormControl component="fieldset">
                <FormLabel component="legend">Page Selection</FormLabel>
                <RadioGroup
                  value={pageSelection}
                  onChange={(e) => setPageSelection(e.target.value)}
                >
                  <FormControlLabel value="all" control={<Radio />} label="Export all pages" />
                  <FormControlLabel value="single" control={<Radio />} label="Export single page" />
                  <FormControlLabel value="range" control={<Radio />} label="Export page range" />
                </RadioGroup>
              </FormControl>

              {/* Single Page Selection */}
              {pageSelection === 'single' && (
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Page</InputLabel>
                    <Select
                      value={selectedPage}
                      label="Select Page"
                      onChange={(e) => setSelectedPage(e.target.value)}
                    >
                      {Array.from({ length: pages.length }, (_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          Page {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Range Selection */}
              {pageSelection === 'range' && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Start Page"
                        type="number"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(Math.max(1, Math.min(parseInt(e.target.value) || 1, pages.length)))}
                        inputProps={{ min: 1, max: pages.length }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="End Page"
                        type="number"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(Math.max(rangeStart, Math.min(parseInt(e.target.value) || pages.length, pages.length)))}
                        inputProps={{ min: rangeStart, max: pages.length }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}

          {/* Preview Info */}
          <Box sx={(theme) => ({
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100],
            padding: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300],
          })}>
            <Typography variant="subtitle2" gutterBottom>
              Export Preview:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Format:</strong> {EXPORT_FORMATS.find(f => f.value === format)?.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Dimensions:</strong> {finalWidth} × {finalHeight} px
            </Typography>
            {(format !== 'svg' && format !== 'html' && format !== 'video') && (
              <Typography variant="body2" color="text.secondary">
                <strong>Render Size:</strong> {Math.round(finalWidth * renderQuality)} × {Math.round(finalHeight * renderQuality)} px
              </Typography>
            )}
            {format === 'video' && (
              <>
                <Typography variant="body2" color="text.secondary">
                  <strong>Frame Duration:</strong> {(frameDuration / 1000).toFixed(1)}s per page
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Video Format:</strong> {videoFormat.toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Total Duration:</strong> {((getExportedPagesInfo().match(/\d+/) || [1])[0] * frameDuration / 1000).toFixed(1)}s
                </Typography>
              </>
            )}
            <Typography variant="body2" color="text.secondary">
              <strong>Aspect Ratio:</strong> {(finalWidth / finalHeight).toFixed(2)}:1
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Pages to Export:</strong> {getExportedPagesInfo()}
            </Typography>
            {getExportedPagesInfo().includes('pages') && (
              <Typography variant="body2" color="text.secondary">
                <strong>Output:</strong> ZIP file with multiple {format.toUpperCase()} files
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleExport} 
          variant="contained"
          disabled={
            finalWidth < 100 || 
            finalHeight < 100 ||
            (format === 'video' && (!pages || pages.length <= 1))
          }
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomExportDialog;
