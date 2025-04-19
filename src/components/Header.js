import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Header = ({ user }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-teal-700">TravelShield</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">{user?.email || 'Airport Authority'}</span>
            <button
              onClick={handleSignOut}
              className="rounded-md bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;