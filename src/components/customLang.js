import { type } from "os";
import {
  languageConfig,
  typeDocumentation,
  typeMethodsMap,
  methodSignatures,
  methodDocumentation,
  methodDescriptions,
  themeConfig,
  monacoLanguageConfig,
  errorStateManager,
} from "./languageConfig.mjs";

import {
  getArchitectureItemNameState,
  getAvailableBlocksForDiagramUses,
  createPropertyOnlySuggestion,
  getCurrentDiagramUsesText,
  isAfterCompletedTopLevelArchProperty,
  splitTopLevelArgs,
  isImmediatelyAfterCompletedPropertyValue,
  shouldShowTopLevelPropertyStarters,
  parseMerlinScalar,
  getLabelOrientationState,
  parseMerlinList,
  parseMerlin2DList,
  getAvailableAnchorsForDiagramUse,
  parseArchitecturesFromContext,
  getArchitectureTopLevelContext,
  getArchitectureBlockContext,
  getArchitectureEdgeCompletionContext,
  shouldShowArchitectureItemStarters,
  getCurrentDiagramConnectText,
  getTrailingTopLevelSegment,
  getArchitectureDiagramSectionContext,
  getArchitectureDiagramTopLevelContext,
  getArchitectureNameAtPosition,
  getDiagramMemberCandidates,
  getDiagramConnectCompletionContext,
  getArchitectureInlineItemContext,
  getAllowedArrowheadValuesForShapeText,
  getUsedInlineProps,
  getArchitectureSectionContext,
  isImmediatelyAfterInlinePropertyComma,
  ANNOTATION_SHIFT_KEYS,
  ANNOTATION_PROP_KEYS,
  annotationPropRegex,
  annotationNonSidePropRegex,
  pushAnchorSuggestionsForSource,
  getArchitectureInlineNamespaceContext,
  getArchitecturePropertyInsertText,
  pushEdgeEndpointSourceSuggestions,
  pushConnectionInlineProps,
  pushDiagramAliasSuggestions,
  shouldSuppressDiagramConnectValueSuggestions,
  pushNodeInlinePropertySuggestions,
  getUsedTopLevelPropertiesInCurrentDefinition,
  shouldSuppressArchitectureInlineValueSuggestions,
  getArrayItemCompletionContext,
} from "./architectureLanguageMethods.mjs";

