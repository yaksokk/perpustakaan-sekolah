import './dashboard.css';
import { Navbar, Sidebar, Table } from '../../../components';
import { useState, useEffect } from 'react';
import { usePage } from '../../../context';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const API_URL = 'http://localhost:5000/api/admin/dashboard';

// Fungsi untuk memproses data chart status buku
const processChartStatusBuku = (rawData) => {
    console.log('Raw chart status data:', rawData);

    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        console.log('No valid chart data, creating default data');
        return [
            { name: 'Tersedia', value: 0 },
            { name: 'Dipinjam', value: 0 }
        ];
    }

    // Konversi string ke number dengan benar
    const processedData = rawData.map(item => {
        const numericValue = Number(item.value || item.jumlah || 0);
        console.log(`Converting "${item.value}" to ${numericValue}`);

        return {
            name: item.name || item.status || 'Unknown',
            value: numericValue
        };
    });

    console.log('Processed chart data with numeric values:', processedData);
    return processedData;
};

function Dashboard() {
    const [showSidebar, setShowSidebar] = useState(true);
    const { navigateTo } = usePage();
    const [popupBarVisible, setPopupBarVisible] = useState(false);
    const [popupToReturnVisible, setPopupToReturnVisible] = useState(false);
    const [selectedBulan, setSelectedBulan] = useState(null);
    const [popupType, setPopupType] = useState('');

    // State untuk data dashboard
    const [dashboardData, setDashboardData] = useState({
        jumlahBuku: 0,
        bukuTerbanyak: { judul: '', total: 0 },
        jumlahAnggota: 0,
        bukuBelumDiambil: 0,
        bukuHarusDikembalikan: 0,
        bukuDikembalikan: 0,
        bukuSeringDipinjam: [],
        bukuPeminjamanTerbanyak: [],
        chartPeminjaman: [],
        chartStatusBuku: []
    });

    const [detailData, setDetailData] = useState({
        bukuHarusDikembalikan: [],
        bukuBelumDiambil: [],
        bukuSeringDipinjam: [],
        peminjamByMonth: []
    });

    // Fetch semua data dashboard
    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Parallel fetch untuk performa lebih baik
            const [
                jumlahBukuRes,
                bukuTerbanyakRes,
                bukuBelumDiambilRes,
                bukuHarusDikembalikanRes,
                bukuDikembalikanRes,
                bukuSeringDipinjamRes,
                bukuPeminjamanTerbanyakRes,
                chartPeminjamanRes,
                chartStatusBukuRes,
                detailHarusDikembalikanRes,
                detailBelumDiambilRes,
                detailSeringDipinjamRes
            ] = await Promise.all([
                fetch(`${API_URL}/jumlah-buku`, { headers }),
                fetch(`${API_URL}/buku-terbanyak`, { headers }),
                fetch(`${API_URL}/belum-diambil`, { headers }),
                fetch(`${API_URL}/harus-dikembalikan`, { headers }),
                fetch(`${API_URL}/dikembalikan`, { headers }),
                fetch(`${API_URL}/sering-dipinjam`, { headers }),
                fetch(`${API_URL}/peminjaman-terbanyak`, { headers }),
                fetch(`${API_URL}/chart-peminjaman`, { headers }),
                fetch(`${API_URL}/chart-status-buku`, { headers }),
                fetch(`${API_URL}/harus-dikembalikan`, { headers }),
                fetch(`${API_URL}/belum-diambil`, { headers }),
                fetch(`${API_URL}/sering-dipinjam`, { headers })
            ]);

            // Parse semua response
            const [
                jumlahBuku,
                bukuTerbanyak,
                bukuBelumDiambil,
                bukuHarusDikembalikan,
                bukuDikembalikan,
                bukuSeringDipinjam,
                bukuPeminjamanTerbanyak,
                chartPeminjaman,
                chartStatusBuku,
                detailHarusDikembalikan,
                detailBelumDiambil,
                detailSeringDipinjam
            ] = await Promise.all([
                jumlahBukuRes.json(),
                bukuTerbanyakRes.json(),
                bukuBelumDiambilRes.json(),
                bukuHarusDikembalikanRes.json(),
                bukuDikembalikanRes.json(),
                bukuSeringDipinjamRes.json(),
                bukuPeminjamanTerbanyakRes.json(),
                chartPeminjamanRes.json(),
                chartStatusBukuRes.json(),
                detailHarusDikembalikanRes.json(),
                detailBelumDiambilRes.json(),
                detailSeringDipinjamRes.json()
            ]);

            // Debug data untuk chart
            console.log('Chart Peminjaman Data:', chartPeminjaman.data);
            console.log('Chart Status Buku Data:', chartStatusBuku.data);

            // Process chart status buku data
            const processedChartStatusBuku = processChartStatusBuku(chartStatusBuku.data);

            // Update state
            setDashboardData({
                jumlahBuku: jumlahBuku.data?.jumlah || 0,
                bukuTerbanyak: bukuTerbanyak.data || { judul: '', total: 0 },
                bukuBelumDiambil: bukuBelumDiambil.data?.length || 0,
                bukuHarusDikembalikan: bukuHarusDikembalikan.data?.length || 0,
                bukuDikembalikan: bukuDikembalikan.data?.jumlah || 0,
                bukuSeringDipinjam: bukuSeringDipinjam.data || [],
                bukuPeminjamanTerbanyak: bukuPeminjamanTerbanyak.data || [],
                chartPeminjaman: chartPeminjaman.data || [],
                chartStatusBuku: processedChartStatusBuku
            });

            setDetailData({
                bukuHarusDikembalikan: detailHarusDikembalikan.data || [],
                bukuBelumDiambil: detailBelumDiambil.data || [],
                bukuSeringDipinjam: detailSeringDipinjam.data || [],
                peminjamByMonth: []
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Debug dashboard data
    useEffect(() => {
        console.log('Dashboard data updated:', dashboardData);
        console.log('Chart status buku types:', dashboardData.chartStatusBuku?.map(item => ({
            name: item.name,
            value: item.value,
            type: typeof item.value
        })));
    }, [dashboardData]);

    const COLORS = ['#3f51b5', '#9c27b0'];

    const handleBarClick = async (data) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/peminjam-by-month/${data.bulan}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();

            setDetailData(prev => ({
                ...prev,
                peminjamByMonth: result.data || []
            }));
            setSelectedBulan(data.bulan);
            setPopupType('borrowers');
            setPopupBarVisible(true);
        } catch (error) {
            console.error('Error fetching borrowers by month:', error);
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
                return <ListBorrowersByMonth data={detailData.peminjamByMonth} bulan={selectedBulan} />;
            case 'mostBorrowed':
                return <BukuDenganPeminjamanTerbanyak data={dashboardData.bukuPeminjamanTerbanyak} />;
            case 'frequentlyBorrowed':
                return <BukuYangSeringDipinjam data={dashboardData.bukuSeringDipinjam} />;
            case 'mostBooks':
                return <Terbanyak data={dashboardData.bukuTerbanyak} />;
            case 'belumDiambil':
                return <BukuBelumDiambil data={detailData.bukuBelumDiambil} />;
            case 'bukuYangSudahDikembalikan':
                return <ReturnedList data={detailData.bukuHarusDikembalikan} />;
            default:
                return <ListBorrowersByMonth data={detailData.peminjamByMonth} bulan={selectedBulan} />;
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
                return 'Buku Terbanyak';
            case 'belumDiambil':
                return 'Buku Yang Belum Diambil';
            case 'bukuYangSudahDikembalikan':
                return 'Buku Yang Sudah Dikembalikan';
            default:
                return `Daftar Peminjam - ${selectedBulan}`;
        }
    };

    // Test data sebagai fallback jika data asli tidak valid
    const testPieData = [
        { name: 'Tersedia', value: 112 },
        { name: 'Dipinjam', value: 0 }
    ];

    // Gunakan test data jika data asli kosong atau tidak valid
    const finalChartStatusBuku = dashboardData.chartStatusBuku.length > 0 &&
        dashboardData.chartStatusBuku.some(item => typeof item.value === 'number' && item.value >= 0)
        ? dashboardData.chartStatusBuku
        : testPieData;

    console.log('Final chart data being passed:', finalChartStatusBuku);

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex' }}>
                <Sidebar isActive={showSidebar} />
                <main id="dashboard" className="content">
                    <h1>Dashboard</h1>
                    <InfoBoxes
                        navigateTo={navigateTo}
                        onToReturnClick={handleToReturnClick}
                        onInfoBoxClick={handleInfoBoxClick}
                        dashboardData={dashboardData}
                    />
                    <ChartSection
                        dataPeminjam={dashboardData.chartPeminjaman}
                        handleBarClick={handleBarClick}
                        dataStatusBuku={finalChartStatusBuku}
                        COLORS={COLORS}
                    />
                    {popupBarVisible && (
                        <PopupModal title={getPopupTitle()} onClose={closePopups}>
                            {renderPopupContent()}
                        </PopupModal>
                    )}
                    {popupToReturnVisible && (
                        <PopupModal title="Daftar Buku Yang Harus Dikembalikan" onClose={closePopups}>
                            <BooksToReturn data={detailData.bukuHarusDikembalikan} />
                        </PopupModal>
                    )}
                </main>
            </div>
        </>
    );
}

