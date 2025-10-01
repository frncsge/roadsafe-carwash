import { GiHamburgerMenu } from 'react-icons/gi';

function TopBar() {
    return (
        <div id="top-bar-container">
            <section className='menu-logo top-bar-section'>
                <div id='menu'>
                    <GiHamburgerMenu size={25}/>
                </div>
                <img id='logo' src="/roadsafe logo.png" alt="Roadsafe logo" />
            </section>
            <section className='admin-name-profile top-bar-section'>
                <span id='admin-name'>Allen Kablbo</span>
                <div id='admin-profile'>A</div>
            </section>
        </div>
    )
}

export default TopBar;