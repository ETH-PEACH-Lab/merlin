import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  Tabs,
  Tab,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import parseText from "../../parser/parseText.mjs";
import reconstructDSL from "../../parser/reconstructor.mjs";

const nodeTypeOptions = [
  "text",
  "rect",
  "circle",
  "stacked",
  "flatten",
  "fullyConnected",
  "arrow",
  "trapezoid",
  "cuboid",
];

const nodeTypesWithShape = new Set([
  "rect",
  "stacked",
  "flatten",
  "cuboid",
  "fullyConnected",
]);

const createEmptyArchitecture = () => ({
  type: "architecture",
  name: "a",
  body: {
    blocks: [],
    diagram: {
      uses: [],
      connects: [],
    },
  },
  selectedEditor: 0, // UI-only
});

const selectedEditorStorageKey = "architecture-gui-selected-editor";
const tabStorageKey = "architecture-gui-tab";
const diagramTabStorageKey = "architecture-gui-diagram-tab";

const guiFontSx = {
  fontFamily: "inherit",
  fontSize: "0.875rem",
  fontWeight: 400,
  lineHeight: 1.43,
};

const inputSx = {
  "& .MuiInputBase-input": {
    color: "#e8e8e8",
    height: 16,
    py: 0.5,
    fontSize: "0.8rem",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.8rem",
  },
  "& .MuiOutlinedInput-notchedOutline legend": {
    fontSize: "0.6rem",
  },

  "& .MuiOutlinedInput-root": {
    backgroundColor: "#202020",
    minHeight: 34,
  },
};

const smallRemoveButtonSx = {
  minWidth: 34,
  width: 34,
  height: 34,
  p: 0,
  backgroundColor: "#6f7a82",
  color: "#fff",
  fontSize: 18,
};

const rowSx = {
  display: "grid",
  gridTemplateColumns: "34px minmax(140px, 1fr) minmax(120px, 0.7fr)",
  alignItems: "center",
  gap: 1,
};

const nodeRowWithShapeSx = {
  display: "grid",
  gridTemplateColumns:
    "34px minmax(130px, 1fr) minmax(120px, 0.65fr) minmax(120px, 0.65fr)",
  alignItems: "center",
  gap: 1,
};

const edgeRowSx = {
  display: "grid",
  gridTemplateColumns:
    "34px minmax(110px, 0.8fr) minmax(140px, 1fr) minmax(140px, 1fr)",
  alignItems: "center",
  gap: 1,
};

const groupRowSx = {
  display: "grid",
  gridTemplateColumns: "34px minmax(120px, 0.7fr) minmax(180px, 1fr)",
  alignItems: "center",
  gap: 1,
};

const diagramUseRowSx = {
  display: "grid",
  gridTemplateColumns: "34px minmax(90px, 0.6fr) minmax(130px, 1fr)",
  alignItems: "center",
  gap: 1,
};

const diagramConnectRowSx = {
  display: "grid",
  gridTemplateColumns: "34px minmax(160px, 1fr) minmax(160px, 1fr)",
  alignItems: "center",
  gap: 1,
};

const tabsSx = {
  minHeight: 36,
  "& .MuiTab-root": {
    ...guiFontSx,
    minHeight: 36,
    textTransform: "none",
    color: "#bdbdbd",
  },
};

const cloneArchitecture = (architecture) => ({
  ...architecture,
  body: {
    ...architecture.body,
    blocks: (architecture.body?.blocks || []).map((block) => ({
      ...block,
      nodes: [...(block.nodes || [])],
      edges: [...(block.edges || [])],
      groups: (block.groups || []).map((group) => ({
        ...group,
        members: [...(group.members || [])],
      })),
    })),
    ...(architecture.body?.diagram
      ? {
          diagram: {
            ...architecture.body.diagram,
            uses: [...(architecture.body.diagram.uses || [])],
            connects: [...(architecture.body.diagram.connects || [])],
          },
        }
      : {}),
  },
});

const asArray = (value) => {
  return Array.isArray(value) ? value : [value];
};

const getCommandIndex = (cmd) => cmd.args?.index;

const getCommandValue = (cmd) => cmd.args?.value;

const getBlock = (architecture, blockName) =>
  (architecture.body?.blocks || []).find(
    (block) => block.id?.name === blockName,
  );

const getUseIdsForBlock = (diagram, blockName) =>
  new Set(
    (diagram?.uses || [])
      .filter((use) => use.block?.name === blockName)
      .map((use) => use.id?.name)
      .filter(Boolean),
  );

const resolveEdgeNames = (block, rawValue) => {
  const values = asArray(rawValue);

  return values
    .map((value) => {
      if (typeof value === "number") {
        return block?.edges?.[value]?.id?.name;
      }

      return value;
    })
    .filter(Boolean);
};

const collectRelatedEdgeNames = (block, initialNames) => {
  const idsToRemove = new Set(initialNames);

  let changed = true;

  while (changed) {
    changed = false;

    for (const edge of block?.edges || []) {
      const edgeId = edge.id?.name;
      const fromEdge = edge.from?.edge?.name;
      const toEdge = edge.to?.edge?.name;

      if (
        edgeId &&
        !idsToRemove.has(edgeId) &&
        (idsToRemove.has(fromEdge) || idsToRemove.has(toEdge))
      ) {
        idsToRemove.add(edgeId);
        changed = true;
      }
    }
  }

  return idsToRemove;
};

const removeNodeReferences = (architecture, blockName, rawNodeNames) => {
  const body = architecture.body || {};
  const diagram = body.diagram;
  const nodeNamesToRemove = new Set(asArray(rawNodeNames).filter(Boolean));

  let edgeNamesToRemove = new Set();

  const nextBlocks = (body.blocks || []).map((block) => {
    if (block.id?.name !== blockName) return block;

    const directEdgeNames = (block.edges || [])
      .filter((edge) => {
        const fromNode = edge.from?.node?.name;
        const toNode = edge.to?.node?.name;

        return nodeNamesToRemove.has(fromNode) || nodeNamesToRemove.has(toNode);
      })
      .map((edge) => edge.id?.name)
      .filter(Boolean);

    edgeNamesToRemove = collectRelatedEdgeNames(block, directEdgeNames);

    return {
      ...block,

      nodes: (block.nodes || []).filter(
        (node) => !nodeNamesToRemove.has(node.id?.name),
      ),

      edges: (block.edges || []).filter(
        (edge) => !edgeNamesToRemove.has(edge.id?.name),
      ),

      groups: (block.groups || []).map((group) => ({
        ...group,
        members: (group.members || []).filter(
          (member) => !nodeNamesToRemove.has(member.name),
        ),
        ...(group.anchor?.name && nodeNamesToRemove.has(group.anchor.name)
          ? { anchor: undefined }
          : {}),
      })),
    };
  });

  if (!diagram) {
    return {
      ...architecture,
      body: {
        ...body,
        blocks: nextBlocks,
      },
    };
  }

  const useIdsForBlock = getUseIdsForBlock(diagram, blockName);

  const nextConnects = (diagram.connects || []).filter((connect) => {
    const fromUsesBlock = useIdsForBlock.has(connect.from?.block?.name);
    const toUsesBlock = useIdsForBlock.has(connect.to?.block?.name);

    const fromRemovedNode =
      fromUsesBlock && nodeNamesToRemove.has(connect.from?.node?.name);

    const toRemovedNode =
      toUsesBlock && nodeNamesToRemove.has(connect.to?.node?.name);

    const fromRemovedEdge =
      fromUsesBlock && edgeNamesToRemove.has(connect.from?.edge?.name);

    const toRemovedEdge =
      toUsesBlock && edgeNamesToRemove.has(connect.to?.edge?.name);

    return (
      !fromRemovedNode && !toRemovedNode && !fromRemovedEdge && !toRemovedEdge
    );
  });

  return {
    ...architecture,
    body: {
      ...body,
      blocks: nextBlocks,
      diagram: {
        ...diagram,
        connects: nextConnects,
      },
    },
  };
};

const removeEdgeReferences = (
  architecture,
  blockName,
  rawEdgeNamesOrIndexes,
) => {
  const body = architecture.body || {};
  const diagram = body.diagram;
  const targetBlock = getBlock(architecture, blockName);

  const initialEdgeNames = resolveEdgeNames(targetBlock, rawEdgeNamesOrIndexes);
  const finalEdgeNamesToRemove = collectRelatedEdgeNames(
    targetBlock,
    initialEdgeNames,
  );

  const nextBlocks = (body.blocks || []).map((block) => {
    if (block.id?.name !== blockName) return block;

    return {
      ...block,
      edges: (block.edges || []).filter(
        (edge) => !finalEdgeNamesToRemove.has(edge.id?.name),
      ),
    };
  });

  if (!diagram) {
    return {
      ...architecture,
      body: {
        ...body,
        blocks: nextBlocks,
      },
    };
  }

  const useIdsForBlock = getUseIdsForBlock(diagram, blockName);

  const nextConnects = (diagram.connects || []).filter((connect) => {
    const fromUsesBlock = useIdsForBlock.has(connect.from?.block?.name);
    const toUsesBlock = useIdsForBlock.has(connect.to?.block?.name);

    const fromRemovedEdge =
      fromUsesBlock && finalEdgeNamesToRemove.has(connect.from?.edge?.name);

    const toRemovedEdge =
      toUsesBlock && finalEdgeNamesToRemove.has(connect.to?.edge?.name);

    return !fromRemovedEdge && !toRemovedEdge;
  });

  return {
    ...architecture,
    body: {
      ...body,
      blocks: nextBlocks,
      diagram: {
        ...diagram,
        connects: nextConnects,
      },
    },
  };
};

