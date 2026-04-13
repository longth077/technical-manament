export default function DataTable({ columns, data, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>TT</th>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th>Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2} className="empty-row">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row._id || row.id || idx}>
                <td>{idx + 1}</td>
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key] ?? ''}</td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="action-cell">
                    {onEdit && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onEdit(row)}
                      >
                        Sửa
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(row)}
                      >
                        Xoá
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
