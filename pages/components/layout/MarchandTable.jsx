import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from '../../../utils/firebaseConfig';
import Link from "next/link";

export default function MarchandTable() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLUMNS = [
    { label: <span className="text-blue-500">Nom de la boutique</span>, renderCell: (item) => item.fullName },
    {
      label: <span className="text-blue-500">Type de cuisine</span>,
      renderCell: (item) => item.cuisine,
    },
    { label: <span className="text-blue-500">Téléphone</span>, renderCell: (item) => item.phoneNumber },
    { label: <span className="text-blue-500">Emplacement</span>, renderCell: (item) => item.adresse },
    { label: <span className="text-blue-500">Produits en stock</span>, renderCell: (item) =>  
    <Link className=" text-white bg-orange-500 hover:text-white focus:outline-none" 
    href={`/boutique/produits?id=${encodeURIComponent(JSON.stringify(item.produits))}`}>
      {item.produits.length}
      </Link>
    },
  ];  
  
  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);

    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        const marchandsRef = collection(db, "marchands");
        const querySnapshot = await getDocs(marchandsRef);
            
        const userDataArray = [];
        querySnapshot.forEach((doc) => {
          userDataArray.push(doc.data());
        });

        setUserData(userDataArray);
        console.log('les données user',userDataArray[2].produits)
        setLoading(false);
      } else {
        setUser(null);
        setUserData([]);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  } 

  return (
    <>
        <p className="text-2xl text-blue-500">Nombre de boutiques : {userData.length} </p>
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
    </> 
  );
}
