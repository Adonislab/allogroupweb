import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { firebaseConfig } from '../utils/firebaseConfig';
import MarchandsChartMarchands from "./components/layout/MarchandsChartMarchands";
import ModalMarchand from "./components/layout/ModalMarchand"; 
import { ToastContainer, toast } from 'react-toastify';
import Image from 'next/image';

function DashboardMarchand() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
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
    { label: <span className="text-blue-500">Produits</span>, renderCell: (item) => item.title },
    {
      label: <span className="text-blue-500">Catégorie</span>, 
      renderCell: (item) => item.categorie,
    },
    { label: <span className="text-blue-500">Prix de vente</span>, renderCell: (item) =>  <span>{item.price} F</span>},
    { label: <span className="text-blue-500">Images du produits</span>, renderCell: (item) => <Image src={item.image} width={50} height={50}  alt ="Image du produit"/> },
    { label: <span className="text-blue-500"></span>, renderCell: (item) => (
        <button className="text-white bg-purple-500 hover:text-white focus:outline-none" onClick={() => openModal(item)}>Modifiez</button>)
    },
    { label: <span className="text-blue-500"></span>, renderCell: (item) => (
        <button className="bg-red-500 text-white hover:text-white focus:outline-none" onClick={() => handleDelete(item)}>Supprimez</button>)
    },
  ];

  const updateProduct = async (updatedProduct) => {
    console.log("updatedProduct:", updatedProduct);
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      console.log(updatedProduct.id);
      try {
        // Accédez au document du marchand
        const merchantDocRef = doc(db, "marchands", userId);
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
            setProducts(products);

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

  
  const handleDelete = async (item) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      const auth = getAuth();
      const db = getFirestore(firebaseConfig);
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        try {
          // Accédez au document du marchand
          const merchantDocRef = doc(db, "marchands", userId);
          const merchantDocSnapshot = await getDoc(merchantDocRef);
          const merchantData = merchantDocSnapshot.data();
  
          if (merchantData) {
            // Accédez à la sous-collection de produits
            const products = merchantData.produits || [];
  
            // Recherchez le produit à supprimer par son ID
            const productIndex = products.findIndex(product => product.id === item.id);
  
            if (productIndex !== -1) {
              // Supprimez le produit de la liste
              products.splice(productIndex, 1);
  
              // Mettez à jour la sous-collection de produits dans le document du marchand
              await updateDoc(merchantDocRef, { produits: products });
  
              console.log("Le produit a été supprimé avec succès.");
              // Réactualisez les données après la suppression.
              setProducts(products);
  
              // Fermez le modal de modification ici
              setSelectedProduct(null);
  
              toast.success('Produit supprimé !', {
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
          console.error("Erreur lors de la suppression du produit", error);
          toast.error('Échec de la suppression. Veuillez réessayer.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      }
    }
  };
  

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);

    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        
        // Utilisez authUser.uid pour obtenir l'ID de l'utilisateur connecté
        const userId = authUser.uid;
       
        // Utilisez l'ID de l'utilisateur pour chercher son document marchand
        const userDocRef = doc(db, "marchands", userId);
        
        try {
          const userDocSnapshot = await getDoc(userDocRef);
          const userDocData = userDocSnapshot.data();
          

          if (userDocData) {
            // Utilisez userDocData pour afficher les produits du marchand
            setProducts(userDocData.produits); 
          } else {
            // Aucun document marchand trouvé pour l'utilisateur
            setProducts([]);
          }

          setLoading(false);
        } catch (error) {
          console.error("Erreur lors de la récupération des données du marchand", error);
        }
      } else {
        setUser(null);
        setProducts([]);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <DashLayout>
      <Head />
      {selectedProduct && (
        <ModalMarchand
          product={selectedProduct}
          isOpen={isModalOpen}
          // Passez la fonction updateProduct au composant ModalMarchand
          updateProduct={updateProduct}
          onCancel={closeModal}     
        />
      )}
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <p className="mt-4 text-2xl text-orange-500">Quelles sont les grandes tendances au sein de votre boutique Allô Group ?</p>
        <p className="text-2xl text-blue-500">Nombre d'articles en vente : {products.length}</p>
        <table className="w-full table-fixed">
          <thead>
            <tr>
              {COLUMNS.map((column, index) => (
                <th key={index} className="px-4 py-2">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
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
      </div>
      <div>
        <MarchandsChartMarchands />
      </div>
      {/* Affichez le modal de modification */}
      <ToastContainer /> 
    </DashLayout>
  );
}

export default DashboardMarchand;
