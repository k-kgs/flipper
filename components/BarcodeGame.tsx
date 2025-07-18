// import React, { useState, useRef, useCallback, useEffect } from "react";
// import { Scanner } from "@yudiel/react-qr-scanner";

// const SCAN_THRESHOLD = 10;
// const WARNING_DURATION = 5000; // ms
// const FLASH_DURATION = 4000;   // ms
// const LOCK_DURATION = 1000;    // ms

// const getRandomColor = () =>
//   `rgba(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},0.45)`;

// const FrameOverlay = () => (
//   <div style={{
//     position: "absolute",
//     left: "50%",
//     top: "50%",
//     width: 220,
//     height: 220,
//     transform: "translate(-50%, -50%)",
//     border: "6px solid #00eaff",
//     borderRadius: 24,
//     boxShadow: "0 0 24px 4px #00eaff88",
//     pointerEvents: "none",
//     zIndex: 2,
//   }} />
// );

// const BarcodeGame: React.FC = () => {
//   const [scanCount, setScanCount] = useState(0);
//   const [scannedCodes, setScannedCodes] = useState<Set<string>>(new Set());
//   const [message, setMessage] = useState<string | null>(null);
//   const [showWarning, setShowWarning] = useState(false);
//   const [showFlash, setShowFlash] = useState<null | string>(null); // color string
//   const [gameActive, setGameActive] = useState(false);
//   const [lock, setLock] = useState(false);

//   // Timer refs for cleanup
//   const warningTimeout = useRef<NodeJS.Timeout | null>(null);
//   const flashTimeout = useRef<NodeJS.Timeout | null>(null);
//   const lockTimeout = useRef<NodeJS.Timeout | null>(null);

//   // Clean up timers on unmount
//   useEffect(() => {
//     return () => {
//       if (warningTimeout.current) clearTimeout(warningTimeout.current);
//       if (flashTimeout.current) clearTimeout(flashTimeout.current);
//       if (lockTimeout.current) clearTimeout(lockTimeout.current);
//     };
//   }, []);

//   const handleDecode = useCallback((code: string) => {
//     if (!gameActive || lock) return;

//     if (scannedCodes.has(code)) {
//       setMessage("⚠️ This card was already scanned!");
//       setShowWarning(true);
//       setShowFlash(getRandomColor());
//       setLock(true);
//       try { new window.Audio("/duplicate.mp3").play(); } catch {}

//       if (warningTimeout.current) clearTimeout(warningTimeout.current);
//       warningTimeout.current = setTimeout(() => {
//         setShowWarning(false);
//         setMessage(null);
//       }, WARNING_DURATION);

//       if (flashTimeout.current) clearTimeout(flashTimeout.current);
//       flashTimeout.current = setTimeout(() => {
//         setShowFlash(null);
//       }, FLASH_DURATION);

//       if (lockTimeout.current) clearTimeout(lockTimeout.current);
//       lockTimeout.current = setTimeout(() => {
//         setLock(false);
//       }, WARNING_DURATION);

//     } else {
//       setScannedCodes(prev => {
//         const next = new Set(prev);
//         next.add(code);
//         return next;
//       });
//       setScanCount(prev => prev + 1);
//       setShowFlash(getRandomColor());
//       setMessage("✅ Card scanned!");
//       setLock(true);
//       try { new window.Audio("/beep.mp3").play(); } catch {}

//       if (warningTimeout.current) clearTimeout(warningTimeout.current);
//       warningTimeout.current = setTimeout(() => {
//         setMessage(null);
//       }, 1000);

//       if (flashTimeout.current) clearTimeout(flashTimeout.current);
//       flashTimeout.current = setTimeout(() => {
//         setShowFlash(null);
//       }, FLASH_DURATION);

//       if (lockTimeout.current) clearTimeout(lockTimeout.current);
//       lockTimeout.current = setTimeout(() => {
//         setLock(false);
//       }, LOCK_DURATION);
//     }
//   }, [gameActive, lock, scannedCodes]);

