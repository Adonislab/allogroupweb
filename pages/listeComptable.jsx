import Champion from "./gestionPortefeuilleChampionComptable";
import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import Marchand from './components/layout/MarchandTablePaiementAllogroup'
export default function listeComptable() {
  return (
    <DashLayout>
      <Head/>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
            COMPTABLE
      </div>

      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
      
            <Marchand/>
      </div>

      {/* <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14"> */}

        <Champion/>
      {/* </div> */}

    </DashLayout>  
  ) 
}
