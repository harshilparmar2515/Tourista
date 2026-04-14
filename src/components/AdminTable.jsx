import { Table, Button } from "react-bootstrap";

const AdminTable = ({ title, columns, rows }) => {
  return (
    <div className="admin-table-card card-elevated">
      <div className="admin-table-header">
        <h4>{title}</h4>
      </div>
      <Table responsive hover className="admin-table mb-0">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id || row.key}>
              {columns.map((column) => (
                <td key={`${row.id}-${column.key}`}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminTable;
