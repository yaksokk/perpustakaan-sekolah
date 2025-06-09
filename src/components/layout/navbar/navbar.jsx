import { IoLogOutOutline, IoMenu } from "react-icons/io5";
import './navbar.css'
import '../../../global.css'
import logo from '../../../assets/images/logo_nobg.jpg'
import { useAuth } from './../../../context';

function Navbar({ onToggleMenu }) {
    const { logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm('Apakah Anda yakin ingin logout?')) {
            logout();
        }
    };

    return (
        <nav id="navbar">
            <div className="navbarLeft">
                <div className="logo">
                    <img src={logo} alt="" />
                    <span>Sistem Perpustakaan</span>
                </div>
                <div className="navbar menu-toggle">
                    <button style={{backgroundColor: 'transparent'}} onClick={onToggleMenu}><IoMenu className="icon" /></button>
                </div>
            </div>
            <div className="navbar logout">
                <div title="Keluar">
                    <button onClick={handleLogout}>
                        <IoLogOutOutline className="icon" />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;