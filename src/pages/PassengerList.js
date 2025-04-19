import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const PassengerList = () => {
  const [loading, setLoading] = useState(true);
  const [passengers, setPassengers] = useState([]);
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [healthStatusFilter, setHealthStatusFilter] = useState('all');

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        // Get all users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const passengersData = [];
        
        // Process each user's travel history
        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const userData = userDoc.data();
          
          const travelHistoryRef = collection(db, `users/${userId}/travelHistory`);
          const travelHistorySnapshot = await getDocs(travelHistoryRef);
          
          travelHistorySnapshot.forEach(travelDoc => {
            const travelData = travelDoc.data();
            const healthScore = parseFloat(travelData.travelHealthScore);
            
            let healthStatus = 'declined';
            if (healthScore > 8.5) {
              healthStatus = 'approved';
            } else if (healthScore >= 7 && healthScore <= 8.5) {
              healthStatus = 'pending';
            }
            
            passengersData.push({
              id: travelDoc.id,
              userId: userId,
              userName: userData.name,
              travelId: travelData.travelID,
              source: travelData.currentCity,
              destination: travelData.destinationCity,
              healthScore: healthScore,
              healthStatus: healthStatus,
              // Using travelId as a proxy for date since we don't have actual dates
              date: travelData.travelID
            });
          });
        }
        
        setPassengers(passengersData);
        setFilteredPassengers(passengersData);
      } catch (error) {
        console.error('Error fetching passengers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPassengers();
  }, []);

  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...passengers];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        passenger => 
          passenger.userName.toLowerCase().includes(query) ||
          passenger.travelId.toLowerCase().includes(query) ||
          passenger.source.toLowerCase().includes(query) ||
          passenger.destination.toLowerCase().includes(query)
      );
    }
    
    // Apply date filter
    if (dateFilter) {
      // Since we don't have actual dates, we're using travelId as a proxy
      // In a real implementation, you'd filter by actual date fields
      result = result.filter(
        passenger => passenger.date.includes(dateFilter)
      );
    }
    
    // Apply health status filter
    if (healthStatusFilter !== 'all') {
      result = result.filter(
        passenger => passenger.healthStatus === healthStatusFilter
      );
    }
    
    setFilteredPassengers(result);
  }, [searchQuery, dateFilter, healthStatusFilter, passengers]);

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
          <h1 className="text-2xl font-semibold text-gray-900">Passenger List</h1>
          
          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="search" className="sr-only">Search</label>
              <input
                type="text"
                id="search"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                placeholder="Search passenger name, travel ID, route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="date-filter" className="sr-only">Filter by Date</label>
              <input
                type="text"
                id="date-filter"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                placeholder="Filter by travel ID"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status-filter" className="sr-only">Filter by Health Status</label>
              <select
                id="status-filter"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                value={healthStatusFilter}
                onChange={(e) => setHealthStatusFilter(e.target.value)}
              >
                <option value="all">All Health Statuses</option>
                <option value="approved">Safe to Travel</option>
                <option value="pending">Needs Review</option>
                <option value="declined">Not Eligible</option>
              </select>
            </div>
          </div>
          
          {/* Passenger Table */}
          <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Passenger</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Flight ID</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Route</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Health Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredPassengers.length > 0 ? (
                    filteredPassengers.map((passenger) => (
                      <tr key={passenger.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900">{passenger.userName}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{passenger.travelId}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {passenger.source} → {passenger.destination}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {passenger.healthStatus === 'approved' ? (
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Approved</span>
                          ) : passenger.healthStatus === 'pending' ? (
                            <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">Pending Review</span>
                          ) : (
                            <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">Declined</span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link to={`/passengers/${passenger.userId}?travelId=${passenger.id}`} className="text-teal-600 hover:text-teal-900">
                            View details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-4 px-6 text-center text-sm text-gray-500">
                        No passengers found matching the filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PassengerList;