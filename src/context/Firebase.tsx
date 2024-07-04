import React, { createContext, ReactNode, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,GoogleAuthProvider, signInWithPopup  } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDA8HAyGsfcRIRFP37a4CeMwhN5NLQeYIU",
  authDomain: "hrmanagament-b6c14.firebaseapp.com",
  projectId: "hrmanagament-b6c14",
  storageBucket: "hrmanagament-b6c14.appspot.com",
  messagingSenderId: "55444164972",
  appId: "1:55444164972:web:b515c28b1c1b65c044e349",
  databaseURL: "https://hrmanagament-b6c14-default-rtdb.firebaseio.com"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

interface FirebaseContextType {
  signupUserWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signinUserWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;

  putData: (key: string, data: any) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const signupUserWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };
  const signinUserWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(firebaseAuth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const putData = async (key: string, data: any) => {
    try {
      await set(ref(database, key), data);
    } catch (error) {
      console.error('Error putting data:', error);
      throw error;
    }
  };

  return (
    <FirebaseContext.Provider value={{ signupUserWithEmailAndPassword, signinUserWithEmailAndPassword, signInWithGoogle,putData }}>
      {children}
    </FirebaseContext.Provider>
  );
};
