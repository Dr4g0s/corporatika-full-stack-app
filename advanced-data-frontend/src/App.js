import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';
import DatasetDetail from './components/DatasetDetail';
import DatasetUpdate from './components/DatasetUpdate';


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/datasets" element={<DataTable />} />
          <Route path="/datasets/:id" element={<DatasetDetail />} />
          <Route path="/datasets/:id/update" element={<DatasetUpdate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
