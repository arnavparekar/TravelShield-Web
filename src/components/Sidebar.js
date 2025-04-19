import { Link, useLocation } from 'react-router-dom';
import logo from "./logo2.png";
const Sidebar = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Passengers', path: '/passengers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  return (
    <div className="flex w-64 flex-col bg-teal-800">
      <div className="flex h-16 flex-shrink-0 items-center justify-center bg-teal-900">
        <img className="h-12 w-auto" src={logo} alt="TravelShield Logo" />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  isActive ? 'bg-teal-900 text-white' : 'text-teal-100 hover:bg-teal-700'
                } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
              >
                <svg
                  className="mr-3 h-6 w-6 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}" />` }}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;