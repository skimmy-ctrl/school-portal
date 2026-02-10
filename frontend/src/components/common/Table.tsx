import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm text-left text-gray-600 ${className}`}>
        {children}
      </table>
    </div>
  );
}

interface TableHeadProps {
  children: React.ReactNode;
}

export function TableHead({ children }: TableHeadProps) {
  return (
    <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: React.ReactNode;
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody className="divide-y divide-gray-200">{children}</tbody>;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function TableRow({ children, className = '', hoverable = true }: TableRowProps) {
  return (
    <tr
      className={`
        ${hoverable ? 'hover:bg-gray-50' : ''} 
        transition-colors duration-150
        ${className}
      `}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  header?: boolean;
}

export function TableCell({ children, className = '', header = false }: TableCellProps) {
  return (
    <td
      className={`
        px-6 py-4
        ${header ? 'font-semibold text-gray-900' : ''}
        ${className}
      `}
    >
      {children}
    </td>
  );
}
