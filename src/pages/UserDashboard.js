import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Chart } from 'chart.js/auto';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './UserDashboard.css';

function UserDashboard() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({
    generalHealth: 0,
    relativeHealth: 0,
    travelHistory: [],
    vaccinations: [],
    userName: ''
  });
  
  const generalHealthRef = useRef(null);
  const relativeHealthRef = useRef(null);
  const vaccinationRef = useRef(null);
  const symptomsRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user document
        console.log('Fetching data for user ID:', userId);
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);
        if (!userSnapshot.exists()){ 
          console.log('User document not found');
          return;
        }
        console.log('User data:', userSnapshot.data());
        
        // Get general health score
        const healthScoresRef = collection(userDoc, 'healthScores');
        const healthScoresSnapshot = await getDocs(healthScoresRef);
        let generalHealth = 0;
        if (!healthScoresSnapshot.empty) {
          const healthData = healthScoresSnapshot.docs[0].data();
          generalHealth = parseFloat(healthData.healthScore);
          console.log('General Health Score:', generalHealth);
        }

        // Get travel history and relative health score
        const travelHistoryRef = collection(userDoc, 'travelHistory');
        const travelSnapshot = await getDocs(travelHistoryRef);
        const travelHistory = [];
        let latestTravelScore = 0;

        console.log('Travel history docs:', travelSnapshot.docs.length);
        
        travelSnapshot.docs.forEach(doc => {
          const data = doc.data();
          console.log('Travel entry:', data);
          const travelDate = data.timestamp?.toDate?.() || new Date(data.timestamp);
          travelHistory.push({
            id: doc.id,
            from: data.currentCity,
            to: data.destinationCity,
            date: travelDate,
            score: parseFloat(data.travelHealthScore || 0)
          });
          
          // Get the latest travel health score
          if (data.travelHealthScore) {
            const score = parseFloat(data.travelHealthScore);
            if (!latestTravelScore || score > latestTravelScore) {
              latestTravelScore = score;
            }
          }
        });

        console.log('Latest travel score:', latestTravelScore);
        console.log('Travel history:', travelHistory);

        // Get vaccinations
        const vaccinationsRef = collection(userDoc, 'vaccinations');
        const vaccinationsSnapshot = await getDocs(vaccinationsRef);
        const vaccinations = vaccinationsSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Vaccination data:', data);
          return {
            id: doc.id,
            name: data.vaccineName,
            date: data.dateAdministered
          };
        });

        console.log('Vaccinations:', vaccinations);

        setUserData({
          generalHealth,
          relativeHealth: latestTravelScore,
          travelHistory: travelHistory.sort((a, b) => b.date - a.date),
          vaccinations,
          userName: userSnapshot.data().name
        });

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const createAnimatedDoughnutChart = (canvas, finalData, colors, hoverColors) => {
    if (!canvas || !canvas.getContext) return null; 
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;  
    
    let currentValue = 0;
    const targetValue = finalData.datasets[0].data[0];
    const startTime = Date.now();
    const duration = 2000;
    let animationFrameId = null;

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
              if (!chart || !chart.data) return;  
              if (elements.length) {
                  chart.data.datasets[0].backgroundColor = elements[0].index === 0 ? 
                      [hoverColors[0], colors[1]] : 
                      [colors[0], hoverColors[1]];
              } else {
                  chart.data.datasets[0].backgroundColor = colors;
              }
              try {
                  chart.update('none');
              } catch (error) {
                  console.log('Chart update error:', error);
              }
          }
      }
  });

  function animate() {
    if (!canvas || !chart || !chart.data) {  // Add this check
        cancelAnimationFrame(animationFrameId);
        return;
    }

    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
    currentValue = easeOutQuart(progress) * targetValue;
    
    try{
        chart.data.datasets[0].data = [currentValue, 100 - currentValue];
        chart.update('none');
        
        const valueDisplay = canvas.parentElement?.parentElement?.querySelector('.chart-value');
        if (valueDisplay) {
            valueDisplay.textContent = `${Math.round(currentValue)}%`;
        }
        
        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        }
      } 
    catch (error) {
      console.log('Animation error:', error);
      cancelAnimationFrame(animationFrameId);
    }
  }

  animationFrameId = requestAnimationFrame(animate);

  return {
      chart,
      destroy: () => {
          cancelAnimationFrame(animationFrameId);
          chart.destroy();
      }
  };
  };


  useEffect(() => {
    const charts = [];
    if (generalHealthRef.current) {
      charts.push(createAnimatedDoughnutChart(
        generalHealthRef.current,
        {
          labels: ['Score', 'Remaining'],
          datasets: [{
            data: [userData.generalHealth * 10, 100 - (userData.generalHealth * 10)],
            backgroundColor: ['#00BCD4', '#e0e0e0'],
            borderWidth: 0,
          }]
        },
        ['#00BCD4', '#e0e0e0'],
        ['#26C6DA', '#bdbdbd']
      ));
    }
    if (relativeHealthRef.current) {
      charts.push(createAnimatedDoughnutChart(
        relativeHealthRef.current,
        {
          labels: ['Score', 'Remaining'],
          datasets: [{
            data: [userData.relativeHealth * 10, 100 - (userData.relativeHealth * 10)],
            backgroundColor: ['#9C27B0', '#e0e0e0'],
            borderWidth: 0,
          }]
        },
        ['#9C27B0', '#e0e0e0'],
        ['#BA68C8', '#bdbdbd']
      ));
    }
    // Vaccination Chart
    if (vaccinationRef.current){
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
    if (symptomsRef.current){
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
    return () => {
      charts.forEach(chart => chart.destroy());
    };
  }, [userData]);
  useEffect(() => {
    let charts = [];
    const timeoutId = setTimeout(() => {
        if (userData.generalHealth && generalHealthRef.current) {
            const chart = createAnimatedDoughnutChart(
                generalHealthRef.current,
                {
                    labels: ['Score', 'Remaining'],
                    datasets: [{
                        data: [userData.generalHealth * 10, 100 - (userData.generalHealth * 10)],
                        backgroundColor: ['#00BCD4', '#e0e0e0'],
                        borderWidth: 0,
                    }]
                },
                ['#00BCD4', '#e0e0e0'],
                ['#26C6DA', '#bdbdbd']
            );
            if (chart) charts.push(chart);
        }
        if (userData.relativeHealth && relativeHealthRef.current) {
            const chart = createAnimatedDoughnutChart(
                relativeHealthRef.current,
                {
                    labels: ['Score', 'Remaining'],
                    datasets: [{
                        data: [userData.relativeHealth * 10, 100 - (userData.relativeHealth * 10)],
                        backgroundColor: ['#9C27B0', '#e0e0e0'],
                        borderWidth: 0,
                    }]
                },
                ['#9C27B0', '#e0e0e0'],
                ['#BA68C8', '#bdbdbd']
            );
            if (chart) charts.push(chart);
        }
        if (vaccinationRef.current) {
            const vaccinationPercentage = (userData.vaccinations.length / 4) * 100;
            const chart = createAnimatedDoughnutChart(
                vaccinationRef.current,
                {
                    labels: ['Complete', 'Remaining'],
                    datasets: [{
                        data: [vaccinationPercentage, 100 - vaccinationPercentage],
                        backgroundColor: ['#FF9800', '#e0e0e0'],
                        borderWidth: 0,
                    }]
                },
                ['#FF9800', '#e0e0e0'],
                ['#FFA726', '#bdbdbd']
            );
            if (chart) charts.push(chart);
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
    }, 
  0);

    return () => {
        clearTimeout(timeoutId);
        charts.forEach(chart => chart.destroy?.());
    };
  }, [userData]);
  return (
    <div className="dashboard-container">
      {/* <div className="header">
        <h1>{userData.userName}'s Dashboard</h1>
      </div> */}
      <div className="row row-1">
        <div className="widget">
          <h3>General Health Score</h3>
          <div className="chart-container">
            <div className="chart-value">{userData.generalHealth.toFixed(2)}</div>
            <div className="chart-wrapper">
              <canvas ref={generalHealthRef}></canvas>
            </div>
          </div>
        </div>
        <div className="widget">
          <h3>Relative Health Score</h3>
          <div className="chart-container">
            <div className="chart-value">{userData.relativeHealth.toFixed(2)}</div>
            <div className="chart-wrapper">
              <canvas ref={relativeHealthRef}></canvas>
            </div>
          </div>
        </div>
        <div className="widget">
          <h3>Travel History</h3>
          <ul className="travel-history">
            {userData.travelHistory.map(travel => (
              <li key={travel.id}>
                <div className="travel-route">{travel.from} → {travel.to}</div>
                <div className="travel-date">
                  {travel.date?.toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="row row-2">
        <div className="widget">
          <h3>Vaccination Status</h3>
          <div className="vaccination-container">
            <div className="vaccination-chart">
              <div className="chart-value">
                {((userData.vaccinations.length / 4) * 100).toFixed(0)}%
              </div>
              <div className="chart-wrapper">
                <canvas ref={vaccinationRef}></canvas>
              </div>
            </div>
            <ul className="vaccination-list">
              {userData.vaccinations.map(vaccine => (
                <li key={vaccine.id}>{vaccine.name}</li>
              ))}
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