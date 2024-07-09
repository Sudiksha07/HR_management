// import React, { useState } from 'react';
// import { useFirebase } from '../context/Firebase'; // Adjust the path based on your project structure
// import { Link, useNavigate } from 'react-router-dom';
// import google from "../images/google.jpg"
// import '../pages/Signin.css'; // Ensure this path is correct

// const Signin: React.FC = () => {
//   const firebase = useFirebase();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     try {
//       await firebase.signinUserWithEmailAndPassword(email, password);
//       navigate('/dashboard'); // Adjust this path as needed
//     } catch (error) {
//       setError((error as Error).message);
//       alert(error);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       await firebase.signInWithGoogle();
//     //   navigate('/dashboard'); // Adjust this path as needed
//     } catch (error) {
//       setError((error as Error).message);
//     }
//   };

//   return (
//     <div className="signin-container">
//       <form className="signin-form" >
//         <h2>Sign In</h2>
        
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
        
//         <button type="submit" onClick={handleSubmit}>Sign In</button>
        
//         <p>Don't have an account? <Link to="/">Sign Up</Link></p>
//         <h3>or</h3>
//         <button  type= "submit"onClick={handleGoogleSignIn} className="google-signin-button">
//           <img src={google} alt="Google logo" className="google-logo" /> Sign in with Google
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signin;
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Firebase';
// import '../pages/signin.css'

const Signin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signin(email, password);
      navigate("/employees")
      console.log('User signed in');
    } catch (error) {
      console.error('Error signing in: ', error);
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
      <button type="submit">Sign In</button>
    </form>
  );
};

export default Signin;

