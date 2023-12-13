import Image from "next/image";
import Logo from "../../../utils/Assets/Logo.png";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Définir des constantes pour les rôles
const ROLES = {
  ADMIN: 'admin',
  COMPTABLE: 'comptable',
  DECIDEUR: 'decideur',
  CHAMPION: 'champion',
  MARCHAND: 'marchand',
};


function HeaderBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  
  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = (href) => {
    router.push(href);
    setMenuOpen(false);
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        const db = getFirestore();
        // Utilisez authUser.uid pour obtenir l'ID de l'utilisateur connecté
        const userId = authUser.uid;
        
        const userRolesDoc = doc(db, 'users', userId);

        // Exécutez la requête pour récupérer les rôles de l'utilisateur
        getDoc(userRolesDoc)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              const rolesWithTrueHasRole = Object.keys(data).filter((role) => data[role] === true);
              setUserRoles(rolesWithTrueHasRole);
            }
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des rôles:', error);
          });
      } else {
        setUser(null);
        // Ne pas définir userRoles à vide pour afficher la page "Accueil" par défaut
      }
    });
  }, []);

   // Exemple de structure d'éléments liés aux rôles
   const roleItems = {
    [ROLES.ADMIN]: [
      {
        name: 'Tableau Administrateur',
        url: '/dashboard',
        icon: 'speedometer2',
      },
      {
        name: "Liste des marchands",
        url: "/listeMarchand",
        icon: "question-diamond-fill"
      },
      {
        name: "Liste des champions",
        url: "/listeChampion",
        icon: "question-diamond-fill"
      },
      {
        name: "Vues des décideurs",
        url: "/listeDecideur",
        icon: "question-diamond-fill"
      },
      {
        name: "Vue des comptables",
        url: "/listeComptable",
        icon: "question-diamond-fill"
      },
      {
        name: "Gestion des rôles",
        url: "/gestionRole",
        icon: "question-diamond-fill"
      },
      {
        name: 'Rapports',
        url: '/repports',
        icon: 'clipboard2-data',
      },
      {
        name: "Gestion des notifications",
        url: "/notification",
        icon: "question-diamond-fill"
      },
      
      {
        name: "Gestion de l'Application",
        url: "/gestion_appli",
        icon: "question-diamond-fill"
      },
      {
        name: "Compte utilisateur",
        url: "/users",
        icon: "question-diamond-fill"
      },
    ],
    [ROLES.DECIDEUR]: [
      {
        name: 'Rapports',
        url: '/reports',
        icon: 'clipboard2-data',
      },
      {
        name: 'Tableau de décison',
        url: '/dashboard',
        icon: 'speedometer2',
      },  
      {
        name: "Compte utilisateur",
        url: "/users",
        icon: "question-diamond-fill"
     },
     {
      name: "Systeme de notification",
      url: "/notification",
      icon: "question-diamond-fill"
      },
    ],
    [ROLES.COMPTABLE]: [
      {
        name: 'Tableau de Vison',
        url: '/dashboard',
        icon: 'speedometer2',
      }, 
      {
        name: "Compte utilisateur",
        url: "/users",
        icon: "question-diamond-fill"
     }, 
    ],
    [ROLES.MARCHAND]: [
      {
        name: 'Mes ventes',
        url: '/venteMarchand',
        icon: 'speedometer2',
      },  
      {
        name: 'Marchand Board',
        url: '/dashboardMarchand',
        icon: 'speedometer2',
      }, 
      {
        name: "Notification de vente",
        url: "/notification",
        icon: "question-diamond-fill"
      }, 
      {
        name: "Compte Marchand",
        url: "/marchand",
        icon: "question-diamond-fill"
     },
      {
        name: 'Création de produits',
        url: '/chat',
        icon: 'question-diamond-fill',
      },  
    ],
    [ROLES.CHAMPION]: [
      {
        name: 'Champion Board',
        url: '/dashboardChampion',
        icon: 'speedometer2',
      },  
      {
        name: "Compte Champion",
        url: "/champion",
        icon: "question-diamond-fill"
     },
     {
      name: "Notification de livraison",
      url: "/notification",
      icon: "question-diamond-fill"
    },
    ]
  };

  // Élément de menu générique pour l'utilisateur sans rôle
  const defaultMenuItem = [
    {
      name: 'Accueil',
      url: '/politique',
      icon: 'question-diamond-fill',
    },
    {
      name: 'Partenariat',
      url: '/setting',
      icon: 'question-diamond-fill',
    },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              onClick={handleMenuClick}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <div
              className={`${
                menuOpen ? "block" : "hidden"
              } absolute w-40 bg-white rounded-md border border-gray-200 right-0 mt-12 z-10`}
            >
             <ul className="space-y-2 font-medium">
          {userRoles.length > 0 ? (
              userRoles.map((role) => {
                const roleItem = roleItems[role];
                if (roleItem) {
                  return roleItem.map((item, index) => (
                    <li key={index}>
                      <Link href={item.url} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover-bg-gray-700 group ${router.asPath === item.url ? 'bg-orange-500' : ''}`}>
                        <i className={"bg-blue-900 p-1 px-2 rounded-md bi bi-" + item.icon}></i>
                        <span className="ml-3 font-semibold">{item.name}</span>
                      </Link>
                    </li>
                  ));
                }
                return null; // Rôle non trouvé dans roleItems
            })
          ) : (
            // Afficher la page "Accueil" si l'utilisateur n'a pas de rôle ou si aucun rôle avec `hasRole` à `true` n'a été trouvé
            defaultMenuItem.map((item, index) => (
              <li key={index}>
                <Link href={item.url} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover-bg-gray-700 group">
                  <i className={"bg-blue-900 p-1 px-2 rounded-md bi bi-" + item.icon}></i>
                  <span className="ml-3 font-semibold">{item.name}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
            </div>
            <Image
              src={Logo}
              className="h-8 mr-3"
              width={50}
              height={300}
              alt="FlowBite Logo"
            />
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
              ALLO GROUP
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ml-3">
              <div>
                <button
                  type="button"
                  onClick={handleMenuClick}
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded={menuOpen}
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user photo"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default HeaderBar;
