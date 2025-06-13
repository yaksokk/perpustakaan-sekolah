import { createContext, useContext, useState, useEffect } from 'react';

// Membuat Context untuk Authentication
const AuthContext = createContext();

// Provider Component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [loadError, setLoadError] = useState(null);

    // Fungsi untuk load data dari users.json
    const loadUsersData = async () => {
        try {
            setIsLoading(true);
            setLoadError(null);

            // Fetch data dari users.json
            const response = await fetch('/users.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Transform data dari JSON ke format yang digunakan untuk authentication
            const transformedUsers = [];

            // Extract admin user
            if (data.role && data.role[0] && data.role[0].admin) {
                const admin = data.role[0].admin;
                transformedUsers.push({
                    username: admin.username,
                    password: admin.password,
                    name: admin.name,
                    role: 'Admin'
                });
            }

            // Extract staff users
            if (data.role && data.role[0] && data.role[0].staff) {
                data.role[0].staff.forEach(staff => {
                    if (staff.available) {
                        transformedUsers.push({
                            username: staff.username,
                            password: staff.password,
                            name: staff.username, // Menggunakan username sebagai name jika tidak ada
                            role: 'Operator'
                        });
                    }
                });
            }

            // Extract regular users
            if (data.role && data.role[0] && data.role[0].user) {
                data.role[0].user.forEach(user => {
                    if (user.available) {
                        transformedUsers.push({
                            username: user.username,
                            password: user.password,
                            name: user.name,
                            role: 'User',
                            profesi: user.profesi
                        });
                    }
                });
            }

            setUsers(transformedUsers);

        } catch (error) {
            console.error('Error loading users data:', error);
            setLoadError(error.message);

        } finally {
            setIsLoading(false);
        }
    };

    // Load users data dan cek session saat component mount
    useEffect(() => {
        const initializeAuth = async () => {
            // Load users data dari JSON
            await loadUsersData();

            // Cek apakah user sudah login saat aplikasi dimuat
            const savedUser = sessionStorage.getItem('currentUser');
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (error) {
                    console.error('Error parsing saved user:', error);
                    sessionStorage.removeItem('currentUser');
                }
            }
        };

        initializeAuth();
    }, []);

    // Fungsi untuk login
    const login = (username, password) => {
        if (users.length === 0) {
            return { success: false, message: 'Data user belum dimuat. Silakan coba lagi.' };
        }

        const foundUser = users.find(
            user => user.username === username && user.password === password
        );

        if (foundUser) {
            const userData = {
                username: foundUser.username,
                name: foundUser.name,
                role: foundUser.role,
                ...(foundUser.profesi && { profesi: foundUser.profesi })
            };
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

    // Fungsi untuk reload users data (jika diperlukan)
    const reloadUsers = () => {
        loadUsersData();
    };

    const value = {
        user,
        login,
        logout,
        isLoading,
        loadError,
        reloadUsers,
        usersCount: users.length
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