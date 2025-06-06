import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth-context/authContext';

function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;