const removeGroupReferences = (architecture, blockName, groupName) => {
  const body = architecture.body || {};
  const diagram = body.diagram;

  const nextBlocks = (body.blocks || []).map((block) => {
    if (block.id?.name !== blockName) return block;

    return {
      ...block,
      groups: (block.groups || []).filter(
        (group) => group.id?.name !== groupName,
      ),
    };
  });

  if (!diagram) {
    return {
      ...architecture,
      body: {
        ...body,
        blocks: nextBlocks,
      },
    };
  }

  const useIdsForBlock = getUseIdsForBlock(diagram, blockName);

  const nextConnects = (diagram.connects || []).filter((connect) => {
    const fromUsesBlock = useIdsForBlock.has(connect.from?.block?.name);
    const toUsesBlock = useIdsForBlock.has(connect.to?.block?.name);

    const fromRemovedGroup =
      fromUsesBlock && connect.from?.group?.name === groupName;

    const toRemovedGroup = toUsesBlock && connect.to?.group?.name === groupName;

    return !fromRemovedGroup && !toRemovedGroup;
  });

  return {
    ...architecture,
    body: {
      ...body,
      blocks: nextBlocks,
      diagram: {
        ...diagram,
        connects: nextConnects,
      },
    },
  };
};

const removeBlockReferences = (architecture, blockName) => {
  const body = architecture.body || {};
  const diagram = body.diagram;

  if (!diagram) {
    return {
      ...architecture,
      body: {
        ...body,
        blocks: (body.blocks || []).filter(
          (block) => block.id?.name !== blockName,
        ),
      },
    };
  }

  const removedUseIds = new Set(
    (diagram.uses || [])
      .filter((use) => use.block?.name === blockName)
      .map((use) => use.id?.name)
      .filter(Boolean),
  );

  return {
    ...architecture,
    body: {
      ...body,
      blocks: (body.blocks || []).filter(
        (block) => block.id?.name !== blockName,
      ),
      diagram: {
        ...diagram,
        uses: (diagram.uses || []).filter(
          (use) => use.block?.name !== blockName,
        ),
        connects: (diagram.connects || []).filter(
          (connect) =>
            !removedUseIds.has(connect.from?.block?.name) &&
            !removedUseIds.has(connect.to?.block?.name),
        ),
      },
    },
  };
};

const setNodeHidden = (architecture, blockName, nodeName, hidden) => {
  const body = architecture.body || {};
  const diagram = body.diagram;
  const nodeNames = new Set([nodeName].filter(Boolean));
  let relatedEdgeNames = new Set();

  const nextBlocks = (body.blocks || []).map((block) => {
    if (block.id?.name !== blockName) return block;

    const directEdgeNames = (block.edges || [])
      .filter((edge) => {
        const from = edge.from?.node?.name;
        const to = edge.to?.node?.name;

        return nodeNames.has(from) || nodeNames.has(to);
      })
      .map((edge) => edge.id?.name)
      .filter(Boolean);

    relatedEdgeNames = collectRelatedEdgeNames(block, directEdgeNames);

    return {
      ...block,

      nodes: (block.nodes || []).map((node) =>
        nodeNames.has(node.id?.name)
          ? hidden
            ? { ...node, hidden: true }
            : (() => {
                const { hidden: _hidden, ...rest } = node;
                return rest;
              })()
          : node,
      ),

      edges: (block.edges || []).map((edge) =>
        relatedEdgeNames.has(edge.id?.name)
          ? hidden
            ? { ...edge, hidden: true }
            : (() => {
                const { hidden: _hidden, ...rest } = edge;
                return rest;
              })()
          : edge,
      ),

      groups: (block.groups || []).map((group) => ({
        ...group,
        members: (group.members || []).map((member) =>
          nodeNames.has(member.name)
            ? hidden
              ? { ...member, hidden: true }
              : (() => {
                  const { hidden: _hidden, ...rest } = member;
                  return rest;
                })()
            : member,
        ),
      })),
    };
  });

  if (!diagram) {
    return {
      ...architecture,
      body: {
        ...body,
        blocks: nextBlocks,
      },
    };
  }

  const useIdsForBlock = getUseIdsForBlock(diagram, blockName);

  const nextConnects = (diagram.connects || []).map((connect) => {
    const fromUsesBlock = useIdsForBlock.has(connect.from?.block?.name);
    const toUsesBlock = useIdsForBlock.has(connect.to?.block?.name);

    const affected =
      (fromUsesBlock && nodeNames.has(connect.from?.node?.name)) ||
      (toUsesBlock && nodeNames.has(connect.to?.node?.name)) ||
      (fromUsesBlock && relatedEdgeNames.has(connect.from?.edge?.name)) ||
      (toUsesBlock && relatedEdgeNames.has(connect.to?.edge?.name));

    if (!affected) return connect;

    if (hidden) return { ...connect, hidden: true };

    const { hidden: _hidden, ...rest } = connect;
    return rest;
  });

  return {
    ...architecture,
    body: {
      ...body,
      blocks: nextBlocks,
      diagram: {
        ...diagram,
        connects: nextConnects,
      },
    },
  };
};

const setEdgeHidden = (architecture, blockName, rawEdgeName, hidden) => {
  const body = architecture.body || {};
  const diagram = body.diagram;
  const targetBlock = getBlock(architecture, blockName);

  const edgeNames = resolveEdgeNames(targetBlock, rawEdgeName);
  const relatedEdgeNames = collectRelatedEdgeNames(targetBlock, edgeNames);

  const nextBlocks = (body.blocks || []).map((block) => {
    if (block.id?.name !== blockName) return block;

    return {
      ...block,
      edges: (block.edges || []).map((edge) =>
        relatedEdgeNames.has(edge.id?.name)
          ? hidden
            ? { ...edge, hidden: true }
            : (() => {
                const { hidden: _hidden, ...rest } = edge;
                return rest;
              })()
          : edge,
      ),
    };
  });

  if (!diagram) {
    return {
      ...architecture,
      body: {
        ...body,
        blocks: nextBlocks,
      },
    };
  }

  const useIdsForBlock = getUseIdsForBlock(diagram, blockName);

  const nextConnects = (diagram.connects || []).map((connect) => {
    const fromUsesBlock = useIdsForBlock.has(connect.from?.block?.name);
    const toUsesBlock = useIdsForBlock.has(connect.to?.block?.name);

    const affected =
      (fromUsesBlock && relatedEdgeNames.has(connect.from?.edge?.name)) ||
      (toUsesBlock && relatedEdgeNames.has(connect.to?.edge?.name));

    if (!affected) return connect;

    if (hidden) return { ...connect, hidden: true };

    const { hidden: _hidden, ...rest } = connect;
    return rest;
  });

  return {
    ...architecture,
    body: {
      ...body,
      blocks: nextBlocks,
      diagram: {
        ...diagram,
        connects: nextConnects,
      },
    },
  };
};

const setBlockHidden = (architecture, blockName, hidden) => {
  const body = architecture.body || {};
  const diagram = body.diagram;

  const nextBlocks = (body.blocks || []).map((block) => {
    if (block.id?.name !== blockName) return block;

    if (hidden) return { ...block, hidden: true };

    const { hidden: _hidden, ...rest } = block;
    return rest;
  });

  if (!diagram) {
    return {
      ...architecture,
      body: {
        ...body,
        blocks: nextBlocks,
      },
    };
  }

  const useIdsForBlock = getUseIdsForBlock(diagram, blockName);

  const nextUses = (diagram.uses || []).map((use) => {
    if (use.block?.name !== blockName) return use;

    if (hidden) return { ...use, hidden: true };

    const { hidden: _hidden, ...rest } = use;
    return rest;
  });

  const nextConnects = (diagram.connects || []).map((connect) => {
    const affected =
      useIdsForBlock.has(connect.from?.block?.name) ||
      useIdsForBlock.has(connect.to?.block?.name);

    if (!affected) return connect;

    if (hidden) return { ...connect, hidden: true };

    const { hidden: _hidden, ...rest } = connect;
    return rest;
  });

  return {
    ...architecture,
    body: {
      ...body,
      blocks: nextBlocks,
      diagram: {
        ...diagram,
        uses: nextUses,
        connects: nextConnects,
      },
    },
  };
};

