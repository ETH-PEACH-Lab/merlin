import React, { useState, useRef, useEffect } from "react";
import "./components/NavigationBar.css";
import NavigationBar from "./components/NavigationBar";
import EditorSection from "./components/EditorSection";
import RendererSection from "./components/RendererSection";
import "./index.css";
import download from "downloadjs";
import { examples } from "./examples"; // Import the generated examples file
import "./App.css"; // Import the new CSS file for the top bar
import { Box, Typography } from "@mui/material";

import Header from "./components/Header";
import { useParseCompile } from "./context/ParseCompileContext";
import { extractCodeFromUrl, hasSharedExample } from "./utils/urlSharing";
import { handleExport } from "./utils/exportUtils";
import ExportProgressDialog from "./components/ExportProgressDialog";
import CustomExportDialog from "./components/CustomExportDialog";
import { useStudy } from "./study/StudyContext";
import { FullscreenWelcome, FullscreenPretask, ProgressBar, AdminModal, FinishedScreen, TopBarTimer } from "./study/StudyUI";
import LogInspector from './study/LogInspector';
import TaskPanel from "./study/TaskPanel";
import { Task1Description, Task2Description, Task3Description, Task4Description, Task5Description } from "./study/StudyTasks";
import TikzRenderer from "./study/TikzRenderer";
import TikzEditor from "./study/TikzEditor";

