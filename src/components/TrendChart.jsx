import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

/**
 * TrendChart — Weekly revenue line chart
 */
export default function TrendChart({ data = [], height = 180, dataKey = 'revenue', label = 'Revenue' }) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label,
        data: data.map(d => d[dataKey]),
        borderColor: '#3b82f6',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
          return gradient;
        },
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#1c1f2e',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#60a5fa',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        backgroundColor: '#1c1f2e',
        titleColor: '#f1f3f8',
        bodyColor: '#8b92a8',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (ctx) => {
            return `₦${ctx.parsed.y.toLocaleString()}`;
          },
        },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#5a6178',
          font: { size: 11, family: 'Inter' },
        },
        border: { display: false },
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.03)',
          drawTicks: false,
        },
        ticks: {
          color: '#5a6178',
          font: { size: 11, family: 'Inter' },
          padding: 8,
          callback: (val) => {
            if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
            if (val >= 1000) return `₦${(val / 1000).toFixed(0)}K`;
            return `₦${val}`;
          },
        },
        border: { display: false },
      },
    },
  };

  return (
    <div style={{ height, width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
