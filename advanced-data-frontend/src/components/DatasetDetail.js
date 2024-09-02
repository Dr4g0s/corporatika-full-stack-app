import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDatasetById, visualizeDatasetColumn, getDatasetStatistics } from '../api';


const DatasetDetail = () => {
  const { id } = useParams();
  const [dataset, setDataset] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showStatistics, setShowStatistics] = useState(false);

  // Fetch dataset details and statistics when the component is mounted
  useEffect(() => {
    const fetchDatasetDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const datasetResponse = await getDatasetById(id);
        setDataset(datasetResponse.data);

        const statsResponse = await getDatasetStatistics(id);
        setStatistics(statsResponse.data); // Assuming { statistics: {...} }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch dataset details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDatasetDetails();
  }, [id]);

  // Handle column visualization
  const handleVisualize = async () => {
    if (!dataset || !selectedColumn) return;
    setLoading(true);
    setError(null);
    try {
      const vizResponse = await visualizeDatasetColumn(id, selectedColumn);
      const imageBase64 = vizResponse.data.image;
      setVisualizationData(imageBase64);
    } catch (err) {
      console.error(err);
      setError('Failed to visualize column.');
    } finally {
      setLoading(false);
    }
  };

  const columns = dataset ? Object.keys(JSON.parse(dataset.data)[0]) : [];

  return (
    <div className="p-4">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {dataset && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Dataset: {dataset.name}</h2>
          {/* <div className="mb-4">
            <h3 className="text-lg font-medium">Dataset Details:</h3>
            <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(dataset, null, 2)}</pre>
          </div> */}

          {/* Toggle Button for Statistics */}
          <div className="mb-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowStatistics(!showStatistics)}
            >
              {showStatistics ? 'Hide Statistics' : 'Show Statistics'}
            </button>
          </div>

          {showStatistics && statistics && (
            <div className="mb-6">
              <h3 className="text-lg font-medium">Statistics:</h3>
              <pre className="bg-gray-100 p-2 rounded">
                {JSON.stringify(statistics, null, 2)}
              </pre>
            </div>
          )}

          {/* Column Visualization */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Visualize Column</h3>
            <div className="flex items-center mb-2">
              <select
                className="p-2 border rounded mr-2"
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
              >
                <option value="">Select Column</option>
                {columns && columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleVisualize}
                disabled={loading || !selectedColumn}
              >
                {loading ? 'Visualizing...' : 'Visualize'}
              </button>
            </div>

            {visualizationData && (
              <div className="mt-4">
                <img src={`data:image/png;base64,${visualizationData}`} alt="Visualization" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetDetail;