const App = () => {
  // Use context for code and parsing
  const {
    unparsedCode,
    parsedCode,
    compiledMerlin,
    updateUnparsedCode,
    pages,
  updateCompiledSize,
  } = useParseCompile();

  const [editor1Height, setEditor1Height] = useState(window.innerHeight / 2);
  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 2);
  const [activeTab, setActiveTab] = useState("examples");
  const [savedItems, setSavedItems] = useState([]);
  const [inspectorIndex, setInspectorIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dslEditorEditable, setDslEditorEditable] = useState(true);
  // Task panel UI state
  const [taskPanelCollapsed, setTaskPanelCollapsed] = useState(false);
  const [taskPanelHeight, setTaskPanelHeight] = useState(() => Math.round(window.innerHeight * 0.5));
  const TASK_PANEL_MIN = 120;
  const TASK_PANEL_HEADER = 40; // must match TaskPanel header height

  // Export state
  const [exportProgress, setExportProgress] = useState({
    open: false,
    current: 0,
    total: 0,
    message: '',
    isIndeterminate: false
  });
  const [customExportOpen, setCustomExportOpen] = useState(false);

  const mermaidRef = useRef(null);
  const containerRef = useRef(null);
  const study = useStudy();
  // Expose logEvent globally for non-React helpers (error logging cooldown)
  useEffect(() => {
    window.__studyLogEvent = study?.logEvent;
    return () => { if (window.__studyLogEvent) delete window.__studyLogEvent; }
  }, [study?.logEvent]);

  // Set callback for StudyContext to get current merlinCode
  useEffect(() => {
    if (study?.setCurrentMerlinCodeCallback) {
      study.setCurrentMerlinCodeCallback(() => unparsedCode);
    }
  }, [study?.setCurrentMerlinCodeCallback, unparsedCode]);
  const taskAutosaveTimer = useRef(null);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    // Keep currentPage in range
    if (currentPage < 1 || pages.length === 0) {
      setCurrentPage(1);
    } else if (currentPage > pages.length) {
      setCurrentPage(pages.length);
    }
  }, [currentPage, pages.length]);

  // Clear MerlinLite diagram when leaving a task so old diagram isn't shown in next task start screen
  useEffect(() => {
    if (study.phase !== 'task') {
      // Reset code only if we actually have compiled content to avoid unnecessary parse
      if (compiledMerlin) {
        updateUnparsedCode('');
      }
    }
  }, [study.phase]);

  // Load previously autosaved code when (re)entering a task phase
  useEffect(() => {
    if (!study.codesLoaded) return; // wait until codes are loaded to avoid races
    if (study.phase === 'task' && study.currentTask?.id) {
      const normalizeKind = (k) => (k && k.startsWith('merlin') ? 'merlin' : k);
      const taskId = study.currentTask.id;
      const currentKindNorm = normalizeKind(study.currentKind);
      const candidateKeys = new Set();
      candidateKeys.add(`taskCode_${taskId}_${currentKindNorm}`);
      if (currentKindNorm === 'merlin') {
        candidateKeys.add(`taskCode_${taskId}_merlin-lite`);
        candidateKeys.add(`taskCode_${taskId}_merlin`);
      }
      // Broad scan for any matching prefix (covers earlier bugs / key variants)
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(`taskCode_${taskId}_`)) candidateKeys.add(k);
      }
      // Also scan cookies
      document.cookie.split('; ').forEach(c => {
        const [name] = c.split('=');
        if (name && name.startsWith(`taskCode_${taskId}_`)) candidateKeys.add(name);
      });
      let best = null;
      let bestTs = 0;
      candidateKeys.forEach(k => {
        let raw = localStorage.getItem(k);
        if (!raw) {
          const cookieMatch = document.cookie.split('; ').find(c => c.startsWith(k + '='));
            if (cookieMatch) raw = decodeURIComponent(cookieMatch.split('=')[1]);
        }
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw);
          if (!parsed || !parsed.code) return;
          const parsedKindNorm = normalizeKind(parsed.kind);
          // Prefer exact current kind match over others; tie break by timestamp
          const ts = parsed.ts || 0;
          const priority = (parsedKindNorm === currentKindNorm) ? 2 : 1;
          const score = priority * 1e13 + ts; // ensure priority dominates
          if (score > bestTs) {
            bestTs = score;
            best = { ...parsed, parsedKindNorm };
          }
        } catch {}
      });
      if (best) {
        if (best.parsedKindNorm === 'tikz') {
          // Only restore non-empty TikZ code to avoid clearing existing
          if (best.code && best.code.trim() && best.code !== study.tikzCode) {
            console.log(`Restoring autosaved TikZ code for task ${taskId}`);
            console.log("Code: ", best.code);
            study.saveTikzCode(best.code);
          }
        } else if (best.parsedKindNorm === 'merlin') {
          if (best.code !== unparsedCode) {
            updateUnparsedCode(best.code);
          }
        }
      }
    }
  }, [study.phase, study.currentTask?.id, study.currentKind, study.codesLoaded]);

  // Autosave current task code (debounced) while in task phase
  useEffect(() => {
    if (!study.codesLoaded) return; // don't autosave until codes are loaded
    if (study.phase !== 'task' || !study.currentTask?.id) return;
  const kindNorm = study.currentKind && study.currentKind.startsWith('merlin') ? 'merlin' : study.currentKind;
  const key = `taskCode_${study.currentTask.id}_${kindNorm}`;
    const codeToSave = study.currentKind === 'tikz' ? study.tikzCode : unparsedCode;
    if (taskAutosaveTimer.current) clearTimeout(taskAutosaveTimer.current);
    taskAutosaveTimer.current = setTimeout(() => {
      // Skip autosave if code is empty to preserve last non-empty version
      if (codeToSave != null && codeToSave.trim() === '') {
        return;
      }
      if (codeToSave != null) {
        const payload = JSON.stringify({
          taskId: study.currentTask.id,
      kind: kindNorm,
            code: codeToSave,
          ts: Date.now()
        });
        try {
          localStorage.setItem(key, payload);
          document.cookie = `${key}=${encodeURIComponent(payload)}; path=/; max-age=604800`;
        } catch (e) {
          // Storage might be full; silently ignore
        }
      }
    }, 600); // 600ms debounce
    return () => {
      if (taskAutosaveTimer.current) clearTimeout(taskAutosaveTimer.current);
    };
  }, [study.phase, study.currentTask?.id, study.currentKind, unparsedCode, study.tikzCode]);

  // Immediately persist current code and flush logs when the page is being hidden/navigated
  useEffect(() => {
    const immediateAutosave = () => {
      try {
        if (!study.codesLoaded) return;
        if (study.phase !== 'task' || !study.currentTask?.id) return;
        const normalizeKind = (k) => (k && k.startsWith('merlin') ? 'merlin' : k);
        const kindNorm = normalizeKind(study.currentKind);
        const taskId = study.currentTask.id;
        const key = `taskCode_${taskId}_${kindNorm}`;
        const codeToSave = study.currentKind === 'tikz' ? (study.tikzCode || '') : (unparsedCode || '');
        if (!codeToSave.trim()) return; // don't overwrite with empty
        const payload = JSON.stringify({ taskId, kind: kindNorm, code: codeToSave, ts: Date.now() });
        try { localStorage.setItem(key, payload); } catch {}
        try { document.cookie = `${key}=${encodeURIComponent(payload)}; path=/; max-age=604800`; } catch {}
      } catch {}
      // Flush buffered logs as well
      try { study?.flushLogs && study.flushLogs(); } catch {}
    };
    const onVisibilityChange = () => { if (document.visibilityState === 'hidden') immediateAutosave(); };
    const onPageHide = () => immediateAutosave();
    window.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      window.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [study.codesLoaded, study.phase, study.currentTask?.id, study.currentKind, study.tikzCode, unparsedCode, study?.flushLogs]);

  useEffect(() => {
    loadSavedItems();
  }, []);

  // Listen for hash changes to support browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (hasSharedExample()) {
        const sharedCode = extractCodeFromUrl();
        if (sharedCode) {
          updateUnparsedCode(sharedCode);
          setCurrentPage(1);
          console.log('Loaded shared example from URL hash change');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [updateUnparsedCode]);

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + e.clientX - startX;
      if (newWidth > 100 && newWidth < window.innerWidth - 100) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Helper function to handle exports using the new export utilities
  const handleExportWrapper = async (format, customConfig = null) => {
    // Prevent GIF export with less than 2 pages
    if (format === 'gif' || format == "video") {
      // Determine how many pages would be exported
      let numPages = pages.length;
      if (customConfig && customConfig.pageSelection) {
        if (customConfig.pageSelection === 'single') numPages = 1;
        if (customConfig.pageSelection === 'range') numPages = Math.max(1, customConfig.rangeEnd - customConfig.rangeStart + 1);
      }
      if (numPages < 2) {
        setExportProgress(prev => ({ ...prev, open: false }));
        alert("GIF and video exports require at least 2 pages. Please add more pages to your diagram.");
        return;
      }
    }
    
    // Log export attempt
    if (study?.logEvent) {
      study.logEvent('export_attempt', { 
        format, 
        customConfig,
        numPages: pages.length
      });
    }
    
    const onProgress = (current, total, message, isIndeterminate = false) => {
      setExportProgress({
        open: true,
        current,
        total,
        message,
        isIndeterminate
      });
    };
    try {
      // Show initial progress
      onProgress(0, 0, 'Preparing export...', true);
      await handleExport(format, compiledMerlin, pages, mermaidRef, customConfig, onProgress);
      // Hide progress dialog after successful export
      setExportProgress(prev => ({ ...prev, open: false }));
      
      // Log export success
      if (study?.logEvent) {
        study.logEvent('export_success', { 
          format, 
          customConfig,
          numPages: pages.length
        });
      }

    } catch (error) {
      console.error(`Export failed for format ${format}:`, error);
      // Hide progress dialog on error
      setExportProgress(prev => ({ ...prev, open: false }));
      
      // Log export failure
      if (study?.logEvent) {
        study.logEvent('export_failure', { 
          format, 
          customConfig,
          error: error.message
        });
      }
      console.error(`Export failed for format ${format}:`, error);
      // Hide progress dialog on error
      setExportProgress(prev => ({ ...prev, open: false }));
      

    }
  };

  const handleCustomExport = (format, customConfig) => {
    handleExportWrapper(format, customConfig);
  };

  const handleSelectExample = (item) => {
    // Log example selection
    if (study?.logEvent) {
      study.logEvent('load_example', { 
        exampleName: item.timestamp || 'unknown',
        userCodeLength: item.userCode?.length || 0,
        mermaidCodeLength: item.mermaidCode?.length || 0
      });
    }
    
    updateUnparsedCode(item.userCode);
    setCurrentPage(1);
  };

  // Prefill code for specific tasks when starting
  const handleStartTask = () => {
    const { currentTask, currentSubtask, currentKind } = study;
    // Try to restore autosaved code first (Merlin or TikZ) BEFORE injecting templates
    if (currentTask?.id) {
      const normalizeKind = (k) => (k && k.startsWith('merlin') ? 'merlin' : k);
      const kindNorm = normalizeKind(currentKind);
      const taskId = currentTask.id;
      // Reuse broader scan logic
      const candidateKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(`taskCode_${taskId}_`)) candidateKeys.push(k);
      }
      document.cookie.split('; ').forEach(c => {
        const [name] = c.split('=');
        if (name && name.startsWith(`taskCode_${taskId}_`) && !candidateKeys.includes(name)) candidateKeys.push(name);
      });
      let best = null; let bestScore = 0;
      candidateKeys.forEach(k => {
        let raw = localStorage.getItem(k);
        if (!raw) {
          const cookieMatch = document.cookie.split('; ').find(c => c.startsWith(k + '='));
          if (cookieMatch) raw = decodeURIComponent(cookieMatch.split('=')[1]);
        }
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw);
          if (!parsed || !parsed.code) return;
          const pk = normalizeKind(parsed.kind);
          const ts = parsed.ts || 0;
          const priority = pk === kindNorm ? 2 : 1;
          const score = priority * 1e13 + ts;
          if (score > bestScore) { bestScore = score; best = { ...parsed, pk }; }
        } catch {}
      });
      if (best) {
        if (best.pk === 'tikz' && kindNorm === 'tikz') {
          study.saveTikzCode(best.code || '');
          study.startCurrentTaskOrSubtask();
          return;
        }
        if (best.pk === 'merlin' && kindNorm === 'merlin') {
          updateUnparsedCode(best.code || '');
          setCurrentPage(1);
          study.startCurrentTaskOrSubtask();
          return;
        }
      }
    }
    if (currentKind === 'tikz') {
      // TikZ starter template
      const tikzTemplate = `\\usepackage{tikz}
\\usetikzlibrary{decorations.pathmorphing}

\\begin{document}
\\begin{tikzpicture}

\\draw (0,0) rectangle ++(1,1);

\\end{tikzpicture}
\\end{document}`;
      study.saveTikzCode(tikzTemplate);
    } else if (currentKind === 'merlin') {
      if (currentTask?.id === 'task4') {
        const template = `array nums = {
    value: [6,12,3,4,6,11,20]
    color: ["orange","orange","orange","orange","orange","orange","orange"]
    left: "nums"
}

array min = {
    value: [6,12,3,4,6,11,20]
    color: ["lightgreen","lightgreen","lightgreen","lightgreen","lightgreen","lightgreen","lightgreen"]
    left: "min"
}

stack s = {
    value: [6,11,20]
    above: "stack"
}

page
show nums tl
show min bl
show s right`;
        updateUnparsedCode(template);
        setCurrentPage(1);
      } else if (currentTask?.id === 'task5') {
        const template = `matrix grid = {
    value: [[1,2],[3,4]]
}

page
show grid`;
        updateUnparsedCode(template);
        setCurrentPage(1);
      } else if (currentTask?.id === 'task3') {
        const template = `matrix dp = { 
    value: [[0,0,0,0], [0,0,0,0], [0,0,0,0]] 
    color: [["yellow","yellow","yellow","yellow"], ["yellow","yellow","yellow","yellow"], ["yellow","yellow","yellow","yellow"]]
    above: "dp"
}

matrix days = {
    value: [[1,3,1],[6,0,3],[3,3,3]]
    above: "days"
}

matrix flights = {
    value: [[0,1,1],[1,0,1],[1,1,0]]
    above: "flights"
}

page
show dp
show days
show flights`;
        updateUnparsedCode(template);
        setCurrentPage(1);
      } else {
        updateUnparsedCode('');
        setCurrentPage(1);
      }
    }
    study.startCurrentTaskOrSubtask();
  };

  // During tasks, save Merlin code changes
  const handleCodeChange = (code) => {
    // Before triggering compile, push current measured size to CSS vars so compiler reads the same size
    try {
      const rendererContainer = containerRef.current?.querySelector('.SvgRenderContent');
      if (rendererContainer) {
        const rect = rendererContainer.getBoundingClientRect();
        const w = Math.max(1, Math.round(rect.width) - 12);
        const h = Math.max(1, Math.round(rect.height) - 12 - 40); // conservative subtract for page controls if present
        document.documentElement.style.setProperty('--mermaid-container-width', `${w}px`);
        document.documentElement.style.setProperty('--mermaid-container-height', `${h}px`);
      }
    } catch {}
    updateUnparsedCode(code);
    if (study?.notifyEditorChange) study.notifyEditorChange('merlin');
    if (study.phase === 'task' && study.currentKind === 'merlin') {
      study.saveMerlinCode(code);
    }
  };

  const handleSave = () => {
    const timestamp = new Date().toISOString();
    const cookieName = `diagram_${timestamp}`;
    const newSavedItem = {
      userCode: unparsedCode,
      mermaidCode: compiledMerlin,
      timestamp: timestamp,
    };

    // Log save attempt
    if (study?.logEvent) {
      study.logEvent('save_diagram', { 
        timestamp,
        userCodeLength: unparsedCode.length,
        mermaidCodeLength: compiledMerlin?.length || 0
      });
    }

    // Save new item to cookies
    document.cookie = `${cookieName}=${encodeURIComponent(
      JSON.stringify(newSavedItem)
    )}; max-age=31536000; path=/`;

    // Save new item to local storage
    localStorage.setItem(cookieName, JSON.stringify(newSavedItem));

    // Update saved items state
    setSavedItems((prevItems) => {
      const updatedItems = [...prevItems, newSavedItem];
      if (updatedItems.length > 20) {
        // Remove oldest item if more than 20
        const oldestItem = updatedItems.shift();
        document.cookie = `${oldestItem.timestamp}=; max-age=0; path=/`; // Delete the cookie
        localStorage.removeItem(`diagram_${oldestItem.timestamp}`); // Delete the item from local storage
      }
      // Sort items in descending order
      updatedItems.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      return updatedItems;
    });

    // Function to trigger the download of the string onto the local computer
    const downloadString = (filename, content) => {
      const blob = new Blob([content], { type: "text/plain" });
      const link = document.createElement("a");
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    };

    // Prepare plain text content for download
    const plainTextContent = `
userCode:

${unparsedCode}

mermaidCode:

${compiledMerlin}

timestamp:

${timestamp}
    `;

    // Download the saved item as a plain text file
    downloadString(`${cookieName}.txt`, plainTextContent);

    // Show alert
    alert("Diagram saved successfully!");
  };

  const loadSavedItems = () => {
    const cookies = document.cookie.split("; ");
    const loadedItems = cookies
      .map((cookie) => {
        const [name, value] = cookie.split("=");
        if (name.startsWith("diagram_")) {
          return JSON.parse(decodeURIComponent(value));
        }
        return null;
      })
      .filter((item) => item !== null);

    // Sort items in descending order
    loadedItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setSavedItems(loadedItems);
  };

  const handleSelectSavedItem = (item) => {
    updateUnparsedCode(item.userCode);
    setCurrentPage(1);
  };

  const updateInspector = (unitID, componentID, pageID) => {
    // Update the Inspector based on the given IDs
    if (unitID && componentID && pageID)
      setInspectorIndex({ unitID, componentID, pageID });
    else setInspectorIndex(null);
  };

  // Fire resize when task panel size changes (helps diagram rerender)
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [taskPanelHeight, taskPanelCollapsed]);

  const handleTaskPanelResizeMouseDown = (e) => {
    if (taskPanelCollapsed) return; // ignore when collapsed
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = taskPanelHeight;
    const containerRect = containerRef.current?.getBoundingClientRect();

    const onMove = (me) => {
      if (!containerRect) return;
      const delta = me.clientY - startY;
      // Handle sits above panel, dragging up decreases panel height
      let newHeight = startHeight - delta;
      const maxHeight = containerRect.height - 150; // leave space for renderer
      if (newHeight < TASK_PANEL_MIN) newHeight = TASK_PANEL_MIN;
      if (newHeight > maxHeight) newHeight = maxHeight;
      setTaskPanelHeight(newHeight);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      // After resize finished, update compiled size using renderer container
      requestAnimationFrame(() => {
      const rendererContainer = containerRef.current?.querySelector('.SvgRenderContent');
        if (rendererContainer) {
          const rect = rendererContainer.getBoundingClientRect();
        // Force apply the settled size to avoid oscillation at threshold
        updateCompiledSize && updateCompiledSize(Math.round(rect.width), Math.round(rect.height), true);
        }
      });
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const toggleTaskPanel = () => {
    setTaskPanelCollapsed(prev => !prev);
    if (taskPanelCollapsed) {
      // expanding
      if (taskPanelHeight < TASK_PANEL_MIN) {
        setTaskPanelHeight(Math.round(window.innerHeight * 0.5));
      }
    }
    // Defer size update until layout settles
    setTimeout(() => {
      const rendererContainer = containerRef.current?.querySelector('.SvgRenderContent');
      if (rendererContainer) {
        const rect = rendererContainer.getBoundingClientRect();
        updateCompiledSize && updateCompiledSize(Math.round(rect.width), Math.round(rect.height), true);
      }
    }, 50);
  };

  return (
    <>
    {/* Fullscreen phases */}
    {study.phase === 'welcome' && (
      <FullscreenWelcome onNext={study.proceedToFirstExercise} />
    )}
    {study.phase === 'pretask' && (
      <FullscreenPretask 
        title={(study.currentTask?.title || 'Exercise')} 
        subtaskInfo={study.currentSubtask ? `Subtask ${study.subtaskIndex + 1} (${study.currentSubtask.kind === 'tikz' ? 'TikZ' : 'Merlin Lite'})` : null}
        onStart={handleStartTask} 
      />
    )}
    {study.phase === 'finished' && (
      <FinishedScreen uid={study.uid} onOpenAdmin={()=>setAdminOpen(true)} />
    )}

    <div ref={containerRef} className="container" data-study-phase={study.phase}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <Header
            onOpenAdmin={()=>setAdminOpen(true)}
            sx={{
              position: {
                md: "static",
              },
            }}
          />
          {study.phase === 'task' && (
            <Box sx={{ borderBottom: '1px solid #333', bgcolor: '#0f0f0f', display:'flex', alignItems:'center', justifyContent:'space-between', px:1 }}>
              <ProgressBar />
            </Box>
          )}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              minHeight: 0,
            }}
            >
            { study.phase !== 'task' && (
            <NavigationBar
              items={examples}
              savedItems={savedItems}
              onSelect={
                activeTab === "examples"
                  ? handleSelectExample
                  : handleSelectSavedItem
              }
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            )}
            <Box
              component="main"
              sx={{
                minWidth: 0,
                minHeight: 0,
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    marginLeft: `0px`,
                  }}
                >
                  {study.phase === 'task' && study.currentKind === 'tikz' ? (
                    <Box style={{ width: leftWidth, display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>
                      <Box style={{ padding: 8, borderBottom: '1px solid #444' }}>
                        <Typography variant="overline">TikZ Editor</Typography>
                      </Box>
                      <div style={{ flex:1, minHeight:0 }}>
                        {study.codesLoaded ? (
                          <TikzEditor
                            key={`${study.currentTask?.id}:${study.subtaskIndex}:${study.codesLoaded ? 1 : 0}`}
                            path={`tikz-${study.currentTask?.id}-${study.subtaskIndex}`}
                            value={study.tikzCode || ''}
                            onChange={code => { study.saveTikzCode(code || ''); study?.notifyEditorChange && study.notifyEditorChange('tikz'); }}
                          />
                        ) : (
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>Loading…</div>
                        )}
                      </div>
                    </Box>
                  ) : (
                    <EditorSection
                      code1={unparsedCode}
                      mermaidCode={compiledMerlin}
                      editor1Height={editor1Height}
                      leftWidth={leftWidth}
                      setEditor1Height={setEditor1Height}
                      handleMouseDown={handleMouseDown}
                      updateInspector={updateInspector}
                      dslEditorEditable={dslEditorEditable}
                      setDslEditorEditable={setDslEditorEditable}
                      setCode1={handleCodeChange}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      pages={pages}
                    />
                  )}
                  <div
                    style={{
                      width: "5px",
                      cursor: "col-resize",
                      borderLeft: "solid 1px #666",
                      position: "relative",
                      zIndex: 1,
                    }}
                    onMouseDown={handleMouseDown}
                  />
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                    {/* Renderer / Diagram area */}
                    <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                      {study.phase === 'task' && study.currentKind === 'tikz' ? (
                        study.codesLoaded ? (
                          <TikzRenderer code={study.tikzCode} />
                        ) : (
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>Loading…</div>
                        )
                      ) : (
                        <RendererSection
                          mermaidCode={compiledMerlin}
                          handleExport={handleExportWrapper}
                          handleSave={handleSave}
                          mermaidRef={mermaidRef}
                          updateInspector={updateInspector}
                          inspectorIndex={inspectorIndex}
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          onOpenCustomExport={() => setCustomExportOpen(true)}
                        />
                      )}
                    </div>

                    {/* Resize handle shown only in task phase & when expanded */}
                    {study.phase === 'task' && !taskPanelCollapsed && (
                      <div
                        onMouseDown={handleTaskPanelResizeMouseDown}
                        style={{
                          height: '6px',
                          cursor: 'row-resize',
                          background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                          borderTop: '1px solid #333',
                          borderBottom: '1px solid #222',
                          flex: '0 0 auto',
                          userSelect: 'none'
                        }}
                      />
                    )}

                    {/* Task Panel container */}
                    {study.phase === 'task' && (
                      <div
                        style={{
                          flex: '0 0 auto',
                          height: taskPanelCollapsed ? TASK_PANEL_HEADER : taskPanelHeight,
                          minHeight: taskPanelCollapsed ? TASK_PANEL_HEADER : TASK_PANEL_MIN,
                          background: '#1e1e1e',
                          display: 'flex',
                          flexDirection: 'column',
                          borderTop: '1px solid #444'
                        }}
                      >
                        {study.currentTask?.id === 'task1' && (
                          <TaskPanel
                            title={study.currentSubtask?.kind === 'tikz' ? 'Task 1 – Array Visualization (TikZ) [10 min]' : 'Task 1 – Array Visualization (Merlin Lite) [10 min]'}
                            collapsed={taskPanelCollapsed}
                            onToggle={toggleTaskPanel}
                          >
                            <Task1Description isMerlinLite={study.currentSubtask?.kind === 'merlin-lite'} />
                          </TaskPanel>
                        )}
                        {study.currentTask?.id === 'task2' && (
                          <TaskPanel title="Task 2 – Binary Tree Traversal [20 min]" collapsed={taskPanelCollapsed} onToggle={toggleTaskPanel}>
                            <Task2Description />
                          </TaskPanel>
                        )}
                        {study.currentTask?.id === 'task3' && (
                          <TaskPanel title="Task 3 – Positioning and Text [10 min]" collapsed={taskPanelCollapsed} onToggle={toggleTaskPanel}>
                            <Task3Description />
                          </TaskPanel>
                        )}
                        {study.currentTask?.id === 'task4' && (
                          <TaskPanel title="Task 4 – 123 Pattern: Applying Modifications [10 min]" collapsed={taskPanelCollapsed} onToggle={toggleTaskPanel}>
                            <Task4Description />
                          </TaskPanel>
                        )}
                        {study.currentTask?.id === 'task5' && (
                          <TaskPanel title="Task 5 – Matrix Border Highlighting [10 min]" collapsed={taskPanelCollapsed} onToggle={toggleTaskPanel}>
                            <Task5Description />
                          </TaskPanel>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Export Progress Dialog */}
      <ExportProgressDialog
        open={exportProgress.open}
        current={exportProgress.current}
        total={exportProgress.total}
        message={exportProgress.message}
        title="Exporting Diagram"
      />

      {/* Custom Export Dialog */}
      <CustomExportDialog
        open={customExportOpen}
        onClose={() => setCustomExportOpen(false)}
        onExport={handleCustomExport}
        compiledMerlin={compiledMerlin}
        pages={pages}
        mermaidRef={mermaidRef}
        currentPage={currentPage}
      />
  </div>
  {adminOpen && (study.phase !== 'idle') && (
    <AdminModal open={adminOpen} onClose={()=>setAdminOpen(false)} />
  )}
  {/* Fullscreen log inspector when not in core study screens */}
  {adminOpen && (study.phase === 'idle') && (
    <LogInspector open={adminOpen} onClose={()=>setAdminOpen(false)} currentUid={study.uid} />
  )}
    </>
  );
};

export default App;
