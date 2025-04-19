import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Landing = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPassengers: 0,
    safeToTravel: 0,
    needsReview: 0,
    notEligible: 0,
    recentFlights: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get all users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalPassengers = usersSnapshot.size;
        
        let safeToTravel = 0;
        let needsReview = 0;
        let notEligible = 0;
        let recentFlights = [];
        
        // Process each user's travel history
        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const travelHistoryRef = collection(db, `users/${userId}/travelHistory`);
          const travelHistorySnapshot = await getDocs(travelHistoryRef);
          
          travelHistorySnapshot.forEach(travelDoc => {
            const travelData = travelDoc.data();
            const healthScore = parseFloat(travelData.travelHealthScore);
            
            // Count health score categories
            if (healthScore > 8.5) {
              safeToTravel++;
            } else if (healthScore >= 7 && healthScore <= 8.5) {
              needsReview++;
            } else {
              notEligible++;
            }
            
            // Add to recent flights
            recentFlights.push({
              id: travelDoc.id,
              userId: userId,
              userName: userDoc.data().name,
              source: travelData.currentCity,
              destination: travelData.destinationCity,
              healthScore: healthScore,
              travelId: travelData.travelID
            });
          });
        }
        
        // Sort flights by ID (assuming newer IDs are more recent)
        recentFlights.sort((a, b) => b.travelId.localeCompare(a.travelId));
        recentFlights = recentFlights.slice(0, 5); // Keep only 5 most recent
        
        setStats({
          totalPassengers,
          safeToTravel,
          needsReview,
          notEligible,
          recentFlights
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const healthStatusData = {
    labels: ['Safe to Travel', 'Needs Review', 'Not Eligible'],
    datasets: [
      {
        data: [stats.safeToTravel, stats.needsReview, stats.notEligible],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',  // Green for Safe
          'rgba(251, 191, 36, 0.8)',  // Yellow for Review
          'rgba(239, 68, 68, 0.8)',   // Red for Not Eligible
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sample data for daily passenger trend - in a real app, you'd calculate this from actual data
  const dailyPassengerData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Passengers',
        data: [65, 78, 90, 81, 86, 95, 88],
        fill: false,
        borderColor: 'rgb(20, 184, 166)',
        tension: 0.1
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          
          {/* Stats Overview */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Total Passengers</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalPassengers}</dd>
                </dl>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-green-50 shadow">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="truncate text-sm font-medium text-green-600">Safe to Travel</dt>
                  <dd className="mt-1 text-3xl font-semibold text-green-800">{stats.safeToTravel}</dd>
                </dl>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-yellow-50 shadow">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="truncate text-sm font-medium text-yellow-600">Needs Review</dt>
                  <dd className="mt-1 text-3xl font-semibold text-yellow-800">{stats.needsReview}</dd>
                </dl>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-red-50 shadow">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="truncate text-sm font-medium text-red-600">Not Eligible</dt>
                  <dd className="mt-1 text-3xl font-semibold text-red-800">{stats.notEligible}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          {/* Charts Row */}
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Health Status Distribution</h3>
                <div className="mt-2 h-64 flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <Doughnut data={healthStatusData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Daily Passenger Trend</h3>
                <div className="mt-2 h-64">
                  <Line 
                    data={dailyPassengerData} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Flights */}
          <div className="mt-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-xl font-semibold text-gray-900">Recent Flights</h2>
                <p className="mt-2 text-sm text-gray-700">A list of recent passenger flights with their health status.</p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <Link
                  to="/passengers"
                  className="inline-flex items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  View all passengers
                </Link>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Passenger</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Travel ID</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Route</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Health Status</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {stats.recentFlights.map((flight) => (
                      <tr key={flight.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900">{flight.userName}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{flight.travelId}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {flight.source} → {flight.destination}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {flight.healthScore > 8.5 ? (
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Approved</span>
                          ) : flight.healthScore >= 7 ? (
                            <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">Pending Review</span>
                          ) : (
                            <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">Declined</span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link to={`/passengers/${flight.userId}?travelId=${flight.id}`} className="text-teal-600 hover:text-teal-900">
                            View details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;