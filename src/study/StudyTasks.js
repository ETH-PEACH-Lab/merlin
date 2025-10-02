import React from "react";
import { Box, Typography } from "@mui/material";
import { getAssetPath } from "../utils/assetPath";

// Helper components that render task descriptions and reference images from /study

export function Task1Description(isMerlinLite) {
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography gutterBottom>Replicate this diagram as closely as possible in {isMerlinLite ? "Merlin Lite" : "TikZ"}.</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', backgroundColor: "white", borderRadius: 1, color: "black", pt: 5, pb: 5 }}>
        <img src={getAssetPath("/study/task1.svg")} alt="Task 1" style={{ maxWidth: 500, width: '100%' }} />
      </Box>
    </Box>
  );
}

export function Task2Description() {
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography gutterBottom>Please implement this multi-page diagram in Merlin Lite:</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', backgroundColor: "white", borderRadius: 1, color: "black", pt: 5, pb: 5 }}>
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={getAssetPath("/study/task2/page_1.png")} style={{ maxWidth: 220 }} />
          <Typography variant="caption" >Page 1</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={getAssetPath("/study/task2/page_2.png")} style={{ maxWidth: 220 }} />
          <Typography variant="caption">Page 2</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={getAssetPath("/study/task2/page_3.png")} style={{ maxWidth: 220 }} />
          <Typography variant="caption">Page 3</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={getAssetPath("/study/task2/page_4.png")} style={{ maxWidth: 220 }} />
          <Typography variant="caption">Page 4</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={getAssetPath("/study/task2/page_5.png")} style={{ maxWidth: 220 }} />
          <Typography variant="caption">Page 5</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={getAssetPath("/study/task2/page_6.png")} style={{ maxWidth: 220 }} />
          <Typography variant="caption">Page 6</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export function Task3Description() {
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography gutterBottom>Position three matrices and add a title as shown:</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', backgroundColor: "white", borderRadius: 1, color: "black", pt: 5, pb: 5 }}>
        <img src={getAssetPath("/study/task3/task3.svg")} alt="Task 3" style={{ maxWidth: 600, width: '100%' }} />
      </Box>
    </Box>
  );
}

export function Task4Description() {
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography gutterBottom>Create page 2 and 3 from the given page 1:</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', backgroundColor: "white", borderRadius: 1, color: "black", pt: 5, pb: 5 }}>
        <Box sx={{ textAlign: 'center', display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={getAssetPath("/study/task4/page_1.svg")} style={{ width: 400, border: "1px solid black", borderRadius: "4px" }} />
          <Typography variant="caption">Page 1</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={getAssetPath("/study/task4/page_2.svg")} style={{ width: 400, border: "1px solid black", borderRadius: "4px" }} />
          <Typography variant="caption">Page 2</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={getAssetPath("/study/task4/page_3.svg")} style={{ width: 400, border: "1px solid black", borderRadius: "4px" }} />
          <Typography variant="caption">Page 3</Typography>
        </Box>
      </Box>
      <Typography variant="subtitle2" sx={{ mt: 1 }}>Starter code is prefilled for page 1 within the editor.</Typography>
    </Box>
  );
}

export function Task5Description() {
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography gutterBottom>Given a 4x4 matrix, highlight its border cells in red and the center in blue.</Typography>
      <Typography sx={{ mb: 1 }}>
        Use&nbsp;
        <Box component="code" sx={{ fontFamily: 'Monaco, monospace', bgcolor: 'grey.800', px: 0.5, borderRadius: 0.5 }}>
          .setColors()
        </Box>
        &nbsp;and&nbsp;
        <Box component="code" sx={{ fontFamily: 'Monaco, monospace', bgcolor: 'grey.800', px: 0.5, borderRadius: 0.5 }}>
          .addBorder()
        </Box>
        .
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: "white", borderRadius: 1, color: "black", pt: 5, pb: 5 }}>
        <img src={getAssetPath("/study/task5.svg")} style={{width: 400, zoom: 2}} />
      </Box>
    </Box>
  );
}



