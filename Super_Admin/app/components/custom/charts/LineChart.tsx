// RevenueChart.js
import React from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChart = () => {
  const chartOptions = {
    chart: {
      type: "column",
      height: 185,
    },
    title: {
      text: "",
    },
    yAxis: {
      title: {
        text: "",
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      valuePrefix: "$",
    },
    series: [
      {
        data: Array.from({ length: 31 }, () =>
          Math.floor(Math.random() * 500 + 50)
        ),
        color: "#1D4ED8",
      },
    ],
  };

  return (
    <div className="w-full h-full">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default LineChart;