export function registerCustomLanguage(monaco) {
  // Helper: check if the entire model already contains any 'page' or 'show' at line start
  function modelHasPageOrShow(model) {
    if (!model) return false;
    const text = model.getValue();
    // Check per line to ensure we only match commands starting a line (ignoring leading spaces)
    return text.split("\n").some((line) => /^\s*(page|show)\b/.test(line));
  }

  // Helper: build insert text with optional page/show trailer based on typeDocumentation.insertTextName
  function buildInsertTextWithPageShow(baseInsertText, componentType, model) {
    try {
      if (!model || modelHasPageOrShow(model)) {
        return baseInsertText;
      }
      const nameHint =
        typeDocumentation?.[componentType]?.insertTextName || "item";

      // Determine if baseInsertText ends with a closing brace at end of string (possibly with whitespace)
      const trimmed = baseInsertText.trimEnd();
      const endsWithBrace = /\}\s*$/.test(trimmed);

      // Ensure a single trailing newline after the definition, then add page and show lines
      const newline = "\n";
      const suffix = `${newline}${newline}page${newline}show ${nameHint}`;

      if (endsWithBrace) {
        // If base already places cursor markers like $0 after brace, preserve them by appending after
        return `${baseInsertText}${suffix}`;
      }
      return `${baseInsertText}${suffix}`;
    } catch (_) {
      return baseInsertText;
    }
  }
  // Prevent multiple registrations
  if (window.customLangRegistered) {
    return;
  }
  window.customLangRegistered = true;

  // Initialize error state manager
  window.errorStateManager = errorStateManager;
  errorStateManager.monaco = monaco;

  // Performance cache for expensive parsing operations
  const parseCache = {
    variableTypes: null,
    nodeData: null,
    neuralNetworkData: null,
    architectureData: null,
    gridLayout: null,
    lastLineNumber: -1,
    lastModelVersion: -1,

    // Clear cache when we move to a different line or model changes
    shouldRefresh: function (lineNumber, modelVersion) {
      return (
        this.lastLineNumber !== lineNumber ||
        this.lastModelVersion !== modelVersion
      );
    },

    // Update cache metadata
    updateCache: function (
      lineNumber,
      modelVersion,
      variableTypes,
      nodeData,
      neuralNetworkData,
      architectureData,
      gridLayout,
    ) {
      this.lastLineNumber = lineNumber;
      this.lastModelVersion = modelVersion;
      this.variableTypes = variableTypes;
      this.nodeData = nodeData;
      this.neuralNetworkData = neuralNetworkData;
      this.architectureData = architectureData;
      this.gridLayout = gridLayout;
    },

    // Get cached data or compute if needed
    getCachedData: function (model, position) {
      const currentModelVersion = model.getVersionId();

      if (this.shouldRefresh(position.lineNumber, currentModelVersion)) {
        const variableTypes = parseContextForTypes(model, position);
        const nodeData = parseNodesFromContext(model, position);
        const neuralNetworkData = parseNeuralNetworksFromContext(
          model,
          position,
        );
        const architectureData = parseArchitecturesFromContext(model, position);
        const gridLayout = detectGridLayout(model, position);
        this.updateCache(
          position.lineNumber,
          currentModelVersion,
          variableTypes,
          nodeData,
          neuralNetworkData,
          architectureData,
          gridLayout,
        );
      }

      return {
        variableTypes: this.variableTypes,
        nodeData: this.nodeData,
        neuralNetworkData: this.neuralNetworkData,
        architectureData: this.architectureData,
        gridLayout: this.gridLayout,
      };
    },
  };

  // Cache frequently used static data to avoid recomputation
  const staticCache = {
    allMethods: null,
    methodSignatureCache: new Map(),

    getAllMethods: function () {
      if (!this.allMethods) {
        this.allMethods = [
          ...new Set(
            Object.values(typeMethodsMap).flatMap((type) =>
              Object.values(type).flatMap((methods) =>
                Array.isArray(methods) ? methods : [],
              ),
            ),
          ),
        ];
      }
      return this.allMethods;
    },

    getMethodSignature: function (methodName, varType) {
      const cacheKey = `${methodName}:${varType}`;
      if (!this.methodSignatureCache.has(cacheKey)) {
        const signature = getMethodSignature(methodName, varType);
        this.methodSignatureCache.set(cacheKey, signature);
      }
      return this.methodSignatureCache.get(cacheKey);
    },
  };

  ///HERERERER

  // Register a new language
  monaco.languages.register({ id: "customLang" });

  // Create regex patterns from config
  const keywordPattern = new RegExp(
    `\\b(${languageConfig.keywords.join("|")})\\b`,
  );

  // Escape special characters for regular expression
  const escapedSymbols = languageConfig.symbols.map((symbol) =>
    symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const symbolPattern = new RegExp(`(${escapedSymbols.join("|")})`, "g");

  const componentPattern = new RegExp(
    `\\b(${languageConfig.components.join("|")})\\b`,
  );
  const attributePattern = new RegExp(
    `\\b(${languageConfig.attributes.join("|")})\\b`,
  );
  const positionPattern = new RegExp(
    `\\b(${languageConfig.positionKeywords.join("|")})\\b`,
  );

  const setCommand = new RegExp(`\\b(set)\\w*\\b`);
  const addCommand = new RegExp(`\\b(add)\\w*\\b`);
  const removeCommand = new RegExp(`\\b(remove)\\w*\\b`);
  const insertCommand = new RegExp(`\\b(insert)\\w*\\b`);

  // Enhanced patterns for better syntax highlighting
  const edgePattern = /([a-zA-Z_][a-zA-Z0-9_]*)-([a-zA-Z_][a-zA-Z0-9_]*)/;
  const layoutPattern = /\b\d+x\d+\b/;

  // Create method pattern from all available methods (cached)
  const allMethods = staticCache.getAllMethods();

  // Function to parse current context and get variable types
  function parseContextForTypes(model, position) {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    });

    const variableTypes = {};
    const lines = textUntilPosition.split("\n");

    // Create regex from languageConfig components
    const componentsPattern = languageConfig.components.join("|");

    // Enhanced regex patterns for different declaration styles
    const declarationRegex = new RegExp(
      `^\\s*(${componentsPattern})\\s+(\\w+)\\s*(:?=)\\s*\\{`,
    );
    const shortDeclarationRegex = new RegExp(
      `^\\s*(\\w+)\\s*=\\s*(${componentsPattern})\\s*\\{`,
    );

    // Parse variable declarations with improved regex
    for (const line of lines) {
      // Standard declaration: stack myStack = {
      const match = line.match(declarationRegex);
      if (match) {
        const [, type, varName] = match;
        variableTypes[varName] = type;
        continue;
      }

      // Short declaration: myStack = stack {
      const shortMatch = line.match(shortDeclarationRegex);
      if (shortMatch) {
        const [, varName, type] = shortMatch;
        variableTypes[varName] = type;
        continue;
      }
    }

    return variableTypes;
  }

  function parseNeuralNetworksFromContext(model, position) {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    });

    const neuralNetworksByVariable = {};
    const lines = textUntilPosition.split("\n");

    let currentVariable = null;
    let insideDeclaration = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();

      const declarationMatch = rawLine.match(
        /^\s*neuralnetwork\s+(\w+)\s*=\s*\{/,
      );
      if (declarationMatch) {
        currentVariable = declarationMatch[1];
        neuralNetworksByVariable[currentVariable] = {
          layers: [],
          neurons: [],
          layerColors: [],
          layerStrokes: [],
          neuronColors: [],
          showBias: null,
          showLabels: null,
          labelPosition: null,
          showWeights: null,
          showArrowheads: null,
          edgeWidth: null,
          edgeColor: null,
          layerSpacing: null,
          neuronSpacing: null,
        };
        insideDeclaration = true;
        continue;
      }

      if (insideDeclaration && rawLine.includes("}")) {
        insideDeclaration = false;
        currentVariable = null;
        continue;
      }

      if (insideDeclaration && currentVariable) {
        const current = neuralNetworksByVariable[currentVariable];

        const layersMatch = rawLine.match(/layers:\s*(\[.*\])/);
        if (layersMatch) {
          current.layers = parseMerlinList(layersMatch[1]);
        }

        const neuronsMatch = rawLine.match(/neurons:\s*(\[\[.*\]\])/);
        if (neuronsMatch) {
          current.neurons = parseMerlin2DList(neuronsMatch[1]);
        }

        const layerColorsMatch = rawLine.match(/layerColors:\s*(\[.*\])/);
        if (layerColorsMatch) {
          current.layerColors = parseMerlinList(layerColorsMatch[1]);
        }

        const layerStrokesMatch = rawLine.match(/layerStrokes:\s*(\[.*\])/);
        if (layerStrokesMatch) {
          current.layerStrokes = parseMerlinList(layerStrokesMatch[1]);
        }

        const neuronColorsMatch = rawLine.match(/neuronColors:\s*(\[\[.*\]\])/);
        if (neuronColorsMatch) {
          current.neuronColors = parseMerlin2DList(neuronColorsMatch[1]);
        }

        const showBiasMatch = rawLine.match(/showBias:\s*(true|false)/);
        if (showBiasMatch) {
          current.showBias = showBiasMatch[1] === "true";
        }

        const showLabelsMatch = rawLine.match(/showLabels:\s*(true|false)/);
        if (showLabelsMatch) {
          current.showLabels = showLabelsMatch[1] === "true";
        }

        const showWeightsMatch = rawLine.match(/showWeights:\s*(true|false)/);
        if (showWeightsMatch) {
          current.showWeights = showWeightsMatch[1] === "true";
        }

        const showArrowheadsMatch = rawLine.match(
          /showArrowheads:\s*(true|false)/,
        );
        if (showArrowheadsMatch) {
          current.showArrowheads = showArrowheadsMatch[1] === "true";
        }

        const edgeWidthMatch = rawLine.match(/edgeWidth:\s*(-?\d+(?:\.\d+)?)/);
        if (edgeWidthMatch) {
          current.edgeWidth = Number(edgeWidthMatch[1]);
        }

        const edgeColorMatch = rawLine.match(
          /edgeColor:\s*("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|null)/,
        );
        if (edgeColorMatch) {
          current.edgeColor = parseMerlinScalar(edgeColorMatch[1]);
        }

        const layerSpacingMatch = rawLine.match(
          /layerSpacing:\s*(-?\d+(?:\.\d+)?)/,
        );
        if (layerSpacingMatch) {
          current.layerSpacing = Number(layerSpacingMatch[1]);
        }

        const neuronSpacingMatch = rawLine.match(
          /neuronSpacing:\s*(-?\d+(?:\.\d+)?)/,
        );
        if (neuronSpacingMatch) {
          current.neuronSpacing = Number(neuronSpacingMatch[1]);
        }

        const labelPositionMatch = rawLine.match(
          /labelPosition:\s*(?:"|')?(top|bottom)(?:"|')?/,
        );
        if (labelPositionMatch) {
          current.labelPosition = labelPositionMatch[1];
        }

        continue;
      }

      // nn.setNeuron(layerIdx, neuronIdx, value)
      let match = rawLine.match(/^\s*(\w+)\.setNeuron\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const nn = neuralNetworksByVariable[varName];
        if (!nn) continue;

        const args = splitTopLevelArgs(argsText);
        const layerIndex = Number(args[0]);
        const neuronIndex = Number(args[1]);
        const value = parseMerlinScalar(args[2]);

        if (!Number.isNaN(layerIndex) && !Number.isNaN(neuronIndex)) {
          if (!nn.neurons[layerIndex]) nn.neurons[layerIndex] = [];
          nn.neurons[layerIndex][neuronIndex] = value;
        }
        continue;
      }

      // nn.setNeuronColor(layerIdx, neuronIdx, color)
      match = rawLine.match(/^\s*(\w+)\.setNeuronColor\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const nn = neuralNetworksByVariable[varName];
        if (!nn) continue;

        const args = splitTopLevelArgs(argsText);
        const layerIndex = Number(args[0]);
        const neuronIndex = Number(args[1]);
        const value = parseMerlinScalar(args[2]);

        if (!Number.isNaN(layerIndex) && !Number.isNaN(neuronIndex)) {
          if (!nn.neuronColors[layerIndex]) nn.neuronColors[layerIndex] = [];
          nn.neuronColors[layerIndex][neuronIndex] = value;
        }
        continue;
      }

      // nn.setLayer(index, value)
      match = rawLine.match(/^\s*(\w+)\.setLayer\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const nn = neuralNetworksByVariable[varName];
        if (!nn) continue;

        const args = splitTopLevelArgs(argsText);
        const index = Number(args[0]);
        const value = parseMerlinScalar(args[1]);

        if (!Number.isNaN(index)) {
          nn.layers[index] = value;
        }
        continue;
      }

      // nn.setLayerColor(index, value)
      match = rawLine.match(/^\s*(\w+)\.setLayerColor\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const nn = neuralNetworksByVariable[varName];
        if (!nn) continue;

        const args = splitTopLevelArgs(argsText);
        const index = Number(args[0]);
        const value = parseMerlinScalar(args[1]);

        if (!Number.isNaN(index)) {
          nn.layerColors[index] = value;
        }
        continue;
      }

      // nn.setNeurons([[...], [...]])
      match = rawLine.match(/^\s*(\w+)\.setNeurons\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const nn = neuralNetworksByVariable[varName];
        if (!nn) continue;

        nn.neurons = parseMerlin2DList(argsText);
        continue;
      }

      // nn.setNeuronColors([[...], [...]])
      match = rawLine.match(/^\s*(\w+)\.setNeuronColors\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const nn = neuralNetworksByVariable[varName];
        if (!nn) continue;

        nn.neuronColors = parseMerlin2DList(argsText);
        continue;
      }

      // nn.setLayers([...])
      match = rawLine.match(/^\s*(\w+)\.setLayers\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const nn = neuralNetworksByVariable[varName];
        if (!nn) continue;

        nn.layers = parseMerlinList(argsText);
        continue;
      }

      // nn.setLayerColors([...])
      match = rawLine.match(/^\s*(\w+)\.setLayerColors\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const nn = neuralNetworksByVariable[varName];
        if (!nn) continue;

        nn.layerColors = parseMerlinList(argsText);
        continue;
      }

      // nn.addNeurons(layerIndex, [...])
      match = rawLine.match(/^\s*(\w+)\.addNeurons\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const nn = neuralNetworksByVariable[varName];
        if (!nn) continue;

        const args = splitTopLevelArgs(argsText);
        const layerIndex = Number(args[0]);
        const values = parseMerlinList(args[1]);

        if (!Number.isNaN(layerIndex)) {
          if (!nn.neurons[layerIndex]) nn.neurons[layerIndex] = [];
          nn.neurons[layerIndex].push(...values);
        }
        continue;
      }

      // nn.addLayer(value, [...])
      match = rawLine.match(/^\s*(\w+)\.addLayer\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const nn = neuralNetworksByVariable[varName];
        if (!nn) continue;

        const args = splitTopLevelArgs(argsText);
        const layerValue = parseMerlinScalar(args[0]);
        const neuronValues = parseMerlinList(args[1]);

        nn.layers.push(layerValue);
        nn.neurons.push(neuronValues);
        if (nn.layerColors.length < nn.layers.length) nn.layerColors.push(null);
        if (nn.neuronColors.length < nn.neurons.length) {
          nn.neuronColors.push(neuronValues.map(() => null));
        }
        continue;
      }

      // nn.removeLayerAt(index)
      match = rawLine.match(/^\s*(\w+)\.removeLayerAt\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const nn = neuralNetworksByVariable[varName];
        if (!nn) continue;

        const index = Number(argsText.trim());
        if (!Number.isNaN(index)) {
          nn.layers.splice(index, 1);
          nn.neurons.splice(index, 1);
          nn.layerColors.splice(index, 1);
          nn.neuronColors.splice(index, 1);
        }
        continue;
      }

      // nn.removeNeuronsFromLayer(layerIndex, [...])
      match = rawLine.match(/^\s*(\w+)\.removeNeuronsFromLayer\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const nn = neuralNetworksByVariable[varName];
        if (!nn) continue;

        const args = splitTopLevelArgs(argsText);
        const layerIndex = Number(args[0]);
        const neuronIndexes = parseMerlinList(args[1])
          .map(Number)
          .filter((n) => !Number.isNaN(n))
          .sort((a, b) => b - a);

        if (!Number.isNaN(layerIndex) && nn.neurons[layerIndex]) {
          neuronIndexes.forEach((idx) => {
            nn.neurons[layerIndex].splice(idx, 1);
            if (nn.neuronColors[layerIndex]) {
              nn.neuronColors[layerIndex].splice(idx, 1);
            }
          });
        }
        continue;
      }
    }

    return neuralNetworksByVariable;
  }

  // Function to parse nodes from variable declarations
  function parseNodesFromContext(model, position) {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    });

    const nodesByVariable = {};
    const allNodes = new Set();
    const lines = textUntilPosition.split("\n");

    let currentVariable = null;
    let insideDeclaration = false;

    for (const line of lines) {
      // Check if we're starting a variable declaration
      const declarationMatch = line.match(
        /^\s*(?:graph|tree|linkedlist)\s+(\w+)\s*=\s*\{/,
      );
      if (declarationMatch) {
        currentVariable = declarationMatch[1];
        nodesByVariable[currentVariable] = new Set();
        insideDeclaration = true;
        continue;
      }

      // Check if we're ending a declaration
      if (insideDeclaration && line.includes("}")) {
        insideDeclaration = false;
        currentVariable = null;
        continue;
      }

      // Parse nodes if we're inside a declaration
      if (insideDeclaration && currentVariable) {
        // Look for nodes arrays: nodes: [A, B, C] or nodes: ["A", "B", "C"]
        const nodesMatch = line.match(/nodes:\s*\[(.*?)\]/);
        if (nodesMatch) {
          const nodesList = nodesMatch[1];
          // Extract node names (with or without quotes)
          const nodeMatches = nodesList.match(
            /(?:"([^"]+)"|([a-zA-Z_][a-zA-Z0-9_]*))/g,
          );
          if (nodeMatches) {
            nodeMatches.forEach((node) => {
              const cleanNode = node.replace(/['"]/g, "");
              nodesByVariable[currentVariable].add(cleanNode);
              allNodes.add(cleanNode);
            });
          }
        }

        // Look for edges to extract additional nodes: edges: [A-B, B-C]
        const edgesMatch = line.match(/edges:\s*\[(.*?)\]/);
        if (edgesMatch) {
          const edgesList = edgesMatch[1];
          const edgeMatches = edgesList.match(
            /(?:"([^"]+)"|([a-zA-Z_][a-zA-Z0-9_]*-[a-zA-Z_][a-zA-Z0-9_]*))/g,
          );
          if (edgeMatches) {
            edgeMatches.forEach((edge) => {
              const cleanEdge = edge.replace(/['"]/g, "");
              const [nodeA, nodeB] = cleanEdge.split("-");
              if (nodeA && nodeB) {
                nodesByVariable[currentVariable].add(nodeA);
                nodesByVariable[currentVariable].add(nodeB);
                allNodes.add(nodeA);
                allNodes.add(nodeB);
              }
            });
          }
        }
      }

      // Also parse nodes from method calls like variable.addNode("nodeName", value)
      const addNodeMatch = line.match(/(\w+)\.addNode\s*\(\s*"([^"]+)"/);
      if (addNodeMatch) {
        const [, varName, nodeName] = addNodeMatch;
        if (!nodesByVariable[varName]) {
          nodesByVariable[varName] = new Set();
        }
        nodesByVariable[varName].add(nodeName);
        allNodes.add(nodeName);
      }

      // Parse nodes from addEdge calls like variable.addEdge("nodeA-nodeB")
      const addEdgeMatch = line.match(/(\w+)\.addEdge\s*\(\s*"([^"]+)"/);
      if (addEdgeMatch) {
        const [, varName, edge] = addEdgeMatch;
        const [nodeA, nodeB] = edge.split("-");
        if (nodeA && nodeB) {
          if (!nodesByVariable[varName]) {
            nodesByVariable[varName] = new Set();
          }
          nodesByVariable[varName].add(nodeA);
          nodesByVariable[varName].add(nodeB);
          allNodes.add(nodeA);
          allNodes.add(nodeB);
        }
      }
    }

    // Convert Sets to Arrays
    Object.keys(nodesByVariable).forEach((varName) => {
      nodesByVariable[varName] = Array.from(nodesByVariable[varName]);
    });

    return {
      nodesByVariable,
      allNodes: Array.from(allNodes),
    };
  }

  // Function to detect if we're hovering over a method name (different from method call context)
  function isHoveringOverMethod(model, position, word) {
    const line = model.getLineContent(position.lineNumber);
    const beforeWord = line.substring(0, word.startColumn - 1);
    const afterWord = line.substring(word.endColumn - 1);

    // Check if there's a dot before the word: variable.methodName
    const dotBeforeMatch = beforeWord.match(/(\w+)\.$/);
    if (dotBeforeMatch) {
      const variableName = dotBeforeMatch[1];
      // Check if there are parentheses after the method name (indicating it's a method)
      const methodCallPattern = /^\s*\(/;
      const isMethodCall = methodCallPattern.test(afterWord);

      return {
        variableName,
        methodName: word.word,
        isMethod:
          isMethodCall || staticCache.getAllMethods().includes(word.word),
      };
    }

    return null;
  }

  // Function to detect method call context and parameter position
  function getMethodCallContext(model, position) {
    const line = model.getLineContent(position.lineNumber);
    const beforeCursor = line.substring(0, position.column - 1);

    // Look for method call pattern: variable.method(param1, param2, ...
    // Make it more flexible to catch incomplete calls
    const methodCallMatch = beforeCursor.match(/(\w+)\.(\w+)\s*\(([^)]*)$/);
    if (!methodCallMatch) return null;

    const [, variableName, methodName, paramsText] = methodCallMatch;

    // Count parameters to determine current parameter position
    let parameterIndex = 0;
    let depth = 0;
    let inQuotes = false;
    let quoteChar = "";

    // If paramsText is empty, we're at the first parameter
    if (paramsText.trim() === "") {
      return {
        variableName,
        methodName,
        parameterIndex: 0,
        paramsText,
        isMethodCall: true,
      };
    }

    for (let i = 0; i < paramsText.length; i++) {
      const char = paramsText[i];
      if (!inQuotes) {
        if (char === '"' || char === "'") {
          inQuotes = true;
          quoteChar = char;
        } else if (char === "(" || char === "[" || char === "{") {
          depth++;
        } else if (char === ")" || char === "]" || char === "}") {
          depth--;
        } else if (char === "," && depth === 0) {
          parameterIndex++;
        }
      } else {
        if (char === quoteChar && (i === 0 || paramsText[i - 1] !== "\\")) {
          inQuotes = false;
        }
      }
    }

    return {
      variableName,
      methodName,
      parameterIndex,
      paramsText,
      isMethodCall: true,
    };
  }

  // Function to get variable name from current line
  function getVariableNameAtPosition(model, position) {
    const line = model.getLineContent(position.lineNumber);
    const beforeCursor = line.substring(0, position.column - 1);

    // Check for chained placement notation: variableName.above., variableName.below., etc.
    const chainedMatch = beforeCursor.match(
      /(\w+)\.(above|below|left|right)\.$/,
    );
    if (chainedMatch) {
      // Return special marker to indicate this is a chained text object access
      return `${chainedMatch[1]}._text_placement_${chainedMatch[2]}`;
    }

    // Check for partial chained notation: variableName.above.methodName
    const partialChainedMatch = beforeCursor.match(
      /(\w+)\.(above|below|left|right)\.(\w*)$/,
    );
    if (partialChainedMatch) {
      // Return special marker to indicate this is a chained text object access
      return `${partialChainedMatch[1]}._text_placement_${partialChainedMatch[2]}`;
    }

    // Look for pattern: variableName. (at the end of the line before cursor)
    const match = beforeCursor.match(/(\w+)\.$/);
    if (match) {
      return match[1];
    }

    // Also check if we're typing after a dot with partial method name
    const partialMatch = beforeCursor.match(/(\w+)\.(\w*)$/);
    if (partialMatch) {
      return partialMatch[1];
    }

    return null;
  }

  // Function to get all methods for a type
  function getMethodsForType(type) {
    if (!type || !typeMethodsMap[type]) return [];

    const methods = typeMethodsMap[type];
    const allMethods = [];

    // Collect all methods from all categories
    Object.values(methods).forEach((categoryMethods) => {
      if (Array.isArray(categoryMethods)) {
        allMethods.push(...categoryMethods);
      }
    });

    // Remove duplicates using Set
    const uniqueMethods = [...new Set(allMethods)];

    return uniqueMethods;
  }

  // Function to get template suggestions for common patterns
  function getTemplateSuggestions(componentType) {
    const templates = {
      stack: {
        label: "Stack with values and colors",
        insertText: `stack \${1:callStack} = {\n\tvalue: [\${2:"main", "process", "calculate"}]\n\tcolor: [\${3:null, "blue", null}]\n\tarrow: [\${4:null, null, "top"}]\n}`,
        documentation:
          "Complete stack declaration with value, color, and arrow arrays",
      },
      array: {
        label: "Array with values and colors",
        insertText: `array \${1:myArray} = {\n\tvalue: [\${2:1, 2, 3, 4, 5}]\n\tcolor: [\${3:"red", null, "blue", null, "green"}]\n\tarrow: [\${4:null, "start", null, "end", null}]\n}`,
        documentation:
          "Complete array declaration with value, color, and arrow arrays",
      },
      matrix: {
        label: "Matrix with 2D values",
        insertText: `matrix \${1:myMatrix} = {\n\tvalue: [\n\t\t[\${2:1, 2, 3}],\n\t\t[\${3:4, 5, 6}],\n\t\t[\${4:7, 8, 9}]\n\t]\n}`,
        documentation: "Complete matrix declaration with 2D value array",
      },
      graph: {
        label: "Graph with nodes and edges",
        insertText: `graph \${1:myGraph} = {\n\tnodes: [\${2: n1, n2, n3}]\n\tedges: [\${3:n1-n2, n2-n3}]\n\tvalue: [\${4:10, 20, 30}]\n}`,
        documentation:
          "Complete graph declaration with nodes, edges, and values",
      },
      linkedlist: {
        label: "Linked list with nodes",
        insertText: `linkedlist \${1:myList} = {\n\tnodes: [\${2:head, node1, node2, tail}]\n\tvalue: [\${3:1, 2, 3, 4}]\n\tcolor: [\${4:"green", null, null, "red"}]\n}`,
        documentation: "Complete linked list declaration with nodes and values",
      },
      tree: {
        label: "Tree with hierarchical structure",
        insertText: `tree \${1:myTree} = {\n\tnodes: [\${2:root, left, right}]\n\tchildren: [\${3:root-left, root-right}]\n\tvalue: [\${4:1, 2, 3}]\n}`,
        documentation:
          "Complete tree declaration with nodes and parent-child relationships",
      },
      text: {
        label: "Text with formatting",
        insertText: `text \${1:myText} = {\n\tvalue: [\${2:"Title", "Subtitle", "Content"}]\n\tfontSize: [\${3:24, 18, 14}]\n\tcolor: [\${4:"black", "gray", "black"}]\n\talign: [\${5:"center", "center", "left"}]\n}`,
        documentation:
          "Complete text declaration with multiple lines and formatting",
      },
    };

    return templates[componentType] || null;
  }

  // Function to detect grid layout from context
  function detectGridLayout(model, position) {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    });

    // Look for page commands
    const pageMatch = textUntilPosition.match(/\bpage\s+(\d+)x(\d+)/);
    if (pageMatch) {
      const [, cols, rows] = pageMatch;
      return { cols: parseInt(cols), rows: parseInt(rows) };
    }

    return null;
  }

  // Function to get smart position suggestions based on grid layout
  function getSmartPositionSuggestions(gridLayout) {
    if (!gridLayout) {
      return [];
    }

    const suggestions = [];
    const { cols, rows } = gridLayout;

    // Generate coordinate suggestions based on actual grid size
    for (let row = 0; row < Math.min(rows, 4); row++) {
      for (let col = 0; col < Math.min(cols, 4); col++) {
        suggestions.push({
          coord: `(${col}, ${row})`,
          desc: `Column ${col}, Row ${row}`,
        });
      }
    }

    // Add some range suggestions if grid is large enough
    if (cols > 1) {
      suggestions.push({
        coord: `(0..${Math.min(cols - 1, 2)}, 0)`,
        desc: `Span first ${Math.min(cols, 3)} columns`,
      });
    }

    if (rows > 1) {
      suggestions.push({
        coord: `(0, 0..${Math.min(rows - 1, 2)})`,
        desc: `Span first ${Math.min(rows, 3)} rows`,
      });
    }

    return suggestions;
  }

  // Function to get method signature for autocomplete with smart array handling
  function getMethodSignature(methodName, varType) {
    const signatureFunction = methodSignatures[methodName];
    if (typeof signatureFunction === "function") {
      return signatureFunction(varType);
    }

    // Enhanced signatures for array methods with smart suggestions
    if (methodName === "setValue") {
      return "setValue(${1:index}, ${2:value})";
    } else if (methodName === "setValues") {
      return "setValues([${1:value1}, ${2:value2}, ${3:...}])";
    } else if (methodName === "setColor") {
      // For graph and tree, first parameter is node name (no quotes), second is color (with quotes)
      if (varType === "graph" || varType === "tree") {
        return 'setColor(${1:node}, "${2:color}")';
      }
      return 'setColor(${1:index}, "${2:color}")';
    } else if (methodName === "setColors") {
      return 'setColors(["${1:color1}", "${2:color2}", "${3:...}"])';
    }

    return signatureFunction || `${methodName}()`;
  }

  // Function to detect array vs single value usage and suggest fixes
  function getArrayMethodSuggestions(methodName, paramText) {
    const suggestions = [];

    // Check if setValue is used with array
    if (methodName === "setValue" && paramText.includes("[")) {
      suggestions.push({
        title: `Change "setValue" to "setValues" for array input`,
        replacement: "setValues",
      });
    }

    // Check if setValues is used with single value
    if (methodName === "setValues" && !paramText.includes("[")) {
      suggestions.push({
        title: `Change "setValues" to "setValue" for single value`,
        replacement: "setValue",
      });
    }

    // Same for color methods
    if (methodName === "setColor" && paramText.includes("[")) {
      suggestions.push({
        title: `Change "setColor" to "setColors" for array input`,
        replacement: "setColors",
      });
    }

    if (methodName === "setColors" && !paramText.includes("[")) {
      suggestions.push({
        title: `Change "setColors" to "setColor" for single value`,
        replacement: "setColor",
      });
    }

    return suggestions;
  }

  // Register a tokens provider for the language
  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider("customLang", {
    tokenizer: {
      root: [
        [/\[error\].*/, "custom-error"],
        [/\[warning\].*/, "custom-warning"],
        [/\[info\].*/, "custom-info"],
        [/\[debug\].*/, "custom-debug"],
        [/\b(digit|number)\b/, "custom-number"],
        [/\/\/.*$/, "comment"],
        [/$[ \t]*.*/, "inlinecomment"],

        [
          /^(\s*)(architecture)(\s+)([a-zA-Z_][a-zA-Z0-9_]*)(\s*=\s*\{)/,
          [
            "",
            "component",
            "",
            "variable",
            { token: "symbol", next: "@architecture" },
          ],
        ],

        [keywordPattern, "keyword"],

        [
          /(\.)(setNodeShape)(\s*\()/,
          [
            "symbol",
            "external-method-call",
            { token: "symbol", next: "@setNodeShapeArgs" },
          ],
        ],

        [
          /(\.)([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/,
          ["symbol", "external-method-call"],
        ],

        [componentPattern, "component"],
        [attributePattern, "attribute"],
        [positionPattern, "positional"],
        [layoutPattern, "positional"],
        [edgePattern, "variable"],
        [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, "variable"],
        [/\b\d+(\.\d+)?\b/, "number"],
        [/("([^"\\]|\\.)*")|('([^'\\]|\\.)*')/, "string"],
        [symbolPattern, "symbol"],
      ],
      setNodeShapeArgs: [
        [/\/\/.*$/, "comment"],
        [/\)/, { token: "symbol", next: "@pop" }],
        [/,/, "symbol"],
        [/\b\d+(?:x\d+)+\b/, "variable"],
        [/("([^"\\]|\\.)*")|('([^'\\]|\\.)*')/, "string"],
        [/\b\d+(\.\d+)?\b/, "number"],
        [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, "variable"],
        [/\s+/, ""],
      ],

      architecture: [
        [/\/\/.*$/, "comment"],

        [/^\s*\}/, { token: "symbol", next: "@pop" }],

        [
          /^(\s*)(block)(\s+)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:\s*\[)/,
          [
            "",
            "arch-header",
            "",
            "arch-header",
            { token: "symbol", next: "@archBlock" },
          ],
        ],

        [/^(\s*)(title)(?=\s*:)/, ["", "arch-header"]],

        [
          /^(\s*)(diagram)(\s*:\s*\[)/,
          ["", "arch-header", { token: "symbol", next: "@archDiagram" }],
        ],

        [
          /^(\s*)(annotation)(\.)(top|bottom|left|right)(\.)(shift)(\.)(top|bottom|left|right)(?=\s*:)/,
          [
            "",
            "arch-section",
            "symbol",
            "positional",
            "symbol",
            "arch-section",
            "symbol",
            "positional",
          ],
        ],
        [
          /^(\s*)(annotation)(\.)(top|bottom|left|right)(?=\s*:)/,
          ["", "arch-section", "symbol", "positional"],
        ],
        [
          new RegExp(
            `^(\\s*)(annotation\\.(?:gap|fontFamily|fontSize|fontWeight|fontStyle|fontColor))(?=\\s*:)`,
          ),
          ["", "arch-section"],
        ],

        [/^(\s*)(title)(?=\s*:)/, ["", "arch-section"]],

        [positionPattern, "positional"],
        [layoutPattern, "positional"],
        [/\b\d+(\.\d+)?\b/, "number"],
        [/("([^"\\]|\\.)*")|('([^'\\]|\\.)*')/, "string"],
        [symbolPattern, "symbol"],
        [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, "variable"],
      ],

      archBlock: [
        [/\/\/.*$/, "comment"],

        // enter child sections FIRST
        [
          /^(\s*)(nodes)(\s*:\s*\[)/,
          ["", "arch-section", { token: "symbol", next: "@archNodes" }],
        ],
        [
          /^(\s*)(edges)(\s*:\s*\[)/,
          ["", "arch-section", { token: "symbol", next: "@archEdges" }],
        ],
        [
          /^(\s*)(groups)(\s*:\s*\[)/,
          ["", "arch-section", { token: "symbol", next: "@archGroups" }],
        ],

        [/^\s*\],?/, { token: "symbol", next: "@pop" }],

        [
          /^(\s*)(annotation)(\.)(top|bottom|left|right)(\.)(shift)(\.)(top|bottom|left|right)(?=\s*:)/,
          [
            "",
            "arch-section",
            "symbol",
            "positional",
            "symbol",
            "arch-section",
            "symbol",
            "positional",
          ],
        ],
        [
          /^(\s*)(annotation)(\.)(top|bottom|left|right)(?=\s*:)/,
          ["", "arch-section", "symbol", "positional"],
        ],
        [
          new RegExp(
            `^(\\s*)(layout|gap|stroke(?:\\.(?:color|style|width))?|size|color|style|shape|fontFamily|fontSize|fontWeight|fontStyle|fontColor|annotation\\.(?:gap|fontFamily|fontSize|fontWeight|fontStyle|fontColor))(?=\\s*:)`,
          ),
          ["", "arch-section"],
        ],

        [positionPattern, "positional"],
        [layoutPattern, "positional"],
        [/\b\d+(\.\d+)?\b/, "number"],
        [/("([^"\\]|\\.)*")|('([^'\\]|\\.)*')/, "string"],
        [symbolPattern, "symbol"],
        [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, "variable"],
      ],

      archDiagram: [
        [/\/\/.*$/, "comment"],

        [/^\s*\],?/, { token: "symbol", next: "@pop" }],

        [
          /^(\s*)(annotation)(\.)(top|bottom|left|right)(\.)(shift)(\.)(top|bottom|left|right)(?=\s*:)/,
          [
            "",
            "arch-section",
            "symbol",
            "positional",
            "symbol",
            "arch-section",
            "symbol",
            "positional",
          ],
        ],
        [
          /^(\s*)(annotation)(\.)(top|bottom|left|right)(?=\s*:)/,
          ["", "arch-section", "symbol", "positional"],
        ],
        [
          new RegExp(
            `^(\\s*)(gap|layout|rotateRight|uses|connects|annotation\\.(?:gap|fontFamily|fontSize|fontWeight|fontStyle|fontColor))(?=\\s*:)`,
          ),
          ["", "arch-section"],
        ],

        [
          /^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*=)/,
          ["", "arch-item-name", "symbol"],
        ],

        [
          /\b(label\.text|label\.fontColor|label\.fontFamily|label\.fontSize|label\.fontWeight|label\.fontStyle|label|shape|style|color|arrowheads|transition|gap|width|curveHeight|anchor|alignToIndexedPort|bidirectional|edgeAnchorOffset)(?=\s*:|\.)/,

          "arch-inline-prop",
        ],

        [positionPattern, "positional"],
        [/\b(straight|bow|arc)\b/, "variable"],
        [edgePattern, "variable"],
        [/\b\d+(\.\d+)?\b/, "number"],
        [/("([^"\\]|\\.)*")|('([^'\\]|\\.)*')/, "string"],
        [symbolPattern, "symbol"],
        [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, "variable"],
      ],

      archNodes: [
        [/\/\/.*$/, "comment"],

        [/^\s*\],?/, { token: "symbol", next: "@pop" }],

        [
          /^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*=)/,
          ["", "arch-item-name", "symbol"],
        ],

        [
          /\b(annotation)(\.)(top|bottom|left|right)(\.)(shift)(\.)(top|bottom|left|right)(?=\s*:)/,
          [
            "arch-inline-prop",
            "symbol",
            "positional",
            "symbol",
            "arch-inline-prop",
            "symbol",
            "positional",
          ],
        ],
        [
          /\b(annotation)(\.)(top|bottom|left|right)(?=\s*:)/,
          ["arch-inline-prop", "symbol", "positional"],
        ],
        [
          new RegExp(
            `\\b(type|label\\.text|label\\.orientation|label\\.fontColor|label\\.fontFamily|label\\.fontSize|label\\.fontWeight|label\\.fontStyle|subLabel\\.text|subLabel\\.fontColor|subLabel\\.fontFamily|subLabel\\.fontSize|subLabel\\.fontWeight|subLabel\\.fontStyle|size|color|stroke\\.(?:color|style|width)|outerStroke\\.(?:color|style|width)|shape|kernelSize|filterSpacing|opLabel\\.text|opLabel\\.subtext|opLabel\\.fontColor|opLabel\\.fontFamily|opLabel\\.fontSize|opLabel\\.fontWeight|opLabel\\.fontStyle|outputLabels|direction|${annotationNonSidePropRegex})(?=\\s*:)`,
          ),
          "arch-inline-prop",
        ],

        [/\b\d+(?:x\d+)+\b/, "variable"],
        [positionPattern, "positional"],
        [
          /\b(rect|circle|text|arrow|box|rounded|horizontal|vertical)\b/,
          "variable",
        ],
        [/\b\d+(\.\d+)?\b/, "number"],
        [/("([^"\\]|\\.)*")|('([^'\\]|\\.)*')/, "string"],
        [symbolPattern, "symbol"],
        [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, "variable"],
      ],

      archEdges: [
        [/\/\/.*$/, "comment"],

        [/^\s*\],?/, { token: "symbol", next: "@pop" }],

        [
          /^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*=)/,
          ["", "arch-item-name", "symbol"],
        ],

        [
          /\b(label\.text|label\.fontColor|label\.fontFamily|label\.fontSize|label\.fontWeight|label\.fontStyle|label|shape|style|color|arrowheads|transition|gap|width|curveHeight|anchor|alignToIndexedPort|bidirectional|edgeAnchorOffset)(?=\s*:|\.)/,

          "arch-inline-prop",
        ],

        [positionPattern, "positional"],
        [/\b(straight|bow|arc|start|mid|end)\b/, "variable"],
        [edgePattern, "variable"],
        [/\b\d+(\.\d+)?\b/, "number"],
        [/("([^"\\]|\\.)*")|('([^'\\]|\\.)*')/, "string"],
        [symbolPattern, "symbol"],
        [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, "variable"],
      ],

      archGroups: [
        [/\/\/.*$/, "comment"],

        [/^\s*\],?/, { token: "symbol", next: "@pop" }],

        [
          /^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*=)/,
          ["", "arch-item-name", "symbol"],
        ],

        [
          /\b(annotation)(\.)(top|bottom|left|right)(\.)(shift)(\.)(top|bottom|left|right)(?=\s*:)/,
          [
            "arch-inline-prop",
            "symbol",
            "positional",
            "symbol",
            "arch-inline-prop",
            "symbol",
            "positional",
          ],
        ],
        [
          /\b(annotation)(\.)(top|bottom|left|right)(?=\s*:)/,
          ["arch-inline-prop", "symbol", "positional"],
        ],
        [
          /\b(marker)(\.)(shift)(\.)(top|bottom|left|right)(?=\s*:)/,
          [
            "arch-inline-prop",
            "symbol",
            "arch-inline-prop",
            "symbol",
            "positional",
          ],
        ],
        [
          /\b(shift)(\.)(top|bottom|left|right)(?=\s*:)/,
          ["arch-inline-prop", "symbol", "positional"],
        ],
        [
          new RegExp(
            `\\b(members|layout|anchor|anchor\\.(?:source|target)|marker|marker\\.type|marker\\.color|marker\\.position|marker\\.text|marker\\.fontColor|marker\\.fontFamily|marker\\.fontSize|marker\\.fontWeight|marker\\.fontStyle|marker\\.shift|shape|gap|stroke\\.(?:color|style|width)|color|align|colorBoxAdjustments|${annotationNonSidePropRegex})(?=\\s*:)`,
          ),
          "arch-inline-prop",
        ],

        [/\b(horizontal|vertical|grid|top|bottom)\b/, "variable"],
        [positionPattern, "positional"],
        [/\b\d+(\.\d+)?\b/, "number"],
        [/("([^"\\]|\\.)*")|('([^'\\]|\\.)*')/, "string"],
        [symbolPattern, "symbol"],
        [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, "variable"],
      ],
    },
  });

  // Define a new theme using config
  monaco.editor.defineTheme("customTheme", themeConfig);

  monaco.languages.setLanguageConfiguration("customLang", monacoLanguageConfig);

  function getComponentBodyContext(model, position) {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    });

    const lines = textUntilPosition.split("\n");
    const componentsPattern = languageConfig.components.join("|");
    const declarationRegex = new RegExp(
      `^\\s*(${componentsPattern})\\s+(\\w+)\\s*=\\s*\\{`,
    );

    let componentType = null;
    let componentName = null;
    let braceDepth = 0;
    let insideComponentBody = false;

    for (const rawLine of lines) {
      const declMatch = rawLine.match(declarationRegex);

      if (declMatch) {
        componentType = declMatch[1];
        componentName = declMatch[2];
        insideComponentBody = true;
        braceDepth = 1;

        const afterBrace = rawLine.slice(rawLine.indexOf("{") + 1);
        for (const ch of afterBrace) {
          if (ch === "{") braceDepth++;
          else if (ch === "}") braceDepth--;
        }

        if (braceDepth <= 0) {
          insideComponentBody = false;
          componentType = null;
          componentName = null;
          braceDepth = 0;
        }

        continue;
      }

      if (insideComponentBody) {
        for (const ch of rawLine) {
          if (ch === "{") braceDepth++;
          else if (ch === "}") braceDepth--;
        }

        if (braceDepth <= 0) {
          insideComponentBody = false;
          componentType = null;
          componentName = null;
          braceDepth = 0;
        }
      }
    }

    return {
      insideComponentBody,
      componentType,
      componentName,
    };
  }

  function getAttributeValueContext(linePrefix) {
    let inQuotes = false;
    let quoteChar = "";
    let bracketDepth = 0;
    let parenDepth = 0;
    let braceDepth = 0;

    let lastTopLevelComma = -1;

    for (let i = 0; i < linePrefix.length; i++) {
      const ch = linePrefix[i];

      if (!inQuotes) {
        if (ch === '"' || ch === "'") {
          inQuotes = true;
          quoteChar = ch;
        } else if (ch === "[") {
          bracketDepth++;
        } else if (ch === "]") {
          bracketDepth = Math.max(0, bracketDepth - 1);
        } else if (ch === "(") {
          parenDepth++;
        } else if (ch === ")") {
          parenDepth = Math.max(0, parenDepth - 1);
        } else if (ch === "{") {
          braceDepth++;
        } else if (ch === "}") {
          braceDepth = Math.max(0, braceDepth - 1);
        } else if (
          ch === "," &&
          bracketDepth === 0 &&
          parenDepth === 0 &&
          braceDepth === 0
        ) {
          lastTopLevelComma = i;
        }
      } else if (ch === quoteChar && linePrefix[i - 1] !== "\\") {
        inQuotes = false;
      }
    }

    const tail = linePrefix.slice(lastTopLevelComma + 1);

    // 1) Normal property form:
    //    color: red
    const directAttrMatch = tail.match(
      /^\s*([a-zA-Z_][a-zA-Z0-9_.]*)\s*:\s*([\s\S]*)$/,
    );

    let attributeName = null;
    let valueText = "";

    if (directAttrMatch) {
      attributeName = directAttrMatch[1];
      valueText = directAttrMatch[2] ?? "";
    } else {
      // 2) Inline architecture item form:
      //    add_norm1 = type: rect color:
      //    e1 = a.right -> b.left style:
      //    row1 = members: [a, b] layout:
      const inlineText = tail.includes("=")
        ? tail.slice(tail.indexOf("=") + 1)
        : tail;

      let localInQuotes = false;
      let localQuoteChar = "";
      let localBracketDepth = 0;
      let localParenDepth = 0;
      let localBraceDepth = 0;

      let lastProp = null;

      for (let i = 0; i < inlineText.length; i++) {
        const ch = inlineText[i];

        if (!localInQuotes) {
          if (ch === '"' || ch === "'") {
            localInQuotes = true;
            localQuoteChar = ch;
            continue;
          }

          if (ch === "[") {
            localBracketDepth++;
            continue;
          }
          if (ch === "]") {
            localBracketDepth = Math.max(0, localBracketDepth - 1);
            continue;
          }
          if (ch === "(") {
            localParenDepth++;
            continue;
          }
          if (ch === ")") {
            localParenDepth = Math.max(0, localParenDepth - 1);
            continue;
          }
          if (ch === "{") {
            localBraceDepth++;
            continue;
          }
          if (ch === "}") {
            localBraceDepth = Math.max(0, localBraceDepth - 1);
            continue;
          }

          if (
            ch === ":" &&
            localBracketDepth === 0 &&
            localParenDepth === 0 &&
            localBraceDepth === 0
          ) {
            let j = i - 1;
            while (j >= 0 && /\s/.test(inlineText[j])) j--;

            const end = j + 1;
            while (j >= 0 && /[a-zA-Z0-9_.]/.test(inlineText[j])) j--;

            const start = j + 1;
            const key = inlineText.slice(start, end);

            const boundaryOk = start === 0 || /\s/.test(inlineText[start - 1]);

            if (key && boundaryOk) {
              lastProp = {
                attributeName: key,
                valueStart: i + 1,
              };
            }
          }
        } else if (ch === localQuoteChar && inlineText[i - 1] !== "\\") {
          localInQuotes = false;
        }
      }

      if (lastProp) {
        attributeName = lastProp.attributeName;
        valueText = inlineText.slice(lastProp.valueStart);
      }
    }

    if (!attributeName) return null;

    // If user already finished a scalar and typed space,
    // stop treating it as current value so next property suggestions can appear.
    const hasTrailingWhitespace = /\s+$/.test(valueText);
    const trimmedValue = valueText.trim();

    const startsWithQuote =
      trimmedValue.startsWith('"') || trimmedValue.startsWith("'");

    const endsWithMatchingQuote =
      (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
      (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"));

    const isUnterminatedQuotedValue = startsWithQuote && !endsWithMatchingQuote;

    const openBrackets = (valueText.match(/\[/g) || []).length;
    const closeBrackets = (valueText.match(/\]/g) || []).length;
    const openParens = (valueText.match(/\(/g) || []).length;
    const closeParens = (valueText.match(/\)/g) || []).length;
    const openBraces = (valueText.match(/\{/g) || []).length;
    const closeBraces = (valueText.match(/\}/g) || []).length;

    const isInsideOpenStructure =
      openBrackets > closeBrackets ||
      openParens > closeParens ||
      openBraces > closeBraces;

    const isCompleteScalarValue =
      trimmedValue !== "" &&
      !isInsideOpenStructure &&
      !isUnterminatedQuotedValue;

    if (hasTrailingWhitespace && isCompleteScalarValue) {
      return null;
    }
    return {
      attributeName,
      valueText,
    };
  }

  // Helper function to analyze context once
  function analyzeContext(model, position) {
    const word = model.getWordUntilPosition(position);
    const line = model.getLineContent(position.lineNumber);
    const beforeCursor = line.substring(0, position.column - 1);
    const allLines = model.getValue().split("\n");
    const beforeLines = allLines.slice(0, position.lineNumber - 1).reverse();
    const afterLines = allLines.slice(position.lineNumber - 1);
    const currentLine = allLines[position.lineNumber - 1];

    // Get cached parsed data
    const {
      variableTypes,
      nodeData,
      gridLayout,
      neuralNetworkData,
      architectureData,
    } = parseCache.getCachedData(model, position);
    const variableNames = Object.keys(variableTypes);

    // Analyze different contexts
    const context = {
      word,
      line,
      beforeCursor,
      currentLine,
      variableTypes,
      nodeData,
      neuralNetworkData,
      architectureData,
      gridLayout,
      variableNames,

      // Context flags
      isMethodCall: false,
      isAfterDot: false,
      isInComponentDefinition: false,
      isAtLineStart: false,
      isAfterShowHide: false,
      isAfterPage: false,
      isInsideParens: false,
      isInAttributeValue: false,

      // Extracted data
      methodCallContext: null,
      variableNameAtPosition: null,
      componentDefinitionType: null,
      showHideMatch: null,
      attributeValueMatch: null,
      insideParensMatch: null,
    };

    // Check method call context
    context.methodCallContext = getMethodCallContext(model, position);
    context.isMethodCall =
      context.methodCallContext && context.methodCallContext.isMethodCall;

    // Check if after dot
    context.variableNameAtPosition = getVariableNameAtPosition(model, position);
    context.isAfterDot = !!context.variableNameAtPosition;

    const componentBodyContext = getComponentBodyContext(model, position);
    context.isInComponentDefinition = componentBodyContext.insideComponentBody;
    context.componentDefinitionType = componentBodyContext.componentType;

    // Check other contexts
    context.isAtLineStart =
      beforeCursor.trim() === "" || beforeCursor.match(/^\s*$/);
    context.showHideMatch = beforeCursor.match(/\b(show|hide)\s+(\w+)?\s*$/);
    context.isAfterShowHide = !!context.showHideMatch;
    context.isAfterPage = beforeCursor.match(/\bpage\s+$/);
    const attributeValueContext = getAttributeValueContext(beforeCursor);
    context.attributeValueMatch = attributeValueContext
      ? [
          attributeValueContext.valueText,
          attributeValueContext.attributeName,
          attributeValueContext.valueText,
        ]
      : null;
    context.isInAttributeValue = !!attributeValueContext;
    context.insideParensMatch = beforeCursor.match(/\(\s*([^)]*?)$/);
    context.isInsideParens = !!context.insideParensMatch;

    return context;
  }

  // Register completion provider for comprehensive autocomplete
  monaco.languages.registerCompletionItemProvider("customLang", {
    triggerCharacters: [".", " ", ",", ":", "["],
    provideCompletionItems: function (model, position) {
      try {
        const context = analyzeContext(model, position);

        if (isImmediatelyAfterInlinePropertyComma(model, position)) {
          return { suggestions: [] };
        }

        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: context.word.startColumn,
          endColumn: context.word.endColumn,
        };
        // Skip general completion if we're inside a method call
        if (context.isMethodCall) {
          return { suggestions: [] };
        }

        const suggestions = [];

        function getArchitectureInlineDotContext(model, position) {
          const architectureInlineItemContext =
            getArchitectureInlineItemContext(model, position);
          const architectureBlockContext = getArchitectureBlockContext(
            model,
            position,
          );

          return {
            architectureInlineItemContext,
            architectureBlockContext,
          };
        }

        const architectureInlineDotCtx = getArchitectureInlineDotContext(
          model,
          position,
        );

        function getArchitectureDotAccessContext(model, position) {
          const line = model.getLineContent(position.lineNumber);
          const beforeCursor = line.substring(0, position.column - 1);

          // only the current edge/node expression fragment, not the whole line
          const segment = getTrailingTopLevelSegment(beforeCursor);

          // match "... foo." or "... foo.ba"
          const match = segment.match(/([a-zA-Z_][a-zA-Z0-9_]*)\.(\w*)$/);
          if (!match) return null;

          return {
            sourceName: match[1],
            memberPrefix: match[2] || "",
            isImmediatelyAfterDot: segment.endsWith("."),
            segment,
          };
        }
        function getIndexedAnchorCompletionContext(model, position) {
          const line = model.getLineContent(position.lineNumber);
          const beforeCursor = line.substring(0, position.column - 1);
          const afterCursor = line.substring(position.column - 1);
          const segment = getTrailingTopLevelSegment(beforeCursor);

          const match = segment.match(
            /([a-zA-Z_][a-zA-Z0-9_]*)\.(top|bottom|left|right|start|mid|end)\[([0-9]*)$/,
          );

          if (!match) return null;

          // Must be sitting before the auto-inserted closing bracket
          if (!afterCursor.startsWith("]")) return null;

          return {
            sourceName: match[1],
            anchorName: match[2],
            indexPrefix: match[3] || "",
            segment,
          };
        }

        const architectureDotAccessCtx = getArchitectureDotAccessContext(
          model,
          position,
        );
        const indexedAnchorCtx = getIndexedAnchorCompletionContext(
          model,
          position,
        );

        if (indexedAnchorCtx && !context.methodCallContext) {
          const { sourceName, anchorName, indexPrefix } = indexedAnchorCtx;

          // Block popup if user already typed a complete index like [0]...[10]
          if (/^(10|[0-9])$/.test(indexPrefix)) {
            return { suggestions: [] };
          }

          const indexRange = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column - indexPrefix.length,
            endColumn: position.column,
          };

          for (let i = 0; i <= 10; i++) {
            const value = String(i);
            if (!value.startsWith(indexPrefix)) continue;

            suggestions.push({
              label: value,
              kind: monaco.languages.CompletionItemKind.Value,
              insertText: value,
              detail: `${anchorName} index`,
              documentation: `Use ${sourceName}.${anchorName}[${value}]`,
              range: indexRange,
              sortText: `0anchor_index_${String(i).padStart(2, "0")}`,
            });
          }

          return { suggestions };
        }
        if (
          architectureDotAccessCtx &&
          (architectureInlineDotCtx.architectureInlineItemContext.section ===
            "edges" ||
            architectureInlineDotCtx.architectureInlineItemContext.section ===
              "nodes") &&
          !context.methodCallContext
        ) {
          const archName =
            architectureInlineDotCtx.architectureBlockContext.architectureName;
          const blockName =
            architectureInlineDotCtx.architectureBlockContext.blockName;
          const block =
            context.architectureData?.[archName]?.blocks?.[blockName] || null;

          const sourceName = architectureDotAccessCtx.sourceName;
          const memberPrefix = architectureDotAccessCtx.memberPrefix;

          const isNode = (block?.nodes || []).includes(sourceName);
          const isGroup = (block?.groups || []).includes(sourceName);
          const isEdge =
            (block?.edges || []).includes(sourceName) &&
            sourceName !==
              architectureInlineDotCtx.architectureInlineItemContext.itemName;

          const validNodeAnchors = ["top", "bottom", "left", "right"];
          const validEdgeAnchors = ["start", "mid", "end"];

          const isCompleteNodeAnchor =
            isNode && validNodeAnchors.includes(memberPrefix);
          const isCompleteEdgeAnchor =
            isEdge && validEdgeAnchors.includes(memberPrefix);

          if (isCompleteNodeAnchor || isCompleteEdgeAnchor) {
            return { suggestions: [] };
          }
          // only show anchor suggestions while actively typing the anchor
          if (
            (isNode || isGroup || isEdge) &&
            !isCompleteNodeAnchor &&
            !isCompleteEdgeAnchor
          ) {
            const edgeCtxForDot =
              architectureInlineDotCtx.architectureInlineItemContext.section ===
              "edges"
                ? getArchitectureEdgeCompletionContext(
                    architectureInlineDotCtx.architectureInlineItemContext
                      .afterEqualsText,
                    block,
                    architectureInlineDotCtx.architectureInlineItemContext
                      .itemName,
                  )
                : null;

            const insertSuffix =
              architectureInlineDotCtx.architectureInlineItemContext.section ===
                "edges" &&
              edgeCtxForDot &&
              !edgeCtxForDot.hasArrow
                ? " -> "
                : " ";

            pushAnchorSuggestionsForSource(
              suggestions,
              monaco,
              range,
              sourceName,
              block,
              {
                prefix: memberPrefix,
                insertSuffix,
                triggerSuggestAfterInsert: insertSuffix !== "",
              },
            );
            return { suggestions };
          }
        }

        const inlineNamespaceCtx = getArchitectureInlineNamespaceContext(
          model,
          position,
        );

        if (inlineNamespaceCtx && !context.methodCallContext) {
          const { section, namespace, memberPrefix, fullPrefix } =
            inlineNamespaceCtx;

          const diagramNamespaceCtx =
            section === "diagram"
              ? getArchitectureDiagramTopLevelContext(model, position)
              : null;

          const currentInlineText =
            section === "block" || section === "diagram"
              ? ""
              : architectureInlineDotCtx.architectureInlineItemContext
                  .afterEqualsText || "";

          const usedBlockEntries = new Set(
            architectureInlineDotCtx.architectureBlockContext
              ?.usedBlockEntries || [],
          );

          const usedDiagramEntries = new Set(
            diagramNamespaceCtx?.usedEntries || [],
          );

          const hasProp = (fullName) => {
            if (section === "block") {
              return usedBlockEntries.has(fullName);
            }

            if (section === "diagram") {
              return usedDiagramEntries.has(fullName);
            }

            return new RegExp(`\\b${fullName.replace(/\./g, "\\.")}\\s*:`).test(
              currentInlineText,
            );
          };

          const isExactAnnotationLeaf =
            /^(annotation)\.(top|bottom|left|right)$/.test(namespace) &&
            memberPrefix === "" &&
            !fullPrefix.endsWith(".");

          if (isExactAnnotationLeaf) {
            const namespaceRange = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column - fullPrefix.length,
              endColumn: position.column,
            };

            const leafUsed = hasProp(namespace);

            const leafSuggestions = [];

            if (!leafUsed) {
              leafSuggestions.push({
                label: namespace,
                kind: monaco.languages.CompletionItemKind.Property,
                insertText: `${namespace}: "\${1:text}"`,
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: `${section} inline property`,
                documentation: `Use ${namespace} with text`,
                range: namespaceRange,
                sortText: "0inline_annotation_leaf",
                filterText: namespace,
              });
            }

            leafSuggestions.push({
              label: `${namespace}.shift`,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: `${namespace}.shift`,
              detail: `${section} inline property`,
              documentation: `Open shift properties for ${namespace}`,
              range: namespaceRange,
              sortText: "1inline_annotation_shift",
              filterText: `${namespace}.shift`,
              command: {
                id: "editor.action.triggerSuggest",
                title: "Trigger suggest",
              },
            });

            return { suggestions: leafSuggestions };
          }
          let members = [];
          let usedNamespaceProps = new Set();

          if (section === "groups" && namespace === "anchor") {
            members = ["source", "target"];

            const currentInlineText =
              architectureInlineDotCtx.architectureInlineItemContext
                .afterEqualsText || "";

            usedNamespaceProps = new Set(
              members.filter((key) =>
                new RegExp(
                  `\\banchor\\.${key.replace(/\./g, "\\.")}\\s*:`,
                ).test(currentInlineText),
              ),
            );
          }

          if (section === "diagramConnects" && namespace === "label") {
            members = [
              "text",
              "fontColor",
              "fontFamily",
              "fontSize",
              "fontWeight",
              "fontStyle",
            ];

            const currentInlineText =
              getCurrentDiagramConnectText(model, position) || "";

            usedNamespaceProps = new Set(
              members.filter((key) =>
                new RegExp(`\\blabel\\.${key.replace(/\./g, "\\.")}\\s*:`).test(
                  currentInlineText,
                ),
              ),
            );
          }
          if (section === "groups" && namespace === "shift") {
            members = ["top", "bottom", "left", "right"];

            const currentInlineText =
              architectureInlineDotCtx.architectureInlineItemContext
                .afterEqualsText || "";

            usedNamespaceProps = new Set(
              members.filter((key) =>
                new RegExp(`\\bshift\\.${key.replace(/\./g, "\\.")}\\s*:`).test(
                  currentInlineText,
                ),
              ),
            );
          }

          if (section === "edges" && namespace === "label") {
            members = [
              "text",
              "fontColor",
              "fontFamily",
              "fontSize",
              "fontWeight",
              "fontStyle",
            ];

            usedNamespaceProps = new Set(
              members.filter((key) =>
                new RegExp(`\\blabel\\.${key.replace(/\./g, "\\.")}\\s*:`).test(
                  currentInlineText,
                ),
              ),
            );
          }

          if (section === "groups" && namespace === "marker") {
            members = [
              "type",
              "color",
              "position",
              "text",
              "fontColor",
              "fontFamily",
              "fontSize",
              "fontWeight",
              "fontStyle",
              "shift",
            ];

            const currentInlineText =
              architectureInlineDotCtx.architectureInlineItemContext
                .afterEqualsText || "";

            usedNamespaceProps = new Set(
              members.filter((key) =>
                new RegExp(
                  `\\bmarker\\.${key.replace(/\./g, "\\.")}\\s*:`,
                ).test(currentInlineText),
              ),
            );
          }

          if (section === "groups" && namespace === "marker.shift") {
            members = ["top", "bottom", "left", "right"];

            const currentInlineText =
              architectureInlineDotCtx.architectureInlineItemContext
                .afterEqualsText || "";

            usedNamespaceProps = new Set(
              members.filter((key) =>
                new RegExp(
                  `\\bmarker\\.shift\\.${key.replace(/\./g, "\\.")}\\s*:`,
                ).test(currentInlineText),
              ),
            );
          }

          if (section === "nodes" && namespace === "label") {
            members = [
              "text",
              "orientation",
              "fontColor",
              "fontFamily",
              "fontSize",
              "fontWeight",
              "fontStyle",
            ];

            usedNamespaceProps = new Set(
              members.filter((key) =>
                new RegExp(`\\blabel\\.${key.replace(/\./g, "\\.")}\\s*:`).test(
                  currentInlineText,
                ),
              ),
            );
          }

          if (section === "nodes" && namespace === "subLabel") {
            members = [
              "text",
              "fontColor",
              "fontFamily",
              "fontSize",
              "fontWeight",
              "fontStyle",
            ];

            usedNamespaceProps = new Set(
              members.filter((key) =>
                new RegExp(
                  `\\bsubLabel\\.${key.replace(/\./g, "\\.")}\\s*:`,
                ).test(currentInlineText),
              ),
            );
          }

          if (section === "nodes" && namespace === "opLabel") {
            members = [
              "text",
              "subtext",
              "fontColor",
              "fontFamily",
              "fontSize",
              "fontWeight",
              "fontStyle",
            ];

            usedNamespaceProps = new Set(
              members.filter((key) =>
                new RegExp(
                  `\\bopLabel\\.${key.replace(/\./g, "\\.")}\\s*:`,
                ).test(currentInlineText),
              ),
            );
          }
          if (
            ["groups", "nodes", "block"].includes(section) &&
            namespace === "stroke"
          ) {
            members = ["color", "style", "width"];

            if (section === "block") {
              usedNamespaceProps = new Set(
                [
                  ...(architectureInlineDotCtx.architectureBlockContext
                    .usedBlockEntries || []),
                ]
                  .filter((key) => key.startsWith("stroke."))
                  .map((key) => key.replace(/^stroke\./, "")),
              );
            } else {
              const currentInlineText =
                architectureInlineDotCtx.architectureInlineItemContext
                  .afterEqualsText || "";

              usedNamespaceProps = new Set(
                ["stroke.color", "stroke.style", "stroke.width"]
                  .filter((key) =>
                    new RegExp(`\\b${key.replace(/\./g, "\\.")}\\s*:`).test(
                      currentInlineText,
                    ),
                  )
                  .map((key) => key.replace(/^stroke\./, "")),
              );
            }
          }
          if (section === "nodes" && namespace === "outerStroke") {
            members = ["color", "style", "width"];

            const currentInlineText =
              architectureInlineDotCtx.architectureInlineItemContext
                .afterEqualsText || "";

            usedNamespaceProps = new Set(
              ["outerStroke.color", "outerStroke.style", "outerStroke.width"]
                .filter((key) =>
                  new RegExp(`\\b${key.replace(/\./g, "\\.")}\\s*:`).test(
                    currentInlineText,
                  ),
                )
                .map((key) => key.replace(/^outerStroke\./, "")),
            );
          }

          if (
            ["diagram", "groups", "nodes", "block"].includes(section) &&
            namespace.startsWith("annotation")
          ) {
            if (namespace === "annotation") {
              members = [
                "top",
                "bottom",
                "left",
                "right",
                "gap",
                "fontFamily",
                "fontSize",
                "fontWeight",
                "fontStyle",
                "fontColor",
              ];
            } else if (
              /^annotation\.(top|bottom|left|right)$/.test(namespace)
            ) {
              members = ["__self__", "shift"];
            } else if (
              /^annotation\.(top|bottom|left|right)\.shift$/.test(namespace)
            ) {
              members = ["top", "bottom", "left", "right"];
            }

            usedNamespaceProps = new Set();

            if (namespace === "annotation") {
              for (const name of members) {
                const fullName = `annotation.${name}`;

                if (
                  [
                    "gap",
                    "fontFamily",
                    "fontSize",
                    "fontWeight",
                    "fontStyle",
                    "fontColor",
                  ].includes(name)
                ) {
                  if (hasProp(fullName)) {
                    usedNamespaceProps.add(name);
                  }
                  continue;
                }

                const leafUsed = hasProp(fullName);
                const allShiftChildrenUsed = [
                  "top",
                  "bottom",
                  "left",
                  "right",
                ].every((dir) => hasProp(`${fullName}.shift.${dir}`));

                // hide annotation.top only when both the leaf and all nested shift props are done
                if (leafUsed && allShiftChildrenUsed) {
                  usedNamespaceProps.add(name);
                }
              }
            } else if (
              /^annotation\.(top|bottom|left|right)$/.test(namespace)
            ) {
              const leafUsed = hasProp(namespace);

              if (leafUsed) {
                usedNamespaceProps.add("__self__"); // hides annotation.top leaf suggestion
              }

              const allShiftChildrenUsed = [
                "top",
                "bottom",
                "left",
                "right",
              ].every((dir) => hasProp(`${namespace}.shift.${dir}`));

              if (allShiftChildrenUsed) {
                usedNamespaceProps.add("shift"); // hides annotation.top.shift only when exhausted
              }
            } else if (
              /^annotation\.(top|bottom|left|right)\.shift$/.test(namespace)
            ) {
              for (const name of members) {
                const fullName = `${namespace}.${name}`;
                if (hasProp(fullName)) {
                  usedNamespaceProps.add(name);
                }
              }
            }
          }
          const namespaceRange = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column - fullPrefix.length,
            endColumn: position.column,
          };

          members
            .filter((name) => !usedNamespaceProps.has(name))
            .filter(
              (name) =>
                !memberPrefix ||
                (name === "__self__"
                  ? namespace.startsWith(memberPrefix) ||
                    namespace.split(".").pop()?.startsWith(memberPrefix)
                  : name.startsWith(memberPrefix)),
            )
            .forEach((name, index) => {
              const fullName =
                name === "__self__" ? namespace : `${namespace}.${name}`;

              const isIntermediateAnnotationNamespace =
                /^annotation\.(top|bottom|left|right)$/.test(fullName) ||
                /^annotation\.(top|bottom|left|right)\.shift$/.test(fullName);

              const isSelfAnnotationLeaf = name === "__self__";

              const isIntermediateStrokeNamespace = fullName === "stroke";

              const insertText = getArchitecturePropertyInsertText(fullName);
              const shouldTriggerNextSuggest = insertText === fullName;

              suggestions.push({
                label: fullName,
                kind: monaco.languages.CompletionItemKind.Property,
                insertText,
                insertTextRules: insertText.includes("${")
                  ? monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet
                  : undefined,
                command: shouldTriggerNextSuggest
                  ? {
                      id: "editor.action.triggerSuggest",
                      title: "Trigger suggest",
                    }
                  : undefined,
                detail: `${section} inline property`,
                documentation: `Use ${fullName}`,
                range: namespaceRange,
                sortText: `0inline_ns_${index}`,
                filterText: fullName,
              });
            });
          return { suggestions };
        }

        // Method completion after dot
        if (context.isAfterDot) {
          // Check if this is a chained text object access
          if (
            context.variableNameAtPosition &&
            context.variableNameAtPosition.includes("_text_placement_")
          ) {
            // Extract the original variable name and placement direction
            const parts =
              context.variableNameAtPosition.split("._text_placement_");
            const originalVarName = parts[0];
            const placementDirection = parts[1];

            // Get text object methods since we're accessing a linked text object
            const textMethods = getMethodsForType("text");
            textMethods.forEach((method) => {
              suggestions.push({
                label: method,
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: getMethodSignature(method, "text"),
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: `text method (${placementDirection} text)`,
                documentation:
                  (methodDescriptions[method] || `Method for text object`) +
                  ` - Applied to ${placementDirection} text of ${originalVarName}`,
                range: range,
                sortText: `0${method}`,
                command: {
                  id: "editor.action.triggerParameterHints",
                  title: "Trigger signature help",
                },
              });
            });
            return { suggestions };
          } else {
            // Regular variable method completion
            const varType =
              context.variableTypes[context.variableNameAtPosition];
            if (varType) {
              const methods = getMethodsForType(varType);
              methods.forEach((method) => {
                suggestions.push({
                  label: method,
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: getMethodSignature(method, varType),
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  detail: `${varType} method`,
                  documentation:
                    methodDescriptions[method] || `Method for ${varType}`,
                  range: range,
                  sortText: `0${method}`,
                  command: {
                    id: "editor.action.triggerParameterHints",
                    title: "Trigger signature help",
                  },
                });
              });

              // Also add placement properties for accessing linked text objects
              if (varType !== "text") {
                // Don't add placement properties to text objects themselves
                const placements = ["above", "below", "left", "right"];
                placements.forEach((placement) => {
                  suggestions.push({
                    label: placement,
                    kind: monaco.languages.CompletionItemKind.Property,
                    insertText: placement,
                    detail: `${placement} text object`,
                    documentation: `Access the text object positioned ${placement} relative to ${context.variableNameAtPosition}`,
                    range: range,
                    sortText: `1${placement}`, // Sort after methods with '1' prefix
                  });
                });
              }

              return { suggestions };
            }
          }
        }

        const architectureInlineItemContext = getArchitectureInlineItemContext(
          model,
          position,
        );

        const architectureSectionContext = getArchitectureSectionContext(
          model,
          position,
        );

        const diagramSectionContext = getArchitectureDiagramSectionContext(
          model,
          position,
        );
        const diagramTopLevelContext = getArchitectureDiagramTopLevelContext(
          model,
          position,
        );

        const currentArchitectureName = getArchitectureNameAtPosition(
          model,
          position,
        );

        const architectureTopLevelContext = getArchitectureTopLevelContext(
          model,
          position,
        );

        const architectureBlockContext = getArchitectureBlockContext(
          model,
          position,
        );

        if (
          isAfterCompletedTopLevelArchProperty(model, position) &&
          (architectureTopLevelContext.insideArchitectureTopLevel ||
            architectureBlockContext.insideArchitectureBlockTopLevel ||
            diagramTopLevelContext.insideDiagramTopLevel) &&
          !architectureSectionContext.insideNodes &&
          !architectureSectionContext.insideEdges &&
          !architectureSectionContext.insideGroups &&
          !diagramSectionContext.insideDiagramConnects &&
          !diagramSectionContext.insideDiagramUses
        ) {
          return { suggestions: [] };
        }

        function isImmediatelyAfterComma(model, position) {
          const linePrefix = model
            .getLineContent(position.lineNumber)
            .substring(0, position.column - 1);

          return /,\s*$/.test(linePrefix);
        }

        function isImmediatelyAfterCommaInArchitectureInlineItem(
          model,
          position,
          architectureInlineItemContext,
        ) {
          const section = architectureInlineItemContext.section;

          if (
            section !== "nodes" &&
            section !== "edges" &&
            section !== "groups"
          ) {
            return false;
          }

          const linePrefix = model
            .getLineContent(position.lineNumber)
            .substring(0, position.column - 1);

          const currentItemText =
            architectureInlineItemContext.currentItemText ?? "";

          return currentItemText === "" && /,$/.test(linePrefix);
        }

        if (
          isImmediatelyAfterCommaInArchitectureInlineItem(
            model,
            position,
            architectureInlineItemContext,
          )
        ) {
          return { suggestions: [] };
        }

        const currentArchitecture = currentArchitectureName
          ? context.architectureData?.[currentArchitectureName]
          : null;

        if (
          diagramSectionContext.insideDiagramConnects &&
          !context.methodCallContext
        ) {
          const connectText = getCurrentDiagramConnectText(model, position);
          const connectCtx = getDiagramConnectCompletionContext(
            connectText,
            currentArchitecture,
          );

          if (context.isInAttributeValue) {
            const attributeName = context.attributeValueMatch?.[1];
            const valueText = context.attributeValueMatch?.[2] ?? "";

            if (
              shouldSuppressDiagramConnectValueSuggestions(
                attributeName,
                valueText,
                connectCtx,
              )
            ) {
              return { suggestions: [] };
            }

            if (
              attributeName === "label.fontFamily" ||
              attributeName === "annotation.fontFamily"
            ) {
              languageConfig.fontFamilies.forEach((family, index) => {
                suggestions.push({
                  label: family,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: `"${family}"`,
                  detail: "SVG font family",
                  documentation: `Use ${family} as font family`,
                  range,
                  sortText: `0fontfamily${index}`,
                });
              });
              return { suggestions };
            }

            if (
              attributeName === "label.fontWeight" ||
              attributeName === "annotation.fontWeight"
            ) {
              languageConfig.fontWeightsArch.forEach((weight, index) => {
                suggestions.push({
                  label: weight,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: weight,
                  detail: "Font weight",
                  documentation: `Use font weight ${weight}`,
                  range,
                  sortText: `0fontweight${index}`,
                });
              });
              return { suggestions };
            }

            if (
              attributeName === "label.fontStyle" ||
              attributeName === "annotation.fontStyle"
            ) {
              languageConfig.fontStyles.forEach((style, index) => {
                suggestions.push({
                  label: style,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: style,
                  detail: "Font style",
                  documentation: `Use font style ${style}`,
                  range,
                  sortText: `0fontstyle${index}`,
                });
              });
              return { suggestions };
            }

            if (
              attributeName === "label.fontColor" ||
              attributeName === "annotation.fontColor"
            ) {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default color",
                documentation: "Use default color",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Named color",
                  documentation: `Use ${color} color`,
                  range,
                  sortText: `1fontcolor${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "transition") {
              ["default", "featureMap", "flatten", "fullyConnected"].forEach(
                (value, index) => {
                  suggestions.push({
                    label: value,
                    kind: monaco.languages.CompletionItemKind.EnumMember,
                    insertText: value,
                    detail: "Diagram connection transition",
                    documentation: `Set connection transition to ${value}`,
                    range,
                    sortText: `0diagram_transition_${index}`,
                  });
                },
              );

              return { suggestions };
            }

            if (attributeName === "shape") {
              ["straight", "bow", "arc"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Diagram connection shape",
                  documentation: `Set connection shape to ${value}`,
                  range,
                  sortText: `0diagram_shape_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "style") {
              ["solid", "dashed", "dotted"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Diagram connection style",
                  documentation: `Set connection style to ${value}`,
                  range,
                  sortText: `0diagram_style_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "alignToIndexedPort") {
              ["true", "false"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: value,
                  detail: "Boolean",
                  documentation: `Set alignToIndexedPort to ${value}`,
                  range,
                  sortText: `0alignToIndexedPort${index}`,
                });
              });

              return { suggestions };
            }
            if (attributeName === "bidirectional") {
              ["true", "false"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: value,
                  detail: "Boolean",
                  documentation: `Set bidirectional to ${value}`,
                  range,
                  sortText: `0bidirectional${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "arrowheads") {
              const allowedArrowheads = getAllowedArrowheadValuesForShapeText(
                connectCtx.text,
              );
              allowedArrowheads.forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: value,
                  detail: "Arrowheads count",
                  documentation: `Set arrowheads to ${value}`,
                  range,
                  sortText: `0diagram_arrowheads_${index}`,
                });
              });

              return { suggestions };
            }

            if (
              attributeName === "color" ||
              attributeName === "label.fontColor"
            ) {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default color",
                documentation: "Use default color",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Named color",
                  documentation: `Use ${color} color`,
                  range,
                  sortText: `1diagram_color_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "label") {
              suggestions.push({
                label: "text",
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: '"${1:text}"',
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: "Connection label",
                documentation: "Set connection label text",
                range,
                sortText: "0diagram_label",
              });

              return { suggestions };
            }
          }

          if (!context.isInAttributeValue) {
            if (connectCtx.isEmpty) {
              pushDiagramAliasSuggestions(
                suggestions,
                monaco,
                range,
                currentArchitecture,
              );
              return { suggestions };
            }

            if (connectCtx.endsWithBareAlias) {
              const alias = connectCtx.bareAliasMatch?.[1];
              if ((currentArchitecture?.diagram?.uses || {})[alias]) {
                suggestions.push({
                  label: ".",
                  kind: monaco.languages.CompletionItemKind.Operator,
                  insertText: ".",
                  detail: "Alias accessor",
                  documentation: `Continue from ${alias} with a block member`,
                  range: {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endColumn: position.column,
                  },
                  sortText: "0diagram_dot",
                  command: {
                    id: "editor.action.triggerSuggest",
                    title: "Trigger suggest",
                  },
                });
                return { suggestions };
              }
            }

            if (connectCtx.memberNeedsDot) {
              suggestions.push({
                label: ".",
                kind: monaco.languages.CompletionItemKind.Operator,
                insertText: ".",
                detail: "Member anchor accessor",
                documentation: `Continue from ${connectCtx.completeMemberInfo.alias}.${connectCtx.completeMemberInfo.memberName} with an anchor`,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endColumn: position.column,
                },
                sortText: "0diagram_member_dot",
                command: {
                  id: "editor.action.triggerSuggest",
                  title: "Trigger suggest",
                },
              });
              return { suggestions };
            }

            if (connectCtx.needsArrow) {
              suggestions.push({
                label: "->",
                kind: monaco.languages.CompletionItemKind.Operator,
                insertText: "-> ",
                detail: "Connection arrow",
                documentation: "Connect source endpoint to target endpoint",
                range,
                sortText: "0diagram_arrow",
              });
              return { suggestions };
            }

            if (connectCtx.needsTargetEndpoint) {
              pushDiagramAliasSuggestions(
                suggestions,
                monaco,
                range,
                currentArchitecture,
              );
              return { suggestions };
            }

            const rawConnectText = connectText || "";
            const hasTrailingSpaceAfterEndpoint =
              connectCtx.endsAfterTargetEndpoint && /\s$/.test(rawConnectText);

            if (connectCtx.endsAfterTargetEndpoint) {
              if (!hasTrailingSpaceAfterEndpoint) {
                return { suggestions: [] };
              }

              pushConnectionInlineProps(
                suggestions,
                monaco,
                range,
                connectCtx.usedProps,
                {
                  hasEdgeAnchorEndpoint: connectCtx.hasEdgeAnchorEndpoint,
                  isNotStraight: connectCtx.isNotStraight,
                },
              );
              return { suggestions };
            }
            if (connectCtx.aliasMemberAnchorMatch) {
              const [, alias, memberName, anchorPrefix] =
                connectCtx.aliasMemberAnchorMatch;

              const { nodeNames, edgeNames, groupNames } =
                getDiagramMemberCandidates(currentArchitecture, alias);

              const prefix = anchorPrefix || "";

              const isTargetSide =
                connectCtx.hasArrow ||
                /->\s*[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*\.\w*$/.test(
                  connectCtx.text,
                );
              const anchorInsertSuffix = isTargetSide ? " " : " -> ";

              if (
                nodeNames.includes(memberName) ||
                groupNames.includes(memberName)
              ) {
                ["top", "bottom", "left", "right"]
                  .filter((a) => a.startsWith(prefix))
                  .forEach((anchor, index) => {
                    suggestions.push({
                      label: anchor,
                      kind: monaco.languages.CompletionItemKind.EnumMember,
                      insertText: `${anchor}${anchorInsertSuffix}`,
                      detail: groupNames.includes(memberName)
                        ? "Group anchor"
                        : "Node anchor",
                      documentation: `Use ${alias}.${memberName}.${anchor}`,
                      range,
                      sortText: `0diagram_anchor_${index}`,
                      command: !isTargetSide
                        ? {
                            id: "editor.action.triggerSuggest",
                            title: "Trigger suggest",
                          }
                        : undefined,
                    });
                  });
              }

              if (edgeNames.includes(memberName)) {
                ["start", "mid", "end"]
                  .filter((a) => a.startsWith(prefix))
                  .forEach((anchor, index) => {
                    suggestions.push({
                      label: anchor,
                      kind: monaco.languages.CompletionItemKind.EnumMember,
                      insertText: `${anchor}${anchorInsertSuffix}`,
                      detail: "Edge anchor",
                      documentation: `Use ${alias}.${memberName}.${anchor}`,
                      range,
                      sortText: `1diagram_edgeanchor_${index}`,
                      command: !isTargetSide
                        ? {
                            id: "editor.action.triggerSuggest",
                            title: "Trigger suggest",
                          }
                        : undefined,
                    });
                  });
              }

              return { suggestions };
            }

            if (connectCtx.aliasDotMatch) {
              const [, alias, memberPrefix] = connectCtx.aliasDotMatch;

              if ((currentArchitecture?.diagram?.uses || {})[alias]) {
                const { nodeNames, edgeNames, groupNames, blockName } =
                  getDiagramMemberCandidates(currentArchitecture, alias);

                const allMembers = [...nodeNames, ...groupNames, ...edgeNames];
                const isCompleteMember = allMembers.includes(memberPrefix);

                if (isCompleteMember) {
                  return { suggestions: [] };
                }

                const prefix = memberPrefix || "";

                nodeNames
                  .filter((name) => !prefix || name.startsWith(prefix))
                  .forEach((name, index) => {
                    suggestions.push({
                      label: name,
                      kind: monaco.languages.CompletionItemKind.Variable,
                      insertText: name,
                      detail: `Node in ${blockName}`,
                      documentation: `Use node ${name} from block ${blockName}`,
                      range,
                      sortText: `0diagram_node_${index}`,
                    });
                  });

                groupNames
                  .filter((name) => !prefix || name.startsWith(prefix))
                  .forEach((name, index) => {
                    suggestions.push({
                      label: name,
                      kind: monaco.languages.CompletionItemKind.Variable,
                      insertText: name,
                      detail: `Group in ${blockName}`,
                      documentation: `Use group ${name} from block ${blockName}`,
                      range,
                      sortText: `1diagram_group_${index}`,
                    });
                  });

                edgeNames
                  .filter((name) => !prefix || name.startsWith(prefix))
                  .forEach((name, index) => {
                    suggestions.push({
                      label: name,
                      kind: monaco.languages.CompletionItemKind.Variable,
                      insertText: name,
                      detail: `Edge in ${blockName}`,
                      documentation: `Use edge ${name} from block ${blockName}`,
                      range,
                      sortText: `1diagram_edge_${index}`,
                    });
                  });
              }

              return { suggestions };
            }

            pushConnectionInlineProps(
              suggestions,
              monaco,
              range,
              connectCtx.usedProps,
              {
                hasEdgeAnchorEndpoint: connectCtx.hasEdgeAnchorEndpoint,
                isNotStraight: connectCtx.isNotStraight,
              },
            );
            return { suggestions };
          }

          return { suggestions: [] };
        }

        if (
          architectureTopLevelContext.insideArchitectureTopLevel &&
          !architectureSectionContext.insideNodes &&
          !architectureSectionContext.insideEdges &&
          !architectureSectionContext.insideGroups &&
          !context.isInAttributeValue &&
          !context.isAfterDot &&
          shouldShowTopLevelPropertyStarters(model, position)
        ) {
          const used = architectureTopLevelContext.usedTopLevelEntries;

          const architectureItems = [
            {
              key: "block",
              label: "block",
              repeatable: true,
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: "block ${1:Encoder}: [\n\t$0\n]",
              detail: "architecture block",
              documentation:
                "Add a new block. Blocks can appear multiple times.",
            },
            {
              key: "diagram",
              label: "diagram",
              repeatable: false,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: "diagram: [\n\t$0\n]",
              detail: "architecture diagram",
              documentation:
                "Add the diagram section. Only one diagram is allowed.",
            },
            {
              key: "title",
              label: "title",
              repeatable: false,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'title: "${1:title}"',
              detail: "architecture property",
              documentation: "Set the architecture title.",
            },
            {
              key: "above",
              label: "above",
              repeatable: false,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: "above: ",
              detail: "architecture property",
              documentation: "Attach text above the architecture.",
            },
            {
              key: "below",
              label: "below",
              repeatable: false,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: "below: ",
              detail: "architecture property",
              documentation: "Attach text below the architecture.",
            },
            {
              key: "left",
              label: "left",
              repeatable: false,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: "left: ",
              detail: "architecture property",
              documentation: "Attach text on the left of the architecture.",
            },
            {
              key: "right",
              label: "right",
              repeatable: false,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: "right: ",
              detail: "architecture property",
              documentation: "Attach text on the right of the architecture.",
            },
          ];

          architectureItems
            .filter((item) => item.repeatable || !used.has(item.key))
            .forEach((item, index) => {
              const base =
                item.kind === monaco.languages.CompletionItemKind.Property
                  ? {
                      ...createPropertyOnlySuggestion(monaco, range, {
                        label: item.label,
                        insertText: item.insertText,
                        detail: item.detail,
                        documentation: item.documentation,
                        sortText: `0arch_${index}_${item.label}`,
                      }),
                      insertTextRules:
                        monaco.languages.CompletionItemInsertTextRule
                          .InsertAsSnippet,
                    }
                  : {
                      label: item.label,
                      kind: item.kind,
                      insertText: item.insertText,
                      insertTextRules:
                        monaco.languages.CompletionItemInsertTextRule
                          .InsertAsSnippet,
                      detail: item.detail,
                      documentation: item.documentation,
                      range,
                      sortText: `0arch_${index}_${item.label}`,
                      filterText: item.label,
                    };

              suggestions.push(base);
            });

          return { suggestions };
        }

        const blockLinePrefix = context.beforeCursor;
        const blockPropertyPrefixMatch = blockLinePrefix.match(
          /^\s*([a-zA-Z_][a-zA-Z0-9_.]*)?$/,
        );
        const blockPropertyPrefix = blockPropertyPrefixMatch?.[1] || "";

        const isBlockPropertyPosition = shouldShowTopLevelPropertyStarters(
          model,
          position,
        );
        if (
          architectureBlockContext.insideArchitectureBlockTopLevel &&
          !architectureSectionContext.insideNodes &&
          !architectureSectionContext.insideEdges &&
          !architectureSectionContext.insideGroups &&
          isBlockPropertyPosition &&
          !context.isAfterDot &&
          !context.methodCallContext &&
          !context.isInAttributeValue
        ) {
          function getUsedBlockPropertiesFromLinePrefix(linePrefix) {
            const used = new Set();

            let inQuotes = false;
            let quoteChar = "";
            let bracketDepth = 0;
            let parenDepth = 0;
            let braceDepth = 0;

            for (let i = 0; i < linePrefix.length; i++) {
              const ch = linePrefix[i];

              if (!inQuotes) {
                if (ch === '"' || ch === "'") {
                  inQuotes = true;
                  quoteChar = ch;
                  continue;
                }

                if (ch === "[") {
                  bracketDepth++;
                  continue;
                }
                if (ch === "]") {
                  bracketDepth = Math.max(0, bracketDepth - 1);
                  continue;
                }
                if (ch === "(") {
                  parenDepth++;
                  continue;
                }
                if (ch === ")") {
                  parenDepth = Math.max(0, parenDepth - 1);
                  continue;
                }
                if (ch === "{") {
                  braceDepth++;
                  continue;
                }
                if (ch === "}") {
                  braceDepth = Math.max(0, braceDepth - 1);
                  continue;
                }

                if (
                  ch === ":" &&
                  bracketDepth === 0 &&
                  parenDepth === 0 &&
                  braceDepth === 0
                ) {
                  let j = i - 1;
                  while (j >= 0 && /\s/.test(linePrefix[j])) j--;

                  const end = j + 1;
                  while (j >= 0 && /[a-zA-Z0-9_.]/.test(linePrefix[j])) j--;

                  const start = j + 1;
                  const key = linePrefix.slice(start, end);
                  const boundaryOk =
                    start === 0 || /[\s,]/.test(linePrefix[start - 1]);

                  if (key && boundaryOk) {
                    used.add(key);
                  }
                }
              } else if (ch === quoteChar && linePrefix[i - 1] !== "\\") {
                inQuotes = false;
              }
            }

            return used;
          }
          const linePrefix = model
            .getLineContent(position.lineNumber)
            .substring(0, position.column - 1);

          const used = new Set([
            ...(architectureBlockContext.usedBlockEntries || []),
            ...getUsedBlockPropertiesFromLinePrefix(linePrefix),
          ]);

          const hasAllStrokeProps =
            used.has("stroke.color") &&
            used.has("stroke.style") &&
            used.has("stroke.width");

          const blockItems = [
            {
              key: "fontFamily",
              label: "fontFamily",
              insertText: "fontFamily: ",
              documentation: "Set block font family",
            },

            {
              key: "fontSize",
              label: "fontSize",
              insertText: "fontSize: ${1:14}",
              documentation: "Set block font size",
            },

            {
              key: "fontWeight",
              label: "fontWeight",
              insertText: "fontWeight: ",
              documentation: "Set block font weight",
            },

            {
              key: "fontStyle",
              label: "fontStyle",
              insertText: "fontStyle: ",
              documentation: "Set block font style",
            },

            {
              key: "fontColor",
              label: "fontColor",
              insertText: "fontColor: ",
              documentation: "Set block font color",
            },
            {
              key: "annotation",
              label: "annotation",
              insertText: "annotation",
              documentation: "Open annotation properties",
            },
            {
              key: "layout",
              label: "layout",
              insertText: "layout: ",
              documentation: "Set block layout",
            },
            {
              key: "gap",
              label: "gap",
              insertText: "gap: ${1:10}",
              documentation: "Set block gap",
            },
            {
              key: "size",
              label: "size",
              insertText: "size: (${1:200}, ${2:100})",
              documentation: "Set block size",
            },
            {
              key: "color",
              label: "color",
              insertText: "color: ",
              documentation: "Set block color",
            },
            {
              key: "stroke",
              label: "stroke",
              insertText: "stroke",
              documentation: "Open stroke properties",
              hideWhen: hasAllStrokeProps,
            },
            {
              key: "shape",
              label: "shape",
              insertText: "shape: ",
              documentation: "Set block shape",
            },
            {
              key: "nodes",
              label: "nodes",
              insertText: "nodes: [\n\t$0\n]",
              documentation: "Add nodes section",
            },
            {
              key: "edges",
              label: "edges",
              insertText: "edges: [\n\t$0\n]",
              documentation: "Add edges section",
            },
            {
              key: "groups",
              label: "groups",
              insertText: "groups: [\n\t$0\n]",
              documentation: "Add groups section",
            },
          ];

          blockItems
            .filter((item) => !used.has(item.key))
            .filter((item) => !item.hideWhen)
            .filter(
              (item) =>
                !blockPropertyPrefix ||
                item.label
                  .toLowerCase()
                  .startsWith(blockPropertyPrefix.toLowerCase()),
            )
            .forEach((item, index) => {
              suggestions.push({
                label: item.label,
                kind: monaco.languages.CompletionItemKind.Property,
                insertText: item.insertText,
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: "architecture block property",
                documentation: item.documentation,
                range,
                sortText: `0block_${index}_${item.label}`,
                filterText: item.label,
                command:
                  item.key === "nodes" ||
                  item.key === "edges" ||
                  item.key === "groups"
                    ? {
                        id: "editor.action.triggerSuggest",
                        title: "Trigger suggest",
                      }
                    : undefined,
              });
            });
          return { suggestions };
        }

        if (
          diagramSectionContext.insideDiagramUses &&
          !context.methodCallContext &&
          !context.isAfterDot
        ) {
          const usesText = getCurrentDiagramUsesText(model, position);
          const currentArchitecture = currentArchitectureName
            ? context.architectureData?.[currentArchitectureName]
            : null;

          if (currentArchitecture) {
            const rawSegment = getTrailingTopLevelSegment(usesText);
            const trimmedSegment = rawSegment.trim();
            const endsWithComma = /,\s*$/.test(usesText);

            const availableBlocks =
              getAvailableBlocksForDiagramUses(currentArchitecture);

            const parsedUseAfterAnchorKeywordMatch = trimmedSegment.match(
              /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+anchor\s*:\s*$/,
            );

            const parsedUseWithAnchorMatch = trimmedSegment.match(
              /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+anchor\s*:\s*([a-zA-Z_][a-zA-Z0-9_]*)?$/,
            );

            const parsedUseNeedsAnchorKeywordMatch = trimmedSegment.match(
              /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+$/,
            );

            if (trimmedSegment === "" || endsWithComma) {
              availableBlocks.forEach((blockName, index) => {
                const defaultAlias = blockName[0].toLowerCase();

                suggestions.push({
                  label: `${defaultAlias} = ${blockName}`,
                  kind: monaco.languages.CompletionItemKind.Variable,
                  insertText: `${defaultAlias} = ${blockName}`,
                  detail: "diagram use alias",
                  documentation: `Alias block ${blockName}`,
                  range,
                  sortText: `0diagram_use_tpl_${index}`,
                });
              });

              return { suggestions };
            }

            if (parsedUseAfterAnchorKeywordMatch) {
              const [, alias, blockName] = parsedUseAfterAnchorKeywordMatch;
              const anchors = getAvailableAnchorsForDiagramUse(
                currentArchitecture,
                blockName,
              );

              anchors.forEach((nodeName, index) => {
                suggestions.push({
                  label: nodeName,
                  kind: monaco.languages.CompletionItemKind.Variable,
                  insertText: nodeName,
                  detail: `Anchor node in ${blockName}`,
                  documentation: `Use node ${nodeName} as anchor for alias ${alias}`,
                  range,
                  sortText: `0diagram_use_anchor_${index}`,
                });
              });

              return { suggestions };
            }

            if (parsedUseWithAnchorMatch) {
              const [, alias, blockName, anchorPrefix = ""] =
                parsedUseWithAnchorMatch;
              const anchors = getAvailableAnchorsForDiagramUse(
                currentArchitecture,
                blockName,
              );

              if (anchors.includes(anchorPrefix)) {
                return { suggestions: [] };
              }

              anchors
                .filter(
                  (nodeName) =>
                    !anchorPrefix || nodeName.startsWith(anchorPrefix),
                )
                .forEach((nodeName, index) => {
                  suggestions.push({
                    label: nodeName,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: nodeName,
                    detail: `Anchor node in ${blockName}`,
                    documentation: `Use node ${nodeName} as anchor for alias ${alias}`,
                    range,
                    sortText: `0diagram_use_anchor_${index}`,
                  });
                });

              return { suggestions };
            }

            if (parsedUseNeedsAnchorKeywordMatch) {
              const [, alias, blockName] = parsedUseNeedsAnchorKeywordMatch;
              const availableForAlias = getAvailableBlocksForDiagramUses(
                currentArchitecture,
                alias,
              );

              if (availableForAlias.includes(blockName)) {
                suggestions.push({
                  label: "anchor",
                  kind: monaco.languages.CompletionItemKind.Property,
                  insertText: "anchor: ",
                  detail: "Use anchor property",
                  documentation: `Choose an anchor node from block ${blockName}`,
                  range: {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endColumn: position.column,
                  },
                  sortText: "0diagram_use_anchor_keyword",
                  command: {
                    id: "editor.action.triggerSuggest",
                    title: "Trigger suggest",
                  },
                });

                return { suggestions };
              }
            }

            const aliasBlockThenSpaceMatch = rawSegment.match(
              /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+$/,
            );

            const aliasEqualsMatch = trimmedSegment.match(
              /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)$/,
            );

            if (aliasBlockThenSpaceMatch) {
              const [, currentAlias, blockName] = aliasBlockThenSpaceMatch;

              const availableForAlias = getAvailableBlocksForDiagramUses(
                currentArchitecture,
                currentAlias,
              );

              if (availableForAlias.includes(blockName)) {
                suggestions.push({
                  label: "anchor",
                  kind: monaco.languages.CompletionItemKind.Property,
                  insertText: "anchor: ",
                  detail: "diagram use property",
                  documentation: `Choose an anchor node from block ${blockName}`,
                  range: {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endColumn: position.column,
                  },
                  sortText: "0diagram_use_anchor",
                  command: {
                    id: "editor.action.triggerSuggest",
                    title: "Trigger suggest",
                  },
                });

                return { suggestions };
              }
            }

            if (aliasEqualsMatch) {
              const currentAlias = aliasEqualsMatch[1];
              const blockPrefix = aliasEqualsMatch[2];

              const availableForAlias = getAvailableBlocksForDiagramUses(
                currentArchitecture,
                currentAlias,
              );

              if (availableForAlias.includes(blockPrefix)) {
                return { suggestions: [] };
              }

              availableForAlias
                .filter((blockName) => blockName.startsWith(blockPrefix))
                .forEach((blockName, index) => {
                  suggestions.push({
                    label: blockName,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: blockName,
                    detail: "Architecture block",
                    documentation: `Use block ${blockName} in diagram alias`,
                    range,
                    sortText: `0diagram_use_block_${index}`,
                  });
                });

              return { suggestions };
            }

            const aliasWaitingForBlockMatch = trimmedSegment.match(
              /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*$/,
            );

            if (aliasWaitingForBlockMatch) {
              const currentAlias = aliasWaitingForBlockMatch[1];

              getAvailableBlocksForDiagramUses(
                currentArchitecture,
                currentAlias,
              ).forEach((blockName, index) => {
                suggestions.push({
                  label: blockName,
                  kind: monaco.languages.CompletionItemKind.Variable,
                  insertText: blockName,
                  detail: "Architecture block",
                  documentation: `Use block ${blockName} in diagram alias`,
                  range,
                  sortText: `0diagram_use_block_${index}`,
                });
              });

              return { suggestions };
            }
          }
        }
        function getUsedDiagramPropertiesFromLinePrefix(linePrefix) {
          const used = new Set();

          let inQuotes = false;
          let quoteChar = "";
          let bracketDepth = 0;
          let parenDepth = 0;
          let braceDepth = 0;

          for (let i = 0; i < linePrefix.length; i++) {
            const ch = linePrefix[i];

            if (!inQuotes) {
              if (ch === '"' || ch === "'") {
                inQuotes = true;
                quoteChar = ch;
                continue;
              }

              if (ch === "[") {
                bracketDepth++;
                continue;
              }
              if (ch === "]") {
                bracketDepth = Math.max(0, bracketDepth - 1);
                continue;
              }
              if (ch === "(") {
                parenDepth++;
                continue;
              }
              if (ch === ")") {
                parenDepth = Math.max(0, parenDepth - 1);
                continue;
              }
              if (ch === "{") {
                braceDepth++;
                continue;
              }
              if (ch === "}") {
                braceDepth = Math.max(0, braceDepth - 1);
                continue;
              }

              if (
                ch === ":" &&
                bracketDepth === 0 &&
                parenDepth === 0 &&
                braceDepth === 0
              ) {
                let j = i - 1;
                while (j >= 0 && /\s/.test(linePrefix[j])) j--;

                const end = j + 1;
                while (j >= 0 && /[a-zA-Z0-9_.]/.test(linePrefix[j])) j--;

                const start = j + 1;
                const key = linePrefix.slice(start, end);
                const boundaryOk =
                  start === 0 || /[\s,]/.test(linePrefix[start - 1]);

                if (key && boundaryOk) {
                  used.add(key);
                }
              }
            } else if (ch === quoteChar && linePrefix[i - 1] !== "\\") {
              inQuotes = false;
            }
          }

          return used;
        }
        if (
          diagramTopLevelContext.insideDiagramTopLevel &&
          !diagramSectionContext.insideDiagramConnects &&
          !diagramSectionContext.insideDiagramUses &&
          !context.isAfterDot &&
          !context.methodCallContext &&
          !context.isInAttributeValue &&
          shouldShowTopLevelPropertyStarters(model, position)
        ) {
          const linePrefix = model
            .getLineContent(position.lineNumber)
            .substring(0, position.column - 1);

          const used = new Set([
            ...(diagramTopLevelContext.usedEntries || []),

            ...getUsedDiagramPropertiesFromLinePrefix(linePrefix),
          ]);

          [
            {
              key: "annotation",
              label: "annotation",
              insertText: "annotation",
              documentation: "Open annotation properties",
            },
            {
              key: "gap",
              label: "gap",
              insertText: "gap: ${1:10}",
              documentation: "Set diagram gap",
            },
            {
              key: "rotateRight",
              label: "rotateRight",
              insertText: "rotateRight: ",
              documentation: "Set diagram rotation",
            },
            {
              key: "layout",
              label: "layout",
              insertText: "layout: ",
              documentation: "Set diagram layout",
            },
            {
              key: "uses",
              label: "uses",
              insertText: "uses: [${1}]",
              documentation: "Define block aliases",
            },
            {
              key: "connects",
              label: "connects",
              insertText: "connects: [\n\t$0\n]",
              documentation: "Define connections between aliased blocks",
            },
          ]
            .filter((item) => !used.has(item.key))
            .forEach((item, index) => {
              suggestions.push({
                label: item.label,
                kind: monaco.languages.CompletionItemKind.Property,
                insertText: item.insertText,
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: "diagram property",
                documentation: item.documentation,
                range,
                sortText: `0diagram_top_${index}`,
              });
            });

          return { suggestions };
        }
        if (
          architectureSectionContext.insideGroups &&
          !context.isAfterDot &&
          !context.isInAttributeValue &&
          !context.methodCallContext
        ) {
          const archName = architectureBlockContext.architectureName;
          const blockName = architectureBlockContext.blockName;
          const block =
            context.architectureData?.[archName]?.blocks?.[blockName] || null;

          const rawCurrentItemPrefix =
            architectureInlineItemContext.currentItemText;
          const currentItemPrefix = rawCurrentItemPrefix.trim();
          const groupNameState =
            getArchitectureItemNameState(rawCurrentItemPrefix);

          const nextGroupName = getNextGroupName(block);
          const groupNameSuggestions = [nextGroupName];

          const isExactGroupNameMatch =
            groupNameSuggestions.includes(currentItemPrefix);

          const shouldShowGroupNameStage =
            shouldShowArchitectureItemStarters(
              model,
              position,
              rawCurrentItemPrefix,
            ) &&
            !isExactGroupNameMatch &&
            (currentItemPrefix === "" ||
              /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(currentItemPrefix));

          // Stage 1: typing group name only
          if (
            shouldShowGroupNameStage &&
            !groupNameState.isNameThenSpace &&
            !groupNameState.isAfterEquals
          ) {
            [
              {
                label: nextGroupName,
                insertText: `${nextGroupName} = `,
                detail: "group name",
                documentation: "Insert group name and start assignment",
                kind: monaco.languages.CompletionItemKind.Variable,
              },
            ].forEach((item, index) => {
              suggestions.push({
                label: item.label,
                kind: item.kind,
                insertText: item.insertText,
                insertTextRules: item.insertTextRules,
                detail: item.detail,
                documentation: item.documentation,
                range,
                sortText: `0group_name_${index}`,
                command: item.command,
              });
            });

            return { suggestions };
          }

          // Stage 2: after "groupName "
          if (groupNameState.isNameThenSpace) {
            suggestions.push({
              label: "=",
              kind: monaco.languages.CompletionItemKind.Operator,
              insertText: "= ",
              detail: "Assign group definition",
              documentation: `Start defining group ${groupNameState.itemName}`,
              range,
              sortText: "0group_equals",
            });

            return { suggestions };
          }

          function hasDeclaredGroupMembers(groupText) {
            return /\bmembers\s*:\s*\[[^\]]*\]/.test(String(groupText || ""));
          }

          function isEditingGroupMembers(groupText) {
            return /\bmembers\s*:\s*\[[^\]]*$/.test(String(groupText || ""));
          }

          // Stage 3: after "groupName = "
          if (groupNameState.isAfterEquals) {
            const groupText = groupNameState.afterEqualsText || "";
            const used = getUsedInlineProps(groupText, [
              "members",
              "layout",
              "anchor",
              "marker",
              "marker.type",
              "marker.color",
              "marker.position",
              "marker.text",
              "marker.fontColor",
              "marker.fontFamily",
              "marker.fontSize",
              "marker.fontWeight",
              "marker.fontStyle",
              "marker.shift",
              "marker.shift.top",
              "marker.shift.bottom",
              "marker.shift.left",
              "marker.shift.right",
              "shift",
              "shift.top",
              "shift.bottom",
              "shift.left",
              "shift.right",
              "shape",
              "gap",
              "color",
              "colorBoxAdjustments",
              "align",
              ...ANNOTATION_PROP_KEYS,
            ]);

            const membersDeclared = hasDeclaredGroupMembers(groupText);

            // Until members is declared, only suggest members
            if (!membersDeclared) {
              if (!used.has("members")) {
                suggestions.push({
                  label: "members",
                  kind: monaco.languages.CompletionItemKind.Property,
                  insertText: "members: [${1}]",
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  detail: "group inline property",
                  documentation: "Set group members",
                  range,
                  sortText: "0group_inline_members",
                });
              }

              return { suggestions };
            }

            const groupInlineItems = [
              {
                key: "annotation",
                label: "annotation",
                insertText: "annotation",
                documentation: "Open annotation properties",
              },
              {
                key: "layout",
                label: "layout",
                insertText: "layout: ",
                documentation: "Set group layout",
              },
              {
                key: "anchor",
                label: "anchor",
                insertText: "anchor",
                documentation: "Open group anchor properties",
              },
              {
                key: "shift",
                label: "shift",
                insertText: "shift",
                documentation: "Open group shift properties",
              },
              {
                key: "marker",
                label: "marker",
                insertText: "marker",
                documentation: "Open group marker properties",
              },
              {
                key: "shape",
                label: "shape",
                insertText: "shape: ",
                documentation: "Set group colorBox shape",
              },
              {
                key: "gap",
                label: "gap",
                insertText: "gap: ${1:10}",
                documentation: "Set group gap",
              },
              {
                key: "color",
                label: "color",
                insertText: "color: ",
                documentation: "Set group color",
              },
              {
                key: "stroke",
                label: "stroke",
                insertText: "stroke",
                documentation: "Open stroke properties",
              },
              {
                key: "colorBoxAdjustments",
                label: "colorBoxAdjustments",
                insertText:
                  "colorBoxAdjustments: (${1:120}, ${2:48},  ${3:48},  ${4:48})",
                documentation: "Set group colorBoxAdjustments",
              },
              {
                key: "align",
                label: "align",
                insertText: "align: ",
                documentation: "Enable or disable group alignment",
              },
            ];

            const groupNamespaceChildren = {
              marker: [
                "marker.type",
                "marker.color",
                "marker.position",
                "marker.text",
                "marker.fontColor",
                "marker.fontFamily",
                "marker.fontSize",
                "marker.fontWeight",
                "marker.fontStyle",
                "marker.shift.top",
                "marker.shift.bottom",
                "marker.shift.left",
                "marker.shift.right",
              ],
              stroke: ["stroke.color", "stroke.style", "stroke.width"],
              shift: ["shift.top", "shift.bottom", "shift.left", "shift.right"],
              annotation: ANNOTATION_PROP_KEYS,
            };

            const isGroupNamespaceFullyUsed = (namespace) => {
              const children = groupNamespaceChildren[namespace] || [];
              return (
                children.length > 0 && children.every((key) => used.has(key))
              );
            };

            groupInlineItems
              .filter((item) => !used.has(item.key))
              .filter((item) => {
                if (
                  item.key === "marker" ||
                  item.key === "stroke" ||
                  item.key === "annotation"
                ) {
                  return !isGroupNamespaceFullyUsed(item.key);
                }
                return true;
              })
              .forEach((item, index) => {
                suggestions.push({
                  label: item.label,
                  kind: monaco.languages.CompletionItemKind.Property,
                  insertText: item.insertText,
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  detail: "group inline property",
                  documentation: item.documentation,
                  range,
                  sortText: `0group_inline_${index}`,
                });
              });

            return { suggestions };
          }
        }

        if (
          architectureInlineItemContext.section === "edges" &&
          architectureInlineItemContext.isAfterEquals &&
          !context.isAfterDot &&
          !context.methodCallContext
        ) {
          const archName = architectureBlockContext.architectureName;
          const blockName = architectureBlockContext.blockName;
          const block =
            context.architectureData?.[archName]?.blocks?.[blockName] || null;

          const edgeNameState = getArchitectureItemNameState(
            architectureInlineItemContext.currentItemText,
          );

          const edgeCtx = getArchitectureEdgeCompletionContext(
            architectureInlineItemContext.afterEqualsText,
            block,
            edgeNameState.itemName,
          );

          // If we're currently typing a property value, let the attribute-value branch handle it
          if (!context.isInAttributeValue) {
            if (edgeCtx.isEmpty) {
              pushEdgeEndpointSourceSuggestions(
                suggestions,
                monaco,
                range,
                block,
                edgeNameState.itemName,
              );
              return { suggestions };
            }

            if (edgeCtx.endsWithBareMember) {
              const sourceName = edgeCtx.bareMemberMatch?.[1];
              const isNode = edgeCtx.nodeNames.includes(sourceName);
              const isGroup = edgeCtx.groupNames.includes(sourceName);

              if (isNode || isGroup) {
                suggestions.push({
                  label: ".",
                  filterText: sourceName,
                  kind: monaco.languages.CompletionItemKind.Operator,
                  insertText: ".",
                  detail: "Anchor accessor",
                  documentation: `Continue from ${sourceName} with an anchor`,
                  range: {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endColumn: position.column,
                  },
                  sortText: "0dot",
                  command: {
                    id: "editor.action.triggerSuggest",
                    title: "Trigger suggest",
                  },
                });

                return { suggestions };
              }
            }

            if (edgeCtx.needsArrow) {
              suggestions.push({
                label: "->",
                kind: monaco.languages.CompletionItemKind.Operator,
                insertText: "-> ",
                detail: "Edge connector",
                documentation: "Connect source endpoint to target endpoint",
                range,
                sortText: "0arrow",
              });
              return { suggestions };
            }

            if (edgeCtx.needsTargetEndpoint) {
              pushEdgeEndpointSourceSuggestions(
                suggestions,
                monaco,
                range,
                block,
                edgeNameState.itemName,
              );
              return { suggestions };
            }

            if (edgeCtx.endsAfterTargetEndpoint) {
              pushConnectionInlineProps(
                suggestions,
                monaco,
                range,
                edgeCtx.usedProps,
                {
                  hasEdgeAnchorEndpoint: edgeCtx.hasEdgeAnchorEndpoint,
                  isNotStraight: edgeCtx.isNotStraight,
                },
              );
              return { suggestions };
            }

            if (edgeCtx.memberDotMatch) {
              const [, sourceName, memberPrefix] = edgeCtx.memberDotMatch;

              if (sourceName === edgeNameState.itemName) {
                return { suggestions: [] };
              }

              const anchorRange = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column - memberPrefix.length,
                endColumn: position.column,
              };

              pushAnchorSuggestionsForSource(
                suggestions,
                monaco,
                anchorRange,
                sourceName,
                block,
                { prefix: memberPrefix },
              );
              return { suggestions };
            }

            pushConnectionInlineProps(
              suggestions,
              monaco,
              range,
              edgeCtx.usedProps,
              {
                hasEdgeAnchorEndpoint: edgeCtx.hasEdgeAnchorEndpoint,
                isNotStraight: edgeCtx.isNotStraight,
              },
            );

            return { suggestions };
          }
        }

        const groupAfterEqualsText =
          architectureInlineItemContext.afterEqualsText || "";

        const isInsideGroupMembersValue = /\bmembers\s*:\s*\[[^\]]*$/.test(
          groupAfterEqualsText,
        );
        const isInsideGroupAnchorValue =
          /\banchor\s*:\s*([a-zA-Z_][a-zA-Z0-9_]*)?$/.test(
            groupAfterEqualsText,
          );

        if (
          architectureInlineItemContext.section === "groups" &&
          architectureInlineItemContext.isAfterEquals &&
          !context.isAfterDot &&
          !context.methodCallContext &&
          (!context.isInAttributeValue ||
            isInsideGroupMembersValue ||
            isInsideGroupAnchorValue)
        ) {
          const archName = architectureBlockContext.architectureName;
          const blockName = architectureBlockContext.blockName;
          const block =
            context.architectureData?.[archName]?.blocks?.[blockName] || null;

          const groupText = architectureInlineItemContext.afterEqualsText || "";
          const currentGroupName =
            architectureInlineItemContext.itemName || null;

          const anchorValueMatch = groupText.match(
            /\banchor\s*:\s*([a-zA-Z_][a-zA-Z0-9_]*)?$/,
          );

          if (anchorValueMatch) {
            const membersMatch = groupText.match(
              /\bmembers\s*:\s*\[([^\]]*)\]/,
            );

            const memberNames = membersMatch
              ? splitTopLevelArgs(membersMatch[1])
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];

            const anchorPrefix = anchorValueMatch[1] || "";
            const trimmedAnchorValue = anchorPrefix.trim();

            // Already completed with a valid member -> no popup
            if (
              trimmedAnchorValue &&
              memberNames.includes(trimmedAnchorValue)
            ) {
              return { suggestions: [] };
            }

            memberNames
              .filter((name) => !anchorPrefix || name.startsWith(anchorPrefix))
              .forEach((name, index) => {
                suggestions.push({
                  label: name,
                  kind: monaco.languages.CompletionItemKind.Variable,
                  insertText: name,
                  detail: "Group anchor member",
                  documentation: `Use member ${name} as anchor`,
                  range,
                  sortText: `0groupanchor_${index}`,
                });
              });

            return { suggestions };
          }

          const membersMatch = groupText.match(/members\s*:\s*\[([^\]]*)$/);

          if (membersMatch) {
            const membersText = membersMatch[1] || "";

            const rawParts = splitTopLevelArgs(membersText).map((s) =>
              s.trim(),
            );
            const endsWithComma = /,\s*$/.test(membersText);

            let currentPrefix = "";
            let alreadySelected = [];

            if (endsWithComma) {
              alreadySelected = rawParts.filter(Boolean);
              currentPrefix = "";
            } else {
              const nonEmptyParts = rawParts.filter(Boolean);
              currentPrefix =
                nonEmptyParts.length > 0
                  ? nonEmptyParts[nonEmptyParts.length - 1]
                  : "";
              alreadySelected = currentPrefix
                ? nonEmptyParts.slice(0, -1)
                : nonEmptyParts;
            }

            const allNodes = block?.nodes || [];
            const allGroups = block?.groups || [];

            // Use the latest occurrence, which is the row currently being edited
            const currentGroupIndex = currentGroupName
              ? allGroups.lastIndexOf(currentGroupName)
              : -1;

            // Only groups defined above the current row
            const previousGroups =
              currentGroupIndex >= 0
                ? allGroups.slice(0, currentGroupIndex)
                : allGroups;

            const available = [...allNodes, ...previousGroups]
              .filter((name) => !alreadySelected.includes(name))
              .filter(
                (name) => !currentPrefix || name.startsWith(currentPrefix),
              )
              .filter((name) => name !== currentPrefix);

            available.forEach((name, index) => {
              const isNode = allNodes.includes(name);

              suggestions.push({
                label: name,
                kind: monaco.languages.CompletionItemKind.Variable,
                insertText: name,
                detail: isNode ? "Group member node" : "Group member group",
                documentation: `Use ${name} in members`,
                range,
                sortText: isNode
                  ? `0group_node_${index}`
                  : `1group_row_${index}`,
              });
            });

            return { suggestions };
          }
          const membersDeclared = hasDeclaredGroupMembers(groupText);

          // Don't show the rest of the group properties until members exists
          if (!membersDeclared && !isEditingGroupMembers(groupText)) {
            return { suggestions: [] };
          }
          const used = getUsedInlineProps(groupText, [
            "members",
            "layout",
            "anchor",
            "marker",
            "marker.type",
            "marker.color",
            "marker.position",
            "marker.text",
            "marker.fontColor",
            "marker.fontFamily",
            "marker.fontSize",
            "marker.fontWeight",
            "marker.fontStyle",
            "marker.shift",
            "marker.shift.top",
            "marker.shift.bottom",
            "marker.shift.left",
            "marker.shift.right",
            "shape",
            "gap",
            "color",
            "colorBoxAdjustments",
            "align",
            ...ANNOTATION_PROP_KEYS,
          ]);
          const groupInlineItems = [
            ...ANNOTATION_SHIFT_KEYS.map((k) => ({
              key: `annotation.${k}`,
              label: `annotation.${k}`,
              insertText: `annotation.${k}: \${1:0}`,
              documentation: `Set group annotation ${k}`,
            })),
            {
              key: "members",
              label: "members",
              insertText: "members: [${1}]",
              documentation: "Set group members",
            },
            {
              key: "layout",
              label: "layout",
              insertText: "layout: ",
              documentation: "Set group layout",
            },
            {
              key: "anchor",
              label: "anchor",
              insertText: "anchor: ",
              documentation: "Set group anchor",
            },
            {
              key: "marker",
              label: "marker",
              insertText: "marker",
              documentation: "Open group marker properties",
            },
            {
              key: "shape",
              label: "shape",
              insertText: "shape: ",
              documentation: "Set group colorBox shape",
            },
            {
              key: "gap",
              label: "gap",
              insertText: "gap: ${1:10}",
              documentation: "Set group gap",
            },
            {
              key: "color",
              label: "color",
              insertText: "color: ",
              documentation: "Set group color",
            },
            {
              key: "stroke",
              label: "stroke",
              insertText: "stroke",
              documentation: "Open stroke properties",
            },
            {
              key: "colorBoxAdjustments",
              label: "colorBoxAdjustments",
              insertText:
                "colorBoxAdjustments: (${1:120}, ${2:48},  ${3:48},  ${4:48})",
              documentation: "Set group colorBoxAdjustments",
            },
            {
              key: "align",
              label: "align",
              insertText: "align: ",
              documentation: "Enable or disable group alignment",
            },
          ];

          groupInlineItems
            .filter((item) => !used.has(item.key))
            .forEach((item, index) => {
              suggestions.push({
                label: item.label,
                kind: monaco.languages.CompletionItemKind.Property,
                insertText: item.insertText,
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: "group inline property",
                documentation: item.documentation,
                range,
                sortText: `2group_inline_${index}`,
              });
            });

          return { suggestions };
        }

        function getNextEdgeName(block) {
          const existing = new Set(block?.edges || []);
          let i = 0;
          while (existing.has(`e${i}`)) i++;
          return `e${i}`;
        }

        function getNextGroupName(block) {
          const existing = new Set(block?.groups || []);
          let i = 0;
          while (existing.has(`row${i}`)) i++;
          return `row${i}`;
        }

        function getNextNodeName(block) {
          const existing = new Set(block?.nodes || []);
          let i = 0;
          while (existing.has(`node${i}`)) i++;
          return `node${i}`;
        }

        function isBlankOrEdgeNamePrefix(text) {
          const t = (text || "").trim();
          return t === "" || /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(t);
        }

        if (
          architectureSectionContext.insideEdges &&
          !context.isAfterDot &&
          !context.isInAttributeValue &&
          !context.methodCallContext
        ) {
          const archName = architectureBlockContext.architectureName;
          const blockName = architectureBlockContext.blockName;
          const block =
            context.architectureData?.[archName]?.blocks?.[blockName] || null;

          const rawCurrentItemPrefix =
            architectureInlineItemContext.currentItemText;
          const currentItemPrefix = rawCurrentItemPrefix.trim();
          const edgeNameState =
            getArchitectureItemNameState(rawCurrentItemPrefix);

          const nextEdgeName = getNextEdgeName(block);

          const edgeNameSuggestions = [nextEdgeName];

          const isExactEdgeNameMatch =
            edgeNameSuggestions.includes(currentItemPrefix);

          const shouldShowEdgeNameStage =
            shouldShowArchitectureItemStarters(
              model,
              position,
              rawCurrentItemPrefix,
            ) &&
            !isExactEdgeNameMatch &&
            (currentItemPrefix === "" ||
              /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(currentItemPrefix));

          // Stage 1: typing edge name only
          if (
            shouldShowEdgeNameStage &&
            !edgeNameState.isNameThenSpace &&
            !edgeNameState.isAfterEquals
          ) {
            [
              {
                label: nextEdgeName,
                insertText: `${nextEdgeName} = `,
                detail: "edge name",
                documentation: "Insert edge name",
                kind: monaco.languages.CompletionItemKind.Variable,
              },
            ].forEach((item, index) => {
              suggestions.push({
                label: item.label,
                kind: item.kind,
                insertText: item.insertText,
                insertTextRules:
                  item.kind === monaco.languages.CompletionItemKind.Snippet
                    ? monaco.languages.CompletionItemInsertTextRule
                        .InsertAsSnippet
                    : undefined,
                detail: item.detail,
                documentation: item.documentation,
                range,
                sortText: `0edge_name_${index}`,
                command:
                  item.kind === monaco.languages.CompletionItemKind.Snippet
                    ? {
                        id: "editor.action.triggerSuggest",
                        title: "Trigger suggest",
                      }
                    : undefined,
              });
            });

            return { suggestions };
          }

          // Stage 2: after "edgeName "
          if (edgeNameState.isNameThenSpace) {
            suggestions.push({
              label: "=",
              kind: monaco.languages.CompletionItemKind.Operator,
              insertText: "= ",
              detail: "Assign edge definition",
              documentation: `Start defining edge ${edgeNameState.itemName}`,
              range,
              sortText: "0edge_equals",
            });

            return { suggestions };
          }

          // Stage 3: after "edgeName = "
          if (edgeNameState.isAfterEquals) {
            const edgeCtx = getArchitectureEdgeCompletionContext(
              edgeNameState.afterEqualsText,
              block,
              edgeNameState.itemName,
            );

            if (!context.isInAttributeValue) {
              if (edgeCtx.isEmpty) {
                pushEdgeEndpointSourceSuggestions(
                  suggestions,
                  monaco,
                  range,
                  block,
                  edgeNameState.itemName,
                );
                return { suggestions };
              }

              if (edgeCtx.endsWithBareMember) {
                const sourceName = edgeCtx.bareMemberMatch?.[1];
                const isNode = (block?.nodes || []).includes(sourceName);
                const isGroup = (block?.groups || []).includes(sourceName);
                const isEdge =
                  (block?.edges || []).includes(sourceName) &&
                  sourceName !== edgeNameState.itemName;

                if (isNode || isGroup || isEdge) {
                  suggestions.push({
                    label: ".",
                    filterText: sourceName,
                    kind: monaco.languages.CompletionItemKind.Operator,
                    insertText: ".",
                    detail: "Endpoint accessor",
                    documentation: `Continue from ${sourceName} with an anchor`,
                    range: {
                      startLineNumber: position.lineNumber,
                      endLineNumber: position.lineNumber,
                      startColumn: position.column,
                      endColumn: position.column,
                    },
                    sortText: "0dot",
                    command: {
                      id: "editor.action.triggerSuggest",
                      title: "Trigger suggest",
                    },
                  });

                  return { suggestions };
                }
              }

              if (edgeCtx.needsArrow) {
                suggestions.push({
                  label: "->",
                  kind: monaco.languages.CompletionItemKind.Operator,
                  insertText: "-> ",
                  detail: "Edge connector",
                  documentation: "Connect source endpoint to target endpoint",
                  range,
                  sortText: "0arrow",
                });
                return { suggestions };
              }

              if (edgeCtx.needsTargetEndpoint) {
                pushEdgeEndpointSourceSuggestions(
                  suggestions,
                  monaco,
                  range,
                  block,
                  edgeNameState.itemName,
                );
                return { suggestions };
              }

              if (edgeCtx.endsAfterTargetEndpoint) {
                pushConnectionInlineProps(
                  suggestions,
                  monaco,
                  range,
                  edgeCtx.usedProps,
                  {
                    hasEdgeAnchorEndpoint: edgeCtx.hasEdgeAnchorEndpoint,
                    isNotStraight: edgeCtx.isNotStraight,
                  },
                );
                return { suggestions };
              }

              if (edgeCtx.memberDotMatch) {
                const sourceName = edgeCtx.memberDotMatch[1];
                const memberPrefix = edgeCtx.memberDotMatch[2] || "";

                if (sourceName === edgeNameState.itemName) {
                  return { suggestions: [] };
                }

                const anchorRange = {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column - memberPrefix.length,
                  endColumn: position.column,
                };

                pushAnchorSuggestionsForSource(
                  suggestions,
                  monaco,
                  anchorRange,
                  sourceName,
                  block,
                  { prefix: memberPrefix },
                );
                return { suggestions };
              }

              pushConnectionInlineProps(
                suggestions,
                monaco,
                range,
                edgeCtx.usedProps,
                {
                  hasEdgeAnchorEndpoint: edgeCtx.hasEdgeAnchorEndpoint,
                  isNotStraight: edgeCtx.isNotStraight,
                },
              );

              return { suggestions };
            }
          }
        }

        if (
          architectureSectionContext.insideNodes &&
          !context.isAfterDot &&
          !context.isInAttributeValue &&
          !context.methodCallContext
        ) {
          const archName = architectureBlockContext.architectureName;
          const blockName = architectureBlockContext.blockName;
          const block =
            context.architectureData?.[archName]?.blocks?.[blockName] || null;

          const rawCurrentItemPrefix =
            architectureInlineItemContext.currentItemText;
          const currentItemPrefix = rawCurrentItemPrefix.trim();
          const nodeNameState =
            getArchitectureItemNameState(rawCurrentItemPrefix);

          const nextNodeName = getNextNodeName(block);
          const nodeNameSuggestions = [nextNodeName];

          const isExactNodeNameMatch =
            nodeNameSuggestions.includes(currentItemPrefix);

          const shouldShowNodeNameStage =
            shouldShowArchitectureItemStarters(
              model,
              position,
              rawCurrentItemPrefix,
            ) &&
            !isExactNodeNameMatch &&
            (currentItemPrefix === "" ||
              /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(currentItemPrefix));

          // Stage 1: typing node name only
          if (
            shouldShowNodeNameStage &&
            !nodeNameState.isNameThenSpace &&
            !nodeNameState.isAfterEquals
          ) {
            [
              {
                label: nextNodeName,
                insertText: `${nextNodeName} = `,
                detail: "node name",
                documentation: "Insert next node name",
                kind: monaco.languages.CompletionItemKind.Variable,
              },
            ].forEach((item, index) => {
              suggestions.push({
                label: item.label,
                kind: item.kind,
                insertText: item.insertText,
                insertTextRules:
                  item.kind === monaco.languages.CompletionItemKind.Snippet
                    ? monaco.languages.CompletionItemInsertTextRule
                        .InsertAsSnippet
                    : undefined,
                detail: item.detail,
                documentation: item.documentation,
                range,
                sortText: `0node_name_${index}`,
                command:
                  item.kind === monaco.languages.CompletionItemKind.Snippet
                    ? {
                        id: "editor.action.triggerSuggest",
                        title: "Trigger suggest",
                      }
                    : undefined,
              });
            });

            return { suggestions };
          }

          // Stage 2: after "nodeName "
          if (nodeNameState.isNameThenSpace) {
            suggestions.push({
              label: "=",
              kind: monaco.languages.CompletionItemKind.Operator,
              insertText: "= ",
              detail: "Assign node definition",
              documentation: `Start defining node ${nodeNameState.itemName}`,
              range,
              sortText: "0node_equals",
            });

            return { suggestions };
          }

          // Stage 3: after "nodeName = "
          if (nodeNameState.isAfterEquals) {
            pushNodeInlinePropertySuggestions(
              suggestions,
              monaco,
              range,
              nodeNameState.afterEqualsText,
            );

            return { suggestions };
          }
        }

        if (
          context.isInComponentDefinition &&
          isImmediatelyAfterCompletedPropertyValue(model, position)
        ) {
          return { suggestions: [] };
        }

        // Component definition properties
        if (context.isInComponentDefinition && !context.isInAttributeValue) {
          const componentType = context.componentDefinitionType;

          const allProps =
            typeDocumentation[componentType]?.supportedProperties || [];

          const usedProps = getUsedTopLevelPropertiesInCurrentDefinition(
            model,
            position,
            componentType,
          );

          const remainingProps = allProps.filter(
            (prop) => !usedProps.has(prop),
          );

          const neuralNetworkPropertySnippets = {
            layers: {
              insertText: "layers: [$0]",
              documentation: "Layer labels for the neural network",
            },
            neurons: {
              insertText: "neurons: [[$1], [$2], [$3]]",
              documentation: "Neuron values grouped by layer",
            },
            layerColors: {
              insertText: "layerColors: [$1]",
              documentation: "Color for each layer",
            },
            layerStrokes: {
              insertText: "layerStrokes: [$1]",
              documentation: "Stroke for each layer",
            },
            neuronColors: {
              insertText: "neuronColors: [[$1], [$2], [$3]]",
              documentation: "Color for each neuron in each layer",
            },
            showBias: {
              insertText: "showBias: ",
              documentation: "Show or hide bias nodes",
            },
            showLabels: {
              insertText: "showLabels: ",
              documentation: "Show or hide layer labels",
            },
            labelPosition: {
              insertText: "labelPosition: ",
              documentation: "Position of layer labels",
            },
            showWeights: {
              insertText: "showWeights: ",
              documentation: "Show or hide weights",
            },
            showArrowheads: {
              insertText: "showArrowheads: ",
              documentation: "Show or hide arrowheads",
            },
            edgeWidth: {
              insertText: "edgeWidth: ${1:0.5}",
              documentation: "Edge width for neural network connections",
            },
            edgeColor: {
              insertText: "edgeColor: ",
              documentation: "Edge color for neural network connections",
            },
            layerSpacing: {
              insertText: "layerSpacing: ${1:120}",
              documentation: "Horizontal spacing between layers",
            },
            neuronSpacing: {
              insertText: "neuronSpacing: ${1:50}",
              documentation: "vertical spacing between neurons",
            },
          };

          remainingProps.forEach((prop) => {
            const neuralProp =
              componentType === "neuralnetwork"
                ? neuralNetworkPropertySnippets[prop]
                : null;

            suggestions.push({
              ...createPropertyOnlySuggestion(monaco, range, {
                label: prop,
                insertText: neuralProp?.insertText ?? `${prop}: `,
                detail: `${componentType} property`,
                documentation:
                  neuralProp?.documentation ||
                  typeDocumentation[componentType]?.description ||
                  "",
                sortText: `0prop_${prop}`,
              }),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              command: {
                id: "editor.action.triggerSuggest",
                title: "Trigger suggest",
              },
            });
          });

          return { suggestions };
        }
        // At the beginning of a line - suggest components and keywords
        if (context.isAtLineStart) {
          languageConfig.keywords.forEach((keyword) => {
            let insertText = keyword;
            let detail = "Keyword";

            if (keyword === "show") {
              insertText = `show \${1:variableName}`;
              detail = "Display variable";
            } else if (keyword === "hide") {
              insertText = `hide \${1:variableName}`;
              detail = "Hide variable";
            } else if (keyword === "page") {
              insertText = "page";
              detail = "Page break";
            }

            suggestions.push({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: insertText,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: detail,
              documentation: `${keyword} command`,
              range: range,
              sortText: `2${keyword}`,
            });
          });
        }

        // After 'show' or 'hide' keywords - suggest variable names
        if (context.isAfterShowHide && context.showHideMatch[2] === undefined) {
          context.variableNames.forEach((varName) => {
            const varType = context.variableTypes[varName];
            suggestions.push({
              label: varName,
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: varName,
              detail: `${varType} variable`,
              documentation: `Show/hide ${varName} (${varType})`,
              range: range,
              sortText: `0${varName}`,
            });
          });
        }

        // After 'show variableName' - suggest positioning
        if (context.isAfterShowHide && context.showHideMatch[2] !== undefined) {
          const [, command, varName] = context.showHideMatch;

          // Add named positions
          languageConfig.positionKeywords.forEach((pos) => {
            suggestions.push({
              label: pos,
              kind: monaco.languages.CompletionItemKind.Enum,
              insertText: pos,
              detail: "Named position",
              documentation: `Position element at ${pos}`,
              range: range,
              sortText: `0${pos}`,
            });
          });

          // Add smart coordinate suggestions based on grid layout
          if (context.gridLayout) {
            const smartSuggestions = getSmartPositionSuggestions(
              context.gridLayout,
            );
            smartSuggestions.forEach(({ coord, desc }, index) => {
              suggestions.push({
                label: coord,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: coord,
                detail: "Smart coordinate",
                documentation: `${desc} (based on ${context.gridLayout.cols}x${context.gridLayout.rows} grid)`,
                range: range,
                sortText: `0smart${index}`,
              });
            });
          } else {
            // Fallback to generic coordinate examples
            const coordinateExamples = [
              "(0, 0)",
              "(1, 0)",
              "(0, 1)",
              "(1, 1)",
              "(0, 2)",
              "(2, 0)",
              "(2, 1)",
              "(1, 2)",
            ];

            coordinateExamples.forEach((coord, index) => {
              suggestions.push({
                label: coord,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: coord,
                detail: "Coordinate position",
                documentation: `Position element at coordinates ${coord} (column, row)`,
                range: range,
                sortText: `1coord${index}`,
              });
            });
          }

          // Add range position suggestions
          const rangeExamples = [
            "(0..1, 0)",
            "(0, 0..1)",
            "(0..2, 0)",
            "(0, 0..2)",
            "(1..2, 0)",
            "(0..1, 1)",
            "(1..3, 0..1)",
          ];

          rangeExamples.forEach((range_pos, index) => {
            suggestions.push({
              label: range_pos,
              kind: monaco.languages.CompletionItemKind.Value,
              insertText: range_pos,
              detail: "Range position",
              documentation: `Position element spanning ${range_pos} (columns..columns, rows..rows)`,
              range: range,
              sortText: `2range${index}`,
            });
          });
        }

        // After 'page' keyword - suggest grid layouts
        if (context.isAfterPage) {
          const gridExamples = [
            { grid: "2x1", desc: "2 columns, 1 row" },
            { grid: "1x2", desc: "1 column, 2 rows" },
            { grid: "2x2", desc: "2 columns, 2 rows" },
            { grid: "3x1", desc: "3 columns, 1 row" },
            { grid: "1x3", desc: "1 column, 3 rows" },
            { grid: "3x2", desc: "3 columns, 2 rows" },
            { grid: "2x3", desc: "2 columns, 3 rows" },
            { grid: "4x2", desc: "4 columns, 2 rows" },
            { grid: "3x3", desc: "3 columns, 3 rows" },
            { grid: "4x3", desc: "4 columns, 3 rows" },
          ];

          gridExamples.forEach(({ grid, desc }, index) => {
            suggestions.push({
              label: grid,
              kind: monaco.languages.CompletionItemKind.Value,
              insertText: grid,
              detail: "Grid layout",
              documentation: `Create grid layout: ${desc}`,
              range: range,
              sortText: `0grid${index}`,
            });
          });

          // Add auto layout option
          suggestions.push({
            label: "(auto layout)",
            kind: monaco.languages.CompletionItemKind.Text,
            insertText: "",
            detail: "Auto layout",
            documentation:
              "Let Merlin automatically determine the optimal layout",
            range: range,
            sortText: "1auto",
          });
        }

        // Variable name suggestions in appropriate contexts
        if (
          !context.isAfterDot &&
          !context.isAfterShowHide &&
          !context.isAtLineStart &&
          !context.isInAttributeValue &&
          !context.isInComponentDefinition &&
          context.beforeCursor.length > 0
        ) {
          const isInVariableContext =
            context.beforeCursor.match(/^\s*\w*$/) || // Just typing a word at start of line
            context.beforeCursor.match(/\s+\w*$/) || // Typing a word after whitespace
            context.beforeCursor.match(/\(\w*$/) || // Inside function parentheses
            context.beforeCursor.match(/,\s*\w*$/) || // After comma in parameter list
            context.word.word.length > 0; // Currently typing a word

          if (isInVariableContext) {
            context.variableNames.forEach((varName) => {
              const varType = context.variableTypes[varName];

              // Calculate relevance score for better sorting
              let sortScore = 3;
              if (
                context.word.word &&
                varName
                  .toLowerCase()
                  .startsWith(context.word.word.toLowerCase())
              ) {
                sortScore = 0; // Highest priority for prefix matches
              } else if (
                context.word.word &&
                varName.toLowerCase().includes(context.word.word.toLowerCase())
              ) {
                sortScore = 1; // High priority for substring matches
              }

              suggestions.push({
                label: varName,
                kind: monaco.languages.CompletionItemKind.Variable,
                insertText: varName,
                detail: `${varType} variable`,
                documentation: `Reference to ${varName} (${varType})\n\nAvailable methods: ${getMethodsForType(varType).slice(0, 5).join(", ")}${getMethodsForType(varType).length > 5 ? "..." : ""}`,
                range: range,
                sortText: `${sortScore}${varName}`,
                filterText: varName, // Helps with fuzzy matching
              });
            });
          }
        }

        // Attribute suggestions when inside component declaration
        if (
          context.beforeCursor.includes("{") &&
          !context.beforeCursor.includes("}") &&
          !context.isInComponentDefinition
        ) {
          const openBraceIndex = context.beforeCursor.lastIndexOf("{");
          const textAfterBrace = context.beforeCursor.substring(
            openBraceIndex + 1,
          );

          // Check if we're in a component declaration
          const componentMatch = context.beforeCursor.match(
            /(\w+)\s+\w+\s*=\s*\{[^}]*$/,
          );
          if (componentMatch) {
            const componentType = componentMatch[1];
            if (languageConfig.components.includes(componentType)) {
              languageConfig.attributes.forEach((attr) => {
                let insertText = `${attr}: `;
                let documentation = `${attr} attribute for ${componentType}`;

                // Provide smart defaults based on attribute type
                if (attr === "value") {
                  insertText = `${attr}: [\${1:}]`;
                  documentation =
                    "Array of values for the data structure elements";
                } else if (attr === "color") {
                  insertText = `${attr}: [\${1:}]`;
                  documentation =
                    "Array of colors for the data structure elements";
                } else if (attr === "arrow") {
                  insertText = `${attr}: [\${1:}]`;
                  documentation =
                    "Array of arrows/labels for the data structure elements";
                } else if (attr === "nodes") {
                  insertText = `${attr}: [\${1:}]`;
                  documentation = "Array of node identifiers";
                } else if (attr === "edges") {
                  insertText = `${attr}: [\${1:}]`;
                  documentation =
                    'Array of edges in format ["nodeA-nodeB", ...]';
                } else if (attr === "id") {
                  insertText = `${attr}: "\${1:}"`;
                  documentation = "Unique identifier for the data structure";
                } else if (
                  attr.includes("Size") ||
                  attr.includes("Weight") ||
                  attr.includes("Spacing")
                ) {
                  insertText = `${attr}: \${1:16}`;
                  documentation = `Numeric value for ${attr}`;
                } else if (attr.includes("Family") || attr.includes("align")) {
                  insertText = `${attr}: "\${1:}"`;
                  documentation = `String value for ${attr}`;
                }

                suggestions.push({
                  label: attr,
                  kind: monaco.languages.CompletionItemKind.Property,
                  insertText: insertText,
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  detail: "Attribute",
                  documentation: documentation,
                  range: range,
                  sortText: `4${attr}`,
                });
              });
            }
          }
        }

        if (context.isInAttributeValue) {
          const [, attributeName, arrayContent] = context.attributeValueMatch;

          const architectureInlineSection =
            architectureInlineItemContext.section;

          if (
            (architectureInlineSection === "nodes" ||
              architectureInlineSection === "edges" ||
              architectureInlineSection === "groups") &&
            shouldSuppressArchitectureInlineValueSuggestions(
              architectureInlineSection,
              attributeName,
              arrayContent,
              languageConfig,
              architectureInlineItemContext,
            )
          ) {
            return { suggestions: [] };
          }

          const noSuggestStringAttributes = new Set([
            "title",
            "label",
            "opLabel",
            "gap",
            "size",
            "shift.top",
            "shift.bottom",
            "shift.right",
            "shift.left",
            "marker.text",
            "marker.fontSize",
            "marker.shift.top",
            "marker.shift.bottom",
            "marker.shift.left",
            "marker.shift.right",
            "outputLabels",
            "colorBoxAdjustments",
            "filterSpacing",
            "edgeAnchorOffset",
            "curveHeight",
            "width",
            "label.fontSize",
            "label.text",
            "subLabel.text",
            "subLabel.fontSize",
            "opLabel.text",
            "opLabel.fontSize",
            "opLabel.subtext",
            "stroke.width",
            "outerStroke.width",
            "annotation.fontSize",
            "annotation.top",
            "annotation.bottom",
            "annotation.left",
            "annotation.right",
            "annotation.top.shift",
            "annotation.top.shift.top",
            "annotation.top.shift.bottom",
            "annotation.top.shift.right",
            "annotation.top.shift.left",
            "annotation.bottom.shift",
            "annotation.bottom.shift.top",
            "annotation.bottom.shift.bottom",
            "annotation.bottom.shift.right",
            "annotation.bottom.shift.left",
            "annotation.right.shift",
            "annotation.right.shift.top",
            "annotation.right.shift.bottom",
            "annotation.right.shift.right",
            "annotation.right.shift.left",
            "annotation.left.shift",
            "annotation.left.shift.top",
            "annotation.left.shift.bottom",
            "annotation.left.shift.right",
            "annotation.left.shift.left",
            "fontSize",
          ]);
          if (noSuggestStringAttributes.has(attributeName)) {
            return { suggestions: [] };
          }

          if (diagramTopLevelContext.insideDiagramTopLevel) {
            if (attributeName === "rotateRight") {
              ["0", "1", "2", "3", "4"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: value,
                  detail: "rotateRight value",
                  documentation: `Set rotateRight to ${value}`,
                  range,
                  sortText: `0rotateRight${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "annotation.fontFamily") {
              languageConfig.fontFamilies.forEach((family, index) => {
                suggestions.push({
                  label: family,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: `"${family}"`,
                  detail: "Block annotation font family",
                  documentation: `Use ${family} as block annotation font family`,
                  range,
                  sortText: `0block_annotation_fontfamily_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "annotation.fontWeight") {
              languageConfig.fontWeightsArch.forEach((weight, index) => {
                suggestions.push({
                  label: weight,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: weight,
                  detail: "Block annotation font weight",
                  documentation: `Use font weight ${weight}`,
                  range,
                  sortText: `0block_annotation_fontweight_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "annotation.fontStyle") {
              languageConfig.fontStyles.forEach((style, index) => {
                suggestions.push({
                  label: style,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: style,
                  detail: "Block annotation font style",
                  documentation: `Use font style ${style}`,
                  range,
                  sortText: `0block_annotation_fontstyle_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "annotation.fontColor") {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default color",
                documentation: "Use default color",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Block annotation font color",
                  documentation: `Use ${color} color`,
                  range,
                  sortText: `1block_annotation_fontcolor_${index}`,
                });
              });

              return { suggestions };
            }
            if (attributeName === "layout") {
              ["horizontal", "vertical", "grid"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Diagram layout",
                  documentation: `Set diagram layout to ${value}`,
                  range,
                  sortText: `0diagramlayout${index}`,
                });
              });

              return { suggestions };
            }
          }

          if (diagramSectionContext.insideDiagramConnects) {
            if (attributeName === "transition") {
              ["default", "featureMap", "flatten", "fullyConnected"].forEach(
                (value, index) => {
                  suggestions.push({
                    label: value,
                    kind: monaco.languages.CompletionItemKind.EnumMember,
                    insertText: value,
                    detail: "Diagram connection transition",
                    documentation: `Set connection transition to ${value}`,
                    range,
                    sortText: `0diagram_transition_${index}`,
                  });
                },
              );

              return { suggestions };
            }
            if (attributeName === "shape") {
              ["straight", "bow", "arc"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Diagram connection shape",
                  documentation: `Set connection shape to ${value}`,
                  range,
                  sortText: `0diagram_shape_${index}`,
                });
              });

              return { suggestions };
            }
            if (attributeName === "style") {
              ["solid", "dashed", "dotted"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Diagram connection style",
                  documentation: `Set connection style to ${value}`,
                  range,
                  sortText: `0diagram_style_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "alignToIndexedPort") {
              ["true", "false"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: value,
                  detail: "Boolean",
                  documentation: `Set alignToIndexedPort to ${value}`,
                  range,
                  sortText: `0alignToIndexedPort${index}`,
                });
              });

              return { suggestions };
            }
            if (attributeName === "bidirectional") {
              ["true", "false"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: value,
                  detail: "Boolean",
                  documentation: `Set bidirectional to ${value}`,
                  range,
                  sortText: `0bidirectional${index}`,
                });
              });

              return { suggestions };
            }
            if (attributeName === "arrowheads") {
              const connectText = getCurrentDiagramConnectText(model, position);
              const allowedArrowheads =
                getAllowedArrowheadValuesForShapeText(connectText);

              allowedArrowheads.forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: value,
                  detail: "Arrowheads count",
                  documentation: `Set arrowheads to ${value}`,
                  range,
                  sortText: `0diagram_arrowheads_${index}`,
                });
              });

              return { suggestions };
            }

            if (
              attributeName === "color" ||
              attributeName === "label.fontColor"
            ) {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default color",
                documentation: "Use default color",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Named color",
                  documentation: `Use ${color} color`,
                  range,
                  sortText: `1diagram_color_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "transition") {
              ["default", "featureMap", "flatten", "fullyConnected"].forEach(
                (value, index) => {
                  suggestions.push({
                    label: value,
                    kind: monaco.languages.CompletionItemKind.EnumMember,
                    insertText: value,
                    detail: "Edge transition",
                    documentation: `Set edge transition to ${value}`,
                    range,
                    sortText: `0edgetransition${index}`,
                  });
                },
              );

              return { suggestions };
            }
          }

          if (
            (diagramTopLevelContext.insideDiagramTopLevel ||
              diagramSectionContext.insideDiagramConnects === false) &&
            attributeName === "uses"
          ) {
            const usesText = getCurrentDiagramUsesText(model, position);
            const currentArchitecture = currentArchitectureName
              ? context.architectureData?.[currentArchitectureName]
              : null;

            if (currentArchitecture) {
              const rawSegment = getTrailingTopLevelSegment(usesText);
              const trimmedSegment = rawSegment.trim();
              const endsWithComma = /,\s*$/.test(usesText);

              const availableBlocks =
                getAvailableBlocksForDiagramUses(currentArchitecture);

              const parsedUseAfterAnchorKeywordMatch = trimmedSegment.match(
                /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+anchor\s*:\s*$/,
              );

              const parsedUseWithAnchorMatch = trimmedSegment.match(
                /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+anchor\s*:\s*([a-zA-Z_][a-zA-Z0-9_]*)?$/,
              );

              const parsedUseNeedsAnchorKeywordMatch = trimmedSegment.match(
                /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+$/,
              );

              if (trimmedSegment === "" || endsWithComma) {
                availableBlocks.forEach((blockName, index) => {
                  const defaultAlias = blockName[0].toLowerCase();

                  suggestions.push({
                    label: `${defaultAlias} = ${blockName}`,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: `${defaultAlias} = ${blockName}`,
                    detail: "diagram use alias",
                    documentation: `Alias block ${blockName}`,
                    range,
                    sortText: `0diagram_use_tpl_${index}`,
                  });
                });

                return { suggestions };
              }

              if (parsedUseAfterAnchorKeywordMatch) {
                const [, alias, blockName] = parsedUseAfterAnchorKeywordMatch;
                const anchors = getAvailableAnchorsForDiagramUse(
                  currentArchitecture,
                  blockName,
                );

                anchors.forEach((nodeName, index) => {
                  suggestions.push({
                    label: nodeName,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: nodeName,
                    detail: `Anchor node in ${blockName}`,
                    documentation: `Use node ${nodeName} as anchor for alias ${alias}`,
                    range,
                    sortText: `0diagram_use_anchor_${index}`,
                  });
                });

                return { suggestions };
              }

              if (parsedUseWithAnchorMatch) {
                const [, alias, blockName, anchorPrefix = ""] =
                  parsedUseWithAnchorMatch;
                const anchors = getAvailableAnchorsForDiagramUse(
                  currentArchitecture,
                  blockName,
                );

                if (anchors.includes(anchorPrefix)) {
                  return { suggestions: [] };
                }

                anchors
                  .filter(
                    (nodeName) =>
                      !anchorPrefix || nodeName.startsWith(anchorPrefix),
                  )
                  .forEach((nodeName, index) => {
                    suggestions.push({
                      label: nodeName,
                      kind: monaco.languages.CompletionItemKind.Variable,
                      insertText: nodeName,
                      detail: `Anchor node in ${blockName}`,
                      documentation: `Use node ${nodeName} as anchor for alias ${alias}`,
                      range,
                      sortText: `0diagram_use_anchor_${index}`,
                    });
                  });

                return { suggestions };
              }

              if (parsedUseNeedsAnchorKeywordMatch) {
                const [, alias, blockName] = parsedUseNeedsAnchorKeywordMatch;
                const availableForAlias = getAvailableBlocksForDiagramUses(
                  currentArchitecture,
                  alias,
                );

                if (availableForAlias.includes(blockName)) {
                  suggestions.push({
                    label: "anchor",
                    kind: monaco.languages.CompletionItemKind.Property,
                    insertText: "anchor: ",
                    detail: "Use anchor property",
                    documentation: `Choose an anchor node from block ${blockName}`,
                    range: {
                      startLineNumber: position.lineNumber,
                      endLineNumber: position.lineNumber,
                      startColumn: position.column,
                      endColumn: position.column,
                    },
                    sortText: "0diagram_use_anchor_keyword",
                    command: {
                      id: "editor.action.triggerSuggest",
                      title: "Trigger suggest",
                    },
                  });

                  return { suggestions };
                }
              }

              const aliasBlockThenSpaceMatch = rawSegment.match(
                /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+$/,
              );

              const aliasEqualsMatch = trimmedSegment.match(
                /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)$/,
              );

              if (aliasBlockThenSpaceMatch) {
                const [, currentAlias, blockName] = aliasBlockThenSpaceMatch;

                const availableForAlias = getAvailableBlocksForDiagramUses(
                  currentArchitecture,
                  currentAlias,
                );

                if (availableForAlias.includes(blockName)) {
                  suggestions.push({
                    label: "anchor",
                    kind: monaco.languages.CompletionItemKind.Property,
                    insertText: "anchor: ",
                    detail: "diagram use property",
                    documentation: `Choose an anchor node from block ${blockName}`,
                    range: {
                      startLineNumber: position.lineNumber,
                      endLineNumber: position.lineNumber,
                      startColumn: position.column,
                      endColumn: position.column,
                    },
                    sortText: "0diagram_use_anchor",
                    command: {
                      id: "editor.action.triggerSuggest",
                      title: "Trigger suggest",
                    },
                  });

                  return { suggestions };
                }
              }

              if (aliasEqualsMatch) {
                const currentAlias = aliasEqualsMatch[1];
                const blockPrefix = aliasEqualsMatch[2];

                const availableForAlias = getAvailableBlocksForDiagramUses(
                  currentArchitecture,
                  currentAlias,
                );

                if (availableForAlias.includes(blockPrefix)) {
                  return { suggestions: [] };
                }

                availableForAlias
                  .filter((blockName) => blockName.startsWith(blockPrefix))
                  .forEach((blockName, index) => {
                    suggestions.push({
                      label: blockName,
                      kind: monaco.languages.CompletionItemKind.Variable,
                      insertText: blockName,
                      detail: "Architecture block",
                      documentation: `Use block ${blockName} in diagram alias`,
                      range,
                      sortText: `0diagram_use_block_${index}`,
                    });
                  });

                return { suggestions };
              }

              const aliasWaitingForBlockMatch = trimmedSegment.match(
                /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*$/,
              );

              if (aliasWaitingForBlockMatch) {
                const currentAlias = aliasWaitingForBlockMatch[1];

                getAvailableBlocksForDiagramUses(
                  currentArchitecture,
                  currentAlias,
                ).forEach((blockName, index) => {
                  suggestions.push({
                    label: blockName,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: blockName,
                    detail: "Architecture block",
                    documentation: `Use block ${blockName} in diagram alias`,
                    range,
                    sortText: `0diagram_use_block_${index}`,
                  });
                });

                return { suggestions };
              }
            }
          }
          if (
            architectureSectionContext.insideGroups ||
            architectureInlineItemContext.section === "groups"
          ) {
            if (
              attributeName === "annotation.fontFamily" ||
              attributeName === "marker.fontFamily"
            ) {
              languageConfig.fontFamilies.forEach((family, index) => {
                suggestions.push({
                  label: family,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: `"${family}"`,
                  detail: "font family",
                  documentation: `Use ${family} as font family`,
                  range,
                  sortText: `0groupfontfamily_${index}`,
                });
              });

              return { suggestions };
            }

            if (
              attributeName === "annotation.fontWeight" ||
              attributeName === "marker.fontWeight"
            ) {
              languageConfig.fontWeightsArch.forEach((weight, index) => {
                suggestions.push({
                  label: weight,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: weight,
                  detail: "font weight",
                  documentation: `Use font weight ${weight}`,
                  range,
                  sortText: `0groupfontweight_${index}`,
                });
              });

              return { suggestions };
            }

            if (
              attributeName === "annotation.fontStyle" ||
              attributeName === "marker.fontStyle"
            ) {
              languageConfig.fontStyles.forEach((style, index) => {
                suggestions.push({
                  label: style,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: style,
                  detail: "font style",
                  documentation: `Use font style ${style}`,
                  range,
                  sortText: `0groupfontstyle_${index}`,
                });
              });

              return { suggestions };
            }

            if (
              attributeName === "annotation.fontColor" ||
              attributeName === "marker.fontColor" ||
              attributeName === "marker.color"
            ) {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default color",
                documentation: "Use default color",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "font color",
                  documentation: `Use ${color} color`,
                  range,
                  sortText: `1groupfontcolor_${index}`,
                });
              });

              return { suggestions };
            }
            if (attributeName === "align") {
              ["true", "false"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: value,
                  detail: "Boolean",
                  documentation: `Set align to ${value}`,
                  range,
                  sortText: `0groupalign${index}`,
                });
              });

              return { suggestions };
            }
            if (attributeName === "layout") {
              ["horizontal", "vertical", "grid"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Group layout",
                  documentation: `Set group layout to ${value}`,
                  range,
                  sortText: `0grouplayout${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "stroke.style") {
              ["solid", "dashed", "dotted"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Stroke style",
                  documentation: `Set strokeStyle to ${value}`,
                  range,
                  sortText: `0strokestyle${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "stroke.color") {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default stroke",
                documentation: "Use default stroke",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Named color",
                  documentation: `Use ${color} stroke`,
                  range,
                  sortText: `1groupcolor${index}`,
                });
              });

              return { suggestions };
            }

            if (
              attributeName === "color" ||
              attributeName === "label.fontColor"
            ) {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default color",
                documentation: "Use default color",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Named color",
                  documentation: `Use ${color} color`,
                  range,
                  sortText: `1groupcolor${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "shape") {
              ["rounded"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Group colorBox shape",
                  documentation: `Set group colorBox shape to ${value}`,
                  range,
                  sortText: `0groupshape${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "marker.type") {
              ["bracket", "brace"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Group marker type",
                  documentation: `Set markerType to ${value}`,
                  range,
                  sortText: `0groupmarkertype${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "marker.position") {
              ["top", "bottom"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Group marker position",
                  documentation: `Set markerPosition to ${value}`,
                  range,
                  sortText: `0groupmarkerposition${index}`,
                });
              });

              return { suggestions };
            }

            if (
              attributeName === "anchor.source" ||
              attributeName === "anchor.target"
            ) {
              function getLeafNodeMembersFromGroup(
                block,
                groupName,
                visited = new Set(),
              ) {
                if (!block || !groupName || visited.has(groupName)) return [];

                visited.add(groupName);

                const groupDef = block.groupMembers?.[groupName] || [];
                const result = [];

                for (const member of groupDef) {
                  if ((block.nodes || []).includes(member)) {
                    result.push(member);
                    continue;
                  }

                  if ((block.groups || []).includes(member)) {
                    result.push(
                      ...getLeafNodeMembersFromGroup(block, member, visited),
                    );
                  }
                }

                return [...new Set(result)];
              }
              const groupText =
                architectureInlineItemContext.afterEqualsText || "";
              const currentGroupName =
                architectureInlineItemContext.itemName || null;

              const archName = architectureBlockContext.architectureName;
              const blockName = architectureBlockContext.blockName;
              const block =
                context.architectureData?.[archName]?.blocks?.[blockName] ||
                null;

              const membersMatch = groupText.match(
                /\bmembers\s*:\s*\[([^\]]*)\]/,
              );
              const memberNames = membersMatch
                ? splitTopLevelArgs(membersMatch[1])
                    .map((s) => parseMerlinScalar(s))
                    .filter(Boolean)
                : [];

              const leafNodes = memberNames.flatMap((member) => {
                if ((block?.nodes || []).includes(member)) return [member];
                if ((block?.groups || []).includes(member)) {
                  return getLeafNodeMembersFromGroup(block, member);
                }
                return [];
              });

              [...new Set(leafNodes)].forEach((name, index) => {
                suggestions.push({
                  label: name,
                  kind: monaco.languages.CompletionItemKind.Variable,
                  insertText: name,
                  detail: "Leaf node member",
                  documentation: `Use leaf node ${name} for ${attributeName}`,
                  range,
                  sortText: `0groupanchorleaf${index}`,
                });
              });

              return { suggestions };
            }
          }

          if (
            architectureSectionContext.insideNodes ||
            architectureInlineItemContext.section === "nodes"
          ) {
            const afterEqualsText =
              architectureInlineItemContext.afterEqualsText || "";
            const detectedTypeMatch = afterEqualsText.match(
              /\btype\s*:\s*([a-zA-Z_][a-zA-Z0-9_]*)/,
            );
            const detectedType = detectedTypeMatch?.[1] ?? null;

            if (
              attributeName === "label.fontFamily" ||
              attributeName === "annotation.fontFamily" ||
              attributeName === "opLabel.fontFamily" ||
              attributeName === "subLabel.fontFamily"
            ) {
              languageConfig.fontFamilies.forEach((family, index) => {
                suggestions.push({
                  label: family,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: `"${family}"`,
                  detail: "SVG font family",
                  documentation: `Use ${family} as font family`,
                  range,
                  sortText: `0fontfamily${index}`,
                });
              });

              return { suggestions };
            }

            if (
              attributeName === "label.fontWeight" ||
              attributeName === "annotation.fontWeight" ||
              attributeName === "opLabel.fontWeight" ||
              attributeName === "subLabel.fontWeight"
            ) {
              languageConfig.fontWeightsArch.forEach((weight, index) => {
                suggestions.push({
                  label: weight,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: weight,
                  detail: "Font weight",
                  documentation: `Use font weight ${weight}`,
                  range,
                  sortText: `0fontweight${index}`,
                });
              });

              return { suggestions };
            }

            if (
              attributeName === "label.fontStyle" ||
              attributeName === "annotation.fontStyle" ||
              attributeName === "opLabel.fontStyle" ||
              attributeName === "subLabel.fontStyle" ||
              attributeName === "marker.fontStyle"
            ) {
              languageConfig.fontStyles.forEach((style, index) => {
                suggestions.push({
                  label: style,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: style,
                  detail: "Font style",
                  documentation: `Use font style ${style}`,
                  range,
                  sortText: `0fontstyle${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "direction") {
              ["right", "left", "top", "bottom"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Trapezoid direction",
                  documentation: `Render the trapezoid slant toward ${value}`,
                  range,
                  sortText: `0trapezoid_direction_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "label.orientation") {
              const valueText = String(arrayContent ?? "");
              const state = getLabelOrientationState(valueText);

              // Block popup after accepting a complete token
              if (
                state.stage === "done" ||
                state.stage === "first-complete-waiting-comma" ||
                state.stage === "second-complete-waiting-close"
              ) {
                return { suggestions: [] };
              }

              if (state.stage === "first-editing") {
                suggestions.push({
                  label: "vertical",
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: "vertical",
                  detail: "Orientation",
                  documentation:
                    "Only vertical is supported for the first slot",
                  range,
                  sortText: "0labelorientation_vertical",
                });

                return { suggestions };
              }

              if (
                state.stage === "second-empty" ||
                state.stage === "second-editing"
              ) {
                ["right", "left"].forEach((value, index) => {
                  suggestions.push({
                    label: value,
                    kind: monaco.languages.CompletionItemKind.EnumMember,
                    insertText: value,
                    detail: "Label side",
                    documentation: `Place the vertical label on the ${value}`,
                    range,
                    sortText: `0labelorientation_side_${index}`,
                  });
                });

                return { suggestions };
              }

              return { suggestions: [] };
            }
            if (attributeName === "shape") {
              const linePrefix = model
                .getLineContent(position.lineNumber)
                .substring(0, position.column - 1);

              if (detectedType === "flatten") {
                suggestions.push({
                  label: "rows x columns",
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: "${1:10}x${2:10}",
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  detail: "2D shape",
                  documentation: "Flatten shape in the form height x width",
                  range,
                  sortText: "0shape_snippet",
                });

                return { suggestions };
              }

              if (detectedType === "stacked") {
                suggestions.push({
                  label: "depth x height x width",
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: "${1:10}x${2:10}x${3:10}",
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  detail: "3D shape",
                  documentation:
                    "Stacked shape in the form depth x height x width",
                  range,
                  sortText: "0shape_snippet",
                });

                return { suggestions };
              }

              if (detectedType === "fullyConnected") {
                const shapeArrayOpenMatch = linePrefix.match(
                  /\bshape\s*:\s*\[[^\]]*$/,
                );

                // Once the user is already inside the array, don't keep re-suggesting
                // the full snippet.
                if (shapeArrayOpenMatch) {
                  return { suggestions: [] };
                }

                suggestions.push({
                  label:
                    "[neurons_layer1, neurons_layer2, neurons_layer3, ...]",
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: "[${1:24}, ${2:12}, ${3:6}, ${4:3}]",
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  detail: "Layer sizes",
                  documentation:
                    "Fully connected shape as layer sizes: layer 1 neurons, layer 2 neurons, etc.",
                  range,
                  sortText: "0shape_snippet",
                });

                return { suggestions };
              }
            }

            if (
              attributeName === "color" ||
              attributeName === "label.fontColor" ||
              attributeName === "annotation.fontColor" ||
              attributeName === "opLabel.fontColor" ||
              attributeName === "subLabel.fontColor"
            ) {
              if (detectedType === "fullyConnected") {
                const linePrefix = model
                  .getLineContent(position.lineNumber)
                  .substring(0, position.column - 1);

                const colorArrayMatch = linePrefix.match(
                  /\bcolor\s*:\s*\[([^\]]*)$/,
                );

                // Cursor is inside the fullyConnected color array:
                // color: ["red", "blue", |
                if (colorArrayMatch) {
                  const innerText = colorArrayMatch[1];
                  const itemCtx = getArrayItemCompletionContext(innerText);

                  const itemRange = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn:
                      position.column -
                      itemCtx.currentSegment.length +
                      itemCtx.replaceCurrentSegmentStartOffset,
                    endColumn: position.column,
                  };

                  suggestions.push({
                    label: "null",
                    kind: monaco.languages.CompletionItemKind.Constant,
                    insertText: "null",
                    detail: "Default color",
                    documentation: "Use default color for this layer",
                    range: itemRange,
                    sortText: "0null",
                  });

                  languageConfig.namedColors
                    .filter(
                      (color) =>
                        !itemCtx.currentPrefix ||
                        color
                          .toLowerCase()
                          .startsWith(itemCtx.currentPrefix.toLowerCase()),
                    )
                    .forEach((color, index) => {
                      suggestions.push({
                        label: color,
                        kind: monaco.languages.CompletionItemKind.Color,
                        insertText: `"${color}"`,
                        detail: "Layer color",
                        documentation: `Use ${color} color`,
                        range: itemRange,
                        sortText: `1fc_color_${index.toString().padStart(3, "0")}`,
                      });
                    });

                  return { suggestions };
                }

                // Cursor is right after `color:` and not yet inside an array
                suggestions.push({
                  label: "[FirstLayerColor, SecondLayerColor, ...]",
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: '["${1:blue}", "${2:red}", "${3:yellow}"]',
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  detail: "Layer colors",
                  documentation: "Color for each fully connected layer",
                  range,
                  sortText: "0fc_color_array",
                });

                return { suggestions };
              }

              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default color",
                documentation: "Use default color",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Named color",
                  documentation: `Use ${color} color`,
                  range,
                  sortText: `1nodecolor${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "stroke.style") {
              ["solid", "dashed", "dotted"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Stroke style",
                  documentation: `Set strokeStyle to ${value}`,
                  range,
                  sortText: `0strokestyle${index}`,
                });
              });

              return { suggestions };
            }
            if (attributeName === "outerStroke.style") {
              ["solid", "dashed", "dotted"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Outer stroke style",
                  documentation: `Set outerStrokeStyle to ${value}`,
                  range,
                  sortText: `0outerstrokestyle${index}`,
                });
              });

              return { suggestions };
            }

            if (
              attributeName === "stroke.color" ||
              attributeName === "outerStroke.color"
            ) {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default color",
                documentation: "Use default color",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Named color",
                  documentation: `Use ${color} color`,
                  range,
                  sortText: `1strokecolor${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "type") {
              [
                "rect",
                "circle",
                "arrow",
                "text",
                "stacked",
                "flatten",
                "fullyConnected",
                "trapezoid",
              ].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Node type",
                  documentation: `Set node type to ${value}`,
                  range,
                  sortText: `0nodetype${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "shape") {
              ["rounded"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Node shape",
                  documentation: `Set node shape to ${value}`,
                  range,
                  sortText: `0nodeshape${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "kernelSize") {
              suggestions.push({
                label: "filter height x filter width",
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: "${1:10}x${2:10}",
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: "2D shape",
                documentation: "filter shape in the form height x width",
                range,
                sortText: "0shape_snippet",
              });
              return { suggestions };
            }
          }

          if (
            architectureSectionContext.insideEdges ||
            architectureInlineItemContext.section === "edges"
          ) {
            if (attributeName === "label.fontFamily") {
              languageConfig.fontFamilies.forEach((family, index) => {
                suggestions.push({
                  label: family,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: `"${family}"`,
                  detail: "Edge label font family",
                  documentation: `Use ${family} as edge label font family`,
                  range,
                  sortText: `0edge_fontfamily_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "label.fontWeight") {
              languageConfig.fontWeightsArch.forEach((weight, index) => {
                suggestions.push({
                  label: weight,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: weight,
                  detail: "Edge label font weight",
                  documentation: `Use font weight ${weight}`,
                  range,
                  sortText: `0edge_fontweight_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "label.fontStyle") {
              languageConfig.fontStyles.forEach((style, index) => {
                suggestions.push({
                  label: style,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: style,
                  detail: "Edge label font style",
                  documentation: `Use font style ${style}`,
                  range,
                  sortText: `0edge_fontstyle_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "transition") {
              ["default", "featureMap", "flatten", "fullyConnected"].forEach(
                (value, index) => {
                  suggestions.push({
                    label: value,
                    kind: monaco.languages.CompletionItemKind.EnumMember,
                    insertText: value,
                    detail: "Edge transition",
                    documentation: `Set edge transition to ${value}`,
                    range,
                    sortText: `0edgetransition${index}`,
                  });
                },
              );

              return { suggestions };
            }

            if (attributeName === "shape") {
              ["straight", "bow", "arc"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Edge shape",
                  documentation: `Set edge shape to ${value}`,
                  range,
                  sortText: `0edgeshape${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "style") {
              ["solid", "dashed", "dotted"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Edge style",
                  documentation: `Set edge style to ${value}`,
                  range,
                  sortText: `0edgestyle${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "alignToIndexedPort") {
              ["true", "false"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: value,
                  detail: "Boolean",
                  documentation: `Set alignToIndexedPort to ${value}`,
                  range,
                  sortText: `0alignToIndexedPort${index}`,
                });
              });

              return { suggestions };
            }
            if (attributeName === "bidirectional") {
              ["true", "false"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: value,
                  detail: "Boolean",
                  documentation: `Set bidirectional to ${value}`,
                  range,
                  sortText: `0bidirectional${index}`,
                });
              });

              return { suggestions };
            }
            if (attributeName === "arrowheads") {
              const allowedArrowheads = getAllowedArrowheadValuesForShapeText(
                architectureInlineItemContext.afterEqualsText || "",
              );
              allowedArrowheads.forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: value,
                  detail: "Arrowheads count",
                  documentation: `Set arrowheads to ${value}`,
                  range,
                  sortText: `0arrowheads${index}`,
                });
              });

              return { suggestions };
            }

            if (
              attributeName === "color" ||
              attributeName === "label.fontColor"
            ) {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default color",
                documentation: "Use default color",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Named color",
                  documentation: `Use ${color} color`,
                  range,
                  sortText: `1edgecolor${index}`,
                });
              });

              return { suggestions };
            }
          }

          if (architectureBlockContext.insideArchitectureBlockTopLevel) {
            if (attributeName === "fontFamily") {
              languageConfig.fontFamilies.forEach((family, index) => {
                suggestions.push({
                  label: family,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: `"${family}"`,
                  detail: "Block font family",
                  documentation: `Use ${family} as block font family`,
                  range,
                  sortText: `0block_fontfamily_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "fontWeight") {
              languageConfig.fontWeightsArch.forEach((weight, index) => {
                suggestions.push({
                  label: weight,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: weight,
                  detail: "Block font weight",
                  documentation: `Use font weight ${weight}`,
                  range,
                  sortText: `0block_fontweight_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "fontStyle") {
              languageConfig.fontStyles.forEach((style, index) => {
                suggestions.push({
                  label: style,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: style,
                  detail: "Block font style",
                  documentation: `Use font style ${style}`,
                  range,
                  sortText: `0block_fontstyle_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "fontColor") {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default color",
                documentation: "Use default color",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Block font color",
                  documentation: `Use ${color} color`,
                  range,
                  sortText: `1block_fontcolor_${index}`,
                });
              });

              return { suggestions };
            }
            if (attributeName === "stroke.style") {
              ["solid", "dashed", "dotted"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Stroke style",
                  documentation: `Set strokeStyle to ${value}`,
                  range,
                  sortText: `0strokestyle${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "stroke.color") {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default stroke",
                documentation: "Use default stroke",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Named color",
                  documentation: `Use ${color} stroke`,
                  range,
                  sortText: `1groupcolor${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "annotation.fontFamily") {
              languageConfig.fontFamilies.forEach((family, index) => {
                suggestions.push({
                  label: family,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: `"${family}"`,
                  detail: "Block annotation font family",
                  documentation: `Use ${family} as block annotation font family`,
                  range,
                  sortText: `0block_annotation_fontfamily_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "annotation.fontWeight") {
              languageConfig.fontWeightsArch.forEach((weight, index) => {
                suggestions.push({
                  label: weight,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: weight,
                  detail: "Block annotation font weight",
                  documentation: `Use font weight ${weight}`,
                  range,
                  sortText: `0block_annotation_fontweight_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "annotation.fontStyle") {
              languageConfig.fontStyles.forEach((style, index) => {
                suggestions.push({
                  label: style,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: style,
                  detail: "Block annotation font style",
                  documentation: `Use font style ${style}`,
                  range,
                  sortText: `0block_annotation_fontstyle_${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "annotation.fontColor") {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default color",
                documentation: "Use default color",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Block annotation font color",
                  documentation: `Use ${color} color`,
                  range,
                  sortText: `1block_annotation_fontcolor_${index}`,
                });
              });

              return { suggestions };
            }
            if (attributeName === "layout") {
              ["horizontal", "vertical", "grid"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Block layout",
                  documentation: `Set block layout to ${value}`,
                  range,
                  sortText: `0blocklayout${index}`,
                });
              });

              return { suggestions };
            }

            if (attributeName === "shape") {
              ["rounded"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Block shape",
                  documentation: `Set block shape to ${value}`,
                  range,
                  sortText: `0blockshape${index}`,
                });
              });

              return { suggestions };
            }

            if (
              attributeName === "color" ||
              attributeName === "label.fontColor"
            ) {
              suggestions.push({
                label: "null",
                kind: monaco.languages.CompletionItemKind.Constant,
                insertText: "null",
                detail: "Default color",
                documentation: "Use default color",
                range,
                sortText: "0null",
              });

              languageConfig.namedColors.forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Block color",
                  documentation: `Set block color to ${color}`,
                  range,
                  sortText: `1blockcolor${index}`,
                });
              });

              return { suggestions };
            }
          }

          if (
            architectureSectionContext.insideNodes ||
            architectureInlineItemContext.section === "nodes"
          ) {
            if (attributeName === "shape") {
              ["rounded"].forEach((value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: value,
                  detail: "Node shape",
                  documentation: `Set node shape to ${value}`,
                  range,
                  sortText: `0nodeshape${index}`,
                });
              });

              return { suggestions };
            }
          }

          const booleanAttrs = new Set([
            "showBias",
            "showLabels",
            "showWeights",
            "showArrowheads",
          ]);

          if (booleanAttrs.has(attributeName)) {
            suggestions.push(
              {
                label: "true",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "true",
                detail: "Boolean",
                range,
                sortText: "0true",
              },
              {
                label: "false",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "false",
                detail: "Boolean",
                range,
                sortText: "1false",
              },
            );

            return { suggestions };
          }

          if (attributeName === "edgeColor") {
            suggestions.push({
              label: "null",
              kind: monaco.languages.CompletionItemKind.Constant,
              insertText: "null",
              detail: "Default color",
              documentation: "Use default edge color",
              range,
              sortText: "0null",
            });

            languageConfig.namedColors.forEach((color, index) => {
              suggestions.push({
                label: color,
                kind: monaco.languages.CompletionItemKind.Color,
                insertText: `"${color}"`,
                detail: "Named color",
                documentation: `Use ${color} color`,
                range,
                sortText: `1edgecolor${index}`,
              });
            });

            return { suggestions };
          }

          if (attributeName === "edgeWidth") {
            ["0", "0.01", "0.05", "0.1", "0.25", "0.5", "0.75", "1"].forEach(
              (value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: value,
                  detail: "Edge width",
                  documentation: `Set edgeWidth to ${value}`,
                  range,
                  sortText: `0edgewidth${index}`,
                });
              },
            );

            return { suggestions };
          }

          if (attributeName === "layerSpacing") {
            ["40", "60", "80", "100", "120", "160", "200"].forEach(
              (value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: value,
                  detail: "Layer spacing",
                  documentation: `Set layerSpacing to ${value}`,
                  range,
                  sortText: `0layerspacing${index}`,
                });
              },
            );

            return { suggestions };
          }

          if (attributeName === "neuronSpacing") {
            ["40", "60", "80", "100", "120", "160", "200"].forEach(
              (value, index) => {
                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: value,
                  detail: "Neurons spacing",
                  documentation: `Set neuronSpacing to ${value}`,
                  range,
                  sortText: `0neuronspacing${index}`,
                });
              },
            );

            return { suggestions };
          }

          if (attributeName === "labelPosition") {
            const linePrefix = model
              .getLineContent(position.lineNumber)
              .substring(0, position.column - 1);

            const match = linePrefix.match(/\blabelPosition\s*:\s*(.*)$/);
            if (!match) {
              return { suggestions: [] };
            }

            const valueText = match[1];

            if (
              /^\s*"bottom"\s*$/.test(valueText) ||
              /^\s*"top"\s*$/.test(valueText)
            ) {
              return { suggestions: [] };
            }

            suggestions.push(
              {
                label: "bottom",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "bottom",
                detail: "Label position",
                documentation: 'Set labelPosition to "bottom"',
                range,
                sortText: "0bottom",
              },
              {
                label: "top",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "top",
                detail: "Label position",
                documentation: 'Set labelPosition to "top"',
                range,
                sortText: "1top",
              },
            );

            return { suggestions };
          }

          if (attributeName === "neurons") {
            const linePrefix = model
              .getLineContent(position.lineNumber)
              .substring(0, position.column - 1);

            const neuronsMatch = linePrefix.match(/\bneurons\s*:\s*\[(.*)$/);

            if (!neuronsMatch) {
              return { suggestions: [] };
            }

            const neuronsText = neuronsMatch[1];

            // We only want to suggest when the cursor is inside an inner layer array:
            // neurons: [[...], [...], [...]]
            const lastOpenBracket = neuronsText.lastIndexOf("[");
            const lastCloseBracket = neuronsText.lastIndexOf("]");

            if (lastOpenBracket === -1 || lastOpenBracket < lastCloseBracket) {
              return { suggestions: [] };
            }

            // Text inside the current inner [...]
            const innerText = neuronsText.slice(lastOpenBracket + 1);
            const itemCtx = getArrayItemCompletionContext(innerText);

            const neuronSuggestions = [
              "1",
              "2",
              "3",
              "4",
              "5",
              "8",
              "10",
              "16",
              "32",
              "64",
              "128",
              "256",
              "512",
              "x1",
              "x2",
              "x3",
              "h1",
              "h2",
              "h3",
              "z1",
              "z2",
              "y",
              "output",
            ];

            const itemRange = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn:
                position.column -
                itemCtx.currentSegment.length +
                itemCtx.replaceCurrentSegmentStartOffset,
              endColumn: position.column,
            };

            neuronSuggestions
              .filter(
                (value) =>
                  !itemCtx.currentPrefix ||
                  value
                    .toLowerCase()
                    .startsWith(itemCtx.currentPrefix.toLowerCase()),
              )
              .forEach((value, index) => {
                const isNumber = !Number.isNaN(Number(value));

                suggestions.push({
                  label: value,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: isNumber ? value : `"${value}"`,
                  detail: "Neuron value",
                  documentation: `Use neuron value ${isNumber ? value : `"${value}"`}`,
                  range: itemRange,
                  sortText: `0neuron_item_${index}`,
                });
              });

            return { suggestions };
          }

          if (attributeName === "neuronColors") {
            const linePrefix = model
              .getLineContent(position.lineNumber)
              .substring(0, position.column - 1);

            const neuronColorsMatch = linePrefix.match(
              /\bneuronColors\s*:\s*\[(.*)$/,
            );

            if (!neuronColorsMatch) {
              return { suggestions: [] };
            }

            const neuronColorsText = neuronColorsMatch[1];

            // neuronColors: [[...], [...], [...]]
            const lastOpenBracket = neuronColorsText.lastIndexOf("[");
            const lastCloseBracket = neuronColorsText.lastIndexOf("]");

            if (lastOpenBracket === -1 || lastOpenBracket < lastCloseBracket) {
              return { suggestions: [] };
            }

            const innerText = neuronColorsText.slice(lastOpenBracket + 1);
            const itemCtx = getArrayItemCompletionContext(innerText);

            const itemRange = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn:
                position.column -
                itemCtx.currentSegment.length +
                itemCtx.replaceCurrentSegmentStartOffset,
              endColumn: position.column,
            };

            // same style as "color"
            suggestions.push({
              label: "null",
              kind: monaco.languages.CompletionItemKind.Constant,
              insertText: "null",
              detail: "Default color",
              documentation: "Use default color for this element",
              range: itemRange,
              sortText: "0null",
            });

            languageConfig.namedColors
              .filter(
                (color) =>
                  !itemCtx.currentPrefix ||
                  color
                    .toLowerCase()
                    .startsWith(itemCtx.currentPrefix.toLowerCase()),
              )
              .forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Named color",
                  documentation: `Use ${color} color`,
                  range: itemRange,
                  sortText: `1color${index.toString().padStart(3, "0")}`,
                });
              });

            return { suggestions };
          }

          if (attributeName === "layers") {
            const linePrefix = model
              .getLineContent(position.lineNumber)
              .substring(0, position.column - 1);

            const layersMatch = linePrefix.match(/\blayers\s*:\s*\[([^\]]*)$/);

            if (!layersMatch) {
              return { suggestions: [] };
            }

            const innerText = layersMatch[1];
            const itemCtx = getArrayItemCompletionContext(innerText);

            const layerNameSuggestions = [
              "input",
              "embedding",
              "token",
              "positional",
              "attention",
              "multihead",
              "add",
              "norm1",
              "ffn",
              "linear1",
              "activation",
              "linear2",
              "norm2",
              "hidden",
              "hidden1",
              "hidden2",
              "output",
            ];

            const itemRange = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn:
                position.column -
                itemCtx.currentSegment.length +
                itemCtx.replaceCurrentSegmentStartOffset,
              endColumn: position.column,
            };

            layerNameSuggestions
              .filter(
                (name) =>
                  !itemCtx.currentPrefix ||
                  name
                    .toLowerCase()
                    .startsWith(itemCtx.currentPrefix.toLowerCase()),
              )
              .forEach((name, index) => {
                suggestions.push({
                  label: name,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: `"${name}"`,
                  detail: "Layer name",
                  documentation: `Use layer name "${name}"`,
                  range: itemRange,
                  sortText: `0layer_item_${index}`,
                });
              });

            return { suggestions };
          }

          if (attributeName === "layerStrokes") {
            const linePrefix = model
              .getLineContent(position.lineNumber)
              .substring(0, position.column - 1);

            const match = linePrefix.match(/\blayerStrokes\s*:\s*\[([^\]]*)$/);
            if (!match) {
              return { suggestions: [] };
            }

            const innerText = match[1];
            const itemCtx = getArrayItemCompletionContext(innerText);

            const itemRange = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn:
                position.column -
                itemCtx.currentSegment.length +
                itemCtx.replaceCurrentSegmentStartOffset,
              endColumn: position.column,
            };

            suggestions.push({
              label: "null",
              kind: monaco.languages.CompletionItemKind.Constant,
              insertText: "null",
              detail: "Default stroke",
              documentation: "Use default stroke for this element",
              range: itemRange,
              sortText: "0null",
            });

            languageConfig.namedColors
              .filter(
                (color) =>
                  !itemCtx.currentPrefix ||
                  color
                    .toLowerCase()
                    .startsWith(itemCtx.currentPrefix.toLowerCase()),
              )
              .forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Named color",
                  documentation: `Use ${color} stroke`,
                  range: itemRange,
                  sortText: `1color${index.toString().padStart(3, "0")}`,
                });
              });

            return { suggestions };
          }

          if (attributeName === "layerColors") {
            const linePrefix = model
              .getLineContent(position.lineNumber)
              .substring(0, position.column - 1);

            const match = linePrefix.match(/\blayerColors\s*:\s*\[([^\]]*)$/);
            if (!match) {
              return { suggestions: [] };
            }

            const innerText = match[1];
            const itemCtx = getArrayItemCompletionContext(innerText);

            const itemRange = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn:
                position.column -
                itemCtx.currentSegment.length +
                itemCtx.replaceCurrentSegmentStartOffset,
              endColumn: position.column,
            };

            suggestions.push({
              label: "null",
              kind: monaco.languages.CompletionItemKind.Constant,
              insertText: "null",
              detail: "Default color",
              documentation: "Use default color for this element",
              range: itemRange,
              sortText: "0null",
            });

            languageConfig.namedColors
              .filter(
                (color) =>
                  !itemCtx.currentPrefix ||
                  color
                    .toLowerCase()
                    .startsWith(itemCtx.currentPrefix.toLowerCase()),
              )
              .forEach((color, index) => {
                suggestions.push({
                  label: color,
                  kind: monaco.languages.CompletionItemKind.Color,
                  insertText: `"${color}"`,
                  detail: "Named color",
                  documentation: `Use ${color} color`,
                  range: itemRange,
                  sortText: `1color${index.toString().padStart(3, "0")}`,
                });
              });

            return { suggestions };
          }
          if (
            attributeName === "color" ||
            attributeName === "label.fontColor"
          ) {
            // Add null first
            suggestions.push({
              label: "null",
              kind: monaco.languages.CompletionItemKind.Constant,
              insertText: "null",
              detail: "Default color",
              documentation: "Use default color for this element",
              range: range,
              sortText: "0null",
            });

            // Add color suggestions
            languageConfig.namedColors.forEach((color, index) => {
              suggestions.push({
                label: color,
                kind: monaco.languages.CompletionItemKind.Color,
                insertText: `"${color}"`,
                detail: "Named color",
                documentation: `Use ${color} color`,
                range: range,
                sortText: `1color${index.toString().padStart(3, "0")}`,
              });
            });
          } else if (attributeName === "nodes") {
            // Suggest common node names
            const commonNodes = [
              "root",
              "node1",
              "node2",
              "node3",
              "A",
              "B",
              "C",
              "client",
              "server",
              "router",
            ];
            commonNodes.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: `"${nodeName}"`,
                detail: "Node identifier",
                documentation: `Node named ${nodeName}`,
                range: range,
                sortText: `1node${index}`,
              });
            });
          } else if (attributeName === "edges") {
            // If we have nodes in context, suggest edge combinations
            if (context.nodeData.allNodes.length > 0) {
              const edgeSuggestions = [];
              for (
                let i = 0;
                i < Math.min(context.nodeData.allNodes.length, 5);
                i++
              ) {
                for (
                  let j = i + 1;
                  j < Math.min(context.nodeData.allNodes.length, 5);
                  j++
                ) {
                  edgeSuggestions.push(
                    `${context.nodeData.allNodes[i]}-${context.nodeData.allNodes[j]}`,
                  );
                }
              }
              edgeSuggestions.forEach((edge, index) => {
                suggestions.push({
                  label: edge,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: `"${edge}"`,
                  detail: "Edge connection",
                  documentation: `Connect ${edge.replace("-", " to ")}`,
                  range: range,
                  sortText: `1edge${index}`,
                });
              });
            }
          } else if (attributeName === "align") {
            languageConfig.alignValues.forEach((align, index) => {
              suggestions.push({
                label: align,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: `"${align}"`,
                detail: "Text alignment",
                documentation: `Align text to ${align}`,
                range: range,
                sortText: `1align${index}`,
              });
            });
          } else if (attributeName === "fontWeight") {
            languageConfig.fontWeights.forEach((weight, index) => {
              suggestions.push({
                label: weight,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: `${weight}`,
                detail: "Font weight",
                documentation: `Font weight: ${weight}`,
                range: range,
                sortText: `1weight${index}`,
              });
            });
          } else if (attributeName === "fontFamily") {
            languageConfig.fontFamilies.forEach((family, index) => {
              suggestions.push({
                label: family,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: `"${family}"`,
                detail: "Font family",
                documentation: `Font family: ${family}`,
                range: range,
                sortText: `1family${index}`,
              });
            });
          }
        }

        // Position keywords when appropriate
        if (
          context.beforeCursor.match(/:\s*$/) ||
          context.beforeCursor.match(/=\s*$/)
        ) {
          languageConfig.positionKeywords.forEach((pos) => {
            suggestions.push({
              label: pos,
              kind: monaco.languages.CompletionItemKind.Enum,
              insertText: `"${pos}"`,
              detail: "Position",
              documentation: `Position keyword: ${pos}`,
              range: range,
              sortText: `5${pos}`,
            });
          });
        }

        // Inside parentheses for positioning - suggest coordinate patterns
        if (context.isInsideParens) {
          const [, content] = context.insideParensMatch;

          // If no content yet, suggest common coordinates
          if (content.trim() === "") {
            if (context.gridLayout) {
              const smartSuggestions = getSmartPositionSuggestions(
                context.gridLayout,
              );
              smartSuggestions.slice(0, 6).forEach(({ coord, desc }, index) => {
                // Remove parentheses since we're already inside them
                const coordContent = coord.replace(/[()]/g, "");
                suggestions.push({
                  label: coordContent,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: coordContent,
                  detail: "Smart coordinate",
                  documentation: `${desc} (based on ${context.gridLayout.cols}x${context.gridLayout.rows} grid)`,
                  range: range,
                  sortText: `0smart${index}`,
                });
              });
            } else {
              const coordSuggestions = [
                { coord: "0, 0", desc: "Top-left position" },
                { coord: "1, 0", desc: "Second column, first row" },
                { coord: "0, 1", desc: "First column, second row" },
                { coord: "1, 1", desc: "Second column, second row" },
                { coord: "0..1, 0", desc: "Span first two columns, first row" },
                { coord: "0, 0..1", desc: "First column, span first two rows" },
              ];

              coordSuggestions.forEach(({ coord, desc }, index) => {
                suggestions.push({
                  label: coord,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: coord,
                  detail: "Coordinate",
                  documentation: desc,
                  range: range,
                  sortText: `0coord${index}`,
                });
              });
            }
          }

          // If there's a comma, suggest row values
          if (content.includes(",") && !content.includes("..")) {
            const afterComma = content.split(",").pop().trim();
            if (afterComma === "") {
              let rowSuggestions = ["0", "1", "2", "3", "0..1", "0..2", "1..2"];

              // If we know the grid size, limit suggestions to valid rows
              if (context.gridLayout) {
                rowSuggestions = [];
                for (let row = 0; row < context.gridLayout.rows; row++) {
                  rowSuggestions.push(row.toString());
                }
                // Add some range suggestions
                if (context.gridLayout.rows > 1) {
                  rowSuggestions.push("0..1");
                  if (context.gridLayout.rows > 2) {
                    rowSuggestions.push(`0..${context.gridLayout.rows - 1}`);
                  }
                }
              }

              rowSuggestions.forEach((row, index) => {
                suggestions.push({
                  label: row,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: row,
                  detail: "Row",
                  documentation: context.gridLayout
                    ? `Row ${row} (grid has ${context.gridLayout.rows} rows)`
                    : `Row ${row}`,
                  range: range,
                  sortText: `0row${index}`,
                });
              });
            }
          }
        }

        return { suggestions };
      } catch (error) {
        console.error("Error in completion provider:", error);
        return { suggestions: [] };
      }
    },
  });

  // Register a secondary completion provider for general word suggestions (no trigger characters)
  monaco.languages.registerCompletionItemProvider("customLang", {
    provideCompletionItems: function (model, position) {
      try {
        if (isImmediatelyAfterInlinePropertyComma(model, position)) {
          return { suggestions: [] };
        }

        const context = analyzeContext(model, position);

        const architectureSectionContext = getArchitectureSectionContext(
          model,
          position,
        );
        const diagramSectionContext = getArchitectureDiagramSectionContext(
          model,
          position,
        );
        const diagramTopLevelContext = getArchitectureDiagramTopLevelContext(
          model,
          position,
        );
        const architectureTopLevelContext = getArchitectureTopLevelContext(
          model,
          position,
        );
        const architectureBlockContext = getArchitectureBlockContext(
          model,
          position,
        );

        if (
          isAfterCompletedTopLevelArchProperty(model, position) &&
          (architectureTopLevelContext.insideArchitectureTopLevel ||
            architectureBlockContext.insideArchitectureBlockTopLevel ||
            diagramTopLevelContext.insideDiagramTopLevel) &&
          !architectureSectionContext.insideNodes &&
          !architectureSectionContext.insideEdges &&
          !architectureSectionContext.insideGroups &&
          !diagramSectionContext.insideDiagramConnects &&
          !diagramSectionContext.insideDiagramUses
        ) {
          return { suggestions: [] };
        }

        const currentArchitectureName = getArchitectureNameAtPosition(
          model,
          position,
        );
        const currentArchitecture = currentArchitectureName
          ? context.architectureData?.[currentArchitectureName]
          : null;

        const architectureInlineItemContext = getArchitectureInlineItemContext(
          model,
          position,
        );

        if (
          architectureInlineItemContext.section === "edges" &&
          architectureInlineItemContext.isAfterEquals
        ) {
          const archName = architectureBlockContext.architectureName;

          const blockName = architectureBlockContext.blockName;

          const block =
            context.architectureData?.[archName]?.blocks?.[blockName] || null;

          const edgeNameState = getArchitectureItemNameState(
            architectureInlineItemContext.currentItemText,
          );

          const edgeCtx = getArchitectureEdgeCompletionContext(
            architectureInlineItemContext.afterEqualsText,
            block,
            edgeNameState.itemName,
          );

          if (
            edgeCtx.isEmpty ||
            edgeCtx.endsWithBareMember ||
            edgeCtx.memberDotMatch ||
            edgeCtx.needsArrow ||
            edgeCtx.needsTargetEndpoint
          ) {
            return { suggestions: [] };
          }
        }

        if (diagramSectionContext.insideDiagramConnects) {
          const connectText = getCurrentDiagramConnectText(model, position);
          const connectCtx = getDiagramConnectCompletionContext(
            connectText,
            currentArchitecture,
          );

          if (
            connectCtx.isEmpty ||
            connectCtx.endsWithBareAlias ||
            connectCtx.aliasDotMatch ||
            connectCtx.aliasMemberAnchorMatch ||
            connectCtx.needsArrow ||
            connectCtx.needsTargetEndpoint ||
            connectCtx.memberNeedsDot
          ) {
            return { suggestions: [] };
          }
        }
        if (!context.word || context.word.word.length < 2)
          return { suggestions: [] }; // Only show for 2+ characters

        if (context.isInComponentDefinition) {
          return { suggestions: [] };
        }

        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: context.word.startColumn,
          endColumn: context.word.endColumn,
        };

        const suggestions = [];

        // Filter variables by what's being typed
        const currentWord = context.word.word.toLowerCase();
        const matchingVariables = context.variableNames.filter((varName) =>
          varName.toLowerCase().includes(currentWord),
        );

        // Add matching variables with high priority
        matchingVariables.forEach((varName) => {
          const varType = context.variableTypes[varName];
          let sortScore = varName.toLowerCase().startsWith(currentWord)
            ? "0"
            : "1";

          suggestions.push({
            label: varName,
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: varName,
            detail: `${varType} variable`,
            documentation: `${varName} is a ${varType} data structure`,
            range: range,
            sortText: `${sortScore}${varName}`,
            filterText: varName,
          });
        });

        // Add matching keywords
        const matchingKeywords = languageConfig.keywords.filter((keyword) =>
          keyword.toLowerCase().includes(currentWord),
        );

        matchingKeywords.forEach((keyword) => {
          let sortScore = keyword.toLowerCase().startsWith(currentWord)
            ? "0"
            : "2";
          suggestions.push({
            label: keyword,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: keyword,
            detail: "Keyword",
            documentation: `${keyword} command`,
            range: range,
            sortText: `${sortScore}${keyword}`,
          });
        });

        // Add matching component types with basic templates
        const matchingComponents = languageConfig.components.filter(
          (component) => component.toLowerCase().includes(currentWord),
        );

        matchingComponents.forEach((component) => {
          let sortScore = component.toLowerCase().startsWith(currentWord)
            ? "0"
            : "2";

          // Add simple component declaration with suggestion
          const componentDocumentation = typeDocumentation[component];
          suggestions.push({
            label: component,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: buildInsertTextWithPageShow(
              componentDocumentation.insertText ||
                `${component} \${1:variableName} = {\n\t\${2:}\n}`,
              component,
              model,
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "Data structure type",
            documentation:
              componentDocumentation.description ||
              `${component} data structure`,
            range: range,
            sortText: `${sortScore}${component}`,
            filterText: component,
          });
        });

        return { suggestions };
      } catch (error) {
        console.error("Error in secondary completion provider:", error);
        return { suggestions: [] };
      }
    },
  });

  // Register a completion provider specifically for method arguments
  monaco.languages.registerCompletionItemProvider("customLang", {
    triggerCharacters: ["(", ",", " ", '"', ".", "-"],
    provideCompletionItems: function (model, position) {
      try {
        if (isImmediatelyAfterInlinePropertyComma(model, position)) {
          return { suggestions: [] };
        }
        const context = analyzeContext(model, position);

        if (!context.methodCallContext) {
          return { suggestions: [] };
        }

        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: context.word.startColumn,
          endColumn: context.word.endColumn,
        };

        const { variableName, methodName, parameterIndex } =
          context.methodCallContext;

        // Safety checks to prevent undefined errors
        if (!variableName || !methodName || parameterIndex === undefined) {
          return { suggestions: [] };
        }

        const varType = context.variableTypes[variableName];
        const suggestions = [];

        // Add null suggestion for most parameters
        if (
          !(methodName === "showBlock" && parameterIndex === 0) &&
          !(methodName === "hideBlock" && parameterIndex === 0) &&
          !(
            methodName === "showEdge" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "hideEdge" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "showNode" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "hideNode" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "removeGroup" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(methodName === "removeBlock" && parameterIndex === 0) &&
          !(
            methodName === "setGroupAnnotation" &&
            (parameterIndex === 0 ||
              parameterIndex === 1 ||
              parameterIndex === 2)
          ) &&
          !(
            methodName === "setGroupColor" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "setGroupLayout" &&
            (parameterIndex === 0 ||
              parameterIndex === 1 ||
              parameterIndex === 2)
          ) &&
          !(
            methodName === "setBlockLayout" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "setBlockAnnotation" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(methodName === "setBlockColor" && parameterIndex === 0) &&
          !(
            methodName === "removeEdges" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "removeEdge" &&
            (parameterIndex === 0 || parameterIndex === 1) &&
            varType === "architecture"
          ) &&
          !(
            methodName === "setEdgeColor" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "setEdgeLabel" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "setEdgeShape" &&
            (parameterIndex === 0 ||
              parameterIndex === 1 ||
              parameterIndex === 2)
          ) &&
          !(
            methodName === "setNodeAnnotation" &&
            (parameterIndex === 0 ||
              parameterIndex === 1 ||
              parameterIndex === 2)
          ) &&
          !(
            methodName === "setNodeStroke" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "setNodeColor" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "setNodeLabel" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "setNodeShape" &&
            (parameterIndex === 0 ||
              parameterIndex === 1 ||
              parameterIndex === 2)
          ) &&
          !(
            methodName === "removeNodes" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "removeNode" &&
            (parameterIndex === 0 || parameterIndex === 1) &&
            varType === "architecture"
          ) &&
          !(
            methodName === "setNeuronColor" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(
            methodName === "setNeuron" &&
            (parameterIndex === 0 || parameterIndex === 1)
          ) &&
          !(methodName === "setLayer" && parameterIndex === 0) &&
          !(methodName === "setLayerColor" && parameterIndex === 0) &&
          !(methodName === "addNeurons" && parameterIndex === 0) &&
          !(methodName === "removeLayerAt" && parameterIndex === 0) &&
          !(
            methodName === "removeNeuronsFromLayer" &&
            (parameterIndex === 0 || parameterIndex === 1)
          )
        ) {
          suggestions.push({
            label: "null",
            kind: monaco.languages.CompletionItemKind.Constant,
            insertText: "null",
            detail: "Null value",
            documentation: "Use default value or skip this element",
            range: range,
            sortText: "0null",
          });
        }

        if (methodName === "showBlock") {
          const a = context.architectureData?.[variableName];
          const hiddenBlocks = a?.blockOrder?.filter(
            (blockName) => a?.blocks?.[blockName].hidden,
          );

          if (parameterIndex === 0) {
            (hiddenBlocks || []).forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "hideBlock") {
          const a = context.architectureData?.[variableName];
          const nonHiddenBlocks = a?.blockOrder?.filter(
            (blockName) => !a?.blocks?.[blockName].hidden,
          );

          if (parameterIndex === 0) {
            (nonHiddenBlocks || []).forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "showEdge") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];

            const hiddenEdges = a?.blocks?.[selectedBlock].hiddenEdges || [];

            hiddenEdges.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Edge name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "hideEdge") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];

            const allEdges = a?.blocks?.[selectedBlock].edges || [];

            allEdges.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Edge name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "showNode") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];

            const hiddenNodes = a?.blocks?.[selectedBlock].hiddenNodes || [];

            hiddenNodes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Node name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "hideNode") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];

            const allNodes = a?.blocks?.[selectedBlock].nodes || [];

            allNodes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Node name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setGroupAnnotation") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];

            const allNodes = a?.blocks?.[selectedBlock].groups || [];

            allNodes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Group name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 2) {
            ["left", "right", "bottom", "top"].forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: `${num}`,
                detail: "Side name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 3) {
            ["Important", "left part", "right part"].forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: `"${num}"`,
                detail: "Annotation",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setGroupLayout") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];
            const allGroups = a?.blocks?.[selectedBlock]?.groups || [];

            allGroups.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Group name",
                range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 2) {
            ["vertical", "horizontal", "grid"].forEach((layout, index) => {
              suggestions.push({
                label: layout,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: layout,
                detail: "Group layout",
                documentation: `Set group layout to ${layout}`,
                range,
                sortText: `1layout${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setGroupColor") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];

            const allNodes = a?.blocks?.[selectedBlock].groups || [];

            allNodes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Group name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 2) {
            languageConfig.namedColors.forEach((color, index) => {
              suggestions.push({
                label: color,
                kind: monaco.languages.CompletionItemKind.Color,
                insertText: `"${color}"`,
                detail: "Named color",
                documentation: `Use ${color} color`,
                range: range,
                sortText: `1color${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setBlockAnnotation") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            ["left", "right", "bottom", "top"].forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: `${num}`,
                detail: "Side name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 2) {
            ["Important", "left part", "right part"].forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: `"${num}"`,
                detail: "Annotation",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setBlockLayout") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            ["vertical", "horizontal", "grid"].forEach((layout, index) => {
              suggestions.push({
                label: layout,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: layout,
                detail: "Block layout",
                documentation: `Set block layout to ${layout}`,
                range,
                sortText: `1layout${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setBlockColor") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }
          if (parameterIndex === 1) {
            languageConfig.namedColors.forEach((color, index) => {
              suggestions.push({
                label: color,
                kind: monaco.languages.CompletionItemKind.Color,
                insertText: `"${color}"`,
                detail: "Named color",
                documentation: `Use ${color} color`,
                range: range,
                sortText: `1color${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "removeEdges") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const firstParamOptions = [...(a?.blockOrder || [])];

            if ((a?.diagram?.connections || []).length > 0) {
              firstParamOptions.push("diagram");
            }

            firstParamOptions.forEach((name, index) => {
              suggestions.push({
                label: name,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: name,
                detail:
                  name === "diagram" ? "Diagram connections" : "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedTarget = args[0]?.trim();

            if (selectedTarget === "diagram") {
              const diagramConnections = a?.diagram?.connections || [];

              diagramConnections.forEach((_, index) => {
                suggestions.push({
                  label: String(index),
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: String(index),
                  detail: "Diagram edge index",
                  range: range,
                  sortText: `1diagramindex${index}`,
                });
              });
            } else {
              const blockEdges = a?.blocks?.[selectedTarget]?.edges || [];

              blockEdges.forEach((edgeName, index) => {
                suggestions.push({
                  label: edgeName,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: edgeName,
                  detail: "Edge name",
                  range: range,
                  sortText: `1blockedge${index}`,
                });
              });
            }
          }

          return { suggestions };
        }

        if (methodName === "removeBlock") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((blockName, index) => {
              suggestions.push({
                label: blockName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: blockName,
                detail: "Block name",
                documentation: `Remove block ${blockName}`,
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "removeGroup") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];
            const allGroups = a?.blocks?.[selectedBlock]?.groups || [];

            allGroups.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Group name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "removeEdge" && varType === "architecture") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const firstParamOptions = [...(a?.blockOrder || [])];

            if ((a?.diagram?.connections || []).length > 0) {
              firstParamOptions.push("diagram");
            }

            firstParamOptions.forEach((name, index) => {
              suggestions.push({
                label: name,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: name,
                detail:
                  name === "diagram" ? "Diagram connections" : "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedTarget = args[0]?.trim();

            if (selectedTarget === "diagram") {
              const diagramConnections = a?.diagram?.connections || [];

              diagramConnections.forEach((_, index) => {
                suggestions.push({
                  label: String(index),
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: String(index),
                  detail: "Diagram edge index",
                  range: range,
                  sortText: `1diagramindex${index}`,
                });
              });
            } else {
              const blockEdges = a?.blocks?.[selectedTarget]?.edges || [];

              blockEdges.forEach((edgeName, index) => {
                suggestions.push({
                  label: edgeName,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: edgeName,
                  detail: "Edge name",
                  range: range,
                  sortText: `1blockedge${index}`,
                });
              });
            }
          }

          return { suggestions };
        }

        if (methodName === "setEdgeColor") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const firstParamOptions = [...(a?.blockOrder || [])];

            if ((a?.diagram?.connections || []).length > 0) {
              firstParamOptions.push("diagram");
            }

            firstParamOptions.forEach((name, index) => {
              suggestions.push({
                label: name,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: name,
                detail:
                  name === "diagram" ? "Diagram connections" : "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedTarget = args[0]?.trim();

            if (selectedTarget === "diagram") {
              const diagramConnections = a?.diagram?.connections || [];

              diagramConnections.forEach((_, index) => {
                suggestions.push({
                  label: String(index),
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: String(index),
                  detail: "Diagram edge index",
                  range: range,
                  sortText: `1diagramindex${index}`,
                });
              });
            } else {
              const allEdges = a?.blocks?.[selectedTarget]?.edges || [];

              allEdges.forEach((edgeName, index) => {
                suggestions.push({
                  label: edgeName,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: edgeName,
                  detail: "Edge name",
                  range: range,
                  sortText: `1blockedge${index}`,
                });
              });
            }
          }

          if (parameterIndex === 2) {
            languageConfig.namedColors.forEach((color, index) => {
              suggestions.push({
                label: color,
                kind: monaco.languages.CompletionItemKind.Color,
                insertText: `"${color}"`,
                detail: "Named color",
                documentation: `Use ${color} color`,
                range: range,
                sortText: `1color${index}`,
              });
            });
          }

          return { suggestions };
        }
        if (methodName === "setEdgeLabel") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const firstParamOptions = [...(a?.blockOrder || [])];

            if ((a?.diagram?.connections || []).length > 0) {
              firstParamOptions.push("diagram");
            }

            firstParamOptions.forEach((name, index) => {
              suggestions.push({
                label: name,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: name,
                detail:
                  name === "diagram" ? "Diagram connections" : "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedTarget = args[0]?.trim();

            if (selectedTarget === "diagram") {
              const diagramConnections = a?.diagram?.connections || [];

              diagramConnections.forEach((_, index) => {
                suggestions.push({
                  label: String(index),
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: String(index),
                  detail: "Diagram edge index",
                  range: range,
                  sortText: `1diagramindex${index}`,
                });
              });
            } else {
              const allEdges = a?.blocks?.[selectedTarget]?.edges || [];

              allEdges.forEach((edgeName, index) => {
                suggestions.push({
                  label: edgeName,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: edgeName,
                  detail: "Edge name",
                  range: range,
                  sortText: `1blockedge${index}`,
                });
              });
            }
          }

          if (parameterIndex === 2) {
            ["CNN Edge", "Feed Forward left Edge", "HERE"].forEach(
              (text, index) => {
                suggestions.push({
                  label: text,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: `"${text}"`,
                  detail: "Label",
                  range: range,
                  sortText: `1index${index}`,
                });
              },
            );
          }

          return { suggestions };
        }
        if (methodName === "setEdgeShape") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const firstParamOptions = [...(a?.blockOrder || [])];

            if ((a?.diagram?.connections || []).length > 0) {
              firstParamOptions.push("diagram");
            }

            firstParamOptions.forEach((name, index) => {
              suggestions.push({
                label: name,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: name,
                detail:
                  name === "diagram" ? "Diagram connections" : "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedTarget = args[0]?.trim();

            if (selectedTarget === "diagram") {
              const diagramConnections = a?.diagram?.connections || [];

              diagramConnections.forEach((_, index) => {
                suggestions.push({
                  label: String(index),
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: String(index),
                  detail: "Diagram edge index",
                  range: range,
                  sortText: `1diagramindex${index}`,
                });
              });
            } else {
              const allEdges = a?.blocks?.[selectedTarget]?.edges || [];

              allEdges.forEach((edgeName, index) => {
                suggestions.push({
                  label: edgeName,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: edgeName,
                  detail: "Edge name",
                  range: range,
                  sortText: `1blockedge${index}`,
                });
              });
            }
          }

          if (parameterIndex === 2) {
            ["straight", "bow", "arc"].forEach((shape, index) => {
              suggestions.push({
                label: shape,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: shape,
                detail: "Edge shape",
                documentation: `Set edge shape to ${shape}`,
                range: range,
                sortText: `1shape${index}`,
              });
            });
          }

          return { suggestions };
        }
        if (methodName === "setNodeAnnotation") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];

            const allNodes = a?.blocks?.[selectedBlock].nodes || [];

            allNodes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Node name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 2) {
            ["left", "right", "bottom", "top"].forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: `${num}`,
                detail: "Side name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 3) {
            ["Important", "left part", "right part"].forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: `"${num}"`,
                detail: "Annotation",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }
        if (methodName === "setNodeStroke") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = parseMerlinScalar(args[0]);
            const block = a?.blocks?.[selectedBlock];

            const strokeableNodeTypes = new Set(["rect", "circle", "arrow"]);
            const strokeableNodes = (block?.nodes || []).filter((nodeName) => {
              const nodeType = block?.nodeTypes?.[nodeName];
              return strokeableNodeTypes.has(nodeType);
            });

            strokeableNodes.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName,
                detail: "Node name",
                documentation: "Node that supports stroke",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 2) {
            languageConfig.namedColors.forEach((color, index) => {
              suggestions.push({
                label: color,
                kind: monaco.languages.CompletionItemKind.Color,
                insertText: `"${color}"`,
                detail: "Named color",
                documentation: `Use ${color} color`,
                range: range,
                sortText: `1color${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setNodeColor") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];

            const allNodes = a?.blocks?.[selectedBlock].nodes || [];

            allNodes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Node name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 2) {
            languageConfig.namedColors.forEach((color, index) => {
              suggestions.push({
                label: color,
                kind: monaco.languages.CompletionItemKind.Color,
                insertText: `"${color}"`,
                detail: "Named color",
                documentation: `Use ${color} color`,
                range: range,
                sortText: `1color${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setNodeShape") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];

            const allNodes =
              a?.blocks?.[selectedBlock].nodes.filter(
                (node) =>
                  a?.blocks?.[selectedBlock].nodeTypes[node] === "flatten" ||
                  a?.blocks?.[selectedBlock].nodeTypes[node] === "stacked",
              ) || [];

            allNodes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Node name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 2) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );

            const arr =
              a?.blocks?.[args[0]].nodeTypes[args[1]] === "flatten"
                ? ["1x1", "10x10"]
                : ["1x1x1", "10x10x10"];

            arr.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: `${num}`,
                detail: "Label",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setNodeLabel") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];

            const allNodes = a?.blocks?.[selectedBlock].nodes || [];

            allNodes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Node name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 2) {
            ["CNN", "Feed Forward", "+", "Add & Norm"].forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: `"${num}"`,
                detail: "Label",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "removeNode" && varType === "architecture") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];

            const allNodes = a?.blocks?.[selectedBlock].nodes || [];

            allNodes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Node name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "removeNodes") {
          const a = context.architectureData?.[variableName];

          if (parameterIndex === 0) {
            const allBlocks = a?.blockOrder || [];
            allBlocks.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Block name",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedBlock = args[0];

            const allNodes = a?.blocks?.[selectedBlock].nodes || [];

            allNodes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Node names",
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setNeuronColor") {
          const nn = context.neuralNetworkData?.[variableName];
          if (parameterIndex === 0) {
            const layerIndexes =
              nn?.neuronColors?.map((_, i) => String(i)) || [];
            layerIndexes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Layer index",
                documentation: `Set layer index to ${num}`,
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedLayerIndex = Number(args[0]);

            const neuronsInLayer = nn?.neuronColors?.[selectedLayerIndex]
              ? nn.neurons[selectedLayerIndex].map((_, i) => String(i))
              : [];

            neuronsInLayer.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Neuron index",
                documentation: `Set neuron index to ${num}`,
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 2) {
            // Second parameter: color (string)
            languageConfig.namedColors.forEach((color, index) => {
              suggestions.push({
                label: color,
                kind: monaco.languages.CompletionItemKind.Color,
                insertText: `"${color}"`,
                detail: "Named color",
                documentation: `Use ${color} color`,
                range: range,
                sortText: `1color${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setNeuron") {
          const nn = context.neuralNetworkData?.[variableName];
          if (parameterIndex === 0) {
            const layerIndexes = nn?.neurons?.map((_, i) => String(i)) || [];
            layerIndexes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Layer index",
                documentation: `Set layer index to ${num}`,
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedLayerIndex = Number(args[0]);

            const neuronsInLayer = nn?.neurons?.[selectedLayerIndex]
              ? nn.neurons[selectedLayerIndex].map((_, i) => String(i))
              : [];

            neuronsInLayer.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Neurons index",
                documentation: `Set neuron index to ${num}`,
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 2) {
            ["x5", "neuron", "newNeuron", "x1", "x0", "1", "2", "3"].forEach(
              (num, index) => {
                const isNumber = !isNaN(num) && num.trim() !== "";
                suggestions.push({
                  label: num,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: isNumber ? num : `"${num}"`,
                  detail: "Layer index",
                  documentation: `Set layer index to ${num}`,
                  range: range,
                  sortText: `1index${index}`,
                });
              },
            );
          }

          return { suggestions };
        }

        if (methodName === "setLayer") {
          const nn = context.neuralNetworkData?.[variableName];
          if (parameterIndex === 0) {
            const layerIndexes = nn?.layers?.map((_, i) => String(i)) || [];
            layerIndexes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Layer index",
                documentation: `Set layer index to ${num}`,
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            ["x5", "layer", "newLayer", "x1", "x0", "1", "3"].forEach(
              (num, index) => {
                const isNumber = !isNaN(num) && num.trim() !== "";
                suggestions.push({
                  label: num,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: isNumber ? num : `"${num}"`,
                  detail: "Layer index",
                  documentation: `Set layer index to ${num}`,
                  range: range,
                  sortText: `1index${index}`,
                });
              },
            );
          }

          return { suggestions };
        }

        if (methodName === "setLayerColor") {
          const nn = context.neuralNetworkData?.[variableName];
          if (parameterIndex === 0) {
            const layerColorIndexes =
              nn?.layerColors?.map((_, i) => String(i)) || [];
            layerColorIndexes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Layer index",
                documentation: `Set layer index to ${num}`,
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            // Second parameter: color (string)
            languageConfig.namedColors.forEach((color, index) => {
              suggestions.push({
                label: color,
                kind: monaco.languages.CompletionItemKind.Color,
                insertText: `"${color}"`,
                detail: "Named color",
                documentation: `Use ${color} color`,
                range: range,
                sortText: `1color${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setNeurons") {
          if (parameterIndex === 0) {
            ["0", "x5", "neuron", "neuron1", "x4", "1", "2", "3"].forEach(
              (num, index) => {
                const isNumber = !isNaN(num) && num.trim() !== "";
                suggestions.push({
                  label: num,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: isNumber ? num : `"${num}"`,
                  detail: "Layer index",
                  documentation: `Set layer index to ${num}`,
                  range: range,
                  sortText: `1index${index}`,
                });
              },
            );
          }
          return { suggestions };
        }

        if (methodName === "setNeuronColors") {
          if (parameterIndex === 0) {
            // Second parameter: color (string)
            languageConfig.namedColors.forEach((color, index) => {
              suggestions.push({
                label: color,
                kind: monaco.languages.CompletionItemKind.Color,
                insertText: `"${color}"`,
                detail: "Named color",
                documentation: `Use ${color} color`,
                range: range,
                sortText: `1color${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "setLayers") {
          if (parameterIndex === 0) {
            ["x5", "layer", "newLayer", "x1", "x0", "1", "3"].forEach(
              (num, index) => {
                const isNumber = !isNaN(num) && num.trim() !== "";
                suggestions.push({
                  label: num,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: isNumber ? num : `"${num}"`,
                  detail: "Layer index",
                  documentation: `Set layer index to ${num}`,
                  range: range,
                  sortText: `1index${index}`,
                });
              },
            );
          }

          return { suggestions };
        }

        if (methodName === "setLayerColors") {
          if (parameterIndex === 0) {
            // Second parameter: color (string)
            languageConfig.namedColors.forEach((color, index) => {
              suggestions.push({
                label: color,
                kind: monaco.languages.CompletionItemKind.Color,
                insertText: `"${color}"`,
                detail: "Named color",
                documentation: `Use ${color} color`,
                range: range,
                sortText: `1color${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "addNeurons") {
          const nn = context.neuralNetworkData?.[variableName];
          if (parameterIndex === 0) {
            const layerIndexes = nn?.neurons?.map((_, i) => String(i)) || [];
            layerIndexes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Layer index",
                documentation: `Set layer index to ${num}`,
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            ["x5", "layer", "newLayer", "x1", "x0", "1", "3"].forEach(
              (num, index) => {
                const isNumber = !isNaN(num) && num.trim() !== "";
                suggestions.push({
                  label: num,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: isNumber ? num : `"${num}"`,
                  detail: "Layer index",
                  documentation: `Set layer index to ${num}`,
                  range: range,
                  sortText: `1index${index}`,
                });
              },
            );
          }

          return { suggestions };
        }

        if (methodName === "addLayer") {
          if (parameterIndex === 0 || parameterIndex === 1) {
            ["x5", "layer", "newLayer", "x1", "x0", "1", "3"].forEach(
              (num, index) => {
                const isNumber = !isNaN(num) && num.trim() !== "";
                suggestions.push({
                  label: num,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: isNumber ? num : `"${num}"`,
                  detail: "Layer index",
                  documentation: `Set layer index to ${num}`,
                  range: range,
                  sortText: `1index${index}`,
                });
              },
            );
          }

          return { suggestions };
        }

        if (methodName === "removeLayerAt") {
          const nn = context.neuralNetworkData?.[variableName];
          if (parameterIndex === 0) {
            const layerIndexes = nn?.layers?.map((_, i) => String(i)) || [];
            layerIndexes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Layer index",
                documentation: `Set layer index to ${num}`,
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        if (methodName === "removeNeuronsFromLayer") {
          const nn = context.neuralNetworkData?.[variableName];
          if (parameterIndex === 0) {
            const layerIndexes = nn?.neurons?.map((_, i) => String(i)) || [];
            layerIndexes.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Layer index",
                documentation: `Set layer index to ${num}`,
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          if (parameterIndex === 1) {
            const args = splitTopLevelArgs(
              context.methodCallContext.paramsText,
            );
            const selectedLayerIndex = Number(args[0]);

            const neuronsInLayer = nn?.neurons?.[selectedLayerIndex] ?? [];
            const res = neuronsInLayer.map((item) => String(item));
            res.forEach((num, index) => {
              const isNumber = !isNaN(num) && num.trim() !== "";
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: isNumber ? num : `"${num}"`,
                detail: "Layer index",
                documentation: `Set layer index to ${num}`,
                range: range,
                sortText: `1index${index}`,
              });
            });
          }

          return { suggestions };
        }

        // Method-specific parameter suggestions
        if (methodName === "setColor" || methodName === "setColors") {
          // Detect if user already typed a quote
          let alreadyQuoted = false;
          if (
            context.word &&
            context.word.word &&
            (context.word.word.startsWith('"') ||
              context.word.word.startsWith("'"))
          ) {
            alreadyQuoted = true;
          } else if (
            context.beforeCursor.endsWith('"') ||
            context.beforeCursor.endsWith("'")
          ) {
            alreadyQuoted = true;
          }

          // Add color suggestions
          languageConfig.namedColors.forEach((color, index) => {
            suggestions.push({
              label: color,
              kind: monaco.languages.CompletionItemKind.Color,
              insertText: alreadyQuoted ? `${color}` : `"${color}"`,
              detail: "Named color",
              documentation: `Use ${color} color`,
              range: range,
              sortText: `1color${index.toString().padStart(3, "0")}`,
            });
          });
          // Add common hex colors
          const commonHexColors = [
            "#ff0000",
            "#00ff00",
            "#0000ff",
            "#ffff00",
            "#ff00ff",
            "#00ffff",
            "#000000",
            "#ffffff",
          ];
          commonHexColors.forEach((hex, index) => {
            suggestions.push({
              label: hex,
              kind: monaco.languages.CompletionItemKind.Color,
              insertText: alreadyQuoted ? `${hex}` : `"${hex}"`,
              detail: "Hex color",
              documentation: `Use ${hex} color`,
              range: range,
              sortText: `2hex${index}`,
            });
          });
        }

        if (methodName === "addNode" || methodName === "insertNode") {
          if (parameterIndex === 0) {
            // First parameter is node name (no quotes)
            const existingNodes =
              context.nodeData.nodesByVariable[variableName] || [];
            const suggestedNodes = [
              "client",
              "server",
              "router",
              "database",
              "user",
              "admin",
              "offline",
              "node1",
              "node2",
              "node3",
            ];

            suggestedNodes.forEach((nodeName, index) => {
              if (!existingNodes.includes(nodeName)) {
                suggestions.push({
                  label: nodeName,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: nodeName, // No quotes
                  detail: "Node name",
                  documentation: `Add node named ${nodeName}`,
                  range: range,
                  sortText: `1node${index}`,
                });
              }
            });
          } else if (parameterIndex === 1) {
            // Second parameter is node value
            const numberSuggestions = ["0", "1", "10", "25", "50", "100"];
            numberSuggestions.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Numeric value",
                documentation: `Set node value to ${num}`,
                range: range,
                sortText: `1num${index}`,
              });
            });
          }
        }

        if (methodName === "removeNode" && varType === "graph") {
          if (parameterIndex === 0) {
            // Suggest existing nodes for removal (no quotes)
            const existingNodes =
              context.nodeData.nodesByVariable[variableName] || [];
            existingNodes.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName, // No quotes
                detail: "Existing node",
                documentation: `Remove node ${nodeName}`,
                range: range,
                sortText: `1node${index}`,
              });
            });
          }
        }

        if (
          methodName === "setColor" &&
          (varType === "graph" || varType === "tree")
        ) {
          if (parameterIndex === 0) {
            // First parameter is node name for graph/tree setColor (no quotes)
            const existingNodes =
              context.nodeData.nodesByVariable[variableName] ||
              context.nodeData.allNodes;
            existingNodes.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName, // No quotes
                detail: "Node name",
                documentation: `Set color for node ${nodeName}`,
                range: range,
                sortText: `1node${index}`,
              });
            });
          }
          if (parameterIndex === 0) {
            // First parameter is node name for graph/tree setArrow (no quotes)
            const existingNodes =
              context.nodeData.nodesByVariable[variableName] ||
              context.nodeData.allNodes;
            existingNodes.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName, // No quotes
                detail: "Node name",
                documentation: `Set arrow for node ${nodeName}`,
                range: range,
                sortText: `1node${index}`,
              });
            });
          }
        }

        if (methodName === "addEdge" || methodName === "removeEdge") {
          // Smart edge parameter suggestions - progressive completion
          const existingNodes = context.nodeData.nodesByVariable[
            variableName
          ] ||
            context.nodeData.allNodes || ["n1", "n2", "n3"]; // fallback nodes

          // Get the current line to better understand context
          const line = model.getLineContent(position.lineNumber);
          const beforeCursor = line.substring(0, position.column - 1);

          // Find what's being typed in the current parameter
          const methodStart = beforeCursor.lastIndexOf("(");
          const paramStart = Math.max(
            beforeCursor.lastIndexOf(",", methodStart) + 1,
            methodStart + 1,
          );
          const currentParamText = beforeCursor.substring(paramStart).trim();

          // Check if we're in the middle of typing an edge (contains -)
          // Use regex to detect if cursor is after a dash (e.g., parent-)
          const dashMatch = currentParamText.match(/([A-Za-z0-9_]+)-$/);
          if (dashMatch) {
            const beforeDash = dashMatch[1];
            const secondNodeOptions = existingNodes.filter(
              (node) => node !== beforeDash,
            );
            secondNodeOptions.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName,
                detail: "Target node",
                documentation: `Connect ${beforeDash} to ${nodeName}`,
                range: range,
                sortText: `0node${index}`,
              });
            });
          } else {
            // Suggest node names only (no dash)
            existingNodes.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName,
                detail: "Source node",
                documentation: `Start edge from ${nodeName} (type '-' to select target)`,
                range: range,
                sortText: `0edge${index}`,
              });
            });
          }
        }

        // Progressive completion for setChild/addChild (tree edge methods)
        if (methodName === "setChild" || methodName === "addChild") {
          const existingNodes = context.nodeData.nodesByVariable[
            variableName
          ] ||
            context.nodeData.allNodes || [
              "CEO",
              "CTO",
              "CFO",
              "LeadDev",
              "Intern",
            ];
          const line = model.getLineContent(position.lineNumber);
          const beforeCursor = line.substring(0, position.column - 1);
          const methodStart = beforeCursor.lastIndexOf("(");
          const paramStart = Math.max(
            beforeCursor.lastIndexOf(",", methodStart) + 1,
            methodStart + 1,
          );
          const currentParamText = beforeCursor.substring(paramStart).trim();
          // Use regex to detect if cursor is after a dash (e.g., parent-)
          const dashMatch = beforeCursor.match(/([A-Za-z0-9_]+)-$/);
          if (dashMatch) {
            const beforeDash = dashMatch[1];
            const secondNodeOptions = existingNodes.filter(
              (node) => node !== beforeDash,
            );
            secondNodeOptions.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName,
                detail: "Child node",
                documentation: `Set child from ${beforeDash} to ${nodeName}`,
                range: range,
                sortText: `0child${index}`,
              });
            });
          } else {
            // Suggest node names only (no dash)
            existingNodes.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName,
                detail: "Parent node",
                documentation: `Set child from ${nodeName} (type '-' to select child)`,
                range: range,
                sortText: `0parent${index}`,
              });
            });
          }
        }

        if (methodName === "setValue" || methodName === "setValues") {
          // Value suggestions
          if (varType === "array" || varType === "stack") {
            const numberSuggestions = [
              "0",
              "1",
              "2",
              "3",
              "4",
              "5",
              "10",
              "20",
              "50",
              "100",
            ];
            const stringSuggestions = [
              '"hello"',
              '"world"',
              '"data"',
              '"item"',
              '"element"',
            ];

            numberSuggestions.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: "Number",
                documentation: `Set value to ${num}`,
                range: range,
                sortText: `1num${index}`,
              });
            });

            stringSuggestions.forEach((str, index) => {
              suggestions.push({
                label: str.replace(/"/g, ""),
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: str,
                detail: "String",
                documentation: `Set value to ${str}`,
                range: range,
                sortText: `2str${index}`,
              });
            });
          }
        }

        if (methodName.includes && methodName.includes("FontWeight")) {
          languageConfig.fontWeights.forEach((weight, index) => {
            suggestions.push({
              label: weight,
              kind: monaco.languages.CompletionItemKind.EnumMember,
              insertText: `${weight}`,
              detail: "Font weight",
              documentation: `Set font weight to ${weight}`,
              range: range,
              sortText: `1weight${index}`,
            });
          });
        }

        if (methodName.includes && methodName.includes("FontFamily")) {
          languageConfig.fontFamilies.forEach((family, index) => {
            suggestions.push({
              label: family,
              kind: monaco.languages.CompletionItemKind.EnumMember,
              insertText: `"${family}"`,
              detail: "Font family",
              documentation: `Set font family to ${family}`,
              range: range,
              sortText: `1family${index}`,
            });
          });
        }

        if (methodName.includes && methodName.includes("Align")) {
        }

        // Show alignment suggestions for setAlign and setAligns
        if (methodName === "setAlign" || methodName === "setAligns") {
          languageConfig.alignValues.forEach((align, index) => {
            suggestions.push({
              label: align,
              kind: monaco.languages.CompletionItemKind.EnumMember,
              insertText: `"${align}"`,
              detail: "Text alignment",
              documentation: `Align text to ${align}`,
              range: range,
              sortText: `1align${index}`,
            });
          });
        }

        if (methodName === "setText") {
          if (parameterIndex === 0) {
            // First parameter is text content (string or null)
            suggestions.push({
              label: '"text content"',
              kind: monaco.languages.CompletionItemKind.Value,
              insertText: '"${1:text content}"',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Text to display",
              documentation: "Text content to display at the position",
              range: range,
              sortText: "1text",
            });
          } else if (parameterIndex === 1) {
            // Second parameter is position ("above", "below", "left", "right")
            const positions = ["above", "below", "left", "right"];
            positions.forEach((pos, index) => {
              suggestions.push({
                label: pos,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: `"${pos}"`,
                detail: "Text position",
                documentation: `Position text ${pos} the component`,
                range: range,
                sortText: `1pos${index}`,
              });
            });
          }
        }
        return { suggestions };
      } catch (error) {
        console.error("Error in method argument completion provider:", error);
        return { suggestions: [] };
      }
    },
  });

  // Function to get method documentation based on type
  function getMethodDocumentation(methodName, varType) {
    const methodDoc = methodDocumentation[methodName];
    if (!methodDoc) return null;

    if (typeof methodDoc === "function") {
      return methodDoc(varType);
    }

    // If method has type-specific documentation
    if (typeof methodDoc === "object" && methodDoc[varType]) {
      return methodDoc[varType];
    }

    // If method has default documentation
    if (typeof methodDoc === "object" && methodDoc.default) {
      return methodDoc.default;
    }

    // If method has single documentation object
    if (methodDoc.signature && methodDoc.description) {
      return methodDoc;
    }

    return null;
  }

  // Function to check if current position is on a method call
  // This function is now defined earlier in the file (around line 227)
  // Keeping this comment for reference but the actual function is above

  // Register signature help provider for method parameters
  monaco.languages.registerSignatureHelpProvider("customLang", {
    signatureHelpTriggerCharacters: ["(", ","],
    signatureHelpRetriggerCharacters: [")"],
    provideSignatureHelp: (model, position, token) => {
      const lineContent = model.getLineContent(position.lineNumber);
      const beforeCursor = lineContent.substring(0, position.column - 1);

      // Find method call pattern: variable.method(
      const methodCallMatch = beforeCursor.match(/(\w+)\.(\w+)\s*\([^)]*$/);
      if (!methodCallMatch) return null;

      const [, variableName, methodName] = methodCallMatch;
      // Get cached parsed data
      const { variableTypes } = parseCache.getCachedData(model, position);
      const varType = variableTypes[variableName];

      if (!varType) return null;

      const methodDoc = getMethodDocumentation(methodName, varType);
      if (!methodDoc) return null;

      // Count current parameter by counting commas (but ignore commas inside quotes or brackets)
      const methodStart = beforeCursor.lastIndexOf("(");
      const paramsPart = beforeCursor.substring(methodStart + 1);
      let currentParam = 0;
      let depth = 0;
      let inQuotes = false;
      let quoteChar = "";

      for (let i = 0; i < paramsPart.length; i++) {
        const char = paramsPart[i];
        if (!inQuotes) {
          if (char === '"' || char === "'") {
            inQuotes = true;
            quoteChar = char;
          } else if (char === "(" || char === "[" || char === "{") {
            depth++;
          } else if (char === ")" || char === "]" || char === "}") {
            depth--;
          } else if (char === "," && depth === 0) {
            currentParam++;
          }
        } else {
          if (char === quoteChar && (i === 0 || paramsPart[i - 1] !== "\\")) {
            inQuotes = false;
          }
        }
      }

      // Create parameter list with current parameter highlighted
      let parametersText = "";
      if (methodDoc.parameters && methodDoc.parameters.length > 0) {
        parametersText =
          "**Parameters:**\n\n" +
          methodDoc.parameters
            .map((param, index) => {
              const isCurrentParam = index === currentParam;
              const parts = param.split(" - ");
              const paramName = parts[0].trim();
              const paramDesc = parts[1] ? ` - ${parts[1].trim()}` : "";

              if (isCurrentParam) {
                return `• **${paramName}**${paramDesc}`;
              } else {
                return `• ${paramName}${paramDesc}`;
              }
            })
            .join("\n\n");
      }

      const signature = {
        label: methodDoc.signature,
        documentation: {
          value: `${methodDoc.description}\n\n${parametersText}\n\n**Example:**\n\`\`\`merlin\n${methodDoc.example}\n\`\`\``,
        },
        parameters: methodDoc.parameters
          ? methodDoc.parameters.map((param) => {
              const parts = param.split(" - ");
              return {
                label: parts[0].trim(),
                documentation: `Current Parameter: ${parts[1] ? parts[1].trim() : ""}`,
              };
            })
          : [],
      };

      return {
        dispose: () => {},
        value: {
          activeSignature: 0,
          activeParameter: Math.min(
            currentParam,
            Math.max(0, signature.parameters.length - 1),
          ),
          signatures: [signature],
        },
      };
    },
  });

  // Register a single hover provider for both method and variable documentation
  monaco.languages.registerHoverProvider("customLang", {
    provideHover: function (model, position) {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      // Check if there's an error on the same line - if so, don't show hover info
      if (errorStateManager && errorStateManager.currentMarkers) {
        const hasErrorOnLine = errorStateManager.currentMarkers.some(
          (marker) => marker.startLineNumber === position.lineNumber,
        );
        if (hasErrorOnLine) {
          return null;
        }
      }

      // Get cached parsed data
      const { variableTypes } = parseCache.getCachedData(model, position);
      const varName = word.word;

      // Check if hovering over a component type keyword
      if (languageConfig.components.includes(varName)) {
        const typeDoc = typeDocumentation[varName];
        if (typeDoc) {
          const featuresList = typeDoc.features
            .map((feature) => `• ${feature}`)
            .join("\n");
          return {
            range: new monaco.Range(
              position.lineNumber,
              word.startColumn,
              position.lineNumber,
              word.endColumn,
            ),
            contents: [
              { value: `**${varName}** data structure` },
              { value: typeDoc.description },
              { value: `**Features:**\n${featuresList}` },
              {
                value: `[See documentation](${typeDoc.url})`,
                isTrusted: true,
              },
            ],
          };
        }
      }

      // Check if we're hovering over a method call
      const methodContext = getMethodCallContext(model, position);
      if (
        methodContext &&
        methodContext.isMethodCall &&
        methodContext.methodName === varName
      ) {
        const callerType = variableTypes[methodContext.variableName];
        if (callerType) {
          const methodDoc = getMethodDocumentation(varName, callerType);
          if (methodDoc) {
            const paramsList = methodDoc.parameters
              ? methodDoc.parameters.map((param) => `• ${param}`).join("\n\n")
              : "No parameters documented";
            const typeDoc = typeDocumentation[callerType];
            const docLink = typeDoc
              ? `[See ${callerType} documentation](${typeDoc.url})`
              : "";
            return {
              range: new monaco.Range(
                position.lineNumber,
                word.startColumn,
                position.lineNumber,
                word.endColumn,
              ),
              contents: [
                { value: `**${methodDoc.signature}**` },
                { value: methodDoc.description },
                { value: `**Parameters:**\n\n${paramsList}` },
                {
                  value: `**Example:**\n\`\`\`merlin\n${methodDoc.example}\n\`\`\``,
                },
                ...(docLink ? [{ value: docLink, isTrusted: true }] : []),
              ],
            };
          }
        }
      }

      // Check if we're hovering over a method name (even without parentheses)
      const methodHover = isHoveringOverMethod(model, position, word);
      if (methodHover && methodHover.isMethod) {
        const callerType = variableTypes[methodHover.variableName];
        if (callerType) {
          const methodDoc = getMethodDocumentation(
            methodHover.methodName,
            callerType,
          );
          if (methodDoc) {
            const paramsList = methodDoc.parameters
              ? methodDoc.parameters.map((param) => `• ${param}`).join("\n\n")
              : "No parameters documented";
            const typeDoc = typeDocumentation[callerType];
            const docLink = typeDoc
              ? `[See ${callerType} documentation](${typeDoc.url})`
              : "";
            return {
              range: new monaco.Range(
                position.lineNumber,
                word.startColumn,
                position.lineNumber,
                word.endColumn,
              ),
              contents: [
                { value: `**${methodHover.methodName}()** method` },
                { value: methodDoc.description },
                { value: `**Parameters:**\n\n${paramsList}` },
                {
                  value: `**Example:**\n\`\`\`merlin\n${methodDoc.example}\n\`\`\``,
                },
                ...(docLink ? [{ value: docLink, isTrusted: true }] : []),
              ],
            };
          } else {
            // Fallback: show basic method info even without detailed documentation
            const availableMethods = getMethodsForType(callerType);
            if (availableMethods.includes(methodHover.methodName)) {
              return {
                range: new monaco.Range(
                  position.lineNumber,
                  word.startColumn,
                  position.lineNumber,
                  word.endColumn,
                ),
                contents: [
                  { value: `**${methodHover.methodName}()** method` },
                  { value: `Method available for ${callerType} variables` },
                  {
                    value: `Call as: ${methodHover.variableName}.${methodHover.methodName}()`,
                  },
                ],
              };
            }
          }
        }
      }

      // Otherwise, check if it's a variable for type documentation
      const varType = variableTypes[varName];
      if (varType) {
        const availableMethods = getMethodsForType(varType);
        const methodsList = availableMethods
          .map(
            (method) =>
              `• \`${method}()\`: ${methodDescriptions[method] || "Method for " + varType}`,
          )
          .join("\n\n");
        const typeDoc = typeDocumentation[varType];
        const docLink = typeDoc
          ? `[See ${varType} documentation](${typeDoc.url})`
          : "";
        return {
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn,
          ),
          contents: [
            { value: `**${varName}** (${varType})` },
            {
              value: typeDoc
                ? typeDoc.description
                : `Variable of type ${varType}`,
            },
            { value: `**Available methods:**\n\n${methodsList}` },
            ...(docLink ? [{ value: docLink, isTrusted: true }] : []),
          ],
        };
      }

      return null;
    },
  });

  monaco.languages.registerInlineCompletionsProvider("customLang", {
    provideInlineCompletions(model, position, context, token) {
      // Simple inline suggestions for page and show commands
      return { items: [], dispose: () => {} };
    },
    handleItemDidShow: () => {},
    freeInlineCompletions: () => {},
  });

  // Register code action provider for Quick Fixes
  monaco.languages.registerCodeActionProvider("customLang", {
    provideCodeActions: function (model, range, context, token) {
      const actions = [];
      const line = model.getLineContent(range.startLineNumber);
      const word = model.getWordAtPosition({
        lineNumber: range.startLineNumber,
        column: range.startColumn,
      });

      // Quick fix for "Nothing to show" error - always check this one
      const nothingToShowFixes = getNothingToShowQuickFixes(model);
      actions.push(...nothingToShowFixes);

      // For other fixes, we need a word
      if (!word) return { actions, dispose: () => {} };
      // Aggregate quick fixes
      actions.push(...getAttributeQuickFixes(line, word, range, model));
      actions.push(...getMethodQuickFixes(line, word, range, model));
      actions.push(...getComponentQuickFixes(line, word, range, model));
      actions.push(...getSyntaxQuickFixes(line, word, range, model));
      actions.push(...getArrayMethodQuickFixes(line, word, range, model));

      return { actions, dispose: () => {} };

      // Leverage helper functions defined below
    },
  });

  // Levenshtein distance helper
  function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, () =>
      new Array(a.length + 1).fill(0),
    );
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      matrix[i][0] = i;
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  // Find closest matches using Levenshtein distance
  function findClosestMatches(
    word,
    candidates,
    maxDistance = 2,
    maxSuggestions = 3,
  ) {
    return candidates
      .map((candidate) => ({
        word: candidate,
        distance: levenshteinDistance(
          word.toLowerCase(),
          candidate.toLowerCase(),
        ),
      }))
      .filter((item) => item.distance <= maxDistance && item.distance > 0)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxSuggestions)
      .map((item) => item.word);
  }

  // Quick fixes for misspelled attributes
  function getAttributeQuickFixes(line, word, range, model) {
    const actions = [];
    const currentWord = word?.word;
    if (!currentWord) return actions;

    // Check if this looks like an attribute (followed by colon)
    if (line.includes(`${currentWord}:`)) {
      const suggestions = findClosestMatches(
        currentWord,
        languageConfig.attributes,
      );
      suggestions.forEach((suggestion) => {
        actions.push({
          title: `Change "${currentWord}" to "${suggestion}"`,
          kind: "quickfix",
          diagnostics: [],
          edit: {
            edits: [
              {
                resource: model.uri,
                edit: {
                  range: new monaco.Range(
                    range.startLineNumber,
                    word.startColumn,
                    range.startLineNumber,
                    word.endColumn,
                  ),
                  text: suggestion,
                },
              },
            ],
          },
        });
      });
    }

    return actions;
  }

  // Quick fixes for misspelled methods
  function getMethodQuickFixes(line, word, range, model) {
    const actions = [];
    const currentWord = word.word;
    // Check if this looks like a method call (preceded by dot)
    const beforeWord = line.substring(0, word.startColumn - 1);
    const methodCallMatch = beforeWord.match(/(\w+)\.$/);
    if (methodCallMatch) {
      const variableName = methodCallMatch[1];
      const { variableTypes } = parseCache.getCachedData(model, {
        lineNumber: range.startLineNumber,
        column: word.startColumn,
      });
      const varType = variableTypes[variableName];
      if (varType) {
        const availableMethods = getMethodsForType(varType);
        const suggestions = findClosestMatches(currentWord, availableMethods);
        suggestions.forEach((suggestion) => {
          actions.push({
            title: `Change "${currentWord}" to "${suggestion}"`,
            kind: "quickfix",
            diagnostics: [],
            edit: {
              edits: [
                {
                  resource: model.uri,
                  textEdit: {
                    range: new monaco.Range(
                      range.startLineNumber,
                      word.startColumn,
                      range.startLineNumber,
                      word.endColumn,
                    ),
                    text: suggestion,
                  },
                },
              ],
            },
          });
        });
      }
    }
    return actions;
  }

  // Quick fixes for misspelled components
  function getComponentQuickFixes(line, word, range, model) {
    const actions = [];
    const currentWord = word.word;
    // Check if this looks like a component declaration or an unknown type token
    const looksLikeDeclaration = line.match(/^\s*\w+\s+\w+\s*=\s*\{/);
    const unknownTypeToken =
      line.includes(`${currentWord} `) &&
      !languageConfig.components.includes(currentWord);
    if (looksLikeDeclaration || unknownTypeToken) {
      const suggestions = findClosestMatches(
        currentWord,
        languageConfig.components,
      );
      suggestions.forEach((suggestion) => {
        actions.push({
          title: `Change "${currentWord}" to "${suggestion}"`,
          kind: "quickfix",
          diagnostics: [],
          edit: {
            edits: [
              {
                resource: model.uri,
                edit: {
                  range: new monaco.Range(
                    range.startLineNumber,
                    word.startColumn,
                    range.startLineNumber,
                    word.endColumn,
                  ),
                  text: suggestion,
                },
              },
            ],
          },
        });
      });
    }
    return actions;
  }

  // Quick fixes for common syntax errors
  function getSyntaxQuickFixes(line, word, range, model) {
    const actions = [];
    const trimmedLine = line.trim();
    // Fix missing colon after attribute
    if (
      trimmedLine.match(/^\s*\w+\s+[^:=]/) &&
      languageConfig.attributes.includes(word.word)
    ) {
      actions.push({
        title: `Add colon after "${word.word}"`,
        kind: "quickfix",
        diagnostics: [],
        edit: {
          edits: [
            {
              resource: model.uri,
              edit: {
                range: new monaco.Range(
                  range.startLineNumber,
                  word.endColumn,
                  range.startLineNumber,
                  word.endColumn,
                ),
                text: ":",
              },
            },
          ],
        },
      });
    }

    // Fix missing equals sign in component declaration
    if (
      trimmedLine.match(/^\s*\w+\s+\w+\s*\{/) &&
      languageConfig.components.includes(word.word)
    ) {
      const braceIndex = line.indexOf("{");
      if (braceIndex > 0) {
        actions.push({
          title: `Add "= " before "{"`,
          kind: "quickfix",
          diagnostics: [],
          edit: {
            edits: [
              {
                resource: model.uri,
                edit: {
                  range: new monaco.Range(
                    range.startLineNumber,
                    braceIndex,
                    range.startLineNumber,
                    braceIndex,
                  ),
                  text: "= ",
                },
              },
            ],
          },
        });
      }
    }

    // Fix missing parentheses in method calls
    if (line.includes(`${word.word}.`) || line.includes(`.${word.word}`)) {
      const all = staticCache.getAllMethods();
      if (all.includes(word.word) && !line.includes(`${word.word}(`)) {
        actions.push({
          title: `Add parentheses to "${word.word}" method call`,
          kind: "quickfix",
          diagnostics: [],
          edit: {
            edits: [
              {
                resource: model.uri,
                edit: {
                  range: new monaco.Range(
                    range.startLineNumber,
                    word.endColumn,
                    range.startLineNumber,
                    word.endColumn,
                  ),
                  text: "()",
                },
              },
            ],
          },
        });
      }
    }

    // Fix common typos in keywords
    const keywordSuggestions = findClosestMatches(
      word.word,
      languageConfig.keywords,
    );
    if (
      keywordSuggestions.length > 0 &&
      !languageConfig.keywords.includes(word.word)
    ) {
      keywordSuggestions.forEach((suggestion) => {
        actions.push({
          title: `Change "${word.word}" to "${suggestion}"`,
          kind: "quickfix",
          diagnostics: [],
          edit: {
            edits: [
              {
                resource: model.uri,
                edit: {
                  range: new monaco.Range(
                    range.startLineNumber,
                    word.startColumn,
                    range.startLineNumber,
                    word.endColumn,
                  ),
                  text: suggestion,
                },
              },
            ],
          },
        });
      });
    }
    return actions;
  }

  // NEW: Quick fixes for array method misuse
  function getArrayMethodQuickFixes(line, word, range, model) {
    const actions = [];
    const currentWord = word.word;
    // Check if this is a method call with parameters
    const methodCallMatch = line.match(
      new RegExp(`(\\w+)\\.(${currentWord})\\s*\\(([^)]*)\\)`),
    );
    if (methodCallMatch) {
      const [, , methodName, params] = methodCallMatch;
      const suggestions = getArrayMethodSuggestions(methodName, params);
      suggestions.forEach((suggestion) => {
        actions.push({
          title: suggestion.title,
          kind: "quickfix",
          diagnostics: [],
          edit: {
            edits: [
              {
                resource: model.uri,
                edit: {
                  range: new monaco.Range(
                    range.startLineNumber,
                    word.startColumn,
                    range.startLineNumber,
                    word.endColumn,
                  ),
                  text: suggestion.replacement,
                },
              },
            ],
          },
        });
      });
    }
    return actions;
  }

  // Quick fixes for misspelled methods
  function getMethodQuickFixes(line, word, range, model) {
    const actions = [];
    const currentWord = word.word;

    // Check if this looks like a method call (preceded by dot)
    const beforeWord = line.substring(0, word.startColumn - 1);
    const methodCallMatch = beforeWord.match(/(\w+)\.$/);

    if (methodCallMatch) {
      const variableName = methodCallMatch[1];
      const { variableTypes } = parseCache.getCachedData(model, {
        lineNumber: range.startLineNumber,
        column: word.startColumn,
      });
      const varType = variableTypes[variableName];

      if (varType) {
        const availableMethods = getMethodsForType(varType);
        const suggestions = findClosestMatches(currentWord, availableMethods);

        suggestions.forEach((suggestion) => {
          actions.push({
            title: `Change "${currentWord}" to "${suggestion}"`,
            kind: "quickfix",
            diagnostics: [],
            edit: {
              edits: [
                {
                  resource: model.uri,
                  textEdit: {
                    range: new monaco.Range(
                      range.startLineNumber,
                      word.startColumn,
                      range.startLineNumber,
                      word.endColumn,
                    ),
                    text: suggestion,
                  },
                },
              ],
            },
          });
        });
      }
    }

    return actions;
  }

  // Quick fixes for misspelled components - FIXED VERSION
  function getComponentQuickFixes(line, word, range, model) {
    const actions = [];
    const currentWord = word.word;

    // Check if this looks like a component declaration
    if (
      line.match(new RegExp(`^\\s*\\w+\\s+\\w+\\s*=\\s*\\{`)) ||
      (line.includes(`${currentWord} `) &&
        !languageConfig.components.includes(currentWord))
    ) {
      const suggestions = findClosestMatches(
        currentWord,
        languageConfig.components,
      );

      suggestions.forEach((suggestion) => {
        actions.push({
          title: `Change "${currentWord}" to "${suggestion}"`,
          kind: "quickfix",
          diagnostics: [],
          edit: {
            edits: [
              {
                resource: model.uri,
                edit: {
                  range: new monaco.Range(
                    range.startLineNumber,
                    word.startColumn,
                    range.startLineNumber,
                    word.endColumn,
                  ),
                  text: suggestion,
                },
              },
            ],
          },
        });
      });
    }

    return actions;
  }

  // Quick fixes for common syntax errors
  function getSyntaxQuickFixes(line, word, range, model) {
    const actions = [];
    const trimmedLine = line.trim();

    // Fix missing colon after attribute
    if (
      trimmedLine.match(/^\s*\w+\s+[^:=]/) &&
      languageConfig.attributes.includes(word.word)
    ) {
      actions.push({
        title: `Add colon after "${word.word}"`,
        kind: "quickfix",
        diagnostics: [],
        edit: {
          edits: [
            {
              resource: model.uri,
              edit: {
                range: new monaco.Range(
                  range.startLineNumber,
                  word.endColumn,
                  range.startLineNumber,
                  word.endColumn,
                ),
                text: ":",
              },
            },
          ],
        },
      });
    }

    // Fix missing equals sign in component declaration
    if (
      trimmedLine.match(/^\s*\w+\s+\w+\s*\{/) &&
      languageConfig.components.includes(word.word)
    ) {
      const braceIndex = line.indexOf("{");
      if (braceIndex > 0) {
        actions.push({
          title: `Add "= " before "{"`,
          kind: "quickfix",
          diagnostics: [],
          edit: {
            edits: [
              {
                resource: model.uri,
                edit: {
                  range: new monaco.Range(
                    range.startLineNumber,
                    braceIndex,
                    range.startLineNumber,
                    braceIndex,
                  ),
                  text: "= ",
                },
              },
            ],
          },
        });
      }
    }

    // Fix missing parentheses in method calls
    if (line.includes(`${word.word}.`) || line.includes(`.${word.word}`)) {
      const allMethods = staticCache.getAllMethods();

      if (allMethods.includes(word.word) && !line.includes(`${word.word}(`)) {
        actions.push({
          title: `Add parentheses to "${word.word}" method call`,
          kind: "quickfix",
          diagnostics: [],
          edit: {
            edits: [
              {
                resource: model.uri,
                edit: {
                  range: new monaco.Range(
                    range.startLineNumber,
                    word.endColumn,
                    range.startLineNumber,
                    word.endColumn,
                  ),
                  text: "()",
                },
              },
            ],
          },
        });
      }
    }

    // Fix common typos in keywords
    const keywordSuggestions = findClosestMatches(
      word.word,
      languageConfig.keywords,
    );
    if (
      keywordSuggestions.length > 0 &&
      !languageConfig.keywords.includes(word.word)
    ) {
      keywordSuggestions.forEach((suggestion) => {
        actions.push({
          title: `Change "${word.word}" to "${suggestion}"`,
          kind: "quickfix",
          diagnostics: [],
          edit: {
            edits: [
              {
                resource: model.uri,
                edit: {
                  range: new monaco.Range(
                    range.startLineNumber,
                    word.startColumn,
                    range.startLineNumber,
                    word.endColumn,
                  ),
                  text: suggestion,
                },
              },
            ],
          },
        });
      });
    }

    return actions;
  }

  // NEW: Quick fixes for array method misuse
  function getArrayMethodQuickFixes(line, word, range, model) {
    const actions = [];
    const currentWord = word.word;

    // Check if this is a method call with parameters
    const methodCallMatch = line.match(
      new RegExp(`(\\w+)\\.(${currentWord})\\s*\\(([^)]*)\\)`),
    );
    if (methodCallMatch) {
      const [, variableName, methodName, params] = methodCallMatch;
      const suggestions = getArrayMethodSuggestions(methodName, params);

      suggestions.forEach((suggestion) => {
        actions.push({
          title: suggestion.title,
          kind: "quickfix",
          diagnostics: [],
          edit: {
            edits: [
              {
                resource: model.uri,
                edit: {
                  range: new monaco.Range(
                    range.startLineNumber,
                    word.startColumn,
                    range.startLineNumber,
                    word.endColumn,
                  ),
                  text: suggestion.replacement,
                },
              },
            ],
          },
        });
      });
    }

    return actions;
  }

  // Quick fix for "Nothing to show" compile error
  function getNothingToShowQuickFixes(model, isInline = false) {
    // If isInline, we need to provide data in form of { label, insertText, range, sortText }
    const actions = [];
    const inlineItems = [];

    // Get all the text in the model
    const fullText = model.getValue();

    // Check if this might be a "Nothing to show" error scenario
    // Look for component declarations but no page/show commands
    const hasComponents = languageConfig.components.some((component) =>
      fullText.match(new RegExp(`\\b${component}\\s+\\w+\\s*=\\s*\\{`, "m")),
    );

    const hasPage = /\bpage\b/.test(fullText);
    const hasShow = /\bshow\b/.test(fullText);

    // If we have components but no page or show commands, offer the fix
    if (hasComponents && (!hasPage || !hasShow)) {
      // Extract component variable names
      const componentVariables = [];
      languageConfig.components.forEach((component) => {
        const regex = new RegExp(`\\b${component}\\s+(\\w+)\\s*=\\s*\\{`, "gm");
        let match;
        while ((match = regex.exec(fullText)) !== null) {
          componentVariables.push(match[1]);
        }
      });

      if (componentVariables.length > 0) {
        // Create the fix text
        let fixText = "\n\npage";
        componentVariables.forEach((varName) => {
          fixText += `\nshow ${varName}`;
        });

        // Get the last line of the model to append the fix
        const lastLine = model.getLineCount();
        const lastLineContent = model.getLineContent(lastLine);
        const lastColumn = lastLineContent.length + 1;

        const action = {
          title: `Add page and show commands for defined components`,
          kind: "quickfix",
          diagnostics: [],
          edit: {
            edits: [
              {
                resource: model.uri,
                textEdit: {
                  range: new monaco.Range(
                    lastLine,
                    lastColumn,
                    lastLine,
                    lastColumn,
                  ),
                  text: fixText,
                },
              },
            ],
          },
        };
        if (isInline) {
          // For inline completions, we need to return { label, insertText, range, sortText }
          inlineItems.push({
            label: "Add page and show commands",
            insertText: fixText,
            range: new monaco.Range(lastLine, lastColumn, lastLine, lastColumn),
            sortText: "0fix",
          });
        } else {
          // For code actions, we return the full action object
          actions.push(action);
        }
      }
    }

    if (isInline) {
      return inlineItems;
    } else {
      return actions;
    }
  }

  let lastAutoSuggestKey = null;

  function shouldAutoSuggestInsideArchitectureTopLevelProps(editor, position) {
    const model = editor.getModel();
    if (!model) return false;

    const architectureTopLevelContext = getArchitectureTopLevelContext(
      model,
      position,
    );
    const architectureBlockContext = getArchitectureBlockContext(
      model,
      position,
    );
    const diagramTopLevelContext = getArchitectureDiagramTopLevelContext(
      model,
      position,
    );
    const architectureSectionContext = getArchitectureSectionContext(
      model,
      position,
    );
    const diagramSectionContext = getArchitectureDiagramSectionContext(
      model,
      position,
    );

    const isTopLevelArea =
      (architectureTopLevelContext.insideArchitectureTopLevel ||
        architectureBlockContext.insideArchitectureBlockTopLevel ||
        diagramTopLevelContext.insideDiagramTopLevel) &&
      !architectureSectionContext.insideNodes &&
      !architectureSectionContext.insideEdges &&
      !architectureSectionContext.insideGroups &&
      !diagramSectionContext.insideDiagramUses &&
      !diagramSectionContext.insideDiagramConnects;

    if (!isTopLevelArea) return false;

    const line = model.getLineContent(position.lineNumber);
    const linePrefix = line.substring(0, position.column - 1);

    // Trigger after:
    // layout: vertical,
    // layout: vertical,␠
    return /,\s*$/.test(linePrefix);
  }

  function shouldAutoSuggestInsideDiagramUses(editor, position) {
    const model = editor.getModel();
    if (!model) return false;

    const diagramCtx = getArchitectureDiagramSectionContext(model, position);
    if (!diagramCtx.insideDiagramUses) return false;

    const lineNumber = position.lineNumber;
    const line = model.getLineContent(lineNumber);
    const prevLine = lineNumber > 1 ? model.getLineContent(lineNumber - 1) : "";
    const linePrefix = line.substring(0, position.column - 1);

    const usesText = getCurrentDiagramUsesText(model, position);
    const currentSegment = getTrailingTopLevelSegment(usesText).trimEnd();

    const justOpenedUsesInline = /^\s*uses\s*:\s*\[$/.test(linePrefix);

    const afterCommaAndSpaceSameLine = /,\s*$/.test(
      getTrailingTopLevelSegment(usesText),
    );

    const afterCommaAndEnter =
      /^\s*$/.test(linePrefix) && /,\s*$/.test(prevLine);

    const afterCompletedUseBlockAndSpace =
      /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+$/.test(
        getTrailingTopLevelSegment(usesText),
      );

    const afterAnchorColon =
      /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+anchor\s*:\s*$/.test(
        getTrailingTopLevelSegment(usesText),
      );

    return (
      justOpenedUsesInline ||
      afterCommaAndSpaceSameLine ||
      afterCommaAndEnter ||
      afterCompletedUseBlockAndSpace ||
      afterAnchorColon
    );
  }
  function shouldAutoSuggestInsideEmptyBlockBody(editor, position) {
    const model = editor.getModel();
    if (!model) return false;

    const lineNumber = position.lineNumber;
    const line = model.getLineContent(lineNumber);
    const prevLine = lineNumber > 1 ? model.getLineContent(lineNumber - 1) : "";
    const nextLine =
      lineNumber < model.getLineCount()
        ? model.getLineContent(lineNumber + 1)
        : "";

    const currentLineIsBlank = /^\s*$/.test(line);
    const prevLineStartsBlock =
      /^\s*block\s+[a-zA-Z_][a-zA-Z0-9_]*\s*:\s*\[\s*,?\s*$/.test(prevLine);
    const nextLineIsClosingBracket = /^\s*]\s*,?\s*$/.test(nextLine);

    return (
      currentLineIsBlank && prevLineStartsBlock && nextLineIsClosingBracket
    );
  }

  function shouldAutoSuggestInsideNeurons(editor, position) {
    const model = editor.getModel();
    if (!model) return false;

    const line = model.getLineContent(position.lineNumber);
    const linePrefix = line.substring(0, position.column - 1);

    const neuronsMatch = linePrefix.match(/\bneurons\s*:\s*\[(.*)$/);
    if (!neuronsMatch) return false;

    return /(?:^|,)\s*\[$/.test(neuronsMatch[1]);
  }

  function shouldAutoSuggestInsideLabelOrientation(editor, position) {
    const model = editor.getModel();
    if (!model) return false;

    const line = model.getLineContent(position.lineNumber);
    const linePrefix = line.substring(0, position.column - 1);

    const match = linePrefix.match(/\blabel\.orientation\s*:\s*(.*)$/);
    if (!match) return false;

    const state = getLabelOrientationState(match[1] || "");

    return (
      state.stage === "first-editing" ||
      state.stage === "second-empty" ||
      state.stage === "second-editing"
    );
  }

  function shouldAutoSuggestInsideNeuronColors(editor, position) {
    const model = editor.getModel();
    if (!model) return false;

    const line = model.getLineContent(position.lineNumber);
    const linePrefix = line.substring(0, position.column - 1);

    const neuronColorsMatch = linePrefix.match(/\bneuronColors\s*:\s*\[(.*)$/);
    if (!neuronColorsMatch) return false;

    return /(?:^|,)\s*\[$/.test(neuronColorsMatch[1]);
  }
  function shouldAutoSuggestInsideArchitectureItems(editor, position) {
    const model = editor.getModel();
    if (!model) return false;

    const inlineCtx = getArchitectureInlineItemContext(model, position);
    const section = inlineCtx.section;

    if (section !== "nodes" && section !== "groups" && section !== "edges") {
      return false;
    }

    const lineNumber = position.lineNumber;
    const line = model.getLineContent(lineNumber);
    const prevLine = lineNumber > 1 ? model.getLineContent(lineNumber - 1) : "";
    const linePrefix = line.substring(0, position.column - 1);

    const rawItemText = inlineCtx.currentItemText || "";
    const itemText = rawItemText.trim();

    const itemState = getArchitectureItemNameState(rawItemText);

    const justOpenedSection =
      /^\s*(nodes|groups|edges)\s*:\s*\[$/.test(prevLine) && /^\s*$/.test(line);

    const afterCommaSameLine = /,\s*$/.test(rawItemText);
    const afterCommaAndEnter =
      /^\s*$/.test(linePrefix) && /,\s*$/.test(prevLine);

    const freshItemStart = shouldShowArchitectureItemStarters(
      model,
      position,
      rawItemText,
    );

    const afterNameSpace = itemState.isNameThenSpace;
    const afterEquals =
      itemState.isAfterEquals && /^\s*$/.test(itemState.afterEqualsText);

    if (section === "groups") {
      const afterMembersOpen =
        /\bmembers\s*:\s*\[$/.test(linePrefix) ||
        /\bmembers\s*:\s*\[[^\]]*,\s*$/.test(linePrefix);
      const afterAnchorColon = /\banchor\s*:\s*$/.test(linePrefix);

      if (afterMembersOpen || afterAnchorColon) return true;
    }

    if (section === "edges") {
      const afterArrow = /->\s*$/.test(linePrefix);
      const afterDot = /\.\w*$/.test(linePrefix) || /\.$/.test(linePrefix);

      if (afterArrow || afterDot) return true;
    }

    return (
      justOpenedSection ||
      afterCommaSameLine ||
      afterCommaAndEnter ||
      freshItemStart ||
      afterNameSpace ||
      afterEquals
    );
  }

  function triggerSuggestIfNeeded(editor, position) {
    const model = editor.getModel();
    if (!model) return;

    const shouldTrigger =
      shouldAutoSuggestInsideEmptyBlockBody(editor, position) ||
      shouldAutoSuggestInsideDiagramUses(editor, position) ||
      shouldAutoSuggestInsideNeurons(editor, position) ||
      shouldAutoSuggestInsideNeuronColors(editor, position) ||
      shouldAutoSuggestInsideArchitectureItems(editor, position) ||
      shouldAutoSuggestInsideArchitectureTopLevelProps(editor, position) ||
      shouldAutoSuggestInsideLabelOrientation(editor, position);

    if (!shouldTrigger) return;

    const key = `${model.uri.toString()}:${model.getVersionId()}:${position.lineNumber}:${position.column}`;
    if (lastAutoSuggestKey === key) return;
    lastAutoSuggestKey = key;

    requestAnimationFrame(() => {
      if (!editor.getModel()) return;
      editor.trigger("auto-suggest", "editor.action.triggerSuggest", {});
    });
  }

  monaco.editor.onDidCreateEditor((editor) => {
    const maybeTrigger = () => {
      const pos = editor.getPosition();
      if (!pos) return;
      triggerSuggestIfNeeded(editor, pos);
    };

    // existing content changes
    editor.onDidChangeModelContent((e) => {
      const shouldCheck = e.changes.some((change) => {
        return (
          change.text.includes("\n") ||
          change.text.includes(" ") ||
          change.text.includes("\t") ||
          change.text === "[" ||
          change.text === "," ||
          change.text === "="
        );
      });

      if (shouldCheck) {
        requestAnimationFrame(maybeTrigger);
      }
    });

    // important: Enter often lands here more reliably for your use case
    editor.onDidChangeCursorPosition(() => {
      requestAnimationFrame(maybeTrigger);
    });

    // useful for normal typing cases
    editor.onDidType((text) => {
      if (
        text === " " ||
        text === "\n" ||
        text === "[" ||
        text === "," ||
        text === "="
      ) {
        requestAnimationFrame(maybeTrigger);
      }
    });
  });
}
