import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Canvas as FabricCanvas, PencilBrush, Circle, Rect, Line, IText, FabricObject } from "fabric";
import html2canvas from "html2canvas";
import { AnnotationToolbar } from "./AnnotationToolbar";
import type { AnnotationTool } from "./types";
import { toast } from "sonner";

interface AnnotationCanvasProps {
  isActive: boolean;
  onClose: () => void;
  presentationContainerRef?: React.RefObject<HTMLDivElement | null>;
  blockTitle?: string;
}

export interface AnnotationCanvasRef {
  clear: () => void;
}

export const AnnotationCanvas = forwardRef<AnnotationCanvasRef, AnnotationCanvasProps>(
  ({ isActive, onClose, blockTitle, presentationContainerRef }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<FabricCanvas | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [activeTool, setActiveTool] = useState<AnnotationTool>('pen');
    const [activeColor, setActiveColor] = useState('#FF3B30');
    const [brushSize, setBrushSize] = useState(4);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const historyRef = useRef<string[]>([]);
    const historyIndexRef = useRef(-1);
    const isDrawingShapeRef = useRef(false);
    const startPointRef = useRef<{ x: number; y: number } | null>(null);
    const currentShapeRef = useRef<FabricObject | null>(null);

    // Initialize canvas
    useEffect(() => {
      if (!canvasRef.current || !isActive) return;

      const canvas = new FabricCanvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 'transparent',
        selection: false,
      });

      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = brushSize;

      fabricCanvasRef.current = canvas;
      
      // Save initial state
      saveState();

      // Handle window resize
      const handleResize = () => {
        canvas.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        canvas.renderAll();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }, [isActive]);

    // Update brush settings
    useEffect(() => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      if (activeTool === 'pen' || activeTool === 'highlighter') {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = activeTool === 'highlighter' 
          ? `${activeColor}80` // 50% opacity for highlighter
          : activeColor;
        canvas.freeDrawingBrush.width = activeTool === 'highlighter' ? brushSize * 3 : brushSize;
      } else if (activeTool === 'eraser') {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = 'rgba(0,0,0,0)';
        canvas.freeDrawingBrush.width = brushSize * 2;
        // For eraser, we'll handle it differently
        canvas.isDrawingMode = false;
      } else {
        canvas.isDrawingMode = false;
      }
    }, [activeTool, activeColor, brushSize]);

    // Handle shape drawing
    useEffect(() => {
      const canvas = fabricCanvasRef.current;
      if (!canvas || !isActive) return;

      const handleMouseDown = (opt: any) => {
        if (activeTool === 'eraser') {
          const target = canvas.findTarget(opt.e);
          if (target) {
            canvas.remove(target);
            canvas.renderAll();
            saveState();
          }
          return;
        }

        if (!['arrow', 'circle', 'rectangle', 'text'].includes(activeTool)) return;

        const pointer = canvas.getScenePoint(opt.e);
        startPointRef.current = { x: pointer.x, y: pointer.y };
        isDrawingShapeRef.current = true;

        if (activeTool === 'text') {
          const text = new IText('Type here...', {
            left: pointer.x,
            top: pointer.y,
            fontSize: brushSize * 4,
            fill: activeColor,
            fontFamily: 'Arial',
          });
          canvas.add(text);
          canvas.setActiveObject(text);
          text.enterEditing();
          text.selectAll();
          saveState();
          isDrawingShapeRef.current = false;
          return;
        }

        if (activeTool === 'circle') {
          const circle = new Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 1,
            fill: 'transparent',
            stroke: activeColor,
            strokeWidth: brushSize,
            originX: 'center',
            originY: 'center',
          });
          canvas.add(circle);
          currentShapeRef.current = circle;
        } else if (activeTool === 'rectangle') {
          const rect = new Rect({
            left: pointer.x,
            top: pointer.y,
            width: 1,
            height: 1,
            fill: 'transparent',
            stroke: activeColor,
            strokeWidth: brushSize,
          });
          canvas.add(rect);
          currentShapeRef.current = rect;
        } else if (activeTool === 'arrow') {
          const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
            stroke: activeColor,
            strokeWidth: brushSize,
            strokeLineCap: 'round',
          });
          canvas.add(line);
          currentShapeRef.current = line;
        }
      };

      const handleMouseMove = (opt: any) => {
        if (!isDrawingShapeRef.current || !startPointRef.current || !currentShapeRef.current) return;

        const pointer = canvas.getScenePoint(opt.e);
        const startX = startPointRef.current.x;
        const startY = startPointRef.current.y;

        if (activeTool === 'circle') {
          const radius = Math.sqrt(
            Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)
          );
          (currentShapeRef.current as Circle).set({ radius });
        } else if (activeTool === 'rectangle') {
          const width = pointer.x - startX;
          const height = pointer.y - startY;
          (currentShapeRef.current as Rect).set({
            width: Math.abs(width),
            height: Math.abs(height),
            left: width < 0 ? pointer.x : startX,
            top: height < 0 ? pointer.y : startY,
          });
        } else if (activeTool === 'arrow') {
          (currentShapeRef.current as Line).set({
            x2: pointer.x,
            y2: pointer.y,
          });
        }

        canvas.renderAll();
      };

      const handleMouseUp = () => {
        if (isDrawingShapeRef.current && currentShapeRef.current) {
          saveState();
        }
        isDrawingShapeRef.current = false;
        startPointRef.current = null;
        currentShapeRef.current = null;
      };

      const handlePathCreated = () => {
        saveState();
      };

      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
      canvas.on('path:created', handlePathCreated);

      return () => {
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
        canvas.off('path:created', handlePathCreated);
      };
    }, [activeTool, activeColor, brushSize, isActive]);

    const saveState = useCallback(() => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const json = JSON.stringify(canvas.toJSON());
      
      // Remove any redo states
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push(json);
      historyIndexRef.current = historyRef.current.length - 1;
      
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(false);
    }, []);

    const handleUndo = useCallback(() => {
      const canvas = fabricCanvasRef.current;
      if (!canvas || historyIndexRef.current <= 0) return;

      historyIndexRef.current--;
      canvas.loadFromJSON(JSON.parse(historyRef.current[historyIndexRef.current])).then(() => {
        canvas.renderAll();
        setCanUndo(historyIndexRef.current > 0);
        setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
      });
    }, []);

    const handleRedo = useCallback(() => {
      const canvas = fabricCanvasRef.current;
      if (!canvas || historyIndexRef.current >= historyRef.current.length - 1) return;

      historyIndexRef.current++;
      canvas.loadFromJSON(JSON.parse(historyRef.current[historyIndexRef.current])).then(() => {
        canvas.renderAll();
        setCanUndo(historyIndexRef.current > 0);
        setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
      });
    }, []);

    const handleClear = useCallback(() => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      canvas.clear();
      canvas.backgroundColor = 'transparent';
      canvas.renderAll();
      saveState();
    }, [saveState]);

  // Save screenshot with full content using html2canvas
  const handleSaveScreenshot = useCallback(async () => {
    setIsSaving(true);
    
    try {
      const fabricCanvas = fabricCanvasRef.current;
      if (!fabricCanvas) {
        throw new Error('Annotation canvas not available');
      }

      // Get the presentation container element
      const presentationContainer = presentationContainerRef?.current;
      
      if (presentationContainer) {
        // Temporarily hide the annotation canvas for html2canvas
        const annotationLayer = containerRef.current;
        if (annotationLayer) {
          annotationLayer.style.visibility = 'hidden';
        }

        // Capture the full presentation content using html2canvas
        const backgroundCanvas = await html2canvas(presentationContainer, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#1e293b',
          scale: 1,
          logging: false,
          ignoreElements: (element) => {
            // Ignore the annotation canvas itself
            return element === annotationLayer || element.contains(annotationLayer as Node);
          }
        });

        // Restore annotation layer visibility
        if (annotationLayer) {
          annotationLayer.style.visibility = 'visible';
        }

        // Create final composite canvas
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = backgroundCanvas.width;
        finalCanvas.height = backgroundCanvas.height;
        const ctx = finalCanvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not create canvas context');
        }

        // Draw the captured background
        ctx.drawImage(backgroundCanvas, 0, 0);

        // Get annotation canvas data and overlay it
        const annotationDataUrl = fabricCanvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 1,
        });

        await new Promise<void>((resolve, reject) => {
          const annotationImg = new Image();
          annotationImg.onload = () => {
            // Scale annotations to match the background canvas size
            ctx.drawImage(annotationImg, 0, 0, finalCanvas.width, finalCanvas.height);
            resolve();
          };
          annotationImg.onerror = () => reject(new Error('Failed to load annotation image'));
          annotationImg.src = annotationDataUrl;
        });

        // Create download link
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = blockTitle 
          ? `screenshot-${blockTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${timestamp}.png`
          : `screenshot-${timestamp}.png`;
        
        link.download = filename;
        link.href = finalCanvas.toDataURL('image/png');
        link.click();
        
        toast.success('Full screenshot saved!', {
          description: `Saved as ${filename}`,
        });
      } else {
        // Fallback: just save annotations with dark background
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not create canvas context');
        }

        tempCanvas.width = window.innerWidth;
        tempCanvas.height = window.innerHeight;

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        const annotationDataUrl = fabricCanvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 1,
        });

        await new Promise<void>((resolve, reject) => {
          const annotationImg = new Image();
          annotationImg.onload = () => {
            ctx.drawImage(annotationImg, 0, 0);
            resolve();
          };
          annotationImg.onerror = () => reject(new Error('Failed to load annotation image'));
          annotationImg.src = annotationDataUrl;
        });

        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = blockTitle 
          ? `annotation-${blockTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${timestamp}.png`
          : `annotation-${timestamp}.png`;
        
        link.download = filename;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
        
        toast.success('Screenshot saved!', {
          description: `Saved as ${filename}`,
        });
      }
      
      setIsSaving(false);
    } catch (error) {
      console.error('Failed to save screenshot:', error);
      toast.error('Failed to save screenshot', {
        description: 'Please try again',
      });
      setIsSaving(false);
    }
  }, [blockTitle, presentationContainerRef]);

    // Expose clear method
    useImperativeHandle(ref, () => ({
      clear: handleClear,
    }));

    if (!isActive) return null;

    return (
      <div 
        ref={containerRef}
        className="absolute inset-0 z-[105] pointer-events-auto"
        style={{ touchAction: 'none' }}
      >
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0"
        />
        
        <AnnotationToolbar
          activeTool={activeTool}
          activeColor={activeColor}
          brushSize={brushSize}
          onToolChange={setActiveTool}
          onColorChange={setActiveColor}
          onBrushSizeChange={setBrushSize}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          onClose={onClose}
          onSaveScreenshot={handleSaveScreenshot}
          canUndo={canUndo}
          canRedo={canRedo}
          isSaving={isSaving}
        />
      </div>
    );
  }
);

AnnotationCanvas.displayName = 'AnnotationCanvas';