//   // Start and end game handlers
//   const startGame = () => {
//     setGameActive(true);
//     setScanCount(0);
//     setScannedCodes(new Set());
//     setMessage(null);
//     setShowWarning(false);
//     setShowFlash(null);
//     setLock(false);
//     if (warningTimeout.current) clearTimeout(warningTimeout.current);
//     if (flashTimeout.current) clearTimeout(flashTimeout.current);
//     if (lockTimeout.current) clearTimeout(lockTimeout.current);
//   };

//   const endGame = () => {
//     setGameActive(false);
//     setMessage("Game ended.");
//     setShowWarning(false);
//     setShowFlash(null);
//     setLock(false);
//     if (warningTimeout.current) clearTimeout(warningTimeout.current);
//     if (flashTimeout.current) clearTimeout(flashTimeout.current);
//     if (lockTimeout.current) clearTimeout(lockTimeout.current);
//   };

//   // End game when threshold is reached
//   useEffect(() => {
//     if (gameActive && scanCount >= SCAN_THRESHOLD) {
//       setGameActive(false);
//       setMessage("🎉 Game Over! Threshold reached.");
//     }
//   }, [gameActive, scanCount]);

//   return (
//     <div style={{ position: "relative", width: "100vw", minHeight: "100vh", background: "#181A20", fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
//       {/* Controls and Info */}
//       <div style={{ position: "absolute", top: 0, width: "100vw", zIndex: 10000, padding: "24px 0 0 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
//         <h1 style={{ color: "#fff", fontWeight: 700, fontSize: "1.6rem", marginBottom: 12, letterSpacing: 1 }}>QR Game</h1>
//         <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
//           <button onClick={startGame} disabled={gameActive} style={{
//             background: gameActive ? "#aaa" : "linear-gradient(90deg,#00c6ff,#0072ff)",
//             color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px",
//             fontSize: "1.1rem", fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//             transition: "background 0.3s", opacity: gameActive ? 0.7 : 1
//           }}>Start Game</button>
//           <button onClick={endGame} disabled={!gameActive} style={{
//             background: !gameActive ? "#aaa" : "linear-gradient(90deg,#ff512f,#dd2476)",
//             color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px",
//             fontSize: "1.1rem", fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//             transition: "background 0.3s", opacity: !gameActive ? 0.7 : 1
//           }}>End Game</button>
//         </div>
//         <div style={{
//           color: "#fff", fontSize: "1.1rem", background: "#222", padding: "6px 18px",
//           borderRadius: 8, marginBottom: 8, letterSpacing: 0.5, fontWeight: 500
//         }}>Scanned Cards: {scanCount} / {SCAN_THRESHOLD}</div>
//         {message && !showWarning && (<div style={{
//           color: "#fff", background: "#444", padding: "8px 16px", borderRadius: 8,
//           marginTop: 6, fontWeight: 600, fontSize: "1.1rem", minHeight: 36
//         }}>{message}</div>)}
//       </div>
//       {/* Scanner and overlay */}
//       <div style={{
//         width: "100vw", height: "100vh", display: "flex",
//         alignItems: "center", justifyContent: "center", position: "relative"
//       }}>
//         {gameActive && (
//           <div style={{
//             width: "100vw", maxWidth: 440, height: "70vw", maxHeight: 400,
//             borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
//             background: "#111", margin: "0 auto", position: "relative"
//           }}>
//             <Scanner
//               onScan={(detectedCodes) => {
//                 if (detectedCodes && detectedCodes.length > 0 && detectedCodes[0].rawValue) {
//                   handleDecode(detectedCodes[0].rawValue);
//                 }
//               }}
//               constraints={{ facingMode: "user"}} 
//             />
//             <FrameOverlay />
//           </div>
//         )}
//       </div>
//       {/* Fullscreen color flash overlay with random color */}
//       {showFlash && (
//         <div style={{
//           position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
//           background: showFlash,
//           zIndex: 20000, pointerEvents: "none",
//           animation: "flash-fade 1s"
//         }} />
//       )}
//       <style>{`
//         @keyframes flash-fade {
//           from { opacity: 1; }
//           to { opacity: 0; }
//         }
//         @keyframes glow-warning {
//           0% { background: rgba(255,0,128,0.45);}
//           50% { background: rgba(255,0,128,0.70);}
//           100% { background: rgba(255,0,128,0.45);}
//         }
//         @keyframes rainbow {
//           0% { background-position: 0% 50%; }
//           100% { background-position: 100% 50%; }
//         }
//       `}</style>
//       {/* Animated warning overlay for duplicate */}
//       {showWarning && (
//         <div style={{
//           position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
//           background: "rgba(255,0,128,0.45)",
//           zIndex: 30000,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           pointerEvents: "none",
//           animation: "glow-warning 2s infinite alternate"
//         }}>
//           <div style={{
//             fontSize: "2.6rem", fontWeight: 900, padding: "36px 48px", borderRadius: "32px",
//             border: "6px solid #fff", boxShadow: "0 0 36px 12px #ff00cc88", background: "#222",
//             textAlign: "center", textTransform: "uppercase", letterSpacing: 2,
//             backgroundImage: "linear-gradient(90deg, #ff0055, #ffea00, #00ffea, #ff0055)",
//             backgroundSize: "400% 100%", WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent", animation: "rainbow 2s linear infinite"
//           }}>
//             ⚠️ This card was already scanned!
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BarcodeGame;












// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { Scanner } from "@yudiel/react-qr-scanner";

// const LOCK_DURATION = 10000; // 10 seconds
// const FLASH_DURATION = 1000; // 1 second

// const getRandomColor = () =>
//   `rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},0.55)`;

// const BarcodeGame: React.FC = () => {
//   const [lock, setLock] = useState(false);
//   const [lockCountdown, setLockCountdown] = useState(0);
//   const [flash, setFlash] = useState<null | string>(null);
//   const [scannerKey, setScannerKey] = useState(0);
//   const lockTimeout = useRef<NodeJS.Timeout | null>(null);
//   const flashTimeout = useRef<NodeJS.Timeout | null>(null);
//   const countdownInterval = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     return () => {
//       if (lockTimeout.current) clearTimeout(lockTimeout.current);
//       if (flashTimeout.current) clearTimeout(flashTimeout.current);
//       if (countdownInterval.current) clearInterval(countdownInterval.current);
//     };
//   }, []);

//   const handleDecode = useCallback((code: string) => {
//     if (lock) return;

//     // FLASH
//     setFlash(getRandomColor());
//     if (flashTimeout.current) clearTimeout(flashTimeout.current);
//     flashTimeout.current = setTimeout(() => setFlash(null), FLASH_DURATION);

//     // LOCK
//     setLock(true);
//     setLockCountdown(10);
//     if (lockTimeout.current) clearTimeout(lockTimeout.current);
//     lockTimeout.current = setTimeout(() => {
//       setLock(false);
//       setLockCountdown(0);
//     }, LOCK_DURATION);

//     // COUNTDOWN
//     if (countdownInterval.current) clearInterval(countdownInterval.current);
//     countdownInterval.current = setInterval(() => {
//       setLockCountdown(prev => {
//         if (prev <= 1) {
//           clearInterval(countdownInterval.current!);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     // Reset Scanner
//     setScannerKey(k => k + 1);
//   }, [lock]);

//   return (
//     <div style={{
//       width: "100vw", height: "100vh",
//       background: "#111", overflow: "hidden", position: "relative"
//     }}>
//       <div style={{
//         position: "absolute", top: 24, width: "100vw", zIndex: 10000,
//         display: "flex", justifyContent: "center"
//       }}>
//         {lock && (
//           <div style={{
//             padding: 12, background: "#333", color: "#ffe600", borderRadius: 16,
//             fontWeight: 700, fontSize: 24, minWidth: 170, textAlign: "center"
//           }}>
//             Wait {lockCountdown} second{lockCountdown !== 1 ? "s" : ""}...
//           </div>
//         )}
//       </div>
//       <Scanner
//         key={scannerKey}
//         onScan={codes => {
//           if (codes && codes.length > 0) handleDecode(codes[0].rawValue);
//         }}
//         constraints={{ facingMode: "user" }}
//         style={{ width: "100vw", height: "100vh" }}
//       />
//       {flash && (
//         <div style={{
//           position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
//           background: flash, zIndex: 9999, pointerEvents: "none",
//           animation: "flash-fade 1s"
//         }} />
//       )}
//       <style>
//         {`@keyframes flash-fade { from { opacity: 1; } to { opacity: 0; } }`}
//       </style>
//     </div>
//   );
// };

