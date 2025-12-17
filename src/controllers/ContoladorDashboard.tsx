import { useAuth0 } from "@auth0/auth0-react";
import HomeAdmin from "../views/pages/HomeAdmin";
import Spinner from "../views/components/GeneralComponents/SpinnerLoader";
import useDashboardCountsHook from "./controllerHooks/Fetchs/useDashboardCountHook";
import useDashboardStatusHook from "./controllerHooks/Fetchs/useDashboardStatus";

const ContoladorDashboard = () => {
  const { isAuthenticated, isLoading } = useAuth0();


  return (
    <div>
      <HomeAdmin />
    </div>
  );
};

export default ContoladorDashboard;