function InfoBoxes({ navigateTo, onToReturnClick, onInfoBoxClick, dashboardData }) {
    const boxes = [
        {
            color: '#7266d1',
            count: dashboardData.jumlahBuku,
            label: 'Jumlah Buku',
            action: () => navigateTo('btnKoleksi')
        },
        {
            color: '#fb8c00',
            count: dashboardData.bukuBelumDiambil,
            label: 'Buku yang Ingin Dipinjam',
            action: () => onInfoBoxClick('belumDiambil')
        },
        {
            color: '#43a047',
            count: dashboardData.bukuHarusDikembalikan,
            label: 'Buku yang Harus Dikembalikan',
            action: onToReturnClick
        },
        {
            color: '#26c6da',
            count: dashboardData.bukuDikembalikan,
            label: 'Buku yang Dikembalikan',
            action: () => onInfoBoxClick('bukuYangSudahDikembalikan')
        },
        {
            color: '#d16666',
            count: dashboardData.bukuSeringDipinjam.length,
            label: 'Buku yang Sering Dipinjam',
            action: () => onInfoBoxClick('frequentlyBorrowed')
        },
        {
            color: '#3539b1',
            count: dashboardData.bukuPeminjamanTerbanyak.length,
            label: 'Buku dengan Peminjaman Terbanyak',
            action: () => onInfoBoxClick('mostBorrowed')
        },
    ];

    // Debug info boxes data
    console.log('InfoBoxes data:', dashboardData);

    return (
        <div className="wrapper">
            {boxes.map((box, index) => (
                <div key={index} className="box" style={{ backgroundColor: box.color }}>
                    <span>{box.count}</span>
                    <span>{box.label}</span>
                    <button className="info" onClick={box.action}>More Info</button>
                </div>
            ))}
            <Terbanyak data={dashboardData.bukuTerbanyak} />
        </div>
    );
}

