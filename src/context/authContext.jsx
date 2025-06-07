import { createContext, useContext, useState, useEffect } from 'react';

// Membuat Context untuk Authentication
const AuthContext = createContext();

// Provider Component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Data user dummy untuk login
    const dummyUsers = [
        { username: 'admin', password: 'admin123', name: 'Administrator', role: 'Admin' },
        { username: 'operator', password: 'operator123', name: 'Operator', role: 'Operator' },
        { username: 'user', password: 'user123', name: 'User Biasa', role: 'User' }
    ];

    // Cek apakah user sudah login saat aplikasi dimuat
    useEffect(() => {
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    // Fungsi untuk login
    // Fungsi untuk login
    const login = (username, password) => {
        const foundUser = dummyUsers.find(
            user => user.username === username && user.password === password
        );

        if (foundUser) {
            const userData = { username: foundUser.username, name: foundUser.name, role: foundUser.role };
            setUser(userData);
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
            return { success: true };
        } else {
            return { success: false, message: 'Username atau password salah!' };
        }
    };

    // Fungsi untuk logout
    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('currentUser');
    };

    const value = {
        user,
        login,
        logout,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook untuk menggunakan AuthContext
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth harus digunakan dalam AuthProvider');
    }
    return context;
}