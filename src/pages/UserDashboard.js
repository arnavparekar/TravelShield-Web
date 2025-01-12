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
                            data: [30, 40, 30], //Enter the data here
                            backgroundColor: [
                                'rgba(128, 203, 196, 0.9)', // Light teal
                                'rgba(77, 182, 172, 0.9)', // Aqua teal
                                'rgba(0, 137, 123, 0.9)', // Deep teal
                            ],
                            hoverBackgroundColor: [
                                'rgba(178, 223, 219, 1)', // Hover Light teal
                                'rgba(128, 203, 196, 1)', // Hover Aqua teal
                                'rgba(0, 77, 64, 1)', // Hover Deep teal
                            ],
                            borderWidth: 3, // Border thickness
                            borderColor: '#ffffff', // White borders
                            hoverOffset: 8,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Ensures proper scaling
                    cutout: '50%', // Decrease this value for a thicker donut
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#004D40', // Text color
                                font: {
                                    size: 14,
                                },
                            },
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 77, 64, 0.8)', // Tooltip background
                            bodyColor: '#ffffff', // Tooltip text
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