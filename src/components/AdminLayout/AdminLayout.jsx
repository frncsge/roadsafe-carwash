import { Outlet } from "react-router-dom";
import TopBar from "../TopBar/TopBar";
import SideBar from "../SideBar/SideBar";


function AdminLayout() {
    return (
        <div id="admin-layout">
            <TopBar />
            <SideBar />
            <Outlet />
        </div>
    )
}

export default AdminLayout;