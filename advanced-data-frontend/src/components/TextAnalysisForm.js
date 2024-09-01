import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { summarizeText, getKeywords, getSentiment, visualizeTsne } from '../api';


const TextAnalysisForm = ({ onSuccess }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [tsnePlot, setTsnePlot] = useState(null);
    
    const handleAction = async (action) => {
        setLoading(true);
        try {
            let response;
            switch (action) {
                case 'summarize':
                    response = await summarizeText(text);
                    break;
                case 'keywords':
                    response = await getKeywords(text);
                    break;
                case 'sentiment':
                    response = await getSentiment(text);
                    break;
                case 'tsne':
                    let texts = text.split(',').map(text => text.trim()).filter(text => text);
                    if (texts.length === 0) {
                        alert('Please enter some text.');
                        return;
                    }
                    response = await visualizeTsne(texts);

                    if (response && response.data){
                        let decoded = response.data.replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode('0x' + p1));
                        let bytes = new Uint8Array(decoded.length);
                        for (let i = 0; i < decoded.length; i++) {
                            bytes[i] = decoded.charCodeAt(i);
                        }
                        let base64 = btoa(String.fromCharCode.apply(null, bytes));
                        const tsneImageUrl = `data:image/png;base64,${base64}`
                        setTsnePlot(tsneImageUrl);
                    } else {
                        throw new Error('Invalid T-SNE plot data');
                    }
                    
                    break;
                default:
                    throw new Error('Unknown action');
            }
            
            if (action !== 'tsne') {
                onSuccess(response.data);
            }

        } catch (error) {
            console.error(`Error performing ${action} on text:`, error);
            if (error.response) {
                onSuccess({ error: error.response.data.error });
            } else {
                onSuccess({ error: error });
            }
            
        }
        setLoading(false);
    };

    return (
        <div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here"
                rows="6"
                cols="50"
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }}
            />
            <div className="button-group">
                <button onClick={() => handleAction('summarize')} className="action-button" disabled={loading}>
                    Summarize
                </button>
                <button onClick={() => handleAction('keywords')} className="action-button" disabled={loading}>
                    Extract Keywords
                </button>
                <button onClick={() => handleAction('sentiment')} className="action-button" disabled={loading}>
                    Analyze Sentiment
                </button>
                <button onClick={() => handleAction('tsne')} className="action-button" disabled={loading}>
                    Visualize with t-SNE
                </button>
            </div>
            {tsnePlot && (
                <div className="section">
                    <h2 className="title">t-SNE Visualization</h2>
                    <img
                        style={{
                            display: 'block',
                            maxWidth: '100%',
                            height: 'auto',
                            marginTop: '20px',
                            border: '1px solid #ddd',
                            borderRadius: '8px'
                        }}
                        src={tsnePlot}
                        alt="t-SNE Visualization"
                    />
                </div>
            )}
        </div>
    );
};

TextAnalysisForm.propTypes = {
    onSuccess: PropTypes.func.isRequired,
};

export default TextAnalysisForm;
