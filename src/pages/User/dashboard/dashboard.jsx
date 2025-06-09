import './dashboard.css';
import { Navbar, Sidebar, Table } from '../../../components';
import { useState } from 'react';
import { useAuth, usePage } from '../../../context';

function Dashboard() {
    const [showSidebar, setShowSidebar] = useState(true);
    const { navigateTo } = usePage();
    const { user } = useAuth()

    const handleToReturnClick = () => {
        setPopupToReturnVisible(true);
    };

    return (
        <>
            <Navbar onToggleMenu={() => setShowSidebar(!showSidebar)} />
            <div style={{ display: 'flex' }}>
                <Sidebar isActive={showSidebar} />
                <main id="dashboard" className="content">
                    {user && (
                        <h1 style={{ marginBottom: '20px' }}>Selamat Datang <span>{user.name}</span></h1>
                    )}
                    <h1>Dashboard</h1>
                    <InfoBoxes navigateTo={navigateTo} onToReturnClick={handleToReturnClick} />
                </main>
            </div>
        </>
    );
}

function InfoBoxes({ navigateTo }) {
    const boxes = [
        { color: '#7266d1', count: 30, label: 'Jumlah Buku', action: () => navigateTo('btnKoleksi') }
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

export default Dashboard;
