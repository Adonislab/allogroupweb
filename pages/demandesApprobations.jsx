import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDoc,doc ,updateDoc, getDocs,getDownloadURL} from "firebase/firestore";
import { firebaseConfig } from '../utils/firebaseConfig';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ModalApprobation from "./components/layout/ModalApprobation";
import { ToastContainer, toast } from 'react-toastify';


export default function DemandesApprobations() {
    const [formData, setFormData] = useState({
        phoneNumber: "",
        fullName: "",
        details: "",
        email: "",
        categorie: "",
        idCard: "",
        id:"",
        approuve: ""

    });
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const COLUMNS = [
        { label: <span className="text-blue-500">Noms et prénoms</span>, renderCell: (item) => item.fullName },
        {
            label: <span className="text-blue-500">Email</span>,
            renderCell: (item) => item.email,
        },
        { label: <span className="text-blue-500">Téléphone</span>, renderCell: (item) => item.phoneNumber, },
        
        {
            label: <span className="text-blue-500">Statut</span>,
            renderCell: (item) => {
                if(item.approuve == false){
                    return "Décliné"
                } else{ return "Approuvé"}
            },
        },
        {
            label: <span className="text-blue-500">Approuver</span>, renderCell: (item) => (
                <button className="text-white bg-blue-500 hover:text-white focus:outline-none" onClick={() => openModal(item)}> <FontAwesomeIcon icon={faEye} /></button>)
        },
        
    ];
    

    

   
    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore(firebaseConfig);

        onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                try {
                    const usersRef = collection(db, "administrateur");
                    const usersDoc = doc(usersRef, "admin");
                    const docSnapshot = await getDoc(usersDoc);

                    const userDataArray = [];
                    const data = docSnapshot.data();
                    const examenArray = data.examen || [];

                    examenArray.forEach((examen) => {
                        userDataArray.push({
                            fullName: examen.fullName,
                            email: examen.email,
                            phoneNumber: examen.phoneNumber,
                            details: examen.details,
                            categorie: examen.categorie,
                            idCard : examen.idCard,
                            id: examen.id,
                            approuve : examen.approuve
                            // Add other fields as needed

                        });
                        console.log("***********************",userDataArray[0]["approuve"]);
                    });

                    setUserData(userDataArray);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                }
            } else {
                setUserData([]);
                setLoading(false);
            }
        });
    }, []);
 

    









    const updateProduct = async (updatedProduct) => {
        console.log("updatedProduct:", updatedProduct);
        const auth = getAuth();
        const db = getFirestore(firebaseConfig);
    
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            console.log(updatedProduct.id);
    
            try {
                // Accédez à la collection "administrateur"
                const adminRef = collection(db, "administrateur");
                const adminDocRef = doc(adminRef, "admin");
                const adminDocSnapshot = await getDoc(adminDocRef);
    
                // Récupérez la liste d'examens de l'administrateur
                const examenArray = adminDocSnapshot.data().examen || [];
    
                // Recherchez l'index de l'examen correspondant à updatedProduct.id
                const examenIndex = examenArray.findIndex((examen) => examen.id === updatedProduct.id);
    
                if (examenIndex !== -1) {
                    // Mettez à jour le champ "approuvé" dans l'examen
                    examenArray[examenIndex].approuve = true;
    
                    // Mettez à jour le document administrateur avec la nouvelle liste d'examens
                    await updateDoc(adminDocRef, { examen: examenArray });
    
                    console.log("Le champ 'approuvé' a été mis à jour dans la collection administrateur.");
    
                    // Accédez à la collection "users"
                    const usersRef = collection(db, "users");
    
                    // Récupérez le document de l'utilisateur correspondant à updatedProduct.id
                    const userDocRef = doc(usersRef, updatedProduct.id);
                    const userDocSnapshot = await getDoc(userDocRef);
    
                    if (userDocSnapshot.exists()) {
                        // Mettez à jour le champ "approuvé" dans le document de l'utilisateur
                        await updateDoc(userDocRef, { approuve: true });
    
                        console.log("Le champ 'approuvé' a été mis à jour dans la collection users.");
                    } else {
                        console.error("Utilisateur introuvable dans la collection users.");
                    }
    
                    // Réactualisez les données après la modification.
                    setUserData(examenArray);
    
                    // Fermez le modal de modification ici
                    toast.success('Modification réussie !', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });
                    setSelectedProduct(null);
                } else {
                    console.error("Examen introuvable dans la collection administrateur.");
                }
            } catch (error) {
                console.error("Erreur lors de la mise à jour du champ 'approuvé'", error);
                toast.error('Échec de la modification. Veuillez réessayer.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }
        }
    };
    
    

    




    return (
        <DashLayout>
            <Head />
            {selectedProduct && (
        <ModalApprobation
          product={selectedProduct}
          isOpen={isModalOpen}
          // Passez la fonction updateProduct au composant ModalMarchand
          updateProduct={updateProduct}
          onCancel={closeModal}     
        />
      )}
            <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
               Approbations en attente
            </div>
            {/* <p className="mt-4 text-2xl text-orange-500"> Qui sont les grands utilisateurs  de Allô Group ?</p> */}
            <p className="text-2xl text-blue-500">Nombre d'approbations : {userData.length}</p>
            <table className="w-full table-fixed">
                <thead>
                    <tr>
                        {COLUMNS.map((column, index) => (
                            <th key={index} className="px-4 py-2">{column.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {userData.map((item, index) => (
                        <tr key={index}>
                            {COLUMNS.map((column, columnIndex) => (
                                <td key={columnIndex} className="px-4 py-2 border">
                                    {column.renderCell(item)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        <ToastContainer/>
        </DashLayout>
    )
}