const applyArchitectureCommands = (architectureDef, cmds = []) => {
  let architecture = cloneArchitecture(architectureDef);
  const architectureName = architecture.name;

  const architectureCommands = (cmds || []).filter(
    (cmd) => cmd?.name === architectureName,
  );

  for (const cmd of architectureCommands) {
    switch (cmd.type) {
      case "block_remove_nodes": {
        architecture = removeNodeReferences(
          architecture,
          getCommandIndex(cmd),
          getCommandValue(cmd),
        );
        break;
      }

      case "block_remove_node": {
        architecture = removeNodeReferences(
          architecture,
          getCommandIndex(cmd),
          getCommandValue(cmd),
        );
        break;
      }

      case "block_remove_edges": {
        architecture = removeEdgeReferences(
          architecture,
          getCommandIndex(cmd),
          getCommandValue(cmd),
        );
        break;
      }

      case "block_remove_edge": {
        architecture = removeEdgeReferences(
          architecture,
          getCommandIndex(cmd),
          getCommandValue(cmd),
        );
        break;
      }

      case "block_remove_group": {
        architecture = removeGroupReferences(
          architecture,
          getCommandIndex(cmd),
          getCommandValue(cmd),
        );
        break;
      }

      case "block_remove_block": {
        architecture = removeBlockReferences(architecture, cmd.args);
        break;
      }

      case "hide_node": {
        architecture = setNodeHidden(
          architecture,
          getCommandIndex(cmd),
          getCommandValue(cmd),
          true,
        );
        break;
      }

      case "show_node": {
        architecture = setNodeHidden(
          architecture,
          getCommandIndex(cmd),
          getCommandValue(cmd),
          false,
        );
        break;
      }

      case "hide_edge": {
        architecture = setEdgeHidden(
          architecture,
          getCommandIndex(cmd),
          getCommandValue(cmd),
          true,
        );
        break;
      }

      case "show_edge": {
        architecture = setEdgeHidden(
          architecture,
          getCommandIndex(cmd),
          getCommandValue(cmd),
          false,
        );
        break;
      }

      case "hide_block": {
        architecture = setBlockHidden(architecture, cmd.args, true);
        break;
      }

      case "show_block": {
        architecture = setBlockHidden(architecture, cmd.args, false);
        break;
      }

      default:
        break;
    }
  }

  return architecture;
};

