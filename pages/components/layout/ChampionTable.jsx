import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from '../../../utils/firebaseConfig';

export default function MarchandTable() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLUMNS = [
    { label: <span className="text-blue-500">Nom du Champion</span>, renderCell: (item) => item.fullName },
    {
      label: <span className="text-blue-500">Adresse</span>,
      renderCell: (item) => item.adresse,
    },
    { label: <span className="text-blue-500">Téléphone</span>, renderCell: (item) => item.phoneNumber },
    { label: <span className="text-blue-500"></span>, renderCell: (item) => 
        <button className=" text-white bg-purple-500 hover:text-white focus:outline-none" onClick={() => handleEdit(item)}>Modifiez</button>
    },
    { label: <span className="text-blue-500"></span>, renderCell: (item) => 
        <button className=" bg-red-500 text-white hover:text-white focus:outline-none" onClick={() => handleDelete(item)}>Supprimez</button> 
    },
  ];

    const handleEdit = (item) => {
        alert('Modification');
    };

    const handleDelete = async (item) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
        
        const auth = getAuth();
        const db = getFirestore(firebaseConfig);
        const userId = item.id; 
        try {
            await deleteDoc(doc(db, "users", userId));
            // Réactualisez les données après la suppression.
            const usersRef = collection(db, "users");
            const querySnapshot = await getDocs(usersRef);
            const userDataArray = [];
            querySnapshot.forEach((doc) => {
            userDataArray.push({ id: doc.id, ...doc.data() });
            });
            setUserData(userDataArray);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur", error);
        }
        }       
    }

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);

    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        const marchandsRef = collection(db, "champions");
        const querySnapshot = await getDocs(marchandsRef);

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

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <>
        <p className="text-2xl text-blue-500">Nombre de Champion : {userData.length} </p>
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
