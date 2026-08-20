import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { ShieldAlert, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

export const ExamIntegrityEventType = {
  RIGHT_CLICK_ATTEMPT: "RIGHT_CLICK_ATTEMPT",
  COPY_ATTEMPT: "COPY_ATTEMPT",
  CUT_ATTEMPT: "CUT_ATTEMPT",
  PASTE_ATTEMPT: "PASTE_ATTEMPT",
  PRINT_ATTEMPT: "PRINT_ATTEMPT",
  DEVTOOLS_ATTEMPT: "DEVTOOLS_ATTEMPT",
  TAB_SWITCH: "TAB_SWITCH",
  TAB_RETURN: "TAB_RETURN",
  FOCUS_LOST: "FOCUS_LOST",
  FOCUS_REGAINED: "FOCUS_REGAINED",
  FULLSCREEN_EXIT: "FULLSCREEN_EXIT",
  FULLSCREEN_ENTER: "FULLSCREEN_ENTER",
  KEYBOARD_VIOLATION: "KEYBOARD_VIOLATION",
  DRAG_ATTEMPT: "DRAG_ATTEMPT",
  EXTERNAL_DROP_ATTEMPT: "EXTERNAL_DROP_ATTEMPT",
  NAVIGATION_ATTEMPT: "NAVIGATION_ATTEMPT"
};

const BATCH_FLUSH_INTERVAL = 10000; // Flush every 10 seconds

export default function ExamShield({ 
  children, 
  isActive, 
  attemptId, 
  quizId,
  config = {}, 
  onEventsFlushed,
  currentQuestionId 
}) {
  const [isSecureModeEntered, setIsSecureModeEntered] = useState(!isActive);
  const [violationCount, setViolationCount] = useState(0);
  const eventQueue = useRef([]);
  const lastTabSwitch = useRef(null);
  const flushTimer = useRef(null);

  // Configuration defaults
  const settings = {
    fullscreenRequired: config.fullscreenRequired !== false,
    tabMonitoring: config.tabMonitoring !== false,
    copyPasteProtection: config.copyPasteProtection !== false,
    keyboardProtection: config.keyboardProtection !== false,
    navigationProtection: config.navigationProtection !== false,
    warningPolicy: config.warningPolicy || 'FLAG_FOR_REVIEW',
    ...config
  };

  const queueEvent = useCallback((eventType, metadata = {}, severity = 'INFO') => {
    if (!isActive || !isSecureModeEntered) return;
    
    eventQueue.current.push({
      event_type: eventType,
      occurred_at: new Date().toISOString(),
      question_id: currentQuestionId || null,
      metadata_json: JSON.stringify(metadata),
      severity
    });

    if (severity === 'WARNING' || severity === 'CRITICAL') {
      setViolationCount(prev => prev + 1);
    }
  }, [isActive, isSecureModeEntered, currentQuestionId]);

  const flushEvents = useCallback(async () => {
    if (eventQueue.current.length === 0 || !attemptId) return;
    
    const eventsToSend = [...eventQueue.current];
    eventQueue.current = []; // Clear queue immediately
    
    try {
      await api.submitIntegrityEvents(attemptId, eventsToSend);
      if (onEventsFlushed) onEventsFlushed(eventsToSend.length);
    } catch (error) {
      console.error('Failed to flush integrity events, restoring to queue');
      // Put them back at the beginning of the queue
      eventQueue.current = [...eventsToSend, ...eventQueue.current];
    }
  }, [attemptId, onEventsFlushed]);

  useEffect(() => {
    if (!isActive || !isSecureModeEntered) return;

    flushTimer.current = setInterval(flushEvents, BATCH_FLUSH_INTERVAL);
    return () => {
      clearInterval(flushTimer.current);
      flushEvents(); // Flush on unmount
    };
  }, [isActive, isSecureModeEntered, flushEvents]);

  // Warning System
  const showWarning = useCallback((title, message) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex flex-col ring-1 ring-black/5 overflow-hidden`}>
        <div className="bg-red-500 p-4 text-white font-bold flex items-center gap-3">
          <ShieldAlert className="w-6 h-6" />
          {title}
        </div>
        <div className="p-4 text-slate-700">
          {message}
        </div>
      </div>
    ), { duration: 5000 });
  }, []);

  // --- Event Listeners ---

  useEffect(() => {
    if (!isActive || !isSecureModeEntered) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      queueEvent(ExamIntegrityEventType.RIGHT_CLICK_ATTEMPT, {}, 'WARNING');
    };

    const handleCopy = (e) => {
      if (settings.copyPasteProtection) {
        e.preventDefault();
        queueEvent(ExamIntegrityEventType.COPY_ATTEMPT, {}, 'WARNING');
        showWarning("Action Blocked", "Copying content is disabled during this assessment.");
      }
    };

    const handleCut = (e) => {
      if (settings.copyPasteProtection) {
        e.preventDefault();
        queueEvent(ExamIntegrityEventType.CUT_ATTEMPT, {}, 'WARNING');
      }
    };

    const handlePaste = (e) => {
      if (settings.copyPasteProtection) {
        // We only prevent paste on specific inputs if needed, or globally.
        // For now, let's just log it unless it's a strict assessment.
        queueEvent(ExamIntegrityEventType.PASTE_ATTEMPT, {}, 'WARNING');
      }
    };

    const handleDragStart = (e) => {
      e.preventDefault();
      queueEvent(ExamIntegrityEventType.DRAG_ATTEMPT, {}, 'WARNING');
    };

    const handleDrop = (e) => {
      e.preventDefault();
      queueEvent(ExamIntegrityEventType.EXTERNAL_DROP_ATTEMPT, {}, 'WARNING');
    };

    const handleKeyDown = (e) => {
      if (!settings.keyboardProtection) return;

      // Print (Ctrl+P)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        queueEvent(ExamIntegrityEventType.PRINT_ATTEMPT, {}, 'CRITICAL');
        showWarning("Action Blocked", "Printing is disabled during this assessment.");
      }
      
      // Save (Ctrl+S)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        queueEvent(ExamIntegrityEventType.KEYBOARD_VIOLATION, { key: 'Ctrl+S' }, 'WARNING');
      }

      // DevTools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key))
      ) {
        // e.preventDefault(); // Might not always work for DevTools
        queueEvent(ExamIntegrityEventType.DEVTOOLS_ATTEMPT, { key: e.key }, 'CRITICAL');
        showWarning("Security Alert", "Developer tools usage is recorded.");
      }
    };

    // Prevent selection via CSS is done by wrapping in a class, but we can also prevent default on selectstart
    const handleSelectStart = (e) => {
      // Allow selection in inputs
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        // e.preventDefault(); // Can be too aggressive, relying on CSS user-select: none instead
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [isActive, isSecureModeEntered, queueEvent, settings, showWarning]);

  // Tab & Window Visibility Monitoring
  useEffect(() => {
    if (!isActive || !isSecureModeEntered || !settings.tabMonitoring) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastTabSwitch.current = Date.now();
        queueEvent(ExamIntegrityEventType.TAB_SWITCH, {}, 'WARNING');
        document.title = "⚠️ Return to Exam!";
      } else {
        const duration = lastTabSwitch.current ? Math.floor((Date.now() - lastTabSwitch.current) / 1000) : 0;
        queueEvent(ExamIntegrityEventType.TAB_RETURN, { duration_away_seconds: duration }, 'INFO');
        document.title = "Quizora Assessment";
        showWarning(
          "Assessment Window Left", 
          "You left the secure examination environment. This activity has been recorded."
        );
      }
    };

    const handleBlur = () => {
      queueEvent(ExamIntegrityEventType.FOCUS_LOST, {}, 'INFO');
    };

    const handleFocus = () => {
      queueEvent(ExamIntegrityEventType.FOCUS_REGAINED, {}, 'INFO');
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isActive, isSecureModeEntered, queueEvent, settings.tabMonitoring, showWarning]);

  // Fullscreen Monitoring
  useEffect(() => {
    if (!isActive || !isSecureModeEntered || !settings.fullscreenRequired) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        queueEvent(ExamIntegrityEventType.FULLSCREEN_EXIT, {}, 'WARNING');
        showWarning("Secure Mode Interrupted", "You have exited fullscreen. Please return to fullscreen immediately.");
      } else {
        queueEvent(ExamIntegrityEventType.FULLSCREEN_ENTER, {}, 'INFO');
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isActive, isSecureModeEntered, queueEvent, settings.fullscreenRequired, showWarning]);

  // Navigation Protection
  useEffect(() => {
    if (!isActive || !isSecureModeEntered || !settings.navigationProtection) return;

    const handleBeforeUnload = (e) => {
      queueEvent(ExamIntegrityEventType.NAVIGATION_ATTEMPT, {}, 'WARNING');
      flushEvents(); // Try to flush before leaving
      e.preventDefault();
      e.returnValue = 'Your assessment is currently in progress. Leaving this page may be recorded as an integrity event.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isActive, isSecureModeEntered, queueEvent, settings.navigationProtection, flushEvents]);


  const requestFullscreenAndEnter = async () => {
    if (settings.fullscreenRequired) {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error("Fullscreen request failed", err);
        // Fallback gracefully
      }
    }
    setIsSecureModeEntered(true);
  };

  if (isActive && !isSecureModeEntered) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white max-w-xl w-full rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-amber-500"></div>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-10 h-10" />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-4">Secure Assessment Mode</h2>
          
          <div className="text-slate-600 space-y-4 mb-8">
            <p>This assessment uses <strong>ExamShield™</strong> to maintain academic integrity. During the assessment:</p>
            <ul className="space-y-2 font-medium text-slate-700 bg-slate-50 p-6 rounded-2xl">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Remain in the examination window</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Avoid switching tabs or applications</li>
              {settings.fullscreenRequired && <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Keep fullscreen enabled</li>}
              {settings.copyPasteProtection && <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Copy/paste is restricted</li>}
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Suspicious activity will be recorded</li>
            </ul>
          </div>

          <button
            onClick={requestFullscreenAndEnter}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            {settings.fullscreenRequired && <Maximize className="w-5 h-5" />}
            Enter Secure Mode
          </button>
        </motion.div>
      </div>
    );
  }

  // Wrapper for the children applying non-select styles if needed
  return (
    <div className={`exam-shield-wrapper ${isActive && isSecureModeEntered ? 'select-none print:hidden' : ''} min-h-screen flex flex-col w-full`}>
      {/* Integrity Monitor Badge */}
      {isActive && isSecureModeEntered && (
        <div className="fixed bottom-4 left-4 z-[999] pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3 border border-slate-700/50">
            <div className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${violationCount > 0 ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${violationCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </div>
            <span className="text-sm font-semibold tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-400" /> ExamShield
              {violationCount > 0 && <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md ml-1">{violationCount}</span>}
            </span>
          </div>
        </div>
      )}
      
      {/* Print protection overlay (visible only on print) */}
      <div className="hidden print:flex fixed inset-0 bg-white z-[9999] items-center justify-center text-3xl font-bold text-red-500">
        PRINTING IS DISABLED FOR THIS ASSESSMENT
      </div>
      
      {children}
    </div>
  );
}
