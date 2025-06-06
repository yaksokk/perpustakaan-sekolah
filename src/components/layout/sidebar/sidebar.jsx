import './sidebar.css';
import '../../../global.css';
import { useAuth, usePage } from '../../../context';

function Sidebar({ isActive }) {
    const { user } = useAuth();
    const { currentPage, navigateTo } = usePage();
    
    const mainMenu = [
        { id: 'btnDashboard', label: 'Dashboard' },
        { id: 'btnKoleksi', label: 'Koleksi Buku' },
        { id: 'btnDaftarPeminjam', label: 'Daftar Peminjam' },
        { id: 'btnPeminjaman', label: 'Peminjaman' },
        { id: 'btnPengembalian', label: 'Pengembalian' },
        { id: 'btnCetakKartu', label: 'Buat Kartu' },
    ];

    const handleMenuClick = (itemId) => {
        navigateTo(itemId);
    };

    return (
        <aside className={`sidebar ${isActive ? 'active' : ''}`}>
            <div className="profileSection">
                <div className="profileImage">
                    <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User" />
                </div>
                <div>
                    {user && (
                        <div>
                            <div className="profileName">{user.username}</div>
                            <div className="profileRole">{user.name}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="menuGroup">
                <div className="menuLabel">MENU UTAMA</div>
                <ul className="asideMenu">
                    {mainMenu.map((item) => (
                        <li
                            key={item.id}
                            className={`asideItem ${currentPage === item.id ? 'active' : ''}`}
                            onClick={() => handleMenuClick(item.id)}
                        >
                            <a id={item.id}>
                                <span>{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

        </aside>
    );
}

export default Sidebar;