
// src/context/FirebaseContext.tsx
// import React, { createContext, useContext, ReactNode } from 'react';
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import { getDatabase, ref, set, update, remove } from 'firebase/database';

// const firebaseConfig = {
//   apiKey: "AIzaSyDA8HAyGsfcRIRFP37a4CeMwhN5NLQeYIU",
//   authDomain: "hrmanagament-b6c14.firebaseapp.com",
//   projectId: "hrmanagament-b6c14",
//   storageBucket: "hrmanagament-b6c14.appspot.com",
//   messagingSenderId: "55444164972",
//   appId: "1:55444164972:web:b515c28b1c1b65c044e349",
//   // databaseURL: "https://hrmanagament-b6c14-default-rtdb.firebaseio.com"
// };
// const app = initializeApp(firebaseConfig);
// const firebaseApp = initializeApp(firebaseConfig);
// const database = getFirestore(app);
// const auth = getAuth(app);

// // Define the type for Firebase context
// interface FirebaseContextType {
//   putData: (key: string, data: any) => Promise<void>;
//   updateData: (key: string, data: any) => Promise<void>;
//   deleteData: (key: string) => Promise<void>;
// }

// // Create a context object with initial value undefined
// const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// // Custom hook to consume Firebase context
// export const useFirebase = (): FirebaseContextType => {
//   const context = useContext(FirebaseContext);
//   if (!context) {
//     throw new Error('useFirebase must be used within a FirebaseProvider');
//   }
//   return context;
// };

// // Props for FirebaseProvider component
// interface FirebaseProviderProps {
//   children: ReactNode;
// }

// // FirebaseProvider component to provide Firebase context to the app
// export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
//   // Functions to interact with Firebase database
//   const putData = async (key: string, data: any) => {
//     await set(ref(database, key), data);
//   };

//   const updateData = async (key: string, data: any) => {
//     await update(ref(database, key), data);
//   };

//   const deleteData = async (key: string) => {
//     await remove(ref(database, key));
//   };

//   // Provide the context value to its children components
//   return (
//     <FirebaseContext.Provider value={{ putData, updateData, deleteData }}>
//       {children}
//     </FirebaseContext.Provider>
//   );
// };
// firebaseConfig.js
import React, { createContext, useContext, useState, useEffect, ReactNode, FormEvent } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDA8HAyGsfcRIRFP37a4CeMwhN5NLQeYIU",
    authDomain: "hrmanagament-b6c14.firebaseapp.com",
    projectId: "hrmanagament-b6c14",
    storageBucket: "hrmanagament-b6c14.appspot.com",
    messagingSenderId: "55444164972",
    appId: "1:55444164972:web:b515c28b1c1b65c044e349",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  userData: any;
  signup: (email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUserData(userDoc.data());
      } else {
        setUserData(null);
      }
    });
    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
    });
  };

  const signin = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <AuthContext.Provider value={{ user, userData, signup, signin }}>
      {children}
    </AuthContext.Provider>
  );
};
export {db,auth};
