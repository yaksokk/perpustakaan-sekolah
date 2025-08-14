import './dashboard.css';
import { Navbar, Sidebar, Table } from '../../../components';
import { useState, useEffect } from 'react';
import { usePage } from '../../../context';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell,
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
    const [loading, setLoading] = useState(true);

    // State untuk data dashboard
    const [infoData, setInfoData] = useState({
        jumlahBuku: 0,
        bukuHarusDikembalikan: 0,
        dikembalikan: 0,
        belumDiambil: 0,
    });
    const [chartPeminjam, setChartPeminjam] = useState([]);
    const [chartStatus, setChartStatus] = useState([]);
    const [booksToReturn, setBooksToReturn] = useState([]);
    const [popupData, setPopupData] = useState([]);

    const COLORS = ['#3f51b5', '#9c27b0'];

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch semua data dashboard secara paralel
            const [
                jumlahBukuRes,
                dikembalikanRes,
                bukuHarusDikembalikanRes,
                belumDiambilRes,
                peminjamChartRes,
                statusChartRes,
                harusDikembalikanRes
            ] = await Promise.all([
                fetch(`${API_URL}/jumlah-buku`, { headers }),
                fetch(`${API_URL}/dikembalikan`, { headers }),
                fetch(`${API_URL}/harus-dikembalikan`, { headers }),
                fetch(`${API_URL}/belum-diambil`, { headers }),
                fetch(`${API_URL}/chart-peminjaman`, { headers }),
                fetch(`${API_URL}/chart-status-buku`, { headers }),
                fetch(`${API_URL}/harus-dikembalikan`, { headers })
            ]);

            // Parse responses
            const jumlahBuku = await jumlahBukuRes.json();
            const bukuHarusDikembalikan = await bukuHarusDikembalikanRes.json();
            const dikembalikan = await dikembalikanRes.json();
            const belumDiambil = await belumDiambilRes.json();
            const peminjamChart = await peminjamChartRes.json();
            const statusChart = await statusChartRes.json();
            const harusDikembalikan = await harusDikembalikanRes.json();

            // Debug data untuk chart
            console.log('Chart Peminjaman Data:', peminjamChart.data);
            console.log('Chart Status Buku Data:', statusChart.data);

            // Process chart status buku data
            const processedChartStatusBuku = processChartStatusBuku(statusChart.data);

            // Set state dengan data dari API
            setInfoData({
                jumlahBuku: jumlahBuku.data?.jumlah || 0,
                bukuHarusDikembalikan: bukuHarusDikembalikan.data?.length || 0,
                dikembalikan: dikembalikan.data?.jumlah || 0,
                belumDiambil: belumDiambil.data?.length || 0,
            });

            setChartPeminjam(peminjamChart.data || []);
            setChartStatus(processedChartStatusBuku);
            setBooksToReturn(harusDikembalikan.data || []);

        } catch (err) {
            console.error('Gagal fetch data:', err);
            // Set default values jika gagal
            setInfoData({
                jumlahBuku: 0,
                bukuHarusDikembalikan: 0,
                dikembalikan: 0,
                belumDiambil: 0,
            });
            setChartPeminjam([]);
            setChartStatus([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Debug chart status data
    useEffect(() => {
        console.log('Chart status updated:', chartStatus);
        console.log('Chart status types:', chartStatus?.map(item => ({ 
            name: item.name, 
            value: item.value, 
            type: typeof item.value 
        })));
    }, [chartStatus]);

    const handleBarClick = async (data) => {
        setSelectedBulan(data.bulan);
        setPopupType('borrowers');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/peminjam-by-month/${data.bulan}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            setPopupData(result.data || []);
        } catch (err) {
            console.error('Gagal fetch data peminjam:', err);
            setPopupData([]);
        }

        setPopupBarVisible(true);
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
        setPopupData([]);
    };

    const renderPopupContent = () => {
        switch (popupType) {
            case 'borrowers':
                return <ListBorrowersByMonth data={popupData} bulan={selectedBulan} />;
            case 'mostBorrowed':
                return <div>Data buku dengan peminjaman terbanyak</div>;
            case 'frequentlyBorrowed':
                return <div>Data buku yang sering dipinjam</div>;
            case 'mostBooks':
                return <div>Data buku terbanyak</div>;
            default:
                return <ListBorrowersByMonth data={popupData} bulan={selectedBulan} />;
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
    const finalChartStatusBuku = chartStatus.length > 0 && 
                                chartStatus.some(item => typeof item.value === 'number' && item.value >= 0) 
                                ? chartStatus 
                                : testPieData;

    console.log('Final chart data being passed:', finalChartStatusBuku);

    if (loading) {
        return (
            <>
                <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
                <div style={{ display: 'flex' }}>
                    <Sidebar isActive={showSidebar} />
                    <main id="dashboard" className="content">
                        <h1>Dashboard</h1>
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            Loading...
                        </div>
                    </main>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex' }}>
                <Sidebar isActive={showSidebar} />
                <main id="dashboard" className="content">
                    <h1>Dashboard</h1>
                    <InfoBoxes
                        infoData={infoData}
                        navigateTo={navigateTo}
                        onToReturnClick={handleToReturnClick}
                        onInfoBoxClick={handleInfoBoxClick}
                    />
                    <ChartSection
                        dataPeminjam={chartPeminjam}
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
                            <BooksToReturn data={booksToReturn} />
                        </PopupModal>
                    )}
                </main>
            </div>
        </>
    );
}

function InfoBoxes({ infoData, navigateTo, onToReturnClick, onInfoBoxClick }) {
    const boxes = [
        {
            color: '#7266d1',
            count: infoData.jumlahBuku,
            label: 'Jumlah Buku',
            action: () => navigateTo('btnKoleksi')
        },
        {
            color: '#fb8c00',
            count: infoData.belumDiambil,
            label: 'Buku yang Ingin Dipinjam',
            action: () => navigateTo('btnSelectedBooks')
        },
        {
            color: '#43a047',
            count: infoData.bukuHarusDikembalikan,
            label: 'Buku yang Harus Dikembalikan',
            action: onToReturnClick
        },
        {
            color: '#26c6da',
            count: infoData.dikembalikan,
            label: 'Buku yang Dikembalikan',
            action: () => navigateTo('btnReturnedList')
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
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie 
                                data={dataStatusBuku} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                outerRadius={80} 
                                innerRadius={0}
                                labelLine={false}
                                
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
                        height: '90%', 
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
        { header: 'Nomor', accessor: 'id' },
        { header: 'Judul', accessor: 'title' },
        { header: 'Peminjam', accessor: 'name' },
        { header: 'Tanggal Pinjam', accessor: 'date' },
    ];

    return (
        <div id='tablePeminjam'>
            <Table columns={columns} data={data || []} />
        </div>
    );
}

function BooksToReturn({ data }) {
    const columns = [
        { header: 'Nomor', accessor: 'id' },
        { header: 'Judul', accessor: 'judul' },
        { header: 'Peminjam', accessor: 'nama_peminjam' },
        { header: 'Tanggal Pinjam', accessor: 'tanggal_pinjam' },
        { header: 'Tanggal Pengembalian', accessor: 'tanggal_kembali' },
        { header: 'Status', accessor: 'status_keterlambatan' },
    ];

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            <Table columns={columns} data={data || []} />
        </div>
    );
}

export default Dashboard;