function ChartSection({ dataPeminjam, handleBarClick, dataStatusBuku, COLORS }) {
    console.log('ChartSection - dataPeminjam:', dataPeminjam);
    console.log('ChartSection - dataStatusBuku:', dataStatusBuku);

    // Validasi data untuk pie chart dengan pengecekan nilai numerik
    const hasValidPieData = dataStatusBuku &&
        Array.isArray(dataStatusBuku) &&
        dataStatusBuku.length > 0 &&
        dataStatusBuku.some(item =>
            typeof item.value === 'number' &&
            item.value >= 0
        );

    // Hitung total untuk debugging
    const totalValue = dataStatusBuku?.reduce((sum, item) => sum + (Number(item.value) || 0), 0) || 0;

    console.log('Has valid pie data:', hasValidPieData);
    console.log('Total pie value:', totalValue);
    console.log('Data types:', dataStatusBuku?.map(item => ({ name: item.name, value: item.value, type: typeof item.value })));

    return (
        <div className="wrapper">
            <div className="chart-box">
                <h3 className="chart-title">Jumlah Peminjam per Bulan</h3>
                {dataPeminjam && dataPeminjam.length > 0 ? (
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={dataPeminjam} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="bulan" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar
                                dataKey="peminjam"
                                fill="#ff4081"
                                radius={[6, 6, 0, 0]}
                                barSize={30}
                                onClick={handleBarClick}
                                style={{ cursor: 'pointer' }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{
                        height: '80%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666'
                    }}>
                        Tidak ada data peminjaman
                    </div>
                )}
            </div>

            <div className="chart-box pie">
                <h3 className="chart-title">Status Buku (Total: {totalValue})</h3>
                {hasValidPieData && totalValue > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dataStatusBuku}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={50}
                                labelLine={false}
                                style={{ fontSize: '12px' }}
                            >
                                {dataStatusBuku.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name) => [value, name]}
                                labelFormatter={() => 'Status Buku'}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                wrapperStyle={{ paddingTop: 10 }}
                                formatter={(value, entry) => {
                                    const payload = entry.payload;
                                    return `${value}: ${payload.value}`;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        fontSize: '14px'
                    }}>
                        <p>Chart tidak dapat ditampilkan</p>
                        <div style={{ marginTop: '10px', fontSize: '12px' }}>
                            <p>Debug Info:</p>
                            <p>Valid data: {hasValidPieData ? 'Yes' : 'No'}</p>
                            <p>Total value: {totalValue}</p>
                            <p>Data: {JSON.stringify(dataStatusBuku)}</p>
                        </div>
                    </div>
                )}
            </div>
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

