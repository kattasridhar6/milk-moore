import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const initialData = [
  {
    id: 'CUST001',
    name: 'John Doe',
    milkType: 'Cow',
    quantity: '5L',
    billStatus: 'Paid',
    deliveryDate: '2025-07-27',
    deliveryAddress: '123 Street, City',
    deliveryPartner: 'Partner A',
    amountDue: '$0'
  },
  {
    id: 'CUST002',
    name: 'Jane Smith',
    milkType: 'Buffalo',
    quantity: '3L',
    billStatus: 'Unpaid',
    deliveryDate: '2025-07-28',
    deliveryAddress: '456 Lane, Town',
    deliveryPartner: 'Partner B',
    amountDue: '$15'
  },
  {
    id: 'CUST001',
    name: 'John Doe',
    milkType: 'Cow',
    quantity: '5L',
    billStatus: 'Paid',
    deliveryDate: '2025-07-27',
    deliveryAddress: '123 Street, City',
    deliveryPartner: 'Partner A',
    amountDue: '$0'
  },
  {
    id: 'CUST002',
    name: 'Jane Smith',
    milkType: 'Buffalo',
    quantity: '3L',
    billStatus: 'Unpaid',
    deliveryDate: '2025-07-28',
    deliveryAddress: '456 Lane, Town',
    deliveryPartner: 'Partner B',
    amountDue: '$15'
  }
];

const DTable = () => {
  const [data, setData] = useState(initialData);

  const handleDelete = (indexToDelete) => {
    const updatedData = data.filter((_, index) => index !== indexToDelete);
    setData(updatedData);
  };

  return (
    <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
      <Table>
        <TableHead style={{ backgroundColor: '#1976d2' }}>
          <TableRow>
            <TableCell style={{ color: 'white' }}>Customer ID</TableCell>
            <TableCell style={{ color: 'white' }}>Name</TableCell>
            <TableCell style={{ color: 'white' }}>Milk Type</TableCell>
            <TableCell style={{ color: 'white' }}>Quantity</TableCell>
            <TableCell style={{ color: 'white' }}>Bill Status</TableCell>
            <TableCell style={{ color: 'white' }}>Delivery Date</TableCell>
            <TableCell style={{ color: 'white' }}>Delivery Address</TableCell>
            <TableCell style={{ color: 'white' }}>Delivery Partner</TableCell>
            <TableCell style={{ color: 'white' }}>Amount Due</TableCell>
            <TableCell style={{ color: 'white' }}>Edit</TableCell>
            <TableCell style={{ color: 'white' }}>Delete</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row, index) => (
            <TableRow key={`${row.id}-${index}`}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.milkType}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.billStatus}</TableCell>
              <TableCell>{row.deliveryDate}</TableCell>
              <TableCell>{row.deliveryAddress}</TableCell>
              <TableCell>{row.deliveryPartner}</TableCell>
              <TableCell>{row.amountDue}</TableCell>
              <TableCell>
                <IconButton color="primary" size="small">
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(index)}
                  aria-label={`Delete ${row.name}`}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} align="center">
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DTable;
