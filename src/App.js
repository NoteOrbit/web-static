import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const allIngredients = [
    { icon: '🍅', label: 'Transactions' },
    { icon: '🥬', label: 'Employees' },
  ];

  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(allIngredients[0]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/.auth/me');
        const payload = await response.json();
        const { clientPrincipal } = payload;

        if (clientPrincipal) {
          setLoggedIn(true);
          setUser(clientPrincipal);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const getUserName = () => {
    if (user) {
      return `${user.userDetails} Roles:(${user.userRoles})`;
    }
    return '';
  };

  const logout = () => {
    window.location.href = '/.auth/logout';
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = '';
        if (selectedTab.label === 'Transactions') {
          endpoint = '/data-api/rest/Transaction';
        } else if (selectedTab.label === 'Employees') {
          endpoint = '/data-api/rest/Employees'; // Update with the correct endpoint for Employees
        }

        const response = await fetch(endpoint);

        if (response.status === 403) {
          setError('You do not have permission to access this resource.');
          setData([]);  // Clear data to avoid displaying previous data
        } else if (!response.ok) {
          throw new Error('Network response was not ok');
        } else {
          const jsonData = await response.json();
          setData(jsonData.value);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
      }
    };

    fetchData();
  }, [selectedTab]);

  const getTableHeaders = () => {
    if (selectedTab.label === 'Transactions') {
      return (
        <tr>
          <th className="py-2 px-4 border-b">ID</th>
          <th className="py-2 px-4 border-b">ProductID</th>
          <th className="py-2 px-4 border-b">CustomerID</th>
          <th className="py-2 px-4 border-b">CategoryName</th>
          <th className="py-2 px-4 border-b">Quantity</th>
          <th className="py-2 px-4 border-b">UnitPrice</th>
          <th className="py-2 px-4 border-b">TotalPrice</th>
          <th className="py-2 px-4 border-b">Date</th>
          <th className="py-2 px-4 border-b">GrandTotal</th>
        </tr>
      );
    } else if (selectedTab.label === 'Employees') {
      return (
        <tr>
          <th className="py-2 px-4 border-b">EmployeeID</th>
          <th className="py-2 px-4 border-b">FirstName</th>
          <th className="py-2 px-4 border-b">LastName</th>
          <th className="py-2 px-4 border-b">JobTitle</th>
          <th className="py-2 px-4 border-b">HireDate</th>
          <th className="py-2 px-4 border-b">Salary</th>
        </tr>
      );
    }
  };

  const getTableData = () => {
    if (selectedTab.label === 'Transactions') {
      return data.map((item) => (
        <tr key={item.Transaction_ID}>
          <td className="py-2 px-4 border-b">{item.Transaction_ID}</td>
          <td className="py-2 px-4 border-b">{item.Product_ID}</td>
          <td className="py-2 px-4 border-b">{item.Customer_ID}</td>
          <td className="py-2 px-4 border-b">{item.Product_Category}</td>
          <td className="py-2 px-4 border-b">{item.Quantity}</td>
          <td className="py-2 px-4 border-b">{item.Sales_Amount}</td>
          <td className="py-2 px-4 border-b">{item.Total_price}</td>
          <td className="py-2 px-4 border-b">{item.Transaction_Date}</td>
          <td className="py-2 px-4 border-b">{item.Unit_Price}</td>
        </tr>
      ));
    } else if (selectedTab.label === 'Employees') {
      return data.map((item) => (
        <tr key={item.employee_id}>
          <td className="py-2 px-4 border-b">{item.employee_id}</td>
          <td className="py-2 px-4 border-b">{item.first_name}</td>
          <td className="py-2 px-4 border-b">{item.last_name}</td>
          <td className="py-2 px-4 border-b">{item.job_title}</td>
          <td className="py-2 px-4 border-b">{item.hire_date}</td>
          <td className="py-2 px-4 border-b">{item.salary}</td>
        </tr>
      ));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Static Web App Azure</h1>
      <div>
        {loggedIn ? (
          <div>
            <p>Welcome, {getUserName()}!</p>
            <button
              className="text-red-500 hover:underline cursor-pointer"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <a href="/.auth/login/aad" className="text-blue-500 hover:underline">
            Login
          </a>
        )}
      </div>
      <div className="window">
        <nav>
          <ul>
            {allIngredients.map((item) => (
              <li
                key={item.label}
                className={item === selectedTab ? 'selected' : ''}
                onClick={() => setSelectedTab(item)}
              >
                {`${item.icon} ${item.label}`}
                {item === selectedTab ? (
                  <motion.div className="underline" layoutId="underline" />
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
        <main>
        <AnimatePresence>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>{getTableHeaders()}</thead>
                  <tbody>{getTableData()}</tbody>
                </table>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
