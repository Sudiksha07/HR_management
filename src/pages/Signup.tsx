// import React, { useState } from 'react';
// import { useFirebase } from '../context/Firebase';
// import { Link, useNavigate } from 'react-router-dom';
// import google from "../images/google.jpg"
import '../pages/Signup.css';

// const Signup: React.FC = () => {
//   const firebase = useFirebase();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     try {
//       await firebase.signupUserWithEmailAndPassword(email, password);
//             //   firebase.putData("users/"+ "sudiksha",{email,password})
//       navigate('/Signin');
//     } catch (error) {
//       setError((error as Error).message);
//       alert(error)
//     }
//   };
//   const handleGoogleSignIn = async () => {
//     try {
//       await firebase.signInWithGoogle();
//       navigate('/dashboard'); // Adjust this path as needed
//     } catch (error) {
//       setError((error as Error).message);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <form className="signup-form" >
//         <h2>Sign Up</h2>
        
//         <label htmlFor="email">Email</label>
//         <input
//           type="email"
//           id="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
        
//         <label htmlFor="password">Password</label>
//         <input
//           type="password"
//           id="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
        
//         <button onClick ={handleSubmit}type="submit">Sign Up</button>

//         <h3>or</h3>
//         {/* <button onClick={handleGoogleSignIn} className="google-signin-button">
//         <img src={google} alt="Google logo" className="google-logo" />   Sign in with Google  </button> */}
        
//         {/* {error && <p className="error-message">{error}</p>} */}
        
//         <p>Already have an account? <Link to="/Signin">Sign In</Link></p>
//       </form>
//     </div>
//   );
// };

// export default Signup;
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../context/Firebase';
 import { Link, useNavigate } from 'react-router-dom';
// import '../pages/signup.css';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate('/Signin');
      console.log('User signed up and data saved');
    } catch (error) {
      console.error('Error signing up: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;

