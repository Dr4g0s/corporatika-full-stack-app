import axios from 'axios';


const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
});

// -------------------- Text Analysis APIs --------------------

// Summarize Text
export const summarizeText = (text) => {
  return api.post('/text/summarize', { text });
};

// Get Keywords
export const getKeywords = (text) => {
  return api.post('/text/keywords', { text });
};

// Get Sentiment
export const getSentiment = (text) => {
  return api.post('/text/sentiment', { text });
};

// Generate t-SNE Plot
export const visualizeTsne = (textArray) => {
  return api.post('/text/tsne', { texts: textArray });
};

// -------------------- Image Processing APIs --------------------

// Upload Image
export const uploadImage = (formData) => {
  return api.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Handle image action
export const getImageAction = (filename, action) => {
  return api.get(`/images/${filename}/${action}`);
};

// Manipulate Image
export const manipulateImage = (filename, manipulationParams) => {
  return api.post(`/images/${filename}/manipulate`, manipulationParams);
};

// -------------------- Dataset Management APIs --------------------

// Get All Datasets
export const getAllDatasets = () => {
  return api.get('/datasets');
};

export const createDataset = (datasetData) => {
    return api.post('/datasets', datasetData);
};

export const updateDataset = (id, datasetData) => {
  return api.put(`/datasets/${id}`, datasetData);
};

// Get Specific Dataset by ID
export const getDatasetById = (id) => {
  return api.get(`/datasets/${id}`);
};

export const deleteDataset = (id) => {
  return api.delete(`/datasets/${id}`);
};

// Visualize Dataset Column
export const visualizeDatasetColumn = (id, column) => {
  return api.get(`/datasets/${id}/visualize/${column}`);
};

// Get Dataset Statistics
export const getDatasetStatistics = (id) => {
  return api.get(`/datasets/${id}/statistics`);
};
