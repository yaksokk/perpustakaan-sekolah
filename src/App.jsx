import { useAuth, AuthProvider, PageProvider } from './context';
import { PageRouter } from './components';
import Login from './pages/auth/login';

function AppContent() {
    const { user, isLoading } = useAuth();

    // Loading state
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Loading...
            </div>
        );
    }

    // Jika user belum login, tampilkan halaman login
    if (!user) {
        return <Login />;
    }

    // Jika user sudah login, tampilkan page router
    return (
        <PageProvider>
            <PageRouter />
        </PageProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;