import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
    DashboardAdmin,
    DashboardOperator,
    DashboardUser,
    KoleksiBukuUser,
    KoleksiBukuOperator,
    Peminjaman,
    Pengembalian,
    SelectedBooks,
    BorrowList,
    ReturnedList,
    Anggota,
    Petugas
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

// Komponen wrapper untuk sinkronisasi URL dengan state internal
function PageSync({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentPage, navigateTo } = usePage();
    const { user } = useAuth();

    // Mapping URL ke button ID
    const urlToPageMap = {
        '/dashboard': 'btnDashboard',
        '/koleksi-buku': 'btnKoleksi',
        '/daftar-anggota': 'btnDaftarPengguna',
        '/daftar-petugas': 'btnDaftarPetugas',
        '/peminjaman': 'btnPeminjaman',
        '/pengembalian': 'btnPengembalian',
        '/selected-books': 'btnSelectedBooks',
        '/daftar-peminjam': 'btnDaftarPeminjam',
        '/returned-list': 'btnReturnedList'
    };

    // Mapping button ID ke URL
    const pageToUrlMap = {
        'btnDashboard': '/dashboard',
        'btnKoleksi': '/koleksi-buku',
        'btnDaftarPengguna': '/daftar-anggota',
        'btnDaftarPetugas': '/daftar-petugas',
        'btnPeminjaman': '/peminjaman',
        'btnPengembalian': '/pengembalian',
        'btnSelectedBooks': '/selected-books',
        'btnDaftarPeminjam': '/daftar-peminjam',
        'btnReturnedList': '/returned-list'
    };

    // Sinkronisasi URL dengan currentPage state
    useEffect(() => {
        const pageFromUrl = urlToPageMap[location.pathname];
        if (pageFromUrl && pageFromUrl !== currentPage) {
            navigateTo(pageFromUrl);
        }
    }, [location.pathname]);

    // Sinkronisasi currentPage state dengan URL
    useEffect(() => {
        const urlFromPage = pageToUrlMap[currentPage];
        if (urlFromPage && location.pathname !== urlFromPage) {
            navigate(urlFromPage, { replace: false });
        }
    }, [currentPage]);

    // Redirect ke dashboard jika URL tidak valid atau root
    useEffect(() => {
        if (location.pathname === '/' || !urlToPageMap[location.pathname]) {
            navigate('/dashboard', { replace: true });
        }
    }, [location.pathname, user]);

    return children;
}

// Komponen untuk route yang memerlukan role tertentu
function RoleBasedRoute({ children, allowedRoles, userRole }) {
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

function PageRouter() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <PageSync>
            <Routes>
                {/* Route untuk semua role */}

                {/* Route untuk Admin */}
                {user.role === 'Admin' && (
                    <>
                        <Route path="/dashboard" element={<DashboardAdmin />} />
                        <Route path="/daftar-anggota" element={<Anggota title="Daftar Anggota" />} />
                        <Route path="/daftar-petugas" element={<Petugas title="Daftar Petugas" />} />
                        <Route path="/koleksi-buku" element={<KoleksiBukuOperator />} />
                        <Route path="/selected-books" element={<SelectedBooks title="Buku yang Ingin Dipinjam" />} />
                        <Route path="/daftar-peminjam" element={<BorrowList title="Daftar Peminjam" />} />
                        <Route path="/returned-list" element={<ReturnedList title="Daftar Buku Yang Sudah Dikembalikan" />} />
                    </>
                )}

                {/* Route untuk Operator */}
                {user.role === 'Operator' && (
                    <>
                        <Route path="/dashboard" element={<DashboardOperator />} />
                        <Route path="/koleksi-buku" element={<KoleksiBukuOperator />} />
                        <Route path="/pengembalian" element={<Pengembalian />} />
                        <Route path="/selected-books" element={<SelectedBooks title="Buku yang Ingin Dipinjam" />} />
                        <Route path="/daftar-peminjam" element={<BorrowList title="Daftar Peminjam" />} />
                        <Route path="/returned-list" element={<ReturnedList title="Daftar Buku Yang Sudah Dikembalikan" />} />
                    </>
                )}

                {/* Route untuk User */}
                {user.role === 'User' && (
                    <>
                        <Route path="/dashboard" element={<DashboardUser />} />
                        <Route path="/koleksi-buku" element={<KoleksiBukuUser />} />
                        <Route path="/peminjaman" element={<Peminjaman />} />
                        <Route path="/selected-books" element={<SelectedBooks title="Buku yang Ingin Dipinjam" />} />
                        <Route path="/daftar-peminjam" element={<BorrowList title="Daftar Peminjam" />} />
                        <Route path="/returned-list" element={<ReturnedList title="Daftar Buku Yang Sudah Dikembalikan" />} />
                    </>
                )}

                {/* Redirect default ke dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Catch all route - redirect ke dashboard jika URL tidak ditemukan */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </PageSync>
    );
}

export default PageRouter;