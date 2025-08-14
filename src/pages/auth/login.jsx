import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reactLogo from '../../assets/images/logo_nobg.jpg';
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context';
import './login.css';

function Login() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validasi input
        if (!username || !password) {
            setError('Username dan password harus diisi!');
            setIsLoading(false);
            return;
        }

        // Proses login ke backend
        try {
            const result = await login(username, password, role);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message || 'Login gagal!');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat login.');
            console.error(err);
        }

        setIsLoading(false);
    };



    return (
        <div id="login" className="containerLogin">
            <div className="logo">
                <img src={reactLogo} alt="Logo" />
                <span>Sistem Perpustakaan</span>
            </div>
            <div className="login-box">
                <h2>SD GMIM KANEYAN</h2>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div
                            style={{
                                color: 'red',
                                marginBottom: '10px',
                                fontSize: '14px',
                                textAlign: 'center',
                            }}
                        >
                            {error}
                        </div>
                    )}
                    <div className="input-group">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                        <span className="icon">
                            <FaUser />
                        </span>
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <span className="icon">
                            <FaLock />
                        </span>
                    </div>
                    <div className="input-group">
                        <select value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="">Pilih Role</option>
                            <option value="admin">Admin</option>
                            <option value="operator">Operator</option>
                            <option value="user">User Biasa</option>
                        </select>
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'LOADING...' : 'MASUK'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
