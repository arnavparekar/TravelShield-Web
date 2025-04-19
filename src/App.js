import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './pages/Login';
import Landing from './pages/Landing';
import PassengerList from './pages/PassengerList';
import PassengerDetails from './pages/PassengerDetails';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { auth } from './firebase';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-teal-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {user && <Sidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          {user && <Header user={user} />}
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/" element={!user ? <Navigate to="/login" /> : <Landing />} />
            <Route path="/dashboard" element={!user ? <Navigate to="/login" /> : <Landing />} />
            <Route path="/passengers" element={!user ? <Navigate to="/login" /> : <PassengerList />} />
            <Route path="/passengers/:id" element={!user ? <Navigate to="/login" /> : <PassengerDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;