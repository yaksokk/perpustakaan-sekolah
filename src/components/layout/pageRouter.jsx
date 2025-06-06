import {
    Dashboard,
    KoleksiBuku,
    Peminjaman,
    Pengembalian,
    SelectedBooks,
    BorrowList,
    ReturnedList
} from '../../pages';
import { usePage } from '../../context';

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

    // Render halaman berdasarkan currentPage
    switch (currentPage) {
        case 'btnDashboard':
            return <Dashboard />;
        case 'btnKoleksi':
            return <KoleksiBuku />;
        case 'btnPeminjaman':
            return <Peminjaman />;
        case 'btnPengembalian':
            return <Pengembalian />;
        case 'btnCetakKartu':
            return <ComingSoon title="Cetak Kartu" />;
        case 'btnTentangKami':
            return <ComingSoon title="Tentang Kami" />;
        case 'btnKontak':
            return <ComingSoon title="Kontak" />;
        // non sidebar
        case 'btnSelectedBooks':
            return <SelectedBooks title="Selected Books" />;
        case 'btnDaftarPeminjam':
            return <BorrowList title="Daftar Peminjam" />;
        case 'btnReturnedList':
            return <ReturnedList title="Daftar Buku Yang Sudah Dikembalikan" />;
        default:
            return <Dashboard />;
    }
}

export default PageRouter;