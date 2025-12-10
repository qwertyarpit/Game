'use client'
import { login } from './actions'
import { useActionState } from 'react' 

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  const buttonText = isPending ? 'Wait...' : 'Start';

  return (
    <div className="login-container">
      {/* --- STYLES --- */}
      <style jsx global>{`
        body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        
        .login-container {
          display: flex;
          height: 100vh;
          align-items: center;
          justify-content: center;
          background-image: url('/login-bg.png'); 
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 0;
        }

        .login-card {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 25px;
          background: rgba(30, 30, 30, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 50px 40px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          width: 100%;
          max-width: 350px;
          align-items: center; /* Centers the button */
        }

        .login-title {
          margin: 0;
          text-align: center;
          color: white;
          font-size: 28px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          width: 100%;
        }

        .input-field {
          width: 100%;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.3);
          color: white;
          font-size: 16px;
          outline: none;
          transition: 0.3s;
          box-sizing: border-box; /* Ensures padding doesn't break layout */
        }
        .input-field:focus {
          border-color: #03a9f4; /* Matches new button blue */
          background: rgba(0, 0, 0, 0.5);
        }

        /* --- 3D CUBE BUTTON STYLES (From your snippet) --- */
        .cube-btn {
          position: relative;
          width: 150px;
          height: 50px;
          transition: 1s; /* Speed up slightly for UI responsiveness */
          transform-style: preserve-3d;
          transform: perspective(1000px) rotateX(0deg);
          background: none;
          border: none;
          cursor: pointer;
          margin-top: 10px;
        }

        .cube-btn:hover {
          transform: perspective(1000px) rotateX(360deg);
        }

        .cube-btn span {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          background: rgba(255, 255, 255, 0.9);
          font-family: sans-serif;
          text-transform: uppercase;
          font-size: 18px; /* Slightly smaller to fit "Start" */
          letter-spacing: 2px;
          transition: 0.5s;
          border: 2px solid #000;
          box-sizing: border-box;
          /* box-shadow: insert 0 20px 50px rgba(0, 0, 0, 0.2); */ 
          /* Note: 'insert' isn't valid, assuming 'inset' */
          box-shadow: inset 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .cube-btn:hover span {
          color: #fff;
          background: rgba(3, 169, 244, 0.8);
          border-color: #fff;
        }

        /* The 4 Faces of the Cube */
        .cube-btn span:nth-child(1) {
          transform: rotateX(360deg) translateZ(25px);
        }
        .cube-btn span:nth-child(2) {
          transform: rotateX(270deg) translateZ(25px);
        }
        .cube-btn span:nth-child(3) {
          transform: rotateX(180deg) translateZ(25px);
        }
        .cube-btn span:nth-child(4) {
          transform: rotateX(90deg) translateZ(25px);
        }

        .error-msg {
          color: #ff6b6b;
          text-align: center;
          margin: 0;
          font-size: 14px;
          background: rgba(255,0,0,0.1);
          padding: 5px;
          border-radius: 4px;
        }
      `}</style>

      <div className="overlay"></div>

      <form action={formAction} className="login-card">
         <h1 className="login-title"><span style={{color: "red"}}>B</span>alance <span style={{color: "red"}}>B</span>all</h1>
        
        <input 
          name="username" 
          className="input-field" 
          placeholder="Username" 
          required 
          autoComplete="off"
        />
        
        <input 
          name="password" 
          type="password" 
          className="input-field" 
          placeholder="Password" 
          required 
        />
        
        {/* --- 3D CUBE BUTTON --- */}
        <button className="cube-btn" type="submit" disabled={isPending}>
            {/* We duplicate the text 4 times to create the 4 sides of the rolling cube */}
            <span>{buttonText}</span>
            <span>{buttonText}</span>
            <span>{buttonText}</span>
            <span>{buttonText}</span>
        </button>

        {state?.error && <p className="error-msg">⚠️ {state.error}</p>}
      </form>
    </div>
  )
}