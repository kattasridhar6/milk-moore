import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function LChart() {
  return (
    <div style={{
      backgroundColor: '#f0f4ff',
      padding: '2rem 6rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      
      <h3>Monthly Milk Consumption</h3>
      <LineChart
        xAxis={[
          {
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            label: 'Month',
            scaleType: 'band',
          },
        ]}
        yAxis={[
          {
            label: 'Liters',
            min: 0,
            max: 250,
            tickMinStep: 50,
          },
        ]}
        series={[
          {
            data: [120, 150, 90, 200, 180, 130,120, 150, 90, 200, 180, 130],
            area: true,
            color: '#f1ed8dff',
          },
        ]}
        width={600}
        height={300}
      />
    </div>
  );
}
