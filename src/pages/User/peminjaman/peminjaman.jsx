// ...import tetap
import './peminjaman.css';
import { Navbar, Sidebar } from '../../../components';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context';

function Peminjaman() {
    const [showSidebar, setShowSidebar] = useState(true);
    const { user } = useAuth();

    const [daftarAnggota, setDaftarAnggota] = useState([]);
    const [filteredAnggota, setFilteredAnggota] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const [daftarBuku, setDaftarBuku] = useState([]);
    const [filteredBuku, setFilteredBuku] = useState([]);
    const [showDropdownBuku, setShowDropdownBuku] = useState(false);
    const judulRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (judulRef.current && !judulRef.current.contains(event.target)) {
                setShowDropdownBuku(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const [formData, setFormData] = useState({
        judulBuku: '',
        status: '',
        usernamePeminjam: '',
        namaPeminjam: '',
        tanggalPinjam: '',
        tanggalKembali: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                status: user.profesi || 'siswa'
            }));
        }

        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({
            ...prev,
            tanggalPinjam: today
        }));
    }, [user]);

    useEffect(() => {
        if (formData.tanggalPinjam) {
            const pinjamDate = new Date(formData.tanggalPinjam);
            const kembaliDate = new Date(pinjamDate);
            kembaliDate.setDate(pinjamDate.getDate() + 7);
            const kembaliString = kembaliDate.toISOString().split('T')[0];
            setFormData(prev => ({
                ...prev,
                tanggalKembali: kembaliString
            }));
        }
    }, [formData.tanggalPinjam]);

    useEffect(() => {
        const fetchAnggota = async () => {
            try {
                const res = await fetch('/api/user/anggota');
                const result = await res.json();
                setDaftarAnggota(result.data || []);
            } catch (err) {
                console.error('Gagal memuat daftar anggota:', err);
            }
        };

        const fetchBuku = async () => {
            try {
                const res = await fetch('/api/books/all');
                const result = await res.json();
                setDaftarBuku(result || []);
            } catch (err) {
                console.error('Gagal memuat daftar buku:', err);
            }
        };

        fetchAnggota();
        fetchBuku();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleJudulChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, judulBuku: value }));

        const filtered = daftarBuku.filter(buku =>
            buku.judul.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredBuku(filtered);
        setShowDropdownBuku(true);
    };

    const handleSelectBuku = (judul) => {
        setFormData(prev => ({
            ...prev,
            judulBuku: judul
        }));
        setFilteredBuku([]);
        setShowDropdownBuku(false);
    };

    const handleNamaChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            namaPeminjam: value,
            usernamePeminjam: ''
        }));

        if (value.length === 0) {
            setFilteredAnggota([]);
            setShowDropdown(false);
            return;
        }

        const filtered = daftarAnggota.filter(
            anggota =>
                anggota.name.toLowerCase().includes(value.toLowerCase()) ||
                anggota.username.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredAnggota(filtered);
        setShowDropdown(true);
    };

    const handleSelectAnggota = (anggota) => {
        setFormData(prev => ({
            ...prev,
            namaPeminjam: anggota.name,
            usernamePeminjam: anggota.username
        }));
        setFilteredAnggota([]);
        setShowDropdown(false);
    };

    const handleSimpan = async () => {
        const { judulBuku, status, usernamePeminjam, tanggalPinjam, tanggalKembali } = formData;

        if (!judulBuku || !status || !usernamePeminjam || !tanggalPinjam || !tanggalKembali) {
            alert('Harap lengkapi semua field!');
            return;
        }

        const tglPinjam = new Date(tanggalPinjam);
        const tglKembali = new Date(tanggalKembali);
        if (tglKembali <= tglPinjam) {
            alert('Tanggal pengembalian harus setelah tanggal peminjaman!');
            return;
        }

        try {
            const response = await fetch('/api/peminjaman', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    judulBuku,
                    status,
                    username_peminjam: usernamePeminjam,
                    nama_peminjam: formData.namaPeminjam,
                    tanggal_pinjam: tanggalPinjam,
                    tanggal_kembali: tanggalKembali
                })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Gagal menyimpan data peminjaman');

            alert('Data peminjaman berhasil disimpan!');
            resetForm();
        } catch (error) {
            alert('Error: ' + error.message);
            console.error('Error menyimpan peminjaman:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            judulBuku: '',
            status: user?.profesi || '',
            usernamePeminjam: '',
            namaPeminjam: '',
            tanggalPinjam: new Date().toISOString().split('T')[0],
            tanggalKembali: ''
        });
        setFilteredAnggota([]);
        setShowDropdown(false);
        setFilteredBuku([]);
        setShowDropdownBuku(false);
    };

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Sidebar isActive={showSidebar} />
                <main id='peminjamanBuku' className='content'>
                    <section id="peminjaman">
                        <h1>PEMINJAMAN BUKU</h1>
                        <div className="form-container">
                            <div className="form-header">
                                <h2>Peminjaman Buku</h2>
                            </div>
                            <form className="form-content">
                                <div className="form-group" style={{ position: 'relative' }} ref={judulRef}>
                                    <label htmlFor="judulBuku">Judul Buku</label>
                                    <input
                                        type="text"
                                        id="judulBuku"
                                        name="judulBuku"
                                        value={formData.judulBuku}
                                        onChange={handleJudulChange}
                                        onFocus={() => {
                                            setFilteredBuku(daftarBuku);
                                            setShowDropdownBuku(true);
                                        }}
                                        placeholder="Cari atau pilih judul buku"
                                        className="form-input"
                                        autoComplete="off"
                                        required
                                    />
                                    {showDropdownBuku && filteredBuku.length > 0 && (
                                        <ul className="dropdown-suggestion">
                                            {filteredBuku.map((buku, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => handleSelectBuku(buku.judul)}
                                                    style={{
                                                        padding: '5px',
                                                        cursor: 'pointer',
                                                        backgroundColor: '#fff',
                                                        borderBottom: '1px solid #ddd'
                                                    }}
                                                >
                                                    {buku.judul}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status">Profesi</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Pilih Status</option>
                                        <option value="guru">Guru</option>
                                        <option value="siswa">Siswa</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label htmlFor="namaPeminjam">Nama Peminjam</label>
                                    <input
                                        type="text"
                                        id="namaPeminjam"
                                        name="namaPeminjam"
                                        value={formData.namaPeminjam}
                                        onChange={handleNamaChange}
                                        placeholder="Cari nama atau username"
                                        className="form-input"
                                        autoComplete="off"
                                        required
                                    />
                                    {showDropdown && filteredAnggota.length > 0 && (
                                        <ul className="dropdown-suggestion">
                                            {filteredAnggota.map(anggota => (
                                                <li
                                                    key={anggota.username}
                                                    onClick={() => handleSelectAnggota(anggota)}
                                                    style={{
                                                        padding: '5px',
                                                        cursor: 'pointer',
                                                        backgroundColor: '#fff',
                                                        borderBottom: '1px solid #ddd'
                                                    }}
                                                >
                                                    <strong>{anggota.name}</strong> ({anggota.username})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tanggalPinjam">Tanggal Pinjam</label>
                                    <input
                                        type="date"
                                        id="tanggalPinjam"
                                        name="tanggalPinjam"
                                        value={formData.tanggalPinjam}
                                        onChange={handleInputChange}
                                        className="form-input date-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tanggalKembali">Tanggal Kembali</label>
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
                                    <button type="button" className="btn btn-primary" onClick={handleSimpan}>
                                        SIMPAN
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
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

export default Peminjaman;
