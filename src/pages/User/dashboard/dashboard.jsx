import './dashboard.css';
import { Navbar, Sidebar, Table } from '../../../components';
import { useState, useEffect } from 'react';
import { usePage, useAuth } from '../../../context';

const API_URL = 'http://localhost:5000/api/admin/dashboard';

function Dashboard() {
    const [showSidebar, setShowSidebar] = useState(true);
    const { navigateTo } = usePage();
    const [popupBarVisible, setPopupBarVisible] = useState(false);
    const [popupToReturnVisible, setPopupToReturnVisible] = useState(false);
    const [selectedBulan, setSelectedBulan] = useState(null);
    const [popupType, setPopupType] = useState('');
    const { user } = useAuth();

    // State untuk data dashboard
    const [dashboardData, setDashboardData] = useState({
        jumlahBuku: 0,
        bukuTerbanyak: { judul: '', total: 0 },
        bukuSeringDipinjam: [],
        bukuPeminjamanTerbanyak: { judul: '', total_peminjaman: 0 }
    });

    // Fetch semua data dashboard saat component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch semua data secara parallel
            const [
                jumlahBukuRes,
                bukuTerbanyakRes,
                bukuSeringDipinjamRes,
                bukuPeminjamanTerbanyakRes
            ] = await Promise.all([
                fetch(`${API_URL}/jumlah-buku`, { headers }),
                fetch(`${API_URL}/buku-terbanyak`, { headers }),
                fetch(`${API_URL}/sering-dipinjam`, { headers }),
                fetch(`${API_URL}/peminjaman-terbanyak`, { headers })
            ]);

            const jumlahBuku = await jumlahBukuRes.json();
            const bukuTerbanyak = await bukuTerbanyakRes.json();
            const bukuSeringDipinjam = await bukuSeringDipinjamRes.json();
            const bukuPeminjamanTerbanyak = await bukuPeminjamanTerbanyakRes.json();

            setDashboardData({
                jumlahBuku: jumlahBuku.data?.jumlah || 0,
                bukuTerbanyak: bukuTerbanyak.data || { judul: '', total: 0 },
                bukuSeringDipinjam: bukuSeringDipinjam.data || [],
                bukuPeminjamanTerbanyak: bukuPeminjamanTerbanyak.data || { judul: '', total_peminjaman: 0 }
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handleToReturnClick = () => {
        setPopupToReturnVisible(true);
    };

    const handleInfoBoxClick = (type) => {
        setPopupType(type);
        setPopupBarVisible(true);
    };

    const closePopups = () => {
        setPopupBarVisible(false);
        setPopupToReturnVisible(false);
        setPopupType('');
        setSelectedBulan(null);
    };

    const renderPopupContent = () => {
        switch (popupType) {
            case 'borrowers':
                return <ListBorrowersByMonth bulan={selectedBulan} />;
            case 'mostBorrowed':
                return <BukuDenganPeminjamanTerbanyak data={dashboardData.bukuSeringDipinjam} />;
            case 'frequentlyBorrowed':
                return <BukuYangSeringDipinjam data={dashboardData.bukuSeringDipinjam} />;
            case 'mostBooks':
                return <BukuTerbanyakDetail data={dashboardData.bukuTerbanyak} />;
            default:
                return <ListBorrowersByMonth bulan={selectedBulan} />;
        }
    };

    const getPopupTitle = () => {
        switch (popupType) {
            case 'borrowers':
                return `Daftar Peminjam - ${selectedBulan}`;
            case 'mostBorrowed':
                return 'Buku Dengan Peminjaman Terbanyak';
            case 'frequentlyBorrowed':
                return 'Buku Yang Sering Dipinjam';
            case 'mostBooks':
                return 'Detail Buku Terbanyak';
            default:
                return `Daftar Peminjam - ${selectedBulan}`;
        }
    };

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex' }}>
                <Sidebar isActive={showSidebar} />
                <main id="dashboard" className="content">
                    {user && (
                        <p style={{ fontSize: '21px', fontWeight: 'bold', marginTop: '-10px', marginBottom: '20px', textAlign: 'center' }}>
                            Selamat Datang, {user.name || user.username}
                        </p>
                    )}
                    <h1>Dashboard</h1>
                    <InfoBoxes
                        dashboardData={dashboardData}
                        navigateTo={navigateTo}
                        onToReturnClick={handleToReturnClick}
                        onInfoBoxClick={handleInfoBoxClick}
                    />
                    {popupBarVisible && (
                        <PopupModal title={getPopupTitle()} onClose={closePopups}>
                            {renderPopupContent()}
                        </PopupModal>
                    )}
                    {popupToReturnVisible && (
                        <PopupModal title="Daftar Buku Yang Harus Dikembalikan" onClose={closePopups}>
                            <BooksToReturn />
                        </PopupModal>
                    )}
                </main>
            </div>
        </>
    );
}

function InfoBoxes({ dashboardData, navigateTo, onToReturnClick, onInfoBoxClick }) {
    const boxes = [
        {
            color: '#7266d1',
            count: dashboardData.jumlahBuku,
            label: 'Jumlah Buku',
            action: () => navigateTo('btnKoleksi')
        },
        {
            color: '#d16666',
            count: dashboardData.bukuSeringDipinjam.length,
            label: 'Buku yang Sering Dipinjam',
            action: () => onInfoBoxClick('frequentlyBorrowed')
        },
        {
            color: '#3539b1',
            count: dashboardData.bukuPeminjamanTerbanyak.total_peminjaman || 0,
            label: 'Peminjaman Terbanyak',
            action: () => onInfoBoxClick('mostBorrowed')
        },
    ];

    return (
        <div className="wrapper">
            {boxes.map((box, index) => (
                <div key={index} className="box" style={{ backgroundColor: box.color }}>
                    <span>{box.count}</span>
                    <span>{box.label}</span>
                    <button className="info" onClick={box.action}>More Info</button>
                </div>
            ))}
            <BukuTerbanyak data={dashboardData.bukuTerbanyak} onInfoBoxClick={onInfoBoxClick} />
        </div>
    );
}

function PopupModal({ title, onClose, children }) {
    return (
        <div className="popup-modal">
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
}

function BukuYangSeringDipinjam({ data }) {
    const columns = [
        { header: 'No', render: (row, index) => index + 1 },
        { header: 'Judul Buku', accessor: 'judul' },
        { header: 'Total Peminjaman', accessor: 'total_peminjaman' },
        { header: 'Total Peminjam Unik', accessor: 'total_peminjam_unik' },
    ];

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            {data && data.length > 0 ? (
                <Table columns={columns} data={data} />
            ) : (
                <p>Belum ada data buku yang sering dipinjam.</p>
            )}
        </div>
    );
}

function BukuDenganPeminjamanTerbanyak({ data }) {
    // Urutkan data berdasarkan total_peminjaman dari yang terbanyak
    const sortedData = data ? [...data].sort((a, b) => b.total_peminjaman - a.total_peminjaman) : [];

    const columns = [
        { header: 'Ranking', render: (row, index) => index + 1 },
        { header: 'Judul Buku', accessor: 'judul' },
        { header: 'Total Peminjaman', accessor: 'total_peminjaman' },
        { header: 'Total Peminjam Unik', accessor: 'total_peminjam_unik' },
    ];

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            {sortedData && sortedData.length > 0 ? (
                <Table columns={columns} data={sortedData} />
            ) : (
                <p>Belum ada data peminjaman buku.</p>
            )}
        </div>
    );
}

