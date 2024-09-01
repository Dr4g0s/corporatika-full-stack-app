import React, { useState } from 'react';
import { uploadImage } from '../api';


const ImageUploadForm = ({ onSuccess }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await uploadImage(formData)
            if (response.status === 201) {
                onSuccess(response.data.filename);
              } else {
                console.error('Upload failed');
              }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="file" 
                onChange={handleFileChange}
                required 
            />
            <button type="submit">Upload Image</button>
        </form>
    );
};

export default ImageUploadForm;
