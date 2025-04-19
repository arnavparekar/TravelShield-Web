import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const PassengerDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const travelId = searchParams.get('travelId');
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [travelData, setTravelData] = useState(null);
  const [healthScores, setHealthScores] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [travelHistory, setTravelHistory] = useState([]);
  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userDocRef = doc(db, 'users', id);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          setError('User not found');
          return;
        }
        
        setUserData(userDocSnap.data());
        
        // Fetch health scores
        const healthScoresRef = collection(db, `users/${id}/healthScores`);
        const healthScoresSnap = await getDocs(healthScoresRef);
        const healthScoresData = healthScoresSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHealthScores(healthScoresData);
        
        // Fetch travel history
        const travelHistoryRef = collection(db, `users/${id}/travelHistory`);
        const travelHistorySnap = await getDocs(travelHistoryRef);
        const travelHistoryData = travelHistorySnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTravelHistory(travelHistoryData);
        
        // Fetch specific travel data if travelId is provided
        if (travelId) {
          const travelDocRef = doc(db, `users/${id}/travelHistory`, travelId);
          const travelDocSnap = await getDoc(travelDocRef);
          if (travelDocSnap.exists()) {
            setTravelData(travelDocSnap.data());
          }
        }
        
        // Fetch vaccinations
        const vaccinationsRef = collection(db, `users/${id}/vaccinations`);
        const vaccinationsSnap = await getDocs(vaccinationsRef);
        const vaccinationsData = vaccinationsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVaccinations(vaccinationsData);
        
        // Generate mock symptom data for the chart
        // In a real app, this would come from the questionnaire responses
        setSymptoms([
          { week: 'Week 1', count: Math.floor(Math.random() * 3) },
          { week: 'Week 2', count: Math.floor(Math.random() * 3) },
          { week: 'Week 3', count: Math.floor(Math.random() * 3) },
          { week: 'Week 4', count: Math.floor(Math.random() * 3) },
          { week: 'Week 5', count: Math.floor(Math.random() * 3) },
        ]);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load passenger data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, travelId]);

  const handleApproveTravel = () => {
    // In a real app, this would update the database
    alert('Passenger approved for travel. Redirecting to boarding pass system...');
    // Here you would integrate with the airport's boarding pass system
    // For now we'll just go back to the passenger list
    navigate('/passengers');
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-md bg-red-50 p-4">
          <h3 className="text-sm font-medium text-red-800">{error}</h3>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  // Get general health score
  const generalHealthScore = healthScores.length > 0 ? healthScores[0].healthScore : 0;
  
  // Get relative health score for this trip
  const relativeHealthScore = travelData ? parseFloat(travelData.travelHealthScore) : 0;
  
  // Determine health status
  let healthStatus = 'Declined';
  let statusColor = 'red';
  
  if (relativeHealthScore > 8.5) {
    healthStatus = 'Approved';
    statusColor = 'green';
  } else if (relativeHealthScore >= 7) {
    healthStatus = 'Needs Review';
    statusColor = 'yellow';
  }

  // Prepare chart data
  const healthScoreData = {
    labels: ['Health Score', 'Remaining'],
    datasets: [
      {
        data: [generalHealthScore, 10 - generalHealthScore],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(229, 231, 235, 0.5)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const relativeHealthScoreData = {
    labels: ['Health Score', 'Remaining'],
    datasets: [
      {
        data: [relativeHealthScore, 10 - relativeHealthScore],
        backgroundColor: [
          relativeHealthScore > 8.5 ? 'rgba(16, 185, 129, 0.8)' : 
          relativeHealthScore >= 7 ? 'rgba(251, 191, 36, 0.8)' : 'rgba(239, 68, 68, 0.8)',
          'rgba(229, 231, 235, 0.5)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const symptomsData = {
    labels: symptoms.map(item => item.week),
    datasets: [
      {
        label: 'Symptoms Reported',
        data: symptoms.map(item => item.count),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      }
    ],
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                {userData.name}
              </h1>
              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {userData.gender}, {userData.age} years
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {userData.email}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  UID: {userData.uid}
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:ml-4 md:mt-0">
              <button
                type="button"
                onClick={() => navigate('/passengers')}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleApproveTravel}
                className="ml-3 inline-flex items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                disabled={relativeHealthScore < 7}
              >
                Approve Travel
              </button>
            </div>
          </div>
          
          {travelData && (
            <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Current Trip Details</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="overflow-hidden rounded-md bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Travel ID</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{travelData.travelID}</dd>
                  </div>
                  <div className="overflow-hidden rounded-md bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Route</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      {travelData.currentCity} → {travelData.destinationCity}
                    </dd>
                  </div>
                  <div className={`overflow-hidden rounded-md bg-${statusColor}-50 px-4 py-5 shadow sm:p-6`}>
                    <dt className={`truncate text-sm font-medium text-${statusColor}-700`}>Health Status</dt>
                    <dd className={`mt-1 text-3xl font-semibold tracking-tight text-${statusColor}-900`}>{healthStatus}</dd>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Health Score Charts */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* General Health Score */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">General Health Score</h3>
                <div className="mt-5 flex flex-col items-center">
                  <div className="h-48 w-48">
                    <Doughnut 
                      data={healthScoreData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        cutout: '80%',
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            enabled: false
                          }
                        }
                      }} 
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-3xl font-bold text-gray-900">{generalHealthScore} / 10</p>
                    <p className="text-sm text-gray-500">Overall health assessment</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Relative Health Score */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Trip-specific Health Score</h3>
                <div className="mt-5 flex flex-col items-center">
                  <div className="h-48 w-48">
                    <Doughnut 
                      data={relativeHealthScoreData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        cutout: '80%',
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            enabled: false
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className={`text-3xl font-bold text-${statusColor}-600`}>{relativeHealthScore} / 10</p>
                    <p className="text-sm text-gray-500">Health assessment for current trip</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Additional Health Data */}
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Vaccinations */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Vaccination Status</h3>
                <div className="mt-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-base font-medium text-gray-700">Vaccines Taken</span>
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">{vaccinations.length}</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                      {vaccinations.length > 0 ? (
                        vaccinations.map((vaccine) => (
                          <li key={vaccine.id} className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
                                  <svg className="h-5 w-5 text-teal-700" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="ml-4">
                                  <p className="text-sm font-medium text-gray-900">{vaccine.vaccineName}</p>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="py-3 text-center text-sm text-gray-500">No vaccination records found.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Symptoms Trend */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Symptoms Trend (Last 5 Weeks)</h3>
                <div className="mt-5 h-64">
                  <Bar 
                    data={symptomsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 5,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Travel History */}
          <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Previous Travel History</h3>
              <div className="mt-5">
                {travelHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Travel ID</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Source</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Destination</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Health Score</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {travelHistory.map((travel) => {
                          const score = parseFloat(travel.travelHealthScore);
                          let status = 'Declined';
                          let statusColor = 'red';
                          
                          if (score > 8.5) {
                            status = 'Approved';
                            statusColor = 'green';
                          } else if (score >= 7) {
                            status = 'Review';
                            statusColor = 'yellow';
                          }
                          
                          return (
                            <tr key={travel.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {travel.travelID}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{travel.currentCity}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{travel.destinationCity}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{score.toFixed(1)}/10</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`inline-flex rounded-full bg-${statusColor}-100 px-2 text-xs font-semibold leading-5 text-${statusColor}-800`}>
                                  {status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-500">No travel history found.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Action panel */}
          {travelData && relativeHealthScore >= 7 && (
            <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Travel Decision</h3>
                <div className="mt-5">
                  <div className="rounded-md bg-teal-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-teal-700">
                          This passenger is eligible for travel. You can approve their journey and proceed to boarding pass issuance.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleApproveTravel}
                      className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                      Approve and Issue Boarding Pass
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {travelData && relativeHealthScore < 7 && (
            <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Travel Decision</h3>
                <div className="mt-5">
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          This passenger is not eligible for travel due to health concerns. Please advise them to consult with a healthcare provider before attempting to travel.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PassengerDetails;