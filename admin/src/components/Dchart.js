import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const data = [
  { label: 'Paid', value: 300, color: '#55e346ff' },
  { label: 'Unpaid', value: 200, color: '#f25120ff' },
];

const settings = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: true,
};

export default function Dchart() {
  return (
    <div style={{
      backgroundColor: '#f0f4ff',
      padding: '1rem 2rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    }}>
        <h5>Bill Status</h5>
      <PieChart
        series={[{ innerRadius: 50, outerRadius: 100, data, arcLabel: 'value' }]}
        {...settings}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {data.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 14,
              height: 14,
              backgroundColor: item.color,
              borderRadius: '50%',
            }}></div>
            <span style={{ fontSize: '0.9rem', color: '#333' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
