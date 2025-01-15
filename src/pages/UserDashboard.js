import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './UserDashboard.css';

const UserDashboard = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Low Score', 'Medium Score', 'High Score'],
                    datasets: [
                        {
                            label: 'Health Scores',
                            data: [30, 40, 30], 
                            backgroundColor: [
                                'rgba(128, 203, 196, 0.9)', 
                                'rgba(77, 182, 172, 0.9)', 
                                'rgba(0, 137, 123, 0.9)', 
                            ],
                            hoverBackgroundColor: [
                                'rgba(178, 223, 219, 1)', 
                                'rgba(128, 203, 196, 1)', 
                                'rgba(0, 77, 64, 1)',
                            ],
                            borderWidth: 3, 
                            borderColor: '#ffffff',
                            hoverOffset: 8,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '50%', 
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#004D40', 
                                font: {
                                    size: 14,
                                },
                            },
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 77, 64, 0.8)',
                            bodyColor: '#ffffff', 
                            borderColor: '#004D40',
                            borderWidth: 1,
                        },
                    },
                    animation: {
                        animateScale: true,
                    },
                },
            });
        }
    }, []);

    return (
        <div className="dashboard">
            <div className="chart-container">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    );
};

export default UserDashboard;