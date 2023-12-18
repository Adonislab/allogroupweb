import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDoc,doc ,updateDoc, getDocs} from "firebase/firestore";
import { firebaseConfig } from '../utils/firebaseConfig';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ModalModificationChampion from "./components/layout/ModalModificationChampion";
import { ToastContainer, toast } from 'react-toastify';


export default function Gestion_Portefeuille_Champion() {

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
        { label: <span className="text-blue-500">Utilisateurs</span>, renderCell: (item) => item.fullName },
        {
            label: <span className="text-blue-500">Type de profil</span>,
            renderCell: (item) => ("Champion"),
        },
        { label: <span className="text-blue-500">Téléphone</span>, renderCell: (item) => item.phoneNumber },
        //   { label: <span className="text-blue-500">Photo</span>, renderCell: (item) => 
        //     <Image src={item.profileImageUrl} width={50} height={50}  alt={item.fullName}/>  
        //   },
        {
            label: <span className="text-blue-500">Portefeuille</span>, renderCell: (item) => (
                <>
                    {item.wallet} F
                </>
            )
        },
        {
            label: <span className="text-blue-500"></span>, renderCell: (item) => (
                <button className="text-white bg-purple-500 hover:text-white focus:outline-none" onClick={() => openModal(item)}> <FontAwesomeIcon icon={faEdit} /></button>)
        },
    ];

    

    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore(firebaseConfig);

        onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setUser(authUser);

                const usersRef = collection(db, "champions");
                const querySnapshot = await getDocs(usersRef);

                const userDataArray = [];
                querySnapshot.forEach((doc) => {
                    userDataArray.push(doc.data());
                });


                setUserData(userDataArray);
                setLoading(false);
            } else {
                setUser(null);
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
                // Accédez au document du marchand
                const merchantDocRef = doc(db, "champions", userId);
                const merchantDocSnapshot = await getDoc(merchantDocRef);
                const merchantData = merchantDocSnapshot.data();

                if (merchantData) {
                    // Accédez à la sous-collection de produits
                    const products = merchantData.produits || [];

                    // Recherchez le produit à mettre à jour par son ID
                    const productIndex = products.findIndex(product => product.id === updatedProduct.id);

                    if (productIndex !== -1) {
                        // Mettez à jour le produit dans la liste
                        products[productIndex] = updatedProduct;

                        // Mettez à jour la sous-collection de produits dans le document du marchand
                        await updateDoc(merchantDocRef, { produits: products });

                        console.log("Le produit a été mis à jour avec succès.");
                        // Réactualisez les données après la modification.
                        products(products);

                        // Fermez le modal de modification ici
                        setSelectedProduct(null);

                        toast.success('Modification réussie !', {
                            position: 'top-right',
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                        });
                    } else {
                        console.error("Produit introuvable dans la liste du marchand.");
                        toast.error("Produit introuvable dans la liste du marchand.", {
                            position: 'top-right',
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                        });
                    }
                } else {
                    console.error("Document du marchand introuvable.");
                    toast.error("Document du marchand introuvable.", {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });
                }
            } catch (error) {
                console.error("Erreur lors de la mise à jour du produit", error);
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
        <ModalModificationChampion
          product={selectedProduct}
          isOpen={isModalOpen}
          // Passez la fonction updateProduct au composant ModalMarchand
          updateProduct={updateProduct}
          onCancel={closeModal}     
        />
      )}
            <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
                Gestion des portefeuilles Champions
            </div>
            <p className="mt-4 text-2xl text-orange-500"> Qui sont les grands utilisateurs  de Allô Group ?</p>
            <p className="text-2xl text-blue-500">Nombre d'utilisateurs : {userData.length}</p>
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
        </DashLayout>
    )
}
