import { useState } from 'react';
import reactLogo from '../../assets/images/logo_nobg.jpg'
import { FaUser, FaLock } from 'react-icons/fa'
import { useAuth } from '../../context';
import './login.css'

function Login() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validasi input
        if (!username || !password) {
            setError('Username dan password harus diisi!');
            setIsLoading(false);
            return;
        }

        // Proses login
        const result = login(username, password);

        if (!result.success) {
            setError(result.message);
        }

        setIsLoading(false);
    };

    return (
        <div id='login' className="containerLogin">
            <div className="logo">
                <img src={reactLogo} alt="Logo" />
                <span>Sistem Perpustakaan</span>
            </div>
            <div className="login-box">
                <h2>SD GMIM KANEYAN</h2>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            color: 'red',
                            marginBottom: '10px',
                            fontSize: '14px',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}
                    <div className="input-group">
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                        <span className="icon"><FaUser /></span>
                    </div>
                    <div className="input-group">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        <span className="icon"><FaLock /></span>
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'LOADING...' : 'MASUK'}
                    </button>
                </form>
                <div style={{
                    marginTop: '20px',
                    fontSize: '12px',
                    color: '#666',
                    textAlign: 'center'
                }}>
                    <p>Demo Login:</p>
                    <p>Username: admin, Password: admin123</p>
                    <p>Username: operator, Password: operator123</p>
                    <p>Username: user, Password: user123</p>
                </div>
            </div>
        </div>
    )
}

export default Login