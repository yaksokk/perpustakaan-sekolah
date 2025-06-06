import './Table.css';

const Table = ({ columns, data, customActions }) => {
    return (
        <table className="custom-table">
            <thead>
                <tr>
                    {columns.map((col, idx) => (
                        <th key={idx}>{col.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex}>
                                    {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                            Tidak ada data yang ditemukan
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default Table;
