import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Définir des constantes pour les rôles
const ROLES = {
  ADMIN: 'admin',
  COMPTABLE: 'comptable',
  DECIDEUR: 'decideur',
  CHAMPION: 'champion',
  MARCHAND: 'marchand',
};

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [rolesWithTrueHasRole, setRolesWithTrueHasRole] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        const db = getFirestore();
        const usersCollection = collection(db, 'users');

        // Définir les requêtes pour chaque rôle
        const roleQueries = Object.values(ROLES).map((role) => {
          return query(usersCollection, where(role, '==', true));
        });

        // Exécuter les requêtes en parallèle
        Promise.all(roleQueries.map((query) => getDocs(query)))
          .then((roleDocs) => {
            const roles = roleDocs.map((docs, index) => ({ role: Object.keys(ROLES)[index], hasRole: docs.size > 0 }));
            const rolesWithTrueHasRole = roles.filter((role) => role.hasRole).map((role) => role.role.toLowerCase());
            setRolesWithTrueHasRole(rolesWithTrueHasRole);
            setUserRoles(roles);
            //console.log("le role",rolesWithTrueHasRole);
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
      name: "Notification",
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
  ];

  return (
    <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {userRoles.length > 0 ? (
            userRoles.some((role) => role.hasRole) ? (
              userRoles
                .filter((role) => role.hasRole)
                .map((role) => {
                  const roleItem = roleItems[role.role.toLowerCase()];
                  if (roleItem) {
                    return roleItem.map((item, index) => (
                      <li key={index}>
                        <Link href={item.url} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover-bg-gray-700 group ${router.asPath === item.url ? 'bg-orange-500' : ''}`}>
                          <i className={"bg-blue-900 p-1 px-2 rounded-md bi bi-" + item.icon}></i>
                          <span className="ml-3 font-semibold">{item.name}</span>
                        </Link>
                      </li>
                    ));
                  }
                  return null; // Rôle non trouvé dans roleItems
                })
              ) : null
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
    </aside>
  );
}  