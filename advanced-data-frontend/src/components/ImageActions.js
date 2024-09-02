import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getImageAction, manipulateImage } from '../api';
import './ImageActions.css';
import { ImageContainer, Image } from './styles';
import ManipulateImageForm from './ManipulateImageForm';


const ImageActions = ({ filename }) => {
    const [result, setResult] = useState({
        histogram: null,
        segmentation: null,
        manipulation: null
    });
    const [showManipulateForm, setShowManipulateForm] = useState(false);
    const [activeAction, setActiveAction] = useState(null);

    const handleAction = async (action, data={}) => {
        try {
            let response;
            if (action === 'manipulate') {
                response = await manipulateImage(filename, data)
            } else {
                response = await getImageAction(filename, action)
            }

            setResult(prevResult => ({
                ...prevResult,
                [action]: response.data
            }));

            setActiveAction(action);
        } catch (error) {
            console.error(`Error performing ${action} on image:`, error);
        }
    };

    const handleManipulateSubmit = (data) => {
        handleAction('manipulate', data);
        setShowManipulateForm(false);
    };

    return (
        <div className="image-actions">
            <div className="button-group">
                <button onClick={() => handleAction('histogram')} className="action-button">Generate Histogram</button>
                <button onClick={() => {setShowManipulateForm(true);}}>Manipulate Image</button>
                <button onClick={() => handleAction('segmentation')} className="action-button">Generate Segmentation</button>
            </div>
            <div>
                {showManipulateForm && <ManipulateImageForm onSubmit={handleManipulateSubmit} />}
            </div>
            {result && (
                <div className="result-container">
                    {activeAction === 'histogram' && result.histogram && <Histogram data={result.histogram} />}
                    {activeAction === 'segmentation' && result && result.segmentation && <SegmentationMask imageBase64={result.segmentation.image} />}
                    {activeAction === 'manipulate' && result && result.manipulate && <ManipulatedImage image={result.manipulate.image} />}
                </div>
            )}
        </div>
    );
};


const Histogram = ({ data }) => {
    // Assuming data is an object with keys 'red', 'green', 'blue' and each containing an array of values.
    const getColorHistogram = (color) => data[color].map((value, index) => (
        <div
            key={index}
            style={{
                width: '2px',
                height: `${value / 50}px`,
                backgroundColor: color,
                display: 'inline-block',
                marginRight: '1px',
                verticalAlign: 'bottom',
            }}
        />
    ));

    return (
        <div className="histogram">
            <h3>Histogram</h3>
            <div className="histogram-section">
                <h4>Red</h4>
                <div className="histogram-bars">
                    {getColorHistogram('red')}
                </div>
            </div>
            <div className="histogram-section">
                <h4>Green</h4>
                <div className="histogram-bars">
                    {getColorHistogram('green')}
                </div>
            </div>
            <div className="histogram-section">
                <h4>Blue</h4>
                <div className="histogram-bars">
                    {getColorHistogram('blue')}
                </div>
            </div>
        </div>
    );
};

const SegmentationMask = ({ imageBase64 }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <img 
                src={`data:image/png;base64,${imageBase64}`} 
                alt="Segmentation Mask" 
                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} 
            />
        </div>
    );
};

const ManipulatedImage = ({ image }) => {
    if (!image) return null;

    return (
        <ImageContainer>
            <Image src={`data:image/png;base64,${image}`} alt="Manipulated" />
        </ImageContainer>
    );
};

ImageActions.propTypes = {
    filename: PropTypes.string.isRequired,
};

export default ImageActions;