function ListBorrowersByMonth({ data, bulan }) {
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Judul', accessor: 'title' },
        { header: 'Peminjam', accessor: 'name' },
        {
            header: 'Tanggal Pinjam', render: (row) => {
                const date = new Date(row.date);
                return date.toISOString().split('T')[0];
            }
        },
    ];

    return (
        <div id='tablePeminjam'>
            <Table columns={columns} data={data || []} />
        </div>
    );
}

function BukuYangSeringDipinjam({ data }) {
    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Judul', accessor: 'judul' },
        { header: 'Total Peminjaman', accessor: 'total_peminjaman' },
        { header: 'Total Peminjam Unik', accessor: 'total_peminjam_unik' },
    ];

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            <Table columns={columns} data={data || []} />
        </div>
    );
}

function BukuDenganPeminjamanTerbanyak({ data }) {
    const columns = [
        { header: 'No', render: (row, index) => index + 1 },
        { header: 'Judul', accessor: 'judul' },
        { header: 'Penulis', accessor: 'penulis' },
        { header: 'Kategori', accessor: 'kategori' },
        { header: 'Total Dipinjam', accessor: 'total_dipinjam' },
    ];

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            <Table columns={columns} data={data || []} />
        </div>
    );
}

function ReturnedList({ data }) {
    const columns = [
        { header: 'No', render: (row, index) => index + 1 },
        { header: 'Judul', accessor: 'judul' },
        { header: 'Peminjam', accessor: 'nama_peminjam' },
        {
            header: 'Tanggal Pengembalian',
            render: (row) => {
                const date = new Date(row.tanggal_kembali);
                return date.toISOString().split('T')[0];
            }
        },
    ];

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            <Table columns={columns} data={data || []} />
        </div>
    );
}

function BukuBelumDiambil({ data }) {
    const columns = [
        { header: 'No', render: (row, index) => index + 1 },
        { header: 'Judul', accessor: 'judul' },
        { header: 'Nama Peminjam', accessor: 'nama_peminjam' },
        { header: 'Tanggal Pinjam', accessor: 'tanggal_pinjam' },
        { header: 'Tanggal Kembali', accessor: 'tanggal_kembali' },
    ];

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            <Table columns={columns} data={data || []} />
        </div>
    );
}

function Terbanyak({ data }) {
    return (
        <div className="boxBook" style={{ backgroundColor: '#ff4081' }}>
            <span>{data?.total || 0}</span>
            <span>{data?.judul || 'Tidak ada data'}</span>
            <span>Buku Terbanyak</span>
        </div>
    );
}

function BooksToReturn({ data }) {
    const columns = [
        { header: 'No', render: (row, index) => index + 1 },
        { header: 'Judul', accessor: 'judul' },
        { header: 'Nama Peminjam', accessor: 'nama_peminjam' },
        {
            header: 'Tanggal Pinjam', render: (row) => {
                const date = new Date(row.tanggal_pinjam);
                return date.toISOString().split('T')[0];
            }
        },
        {
            header: 'Tanggal Pengembalian',
            render: (row) => {
                const date = new Date(row.tanggal_kembali);
                return date.toISOString().split('T')[0];
            }
        },
        { header: 'Status', accessor: 'status_keterlambatan' },
        { header: 'Hari Terlambat', accessor: 'hari_terlambat' },
    ];

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            <Table columns={columns} data={data || []} />
        </div>
    );
}

export default Dashboard;