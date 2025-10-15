import { Outlet, Navigate, useLocation } from "react-router-dom";
import TopBar from "../TopBar/TopBar";
import SideBar from "../SideBar/SideBar";

function AdminLayout() {
  const currentPathname = useLocation().pathname;

  if ((currentPathname = "/admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div id="admin-layout">
      <TopBar />
      <SideBar />
      <Outlet />
    </div>
  );
}

export default AdminLayout;
