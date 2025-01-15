import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import './UserDashboard.css';

function UserDashboard() {
  const generalHealthRef = useRef(null);
  const relativeHealthRef = useRef(null);
  const vaccinationRef = useRef(null);
  const symptomsRef = useRef(null);

  const createAnimatedDoughnutChart = (canvas, finalData, colors, hoverColors) => {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    let currentValue = 0;
    const targetValue = finalData.datasets[0].data[0];
    const startTime = Date.now();
    const duration = 2000;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: finalData.labels,
        datasets: [{
          data: [0, 100],
          backgroundColor: colors,
          borderWidth: 0,
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        cutout: '70%',
        borderRadius: 8,
        animation: {
          duration: 0
        },
        onHover: (event, elements) => {
          if (elements.length) {
            chart.data.datasets[0].backgroundColor = elements[0].index === 0 ? 
              [hoverColors[0], colors[1]] : 
              [colors[0], hoverColors[1]];
          } else {
            chart.data.datasets[0].backgroundColor = colors;
          }
          chart.update('none');
        }
      }
    });

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
      currentValue = easeOutQuart(progress) * targetValue;
      
      chart.data.datasets[0].data = [currentValue, 100 - currentValue];
      chart.update('none');
      
      const valueDisplay = canvas.parentElement.parentElement.querySelector('.chart-value');
      if (valueDisplay) {
        valueDisplay.textContent = `${Math.round(currentValue)}%`;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
    return chart;
  };

  useEffect(() => {
    const charts = [];
    
    // General Health Chart
    if (generalHealthRef.current) {
      charts.push(createAnimatedDoughnutChart(
        generalHealthRef.current,
        {
          labels: ['Achieved', 'Remaining'],
          datasets: [{
            data: [85, 15],
            backgroundColor: ['#00BCD4', '#e0e0e0'],
            borderWidth: 0,
          }]
        },
        ['#00BCD4', '#e0e0e0'],
        ['#26C6DA', '#bdbdbd']
      ));
    }

    // Relative Health Chart
    if (relativeHealthRef.current) {
      charts.push(createAnimatedDoughnutChart(
        relativeHealthRef.current,
        {
          labels: ['Above Average', 'Average'],
          datasets: [{
            data: [75, 25],
            backgroundColor: ['#9C27B0', '#e0e0e0'],
            borderWidth: 0,
          }]
        },
        ['#9C27B0', '#e0e0e0'],
        ['#BA68C8', '#bdbdbd']
      ));
    }

    // Vaccination Chart
    if (vaccinationRef.current) {
      charts.push(createAnimatedDoughnutChart(
        vaccinationRef.current,
        {
          labels: ['Complete', 'Pending'],
          datasets: [{
            data: [75, 25],
            backgroundColor: ['#FF9800', '#e0e0e0'],
            borderWidth: 0,
          }]
        },
        ['#FF9800', '#e0e0e0'],
        ['#FFA726', '#bdbdbd']
      ));
    }

    // Symptoms Chart
    if (symptomsRef.current) {
      charts.push(new Chart(symptomsRef.current, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
          datasets: [{
            label: 'Symptoms',
            data: [1, 2, 3, 2, 1],
            borderColor: '#E91E63',
            backgroundColor: 'rgba(233, 30, 99, 0.2)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              ticks: {
                stepSize: 1
              }
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
          }
        }
      }));
    }

    // Cleanup function
    return () => {
      charts.forEach(chart => chart.destroy());
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* <div className="header">
        <h1>User Name</h1>
        <h2>Age : </h2>
        <h2>Gender : </h2>
        <div className="profile">
          <img src="/api/placeholder/50/50" alt="Profile" />
          <div>
            <p><strong>John Doe</strong></p>
            <p>ID: 12345</p>
          </div>
        </div>
      </div> */}

      <div className="row row-1">
        <div className="widget">
          <h3>General Health Score</h3>
          <div className="chart-container">
            <div className="chart-value">0%</div>
            <div className="chart-wrapper">
              <canvas ref={generalHealthRef}></canvas>
            </div>
          </div>
        </div>

        <div className="widget">
          <h3>Relative Health Score</h3>
          <div className="chart-container">
            <div className="chart-value">0%</div>
            <div className="chart-wrapper">
              <canvas ref={relativeHealthRef}></canvas>
            </div>
          </div>
        </div>

        <div className="widget">
          <h3>Travel History</h3>
          <ul className="travel-history">
            <li>
              <div className="travel-route">Mumbai → Washington</div>
              <div className="travel-date">March 24</div>
            </li>
            <li>
              <div className="travel-route">Washington → London</div>
              <div className="travel-date">April 02</div>
            </li>
            <li>
              <div className="travel-route">London → Paris</div>
              <div className="travel-date">April 15</div>
            </li>
            <li>
              <div className="travel-route">Paris → Mumbai</div>
              <div className="travel-date">April 30</div>
            </li>
          </ul>
        </div>
      </div>

      <div className="row row-2">
        <div className="widget">
          <h3>Vaccination Status</h3>
          <div className="vaccination-container">
            <div className="vaccination-chart">
              <div className="chart-value">0%</div>
              <div className="chart-wrapper">
                <canvas ref={vaccinationRef}></canvas>
              </div>
            </div>
            <ul className="vaccination-list">
              <li>COVID-19</li>
              <li>Flu Shot</li>
              <li>Hepatitis B</li>
              <li className="pending">Yellow Fever</li>
            </ul>
          </div>
        </div>

        <div className="widget">
          <h3>Symptoms Trend</h3>
          <div className="chart-container">
            <div className="chart-wrapper">
              <canvas ref={symptomsRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;