// export default BarcodeGame;

















// import React, { useRef, useState, useEffect } from "react";
// import { Scanner } from "@yudiel/react-qr-scanner";

// const LOCK_DURATION = 5000;

// function getRandomColor() {
//   return `rgba(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},0.65)`;
// }

// const BarcodeGame: React.FC = () => {
//   const [scanCount, setScanCount] = useState(0);
//   const [flash, setFlash] = useState<string | null>(null);
//   const [locked, setLocked] = useState(false);
//   const lockedRef = useRef(false); // KEY: sync lock for handler logic
//   const [scannerKey, setScannerKey] = useState(0);
//   const [countdown, setCountdown] = useState(0);

//   const lockTimeout = useRef<NodeJS.Timeout | null>(null);
//   const countdownInterval = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     lockedRef.current = locked; // always sync ref to state
//     // For debug:
//     console.log("RENDER:", { scanCount, locked, flash, countdown, scannerKey });
//   }, [locked, scanCount, flash, countdown, scannerKey]);

//   const handleScan = (codes: Array<{ rawValue: string }>) => {
//     console.log("SCAN_EVENT:", {
//       codes,
//       locked: lockedRef.current,
//       scanCount,
//       flash,
//       countdown,
//     });

//     if (!codes.length || lockedRef.current) return;

//     setScanCount((c) => c + 1);
//     setFlash(getRandomColor());
//     setLocked(true);
//     lockedRef.current = true; // update ref immediately for events
//     setCountdown(5);
//     setScannerKey((k) => k + 1);

//     // Lock and flash clear after 5s
//     if (lockTimeout.current) clearTimeout(lockTimeout.current);
//     lockTimeout.current = setTimeout(() => {
//       setLocked(false);
//       lockedRef.current = false;
//       setFlash(null);
//       setCountdown(0);
//       console.log("LOCK RELEASED");
//     }, LOCK_DURATION);

//     // Countdown
//     if (countdownInterval.current) clearInterval(countdownInterval.current);
//     let sec = 5;
//     countdownInterval.current = setInterval(() => {
//       sec--;
//       setCountdown(sec);
//       if (sec <= 0 && countdownInterval.current) clearInterval(countdownInterval.current);
//     }, 1000);
//   };

//   // Clean up
//   useEffect(() => {
//     return () => {
//       if (lockTimeout.current) clearTimeout(lockTimeout.current);
//       if (countdownInterval.current) clearInterval(countdownInterval.current);
//     };
//   }, []);

//   return (
//     <div style={{ width: "100vw", height: "100vh", background: "#111", position: "relative" }}>
//       <div style={{
//         position: "absolute", top: 20, left: 0, width: "100vw", zIndex: 10001,
//         display: "flex", flexDirection: "column", alignItems: "center"
//       }}>
//         <div style={{
//           fontSize: 22, fontWeight: 700, color: "#fff",
//           background: "#222", borderRadius: 12, padding: "8px 18px", marginBottom: 8
//         }}>
//           Scans: {scanCount}
//         </div>
//         {locked && (
//           <div style={{
//             fontSize: 18, fontWeight: 600, color: "#ffe600",
//             background: "#333", borderRadius: 12, padding: "8px 18px"
//           }}>
//             Please wait {countdown}s...
//           </div>
//         )}
//       </div>
//       <Scanner
//         key={scannerKey}
//         onScan={handleScan}
//         constraints={{ facingMode: "user" }}
//         styles={{ container: { width: "100vw", height: "100vh" } }}
//       />
//       {flash && (
//         <div style={{
//           position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
//           background: flash, pointerEvents: "none", zIndex: 9999,
//           transition: "opacity 0.4s"
//         }} />
//       )}
//     </div>
//   );
// };

