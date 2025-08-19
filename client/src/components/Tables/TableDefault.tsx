import React from 'react'

interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface TableDefaultProps {
    columns: Column[];
    rows: any[];
    className?: string;
    emptyMessage?: string;
}

const TableDefault: React.FC<TableDefaultProps> = ({
    columns,
    rows,
    className = "",
    emptyMessage = "No data available"
}) => {
    if (!rows || rows.length === 0) {
        return (
            <div className={`text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 ${className}`}>
                <div className="text-4xl mb-3">📊</div>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {columns.map((column, index) => (
                                <th
                                    key={column.key}
                                    className={`
                    px-6 py-4 text-left text-sm font-semibold text-gray-700 
                    border-r border-gray-200 last:border-r-0
                    ${index === 0 ? 'pl-6' : ''}
                    ${index === columns.length - 1 ? 'pr-6' : ''}
                  `}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {rows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`
                  hover:bg-blue-50 transition-all duration-200 ease-in-out
                  ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                  ${rowIndex === rows.length - 1 ? 'border-b-0' : ''}
                `}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={`${rowIndex}-${column.key}`}
                                        className={`
                      px-6 py-4 text-sm text-gray-700 
                      border-r border-gray-100 last:border-r-0
                      ${colIndex === 0 ? 'pl-6' : ''}
                      ${colIndex === columns.length - 1 ? 'pr-6' : ''}
                    `}
                                    >
                                        <div className="flex items-center">
                                            {column.render
                                                ? column.render(row[column.key], row)
                                                : (
                                                    <span className={`
                            ${column.key === 'status' ?
                                                            (row[column.key] === 'Active' ? 'text-green-600' : 'text-red-600') :
                                                            'text-gray-700'
                                                        }
                          `}>
                                                        {row[column.key] || '-'}
                                                    </span>
                                                )
                                            }
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TableDefault