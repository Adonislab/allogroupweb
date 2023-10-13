import { firebaseConfig } from '../utils/firebaseConfig';
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import Router from 'next/router';


const auth = getAuth(firebaseConfig);
const db = getFirestore(firebaseConfig);


export const register_user = async (formData) => {
    try {
        const { email, password, phoneNumber } = formData;
        
        if (!email) {
            return {
                success: false,
                message: "L'adresse e-mail est manquante.",
            };
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
       
        await addDoc(collection(db, 'users'), {
            uid: user.uid,
            phoneNumber: phoneNumber, 
        });

        setTimeout(() => {
            Router.push("/home");
        }, 5000);
        return {
            success: true,
            message: 'Votre compte est créé avec succès',
            user: user.toJSON(),
        };
    } catch (error) {
        console.log('Error in register_user (service) => ', error);
        return {
          success: false,
          message: "Nous n'avons pas pu créer votre compte",
          error: error.message,
        };
    }    
};


export const login_user = async (formData) => {
    try {
        const { email, password } = formData;
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        setTimeout(() => {
          Router.push("/dashboard");
        }, 2000); 
        return {
            success: true,
            message: 'Connexion réussie !!!',
            user: user.toJSON(), 
        };
      } catch (error) {
        console.error('Error in login_user (service) => ', error);
        return {
            success: false,
            message: 'Mauvais mot de passe ou email !!!',
            error: error.message,
        };
      }
};