// export default BarcodeGame;


import React, { useRef, useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const LOCK_DURATION = 5000;

function getRandomColor() {
  return `rgba(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},0.65)`;
}

const BarcodeGame: React.FC = () => {
  const [scanCount, setScanCount] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const lockedRef = useRef(false);
  const lockTimeout = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  useEffect(() => {
    return () => {
      if (lockTimeout.current) clearTimeout(lockTimeout.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, []);

  const handleScan = (codes: Array<{ rawValue: string }>) => {
    if (!codes.length || lockedRef.current) return;
    setScanCount((c) => c + 1);
    setFlash(getRandomColor());
    setLocked(true);
    lockedRef.current = true;
    setCountdown(5);
    setScannerKey((k) => k + 1);

    if (lockTimeout.current) clearTimeout(lockTimeout.current);
    lockTimeout.current = setTimeout(() => {
      setLocked(false);
      lockedRef.current = false;
      setFlash(null);
      setCountdown(0);
    }, LOCK_DURATION);

    if (countdownInterval.current) clearInterval(countdownInterval.current);
    let sec = 5;
    countdownInterval.current = setInterval(() => {
      sec--;
      setCountdown(sec);
      if (sec <= 0 && countdownInterval.current) clearInterval(countdownInterval.current);
    }, 1000);
  };

  const startGame = () => {
    setScanCount(0);
    setFlash(null);
    setLocked(false);
    lockedRef.current = false;
    setCountdown(0);
    setScannerKey(0);
    setGameActive(true);
    if (lockTimeout.current) clearTimeout(lockTimeout.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  };

  const endGame = () => {
    setGameActive(false);
    setFlash(null);
    setLocked(false);
    lockedRef.current = false;
    setCountdown(0);
    setScannerKey((k) => k + 1); // unmount scanner for sure
    if (lockTimeout.current) clearTimeout(lockTimeout.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111", position: "relative" }}>
      {/* Controls */}
      <div style={{ position: "absolute", top: 24, width: "100vw", zIndex: 10001, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          fontSize: 22, fontWeight: 700, color: "#fff",
          background: "#222", borderRadius: 12, padding: "8px 18px", marginBottom: 8
        }}>
          Scans: {scanCount}
        </div>
        {gameActive && locked && (
          <div style={{
            fontSize: 18, fontWeight: 600, color: "#ffe600",
            background: "#333", borderRadius: 12, padding: "8px 18px", marginBottom: 12
          }}>
            Please wait {countdown}s...
          </div>
        )}
        <div style={{ margin: "16px 0" }}>
          <button
            onClick={startGame}
            disabled={gameActive}
            style={{
              background: gameActive ? "#aaa" : "linear-gradient(90deg,#00c6ff,#0072ff)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 24px",
              fontSize: "1.1rem",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "background 0.3s",
              opacity: gameActive ? 0.7 : 1,
              marginRight: 8,
            }}
          >
            Start Game
          </button>
          <button
            onClick={endGame}
            disabled={!gameActive}
            style={{
              background: !gameActive ? "#aaa" : "linear-gradient(90deg,#ff512f,#dd2476)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 24px",
              fontSize: "1.1rem",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "background 0.3s",
              opacity: !gameActive ? 0.7 : 1,
            }}
          >
            End Game
          </button>
        </div>
      </div>
      {/* The QR Scanner */}
      {gameActive && (
        <Scanner
          key={scannerKey}
          onScan={handleScan}
          constraints={{ facingMode: "environment" }} // or "user"
          styles={{
            container: { width: "100vw", height: "100vh" }
          }}
        />
      )}
      {/* Full-Screen Color Flash */}
      {flash && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: flash, pointerEvents: "none", zIndex: 9999,
          transition: "opacity 0.4s"
        }} />
      )}
    </div>
  );
};

export default BarcodeGame;
