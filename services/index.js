import { firebaseConfig } from '../utils/firebaseConfig';
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';


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

        return {
            success: true,
            message: 'Compte créé avec succès, vous pouvez vous connecter',
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return {
            success: true,
            message: 'Connexion réussie',
            user: user.toJSON(), 
        };
    } catch (error) {
        console.log('Error in login_user (service) => ', error);
        return {
            success: false,
            message: 'Échec de la connexion',
            error: error.message,
        };
    }
};