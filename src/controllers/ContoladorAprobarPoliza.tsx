import { useAuth0 } from "@auth0/auth0-react";
import DashboardAdmin from "../views/pages/HomeAdmin";
import Spinner from "../views/components/GeneralComponents/SpinnerLoader";
import useDashboardStatusHook from "./controllerHooks/Fetchs/useDashboardStatus";
import VendedorPage from "../views/pages/VendedorPage";
import useAllPolizas from "./controllerHooks/Fetchs/useAllPolicesHook";
import { useEffect, useState } from "react";
import usePoliceByIdHook from "./controllerHooks/Fetchs/usePoliceByIdHook";
import useDetallesHook from "./controllerHooks/Fetchs/useDetallesHook";
import useCoberturasDetalleHook from "./controllerHooks/Fetchs/useCoberturaDetalleHook";

const ContoladorAprobarPoliza = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  // Hook que trae todas las polizas

  // Hook para traer poliza
  const { loading, error } = useAllPolizas();
  const { loading: LoadingLine, error: ErrorLine } = useDetallesHook();
  const { loading: LoadingCD, error: ErrorCD } = useCoberturasDetalleHook();

  // Mostrar loading mientras Auth0 inicializa
  if (isLoading || loading || LoadingLine || LoadingCD) {
    return <Spinner title="Cargando..." text="Por favor espere" />;
  }
  if (error || ErrorLine || ErrorCD) {
    return <div>Error: ha ocurrido un error inesperado</div>;
  }

  return (
    <div>
      <VendedorPage isAuth={isAuthenticated} />
    </div>
  );
};

export default ContoladorAprobarPoliza;
