import './pengembalian.css';
import { Navbar, Sidebar } from '../../../components';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context';

function Pengembalian() {
    const [showSidebar, setShowSidebar] = useState(true);
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        judulBuku: '',
        usernamePeminjam: '',
        tanggalKembali: ''
    });

    const [daftarBuku, setDaftarBuku] = useState([]);

    useEffect(() => {
        const fetchBuku = async () => {
            try {
                const res = await fetch('/api/books/all');
                const data = await res.json();
                setDaftarBuku(data);
            } catch (err) {
                console.error('Gagal memuat daftar buku:', err);
            }
        };

        fetchBuku();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { judulBuku, usernamePeminjam, tanggalKembali } = formData;

        if (!judulBuku || !usernamePeminjam || !tanggalKembali) {
            alert('Mohon lengkapi semua field!');
            return;
        }

        try {
            const response = await fetch('/api/pengembalian', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    judulBuku,
                    username_peminjam: usernamePeminjam,
                    tanggal_pengembalian_aktual: tanggalKembali
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            alert('Pengembalian berhasil diproses!');
            handleReset();
        } catch (error) {
            alert('Error: ' + error.message);
            console.error('Pengembalian error:', error);
        }
    };

    const handleReset = () => {
        setFormData({
            judulBuku: '',
            usernamePeminjam: '',
            tanggalKembali: ''
        });
    };

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Sidebar isActive={showSidebar} />
                <main id='pengembalianBuku' className='content'>
                    <section id="pengembalian">
                        <h1>PENGEMBALIAN BUKU</h1>
                        <div className="form-container">
                            <div className="form-header">
                                <h2>Form Pengembalian Buku</h2>
                            </div>
                            <form onSubmit={handleSubmit} className="form-content">
                                <div className="form-group">
                                    <label htmlFor="judulBuku">Judul Buku</label>
                                    <select
                                        id="judulBuku"
                                        name="judulBuku"
                                        value={formData.judulBuku}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        required
                                    >
                                        <option value="">Pilih buku</option>
                                        {daftarBuku.map(buku => (
                                            <option key={buku.id} value={buku.judul}>
                                                {buku.judul}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="usernamePeminjam">Username Peminjam</label>
                                    <input
                                        type="text"
                                        id="usernamePeminjam"
                                        name="usernamePeminjam"
                                        value={formData.usernamePeminjam}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Masukkan username peminjam"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tanggalKembali">Tanggal Dikembalikan</label>
                                    <input
                                        type="date"
                                        id="tanggalKembali"
                                        name="tanggalKembali"
                                        value={formData.tanggalKembali}
                                        onChange={handleInputChange}
                                        className="form-input date-input"
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-kembali">
                                        KEMBALIKAN
                                    </button>
                                    <button type="button" onClick={handleReset} className="btn-batal">
                                        BATAL
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

export default Pengembalian;
