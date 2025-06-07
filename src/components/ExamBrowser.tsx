
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ExternalLink, AlertTriangle, Home } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useCapacitor } from '../hooks/useCapacitor';
import AdminPasswordDialog from './AdminPasswordDialog';

const ExamBrowser = () => {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [attemptedExit, setAttemptedExit] = useState(0);
  
  const { currentExam, endExam } = useAppStore();
  const { isNative } = useCapacitor();

  useEffect(() => {
    // Prevent context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common shortcuts
      if (
        e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 's' || e.key === 'r' || e.key === 'u' || e.key === 'i' || e.key === 'j' || e.key === 'p') ||
        e.key === 'F12' ||
        e.key === 'F5' ||
        e.key === 'F11' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'Shift') ||
        e.altKey && e.key === 'Tab' ||
        e.altKey && e.key === 'F4' ||
        e.key === 'Escape'
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Prevent text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Prevent drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent copy paste
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    document.addEventListener('paste', handleCopy);

    // Prevent going back in browser
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      setAttemptedExit(prev => prev + 1);
    };

    // Push initial state to prevent back navigation
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    // Prevent page unload/refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Ujian sedang berlangsung. Anda tidak dapat meninggalkan halaman ini.';
      setAttemptedExit(prev => prev + 1);
      return 'Ujian sedang berlangsung. Anda tidak dapat meninggalkan halaman ini.';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Monitor window focus
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAttemptedExit(prev => prev + 1);
        // Force focus back
        window.focus();
      }
    };

    const handleBlur = () => {
      setAttemptedExit(prev => prev + 1);
      // Force focus back
      setTimeout(() => window.focus(), 100);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('paste', handleCopy);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    // Request fullscreen when component mounts
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (error) {
        console.log('Could not enter fullscreen mode');
      }
    };

    enterFullscreen();

    // Listen for fullscreen changes and force back to fullscreen
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      // If user exits fullscreen, try to re-enter
      if (!isCurrentlyFullscreen) {
        setAttemptedExit(prev => prev + 1);
        setTimeout(() => {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        }, 1000);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Prevent right-click and various interactions on iframe
  useEffect(() => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.onload = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // Prevent context menu in iframe
            iframeDoc.addEventListener('contextmenu', (e) => e.preventDefault());
            // Prevent key combinations in iframe
            iframeDoc.addEventListener('keydown', (e) => {
              if (e.ctrlKey || e.altKey || e.key === 'F12' || e.key === 'F5') {
                e.preventDefault();
              }
            });
          }
        } catch (error) {
          // Cross-origin iframe, can't access content
          console.log('Cannot access iframe content due to cross-origin policy');
        }
      };
    }
  }, []);

  const handleExitExam = () => {
    endExam();
    setShowExitDialog(false);
    // Exit fullscreen when ending exam
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleBackButton = () => {
    setShowExitDialog(true);
  };

  if (!currentExam) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white z-50 select-none" style={{ userSelect: 'none' }}>
      {/* Security Warning */}
      {showWarning && (
        <Dialog open={showWarning} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                Mode Ujian Aman
              </DialogTitle>
              <DialogDescription>
                Aplikasi akan berjalan dalam mode aman. Semua fungsi keluar akan dinonaktifkan selama ujian berlangsung.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Screenshot dan screen recording diblokir</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Tombol kembali browser dinonaktifkan</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Keyboard shortcuts diblokir</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Keluar hanya dengan password admin</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Mode fullscreen dipaksa aktif</span>
              </div>
            </div>

            <Button 
              onClick={() => setShowWarning(false)}
              className="w-full mt-4"
            >
              Mulai Ujian Aman
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {/* Top Bar */}
      <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5" />
          <div>
            <h1 className="font-medium">{currentExam.title}</h1>
            <p className="text-xs opacity-90">
              Mode Ujian Aman Aktif {attemptedExit > 0 && `- Percobaan keluar: ${attemptedExit}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isFullscreen && (
            <Alert className="mr-2 bg-yellow-500 text-yellow-900 border-yellow-600">
              <AlertDescription className="text-xs">
                ⚠️ Fullscreen diperlukan untuk keamanan ujian
              </AlertDescription>
            </Alert>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBackButton}
            className="text-white border-white hover:bg-white hover:text-red-600"
          >
            <Home className="w-4 h-4 mr-1" />
            Keluar (Admin)
          </Button>
        </div>
      </div>

      {/* Exam Content */}
      <div className="flex-1 h-[calc(100vh-52px)]">
        <iframe
          src={currentExam.url}
          className="w-full h-full border-0"
          title="Exam Content"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onContextMenu={(e) => e.preventDefault()}
          style={{ pointerEvents: 'auto' }}
        />
      </div>

      {/* Invisible overlay to prevent clicks outside iframe in certain areas */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <AdminPasswordDialog
          onConfirm={handleExitExam}
          onCancel={() => setShowExitDialog(false)}
        />
      )}
    </div>
  );
};

export default ExamBrowser;
