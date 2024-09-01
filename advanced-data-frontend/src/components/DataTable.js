import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllDatasets, deleteDataset } from '../api';
import { Link } from 'react-router-dom';

const DataTable = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this dataset?')) {
          try {
            await deleteDataset(id);
            
            const response = await getAllDatasets();
            setDatasets(response.data);
          } catch (err) {
            console.error(err);
            alert('Failed to delete dataset.');
          }
        }
  }

  // Fetch all datasets on component mount
  useEffect(() => {
    const fetchDatasets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllDatasets();
        setDatasets(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch datasets.');
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, []);

  return (
    <div className="p-4">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-xl font-semibold mb-4">Datasets</h2>

        {/* Dataset List */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Available Datasets</h3>
          {loading && <p>Loading datasets...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <ul className="list-disc list-inside">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="mb-4">
              <h3 className="text-lg font-medium">{dataset.name}</h3>
              <Link to={`/datasets/${dataset.id}`}>View Details</Link>
              <Link to={`/datasets/${dataset.id}/update`} className="ml-2">Update</Link>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                onClick={() => handleDelete(dataset.id)}
              >
                Delete
              </button>
            </div>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default DataTable;
