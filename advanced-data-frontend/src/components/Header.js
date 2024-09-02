import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      className="bg-blue-500 text-white p-4"
      initial={{ y: -250 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <h1 className="text-2xl font-bold">Advanced Data Analysis App</h1>
      <nav>
        <ul className="flex space-x-4 mt-2">
          <li>
            <Link to="/" className="text-white hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/datasets" className="text-white hover:underline">Datasets</Link>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
};

export default Header;
