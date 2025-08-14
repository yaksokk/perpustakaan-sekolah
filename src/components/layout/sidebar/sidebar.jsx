import './sidebar.css';
import '../../../global.css';
import { useAuth, usePage } from '../../../context';

function Sidebar({ isActive }) {
  const { user } = useAuth();
  const { currentPage, navigateTo } = usePage();

  const menuConfig = {
    admin: [
      { id: 'btnDashboard', label: 'Dashboard' },
      { id: 'btnKoleksi', label: 'Koleksi Buku' },
      { id: 'btnDaftarPengguna', label: 'Daftar Anggota' },
      { id: 'btnDaftarPetugas', label: 'Daftar Petugas' },
    ],
    operator: [
      { id: 'btnDashboard', label: 'Dashboard' },
      { id: 'btnKoleksi', label: 'Koleksi Buku' },
      { id: 'btnPeminjaman', label: 'Peminjaman' },
      { id: 'btnPengembalian', label: 'Pengembalian' },
    ],
    user: [
      { id: 'btnDashboard', label: 'Dashboard' },
      { id: 'btnKoleksi', label: 'Koleksi Buku' },
      { id: 'btnPeminjaman', label: 'Peminjaman' },
    ],
  };

  const roleKey = user?.role?.toLowerCase();
  const menuToShow = menuConfig[roleKey] || [];

  const handleMenuClick = (itemId) => {
    navigateTo(itemId);
  };

  return (
    <aside className={`sidebar ${isActive ? 'active' : ''}`}>
      <div className="profileSection">
        <div className="profileImage">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="User"
          />
        </div>
        <div>
          {user && (
            <>
              <div className="profileName">{user.name || user.username}</div>
              <div className="profileRole">{user.role}</div>
            </>
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
