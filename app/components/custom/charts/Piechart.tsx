import './chartStyle.css'; // Import custom CSS for styling

// PieChart.tsx (TypeScript)
import React from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface PieChartProps {
  data: { name: string; y: number; color: string }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: 170,
      width:285
    },
    title: {
      text: undefined, // No title on top
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false, // Hide default labels
        },
        showInLegend: true, // Enable legend for custom UI
      },
    },
    series: [
      {
        type: 'pie',
        data: data,
      },
    ],
  };

  return (
    <div className="pie-chart-container">
      <HighchartsReact highcharts={Highcharts} options={options} />
      <div className="custom-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: item.color }}
            ></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
