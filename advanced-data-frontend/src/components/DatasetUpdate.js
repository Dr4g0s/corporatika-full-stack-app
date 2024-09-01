import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatasetById, updateDataset } from '../api';

const DatasetUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState(null);
  const [name, setName] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataset = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getDatasetById(id);
        setDataset(response.data);
        setName(response.data.name);
        setData(response.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch dataset details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDataset();
  }, [id]);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateDataset(id, { name, data });
      navigate(`/datasets/${id}`); // Redirect to the dataset detail page
    } catch (err) {
      console.error(err);
      setError('Failed to update dataset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {dataset && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Update Dataset: {dataset.name}</h2>
          <div className="mb-4">
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Data (JSON):</label>
            <textarea
              className="p-2 border rounded w-full"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Dataset'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DatasetUpdate;
