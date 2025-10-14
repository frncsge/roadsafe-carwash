import { NavLink, useLocation } from 'react-router-dom';
import { AiFillHome, AiFillSetting } from 'react-icons/ai';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { FaCoins, FaUserClock  } from 'react-icons/fa';
import { TbReportAnalytics } from 'react-icons/tb';


function SideBar() {
    return (
        <div id="side-bar-container">
            <NavLink className='side-bar-link' to="/admin/dashboard"><AiFillHome /> Dashboard</NavLink>
            <NavLink className='side-bar-link' to="/admin/queue"><FaUserClock /> Queue</NavLink>
            <NavLink className='side-bar-link' to="/admin/staff"><HiMiniUserGroup /> Staff</NavLink>
            <NavLink className='side-bar-link' to="/admin/payments"><FaCoins /> Payments</NavLink>
            <NavLink className='side-bar-link' to="/admin/reports"><TbReportAnalytics /> Reports</NavLink>
            <NavLink className='side-bar-link' to="/admin/settings"><AiFillSetting /> Settings</NavLink>
        </div>
    )
}

export default SideBar;