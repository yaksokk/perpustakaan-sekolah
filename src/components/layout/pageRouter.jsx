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
  Petugas,
} from '../../pages';
import { usePage, useAuth } from '../../context';
import ProtectedRoute from './protectedRoute';

function PageSync({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPage, navigateTo } = usePage();
  const { user } = useAuth();

  const urlToPageMap = {
    '/dashboard': 'btnDashboard',
    '/koleksi-buku': 'btnKoleksi',
    '/daftar-anggota': 'btnDaftarPengguna',
    '/daftar-petugas': 'btnDaftarPetugas',
    '/peminjaman': 'btnPeminjaman',
    '/pengembalian': 'btnPengembalian',
    '/selected-books': 'btnSelectedBooks',
    '/daftar-peminjam': 'btnDaftarPeminjam',
    '/returned-list': 'btnReturnedList',
  };

  const pageToUrlMap = Object.fromEntries(
    Object.entries(urlToPageMap).map(([k, v]) => [v, k])
  );

  useEffect(() => {
    const pageFromUrl = urlToPageMap[location.pathname];
    if (pageFromUrl && pageFromUrl !== currentPage) {
      navigateTo(pageFromUrl);
    }
  }, [location.pathname]);

  useEffect(() => {
    const urlFromPage = pageToUrlMap[currentPage];
    if (urlFromPage && location.pathname !== urlFromPage) {
      navigate(urlFromPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (location.pathname === '/' || !urlToPageMap[location.pathname]) {
      navigate('/dashboard');
    }
  }, [location.pathname, user]);

  return children;
}

function PageRouter() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const role = user.role.toLowerCase();

  return (
    <PageSync>
      <Routes>
        {/* Admin routes */}
        {role === 'admin' && (
          <>
            <Route path="/dashboard" element={<DashboardAdmin />} />
            <Route path="/daftar-anggota" element={<ProtectedRoute requiredRole="admin"><Anggota title="Daftar Anggota" /></ProtectedRoute>} />
            <Route
              path="/daftar-petugas"
              element={<ProtectedRoute requiredRole="admin"><Petugas title="Daftar Petugas" /></ProtectedRoute>}
            />
            <Route
              path="/koleksi-buku"
              element={<ProtectedRoute requiredRole="admin"><KoleksiBukuOperator /></ProtectedRoute>}
            />
          </>
        )}

        {/* Operator routes */}
        {role === 'operator' && (
          <>
            <Route path="/dashboard" element={<DashboardOperator />} />
            <Route
              path="/peminjaman"
              element={<ProtectedRoute requiredRole="operator"><Peminjaman /></ProtectedRoute>}
            />
            <Route
              path="/pengembalian"
              element={<ProtectedRoute requiredRole="operator"><Pengembalian /></ProtectedRoute>}
            />
            <Route
              path="/koleksi-buku"
              element={<ProtectedRoute requiredRole="operator"><KoleksiBukuOperator /></ProtectedRoute>}
            />
          </>
        )}

        {/* User routes */}
        {role === 'user' && (
          <>
            <Route path="/dashboard" element={<DashboardUser />} />
            <Route
              path="/koleksi-buku"
              element={<ProtectedRoute requiredRole="user"><KoleksiBukuUser /></ProtectedRoute>}
            />
            <Route
              path="/peminjaman"
              element={<ProtectedRoute requiredRole="user"><Peminjaman /></ProtectedRoute>}
            />
          </>
        )}


        {/* Shared */}
        <Route
          path="/selected-books"
          element={<ProtectedRoute><SelectedBooks title="Buku yang Ingin Dipinjam" /></ProtectedRoute>}
        />
        <Route
          path="/daftar-peminjam"
          element={<ProtectedRoute><BorrowList title="Daftar Peminjam" /></ProtectedRoute>}
        />
        <Route
          path="/returned-list"
          element={<ProtectedRoute><ReturnedList title="Daftar Buku Yang Sudah Dikembalikan" /></ProtectedRoute>}
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </PageSync>
  );
}

export default PageRouter;
