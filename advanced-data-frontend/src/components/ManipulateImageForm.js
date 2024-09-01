import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ManipulateImageForm = ({ onSubmit }) => {
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ width: parseInt(width), height: parseInt(height) });
    };

    return (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '300px' }}>
            <h3 style={{ marginBottom: '15px' }}>Manipulate Image</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '10px' }}>
                    <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Width:</span>
                    <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        required
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </label>
                <label style={{ marginBottom: '20px' }}>
                    <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Height:</span>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </label>
                <button
                    type="submit"
                    style={{
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

ManipulateImageForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default ManipulateImageForm;
