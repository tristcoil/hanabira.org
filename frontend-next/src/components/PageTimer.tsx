'use client';


import React from 'react';
import { useEffect, useState } from 'react';

const PageTimer = () => {
  const [seconds, setSeconds] = useState(0); // Total time on the page
  const [todaySeconds, setTodaySeconds] = useState(0); // Time spent on the page today
  const [active, setActive] = useState(true); // Track whether the page is active

  // Helper function to get today's date in "YYYY-MM-DD" format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Load initial times from local storage if they exist
  useEffect(() => {
    const storedTotalTime = localStorage.getItem('pageTime');
    if (storedTotalTime) {
      setSeconds(parseInt(storedTotalTime, 10));
    }

    const storedTodayTime = localStorage.getItem('pageTimeToday');
    const storedDate = localStorage.getItem('pageTimeDate');

    const todayDate = getTodayDate();
    if (storedTodayTime && storedDate === todayDate) {
      setTodaySeconds(parseInt(storedTodayTime, 10));
    } else {
      localStorage.setItem('pageTimeToday', '0');
      localStorage.setItem('pageTimeDate', todayDate);
    }
  }, []);

  // Effect to handle timing and updating local storage
  useEffect(() => {
    let interval;

    if (active) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const updatedTotalTime = prevSeconds + 1;
          localStorage.setItem('pageTime', updatedTotalTime.toString());
          return updatedTotalTime;
        });

        setTodaySeconds((prevTodaySeconds) => {
          const updatedTodayTime = prevTodaySeconds + 1;
          localStorage.setItem('pageTimeToday', updatedTodayTime.toString());
          return updatedTodayTime;
        });
      }, 1000);
    }

    // Event listeners to detect when user switches tabs, windows, or applications
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setActive(false);
      } else {
        setActive(true);
      }
    };

    const handleWindowBlur = () => {
      setActive(false);
    };

    const handleWindowFocus = () => {
      setActive(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    // Cleanup interval and event listeners on component unmount
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [active]);

  const formatTotalTime = (totalSeconds) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  const formatTodayTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${minutes}m ${secs}s`;
  };

return (
    <div>
        <div className="border-t border-gray-200 py-4">
          <p className="text-xs text-gray-600">
            <span className="font-bold text-gray-800">All Time:</span> {formatTotalTime(seconds)}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            <span className="font-bold text-gray-800">Today:</span> {formatTodayTime(todaySeconds)}
          </p>
      </div>
    </div>
  );
};

export default PageTimer;