import { useState, useRef, useEffect } from 'react';
import { X, ExternalLink, Globe, BookOpen, Trophy, Tv, FileText } from 'lucide-react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Source {
  url: string;
  title: string;
  type: 'wikipedia' | 'encyclopedia' | 'nba' | 'espn' | 'biography' | 'other';
  description: string;
}

interface SourcesWindowProps {
  sources: Source[];
  isOpen: boolean;
  onClose: () => void;
  responseId: string;
  userPrompt: string;
}

// Helper function to get icon by source type
const getSourceIcon = (type: Source['type']) => {
  switch (type) {
    case 'wikipedia':
      return <Globe className="h-4 w-4" />;
    case 'encyclopedia':
      return <BookOpen className="h-4 w-4" />;
    case 'nba':
      return <Trophy className="h-4 w-4" />;
    case 'espn':
      return <Tv className="h-4 w-4" />;
    case 'biography':
      return <FileText className="h-4 w-4" />;
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
};

// Helper function to get source label
const getSourceLabel = (type: Source['type']) => {
  switch (type) {
    case 'wikipedia':
      return 'Wikipedia';
    case 'encyclopedia':
      return 'Encyclopedia Britannica';
    case 'nba':
      return 'NBA';
    case 'espn':
      return 'ESPN';
    case 'biography':
      return 'Biography';
    default:
      return '';
  }
};

// Create a singleton pattern for the window position
const windowPosition = {
  current: { x: window.innerWidth - 400, y: 100 }
};

export function SourcesWindow({ sources, isOpen, onClose, responseId, userPrompt }: SourcesWindowProps) {
  const [position, setPosition] = useState(windowPosition.current);
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  // Add state for window dimensions
  const [constraints, setConstraints] = useState({ left: 0, top: 0, right: 0, bottom: 0 });

  // Update constraints when window resizes
  useEffect(() => {
    const updateConstraints = () => {
      setConstraints({
        left: 0,
        top: 0,
        right: window.innerWidth - 380, // 380px is window width
        bottom: window.innerHeight - 464 // 400px scroll area + 64px header
      });
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  // Update position if it's outside bounds after resize
  useEffect(() => {
    setPosition(pos => ({
      x: Math.min(Math.max(pos.x, constraints.left), constraints.right),
      y: Math.min(Math.max(pos.y, constraints.top), constraints.bottom)
    }));
  }, [constraints]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={constraintsRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed z-50"
      style={{ left: position.x, top: position.y }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        setPosition(pos => ({
          x: pos.x + info.offset.x,
          y: pos.y + info.offset.y
        }));
      }}
    >
      <div className="w-[380px] bg-backgroundSecondary border border-borderColorPrimary rounded-lg shadow-lg">
        {/* Header with Citations count and close button */}
        <div className="flex items-center justify-between p-4 border-b cursor-move"
          onPointerDown={(e) => {
            e.preventDefault();
            dragControls.start(e);
          }}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">
                {userPrompt.length > 35 ? userPrompt.substring(0, 35) + '...' : userPrompt}
            </h3>
            <div className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary/50 rounded-full">
              [{sources.length}]
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sources Content */}
        <ScrollArea className="h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={responseId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 p-3"
            >
              {sources.map((source, index) => (
                <motion.div
                  key={source.url}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded-xl 
                              bg-sideBarBackground hover:bg-secondary/10
                              border border-transparent hover:border-secondary/20
                              transition-all duration-200 ease-in-out
                              hover:shadow-lg hover:shadow-secondary/5
                              hover:-translate-y-0.5"
                  >
                    {/* Source Type Header */}
                    <div className="flex items-center gap-1 mb-1.5">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 
                                    flex items-center justify-center
                                    group-hover:bg-secondary/20 
                                    transition-colors duration-200">
                        {getSourceIcon(source.type)}
                      </div>
                      <span className="text-xs font-medium text-muted-foreground/80
                                     group-hover:text-primary/80 transition-colors">
                        {getSourceLabel(source.type)}
                      </span>
                    </div>
                    
                    {/* Title and Description */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold leading-snug 
                                   text-foreground/90 group-hover:text-primary 
                                   transition-colors duration-200">
                        {source.title}
                      </h4>
                      <p className="text-xs text-muted-foreground/70 
                                 group-hover:text-muted-foreground/90
                                 line-clamp-2 leading-relaxed">
                        {source.description}
                      </p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </div>
    </motion.div>
  );
}