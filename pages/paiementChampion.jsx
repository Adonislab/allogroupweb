import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import { firebaseConfig } from '../utils/firebaseConfig';
import React, { useState, useEffect, Input} from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {  doc, getDoc,getFirestore } from 'firebase/firestore';


function paiementChampion() {

  const db = getFirestore(firebaseConfig);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    wallet:"",
  });

  useEffect(() => {
    const auth = getAuth();
    const fetchData = async (user) => {
      if (user) {
        const userId = user.uid;
        try {
          const docRef = doc(db, 'users', userId);
          const docSnapshot = await getDoc(docRef);
    
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            
            setFormData((prevData) => ({
              ...prevData,
              phoneNumber: data.phoneNumber,
              wallet:data.wallet,
              
            }));
          } else {
            console.log("Aucune donnée trouvée pour cet utilisateur.");
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données depuis Firestore', error);
        }
      } else {
        console.log("L'utilisateur n'est pas authentifié.");
      }
    };
    
    onAuthStateChanged(auth, fetchData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  };



  return (
    <DashLayout>
    <Head/>
    <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
      <form onSubmit={handleSubmit} className='my-10'>
          <div className='my-5'>
          <p> Votre numéro </p>
          <input
              type='text'
              label="Votre numéro"
              name="phoneNumber"
              required={true}
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-1"

            />
          </div>
          <div className='my-5'>
          <p> Votre solde actuel</p>

            <input
              type='text'
              label="Montant"
              name="wallet"
              required={true}
              value={formData.wallet}
              onChange={handleInputChange}
              className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-1"
            />
          </div>
          
          <input type="submit" value="Paie du service" className='montserrat-medium py-3 w-full bg-orange text-lg cursor-pointer' />
          
      </form>
    </div>
    </DashLayout> 
  )
}

export default paiementChampion;