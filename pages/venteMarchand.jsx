import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { firebaseConfig } from '../utils/firebaseConfig';


function VenteMarchand() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  

  
  const COLUMNS = [
    { label: <span className="text-blue-500">Produits</span>, renderCell: (item) => item.title },
    {
      label: <span className="text-blue-500">Catégorie</span>, 
      renderCell: (item) => item.categorie,
    },
    { label: <span className="text-blue-500">Prix de vente</span>, renderCell: (item) => item.price },
    { label: <span className="text-blue-500">Nbres de Vente</span>, renderCell: (item) => (
        item.price)
    },
    { label: <span className="text-blue-500">Votre Avoir</span>, renderCell: (item) => (
        item.price )
    },
    { label: <span className="text-blue-500">Détails</span>, renderCell: (item) => (
        <button className="bg-orange-500 text-white hover:text-white focus:outline-none" onClick={() => alert('N')}>Voir Plus</button>)
    },
  ];

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
          console.log(userDocData);

          if (userDocData) {
            // Utilisez userDocData pour afficher les produits du marchand
            setProducts(userDocData.produits || []); // Supposons que les produits sont stockés dans un tableau nommé "products"
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
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <p className="mt-4 text-2xl text-blue-500">Quelles sont les grandes tendances au sein de votre boutique Allô Group ?</p>
        <p className="text-2xl text-orange-500">Nombre d'articles en stock : {products.length}</p>
        <p className="text-2xl text-orange-500">Nombre d'articles en vendu : {products.length}</p>
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
      <p>Graphique en bas </p>
      
    </DashLayout>
  );
}

export default VenteMarchand;
