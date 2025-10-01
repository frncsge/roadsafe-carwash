import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import SideBar from "./SideBar";

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