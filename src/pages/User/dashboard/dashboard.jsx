import './dashboard.css';
import { Navbar, Sidebar, Table } from '../../../components';
import { useState } from 'react';
import { usePage } from '../../../context';
import data from '../../../../data.json';


function Dashboard() {
    const [showSidebar, setShowSidebar] = useState(true);
    const { navigateTo } = usePage();
    const [popupBarVisible, setPopupBarVisible] = useState(false);
    const [popupToReturnVisible, setPopupToReturnVisible] = useState(false);
    const [selectedBulan, setSelectedBulan] = useState(null);
    const [popupType, setPopupType] = useState(''); // Tambahkan state untuk tipe popup


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
                return <BukuDenganPeminjamanTerbanyak />;
            case 'frequentlyBorrowed':
                return <BukuYangSeringDipinjam />;
            case 'mostBooks':
                return <Terbanyak />;
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
                return 'Buku Terbanyak';
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
                    <h1>Dashboard</h1>
                    <InfoBoxes
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

function InfoBoxes({ navigateTo, onToReturnClick, onInfoBoxClick }) {
    const boxes = [
        { color: '#7266d1', count: 30, label: 'Jumlah Buku', action: () => navigateTo('btnKoleksi') },
        { color: '#d16666', count: 9, label: 'Buku yang Sering Dipinjam', action: () => onInfoBoxClick('frequentlyBorrowed') },
        { color: '#3539b1', count: 8, label: 'Buku dengan Peminjaman Terbanyak', action: () => onInfoBoxClick('mostBorrowed') },
        // { color: '#ff4081', count: 10, label: 'Buku Terbanyak', action: () => onInfoBoxClick('mostBooks') },
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
            <Terbanyak/>
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


function BukuYangSeringDipinjam() {
    const borrower = data.buku;
    const columns = [
        { header: 'Nomor', accessor: 'id' },
        { header: 'Bulan', accessor: 'month' },
        { header: 'Judul', accessor: 'title' },
        { header: 'Dipinjam', accessor: 'totalBorrow' },
    ];

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            <Table columns={columns} data={borrower} />
        </div>
    );
}

function BukuDenganPeminjamanTerbanyak() {
    const borrower = data.buku;
    const columns = [
        { header: 'Nomor', accessor: 'id' },
        { header: 'Judul', accessor: 'title' },
        { header: 'Jumlah Dipinjam', accessor: 'totalBorrower' },
    ];

    return (
        <div className="wrapper" style={{ marginTop: '20px', overflowX: 'auto' }}>
            <Table columns={columns} data={borrower} />
        </div>
    );
}

function Terbanyak() {
    const borrower = data.buku;


    return (
            <div className="boxBook" style={{ backgroundColor: '#ff4081' }}>
                <span>{borrower.length}</span>
                <span>{borrower[0].title}</span>
                <span>Buku Terbanyak</span>
            </div>
    );
}


export default Dashboard;