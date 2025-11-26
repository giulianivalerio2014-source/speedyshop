
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IntroAnimationProps {
  username: string;
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ username, onComplete }) => {
  const [text, setText] = useState('INITIALIZING HANDSHAKE...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Sequence of "Hacking" messages
    const steps = [
      { t: 'CONNECTING TO BRAINROT SERVER...', delay: 500 },
      { t: 'BYPASSING ADMIN FIREWALL...', delay: 1200 },
      { t: 'STEALING CREDENTIALS...', delay: 2000 },
      { t: `WELCOME OP: ${username.toUpperCase()}`, delay: 2800 },
    ];

    steps.forEach(({ t, delay }) => {
      setTimeout(() => setText(t), delay);
    });

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    // End animation
    const endTimeout = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(endTimeout);
    };
  }, [username, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center font-mono p-8 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
      transition={{ duration: 0.5 }}
    >
      {/* Matrix/CRT Lines Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
      
      <div className="relative z-20 w-full max-w-2xl text-green-500">
        <motion.div
          key={text}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-4xl font-bold mb-8 glitch-text tracking-wider"
        >
          {text}
        </motion.div>

        {/* Fake Code Scrolling */}
        <div className="h-32 overflow-hidden text-xs text-green-800 opacity-50 mb-8 font-mono leading-tight">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>{`0x${Math.random().toString(16).slice(2)} // INJECTING PAYLOAD...`}</div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-green-900/30 rounded-full overflow-hidden border border-green-500/30">
          <motion.div 
            className="h-full bg-green-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-green-400">
          <span>ENCRYPTION: 2048-BIT</span>
          <span>{Math.min(100, Math.floor(progress))}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default IntroAnimation;
