import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    // ✅ Fungsi login ke backend
    const login = async (username, password, role) => {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role }),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
            throw new Error(result.message || 'Login gagal');
        }

        const { token, user: userData } = result.data;

        const userPayload = {
            username: userData.username,
            role: userData.role,
            name: userData.name,
            token
        };

        setUser(userPayload);
        localStorage.setItem('currentUser', JSON.stringify(userPayload));

        return { success: true, role: userData.role };
    };



    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    useEffect(() => {
        const saved = localStorage.getItem('currentUser');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setUser(parsed);
            } catch {
                localStorage.removeItem('currentUser');
            }
        }
    }, []);

    const value = {
        user,
        login,
        logout,
        isLoading,
        authError,
        token: user?.token || null,
        role: user?.role || null,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth harus digunakan dalam AuthProvider');
    }
    return context;
}
