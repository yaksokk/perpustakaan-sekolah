import {
    Dashboard,
    KoleksiBukuUser,
    KoleksiBukuOperator,
    Peminjaman,
    Pengembalian,
    SelectedBooks,
    BorrowList,
    ReturnedList,
    Users
} from '../../pages';
import { usePage, useAuth } from '../../context';

// Komponen sementara untuk halaman yang belum dibuat
function ComingSoon({ title }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            textAlign: 'center'
        }}>
            <h2 style={{ color: '#666', marginBottom: '20px' }}>
                {title}
            </h2>
            <p style={{ color: '#999', fontSize: '16px' }}>
                Halaman ini sedang dalam pengembangan
            </p>
            <div style={{
                width: '50px',
                height: '3px',
                backgroundColor: '#007bff',
                margin: '20px 0'
            }}></div>
            <p style={{ color: '#999', fontSize: '14px' }}>
                Coming Soon...
            </p>
        </div>
    );
}

function PageRouter() {
    const { currentPage } = usePage();
    const { user } = useAuth();

    if (user?.role === 'Admin') {
        // Admin bisa mengakses semua halaman
        switch (currentPage) {
            case 'btnDashboard':
                return <Dashboard />;
            case 'btnUsers':
                return <Users />;
            case 'btnKoleksi':
                return <KoleksiBukuOperator />;
            // Tambahkan kasus lainnya sesuai kebutuhan
            default:
                return <Dashboard />;
        }
    } else if (user?.role === 'Operator') {
        // Operator hanya bisa mengakses beberapa halaman tertentu
        switch (currentPage) {
            case 'btnDashboard':
                return <Dashboard />;
            case 'btnKoleksi':
                return <KoleksiBukuOperator />;
            case 'btnSelectedBooks':
                return <SelectedBooks title="Buku yang Ingin Dipinjam" />;
            case 'btnDaftarPeminjam':
                return <BorrowList title="Daftar Peminjam" />;
            case 'btnReturnedList':
                return <ReturnedList title="Daftar Buku Yang Sudah Dikembalikan" />;
            default:
                return <Dashboard />;
        }
    } else if (user?.role === 'User') {
        // User hanya bisa mengakses halaman yang lebih terbatas
        switch (currentPage) {
            case 'btnDashboard':
                return <Dashboard />;
            case 'btnKoleksi':
                return <KoleksiBukuUser />;
            case 'btnPeminjaman':
                return <Peminjaman />;
            case 'btnPengembalian':
                return <Pengembalian />;
            case 'btnSelectedBooks':
                return <SelectedBooks title="Buku yang Ingin Dipinjam" />;
            case 'btnDaftarPeminjam':
                return <BorrowList title="Daftar Peminjam" />;
            case 'btnReturnedList':
                return <ReturnedList title="Daftar Buku Yang Sudah Dikembalikan" />;
            default:
                return <Dashboard />;
        }
    }
    

    return <Navigate to="/login" replace />;
}


export default PageRouter;