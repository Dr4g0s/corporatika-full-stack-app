import React from 'react';
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
    </motion.header>
  );
};

export default Header;
