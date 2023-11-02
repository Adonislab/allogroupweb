import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MarchandsChart from "./components/layout/MarchandsChart";
import { getFirestore, collection, getDocs} from "firebase/firestore";
import { firebaseConfig } from '../utils/firebaseConfig';
import MarchandTable from "./components/layout/MarchandTable";
import ChampionTable from "./components/layout/ChampionTable";
import Image from "next/image";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const COLUMNS = [
    { label: <span className="text-blue-500">Utilisateurs</span>, renderCell: (item) => item.fullName },
    {
      label: <span className="text-blue-500">Type de profil</span>,
      renderCell: (item) => (item.role),
    },
    { label: <span className="text-blue-500">Téléphone</span>, renderCell: (item) => item.phoneNumber },
    { label: <span className="text-blue-500">Photo</span>, renderCell: (item) => (
      <Image src={item.profileImageUrl} width={100} height={100} alt="Photo de profil"/> ) 
    },
    { label: <span className="text-blue-500">Changement de Role</span>, renderCell: (item) => (
        <button className=" text-white bg-purple-500 hover:text-white focus:outline-none" onClick={() => handleEdit(item)}>Attribution du nouveau rôle</button>)
    },
    ];

    const handleEdit = (item) => {
        alert('Modification');
    }; 

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);

    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        const usersRef = collection(db, "users");
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

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <DashLayout>
      <Head/>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
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
        
      </div>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <p className="mt-4 text-2xl text-orange-500"> Quelles sont les grandes tendances marchandes de Allô Group ?</p>
        <MarchandTable/>
      </div>    
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <div>
          <p className="text-2xl text-orange-500">Les spécialités de cuisine au sein des restaurants</p>
          <MarchandsChart/>
        </div>
      </div>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <p className="mt-4 text-2xl text-orange-500"> Qui sont les grands Champions de Allô Group ?</p>
        <ChampionTable/>
      </div> 
   </DashLayout>
  );
}

export default Dashboard;