function BukuTerbanyak({ data, onInfoBoxClick }) {
    return (
        <div className="boxBook" style={{ backgroundColor: '#ff4081' }}>
            <span>{data.total || 0}</span>
            <span>{data.judul || 'Belum ada data'}</span>
            <span>Buku Terbanyak</span>
        </div>
    );
}

function BukuTerbanyakDetail({ data }) {
    return (
        <div className="wrapper" style={{ marginTop: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h3>Detail Buku Terbanyak</h3>
                <p><strong>Judul:</strong> {data.judul || 'Belum ada data'}</p>
                <p><strong>Total Buku:</strong> {data.total || 0} eksemplar</p>
            </div>
        </div>
    );
}

function ListBorrowersByMonth({ bulan }) {
    const [borrowers, setBorrowers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (bulan) {
            fetchBorrowersByMonth();
        }
    }, [bulan]);

    const fetchBorrowersByMonth = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/peminjam-by-month/${bulan}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            setBorrowers(result.data || []);
        } catch (error) {
            console.error('Error fetching borrowers:', error);
            setBorrowers([]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'No', render: (row, index) => index + 1 },
        { header: 'Nama Peminjam', accessor: 'name' },
        { header: 'Judul Buku', accessor: 'title' },
        { header: 'Tanggal Pinjam', accessor: 'date' },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            {borrowers.length > 0 ? (
                <Table columns={columns} data={borrowers} />
            ) : (
                <p>Belum ada data peminjam untuk bulan {bulan}.</p>
            )}
        </div>
    );
}

function BooksToReturn() {
    const [booksToReturn, setBooksToReturn] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooksToReturn();
    }, []);

    const fetchBooksToReturn = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/harus-dikembalikan`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            setBooksToReturn(result.data || []);
        } catch (error) {
            console.error('Error fetching books to return:', error);
            setBooksToReturn([]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'No', render: (row, index) => index + 1 },
        { header: 'Judul Buku', accessor: 'judul' },
        { header: 'Nama Peminjam', accessor: 'nama_peminjam' },
        { header: 'Tanggal Pinjam', accessor: 'tanggal_pinjam' },
        { header: 'Tanggal Kembali', accessor: 'tanggal_kembali' },
        {
            header: 'Status',
            render: (row) => (
                <span style={{
                    color: row.status_keterlambatan === 'terlambat' ? 'red' : 'orange',
                    fontWeight: 'bold'
                }}>
                    {row.status_keterlambatan === 'terlambat' ?
                        `Terlambat ${row.hari_terlambat} hari` :
                        'Harus dikembalikan'
                    }
                </span>
            )
        },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            {booksToReturn.length > 0 ? (
                <Table columns={columns} data={booksToReturn} />
            ) : (
                <p>Tidak ada buku yang harus dikembalikan.</p>
            )}
        </div>
    );
}

export default Dashboard;