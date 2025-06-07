import './pengembalian.css'
import { Navbar, Sidebar } from '../../../components';
import { useState } from 'react';

function Pengembalian() {
    const [showSidebar, setShowSidebar] = useState(true);

    // State untuk form peminjaman
    const [formData, setFormData] = useState({
        judulBuku: '',
        namaPeminjam: '',
        tanggalPinjam: '',
        tanggalKembali: ''
    });

    // Data dummy untuk dropdown buku
    const daftarBuku = [
        { id: 1, judul: 'Laskar Pelangi' },
        { id: 2, judul: 'Bumi Manusia' },
        { id: 3, judul: 'Ronggeng Dukuh Paruk' },
        { id: 4, judul: 'Ayat-Ayat Cinta' },
        { id: 5, judul: 'Negeri 5 Menara' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi form
        if (!formData.judulBuku || !formData.namaPeminjam || !formData.tanggalPinjam || !formData.tanggalKembali) {
            alert('Mohon lengkapi semua field!');
            return;
        }

        // Validasi tanggal
        const tanggalPinjam = new Date(formData.tanggalPinjam);
        const tanggalKembali = new Date(formData.tanggalKembali);

        if (tanggalKembali <= tanggalPinjam) {
            alert('Tanggal pengembalian harus setelah tanggal peminjaman!');
            return;
        }

        console.log('Data Peminjaman:', formData);
        alert('Data peminjaman berhasil disimpan!');

        // Reset form
        setFormData({
            judulBuku: '',
            namaPeminjam: '',
            tanggalPinjam: '',
            tanggalKembali: ''
        });
    };

    const handleReset = () => {
        setFormData({
            judulBuku: '',
            namaPeminjam: '',
            tanggalPinjam: '',
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
                                <h2>Pengembalian Buku</h2>
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
                                    >
                                        <option value="">masukkan judul buku</option>
                                        {daftarBuku.map(buku => (
                                            <option key={buku.id} value={buku.judul}>
                                                {buku.judul}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="namaPeminjam">Nama Peminjam</label>
                                    <select
                                        id="namaPeminjam"
                                        name="namaPeminjam"
                                        value={formData.namaPeminjam}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="">masukkan nama</option>
                                        <option value="Ahmad Fauzi">Ahmad Fauzi</option>
                                        <option value="Siti Nurhaliza">Siti Nurhaliza</option>
                                        <option value="Budi Santoso">Budi Santoso</option>
                                        <option value="Rina Handayani">Rina Handayani</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tanggalPinjam">Tanggal di pinjam</label>
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
                                    <label htmlFor="tanggalKembali">Tanggal di kembalikan</label>
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
                                    <button type="button" onClick={handleReset} className="btn-kembali">
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
    )
}

export default Pengembalian