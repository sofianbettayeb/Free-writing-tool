import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

export function Timer() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [initialTime, setInitialTime] = useState(300);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Timer finished notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Writing Session Complete!', {
          body: 'Your timed writing session has ended.',
          icon: '/favicon.ico'
        });
      } else {
        alert('Writing session complete!');
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (!isActive && timeLeft === 0) {
      // Reset timer if it had finished
      setTimeLeft(initialTime);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const setTimerDuration = (minutes: number) => {
    const seconds = minutes * 60;
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="flex items-center space-x-3">
      {isActive ? (
        // Timer running state
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm font-medium text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg" data-testid="timer-display">
            <div className="w-2 h-2 bg-stone-600 rounded-full animate-pulse"></div>
            <span className="tabular-nums">{formatTime(timeLeft)}</span>
          </div>
          
          <button
            onClick={toggleTimer}
            className="p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1"
            data-testid="button-timer-toggle"
            title="Pause timer"
            aria-label="Pause timer"
          >
            <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6M14 9v6"></path>
            </svg>
          </button>

          <button
            onClick={resetTimer}
            className="p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1"
            data-testid="button-timer-reset"
            title="Reset timer"
            aria-label="Reset timer"
          >
            <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      ) : (
        // Timer stopped state
        <div className="flex items-center space-x-2">
          <select
            onChange={(e) => setTimerDuration(parseInt(e.target.value))}
            value={initialTime / 60}
            className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            data-testid="select-timer-duration"
            aria-label="Timer duration"
          >
            <option value={5}>5 min</option>
            <option value={10}>10 min</option>
            <option value={15}>15 min</option>
            <option value={25}>25 min</option>
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>60 min</option>
          </select>

          <button
            onClick={toggleTimer}
            className="p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1"
            data-testid="button-timer-toggle"
            title="Start timer"
            aria-label="Start timer"
          >
            <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
