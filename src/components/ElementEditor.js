import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { UnitEditor } from "./UnitEditor";
import { ComponentEditor } from "./ComponentEditor";
import { TextEditor } from "./TextEditor";
import { useParseCompile } from "../context/ParseCompileContext";

export const ElementEditor = ({
  svgElement,
  updateInspector,
  inspectorIndex,
  currentPage,
}) => {
  const [edgeTarget, setEdgeTarget] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const id = snackbarOpen ? "edit-edge-snackbar" : undefined;
  const [unitTarget, setUnitTarget] = useState(null);
  const [componentTarget, setComponentTarget] = useState(null);
  const [textTarget, setTextTarget] = useState(null);
  const { editEdge } = useParseCompile();

  useEffect(() => {
    initListener();
  }, [svgElement]);

  useEffect(() => {
    if (edgeTarget) {
      setSnackbarOpen(true);
    }
  }, [edgeTarget]);

  useEffect(() => {
    if (snackbarOpen) {
      document.getElementById("edit-edge-snackbar").dataset.page =
        edgeTarget.page;
      document.getElementById("edit-edge-snackbar").dataset.name =
        edgeTarget.name;
      document.getElementById("edit-edge-snackbar").dataset.nodes =
        edgeTarget.nodes;
      document.getElementById("edit-edge-snackbar").dataset.firstNode =
        edgeTarget.firstNode;
      document.getElementById("edit-edge-snackbar").dataset.command =
        edgeTarget.command;
    }
  }, [snackbarOpen]);

  const initListener = () => {
    if (svgElement) {
      svgElement.addEventListener("click", onClick);
      svgElement.addEventListener("mouseout", onMouseOut);
    }
    document
      .getElementsByClassName("container")[0]
      .addEventListener("click", onDocumentClick);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getDisplayTarget = (target) => {
    if (!target) return target;

    if (
      target.tagName === "path" &&
      target.getAttribute("stroke") === "transparent"
    ) {
      const next = target.nextElementSibling;
      if (next && next.tagName === "path") {
        return next;
      }
    }

    return target;
  };

  const getUnitElement = (el) => {
    let current = el;
    while (current && !current.classList?.contains("unit")) {
      current = current.parentElement;
    }
    return current;
  };

  const isSelectedUnitElement = (unitEl) => {
    if (!unitEl || !unitTarget) return false;
    return getUnitElement(unitTarget) === unitEl;
  };

  const saveOriginalStroke = (el) => {
    if (!el) return;

    if (el.dataset.originalStroke !== undefined) return;

    const currentStroke = el.getAttribute("stroke");
    el.dataset.originalStroke = currentStroke ?? "";
  };

  const restoreShapeStroke = (el) => {
    if (!el) return;

    if (el.dataset.originalStroke === undefined) return;

    const originalStroke = el.dataset.originalStroke;
    el.setAttribute("stroke", originalStroke === "" ? "none" : originalStroke);
  };
  const setUnitPathStroke = (unitEl, color) => {
    if (!unitEl) return;

    const paths = unitEl.getElementsByTagName("path");
    for (const path of paths) {
      if (path.getAttribute("stroke") !== "transparent") {
        saveOriginalStroke(path);
        path.setAttribute("stroke", color);
      }
    }
  };

  const restoreUnitPathStroke = (unitEl) => {
    if (!unitEl) return;

    const paths = unitEl.getElementsByTagName("path");
    for (const path of paths) {
      if (path.getAttribute("stroke") !== "transparent") {
        restoreShapeStroke(path);
      }
    }
  };

  const clearCurrentSelection = () => {
    if (!unitTarget) return;

    if (unitTarget.tagName === "path") {
      const unitEl = getUnitElement(unitTarget);
      restoreUnitPathStroke(unitEl);
    } else {
      restoreShapeStroke(unitTarget);
    }
  };

  const onMouseOut = (e) => {
    let target =
      e.target.parentElement.getElementsByTagName("rect")[0] ||
      e.target.parentElement.getElementsByTagName("circle")[0] ||
      getDisplayTarget(e.target.parentElement.getElementsByTagName("path")[0]);
    if (typeof target === "undefined") {
      return;
    }
    // Remove the highlight & close the toolbar if we are moving away from the unit
    if (
      typeof e.relatedTarget !== "undefined" &&
      e.relatedTarget !== null &&
      e.target.parentElement !== e.relatedTarget.parentElement
    ) {
      // Unless we move to the toolbar
      let toolbar = document.getElementById("mouse-over-popover-div");
      if (
        typeof toolbar !== "undefined" &&
        toolbar !== null &&
        toolbar.contains(e.relatedTarget)
      ) {
        return;
      }

      if (target.tagName === "path") {
        const unitEl = getUnitElement(target);

        if (isSelectedUnitElement(unitEl)) {
          return;
        }

        restoreUnitPathStroke(unitEl);
      } else {
        if (target === unitTarget) {
          return;
        }

        restoreShapeStroke(target);
      }
    }
  };

  const onDocumentClick = () => {
    clearCurrentSelection();
    setUnitTarget(null);
    setComponentTarget(null);
    setTextTarget(null);
  };

  const onClick = (e) => {
    e.stopPropagation();

    let target =
      e.target.tagName === "path"
        ? getDisplayTarget(e.target)
        : e.target.parentElement.getElementsByTagName("rect")[0] ||
          e.target.parentElement.getElementsByTagName("circle")[0] ||
          getDisplayTarget(
            e.target.parentElement.getElementsByTagName("path")[0],
          );
    // If the user did not click on a text component or on a unit, close the toolbars
    if (
      !e.target.classList.contains("textElement") &&
      (typeof target === "undefined" ||
        e.target.parentElement !== target.parentElement)
    ) {
      setUnitTarget(null);
      setComponentTarget(null);
      setTextTarget(null);
    } else {
      let current = e.target.classList.contains("textElement")
        ? e.target
        : target;

      // Traverse up the DOM tree to find the nearest <g class="unit"> element
      while (current && !current.classList.contains("unit")) {
        current = current.parentElement;
      }
      const unitID = current ? current.id : null;

      // Traverse up the DOM tree to find the nearest <g class="component"> element
      while (current && !current.classList.contains("component")) {
        current = current.parentElement;
      }
      const componentID = current ? current.id : null;

      // Traverse up the DOM tree to find the nearest <g class="page"> element
      while (current && !current.classList.contains("page")) {
        current = current.parentElement;
      }
      const pageID = current ? current.id : null;

      // If the snackbar asked the user to select another unit, add or remove the edge
      if (document.getElementById("edit-edge-snackbar")) {
        handleSnackbarClose();
        editEdge(
          document.getElementById("edit-edge-snackbar").dataset,
          unitID.slice(5),
        );
      } else if (e.target.classList.contains("textElement")) {
        updateInspector(unitID, componentID, pageID);
        setComponentTarget(null);
        setUnitTarget(null);
        setTextTarget(e.target);
      }
      // If the user double-clicked on a unit, open the component menu
      else if (e.detail === 2) {
        setUnitTarget(null);
        setTextTarget(null);
        updateInspector(unitID, componentID, pageID);
        setComponentTarget(target);
      }
      // Otherwise, open the unit menu
      else {
        setTextTarget(null);
        updateInspector(unitID, componentID, pageID);

        clearCurrentSelection();

        if (target?.tagName === "path") {
          const unitEl = getUnitElement(target);
          setUnitPathStroke(unitEl, "#4da3ff");
        } else if (target) {
          saveOriginalStroke(target);
          target.setAttribute("stroke", "#4da3ff");
        }

        setUnitTarget(target);
      }
    }
  };

  return (
    <React.Fragment>
      <ComponentEditor
        inspectorIndex={inspectorIndex}
        currentPage={currentPage}
        componentAnchorEl={componentTarget}
        setComponentAnchorEl={setComponentTarget}
      />
      <UnitEditor
        inspectorIndex={inspectorIndex}
        currentPage={currentPage}
        unitAnchorEl={unitTarget}
        setUnitAnchorEl={setUnitTarget}
        setEdgeTarget={setEdgeTarget}
      />
      <TextEditor
        inspectorIndex={inspectorIndex}
        currentPage={currentPage}
        textAnchorEl={textTarget}
        setTextAnchorEl={setTextTarget}
      />
      <Snackbar
        open={snackbarOpen}
        id={id}
        autoHideDuration={null}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "&.MuiSnackbar-root": { top: "150px" },
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={"info"}
          sx={{ width: "100%" }}
        >
          Select a second node by clicking on it.
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};
