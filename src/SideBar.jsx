import { AiFillHome, AiFillSetting } from 'react-icons/ai';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { FaCoins, FaUserClock  } from 'react-icons/fa';
import { TbReportAnalytics } from 'react-icons/tb';


function SideBar() {
    return (
        <div id="side-bar-container">
            <a className='side-bar-link' href="#"><AiFillHome /> Dashboard</a>
            <a className='side-bar-link' href="#"><FaUserClock /> Queue</a>
            <a className='side-bar-link' href="#"><HiMiniUserGroup /> Staff</a>
            <a className='side-bar-link' href="#"><FaCoins /> Payments</a>
            <a className='side-bar-link' href="#"><TbReportAnalytics /> Reports</a>
            <a className='side-bar-link' href="#"><AiFillSetting /> Settings</a>
        </div>
    )
}

export default SideBar;