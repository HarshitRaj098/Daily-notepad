/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  FileText, 
  FolderIcon, 
  ChevronRight, 
  ChevronDown, 
  MoreVertical,
  Sidebar as SidebarIcon,
  Archive,
  Star,
  CheckSquare,
  Clock,
  Pencil,
  Eraser,
  RotateCcw,
  Highlighter,
  Layers,
  Anchor,
  Underline as UnderlineIcon,
  Camera,
  Minus,
  Strikethrough,
  ArrowRight,
  Square
} from 'lucide-react';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
  pressure?: number;
  velocity?: number;
  timestamp?: number;
}

type WorkspaceMode = 'focused' | 'standard' | 'research';

interface Stroke {
  id: string;
  points: Point[];
  tool: 'pencil' | 'highlighter' | 'eraser' | 'arrow' | 'rect';
  color: string;
  width: number;
  timestamp: number;
}

export interface DepthLayer {
  id: string;
  type: 'fold' | 'margin' | 'beneath';
  content: string;
  timestamp: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  updatedAt: number;
  isPinned: boolean;
  isDeleted?: boolean;
  deletedAt?: number;
  drawing?: string; // Image URL for preview
  drawingData?: Stroke[]; // Structured data for the Pencil Engine
  depthLayers?: DepthLayer[]; // 131: Folded Reflection Layers
  visitCount?: number;
  epoch?: string;
  historicalContext?: 'neutral' | 'engineering' | 'editing' | 'creative';
  type?: 'text' | 'image' | 'sketch';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  mediaUrl?: string;
  revisions?: string[];
  landmarkColor?: string;
  editCount?: number;
  marks?: { id: string; x: number; y: number; type: 'fingerprint' | 'scribble' | 'star-highlight' }[];
}

interface WorkspaceSnapshot {
  id: string;
  timestamp: number;
  name: string;
  noteCount: number;
}

interface SpatialBookmark {
  id: string;
  name: string;
  x: number;
  y: number;
  zoom: number;
}

interface Folder {
  id: string;
  name: string;
  icon: 'FolderIcon' | 'Archive' | 'Star';
}

// Memory Density & Emotional Gravity Calculation (Reinvention Phase 4)
export const getMemoryDensity = (note: any) => {
  if (!note) return 0;
  const visits = note.visitCount || 0;
  const edits = note.editCount || 0;
  const marksCount = note.marks ? note.marks.length : 0;
  const revsCount = note.revisions ? note.revisions.length : 0;
  
  // Base density is calculated quiet & organically from direct interaction indices:
  const score = (visits * 0.4) + (edits * 0.6) + (marksCount * 1.5) + (revsCount * 1.2);
  return Number(score.toFixed(2));
};

// Phase 81 - 210: Professional Workspace Engine
function useWorkspaceEngine(selectedNoteId: string | null, notes: Note[], workspaceMode: WorkspaceMode) {
  const [pressure, setPressure] = useState<'low' | 'medium' | 'high'>('low');
  const [activeContext, setActiveContext] = useState<'neutral' | 'engineering' | 'editing' | 'creative'>('neutral');
  const [isDeepFocus, setIsDeepFocus] = useState(false);
  const [contextStatus, setContextStatus] = useState<string | null>(null);
  const [currentEpoch, setCurrentEpoch] = useState<string>('Main Workspace');
  
  const lastKeyTime = useRef(Date.now());
  const [fragmentation, setFragmentation] = useState(0);
  const semanticProcessingRef = useRef<NodeJS.Timeout | null>(null);

  // Phase 117 & 126: Workflow Boundaries
  const isSilenced = pressure === 'high';

  // Phase 152: Contextual Context Alignment
  useEffect(() => {
    if (!selectedNoteId) return;
    const note = notes.find(n => n.id === selectedNoteId);
    if (note?.historicalContext) {
      setActiveContext(note.historicalContext);
      setContextStatus(`Aligned to ${note.epoch || 'previous'} context`);
    }
  }, [selectedNoteId]);

  // Phase 147: Project Lifecycle Epoch Tracking
  useEffect(() => {
    const technicalWeight = notes.filter(n => n.content.toLowerCase().includes('arch') || n.content.toLowerCase().includes('system')).length;
    const creativeWeight = notes.filter(n => n.content.toLowerCase().includes('creative') || n.content.toLowerCase().includes('design')).length;
    
    if (technicalWeight > creativeWeight && technicalWeight > 5) setCurrentEpoch('Engineering Phase');
    else if (creativeWeight > 5) setCurrentEpoch('Creative Studio Phase');
    else setCurrentEpoch('Discovery Phase');
  }, [notes]);

  // Phase 196: Precision Workspace Context Analysis
  useEffect(() => {
    if (pressure === 'high' || workspaceMode === 'research') {
      if (workspaceMode === 'research') {
        setActiveContext('neutral');
        setContextStatus('Focus Lock Engaged');
      }
      return;
    }

    if (semanticProcessingRef.current) clearTimeout(semanticProcessingRef.current);
    
    semanticProcessingRef.current = setTimeout(() => {
      if (!selectedNoteId) {
        setActiveContext('neutral');
        setContextStatus(null);
        return;
      }
      const note = notes.find(n => n.id === selectedNoteId);
      if (!note) return;

      const content = note.content.toLowerCase();
      const title = note.title.toLowerCase();

      let nextContext: 'neutral' | 'engineering' | 'editing' | 'creative' = 'neutral';
      let status = '';

      if (content.includes('```') || content.includes('const ') || content.includes('function') || title.includes('system') || title.includes('arch') || content.includes('low-level')) {
        nextContext = 'engineering';
        status = 'Engineering Layout Optimized';
      } else if (content.includes('editing') || content.includes('writing') || content.includes('draft') || content.includes('article') || note.content.length > 2000) {
        nextContext = 'editing';
        status = 'Editorial Mode Calibrated';
      } else if (content.includes('design') || content.includes('visual') || content.includes('layout') || content.includes('asset')) {
        nextContext = 'creative';
        status = 'Creative Asset Viewport';
      }

      setActiveContext(prev => {
        if (prev === nextContext) return prev;
        setContextStatus(status);
        return nextContext;
      });
    }, workspaceMode === 'focused' ? 2000 : 800); 

    return () => {
      if (semanticProcessingRef.current) clearTimeout(semanticProcessingRef.current);
    };
  }, [selectedNoteId, notes, pressure, workspaceMode]); 

  // Calculate System Fragmentation (Pressure equivalent)
  useEffect(() => {
    if (fragmentation > 5) {
      setPressure('high');
      setIsDeepFocus(true);
    } else if (fragmentation > 2) {
      setPressure('medium');
      setIsDeepFocus(false);
    } else {
      setPressure('low');
      setIsDeepFocus(false);
    }
  }, [fragmentation]);

  const trackSwitch = () => {
    setFragmentation(prev => prev + 1);
    setTimeout(() => {
      setFragmentation(prev => Math.max(0, prev - 1));
    }, 8000); 
  };

  return { 
    pressure, 
    trackSwitch, 
    fragmentation, 
    activeContext, 
    isDeepFocus, 
    contextStatus,
    currentEpoch,
    setActiveContext
  };
}

// Phase 183: High-Fidelity Professional Visual Engine
const WorkspaceLayer = React.memo(({ activeContext, pressure }: { activeContext: string, pressure: 'low' | 'medium' | 'high' }) => {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none transition-opacity duration-1500 z-0 bg-[#fafafa] opacity-30`} 
      style={{ willChange: 'opacity' }}
    />
  );
});

