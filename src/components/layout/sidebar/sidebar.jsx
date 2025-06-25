import './sidebar.css';
import '../../../global.css';
import { useAuth, usePage } from '../../../context';

function Sidebar({ isActive }) {
    const { user } = useAuth();  // Mengambil informasi user dari AuthContext
    const { currentPage, navigateTo } = usePage();

    const adminMenu = [
        { id: 'btnDashboard', label: 'Dashboard' },
        { id: 'btnKoleksi', label: 'Koleksi Buku' },
        { id: 'btnDaftarPengguna', label: 'Daftar Anggota' },
        { id: 'btnDaftarPetugas', label: 'Daftar Petugas' },
    ];

    const operatorMenu = [
        { id: 'btnDashboard', label: 'Dashboard' },
        { id: 'btnKoleksi', label: 'Koleksi Buku' },
        { id: 'btnPeminjaman', label: 'Peminjaman' },
        { id: 'btnPengembalian', label: 'Pengembalian' },
    ];

    const userMenu = [
        { id: 'btnDashboard', label: 'Dashboard' },
        { id: 'btnKoleksi', label: 'Koleksi Buku' },
        { id: 'btnPeminjaman', label: 'Peminjaman' },
    ];

    // Tentukan menu yang akan ditampilkan berdasarkan role
    let menuToShow = [];
    if (user?.role === 'Admin') {
        menuToShow = adminMenu;
    } else if (user?.role === 'Operator') {
        menuToShow = operatorMenu;
    } else if (user?.role === 'User') {
        menuToShow = userMenu;
    }

    const handleMenuClick = (itemId) => {
        // Menggunakan navigateTo yang sudah terintegrasi dengan React Router
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
                            <div className="profileName">{user.name}</div>
                            <div className="profileRole">{user.role}</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="menuGroup">
                <div className="menuLabel">MENU UTAMA</div>
                <ul className="asideMenu">
                    {menuToShow.map((item) => (
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