import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from '../../../utils/firebaseConfig';
import { useRouter } from 'next/router';
import Image from "next/image";

export default function MarchandTable() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
 

  const COLUMNS = [
    { label: <span className="text-blue-500">Présentation</span>, renderCell: (item) => 
    <Image src={item.profileImageUrl} width={100} height={100} alt={item.adresse} />  },
    { label: <span className="text-blue-500">Boutique</span>, renderCell: (item) => item.fullName },
    {
      label: <span className="text-blue-500">Type de cuisine</span>,
      renderCell: (item) => item.cuisine,
    },
    { label: <span className="text-blue-500">Téléphone</span>, renderCell: (item) => item.phoneNumber },
    { label: <span className="text-blue-500">Emplacement</span>, renderCell: (item) => item.adresse },
    { label: <span className="text-blue-500">Stock</span>, renderCell: (item) =>  
    <button 
      className="text-white bg-orange-500 hover:bg-orange-600 focus:outline-none p-4 rounded-lg"
      onClick={() => handleClick(item)}>{item.produits.length}
    </button>
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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Chargement...</p>;
  } 

  const handleClick = (item) =>{
    // Convertir l'objet item.produits en chaîne JSON pour afficher ses propriétés
    console.log('Les données', item.produits); 
    const id = JSON.stringify(item.produits, null, 2);
    console.log('Les données à parser', id);
    router.push({
      pathname: '/boutique/produits',
      query: { id }
    });
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

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Précédent
          </button>
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(userData.length / usersPerPage) }).map((_, index) => (
              <div
                key={index}
                onClick={() => paginate(index + 1)}
                className={`cursor-pointer hover:underline px-2 py-2 ${
                  currentPage === index + 1 ? 'bg-blue-500 text-white rounded-full' : ''
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(userData.length / usersPerPage)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Suivant
          </button>
        </div>
        {/* End Pagination */}
    </> 
  );
}
