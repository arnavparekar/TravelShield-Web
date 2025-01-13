// import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   FacebookAuthProvider,
//   GithubAuthProvider
// } from 'firebase/auth';
// import './SignIn.css';

// function SignIn() {
//   const [isSignIn, setIsSignIn] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [error, setError] = useState('');
//   const [isAnimating, setIsAnimating] = useState(false);
  
//   const history = useHistory();
//   const auth = getAuth();

//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       history.push('/');
//     } catch (error) {
//       setError('Invalid email or password. Please try again.');
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       history.push('/');
//     } catch (error) {
//       setError('Registration failed. Please try again.');
//     }
//   };

//   const toggleMode = () => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       setIsSignIn(!isSignIn);
//       setIsAnimating(false);
//     }, 750); // Half of the transition duration
//   };

//   const handleSocialSignIn = async (provider) => {
//     try {
//       const socialProvider = 
//         provider === 'google' ? new GoogleAuthProvider() :
//         provider === 'facebook' ? new FacebookAuthProvider() :
//         provider === 'github' ? new GithubAuthProvider() : null;
      
//       if (socialProvider) {
//         await signInWithPopup(auth, socialProvider);
//         history.push('/');
//       }
//     } catch (error) {
//       setError('Social sign-in failed. Please try again.');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className={`auth-card ${isAnimating ? 'animating' : ''}`}>
//         <div className={`auth-content ${isSignIn ? 'sign-in-mode' : 'sign-up-mode'}`}>
//           <div className="auth-form-container">
//             <h1>{isSignIn ? "Sign In" : "Create Account"}</h1>

//             <p className="divider">Use your email password</p>

//             <form onSubmit={isSignIn ? handleSignIn : handleRegister}>
//               {!isSignIn && (
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               )}
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
              
//               {isSignIn && (
//                 <a href="#" className="forgot-password">
//                   Forget Your Password?
//                 </a>
//               )}
              
//               {error && <p className="error-message">{error}</p>}
              
//               <button type="submit" className="submit-btn">
//                 {isSignIn ? "SIGN IN" : "SIGN UP"}
//               </button>
//             </form>
//           </div>

//           <div className="auth-welcome">
//             <h2>Welcome to TravelShield!</h2>
//             <p>
//               {isSignIn 
//                 ? "Don't have an account, create one by clicking below"
//                 : "Already have an account, sign in by clicking below"}
//             </p>
//             <button 
//               className="switch-btn"
//               onClick={toggleMode}
//             >
//               {isSignIn ? "SIGN UP" : "SIGN IN"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignIn;

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import './SignIn.css';

function SignIn() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const history = useHistory();
  const auth = getAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      history.push('/');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      history.push('/');
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      const socialProvider = 
        provider === 'google' ? new GoogleAuthProvider() :
        provider === 'facebook' ? new FacebookAuthProvider() :
        provider === 'github' ? new GithubAuthProvider() : null;

      if (socialProvider) {
        await signInWithPopup(auth, socialProvider);
        history.push('/');
      }
    } catch (error) {
      setError('Social sign-in failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${!isSignIn ? 'active' : ''}`}>
        <div className="form-container sign-in">
          <div className="auth-form-container">
            <div className="form-header">
              <h1>Sign In</h1>
              <p className="divider">Use your email password</p>
            </div>
            <form onSubmit={handleSignIn}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a href="#" className="forgot-password">
                Forgot Your Password?
              </a>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-btn">
                SIGN IN
              </button>
            </form>
          </div>
        </div>

        <div className="form-container sign-up">
          <div className="auth-form-container">
            <div className="form-header">
              <h1>Create Account</h1>
              <p className="divider">Use your email password</p>
            </div>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-btn">
                SIGN UP
              </button>
            </form>
          </div>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h2>Welcome Back!</h2>
              <p>Already have an account, sign in by clicking below</p>
              <button 
                className="switch-btn"
                onClick={() => setIsSignIn(true)}
              >
                SIGN IN
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h2>Welcome to TravelShield!</h2>
              <p>Don't have an account, create one by clicking below</p>
              <button 
                className="switch-btn"
                onClick={() => setIsSignIn(false)}
              >
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;