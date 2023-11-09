import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc} from 'firebase/firestore';
import Link from 'next/link';
import { firebaseConfig } from '../utils/firebaseConfig';



function DashboardChampion() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const COLUMNS = [
    { label: <span className="text-blue-500">Livrasion</span>, renderCell: (item) => item.title },
    {
      label: <span className="text-blue-500">Lieu de départ</span>, 
      renderCell: (item) => item.categorie,
    },
    { label: <span className="text-blue-500">Lieu arrivée</span>, renderCell: (item) => item.price },
    { label: <span className="text-blue-500">Statut</span>, renderCell: (item) => (
        (item) => item.price )
    },
    { label: <span className="text-blue-500">Détails</span>, renderCell: (item) => (
        <button className="bg-blue-500 text-white hover:text-white focus:outline-none" onClick={() => handleDelete(item)}>Supprimez</button>)
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
        const userDocRef = doc(db, "champions", userId);
        
        try {
          const userDocSnapshot = await getDoc(userDocRef);
          const userDocData = userDocSnapshot.data();
          const userRole = userDocData.champion;
          console.log(userRole);

          if (userDocData && userRole === "oui ") {
            // Utilisez userDocData pour afficher les produits du marchand
            setProducts(userDocData.service || []); // Supposons que les services sont stockés dans un tableau nommé "products"
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
        <p className="mt-4 text-2xl text-orange-500">Quelles sont les grandes tendances de livraion Allô Group ?</p>
        <p className="text-2xl text-blue-500">Nombre de livraison effectué : {products.length}</p>
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
      
    </DashLayout>
  );
}

export default DashboardChampion;
