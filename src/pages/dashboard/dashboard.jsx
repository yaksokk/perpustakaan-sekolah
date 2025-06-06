import './dashboard.css';
import { Navbar, Sidebar } from '../../components';
import { useState } from 'react';
import { usePage } from '../../context';
import Table from '../../components/shared/table/table';
import data from '../../../data.json';
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

function Dashboard() {
    const [showSidebar, setShowSidebar] = useState(true);
    const { navigateTo } = usePage();
    const [popupBarVisible, setPopupBarVisible] = useState(false);
    const [popupToReturnVisible, setPopupToReturnVisible] = useState(false);
    const [selectedBulan, setSelectedBulan] = useState(null);

    const dataPeminjam = [
        { bulan: 'Jan', peminjam: 3 },
        { bulan: 'Feb', peminjam: 4 },
        { bulan: 'Mar', peminjam: 5 },
        { bulan: 'Apr', peminjam: 2 },
        { bulan: 'Mei', peminjam: 6 },
        { bulan: 'Jun', peminjam: 7 },
        { bulan: 'Jul', peminjam: 7 },
    ];

    const dataStatusBuku = [
        { name: 'Dipinjam', value: 10 },
        { name: 'Tersedia', value: 20 },
    ];

    const COLORS = ['#3f51b5', '#9c27b0'];

    const handleBarClick = (data) => {
        setSelectedBulan(data.bulan);
        setPopupBarVisible(true);
    };

    const handleToReturnClick = () => {
        setPopupToReturnVisible(true);
    };

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex' }}>
                <Sidebar isActive={showSidebar} />
                <main id="dashboard" className="content">
                    <h1>Dashboard</h1>
                    <InfoBoxes navigateTo={navigateTo} onToReturnClick={handleToReturnClick} />
                    <ChartSection dataPeminjam={dataPeminjam} handleBarClick={handleBarClick} dataStatusBuku={dataStatusBuku} COLORS={COLORS} />
                    {popupBarVisible && <PopupModal title={`Daftar Peminjam - ${selectedBulan}`} onClose={() => setPopupBarVisible(false)}><ListBorrowersByMonth bulan={selectedBulan} /></PopupModal>}
                    {popupToReturnVisible && <PopupModal title="Daftar Buku Yang Harus Dikembalikan" onClose={() => setPopupToReturnVisible(false)}><BooksToReturn /></PopupModal>}
                </main>
            </div>
        </>
    );
}

function InfoBoxes({ navigateTo, onToReturnClick }) {
    const boxes = [
        { color: '#7266d1', count: 30, label: 'Jumlah Buku', action: () => navigateTo('btnKoleksi') },
        { color: '#fb8c00', count: 12, label: 'Buku yang Ingin Dipinjam', action: () => navigateTo('btnSelectedBooks') },
        { color: '#43a047', count: 8, label: 'Buku yang Harus Dikembalikan', action: onToReturnClick },
        { color: '#26c6da', count: 3, label: 'Buku yang Dikembalikan', action: () => navigateTo('btnReturnedList') },
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
    return (
        <div className="wrapper">
            <div className="chart-box">
                <h3 className="chart-title">Jumlah Peminjam per Bulan</h3>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={dataPeminjam} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bulan" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="peminjam" fill="#ff4081" radius={[6, 6, 0, 0]} barSize={30} onClick={handleBarClick} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-box pie">
                <h3 className="chart-title">Status Buku Dipinjam</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                        <Pie data={dataStatusBuku} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {dataStatusBuku.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 10 }} />
                    </PieChart>
                </ResponsiveContainer>
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

function ListBorrowersByMonth() {
    const borrower = data.peminjam;
    const columns = [
        { header: 'Nomor', accessor: 'id' },
        { header: 'Judul', accessor: 'title' },
        { header: 'Peminjam', accessor: 'name' },
        { header: 'Tanggal Pinjam', accessor: 'date' },
    ];

    return (
        <div id='tablePeminjam'>
            <Table columns={columns} data={borrower} />
        </div>
    );
}

function BooksToReturn() {
    const borrower = data.peminjam;
    const columns = [
        { header: 'Nomor', accessor: 'id' },
        { header: 'Judul', accessor: 'title' },
        { header: 'Peminjam', accessor: 'name' },
        { header: 'Tanggal Pinjam', accessor: 'date' },
        { header: 'Tanggal Pengembalian', accessor: 'returnDate' },
    ];

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            <Table columns={columns} data={borrower} />
        </div>
    );
}

export default Dashboard;
