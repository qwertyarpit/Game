'use client';
import React, { useEffect } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { useRouter } from 'next/navigation';
import { logout } from '../actions'; // <--- 1. Import the logout action

export default function PlayGame() {
  const router = useRouter();

  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "/game/Build/gamevessel.loader.js",
    dataUrl: "/game/Build/gamevessel.data.unityweb",
    frameworkUrl: "/game/Build/gamevessel.framework.js.unityweb",
    codeUrl: "/game/Build/gamevessel.wasm.unityweb",
  });

  // --- SECURITY HEARTBEAT ---
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/check-status');
        if (res.status === 401) router.push('/'); 
      } catch (err) {
        console.error("Connection check failed", err);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [router]);
  // --------------------------

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#231F20', overflow: 'hidden', position: 'relative' }}>
      
      {/* --- 2. THE LOGOUT BUTTON --- */}
      <button 
        onClick={() => logout()} 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          background: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          zIndex: 100, // Ensures it sits ON TOP of the game
          fontFamily: 'sans-serif'
        }}
      >
        Logout
      </button>

      {!isLoaded && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontFamily: 'sans-serif' }}>
          Loading Game... {Math.round(loadingProgression * 100)}%
        </div>
      )}
      
      <Unity 
        unityProvider={unityProvider} 
        style={{ width: '100%', height: '100%' }} 
      />
    </div>
  );
}