const ArchitectureGuiPanel = ({ value, onChange }) => {
  const [draftInputs, setDraftInputs] = useState({});
  const [architecture, setArchitecture] = useState(createEmptyArchitecture);
  const [tab, setTab] = useState(0);
  const [diagramTab, setDiagramTab] = useState(0);
  const [parsedDSL, setParsedDSL] = useState(null);

  const isGuiEditingRef = useRef(false);

  const commitTimerRef = useRef(null);

  const nodeRenameRef = useRef({
    blockIndex: null,
    nodeIndex: null,
    oldId: null,
    baseArchitecture: null,
  });

  const edgeRenameRef = useRef({
    blockIndex: null,
    edgeIndex: null,
    oldId: null,
    baseArchitecture: null,
  });

  const groupRenameRef = useRef({
    blockIndex: null,
    groupIndex: null,
    oldId: null,
    baseArchitecture: null,
  });

  const latestArchitectureRef = useRef(architecture);

  const latestDraftInputsRef = useRef({});

  const normalizeArchitectureDef = (architectureDef) => ({
    ...architectureDef,
    body: {
      ...architectureDef.body,
      blocks: architectureDef.body?.blocks || [],
      ...(architectureDef.body?.diagram
        ? {
            diagram: {
              ...architectureDef.body.diagram,
              uses: architectureDef.body.diagram.uses || [],
              connects: architectureDef.body.diagram.connects || [],
            },
          }
        : {}),
    },
  });

  useEffect(() => {
    latestDraftInputsRef.current = draftInputs;
  }, [draftInputs]);

  useEffect(() => {
    latestArchitectureRef.current = architecture;
  }, [architecture]);

  useEffect(() => {
    return () => {
      clearTimeout(commitTimerRef.current);
    };
  }, []);

  const restoreSelectedEditor = (parsedArchitecture) => {
    const savedSelectedEditor = localStorage.getItem(selectedEditorStorageKey);
    const blocks = parsedArchitecture.body?.blocks || [];

    if (savedSelectedEditor === "diagram") {
      return {
        ...parsedArchitecture,
        selectedEditor: blocks.length > 1 ? "diagram" : 0,
      };
    }

    if (savedSelectedEditor?.startsWith("block:")) {
      const savedBlockName = savedSelectedEditor.replace("block:", "");

      const blockIndex = blocks.findIndex(
        (block) => block.id?.name === savedBlockName,
      );

      return {
        ...parsedArchitecture,
        selectedEditor: blockIndex >= 0 ? blockIndex : 0,
      };
    }

    return {
      ...parsedArchitecture,
      selectedEditor: 0,
    };
  };

  useEffect(() => {
    if (isGuiEditingRef.current) {
      isGuiEditingRef.current = false;
      return;
    }

    if (!value || typeof value !== "string") return;

    try {
      const nextParsedDSL = parseText(value);
      const architectureDef =
        nextParsedDSL?.defs?.find((def) => def.type === "architecture") || null;

      if (!architectureDef) return;

      const baseArchitecture = normalizeArchitectureDef(architectureDef);

      const architectureWithCommands = applyArchitectureCommands(
        baseArchitecture,
        nextParsedDSL.cmds || [],
      );

      const restoredArchitecture = restoreSelectedEditor(
        architectureWithCommands,
      );

      setParsedDSL(nextParsedDSL);
      setArchitecture(restoredArchitecture);

      setTab(restoreNumber(tabStorageKey, 0));
      setDiagramTab(restoreNumber(diagramTabStorageKey, 0));
    } catch (error) {
      console.error("Failed to parse architecture DSL:", error);
    }
  }, [value]);

  const makeDraftKey = (...parts) => parts.join(":");

  const getDraftValue = (key, fallback) => {
    return Object.prototype.hasOwnProperty.call(draftInputs, key)
      ? draftInputs[key]
      : fallback;
  };

  const startDraftInput = (key, value) => {
    setDraftInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const changeDraftInput = (key, value) => {
    setDraftInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateArchitectureAst = (nextArchitecture) => {
    if (!parsedDSL) return;

    const architectureIndex = parsedDSL.defs.findIndex(
      (def) => def.type === "architecture",
    );

    if (architectureIndex < 0) return;

    const oldArchitectureName = parsedDSL.defs[architectureIndex]?.name;
    const newArchitectureName = nextArchitecture.name;

    const stripArchitectureUiState = (architectureDef) => {
      const { selectedEditor, ...cleanArchitecture } = architectureDef;
      return cleanArchitecture;
    };

    const cleanArchitecture = stripArchitectureUiState(nextArchitecture);

    const nextParsedDSL = {
      ...parsedDSL,

      defs: parsedDSL.defs.map((def, index) =>
        index === architectureIndex ? cleanArchitecture : def,
      ),

      cmds: (parsedDSL.cmds || []).map((cmd) => {
        if (cmd.type === "show" && cmd.value === oldArchitectureName) {
          return {
            ...cmd,
            value: newArchitectureName,
          };
        }

        return cmd;
      }),
    };

    const nextCode = reconstructDSL(nextParsedDSL);

    isGuiEditingRef.current = true;
    setParsedDSL(nextParsedDSL);
    setArchitecture(nextArchitecture);
    onChange(nextCode);
  };

  const appendArchitectureCommand = (command, nextArchitecture = null) => {
    if (!parsedDSL) return;

    const nextParsedDSL = {
      ...parsedDSL,
      cmds: [...(parsedDSL.cmds || []), command],
    };

    const nextCode = reconstructDSL(nextParsedDSL);

    isGuiEditingRef.current = true;
    setParsedDSL(nextParsedDSL);

    if (nextArchitecture) {
      setArchitecture(nextArchitecture);
      latestArchitectureRef.current = nextArchitecture;
    }

    onChange(nextCode);
  };

  const finishDraftInput = (key) => {
    clearTimeout(commitTimerRef.current);

    const latestArchitecture = latestArchitectureRef.current;
    updateArchitectureAst(latestArchitecture);

    setDraftInputs((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const blocks = architecture.body?.blocks || [];

  const diagram = {
    ...(architecture.body?.diagram || {}),
    uses: architecture.body?.diagram?.uses || [],
    connects: architecture.body?.diagram?.connects || [],
  };

  const selectedBlock =
    typeof architecture.selectedEditor === "number"
      ? blocks[architecture.selectedEditor] || null
      : null;

  const restoreNumber = (key, fallback = 0) => {
    const saved = Number(localStorage.getItem(key));

    return Number.isInteger(saved) && saved >= 0 ? saved : fallback;
  };

  const updateArchitectureAstDebounced = (nextArchitecture, delay = 500) => {
    clearTimeout(commitTimerRef.current);

    latestArchitectureRef.current = nextArchitecture;
    setArchitecture(nextArchitecture);

    commitTimerRef.current = setTimeout(() => {
      updateArchitectureAst(nextArchitecture);
    }, delay);
  };

  const saveSelectedEditor = (selectedEditor, blocks) => {
    const serializeSelectedEditor = (selectedEditor, blocks) => {
      if (selectedEditor === "diagram") return "diagram";

      if (typeof selectedEditor === "number") {
        const blockName = blocks[selectedEditor]?.id?.name;

        return blockName ? `block:${blockName}` : "block-index:0";
      }

      return "block-index:0";
    };

    localStorage.setItem(
      selectedEditorStorageKey,
      serializeSelectedEditor(selectedEditor, blocks),
    );
  };

  const updateArchitectureName = (nextName) => {
    updateArchitectureAst({
      ...architecture,
      name: nextName,
    });
  };

  const removeSelectedBlock = () => {
    if (!selectedBlock) return;

    clearTimeout(commitTimerRef.current);

    const removedBlockName = selectedBlock.id?.name;

    const nextBlocks = blocks.filter(
      (_, index) => index !== architecture.selectedEditor,
    );

    saveSelectedEditor(0, nextBlocks);

    const nextBody = {
      ...architecture.body,
      blocks: nextBlocks,
    };

    if (
      architecture.body?.diagram !== undefined &&
      architecture.body?.diagram !== null
    ) {
      const removedUseIds = new Set(
        (diagram.uses || [])
          .filter((use) => use.block?.name === removedBlockName)
          .map((use) => use.id?.name)
          .filter(Boolean),
      );

      const nextUses = (diagram.uses || []).filter(
        (use) => use.block?.name !== removedBlockName,
      );

      const nextConnects = (diagram.connects || []).filter((connect) => {
        const fromUseId = connect.from?.block?.name;
        const toUseId = connect.to?.block?.name;

        return !removedUseIds.has(fromUseId) && !removedUseIds.has(toUseId);
      });

      nextBody.diagram = {
        ...diagram,
        uses: nextUses,
        connects: nextConnects,
      };
    }

    nodeRenameRef.current = {
      blockIndex: null,
      nodeIndex: null,
      oldId: null,
      baseArchitecture: null,
    };

    edgeRenameRef.current = {
      blockIndex: null,
      edgeIndex: null,
      oldId: null,
      baseArchitecture: null,
    };

    groupRenameRef.current = {
      blockIndex: null,
      groupIndex: null,
      oldId: null,
      baseArchitecture: null,
    };

    setDraftInputs({});

    updateArchitectureAst({
      ...architecture,
      selectedEditor: 0,
      body: nextBody,
    });
  };

  const parseShapeForAst = (value, type) => {
    const text = String(value || "").trim();
    if (!text) return undefined;

    if (type === "rect") {
      return text;
    }

    if (type === "flatten") {
      const values = text.split("x").map((item) => Number(item.trim()));
      return values.length === 2 && values.every(Number.isFinite)
        ? values
        : undefined;
    }

    if (type === "stacked" || type === "cuboid") {
      const values = text.split("x").map((item) => Number(item.trim()));
      return values.length === 3 && values.every(Number.isFinite)
        ? values
        : undefined;
    }

    if (type === "fullyConnected") {
      const values = text
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split(",")
        .map((item) => Number(item.trim()));

      return values.length > 0 && values.every(Number.isFinite)
        ? values
        : undefined;
    }

    return text;
  };

  const formatShapeForInput = (shape, type) => {
    if (shape === undefined || shape === null || shape === "") return "";

    if (type === "flatten") {
      if (!Array.isArray(shape)) return String(shape);
      return `${shape?.[0] ?? ""}x${shape?.[1] ?? ""}`;
    }

    if (type === "stacked" || type === "cuboid") {
      if (!Array.isArray(shape)) return String(shape);
      return `${shape?.[0] ?? ""}x${shape?.[1] ?? ""}x${shape?.[2] ?? ""}`;
    }

    if (type === "fullyConnected") {
      if (Array.isArray(shape)) {
        return `[${shape.join(", ")}]`;
      }

      return String(shape);
    }

    return String(shape);
  };

  const getShapePlaceholder = (type) => {
    if (type === "flatten") return "15x15";

    if (type === "stacked" || type === "cuboid") return "40x20x10";

    if (type === "fullyConnected") return "[15, 2, 15]";

    return "";
  };

  const updateNode = (nodeIndex, key, nextValue, options = {}) => {
    if (!selectedBlock) return;

    const oldNode = selectedBlock.nodes?.[nodeIndex];

    const isNodeIdRename = key === "id";

    const isActiveNodeRename =
      isNodeIdRename &&
      nodeRenameRef.current.blockIndex === architecture.selectedEditor &&
      nodeRenameRef.current.nodeIndex === nodeIndex;

    const sourceArchitecture =
      isActiveNodeRename && nodeRenameRef.current.baseArchitecture
        ? nodeRenameRef.current.baseArchitecture
        : architecture;

    const sourceBlocks = sourceArchitecture.body?.blocks || [];

    const sourceDiagram = {
      ...(sourceArchitecture.body?.diagram || {}),
      uses: sourceArchitecture.body?.diagram?.uses || [],
      connects: sourceArchitecture.body?.diagram?.connects || [],
    };

    const sourceSelectedBlock =
      typeof sourceArchitecture.selectedEditor === "number"
        ? sourceBlocks[sourceArchitecture.selectedEditor] || selectedBlock
        : selectedBlock;

    const oldNodeId = isActiveNodeRename
      ? nodeRenameRef.current.oldId
      : oldNode?.id?.name;

    const nextNodeId = String(nextValue ?? "");
    const selectedBlockName = sourceSelectedBlock?.id?.name;

    const renameNodeEndpoint = (endpoint, oldId, newId) => {
      if (!endpoint?.node || endpoint.node.name !== oldId) return endpoint;

      return {
        ...endpoint,
        node: {
          ...endpoint.node,
          name: newId,
        },
      };
    };

    const renameNodeInMembers = (members = [], oldId, newId) => {
      return members.map((member) =>
        member?.name === oldId
          ? {
              ...member,
              name: newId,
            }
          : member,
      );
    };

    const useIdsForSelectedBlock = new Set(
      (sourceDiagram.uses || [])
        .filter((use) => use.block?.name === selectedBlockName)
        .map((use) => use.id?.name)
        .filter(Boolean),
    );
    const renameNodeInDiagramConnects = (connects = [], oldId, newId) => {
      return connects.map((connect) => {
        const fromUsesSelectedBlock = useIdsForSelectedBlock.has(
          connect.from?.block?.name,
        );

        const toUsesSelectedBlock = useIdsForSelectedBlock.has(
          connect.to?.block?.name,
        );

        return {
          ...connect,
          from: fromUsesSelectedBlock
            ? renameNodeEndpoint(connect.from, oldId, newId)
            : connect.from,
          to: toUsesSelectedBlock
            ? renameNodeEndpoint(connect.to, oldId, newId)
            : connect.to,
        };
      });
    };

    const nextBlocks = sourceBlocks.map((block, blockIndex) => {
      if (blockIndex !== architecture.selectedEditor) return block;

      const nextNodes = (block.nodes || []).map((node, index) => {
        if (index !== nodeIndex) return node;

        if (key === "id") {
          return {
            ...node,
            id: {
              ...node.id,
              name: nextNodeId,
            },
          };
        }

        if (key === "type") {
          return {
            ...node,
            type: nextValue,
            shape: undefined,
          };
        }

        if (key === "shape") {
          return {
            ...node,
            shape: parseShapeForAst(nextValue, node.type),
          };
        }

        return {
          ...node,
          [key]: nextValue,
        };
      });

      let nextEdges = block.edges || [];
      let nextGroups = block.groups || [];

      if (key === "id" && oldNodeId !== undefined && oldNodeId !== nextNodeId) {
        nextEdges = nextEdges.map((edge) => ({
          ...edge,
          from: renameNodeEndpoint(edge.from, oldNodeId, nextNodeId),
          to: renameNodeEndpoint(edge.to, oldNodeId, nextNodeId),
        }));

        nextGroups = nextGroups.map((group) => ({
          ...group,
          members: renameNodeInMembers(
            group.members || [],
            oldNodeId,
            nextNodeId,
          ),
        }));
      }

      return {
        ...block,
        nodes: nextNodes,
        edges: nextEdges,
        groups: nextGroups,
      };
    });

    const nextDiagram =
      key === "id" && oldNodeId !== undefined && oldNodeId !== nextNodeId
        ? {
            ...sourceDiagram,
            uses: sourceDiagram.uses || [],
            connects: renameNodeInDiagramConnects(
              sourceDiagram.connects || [],
              oldNodeId,
              nextNodeId,
            ),
          }
        : diagram;

    const nextArchitecture = {
      ...architecture,
      body: {
        ...architecture.body,
        blocks: nextBlocks,
        ...(architecture.body?.diagram ? { diagram: nextDiagram } : {}),
      },
    };

    if (options.debounce) {
      updateArchitectureAstDebounced(nextArchitecture, 500);
    } else {
      updateArchitectureAst(nextArchitecture);
    }
  };

  const removeNode = (nodeIndex) => {
    if (!selectedBlock) return;

    clearTimeout(commitTimerRef.current);

    const architectureName = architecture.name;
    const blockName = selectedBlock.id?.name;
    const nodeName = selectedBlock.nodes?.[nodeIndex]?.id?.name;

    if (!architectureName || !blockName || !nodeName) return;

    const nextArchitecture = removeNodeReferences(
      architecture,
      blockName,
      nodeName,
    );

    appendArchitectureCommand(
      {
        type: "block_remove_node",
        name: architectureName,
        args: {
          index: blockName,
          value: nodeName,
        },
      },
      nextArchitecture,
    );
  };

  const removeEdge = (edgeIndex) => {
    if (!selectedBlock) return;

    clearTimeout(commitTimerRef.current);

    const architectureName = architecture.name;
    const blockName = selectedBlock.id?.name;
    const edgeName = selectedBlock.edges?.[edgeIndex]?.id?.name;

    if (!architectureName || !blockName || !edgeName) return;

    const nextArchitecture = removeEdgeReferences(
      architecture,
      blockName,
      edgeName,
    );

    appendArchitectureCommand(
      {
        type: "block_remove_edge",
        name: architectureName,
        args: {
          index: blockName,
          value: edgeName,
        },
      },
      nextArchitecture,
    );
  };

  const removeGroup = (groupIndex) => {
    if (!selectedBlock) return;

    clearTimeout(commitTimerRef.current);

    const architectureName = architecture.name;
    const blockName = selectedBlock.id?.name;
    const groupName = selectedBlock.groups?.[groupIndex]?.id?.name;

    if (!architectureName || !blockName || !groupName) return;

    const nextArchitecture = removeGroupReferences(
      architecture,
      blockName,
      groupName,
    );

    appendArchitectureCommand(
      {
        type: "block_remove_group",
        name: architectureName,
        args: {
          index: blockName,
          value: groupName,
        },
      },
      nextArchitecture,
    );
  };

  const parseEndpointForAst = (value) => {
    const text = String(value || "").trim();
    const match = text.match(
      /^([A-Za-z_][A-Za-z0-9_]*)(?:\.([A-Za-z_][A-Za-z0-9_]*))?/,
    );

    if (!match) {
      return {
        node: { name: "" },
        nodeAnchor: "right",
        portIndex: null,
      };
    }

    const name = match[1];
    const anchor = match[2] || "right";

    const isEdgeRef = (selectedBlock?.edges || []).some(
      (edge) => edge.id?.name === name,
    );

    if (isEdgeRef) {
      return {
        edge: { name },
        edgeAnchor: anchor,
      };
    }

    return {
      node: { name },
      nodeAnchor: anchor,
      portIndex: null,
    };
  };

  const formatEndpointForInput = (endpoint) => {
    if (!endpoint) return "";

    if (endpoint.node?.name) {
      return `${endpoint.node.name}.${endpoint.nodeAnchor || ""}`;
    }

    if (endpoint.edge?.name) {
      return `${endpoint.edge.name}.${endpoint.edgeAnchor || ""}`;
    }

    return "";
  };

  const updateEdge = (edgeIndex, key, nextValue, options = {}) => {
    if (!selectedBlock) return;

    const isEdgeIdRename = key === "id";

    const isActiveEdgeRename =
      isEdgeIdRename &&
      edgeRenameRef.current.blockIndex === architecture.selectedEditor &&
      edgeRenameRef.current.edgeIndex === edgeIndex;

    const sourceArchitecture =
      isActiveEdgeRename && edgeRenameRef.current.baseArchitecture
        ? edgeRenameRef.current.baseArchitecture
        : architecture;

    const sourceBlocks = sourceArchitecture.body?.blocks || [];

    const sourceSelectedBlock =
      typeof sourceArchitecture.selectedEditor === "number"
        ? sourceBlocks[sourceArchitecture.selectedEditor] || selectedBlock
        : selectedBlock;

    const oldEdge = sourceSelectedBlock.edges?.[edgeIndex];

    const oldEdgeId = isActiveEdgeRename
      ? edgeRenameRef.current.oldId
      : oldEdge?.id?.name;

    const nextEdgeId = String(nextValue ?? "");

    const renameEdgeEndpoint = (endpoint, oldId, newId) => {
      if (!endpoint?.edge || endpoint.edge.name !== oldId) return endpoint;

      return {
        ...endpoint,
        edge: {
          ...endpoint.edge,
          name: newId,
        },
      };
    };

    const nextBlocks = sourceBlocks.map((block, blockIndex) => {
      if (blockIndex !== architecture.selectedEditor) return block;

      let nextEdges = (block.edges || []).map((edge, index) => {
        if (index !== edgeIndex) return edge;

        if (key === "id") {
          return {
            ...edge,
            id: {
              ...edge.id,
              name: nextEdgeId,
            },
          };
        }

        if (key === "from") {
          return {
            ...edge,
            from: parseEndpointForAst(nextValue),
          };
        }

        if (key === "to") {
          return {
            ...edge,
            to: parseEndpointForAst(nextValue),
          };
        }

        return {
          ...edge,
          [key]: nextValue,
        };
      });

      if (key === "id" && oldEdgeId !== undefined && oldEdgeId !== nextEdgeId) {
        nextEdges = nextEdges.map((edge) => ({
          ...edge,
          from: renameEdgeEndpoint(edge.from, oldEdgeId, nextEdgeId),
          to: renameEdgeEndpoint(edge.to, oldEdgeId, nextEdgeId),
        }));
      }

      return {
        ...block,
        edges: nextEdges,
      };
    });

    const nextArchitecture = {
      ...sourceArchitecture,
      body: {
        ...sourceArchitecture.body,
        blocks: nextBlocks,
      },
    };

    if (options.debounce) {
      updateArchitectureAstDebounced(nextArchitecture, 500);
    } else {
      updateArchitectureAst(nextArchitecture);
    }
  };

  const formatMembersForInput = (members = []) => {
    if (!members.length) return "";
    return `[${members.map((member) => member.name).join(",")}]`;
  };

  const updateGroup = (groupIndex, key, nextValue, options = {}) => {
    if (!selectedBlock) return;

    const isGroupIdRename = key === "id";

    const isActiveGroupRename =
      isGroupIdRename &&
      groupRenameRef.current.blockIndex === architecture.selectedEditor &&
      groupRenameRef.current.groupIndex === groupIndex;

    const sourceArchitecture =
      isActiveGroupRename && groupRenameRef.current.baseArchitecture
        ? groupRenameRef.current.baseArchitecture
        : architecture;

    const sourceBlocks = sourceArchitecture.body?.blocks || [];

    const sourceSelectedBlock =
      typeof sourceArchitecture.selectedEditor === "number"
        ? sourceBlocks[sourceArchitecture.selectedEditor] || selectedBlock
        : selectedBlock;

    const oldGroup = sourceSelectedBlock.groups?.[groupIndex];

    const oldGroupId = isActiveGroupRename
      ? groupRenameRef.current.oldId
      : oldGroup?.id?.name;

    const nextGroupId = String(nextValue ?? "");

    const renameGroupReferenceInMembers = (members = [], oldId, newId) => {
      return members.map((member) =>
        member?.name === oldId
          ? {
              ...member,
              name: newId,
            }
          : member,
      );
    };

    const sourceDiagram = {
      ...(sourceArchitecture.body?.diagram || {}),
      uses: sourceArchitecture.body?.diagram?.uses || [],
      connects: sourceArchitecture.body?.diagram?.connects || [],
    };

    const selectedBlockName = sourceSelectedBlock?.id?.name;

    const useIdsForSelectedBlock = new Set(
      (sourceDiagram.uses || [])
        .filter((use) => use.block?.name === selectedBlockName)
        .map((use) => use.id?.name)
        .filter(Boolean),
    );

    const renameGroupEndpoint = (endpoint, oldId, newId) => {
      if (endpoint?.group?.name === oldId) {
        return {
          ...endpoint,
          group: {
            ...endpoint.group,
            name: newId,
          },
        };
      }

      return endpoint;
    };

    const renameGroupInDiagramConnects = (connects = [], oldId, newId) => {
      return connects.map((connect) => {
        const fromUsesSelectedBlock = useIdsForSelectedBlock.has(
          connect.from?.block?.name,
        );

        const toUsesSelectedBlock = useIdsForSelectedBlock.has(
          connect.to?.block?.name,
        );

        return {
          ...connect,
          from: fromUsesSelectedBlock
            ? renameGroupEndpoint(connect.from, oldId, newId)
            : connect.from,
          to: toUsesSelectedBlock
            ? renameGroupEndpoint(connect.to, oldId, newId)
            : connect.to,
        };
      });
    };

    const nextBlocks = sourceBlocks.map((block, blockIndex) => {
      if (blockIndex !== architecture.selectedEditor) return block;

      const nextGroups = (block.groups || []).map((group, index) => {
        const isEditedGroup = index === groupIndex;

        if (isEditedGroup) {
          if (key === "id") {
            return {
              ...group,
              id: {
                ...group.id,
                name: nextGroupId,
              },
            };
          }

          if (key === "members") {
            return {
              ...group,
              members: String(nextValue || "")
                .trim()
                .replace(/^\[/, "")
                .replace(/\]$/, "")
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .map((name) => ({ name })),
            };
          }

          return {
            ...group,
            [key]: nextValue,
          };
        }

        if (
          key === "id" &&
          oldGroupId !== undefined &&
          oldGroupId !== nextGroupId
        ) {
          return {
            ...group,
            members: renameGroupReferenceInMembers(
              group.members || [],
              oldGroupId,
              nextGroupId,
            ),
          };
        }

        return group;
      });

      return {
        ...block,
        groups: nextGroups,
      };
    });

    const nextDiagram =
      key === "id" && oldGroupId !== undefined && oldGroupId !== nextGroupId
        ? {
            ...sourceDiagram,
            uses: sourceDiagram.uses || [],
            connects: renameGroupInDiagramConnects(
              sourceDiagram.connects || [],
              oldGroupId,
              nextGroupId,
            ),
          }
        : sourceDiagram;

    const nextArchitecture = {
      ...sourceArchitecture,
      body: {
        ...sourceArchitecture.body,
        blocks: nextBlocks,
        ...(sourceArchitecture.body?.diagram ? { diagram: nextDiagram } : {}),
      },
    };

    if (options.debounce) {
      updateArchitectureAstDebounced(nextArchitecture, 500);
    } else {
      updateArchitectureAst(nextArchitecture);
    }
  };

  const updateDiagramUse = (useIndex, key, nextValue) => {
    const oldUse = diagram.uses?.[useIndex];
    const oldUseId = oldUse?.id?.name;
    const nextUseId = String(nextValue ?? "");

    const updateDiagramConnectUseId = (endpoint, oldUseId, nextUseId) => {
      if (endpoint?.block?.name !== oldUseId) return endpoint;

      return {
        ...endpoint,
        block: {
          ...endpoint.block,
          name: nextUseId,
        },
      };
    };

    const nextUses = (diagram.uses || []).map((use, index) => {
      if (index !== useIndex) return use;

      if (key === "id") {
        return {
          ...use,
          id: {
            ...use.id,
            name: nextUseId,
          },
        };
      }

      if (key === "block") {
        return {
          ...use,
          block: {
            ...use.block,
            name: String(nextValue ?? ""),
          },
        };
      }

      return {
        ...use,
        [key]: nextValue,
      };
    });

    const nextConnects =
      key === "id" && oldUseId !== undefined
        ? (diagram.connects || []).map((connect) => ({
            ...connect,
            from: updateDiagramConnectUseId(connect.from, oldUseId, nextUseId),
            to: updateDiagramConnectUseId(connect.to, oldUseId, nextUseId),
          }))
        : diagram.connects || [];

    updateArchitectureAst({
      ...architecture,
      body: {
        ...architecture.body,
        diagram: {
          ...diagram,
          uses: nextUses,
          connects: nextConnects,
        },
      },
    });
  };

  const removeDiagramUse = (useIndex) => {
    const removedUseId = diagram.uses?.[useIndex]?.id?.name;

    updateArchitectureAst({
      ...architecture,
      body: {
        ...architecture.body,
        diagram: {
          ...diagram,
          uses: (diagram.uses || []).filter((_, index) => index !== useIndex),
          connects: (diagram.connects || []).filter(
            (connect) =>
              connect.from?.block?.name !== removedUseId &&
              connect.to?.block?.name !== removedUseId,
          ),
        },
      },
    });
  };

  const removeDiagramConnect = (connectIndex) => {
    updateArchitectureAst({
      ...architecture,
      body: {
        ...architecture.body,
        diagram: {
          ...diagram,
          connects: (diagram.connects || []).filter(
            (_, index) => index !== connectIndex,
          ),
        },
      },
    });
  };

  const formatDiagramEndpointForInput = (endpoint) => {
    if (!endpoint) return "";

    const blockName = endpoint.block?.name || "";

    if (endpoint.node?.name) {
      return [blockName, endpoint.node.name, endpoint.nodeAnchor]
        .filter(Boolean)
        .join(".");
    }

    if (endpoint.group?.name) {
      return [blockName, endpoint.group.name, endpoint.groupAnchor]
        .filter(Boolean)
        .join(".");
    }

    return blockName || "";
  };

  const parseDiagramEndpointForAst = (value) => {
    const text = String(value || "").trim();
    const parts = text.split(".");

    const useName = parts[0] || "";
    const itemName = parts[1] || "";
    const anchor = parts[2] || "right";

    const use = (diagram.uses || []).find((item) => item.id?.name === useName);
    const blockName = use?.block?.name;

    const usedBlock = blocks.find((block) => block.id?.name === blockName);

    const isGroupRef = (usedBlock?.groups || []).some(
      (group) => group.id?.name === itemName,
    );

    if (isGroupRef) {
      return {
        block: { name: useName },
        group: { name: itemName },
        groupAnchor: anchor,
      };
    }

    return {
      block: { name: useName },
      node: { name: itemName },
      nodeAnchor: anchor,
    };
  };

  const updateDiagramConnect = (connectIndex, key, nextValue, options = {}) => {
    const nextConnects = (diagram.connects || []).map((connect, index) => {
      if (index !== connectIndex) return connect;

      if (key === "from") {
        return {
          ...connect,
          from: parseDiagramEndpointForAst(nextValue),
        };
      }

      if (key === "to") {
        return {
          ...connect,
          to: parseDiagramEndpointForAst(nextValue),
        };
      }

      return {
        ...connect,
        [key]: nextValue,
      };
    });

    const nextArchitecture = {
      ...architecture,
      body: {
        ...architecture.body,
        diagram: {
          ...diagram,
          connects: nextConnects,
        },
      },
    };

    if (options.debounce) {
      updateArchitectureAstDebounced(nextArchitecture, 500);
    } else {
      updateArchitectureAst(nextArchitecture);
    }
  };

  const addBlock = () => {
    clearTimeout(commitTimerRef.current);

    const nextBlock = {
      id: { name: "" },
      nodes: [],
      edges: [],
      groups: [],
    };

    const nextBlocks = [...blocks, nextBlock];
    const nextSelectedEditor = nextBlocks.length - 1;

    saveSelectedEditor(nextSelectedEditor, nextBlocks);

    const {
      diagram: existingDiagram,
      blocks: _oldBlocks,
      ...restBody
    } = architecture.body || {};

    const nextBody = {
      ...restBody,
      blocks: nextBlocks,
      ...(existingDiagram ? { diagram: existingDiagram } : {}),
    };

    updateArchitectureAst({
      ...architecture,
      selectedEditor: nextSelectedEditor,
      body: nextBody,
    });
  };

  const addNode = () => {
    if (!selectedBlock) return;

    const nextNode = {
      id: { name: "" },
      type: "rect",
    };

    const nextBlocks = blocks.map((block, blockIndex) =>
      blockIndex === architecture.selectedEditor
        ? {
            ...block,
            nodes: [...(block.nodes || []), nextNode],
          }
        : block,
    );

    updateArchitectureAst({
      ...architecture,
      body: {
        ...architecture.body,
        blocks: nextBlocks,
      },
    });
  };

  const addEdge = () => {
    if (!selectedBlock) return;

    const nextEdge = {
      id: { name: "" },
      from: {
        node: { name: "" },
        nodeAnchor: "",
      },
      to: {
        node: { name: "" },
        nodeAnchor: "",
      },
    };

    const nextBlocks = blocks.map((block, blockIndex) =>
      blockIndex === architecture.selectedEditor
        ? {
            ...block,
            edges: [...(block.edges || []), nextEdge],
          }
        : block,
    );

    updateArchitectureAst({
      ...architecture,
      body: {
        ...architecture.body,
        blocks: nextBlocks,
      },
    });
  };

  const addGroup = () => {
    if (!selectedBlock) return;

    const nextGroup = {
      id: { name: "" },
      members: [],
    };

    const nextBlocks = blocks.map((block, blockIndex) =>
      blockIndex === architecture.selectedEditor
        ? {
            ...block,
            groups: [...(block.groups || []), nextGroup],
          }
        : block,
    );

    updateArchitectureAst({
      ...architecture,
      body: {
        ...architecture.body,
        blocks: nextBlocks,
      },
    });
  };

  const addDiagramUse = () => {
    const nextUse = {
      id: { name: "" },
      block: { name: "" },
    };

    updateArchitectureAst({
      ...architecture,
      body: {
        ...architecture.body,
        diagram: {
          ...diagram,
          uses: [...(diagram.uses || []), nextUse],
          connects: diagram.connects || [],
        },
      },
    });
  };

  const addDiagramConnect = () => {
    const nextConnect = {
      from: {
        block: { name: "" },
        node: { name: "" },
        nodeAnchor: "",
      },
      to: {
        block: { name: "" },
        node: { name: "" },
        nodeAnchor: "",
      },
    };

    updateArchitectureAst({
      ...architecture,
      body: {
        ...architecture.body,
        diagram: {
          ...diagram,
          uses: diagram.uses || [],
          connects: [...(diagram.connects || []), nextConnect],
        },
      },
    });
  };

  const updateBlockName = (blockIndex, nextName) => {
    const oldName = blocks[blockIndex]?.id?.name;
    const safeName = nextName;

    const nextBlocks = blocks.map((block, index) =>
      index === blockIndex
        ? {
            ...block,
            id: {
              ...block.id,
              name: safeName,
            },
          }
        : block,
    );

    const nextUses = (diagram.uses || []).map((use) =>
      use.block?.name === oldName
        ? {
            ...use,
            block: {
              ...use.block,
              name: safeName,
            },
          }
        : use,
    );

    updateArchitectureAst({
      ...architecture,
      body: {
        ...architecture.body,
        blocks: nextBlocks,
        ...(architecture.body?.diagram
          ? {
              diagram: {
                ...diagram,
                uses: nextUses,
                connects: diagram.connects || [],
              },
            }
          : {}),
      },
    });
  };
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        backgroundColor: "#181818",
        color: "#e8e8e8",
        boxSizing: "border-box",
        fontFamily: "inherit",
        fontSize: "0.875rem",

        "& .MuiTypography-root": guiFontSx,
        "& .MuiFormControlLabel-label": guiFontSx,
        "& .MuiInputBase-input": {
          ...guiFontSx,
        },

        "& textarea.MuiInputBase-input": {
          height: "auto",

          lineHeight: 1.45,
        },
        "& .MuiButton-root": {
          ...guiFontSx,
          textTransform: "none",
        },
      }}
    >
      <Box sx={{ minHeight: "100%", backgroundColor: "#1f1f1f", p: 2 }}>
        <Box sx={{ display: "grid", gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.75, color: "#bdbdbd" }}>
              Architecture Name
            </Typography>

            <TextField
              value={architecture.name}
              onChange={(e) => updateArchitectureName(e.target.value)}
              size="small"
              fullWidth
              sx={inputSx}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              variant="contained"
              size="small"
              onClick={addBlock}
              startIcon={<AddIcon fontSize="small" />}
            >
              Add Block
            </Button>

            {selectedBlock && (
              <Button
                variant="contained"
                color="inherit"
                size="small"
                onClick={removeSelectedBlock}
                sx={{ backgroundColor: "#6f7a82", color: "#fff" }}
              >
                Remove Block
              </Button>
            )}
          </Box>

          {blocks.length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, color: "#bdbdbd" }}>
                Selected Block
              </Typography>

              <RadioGroup
                row
                value={String(architecture.selectedEditor)}
                onChange={(e) => {
                  const nextValue = e.target.value;

                  const nextSelectedEditor =
                    nextValue === "diagram" ? "diagram" : Number(nextValue);

                  saveSelectedEditor(nextSelectedEditor, blocks);

                  setArchitecture({
                    ...architecture,
                    selectedEditor: nextSelectedEditor,
                  });
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  flexWrap: "wrap",
                  ml: 0,
                }}
              >
                {blocks.map((block, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      m: 0,
                      p: 0,
                    }}
                  >
                    <Radio
                      size="small"
                      value={String(index)}
                      checked={architecture.selectedEditor === index}
                      sx={{
                        p: 0,
                        m: 0,
                      }}
                    />

                    <TextField
                      value={block.id?.name || ""}
                      onChange={(e) => updateBlockName(index, e.target.value)}
                      size="small"
                      sx={{
                        ...inputSx,
                        width: 150,
                      }}
                    />
                  </Box>
                ))}
              </RadioGroup>

              {blocks.length > 1 && (
                <Box sx={{ mt: 1.25 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.75, color: "#bdbdbd" }}
                  >
                    Global
                  </Typography>

                  <RadioGroup
                    row
                    value={
                      architecture.selectedEditor === "diagram" ? "diagram" : ""
                    }
                    onChange={(e) => {
                      if (e.target.value === "diagram") {
                        saveSelectedEditor("diagram", blocks);

                        setArchitecture({
                          ...architecture,
                          selectedEditor: "diagram",
                        });
                      }
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      flexWrap: "wrap",
                      ml: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        m: 0,
                        p: 0,
                      }}
                    >
                      <Radio
                        size="small"
                        value="diagram"
                        checked={architecture.selectedEditor === "diagram"}
                        sx={{
                          p: 0,
                          m: 0,
                        }}
                      />

                      <Typography variant="body2">Diagram</Typography>
                    </Box>
                  </RadioGroup>
                </Box>
              )}
            </Box>
          )}

          {selectedBlock && (
            <>
              <Tabs
                value={tab}
                onChange={(e, nextTab) => {
                  localStorage.setItem(tabStorageKey, String(nextTab));
                  setTab(nextTab);
                }}
                sx={tabsSx}
              >
                <Tab label="Nodes" />
                <Tab label="Edges" />
                <Tab label="Groups" />
              </Tabs>

              {tab === 0 && (
                <Box sx={{ display: "grid", gap: 1.25 }}>
                  {(selectedBlock.nodes || []).map((node, index) => {
                    const showShape = nodeTypesWithShape.has(node.type);

                    return (
                      <Box
                        key={index}
                        sx={showShape ? nodeRowWithShapeSx : rowSx}
                      >
                        <Button
                          variant="contained"
                          color="inherit"
                          size="small"
                          onClick={() => removeNode(index)}
                          sx={smallRemoveButtonSx}
                        >
                          −
                        </Button>

                        <TextField
                          label="Node ID"
                          value={node.id?.name ?? ""}
                          onFocus={() => {
                            nodeRenameRef.current = {
                              blockIndex: architecture.selectedEditor,
                              nodeIndex: index,
                              oldId: node.id?.name ?? "",
                              baseArchitecture: latestArchitectureRef.current,
                            };
                          }}
                          onChange={(e) =>
                            updateNode(index, "id", e.target.value, {
                              debounce: true,
                            })
                          }
                          onBlur={() => {
                            clearTimeout(commitTimerRef.current);

                            const latestArchitecture =
                              latestArchitectureRef.current;

                            updateArchitectureAst(latestArchitecture);

                            nodeRenameRef.current = {
                              blockIndex: null,
                              nodeIndex: null,
                              oldId: null,
                              baseArchitecture: null,
                            };
                          }}
                          size="small"
                          sx={inputSx}
                        />

                        <TextField
                          select
                          SelectProps={{ native: true }}
                          label="Type"
                          value={node.type || ""}
                          onChange={(e) => {
                            const shapeDraftKey = makeDraftKey(
                              "node-shape",
                              architecture.selectedEditor,
                              index,
                            );

                            setDraftInputs((prev) => {
                              const next = { ...prev };
                              delete next[shapeDraftKey];
                              return next;
                            });

                            updateNode(index, "type", e.target.value);
                          }}
                          size="small"
                          sx={inputSx}
                        >
                          {nodeTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </TextField>

                        {showShape && node.type === "rect" && (
                          <TextField
                            select
                            SelectProps={{ native: true }}
                            label="Shape"
                            value={node.shape || ""}
                            onChange={(e) =>
                              updateNode(index, "shape", e.target.value)
                            }
                            size="small"
                            sx={inputSx}
                          >
                            {["", "rounded"].map((option) => (
                              <option key={option} value={option}>
                                {option || ""}
                              </option>
                            ))}
                          </TextField>
                        )}

                        {showShape && node.type !== "rect" && (
                          <TextField
                            label="Shape"
                            placeholder={getShapePlaceholder(node.type)}
                            value={getDraftValue(
                              makeDraftKey(
                                "node-shape",
                                architecture.selectedEditor,
                                index,
                              ),
                              formatShapeForInput(node.shape, node.type),
                            )}
                            onFocus={() => {
                              const key = makeDraftKey(
                                "node-shape",
                                architecture.selectedEditor,
                                index,
                              );

                              startDraftInput(
                                key,
                                formatShapeForInput(node.shape, node.type),
                              );
                            }}
                            onChange={(e) => {
                              const key = makeDraftKey(
                                "node-shape",
                                architecture.selectedEditor,
                                index,
                              );
                              const nextValue = e.target.value;

                              changeDraftInput(key, nextValue);

                              updateNode(index, "shape", nextValue, {
                                debounce: true,
                              });
                            }}
                            onBlur={() => {
                              const key = makeDraftKey(
                                "node-shape",
                                architecture.selectedEditor,
                                index,
                              );
                              finishDraftInput(key);
                            }}
                            size="small"
                            sx={inputSx}
                          />
                        )}
                      </Box>
                    );
                  })}

                  <Button
                    variant="contained"
                    size="small"
                    onClick={addNode}
                    startIcon={<AddIcon fontSize="small" />}
                    sx={{ width: "fit-content" }}
                  >
                    Add Node
                  </Button>
                </Box>
              )}

              {tab === 1 && (
                <Box sx={{ display: "grid", gap: 1.25 }}>
                  {(selectedBlock.edges || []).map((edge, index) => (
                    <Box key={index} sx={edgeRowSx}>
                      <Button
                        variant="contained"
                        color="inherit"
                        size="small"
                        onClick={() => removeEdge(index)}
                        sx={smallRemoveButtonSx}
                      >
                        −
                      </Button>

                      <TextField
                        label="Edge ID"
                        value={edge.id?.name ?? ""}
                        onFocus={() => {
                          edgeRenameRef.current = {
                            blockIndex: architecture.selectedEditor,
                            edgeIndex: index,
                            oldId: edge.id?.name ?? "",
                            baseArchitecture: latestArchitectureRef.current,
                          };
                        }}
                        onChange={(e) =>
                          updateEdge(index, "id", e.target.value, {
                            debounce: true,
                          })
                        }
                        onBlur={() => {
                          clearTimeout(commitTimerRef.current);

                          const latestArchitecture =
                            latestArchitectureRef.current;

                          updateArchitectureAst(latestArchitecture);

                          edgeRenameRef.current = {
                            blockIndex: null,
                            edgeIndex: null,
                            oldId: null,
                            baseArchitecture: null,
                          };
                        }}
                        size="small"
                        sx={inputSx}
                      />
                      <TextField
                        label="From"
                        value={getDraftValue(
                          makeDraftKey(
                            "edge-from",
                            architecture.selectedEditor,
                            index,
                          ),
                          formatEndpointForInput(edge.from),
                        )}
                        onFocus={() => {
                          const key = makeDraftKey(
                            "edge-from",
                            architecture.selectedEditor,
                            index,
                          );

                          startDraftInput(
                            key,
                            formatEndpointForInput(edge.from),
                          );
                        }}
                        onChange={(e) => {
                          const key = makeDraftKey(
                            "edge-from",
                            architecture.selectedEditor,
                            index,
                          );
                          const nextValue = e.target.value;

                          changeDraftInput(key, nextValue);

                          updateEdge(index, "from", nextValue, {
                            debounce: true,
                          });
                        }}
                        onBlur={() => {
                          const key = makeDraftKey(
                            "edge-from",
                            architecture.selectedEditor,
                            index,
                          );
                          finishDraftInput(key);
                        }}
                        size="small"
                        sx={inputSx}
                      />

                      <TextField
                        label="To"
                        value={getDraftValue(
                          makeDraftKey(
                            "edge-to",
                            architecture.selectedEditor,
                            index,
                          ),
                          formatEndpointForInput(edge.to),
                        )}
                        onFocus={() => {
                          const key = makeDraftKey(
                            "edge-to",
                            architecture.selectedEditor,
                            index,
                          );

                          startDraftInput(key, formatEndpointForInput(edge.to));
                        }}
                        onChange={(e) => {
                          const key = makeDraftKey(
                            "edge-to",
                            architecture.selectedEditor,
                            index,
                          );
                          const nextValue = e.target.value;

                          changeDraftInput(key, nextValue);

                          updateEdge(index, "to", nextValue, {
                            debounce: true,
                          });
                        }}
                        onBlur={() => {
                          const key = makeDraftKey(
                            "edge-to",
                            architecture.selectedEditor,
                            index,
                          );
                          finishDraftInput(key);
                        }}
                        size="small"
                        sx={inputSx}
                      />
                    </Box>
                  ))}

                  <Button
                    variant="contained"
                    size="small"
                    onClick={addEdge}
                    startIcon={<AddIcon fontSize="small" />}
                    sx={{ width: "fit-content" }}
                  >
                    Add Edge
                  </Button>
                </Box>
              )}

              {tab === 2 && (
                <Box sx={{ display: "grid", gap: 1.25 }}>
                  {(selectedBlock.groups || []).map((group, index) => (
                    <Box key={index} sx={groupRowSx}>
                      <Button
                        variant="contained"
                        color="inherit"
                        size="small"
                        onClick={() => removeGroup(index)}
                        sx={smallRemoveButtonSx}
                      >
                        −
                      </Button>

                      <TextField
                        label="Group ID"
                        value={group.id?.name ?? ""}
                        onFocus={() => {
                          groupRenameRef.current = {
                            blockIndex: architecture.selectedEditor,
                            groupIndex: index,
                            oldId: group.id?.name ?? "",
                            baseArchitecture: latestArchitectureRef.current,
                          };
                        }}
                        onChange={(e) =>
                          updateGroup(index, "id", e.target.value, {
                            debounce: true,
                          })
                        }
                        onBlur={() => {
                          clearTimeout(commitTimerRef.current);

                          const latestArchitecture =
                            latestArchitectureRef.current;

                          updateArchitectureAst(latestArchitecture);

                          groupRenameRef.current = {
                            blockIndex: null,
                            groupIndex: null,
                            oldId: null,
                            baseArchitecture: null,
                          };
                        }}
                        size="small"
                        sx={inputSx}
                      />

                      <TextField
                        label="Members"
                        value={getDraftValue(
                          makeDraftKey(
                            "group-members",
                            architecture.selectedEditor,
                            index,
                          ),
                          formatMembersForInput(group.members),
                        )}
                        onFocus={() => {
                          const key = makeDraftKey(
                            "group-members",
                            architecture.selectedEditor,
                            index,
                          );

                          startDraftInput(
                            key,
                            formatMembersForInput(group.members),
                          );
                        }}
                        onChange={(e) => {
                          const key = makeDraftKey(
                            "group-members",
                            architecture.selectedEditor,
                            index,
                          );
                          const nextValue = e.target.value;

                          changeDraftInput(key, nextValue);

                          updateGroup(index, "members", nextValue, {
                            debounce: true,
                          });
                        }}
                        onBlur={() => {
                          const key = makeDraftKey(
                            "group-members",
                            architecture.selectedEditor,
                            index,
                          );

                          finishDraftInput(key);
                        }}
                        size="small"
                        sx={inputSx}
                      />
                    </Box>
                  ))}

                  <Button
                    variant="contained"
                    size="small"
                    onClick={addGroup}
                    startIcon={<AddIcon fontSize="small" />}
                    sx={{ width: "fit-content" }}
                  >
                    Add Group
                  </Button>
                </Box>
              )}
            </>
          )}
          {blocks.length > 1 && architecture.selectedEditor === "diagram" && (
            <>
              <Tabs
                value={diagramTab}
                onChange={(e, nextTab) => {
                  localStorage.setItem(diagramTabStorageKey, String(nextTab));
                  setDiagramTab(nextTab);
                }}
                sx={tabsSx}
              >
                <Tab label="Uses" />
                <Tab label="Connects" />
              </Tabs>

              {diagramTab === 0 && (
                <Box sx={{ display: "grid", gap: 1.25 }}>
                  {(diagram.uses || []).map((use, index) => (
                    <Box key={index} sx={diagramUseRowSx}>
                      <Button
                        variant="contained"
                        color="inherit"
                        size="small"
                        onClick={() => removeDiagramUse(index)}
                        sx={smallRemoveButtonSx}
                      >
                        −
                      </Button>

                      <TextField
                        label="Use ID"
                        value={use.id?.name || ""}
                        onChange={(e) =>
                          updateDiagramUse(index, "id", e.target.value)
                        }
                        size="small"
                        sx={inputSx}
                      />

                      <TextField
                        label="Block ID"
                        value={use.block?.name || ""}
                        onChange={(e) =>
                          updateDiagramUse(index, "block", e.target.value)
                        }
                        size="small"
                        sx={inputSx}
                      />
                    </Box>
                  ))}

                  <Button
                    variant="contained"
                    size="small"
                    onClick={addDiagramUse}
                    startIcon={<AddIcon fontSize="small" />}
                    sx={{ width: "fit-content" }}
                  >
                    Add Use
                  </Button>
                </Box>
              )}

              {diagramTab === 1 && (
                <Box sx={{ display: "grid", gap: 1.25 }}>
                  {(diagram.connects || []).map((connect, index) => (
                    <Box key={index} sx={diagramConnectRowSx}>
                      <Button
                        variant="contained"
                        color="inherit"
                        size="small"
                        onClick={() => removeDiagramConnect(index)}
                        sx={smallRemoveButtonSx}
                      >
                        −
                      </Button>

                      <TextField
                        label="From"
                        value={getDraftValue(
                          makeDraftKey("diagram-connect-from", index),
                          formatDiagramEndpointForInput(connect.from),
                        )}
                        onFocus={() => {
                          const key = makeDraftKey(
                            "diagram-connect-from",
                            index,
                          );

                          startDraftInput(
                            key,
                            formatDiagramEndpointForInput(connect.from),
                          );
                        }}
                        onChange={(e) => {
                          const key = makeDraftKey(
                            "diagram-connect-from",
                            index,
                          );
                          const nextValue = e.target.value;

                          changeDraftInput(key, nextValue);

                          updateDiagramConnect(index, "from", nextValue, {
                            debounce: true,
                          });
                        }}
                        onBlur={() => {
                          const key = makeDraftKey(
                            "diagram-connect-from",
                            index,
                          );
                          finishDraftInput(key);
                        }}
                        size="small"
                        sx={inputSx}
                      />
                      <TextField
                        label="To"
                        value={getDraftValue(
                          makeDraftKey("diagram-connect-to", index),
                          formatDiagramEndpointForInput(connect.to),
                        )}
                        onFocus={() => {
                          const key = makeDraftKey("diagram-connect-to", index);

                          startDraftInput(
                            key,
                            formatDiagramEndpointForInput(connect.to),
                          );
                        }}
                        onChange={(e) => {
                          const key = makeDraftKey("diagram-connect-to", index);
                          const nextValue = e.target.value;

                          changeDraftInput(key, nextValue);

                          updateDiagramConnect(index, "to", nextValue, {
                            debounce: true,
                          });
                        }}
                        onBlur={() => {
                          const key = makeDraftKey("diagram-connect-to", index);
                          finishDraftInput(key);
                        }}
                        size="small"
                        sx={inputSx}
                      />
                    </Box>
                  ))}

                  <Button
                    variant="contained"
                    size="small"
                    onClick={addDiagramConnect}
                    startIcon={<AddIcon fontSize="small" />}
                    sx={{ width: "fit-content" }}
                  >
                    Add Connect
                  </Button>
                </Box>
              )}
            </>
          )}

          {blocks.length === 0 && (
            <Typography variant="body2" sx={{ color: "#aaa" }}>
              No blocks yet. Add a block to start.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ArchitectureGuiPanel;