// Phase 96: Render Cascade Separation
const Sidebar = React.memo(({ folders, selectedFolderId, setSelectedFolderId, deleteFolder, addFolder, notes, trackSwitch, currentEpoch, snapshots, createSnapshot, restoreSnapshot, exportWorkspace, exportAsMarkdown, captureScreenshot, untouchedDormancy }: any) => {
  return (
    <div className="px-5 mb-8 flex flex-col h-full">
      <div className="mb-8 pt-6">
        <h1 className="text-[10px] font-black text-[#1d1d1f] uppercase tracking-[0.2em] mb-4 opacity-40">Workspace State</h1>
        <div className="px-4 py-2.5 bg-black/[0.03] border border-black/[0.05] flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-black" />
          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#1d1d1f]">{currentEpoch}</span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-[10px] font-black text-[#1d1d1f] uppercase tracking-[0.2em] mb-4 opacity-40">Persistence</h1>
        <button 
          onClick={() => createSnapshot()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-black/80 transition-colors mb-2"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Save Snapshot
        </button>
        {snapshots.length > 0 && (
          <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-hide pr-1 mb-4">
            {snapshots.map(s => (
              <button 
                key={s.id}
                onClick={() => restoreSnapshot(s.id)}
                className="w-full text-left px-3 py-2 bg-black/[0.03] hover:bg-black/[0.06] rounded-md text-[9px] font-bold uppercase tracking-wider text-black/60 truncate"
                title={new Date(s.timestamp).toLocaleString()}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-1 mt-2">
          <button 
            onClick={exportWorkspace}
            className="px-2 py-2 bg-black/[0.02] border border-black/5 text-[8px] font-black uppercase tracking-widest text-black/40 hover:bg-black/5 hover:text-black transition-all"
          >
            Export JSON
          </button>
          <button 
            onClick={exportAsMarkdown}
            className="px-2 py-2 bg-black/[0.02] border border-black/5 text-[8px] font-black uppercase tracking-widest text-black/40 hover:bg-black/5 hover:text-black transition-all"
          >
            Export MD
          </button>
          <button 
            onClick={captureScreenshot}
            className="col-span-2 px-2 py-2 bg-black/[0.02] border border-black/5 text-[8px] font-black uppercase tracking-widest text-black/40 hover:bg-black/5 hover:text-black transition-all"
          >
            Capture Screenshot
          </button>
        </div>
      </div>

      <h1 className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-4">iCloud</h1>
      <nav className="space-y-0.5">
        {folders.map((folder: any) => (
          <div key={folder.id} className="group flex items-center pr-2">
            <button
              onClick={() => {
                setSelectedFolderId(folder.id);
                trackSwitch();
              }}
              className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${selectedFolderId === folder.id ? 'bg-[#e5e5ea] text-[#007aff]' : 'hover:bg-[#e8e8ed]'}`}
            >
              {folder.icon === 'Star' ? <Star className="w-4 h-4" /> : folder.icon === 'Archive' ? <Archive className="w-4 h-4" /> : <FolderIcon className="w-4 h-4" />}
              <span className="flex-1 text-left truncate">{folder.name}</span>
              <span className="text-xs text-[#86868b]">
                {folder.id === 'all' ? notes.filter((n: any) => !n.isDeleted).length : notes.filter((n: any) => n.folderId === folder.id && !n.isDeleted).length}
              </span>
            </button>
            {folder.id !== 'all' && folder.id !== 'pinned' && folder.id !== 'archive' && (
              <button 
                onClick={() => deleteFolder(folder.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
        <button
            onClick={() => {
              setSelectedFolderId('deleted');
              trackSwitch();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${selectedFolderId === 'deleted' ? 'bg-[#e5e5ea] text-[#007aff]' : 'hover:bg-[#e8e8ed]'}`}
          >
            <Trash2 className="w-4 h-4" />
            <span className="flex-1 text-left truncate">Recently Deleted</span>
            <span className="text-xs text-[#86868b]">
              {notes.filter((n: any) => n.isDeleted).length}
            </span>
          </button>
      </nav>
      <div className="mt-auto pt-8 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <button 
            onClick={addFolder}
            className="text-black/40 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:text-black transition-colors"
          >
            <Plus className="w-3 h-3" /> New Folder
          </button>
        </div>
        {untouchedDormancy && (
          <div className="pt-2 border-t border-black/[0.04] text-[9px] font-mono text-black/30 uppercase tracking-[0.2em] select-none leading-relaxed flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-black/20 animate-pulse shrink-0" />
            <span>Rested dormant for {untouchedDormancy}</span>
          </div>
        )}
      </div>
    </div>
  );
});

const NoteListPanel = React.memo(({ isTyping, pressure, setIsSidebarOpen, isSidebarOpen, addNote, deleteNote, searchQuery, setSearchQuery, selectedFolderId, emptyTrash, notes, pinnedNotes, otherNotes, selectedNoteId, setSelectedNoteId, trackSwitch, workspaceMode, setWorkspaceMode, isSpatialMode, setIsSpatialMode, isGridEnabled, setIsGridEnabled, isSnappingEnabled, setIsSnappingEnabled }: any) => {
  return (
    <section 
      className={`flex-shrink-0 flex flex-col pt-12 bg-black/[0.01] backdrop-blur-sm z-10 transition-all duration-1000 ${isTyping ? 'opacity-[0.01] blur-[1px] pointer-events-none' : ''} ${pressure === 'high' ? 'w-20' : 'w-[320px]'} ${pressure === 'high' ? 'blur-[var(--interface-blur)] opacity-[var(--focus-opacity)]' : ''}`}
    >
      <div className="px-5 mb-4 flex items-center justify-between">
        {pressure !== 'high' && (
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-md text-[#86868b]"
          >
            <SidebarIcon className="w-5 h-5" />
          </button>
        )}
        {pressure !== 'high' && (
          <div className="flex items-center gap-1">
             <button 
               onClick={() => {
                 const modes: WorkspaceMode[] = ['standard', 'focused', 'research'];
                 const next = modes[(modes.indexOf(workspaceMode) + 1) % modes.length];
                 setWorkspaceMode(next);
               }}
               className={`p-1.5 rounded-md transition-all ${workspaceMode === 'research' ? 'text-black bg-black/10' : workspaceMode === 'focused' ? 'text-black bg-black/5' : 'text-[#86868b] hover:bg-gray-100'}`}
               title={`Workflow: ${workspaceMode}`}
             >
               <Star className={`w-5 h-5 ${workspaceMode !== 'standard' ? 'fill-black' : ''}`} />
             </button>
             <button 
               onClick={() => setIsSpatialMode(!isSpatialMode)}
               className={`p-1.5 rounded-md transition-all ${isSpatialMode ? 'text-[#007aff] bg-[#007aff]/10' : 'text-[#86868b] hover:bg-gray-100'}`}
               title={isSpatialMode ? "Focused Writing Desk" : "Spatial Infinite Desk"}
             >
               <Layers className="w-5 h-5" />
             </button>
             <button 
               onClick={addNote}
               className="p-1.5 hover:bg-gray-100 rounded-md text-[#007aff]"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {pressure !== 'high' && (
        <div className="px-5 mb-4">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#86868b] group-focus-within:text-[#007aff] transition-colors" />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#e3e3e8] border-none rounded-lg text-sm focus:outline-none focus:ring-0 placeholder-[#86868b]" 
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2 scrollbar-hide">
        {selectedFolderId === 'deleted' && notes.filter((n: any) => n.isDeleted).length > 0 && pressure !== 'high' && (
          <div className="px-5 mb-4">
            <button 
              onClick={emptyTrash}
              className="w-full py-1.5 text-xs font-semibold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Empty Trash
            </button>
          </div>
        )}

        {(pressure !== 'high' && (pinnedNotes.length + otherNotes.length) === 0) ? (
          <div className="px-5 py-10 text-center text-[#86868b] text-sm">
            No notes found
          </div>
        ) : (
          <div className="space-y-4">
            {pinnedNotes.length > 0 && (
              <div>
                {pressure !== 'high' && <h3 className="px-7 text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Pinned</h3>}
                {pinnedNotes.map((note: any) => (
                  <NoteListItem 
                    key={note.id} 
                    note={note} 
                    isSelected={selectedNoteId === note.id} 
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      trackSwitch();
                    }}
                    onDelete={() => deleteNote(note.id)}
                    isCollapsed={pressure === 'high'}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            )}
            
            <div>
              {pinnedNotes.length > 0 && pressure !== 'high' && <h3 className="px-7 text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1 mt-4">Notes</h3>}
              {otherNotes.map((note: any) => (
                <NoteListItem 
                  key={note.id} 
                  note={note} 
                  isSelected={selectedNoteId === note.id} 
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    trackSwitch();
                  }}
                  onDelete={() => deleteNote(note.id)}
                  isCollapsed={pressure === 'high'}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

// Phase 161 & 163 & 184 & 196 & 213: Professional Infinite Canvas with Spatial Navigation
const SpatialCanvas = React.memo(({ notes, updateNote, deleteNote, selectedNoteId, setSelectedNoteId, addSpreadNode, pressure, isDeepFocus, isGridEnabled, isSnappingEnabled, activeContext, bookmarks, addBookmark, jumpToBookmark, onJumpComplete, captureScreenshot }: any) => {
  const [viewport, setViewport] = useState(() => {
    const saved = localStorage.getItem('spatial_viewport');
    return saved ? JSON.parse(saved) : { x: 0, y: 0, zoom: 1 };
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingViewport = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem('spatial_viewport', JSON.stringify(viewport));
  }, [viewport]);

  // Phase 211: Performance Virtualization State
  const [visibleNotes, setVisibleNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (jumpToBookmark) {
      setViewport({ x: jumpToBookmark.x, y: jumpToBookmark.y, zoom: jumpToBookmark.zoom });
      onJumpComplete?.();
    }
  }, [jumpToBookmark, onJumpComplete]);

  // Phase 211: High-Performance Viewport Virtualization
  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const buffer = 500;
    const vX = -viewport.x / viewport.zoom - buffer;
    const vY = -viewport.y / viewport.zoom - buffer;
    const vW = rect.width / viewport.zoom + buffer * 2;
    const vH = rect.height / viewport.zoom + buffer * 2;

    const filtered = notes.filter((n: Note) => {
      if (n.x === undefined || n.y === undefined) return false;
      return n.x >= vX && n.x <= vX + vW && n.y >= vY && n.y <= vY + vH;
    });

    setVisibleNotes(filtered);
  }, [notes, viewport, containerRef]);

  const [isDrawingMode, setIsDrawingMode] = useState(false);

  // Phase 163: Canvas Level Strokes
  const [canvasStrokes, setCanvasStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDrawingMode && e.button === 0) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left - viewport.x) / viewport.zoom;
      const y = (e.clientY - rect.top - viewport.y) / viewport.zoom;
      setCurrentStroke([{ x, y }]);
      return;
    }

    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      isDraggingViewport.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawingMode && currentStroke.length > 0) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left - viewport.x) / viewport.zoom;
      const y = (e.clientY - rect.top - viewport.y) / viewport.zoom;
      setCurrentStroke(prev => [...prev, { x, y }]);
      return;
    }

    if (isDraggingViewport.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setViewport(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    if (isDrawingMode && currentStroke.length > 0) {
      const newStroke: Stroke = {
        id: crypto.randomUUID(),
        points: currentStroke,
        tool: 'pencil',
        color: '#000000',
        width: 1.5,
        timestamp: Date.now()
      };
      setCanvasStrokes(prev => [...prev, newStroke]);
      setCurrentStroke([]);
    }
    isDraggingViewport.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const delta = -e.deltaY;
      const factor = Math.pow(1.1, delta / 100);
      
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const worldX = (mouseX - viewport.x) / viewport.zoom;
      const worldY = (mouseY - viewport.y) / viewport.zoom;
      
      const newZoom = Math.max(0.05, Math.min(10, viewport.zoom * factor));
      const newX = mouseX - worldX * newZoom;
      const newY = mouseY - worldY * newZoom;
      
      setViewport({ x: newX, y: newY, zoom: newZoom });
      e.preventDefault();
    } else {
      setViewport(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`flex-1 relative overflow-hidden bg-[#fafafa] canvas-texture ${isDrawingMode ? 'cursor-none' : 'cursor-crosshair'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        backgroundImage: isGridEnabled ? `radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)` : undefined,
        backgroundPosition: `${viewport.x}px ${viewport.y}px`,
        backgroundSize: `${100 * viewport.zoom}px ${100 * viewport.zoom}px`
      }}
    >
      <motion.div 
        className="absolute inset-0 origin-top-left"
        style={{ 
          x: viewport.x, 
          y: viewport.y, 
          scale: viewport.zoom,
          willChange: 'transform'
        }}
      >
        {/* Phase 6 Terrain Auras Layer (Rendered underneath all notes) */}
        {notes.map((note: Note) => {
          if (note.x === undefined || note.y === undefined || note.isDeleted) return null;
          const density = getMemoryDensity(note);
          const auraSize = 400 + Math.min(600, density * 20);
          const auraOpacity = 0.01 + Math.min(0.04, density * 0.0015);
          
          return (
            <div 
              key={`aura-${note.id}`}
              className="absolute pointer-events-none transition-all duration-[2000ms] rounded-full"
              style={{
                width: auraSize,
                height: auraSize,
                left: note.x + (note.width || 280)/2 - auraSize/2,
                top: note.y + 160 - auraSize/2,
                background: `radial-gradient(circle, rgba(0,0,0,${auraOpacity}) 0%, rgba(0,0,0,0) 65%)`,
                zIndex: -1,
                mixBlendMode: 'multiply'
              }}
            />
          );
        })}

        {/* Canvas Level Drawing */}
        <svg className="absolute inset-0 pointer-events-none overflow-visible">
          {/* Spatial Memory Geography & Thought Echoes Paths - Phase 6 */}
          {Object.entries(
             notes.reduce((acc: Record<string, Note[]>, note: Note) => {
               if (note.x !== undefined && note.y !== undefined && !note.isDeleted) {
                 if (!acc[note.folderId]) acc[note.folderId] = [];
                 acc[note.folderId].push(note);
               }
               return acc;
             }, {})
          ).map(([folderId, folderNotes]) => {
             const sorted = (folderNotes as Note[]).sort((a,b) => a.updatedAt - b.updatedAt);
             if (sorted.length < 2) return null;
             const pathD = sorted.reduce((d, n, i) => {
               const nx = (n.x||0) + (n.width||280)/2;
               const ny = (n.y||0) + 160;
               if (i === 0) return `M ${nx},${ny}`;
               const prev = sorted[i-1];
               const px = (prev.x||0) + (prev.width||280)/2;
               const py = (prev.y||0) + 160;
               return `${d} C ${px + (nx-px)/2},${py} ${nx - (nx-px)/2},${ny} ${nx},${ny}`;
             }, "");
             
             return (
               <path 
                 key={`pathway-${folderId}`}
                 d={pathD}
                 fill="none"
                 stroke="url(#pathGradient)"
                 strokeWidth="2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 className="transition-all duration-[2000ms] opacity-20"
               />
             );
          })}
          
          <defs>
            <linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#000" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {canvasStrokes.map(stroke => (
            <path 
              key={stroke.id}
              d={`M ${stroke.points[0].x} ${stroke.points[0].y} ` + stroke.points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}
              fill="none"
              stroke={stroke.color}
              strokeWidth={stroke.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentStroke.length > 0 && (
            <path 
              d={`M ${currentStroke[0].x} ${currentStroke[0].y} ` + currentStroke.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}
              fill="none"
              stroke="#000000"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        {/* Spatial Objects - Virtualized for performance */}
        {visibleNotes.map((note: Note) => (
          <CanvasObject 
            key={note.id} 
            note={note} 
            isSelected={selectedNoteId === note.id}
            isDeepFocus={isDeepFocus}
            onClick={() => setSelectedNoteId(note.id)}
            onDrag={(dx: number, dy: number) => updateNote(note.id, { x: (note.x || 0) + dx, y: (note.y || 0) + dy })}
            onDelete={() => deleteNote(note.id)}
            onExpandSpread={(direction: 'bottom'|'right'|'left'|'top') => addSpreadNode(note, direction)}
            zoom={viewport.zoom}
            isSnappingEnabled={isSnappingEnabled}
          />
        ))}
      </motion.div>

      {/* Interface Overlays - Spatial Navigation HUD */}
      <div className="absolute top-8 right-8 flex flex-col gap-2 z-20">
        <div className="bg-white border border-black/10 shadow-2xl p-1 flex items-center gap-1">
           <button 
             onClick={() => setIsDrawingMode(!isDrawingMode)}
             className={`p-2 transition-colors ${isDrawingMode ? 'bg-black text-white' : 'text-black/40 hover:bg-black/5'}`}
             title="Sketch Mode"
           >
             <Pencil className="w-4 h-4" />
           </button>
           <button 
             onClick={() => {
               const name = prompt('Bookmark Name:');
               if (name) addBookmark({ id: crypto.randomUUID(), name, ...viewport });
             }}
             className="p-2 text-black/40 hover:bg-black/5 transition-colors"
             title="Save Anchor"
           >
             <Anchor className="w-4 h-4" />
           </button>
           <button 
             onClick={captureScreenshot}
             className="p-2 text-black/40 hover:bg-black/5 transition-colors"
             title="Capture Workspace"
           >
             <Camera className="w-4 h-4" />
           </button>
        </div>
        
        {bookmarks.length > 0 && (
          <div className="bg-white border border-black/10 shadow-2xl p-2 flex flex-col gap-1 max-h-64 overflow-y-auto w-40">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1 px-1">Anchors</span>
            {bookmarks.map((bm: SpatialBookmark) => (
              <button 
                key={bm.id} 
                onClick={() => jumpToBookmark(bm)}
                className="text-left px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-colors truncate text-black/60 hover:text-black"
              >
                {bm.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-8 flex items-center gap-4">
         <div className="flex bg-white shadow-xl border border-black/10 rounded-none p-1">
            <button 
              onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })}
              className="p-3 hover:bg-black/5 transition-colors text-black"
              title="Reset Viewport"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <div className="w-[1px] h-6 bg-black/10 self-center mx-1" />
            <div className="flex items-center px-4 text-[10px] font-black uppercase tracking-[0.2em] text-black">
              {Math.round(viewport.zoom * 100)}%
            </div>
         </div>
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col gap-2">
        <div className="bg-white px-5 py-3 border border-black/10 shadow-xl flex items-center gap-6 text-[9px] font-black text-black uppercase tracking-[0.2em]">
          <span className="opacity-40">CMD + SCROLL TO SCALE</span>
          <div className="w-[1px] h-3 bg-black/10" />
          <span className="opacity-40">ALT + DRAG TO NAVIGATE</span>
          {isSnappingEnabled && (
            <>
              <div className="w-[1px] h-3 bg-black/10" />
              <span className="text-black">SNAPPING_ACTIVE</span>
            </>
          )}
        </div>
      </div>

      {isDrawingMode && (
        <div 
          className="absolute pointer-events-none w-3 h-3 border-2 border-black"
          style={{ 
            left: lastMousePos.current.x - 6,
            top: lastMousePos.current.y - 6,
            borderRadius: '1px'
          }}
        />
      )}
    </div>
  );
});

const CanvasObject = React.memo(({ note, isSelected, isDeepFocus, onClick, onDrag, onDelete, onExpandSpread, zoom, isSnappingEnabled }: any) => {
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.button === 0 && !e.altKey) {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      onClick();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        setIsDraggingState(true);
        const GRID_SIZE = 100; // Phase 242: Lane Snapping
        
        // Emotional Gravity Dynamic Drag Friction (Reinvention Phase 4)
        const densityScore = getMemoryDensity(note);
        const densityFriction = Math.max(0.35, 1 / (1 + Math.pow(densityScore, 0.45) * 0.12));

        let dx = ((e.clientX - dragStart.current.x) / zoom) * densityFriction;
        let dy = ((e.clientY - dragStart.current.y) / zoom) * densityFriction;

        if (isSnappingEnabled) {
          const rawNextX = (note.x || 0) + dx;
          const rawNextY = (note.y || 0) + dy;
          const snappedX = Math.round(rawNextX / GRID_SIZE) * GRID_SIZE;
          const snappedY = Math.round(rawNextY / (GRID_SIZE / 5)) * (GRID_SIZE / 5); // Finer vertical snap
          
          dx = snappedX - (note.x || 0);
          dy = snappedY - (note.y || 0);
        }

        if (dx !== 0 || dy !== 0) {
          onDrag(dx, dy);
          dragStart.current = { x: e.clientX, y: e.clientY };
        }
      }
    };
    const handleMouseUp = () => { 
      isDragging.current = false; 
      setIsDraggingState(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [zoom, onDrag, isSnappingEnabled, note.x, note.y, note.visitCount, note.editCount, note.marks, note.revisions]);

  const x = note.x || 0;
  const y = note.y || 0;
  const w = note.width || 280;
  const h = note.height || (note.type === 'image' ? 'auto' : 320);

  const isFar = zoom < 0.4;

  const visitCount = note.visitCount || 0;
  const hoursAgo = (Date.now() - note.updatedAt) / (1000 * 60 * 60);
  const ageFactor = Math.min(1, (visitCount / 20) + (hoursAgo / 336));
  
  const r = Math.round(255 - ageFactor * 6);
  const g = Math.round(255 - ageFactor * 10);
  const b = Math.round(255 - ageFactor * 20);
  const warmColor = `rgb(${r}, ${g}, ${b})`;

  // Stacking sheets calculated organically (Memory Gravity Deck)
  const density = getMemoryDensity(note);
  const extraSheets = density > 20 ? 3 : density > 10 ? 2 : density > 4 ? 1 : 0;

  return (
    <div 
      className={`absolute left-0 top-0 cursor-grab ${isSelected ? 'z-50' : 'z-10'} ${isDraggingState ? 'cursor-grabbing' : ''} transition-all duration-500 ease-out`}
      style={{ 
        transform: `translate(${x}px, ${y}px) ${isDraggingState ? 'scale(1.01)' : 'scale(1)'}`, 
        boxShadow: isDraggingState ? '0 15px 30px rgba(0,0,0,0.15)' : 'none',
        willChange: 'transform' 
      } as any}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={density > 3 ? `Memory Density: ${density} (Heavy Gravity / Custom Drag Friction)` : undefined}
    >
      <AnimatePresence>
        {(isSelected || isHovered) && !isDraggingState && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 -bottom-8 flex items-center justify-center pointer-events-auto"
          >
            <button
              onClick={(e) => { e.stopPropagation(); onExpandSpread('bottom'); }}
              className="p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-black/40 hover:text-black transition-all border border-black/5 backdrop-blur-md"
              title="Expand Spread Below"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
        {(isSelected || isHovered) && !isDraggingState && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-y-0 -right-8 flex items-center justify-center pointer-events-auto"
          >
            <button
              onClick={(e) => { e.stopPropagation(); onExpandSpread('right'); }}
              className="p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-black/40 hover:text-black transition-all border border-black/5 backdrop-blur-md"
              title="Expand Spread Right"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div 
        animate={{ 
          width: w,
          height: h === 'auto' ? 'auto' : h,
          opacity: (isDeepFocus && !isSelected) ? 0.3 : 1
        }}
        className={`flex flex-col group transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
          isDraggingState 
            ? 'rotate-[0.4deg] scale-[1.025] opacity-90' 
            : isSelected 
              ? 'scale-[1.002] opacity-100' 
              : 'opacity-90'
        }`}
        style={{ backgroundColor: 'transparent' }}
      >
        {note.type === 'image' ? (
          <div className="relative group/media my-4 filter drop-shadow-md">
            {note.landmarkColor && (
              <div 
                className="absolute top-3 right-3 w-3 h-3 rounded-full blur-[1px] opacity-75 z-25 transition-all"
                style={{ backgroundColor: note.landmarkColor, mixBlendMode: 'multiply' }}
                title="Familiar Landmark"
              />
            )}
            <img 
              src={note.mediaUrl} 
              alt={note.title} 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover/media:scale-[1.02] rounded-md" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity">
               <h3 className="text-white text-[9px] font-black uppercase tracking-widest truncate">{note.title}</h3>
            </div>
          </div>
        ) : (
          <div 
            className="p-8 flex flex-col h-full relative overflow-visible"
            style={{ backgroundColor: 'transparent' }}
          >
            {note.landmarkColor && (
              <div 
                className="absolute top-8 -right-4 w-3.5 h-3.5 rounded-full blur-[1px] opacity-75 transition-all"
                style={{ backgroundColor: note.landmarkColor, mixBlendMode: 'multiply' }}
                title="Familiar Landmark"
              />
            )}
            
            {!isFar && (
              <div className="flex-1 overflow-visible">
                <h3 className="font-bold text-xs tracking-tight text-black/40 group-hover:text-black/80 transition-colors uppercase truncate mb-4">{note.title || 'Untitled Note'}</h3>
                <p className={`text-[15px] leading-[2.2rem] text-black/90 ${note.historicalContext === 'engineering' ? 'font-mono' : 'font-serif'}`}>
                   {note.content || '...'}
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
              <span className="text-[9px] font-bold text-black/40 uppercase tracking-[0.15em]">{note.epoch || 'Studio'}</span>
              <div className="flex items-center gap-1.5">
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="p-1 hover:bg-black/5 hover:text-red-500 rounded transition-colors cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                  </button>
                )}
                {note.visitCount > 10 && <div className="w-1.5 h-1.5 rounded-full bg-black/10" />}
                {note.isPinned && <Star className="w-2.5 h-2.5 fill-black/10 stroke-none" />}
              </div>
            </div>
          </div>
        )}
        
        {/* Selection Bracket - Phase 184 */}
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -inset-1 border border-black/20 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('folders');
    return saved ? JSON.parse(saved) : [
      { id: 'all', name: 'All Notes', icon: 'FolderIcon' },
      { id: 'pinned', name: 'Pinned', icon: 'Star' },
      { id: 'archive', name: 'Archive', icon: 'Archive' }
    ];
  });

  const [selectedFolderId, setSelectedFolderId] = useState(() => {
    return localStorage.getItem('lastFolderId') || 'all';
  });

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(() => {
    return localStorage.getItem('lastNoteId');
  });

  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>(() => {
    const saved = localStorage.getItem('workspaceMode');
    return (saved as WorkspaceMode) || 'standard';
  });

  const { 
    pressure, 
    trackSwitch, 
    activeContext, 
    isDeepFocus, 
    contextStatus,
    currentEpoch,
    setActiveContext
  } = useWorkspaceEngine(selectedNoteId, notes, workspaceMode);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isSpatialMode, setIsSpatialMode] = useState(() => {
    return localStorage.getItem('isSpatialMode') === 'true';
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGridEnabled, setIsGridEnabled] = useState(() => {
    const saved = localStorage.getItem('isGridEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [isSnappingEnabled, setIsSnappingEnabled] = useState(() => {
    return localStorage.getItem('isSnappingEnabled') === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [untouchedDormancy, setUntouchedDormancy] = useState<string | null>(null);

  useEffect(() => {
    const lastActive = localStorage.getItem('ambient_last_active_time');
    const now = Date.now();
    if (lastActive) {
      const diffMs = now - Number(lastActive);
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins >= 10) { // untouched for 10 or more minutes
        if (diffMins < 60) {
          setUntouchedDormancy(`${diffMins} minutes`);
        } else {
          const diffHours = Math.floor(diffMins / 60);
          if (diffHours < 24) {
            setUntouchedDormancy(`${diffHours} hour${diffHours > 1 ? 's' : ''}`);
          } else {
            const diffDays = Math.floor(diffHours / 24);
            setUntouchedDormancy(`${diffDays} day${diffDays > 1 ? 's' : ''}`);
          }
        }
      }
    }
    
    // Periodically update active time
    const interval = setInterval(() => {
      localStorage.setItem('ambient_last_active_time', String(Date.now()));
    }, 12000); // 12 seconds
    localStorage.setItem('ambient_last_active_time', String(Date.now()));
    
    return () => clearInterval(interval);
  }, []);

  const [activeStampTool, setActiveStampTool] = useState<'fingerprint' | 'scribble' | 'star-highlight' | null>(null);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [devicePosture, setDevicePosture] = useState<'portrait' | 'landscape'>('landscape');
  const [timeContext, setTimeContext] = useState<'dawn' | 'daylight' | 'dusk' | 'night'>(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 8) return 'dawn';
    if (h >= 8 && h < 18) return 'daylight';
    if (h >= 18 && h < 21) return 'dusk';
    return 'night';
  });


  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      const isPort = window.innerWidth < 768;
      setDevicePosture(isPort ? 'portrait' : 'landscape');
      if (isPort) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isTyping, setIsTyping] = useState(false);
  const [isRevisionsOpen, setIsRevisionsOpen] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsRevisionsOpen(false);
    setIsTyping(false);
  }, [selectedNoteId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(400, textareaRef.current.scrollHeight)}px`;
    }
  }, [selectedNoteId, notes]);

  // Maintain edit revisions history
  useEffect(() => {
    if (!isTyping && selectedNoteId) {
      const active = notes.find(n => n.id === selectedNoteId);
      if (active && active.content) {
        const currentContent = active.content;
        const currentRevs = active.revisions || [];
        const lastRev = currentRevs[currentRevs.length - 1];
        if (currentContent !== lastRev && currentContent.length > 5) {
          const nextRevs = [...currentRevs, currentContent].slice(-5);
          setNotes(prev => prev.map(n => n.id === selectedNoteId ? { ...n, revisions: nextRevs } : n));
        }
      }
    }
  }, [isTyping, selectedNoteId]);

  // Phase 212 & 216 & 213: Daily Driver State
  const [snapshots, setSnapshots] = useState<WorkspaceSnapshot[]>(() => {
    const saved = localStorage.getItem('snapshots');
    return saved ? JSON.parse(saved) : [];
  });
  const [bookmarks, setBookmarks] = useState<SpatialBookmark[]>(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeBookmark, setActiveBookmark] = useState<SpatialBookmark | null>(null);
  const [isCommanderOpen, setIsCommanderOpen] = useState(false);
  const [commanderQuery, setCommanderQuery] = useState('');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [layerDraft, setLayerDraft] = useState<{type: 'fold' | 'beneath' | 'margin', content: string} | null>(null);

  // Phase 233: Robust Workspace Recovery (Undo/Redo)
  const [history, setHistory] = useState<Note[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveHistory = (newNotes: Note[]) => {
    setHistory(prev => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, newNotes].slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => prev + 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setNotes(history[historyIndex - 1]);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setNotes(history[historyIndex + 1]);
      setHistoryIndex(historyIndex + 1);
    }
  };

  useEffect(() => {
    if (history.length === 0 && notes.length > 0) {
      setHistory([notes]);
      setHistoryIndex(0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('snapshots', JSON.stringify(snapshots));
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [snapshots, bookmarks]);

  // Phase 216: Workspace Snapshot Engine
  const createSnapshot = (name?: string) => {
    const snapshotName = name || `Snapshot_${new Date().toLocaleTimeString()}`;
    const id = crypto.randomUUID();
    const data = { notes, folders };
    localStorage.setItem(`snapshot_data_${id}`, JSON.stringify(data));
    setSnapshots(prev => [{ id, timestamp: Date.now(), name: snapshotName, noteCount: notes.length }, ...prev].slice(0, 50));
  };

  const restoreSnapshot = (id: string) => {
    const raw = localStorage.getItem(`snapshot_data_${id}`);
    if (!raw) return;
    const { notes: sNotes, folders: sFolders } = JSON.parse(raw);
    setNotes(sNotes);
    setFolders(sFolders);
  };

  // Handle Shared Note Link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedNoteId = params.get('noteId');
    if (sharedNoteId && sharedNoteId !== selectedNoteId) {
      setSelectedNoteId(sharedNoteId);
      // If the note doesn't exist locally
      if (!notes.find(n => n.id === sharedNoteId)) {
        const placeholder: Note = {
          id: sharedNoteId,
          title: 'Shared Note...',
          content: 'Loading shared content...',
          folderId: 'notes',
          updatedAt: Date.now(),
          isPinned: false
        };
        setNotes(prev => [...prev, placeholder]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    if (selectedNoteId) {
      localStorage.setItem('lastNoteId', selectedNoteId);
    } else {
      localStorage.removeItem('lastNoteId');
    }
  }, [selectedNoteId]);

  useEffect(() => {
    localStorage.setItem('lastFolderId', selectedFolderId);
  }, [selectedFolderId]);

  useEffect(() => {
    localStorage.setItem('isSpatialMode', String(isSpatialMode));
  }, [isSpatialMode]);

  useEffect(() => {
    localStorage.setItem('isGridEnabled', String(isGridEnabled));
  }, [isGridEnabled]);

  useEffect(() => {
    localStorage.setItem('isSnappingEnabled', String(isSnappingEnabled));
  }, [isSnappingEnabled]);

  useEffect(() => {
    localStorage.setItem('workspaceMode', workspaceMode);
  }, [workspaceMode]);

  const filteredNotes = useMemo(() => {
    let result = notes;
    
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.title.toLowerCase().includes(q) || 
        n.content.toLowerCase().includes(q)
      );
    }

    // Folder filter
    if (selectedFolderId === 'pinned') {
      result = result.filter(n => n.isPinned && !n.isDeleted);
    } else if (selectedFolderId === 'archive') {
      result = result.filter(n => n.folderId === 'archive' && !n.isDeleted);
    } else if (selectedFolderId === 'deleted') {
      result = result.filter(n => n.isDeleted);
    } else if (selectedFolderId !== 'all') {
      result = result.filter(n => n.folderId === selectedFolderId && !n.isDeleted);
    } else {
      // For 'all', show everything not archived and not deleted
      result = result.filter(n => n.folderId !== 'archive' && !n.isDeleted);
    }

    // Sort: Pinned first, then by date. 
    // This is handled by split pinnedNotes/otherNotes in render, 
    // but we still sort here for general lists.
    return result.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchQuery, selectedFolderId]);

  const pinnedNotes = useMemo(() => filteredNotes.filter(n => n.isPinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter(n => !n.isPinned), [filteredNotes]);

  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: '',
      folderId: selectedFolderId === 'all' || selectedFolderId === 'pinned' ? 'notes' : selectedFolderId,
      updatedAt: Date.now(),
      isPinned: selectedFolderId === 'pinned',
      x: isSpatialMode ? Math.random() * 500 : 0,
      y: isSpatialMode ? Math.random() * 500 : 0,
      type: 'text'
    };
    const nextNotes = [newNote, ...notes];
    setNotes(nextNotes);
    saveHistory(nextNotes);
    setSelectedNoteId(newNote.id);
  };

  const addSpreadNode = (sourceNote: Note, direction: 'bottom' | 'right' | 'left' | 'top') => {
    const w = sourceNote.width || 280;
    const h = Number(sourceNote.height) || 320;
    const sx = sourceNote.x || 0;
    const sy = sourceNote.y || 0;

    let nx = sx;
    let ny = sy;
    if (direction === 'bottom') ny += Number(h) + 60;
    if (direction === 'top') ny -= 380;
    if (direction === 'right') nx += Number(w) + 60;
    if (direction === 'left') nx -= 340;

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Spread Reflection',
      content: '',
      folderId: sourceNote.folderId,
      updatedAt: Date.now(),
      isPinned: false,
      visitCount: 1,
      x: nx,
      y: ny,
      type: 'text'
    };
    const nextNotes = [newNote, ...notes];
    setNotes(nextNotes);
    saveHistory(nextNotes);
    setSelectedNoteId(newNote.id);
  };

  const addImage = () => {
    const url = prompt('Image URL:');
    if (!url) return;
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Visual Thought',
      content: '',
      folderId: 'notes',
      updatedAt: Date.now(),
      isPinned: false,
      type: 'image',
      mediaUrl: url,
      x: 100,
      y: 100
    };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updatedNote = notes.find(n => n.id === id);
    if (!updatedNote) return;
    
    let nextRevisions = updatedNote.revisions || [];
    if (updates.content !== undefined && updates.content !== updatedNote.content && updatedNote.content.trim()) {
      const lastRev = nextRevisions[nextRevisions.length - 1];
      if (!lastRev || (lastRev !== updatedNote.content && Math.abs(updates.content.length - lastRev.length) > 40)) {
        nextRevisions = [...nextRevisions, updatedNote.content].slice(-8);
      }
    }
    
    const newNote = { 
      ...updatedNote, 
      ...updates, 
      revisions: nextRevisions,
      editCount: (updatedNote.editCount || 0) + (updates.content !== undefined ? 1 : 0),
      updatedAt: Date.now() 
    };
    
    // Phase 196: Update epoch and context on updates
    if (!newNote.epoch) newNote.epoch = currentEpoch;
    if (!newNote.historicalContext) newNote.historicalContext = activeContext;

    const nextNotes = notes.map(note => note.id === id ? newNote : note);
    setNotes(nextNotes);
  };

  // Phase 144: Log Note Visits
  useEffect(() => {
    if (selectedNoteId) {
      setNotes(prev => prev.map(n => 
        n.id === selectedNoteId 
          ? { ...n, visitCount: (n.visitCount || 0) + 1 } 
          : n
      ));
    }
  }, [selectedNoteId]);

  const deleteNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    if (note.isDeleted) {
      // Permanent delete
      setNotes(notes.filter(n => n.id !== id));
      if (selectedNoteId === id) setSelectedNoteId(null);
    } else {
      // Move to recently deleted
      setNotes(notes.map(n => n.id === id ? { ...n, isDeleted: true, deletedAt: Date.now() } : n));
      if (selectedNoteId === id) setSelectedNoteId(null);
    }
  };

  const recoverNote = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isDeleted: false, deletedAt: undefined } : n));
  };

  const applyTemplate = (type: 'research' | 'sprint' | 'brainstorm') => {
    const timestamp = Date.now();
    let templateNotes: Note[] = [];
    
    if (type === 'research') {
      templateNotes = [
        { id: crypto.randomUUID(), title: 'Research Goal', content: '', folderId: 'notes', updatedAt: timestamp, x: 0, y: 0, type: 'text', isPinned: false },
        { id: crypto.randomUUID(), title: 'Key Findings', content: '', folderId: 'notes', updatedAt: timestamp, x: 300, y: 0, type: 'text', isPinned: false },
        { id: crypto.randomUUID(), title: 'Media references', content: '', folderId: 'notes', updatedAt: timestamp, x: 0, y: 350, type: 'text', isPinned: false }
      ];
    } else if (type === 'sprint') {
      templateNotes = [
        { id: crypto.randomUUID(), title: 'Priority 1', content: '', folderId: 'notes', updatedAt: timestamp, x: 0, y: 0, type: 'text', isPinned: false },
        { id: crypto.randomUUID(), title: 'In Progress', content: '', folderId: 'notes', updatedAt: timestamp, x: 300, y: 0, type: 'text', isPinned: false },
        { id: crypto.randomUUID(), title: 'Blocked', content: '', folderId: 'notes', updatedAt: timestamp, x: 600, y: 0, type: 'text', isPinned: false }
      ];
    }
    
    const nextNotes = [...templateNotes, ...notes];
    setNotes(nextNotes);
    saveHistory(nextNotes);
    setIsCommanderOpen(false);
  };

  const duplicateNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      title: `${note.title} (Copy)`,
      updatedAt: Date.now(),
      x: (note.x || 0) + 40,
      y: (note.y || 0) + 40
    };
    const nextNotes = [newNote, ...notes];
    setNotes(nextNotes);
    saveHistory(nextNotes);
    setSelectedNoteId(newNote.id);
  };

  const addFolder = () => {
    const name = prompt('Folder name:');
    if (name) {
      setFolders([...folders, { id: crypto.randomUUID(), name, icon: 'FolderIcon' }]);
    }
  };

  const deleteFolder = (id: string) => {
    if (id === 'all' || id === 'pinned' || id === 'archive') return;
    if (confirm(`Delete folder "${folders.find(f => f.id === id)?.name}"? Notes will still be in "All Notes".`)) {
      setFolders(folders.filter(f => f.id !== id));
      setNotes(notes.map(n => n.folderId === id ? { ...n, folderId: 'notes' } : n));
      if (selectedFolderId === id) setSelectedFolderId('all');
    }
  };

  const emptyTrash = () => {
    if (confirm('Permanently delete all notes in Recently Deleted?')) {
      setNotes(notes.filter(n => !n.isDeleted));
      if (selectedNote?.isDeleted) setSelectedNoteId(null);
    }
  };

  // Phase 221: Professional Export & Interoperability
  const exportWorkspace = () => {
    const data = {
      version: '1.0',
      timestamp: Date.now(),
      notes,
      folders,
      bookmarks
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workspace_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsMarkdown = () => {
    const content = notes
      .filter(n => !n.isDeleted)
      .map(n => `# ${n.title}\n\n${n.content}\n\n---\n`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workspace_notes_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const captureScreenshot = async () => {
    const root = document.getElementById('root');
    if (!root) return;
    
    try {
      const canvas = await html2canvas(root, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const mediaUrl = canvas.toDataURL('image/png');
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: `Screenshot ${new Date().toLocaleTimeString()}`,
        content: '',
        folderId: 'notes',
        updatedAt: Date.now(),
        isPinned: false,
        type: 'text',
        mediaUrl
      };
      
      const nextNotes = [newNote, ...notes];
      setNotes(nextNotes);
      saveHistory?.(nextNotes);
      setSelectedNoteId(newNote.id);
      setIsDrawingMode(true); 
      setIsSpatialMode(false);
    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  };

  const formatSelection = (type: 'underline' | 'strikethrough' | 'divider') => {
    const textarea = document.querySelector('textarea');
    if (!textarea || !selectedNote) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = selectedNote.content;
    let newText = '';

    if (type === 'divider') {
      newText = text.substring(0, start) + '\n\n---\n\n' + text.substring(start);
    } else {
      const tag = type === 'underline' ? ['<u>', '</u>'] : ['~~', '~~'];
      const selection = text.substring(start, end);
      
      // Toggle logic (simplified)
      if (selection.startsWith(tag[0]) && selection.endsWith(tag[1])) {
        newText = text.substring(0, start) + selection.substring(tag[0].length, selection.length - tag[1].length) + text.substring(end);
      } else {
        newText = text.substring(0, start) + tag[0] + selection + tag[1] + text.substring(end);
      }
    }

    updateNote(selectedNote.id, { content: newText });
    setIsPreviewMode(true);
  };

  const moveCheckedToBottom = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    const lines = note.content.split('\n');
    const checked = lines.filter(l => l.startsWith('● '));
    const unchecked = lines.filter(l => !l.startsWith('● '));
    const newContent = [...unchecked, ...checked].join('\n');
    updateNote(id, { content: newContent });
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(note => note.id === id ? { ...note, isPinned: !note.isPinned } : note));
  };

  const saveDrawing = (dataUrl: string, strokes?: Stroke[]) => {
    if (selectedNoteId) {
      updateNote(selectedNoteId, { 
        drawing: dataUrl,
        drawingData: strokes 
      });
    }
  };

  const selectedNote = notes.find(n => n.id === selectedNoteId);
  const searchRef = useRef<HTMLInputElement>(null);

  const findNoteById = (id: string) => notes.find(n => n.id === id);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Phase 226 & 236: Command Infrastructure & Focus Hotkeys
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        addNote();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedNoteId) duplicateNote(selectedNoteId);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommanderOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setIsPresentationMode(prev => !prev);
      }

      // Phase 227: Spatial Shortcuts (Muscle Memory 1-9)
      if (!isCommanderOpen && !e.metaKey && !e.ctrlKey && e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (bookmarks[index]) {
          setActiveBookmark(bookmarks[index]);
          setTimeout(() => setActiveBookmark(null), 100);
        }
      }

      if (e.key === 'Escape') {
        setIsCommanderOpen(false);
        setCommanderQuery('');
        setIsPresentationMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notes, bookmarks, isCommanderOpen, historyIndex, history]);

  const transitionDuration = pressure === 'high' ? 0.3 : 1; // Phase 84: Semantic Motion Language

  // Temporal Color Memory (Phase 71)
  const isLateNight = new Date().getHours() >= 23 || new Date().getHours() <= 4;
  
  return (
    <div 
      className={`flex h-screen w-full workspace-neutral overflow-hidden select-none relative ${isLateNight ? 'brightness-95' : ''}`}
      data-context={activeContext}
      data-pressure={pressure}
      style={{ transition: `all ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)` } as any}
    >
      <WorkspaceLayer activeContext={activeContext} pressure={pressure} />
      
      {/* Phase 236: Presentation Overlays */}
      {isPresentationMode && (
        <div className="absolute top-8 left-8 z-[150]">
          <button 
            onClick={() => setIsPresentationMode(false)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-black/80 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Exit Presentation Focus
          </button>
        </div>
      )}

      {/* Phase 212 & 226: Professional Command Infrastructure */}
      <AnimatePresence>
        {isCommanderOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute inset-0 z-[200] flex items-start justify-center pt-32 bg-white/40 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && setIsCommanderOpen(false)}
          >
            <div className="w-full max-w-2xl bg-white shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-black/10 flex flex-col overflow-hidden">
              <div className="px-6 py-5 flex items-center gap-4 border-b border-black/5">
                <Search className="w-5 h-5 text-black/20" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Type a command (/note, /image, /export, /undo) or capture node..."
                  value={commanderQuery}
                  onChange={(e) => setCommanderQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const cmd = commanderQuery.trim().toLowerCase();
                      
                      if (cmd === '/note') addNote();
                      else if (cmd === '/image') addImage();
                      else if (cmd === '/export') exportWorkspace();
                      else if (cmd === '/undo') undo();
                      else if (cmd === '/redo') redo();
                      else if (cmd === '/duplicate') { if (selectedNoteId) duplicateNote(selectedNoteId); }
                      else if (cmd === '/presentation') setIsPresentationMode(true);
                      else if (cmd === '/template-research') applyTemplate('research');
                      else if (cmd === '/template-sprint') applyTemplate('sprint');
                      else if (cmd.startsWith('/jump ')) {
                        const name = cmd.replace('/jump ', '');
                        const target = bookmarks.find(b => b.name.toLowerCase().includes(name));
                        if (target) {
                          setActiveBookmark(target);
                          setTimeout(() => setActiveBookmark(null), 100);
                        }
                      } else if (commanderQuery.trim()) {
                        const newNote: Note = {
                          id: crypto.randomUUID(),
                          title: commanderQuery,
                          content: '',
                          folderId: 'notes',
                          updatedAt: Date.now(),
                          isPinned: false,
                          type: 'text'
                        };
                        const nextNotes = [newNote, ...notes];
                        setNotes(nextNotes);
                        saveHistory(nextNotes);
                        setSelectedNoteId(newNote.id);
                      }
                      
                      setIsCommanderOpen(false);
                      setCommanderQuery('');
                    }
                  }}
                  className="flex-1 bg-transparent border-none text-xl font-bold tracking-tight text-black focus:ring-0 placeholder-black/10"
                />
                <div className="text-[10px] font-black uppercase tracking-widest opacity-20">Commander_v2</div>
              </div>
              <div className="p-4 bg-black/[0.02] flex flex-col gap-2">
                <div className="flex items-center justify-between opacity-30 text-[10px] font-black uppercase tracking-widest">
                  <span>Recent Actions</span>
                  <span className="font-mono">ESC_TO_CANCEL</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['/note', '/image', '/export', '/presentation'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setCommanderQuery(c)}
                      className="text-left px-3 py-2 bg-white border border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/50 hover:text-black hover:border-black/20 transition-all"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sidebar - Folders */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && pressure !== 'high' && !isPresentationMode && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: isTyping ? 0 : 1 }}
            exit={{ width: 0, opacity: 0 }}
            className={`flex-shrink-0 bg-transparent border-r border-black/5 flex flex-col z-10 transition-opacity duration-1000 ${isTyping ? 'pointer-events-none' : ''}`}
          >
            <Sidebar 
              folders={folders} 
              selectedFolderId={selectedFolderId} 
              setSelectedFolderId={setSelectedFolderId} 
              deleteFolder={deleteFolder} 
              addFolder={addFolder} 
              notes={notes} 
              trackSwitch={trackSwitch}
              currentEpoch={currentEpoch}
              snapshots={snapshots}
              createSnapshot={createSnapshot}
              restoreSnapshot={restoreSnapshot}
              exportWorkspace={exportWorkspace}
              exportAsMarkdown={exportAsMarkdown}
              captureScreenshot={captureScreenshot}
              untouchedDormancy={untouchedDormancy}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {!isPresentationMode && (
        <NoteListPanel 
          isTyping={isTyping}
          pressure={pressure}
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          addNote={addNote}
          deleteNote={deleteNote}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFolderId={selectedFolderId}
          emptyTrash={emptyTrash}
          notes={notes}
          pinnedNotes={pinnedNotes}
          otherNotes={otherNotes}
          selectedNoteId={selectedNoteId}
          setSelectedNoteId={setSelectedNoteId}
          trackSwitch={trackSwitch}
          workspaceMode={workspaceMode}
          setWorkspaceMode={setWorkspaceMode}
          isSpatialMode={isSpatialMode}
          setIsSpatialMode={setIsSpatialMode}
          isGridEnabled={isGridEnabled}
          setIsGridEnabled={setIsGridEnabled}
          isSnappingEnabled={isSnappingEnabled}
          setIsSnappingEnabled={setIsSnappingEnabled}
        />
      )}

      {/* Professional Workspace Studio Layout */}
      <main className="flex-1 relative flex overflow-hidden">
        {selectedNote && !isSpatialMode && (() => {
          const sNoteVisitCount = selectedNote.visitCount || 0;
          const sNoteHoursAgo = (Date.now() - selectedNote.updatedAt) / (1000 * 60 * 60);
          const sAgeFactor = Math.min(1, (sNoteVisitCount / 20) + (sNoteHoursAgo / 336));
          
          const s_r = Math.round(255 - sAgeFactor * 6);
          const s_g = Math.round(255 - sAgeFactor * 10);
          const s_b = Math.round(255 - sAgeFactor * 20);
          const sWarmColor = `rgb(${s_r}, ${s_g}, ${s_b})`;

          const sDensity = getMemoryDensity(selectedNote);

          const contentWordCount = selectedNote.content.split(/\s+/).filter(Boolean).length || 0;
          const dynamicLineClass = contentWordCount > 300 
            ? 'leading-[2.4rem] tracking-wide text-[16px]' 
            : contentWordCount > 100 
              ? 'leading-[2.2rem] text-[15px]' 
              : 'leading-[2rem] text-base';
          const dynamicPaddingClass = 'py-3 md:py-4';

          const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            updateNote(selectedNote.id, { content: e.target.value });
            setIsTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              setIsTyping(false);
            }, 2500);
          };

          const handleStampClick = (e: React.MouseEvent<HTMLDivElement>) => {
            if (activeStampTool) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.round(e.clientX - rect.left);
              const y = Math.round(e.clientY - rect.top);
              
              const newMark = {
                id: crypto.randomUUID(),
                x,
                y,
                type: activeStampTool
              };
              
              const nextMarks = [...(selectedNote.marks || []), newMark];
              updateNote(selectedNote.id, { marks: nextMarks });
              setActiveStampTool(null);
            }
          };

          const handlePaperDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!activeStampTool) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.round(e.clientX - rect.left);
              const y = Math.round(e.clientY - rect.top);
              
              const choices: ('fingerprint' | 'scribble' | 'star-highlight')[] = ['fingerprint', 'scribble', 'star-highlight'];
              const type = choices[Math.floor(Math.random() * choices.length)];
              
              const newMark = {
                id: crypto.randomUUID(),
                x,
                y,
                type
              };
              const nextMarks = [...(selectedNote.marks || []), newMark];
              updateNote(selectedNote.id, { marks: nextMarks });
            }
          };

          return (
            <div 
              key={selectedNoteId}
              className="flex-1 h-full relative flex flex-col transition-colors duration-1000"
              style={{ backgroundColor: sWarmColor }}
            >
              <AnimatePresence mode="wait">
                <motion.header 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: isTyping ? 0 : 1 }}
                  key={selectedNoteId}
                  className={`h-16 border-b border-black/[0.04] flex items-center justify-between px-12 shrink-0 z-10 transition-opacity duration-1000 ${isTyping ? 'pointer-events-none' : ''}`}
                  style={{ backgroundColor: sWarmColor }}
                >
                  <div className="flex items-center gap-6">
                    <input 
                      type="text" 
                      value={selectedNote.title}
                      onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                      placeholder="Title"
                      className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] text-black/80 focus:ring-0 w-64"
                    />
                    <div className="w-[1px] h-4 bg-black/10" />
                    <div className="flex items-center gap-1.5" title="Landmark Dyes">
                      {[
                        { color: '', label: 'None' },
                        { color: '#ded7c3', label: 'Warm Ochre' },
                        { color: '#c5d0c2', label: 'Sage' },
                        { color: '#c9ccd4', label: 'Slate' }
                      ].map(dy => (
                        <button
                          key={dy.color}
                          onClick={() => updateNote(selectedNote.id, { landmarkColor: dy.color })}
                          className={`w-3 h-3 rounded-full transition-all border ${
                            selectedNote.landmarkColor === dy.color 
                              ? 'border-black/50 scale-125' 
                              : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: dy.color || '#eeeeee' }}
                          title={`Paint page landmark: ${dy.label}`}
                        />
                      ))}
                    </div>
                    <div className="w-[1px] h-4 bg-black/10 mx-2" />
                    <div className="flex items-center gap-1.5" title="Ink Stamps">
                      {[
                        { type: 'fingerprint', label: 'Touch', icon: '●' },
                        { type: 'star-highlight', label: 'Star', icon: '✦' },
                        { type: 'scribble', label: 'Scribble', icon: '⌇' }
                      ].map(st => (
                        <button
                          key={st.type}
                          onClick={() => {
                            setActiveStampTool(activeStampTool === st.type ? null : st.type as any);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider transition-all border ${
                            activeStampTool === st.type 
                              ? 'border-black bg-black/5 text-black font-extrabold' 
                              : 'border-transparent text-black/40 hover:text-black hover:bg-black/[0.02]'
                          }`}
                          title={`Select stamp: ${st.label}`}
                        >
                          {st.icon}
                        </button>
                      ))}
                    </div>
                    <div className="w-[1px] h-4 bg-black/10 mx-2" />
                    <button 
                      onClick={() => setIsDrawingMode(!isDrawingMode)}
                      className={`p-2 transition-colors ${isDrawingMode ? 'text-black bg-black/5' : 'text-black/30 hover:text-black'}`}
                      title="Toggle Sketch Layer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {selectedNote.revisions && selectedNote.revisions.length > 0 && (
                      <button 
                        onClick={() => setIsRevisionsOpen(!isRevisionsOpen)}
                        className={`p-2 transition-colors ${isRevisionsOpen ? 'text-black bg-[#999999]/10' : 'text-black/30 hover:text-black'}`}
                        title="View Revisions / Past Reveries"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNote(selectedNote.id)}
                      className="p-2 text-black/20 hover:text-red-500 transition-colors"
                      title="Archive Node"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.header>
              </AnimatePresence>

              <div className="flex-1 relative overflow-hidden flex flex-col">
                {isDrawingMode && (
                  <DrawingCanvas 
                    initialData={selectedNote.drawing} 
                    initialStrokes={selectedNote.drawingData}
                    mediaUrl={selectedNote.mediaUrl}
                    onSave={saveDrawing} 
                    onExit={() => setIsDrawingMode(false)}
                  />
                )}

                {!isDrawingMode && isPreviewMode && (
                  <div className={`flex-1 overflow-y-auto px-12 sm:px-24 pb-48 ${dynamicPaddingClass} w-full mx-auto scrollbar-hide relative transition-all duration-1000`}>
                    {(selectedNote.drawing || selectedNote.mediaUrl) && (
                      <div className="mb-24 rounded-2xl overflow-hidden border border-black/5 shadow-2xl relative group cursor-pointer transition-all duration-700 hover:shadow-3xl max-w-5xl mx-auto" onClick={() => setIsDrawingMode(true)}>
                        <img src={selectedNote.drawing || selectedNote.mediaUrl} alt="Screenshot" className="w-full object-contain bg-black/[0.02] min-h-[50vh] p-8 sm:p-12" />
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <p className="text-white text-sm font-bold uppercase tracking-[0.2em] text-center">Tap to Edit Cinematic Layer</p>
                        </div>
                      </div>
                    )}
                    <div className="max-w-5xl mx-auto">
                      <ReactMarkdown 
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          p: ({node, ...props}) => <p className="mb-14 text-black/80 leading-[2.2] text-xl sm:text-[22px] font-serif tracking-wide max-w-3xl mx-auto transition-all" {...props} />,
                          blockquote: ({node, ...props}) => (
                            <div className="my-32 sm:my-48 flex justify-center transition-all">
                              <blockquote className="border-l-0 text-center font-serif text-3xl sm:text-4xl italic text-black/90 tracking-wide leading-[1.6] max-w-4xl px-8" {...props} />
                            </div>
                          ),
                          img: ({node, ...props}) => (
                            <div className="my-32 sm:my-48 flex justify-center w-full transition-all">
                              <img className="max-w-full lg:max-w-5xl rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-700 hover:scale-[1.01] border border-black/5 bg-black/[0.02] object-contain" {...props} />
                            </div>
                          ),
                          hr: ({node, ...props}) => (
                            <div className="flex justify-center my-32 sm:my-48 transition-all opacity-40 hover:opacity-100 duration-500">
                              <div className="w-16 h-[2px] bg-black/10 rounded-full" />
                            </div>
                          ),
                          h1: ({node, ...props}) => <h1 className="mt-32 mb-16 text-4xl sm:text-6xl font-black uppercase tracking-[0.2em] text-center text-black/90" {...props} />,
                          h2: ({node, ...props}) => <h2 className="mt-24 mb-16 text-2xl sm:text-3xl font-bold uppercase tracking-[0.15em] text-center text-black/80" {...props} />,
                          h3: ({node, ...props}) => <h3 className="mt-20 mb-12 text-xl sm:text-2xl font-bold uppercase tracking-[0.1em] text-black/40 text-center" {...props} />,
                          ul: ({node, ...props}) => <ul className="mb-16 max-w-3xl mx-auto space-y-6 list-none text-center" {...props} />,
                          ol: ({node, ...props}) => <ol className="mb-16 max-w-3xl mx-auto space-y-6 list-decimal pl-8 text-left" {...props} />,
                          li: ({node, ...props}) => <li className="text-xl sm:text-[22px] font-serif leading-[2.2] text-black/70 tracking-wide" {...props} />,
                          a: ({node, ...props}) => <a className="text-black font-bold uppercase tracking-widest text-[11px] underline decoration-2 decoration-black/20 underline-offset-4 hover:decoration-black transition-colors" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-black border-b border-black/20 pb-0.5" {...props} />,
                          em: ({node, ...props}) => <em className="italic font-serif text-black/90" {...props} />,
                          code: ({node, ...props}) => <code className="font-mono text-sm bg-black/5 px-2 py-1 rounded text-black/70" {...props} />,
                          pre: ({node, ...props}) => <pre className="font-mono text-sm bg-black/[0.03] p-8 rounded-xl overflow-x-auto text-black/80 max-w-4xl mx-auto my-16 shadow-inner border border-black/5" {...props} />,
                        }}
                      >
                        {selectedNote.content || '_The scene is empty..._'}
                      </ReactMarkdown>
                    </div>

                    {/* Phase 10: Depth Layers Rendering */}
                    {selectedNote.depthLayers && selectedNote.depthLayers.length > 0 && (
                      <div className="max-w-5xl mx-auto flex flex-col gap-8 w-full mt-24">
                        {/* Margin Layers */}
                        {selectedNote.depthLayers.filter(l => l.type === 'margin').map((layer, idx) => (
                          <MarginLayer key={layer.id} layer={layer} index={idx} />
                        ))}

                        {/* Folded Layers */}
                        {selectedNote.depthLayers.filter(l => l.type === 'fold').map(layer => (
                          <FoldedLayer key={layer.id} layer={layer} />
                        ))}
                        
                        {/* Beneath Layers (Stratification) */}
                        <div className="flex flex-col gap-16 w-full pt-16">
                          {selectedNote.depthLayers.filter(l => l.type === 'beneath').map((layer, idx) => (
                            <div key={layer.id} className="relative pt-16 border-t border-black/[0.03]">
                               <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-[#fafafa] px-6 py-2 border border-black/[0.03] rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-black/20 shadow-sm">
                                 Deep Reflection {idx + 1}
                               </div>
                               <ReactMarkdown 
                                 rehypePlugins={[rehypeRaw]}
                                 components={{
                                   p: ({node, ...props}) => <p className="mb-0 text-black/60 leading-[2.2] text-xl sm:text-[22px] font-serif tracking-wide max-w-3xl mx-auto text-center" {...props} />,
                                 }}
                               >
                                 {layer.content}
                               </ReactMarkdown>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Depth Layer Composition Action */}
                    <div className="max-w-5xl mx-auto flex flex-col items-center justify-center mt-32 border-t border-black/[0.03] pt-24 pb-48 w-full">
                       {!layerDraft && (
                         <div className="flex flex-col items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Add Emotional Depth Layer</h4>
                           <div className="flex gap-4 sm:flex-row flex-col">
                             <button onClick={() => setLayerDraft({ type: 'fold', content: '' })} className="px-6 py-3 border border-black/10 hover:border-black/30 bg-white text-[10px] font-bold uppercase tracking-widest text-black/50 hover:text-black transition-all rounded-xl shadow-sm hover:-translate-y-1">
                               + Folded Thought
                             </button>
                             <button onClick={() => setLayerDraft({ type: 'margin', content: '' })} className="px-6 py-3 border border-black/10 hover:border-black/30 bg-white text-[10px] font-bold uppercase tracking-widest text-black/50 hover:text-black transition-all rounded-xl shadow-sm hover:-translate-y-1">
                               + Margin Note
                             </button>
                             <button onClick={() => setLayerDraft({ type: 'beneath', content: '' })} className="px-6 py-3 border border-black/10 hover:border-black/30 bg-white text-[10px] font-bold uppercase tracking-widest text-black/50 hover:text-black transition-all rounded-xl shadow-sm hover:-translate-y-1">
                               + Under-Layer (Beneath)
                             </button>
                           </div>
                         </div>
                       )}

                       {layerDraft && (
                         <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl border border-black/[0.05] flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                             Crafting {layerDraft.type === 'fold' ? 'Folded Thought' : layerDraft.type === 'margin' ? 'Margin Note' : 'Beneath Layer'}
                           </h4>
                           <textarea
                             value={layerDraft.content}
                             onChange={(e) => setLayerDraft({ ...layerDraft, content: e.target.value })}
                             placeholder="Write a hidden reflection to place under the surface..."
                             className="w-full min-h-[160px] bg-black/[0.02] border border-black/[0.05] rounded-xl p-6 text-lg font-serif resize-none focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                             autoFocus
                           />
                           <div className="flex justify-end gap-3">
                             <button onClick={() => setLayerDraft(null)} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">
                               Cancel
                             </button>
                             <button 
                               onClick={() => {
                                 if (!layerDraft.content.trim()) return;
                                 const currentNote = notes.find(n => n.id === selectedNote.id);
                                 if (currentNote) {
                                   const newLayer: DepthLayer = {
                                     id: crypto.randomUUID(),
                                     type: layerDraft.type,
                                     content: layerDraft.content,
                                     timestamp: Date.now()
                                   };
                                   updateNote(selectedNote.id, { depthLayers: [...(currentNote.depthLayers || []), newLayer] });
                                   setLayerDraft(null);
                                 }
                               }}
                               className="px-6 py-2 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-colors shadow-lg"
                             >
                               Embed Depth Layer
                             </button>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                )}
                       {!isDrawingMode && !isPreviewMode && (
                  <div className="flex-1 flex flex-col overflow-hidden relative">
                    {(selectedNote.mediaUrl || (selectedNote.drawingData && selectedNote.drawingData.length > 0)) && !isDrawingMode && (
                      <div className="absolute right-8 top-8 z-30 flex flex-col items-end gap-2 group pointer-events-auto">
                        <p className="text-[9px] font-black uppercase tracking-widest text-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {selectedNote.drawingData && selectedNote.drawingData.length > 0 ? "Attached Sketch" : "Blueprint Image"}
                        </p>
                        <div 
                          className="w-28 h-36 sm:w-32 sm:h-44 rounded-xl overflow-hidden shadow-xl border border-black/[0.08] cursor-pointer bg-white transition-all hover:scale-[1.02] hover:-translate-y-1 relative group/thumb" 
                          onClick={() => setIsDrawingMode(true)}
                        >
                          {selectedNote.drawing || selectedNote.mediaUrl ? (
                            <img src={selectedNote.drawing || selectedNote.mediaUrl} alt="Thumbnail" className="w-full h-full object-contain object-center bg-black/[0.02]" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Pencil className="w-5 h-5 text-black/20" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/30 hidden group-hover/thumb:flex flex-col gap-2 items-center justify-center transition-all">
                            <Pencil className="w-4 h-4 text-white" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white">Edit</span>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateNote(selectedNote.id, { mediaUrl: undefined, drawing: undefined, drawingData: [] });
                            }}
                            className="absolute top-1 max-w-[20px] right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/thumb:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                            title="Discard"
                          >
                             {/* simple x using div since we may not have imported X yet */}
                             <div className="flex items-center justify-center w-3 h-3"><Trash2 className="w-2.5 h-2.5"/></div>
                          </button>
                        </div>
                      </div>
                    )}

                    {isRevisionsOpen && selectedNote.revisions && (
                      <div className="px-12 py-6 bg-black/[0.01] border-y border-black/[0.03] max-w-4xl w-full mx-auto my-4 flex flex-col gap-4 transition-all">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Soft Past Edits (Traces)</h4>
                        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto scrollbar-hide">
                          {selectedNote.revisions.map((rev, idx) => (
                            <div key={idx} className="p-4 bg-white/60 border border-black/[0.02] flex flex-col justify-between gap-3 group sm:flex-row items-center">
                              <p className="text-[11px] text-black/60 line-clamp-3 font-serif italic whitespace-pre-wrap flex-1">{rev || '_No contents saved_'}</p>
                              <button 
                                onClick={() => {
                                  updateNote(selectedNote.id, { content: rev });
                                  setIsRevisionsOpen(false);
                                }}
                                className="text-[9px] font-black uppercase tracking-widest text-[#007aff] hover:underline cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity"
                              >
                                Restore
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                     <div 
                      onClick={handleStampClick}
                      onDoubleClick={handlePaperDoubleClick}
                      className={`flex-1 overflow-y-auto px-12 ${dynamicPaddingClass} max-w-4xl w-full mx-auto scrollbar-hide relative cursor-crosshair`}
                      title={activeStampTool ? `Click on paper to place a ${activeStampTool} ink stamp` : "Double-click margins to leave an author's fingerprint or star trace"}
                    >
                      {/* Quiet Watermark Seal representing material memory depth - Reinvention Phase 4 */}
                      {sDensity > 3 && (
                        <div 
                          className="absolute bottom-16 right-16 pointer-events-none select-none text-black/5 mix-blend-multiply opacity-[0.28] transition-opacity duration-1000"
                          style={{
                            width: '100px',
                            height: '100px',
                            zIndex: 1,
                          }}
                        >
                          <svg viewBox="0 0 100 100" className="w-full h-full text-black" fill="none" stroke="currentColor" strokeWidth="0.6">
                            <circle cx="50" cy="50" r="42" strokeDasharray="1 3" />
                            <circle cx="50" cy="50" r="32" />
                            <path d="M50,15 L50,85 M15,50 L85,50" strokeWidth="0.4" strokeDasharray="4 4" />
                            <path d="M25,25 L75,75 M25,75 L75,25" strokeWidth="0.4" strokeDasharray="4 4" />
                            <path d="M30,50 Q40,30 50,50 T70,50" />
                            <path d="M30,50 Q40,70 50,50 T70,50" />
                            <circle cx="50" cy="50" r="4" fill="currentColor" />
                          </svg>
                          <div className="text-center text-[6px] font-mono tracking-[0.3em] uppercase text-black/20 -mt-1 select-none">MEM_GRAV</div>
                        </div>
                      )}

                      {/* Lived-in annotations marks (Phase 545 Authorship Resin) */}
                      {selectedNote.marks && selectedNote.marks.map((mark: any) => {
                        let el = null;
                        if (mark.type === 'fingerprint') {
                          el = (
                            <svg className="w-8 h-8 text-black/20 select-none animate-scale-up" viewBox="0 0 100 100" fill="currentColor">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
                              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" />
                              <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
                              <circle cx="50" cy="50" r="6" fill="currentColor" />
                            </svg>
                          );
                        } else if (mark.type === 'star-highlight') {
                          el = <span className="text-amber-500/40 font-serif text-xl select-none animate-scale-up">✦</span>;
                        } else {
                          el = (
                            <svg className="w-10 h-6 text-black/15 select-none animate-scale-up" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M10,25 C30,5 40,45 60,15 C80,-10 90,35 100,25" strokeLinecap="round" />
                            </svg>
                          );
                        }
                        return (
                          <div 
                            key={mark.id}
                            className="absolute pointer-events-none select-none mix-blend-multiply transition-[transform,opacity] duration-1000"
                            style={{ 
                              left: `${mark.x}px`, 
                              top: `${mark.y}px`, 
                              zIndex: 1,
                              opacity: sDensity > 15 ? 0.65 : sDensity > 6 ? 0.78 : 0.9,
                              transform: `translate(-50%, -50%) rotate(${(mark.x * 5 + mark.y * 11) % 24 - 12}deg) scale(${sDensity > 12 ? 0.92 : 1})`
                            }}
                            title="Touch mark of authorship"
                          >
                            {el}
                          </div>
                        );
                      })}
                      
                      <textarea
                        ref={textareaRef}
                        value={selectedNote.content}
                        onChange={handleTextareaChange}
                        className={`w-full ${dynamicLineClass} border-none focus:outline-none resize-none bg-transparent placeholder-black/15 pb-12 lined-paper transition-all duration-300 relative z-10`}
                        placeholder="Pour your thoughts onto the page..."
                        style={{ color: '#1d1d1f' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        <AnimatePresence>
          {isSpatialMode && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0 bg-[#fafafa]"
            >
              <SpatialCanvas 
              notes={notes}
              updateNote={updateNote}
              deleteNote={deleteNote}
              selectedNoteId={selectedNoteId}
              setSelectedNoteId={setSelectedNoteId}
              addSpreadNode={addSpreadNode}
              pressure={pressure}
              isDeepFocus={isDeepFocus}
              isGridEnabled={isGridEnabled}
              isSnappingEnabled={isSnappingEnabled}
              activeContext={activeContext}
              bookmarks={bookmarks}
              addBookmark={(bm: SpatialBookmark) => setBookmarks(prev => [bm, ...prev])}
              jumpToBookmark={activeBookmark}
              onJumpComplete={() => setActiveBookmark(null)}
              captureScreenshot={captureScreenshot}
            />
          </motion.div>
        )}
      </AnimatePresence>

        {!selectedNote && !isSpatialMode && (
          <div className="flex-1 flex flex-col items-center justify-center text-black/10 space-y-4 bg-white">
            <div className="w-12 h-12 bg-black/5 flex items-center justify-center">
              <FileText className="w-6 h-6 opacity-20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">Select Workspace Node</p>
          </div>
        )}
      </main>


    </div>
  );
}

// Phase 111 & 113 & 196 & 214: Professional Interaction Surface & Search Awareness
const NoteListItem = React.memo(({ note, isSelected, onClick, onDelete, isCollapsed, searchQuery }: { note: Note, isSelected: boolean, onClick: () => void, onDelete?: () => void, isCollapsed?: boolean, searchQuery?: string }) => {
  const isMatch = searchQuery && (
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className={`px-2 mb-0.5 group relative ${isCollapsed ? 'flex justify-center' : ''} ${searchQuery && !isMatch ? 'opacity-20 grayscale' : ''}`}>
      <button
        onClick={onClick}
        className={`w-full text-left transition-all relative overflow-hidden rounded-md ${isSelected ? 'bg-black/[0.03]' : 'hover:bg-black/[0.02]'} ${isCollapsed ? 'aspect-square w-10 flex items-center justify-center p-0 rounded-full' : 'px-4 py-3'}`}
      >
        <div className="flex items-center gap-3">
          {(() => {
            const density = getMemoryDensity(note);
            return (
              <div className="relative flex items-center justify-center shrink-0 w-4 h-4">
                {density > 10 && (
                  <span className="absolute inset-0 rounded-full border border-black/10 animate-pulse pointer-events-none scale-105" />
                )}
                <div 
                  className="w-1.5 h-1.5 rounded-full transition-all" 
                  style={{ 
                    backgroundColor: note.landmarkColor || (isSelected ? '#000000' : isMatch ? '#007aff' : 'rgba(0,0,0,0.1)'),
                    transform: density > 15 ? 'scale(1.4)' : density > 5 ? 'scale(1.2)' : 'scale(1)'
                  }}
                  title={density > 3 ? `Memory Density: ${density}` : undefined}
                />
              </div>
            );
          })()}
          {!isCollapsed && (
            <div className="flex-1 min-w-0 pr-8">
              <h4 className={`text-xs font-black uppercase tracking-[0.05em] truncate ${isSelected ? 'text-black' : 'text-black/50'}`}>
                {note.title || 'UNNAMED_NODE'}
              </h4>
              <p className={`text-[10px] truncate ${isSelected ? 'text-black/60' : 'text-black/30'}`}>
                {note.content || '...'}
              </p>
            </div>
          )}
          {!isCollapsed && note.isPinned && <Star className="w-3 h-3 text-black/20" />}
        </div>
      </button>
      {!isCollapsed && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 bg-white border border-black/5 text-[#86868b] hover:text-red-500 hover:scale-105 rounded shadow-sm transition-all z-20 cursor-pointer"
          title="Archive/Delete Note"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});

function MarginLayer({ layer, index }: { layer: DepthLayer, index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const offset = `calc(50% + ${(index - 1) * 200}px)`;
  return (
    <div className="hidden sm:flex fixed right-0 z-40 items-center justify-end group" style={{ top: offset, transform: 'translateY(-50%)' }}>
       <div 
         className={`relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex justify-end overflow-hidden ${isOpen ? 'w-[360px]' : 'w-10 hover:w-16'}`}
         onClick={() => setIsOpen(!isOpen)}
       >
         <div className={`p-8 bg-[#fafafa]/90 backdrop-blur-xl border-l-[3px] border-black/20 shadow-[-10px_0_40px_rgba(0,0,0,0.05)] rounded-l-[2rem] transition-all duration-700 cursor-pointer overflow-hidden flex flex-col justify-center min-h-[160px] ${isOpen ? 'w-full opacity-100' : 'w-12 opacity-60 hover:opacity-100'}`}>
            {!isOpen && (
               <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[10px] font-black uppercase tracking-[0.3em] text-black/30 whitespace-nowrap">
                 Margin Layer
               </div>
            )}
            {isOpen && (
               <div className="animate-in fade-in slide-in-from-right-16 duration-700 relative">
                 <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-black/20 mb-6">Hidden Margin</h5>
                 <ReactMarkdown 
                   rehypePlugins={[rehypeRaw]}
                   components={{
                     p: ({node, ...props}) => <p className="mb-4 text-black/70 leading-[1.8] text-sm font-serif tracking-wide transition-all" {...props} />,
                   }}
                 >
                   {layer.content}
                 </ReactMarkdown>
                 <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="mt-8 text-[9px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors block">
                   Tuck Away
                 </button>
               </div>
            )}
         </div>
       </div>
    </div>
  );
}

function FoldedLayer({ layer }: { layer: DepthLayer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="my-12 flex flex-col items-center justify-center transition-all">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className={`bg-[#fafafa] border border-black/[0.05] shadow-[0_10px_30px_rgba(0,0,0,0.03)] cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative group ${isOpen ? 'p-12 sm:p-20 max-w-4xl w-full rounded-[2rem] opacity-100 scale-100' : 'p-6 max-w-[200px] w-full rounded-2xl opacity-60 hover:opacity-100 hover:-translate-y-2 scale-95 hover:shadow-xl'}`}
      >
        {!isOpen && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1 group-hover:gap-2 transition-all">
              <div className="w-1.5 h-1.5 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="w-1.5 h-1.5 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="w-1.5 h-1.5 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/40">Folded Thought</span>
          </div>
        )}
        {isOpen && (
          <div className="animate-in fade-in zoom-in duration-700">
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-12 text-center">Unfolded Layer</h5>
            <ReactMarkdown 
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({node, ...props}) => <p className="mb-8 text-black/80 leading-[2.2] text-lg sm:text-[20px] font-serif tracking-wide max-w-2xl mx-auto transition-all" {...props} />,
              }}
            >
              {layer.content}
            </ReactMarkdown>
            <div className="mt-16 flex justify-center">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="text-[9px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors"
              >
                Refold
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DrawingCanvas({ initialData, initialStrokes, mediaUrl, onSave, onExit, isReadonly }: { initialData?: string, initialStrokes?: Stroke[], mediaUrl?: string, onSave: (data: string, strokes: Stroke[]) => void, onExit?: () => void, isReadonly?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const [activeTool, setActiveTool] = useState<'pencil' | 'highlighter' | 'eraser' | 'arrow' | 'rect'>('pencil');
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>(initialStrokes || []);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [markupColor, setMarkupColor] = useState('#000000');

  const redrawRequestRef = useRef<number | null>(null);

  useEffect(() => {
    if (mediaUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = mediaUrl;
      img.onload = () => {
        bgImageRef.current = img;
        requestAnimationFrame(redrawCanvas);
      };
    }
  }, [mediaUrl]);

  useEffect(() => {
    if (redrawRequestRef.current) cancelAnimationFrame(redrawRequestRef.current);
    redrawRequestRef.current = requestAnimationFrame(redrawCanvas);
    return () => {
      if (redrawRequestRef.current) cancelAnimationFrame(redrawRequestRef.current);
    };
  }, [strokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(redrawCanvas);
    });
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Preparation
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(canvas.width - rect.width * dpr) > 1 || Math.abs(canvas.height - rect.height * dpr) > 1) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw background image if available
    if (bgImageRef.current && !isReadonly) {
      const img = bgImageRef.current;
      const scale = Math.min(rect.width / img.width, rect.height / img.height);
      const x = (rect.width - img.width * scale) / 2;
      const y = (rect.height - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
    
    // Draw all strokes

    strokes.forEach(stroke => {
      drawFullStroke(ctx, stroke);
    });

    // Draw active stroke
    if (isDrawing && currentStroke.length > 0) {
      drawFullStroke(ctx, {
        id: 'current',
        points: currentStroke,
        tool: activeTool,
        color: activeTool === 'pencil' ? markupColor : activeTool === 'highlighter' ? 'rgba(255, 235, 59, 0.4)' : markupColor,
        width: activeTool === 'pencil' ? 2.5 : activeTool === 'highlighter' ? 15 : activeTool === 'eraser' ? 30 : 2,
        timestamp: Date.now()
      });
    }
  };

  const drawFullStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length < 1) return;

    ctx.globalCompositeOperation = stroke.tool === 'highlighter' ? 'multiply' : 
                                  stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = stroke.tool === 'highlighter' ? 'rgba(255, 235, 59, 0.4)' : 
                      stroke.tool === 'eraser' ? 'rgba(0,0,0,1)' : stroke.color;
    
    ctx.lineWidth = stroke.width;

    if (stroke.tool === 'arrow') {
      const start = stroke.points[0];
      const end = stroke.points[stroke.points.length - 1];
      drawArrow(ctx, start.x, start.y, end.x, end.y, stroke.width);
      return;
    }

    if (stroke.tool === 'rect') {
      const start = stroke.points[0];
      const end = stroke.points[stroke.points.length - 1];
      ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      return;
    }

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

    if (stroke.points.length < 2) {
      ctx.stroke();
      return;
    }

    for (let i = 1; i < stroke.points.length; i++) {
      const p1 = stroke.points[i - 1];
      const p2 = stroke.points[i];
      
      // Phase 311 & 314: Pencil Realism (Pressure/Velocity)
      if (stroke.tool === 'pencil') {
        const velocity = p2.velocity || 1;
        // Map velocity to a width factor (slower = thicker)
        const widthModifier = Math.max(0.5, Math.min(2.0, 1 / (velocity + 0.1)));
        ctx.lineWidth = stroke.width * widthModifier;
      } else {
        ctx.lineWidth = stroke.width;
      }
      
      const midPoint = {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
      };
      
      ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      ctx.stroke();
    }
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, width: number) => {
    const headlen = 15;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoordinates(e);
    setIsDrawing(true);
    setCurrentStroke([coords]);
    setLastPoint(coords);
  };

  const getCoordinates = (e: any): Point => {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect() || { left: 0, top: 0 };
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const now = Date.now();
    let velocity = 0;
    if (lastPoint && lastPoint.timestamp) {
      const dist = Math.sqrt(Math.pow(clientX - rect.left - lastPoint.x, 2) + Math.pow(clientY - rect.top - lastPoint.y, 2));
      const time = now - lastPoint.timestamp;
      velocity = dist / (time || 1);
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      timestamp: now,
      velocity
    };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const coords = getCoordinates(e);
    setCurrentStroke(prev => [...prev, coords]);
    setLastPoint(coords);
    if (redrawRequestRef.current) cancelAnimationFrame(redrawRequestRef.current);
    redrawRequestRef.current = requestAnimationFrame(redrawCanvas);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const newStroke: Stroke = {
      id: Math.random().toString(36).substr(2, 9),
      points: currentStroke,
      tool: activeTool,
      color: activeTool === 'pencil' ? markupColor : activeTool === 'highlighter' ? 'rgba(255, 235, 59, 0.4)' : markupColor,
      width: activeTool === 'pencil' ? 2.5 : activeTool === 'highlighter' ? 15 : activeTool === 'eraser' ? 30 : 2,
      timestamp: Date.now()
    };

    const newStrokes = [...strokes, newStroke];
    setStrokes(newStrokes);
    setCurrentStroke([]);
    
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL(), newStrokes);
    }
  };

  const clear = () => {
    setStrokes([]);
    onSave('', []);
  };

  return (
    <div className={`flex-1 relative flex flex-col bg-transparent overflow-hidden ${isReadonly ? 'pointer-events-none absolute inset-0 z-50' : ''}`}>
      {!isReadonly && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 p-2 bg-white/90 backdrop-blur-2xl border border-black/[0.03] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-20 transition-all hover:scale-[1.02] group">
          <div className="flex gap-1 px-1">
            <button 
              onClick={() => setActiveTool('pencil')}
            className={`p-3 rounded-2xl transition-all ${activeTool === 'pencil' ? 'bg-[#1d1d1f] text-white shadow-xl' : 'text-gray-400 hover:bg-black/5 hover:text-black'}`}
            title="Pencil"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTool('highlighter')}
            className={`p-3 rounded-2xl transition-all ${activeTool === 'highlighter' ? 'bg-yellow-400 text-black shadow-xl' : 'text-gray-400 hover:bg-black/5 hover:text-black'}`}
            title="Highlighter"
          >
            <Highlighter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTool('arrow')}
            className={`p-3 rounded-2xl transition-all ${activeTool === 'arrow' ? 'bg-[#1d1d1f] text-white shadow-xl' : 'text-gray-400 hover:bg-black/5 hover:text-black'}`}
            title="Arrow"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTool('rect')}
            className={`p-3 rounded-2xl transition-all ${activeTool === 'rect' ? 'bg-[#1d1d1f] text-white shadow-xl' : 'text-gray-400 hover:bg-black/5 hover:text-black'}`}
            title="Rectangle"
          >
            <Square className="w-5 h-5" />
          </button>
          <div className="w-[1px] h-8 bg-black/[0.03] mx-1 self-center" />
          <button 
            onClick={() => setActiveTool('eraser')}
            className={`p-3 rounded-2xl transition-all ${activeTool === 'eraser' ? 'bg-white ring-2 ring-black text-black shadow-xl font-bold' : 'text-gray-400 hover:bg-black/5 hover:text-black'}`}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </button>
        </div>
        <div className="w-[1px] h-10 bg-black/[0.05] mx-2" />
        <div className="flex gap-2 px-1">
          {[ '#000000', '#007aff', '#ff3b30', '#34c759' ].map(color => (
            <button 
              key={color}
              onClick={() => setMarkupColor(color)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${markupColor === color ? 'border-black scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="w-[1px] h-10 bg-black/[0.05] mx-2" />
        <button onClick={clear} className="p-3 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all" title="Clear">
          <RotateCcw className="w-5 h-5" />
        </button>
        {onExit && (
          <>
            <div className="w-[1px] h-10 bg-black/[0.05] mx-2" />
            <button onClick={onExit} className="px-4 py-3 bg-[#1d1d1f] hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all" title="Done">
              Done
            </button>
          </>
        )}
      </div>
      )}

      <canvas
        ref={canvasRef}
        onMouseDown={!isReadonly ? startDrawing : undefined}
        onMouseMove={!isReadonly ? draw : undefined}
        onMouseUp={!isReadonly ? stopDrawing : undefined}
        onMouseLeave={!isReadonly ? stopDrawing : undefined}
        onTouchStart={!isReadonly ? startDrawing : undefined}
        onTouchMove={!isReadonly ? draw : undefined}
        onTouchEnd={!isReadonly ? stopDrawing : undefined}
        className={`w-full h-full ${!isReadonly ? 'cursor-crosshair touch-none' : ''}`}
      />
    </div>

  );
}



