import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Title } from './styles';
import DatasetForm from './DatasetForm';
import ImageUploadForm from './ImageUploadForm';
import ImageActions from './ImageActions';
import TextAnalysisForm from './TextAnalysisForm';


const Dashboard = () => {
    const [uploadedFilename, setUploadedFilename] = useState('');
    const [textAnalysisResult, setTextAnalysisResult] = useState(null);
    const [message, setMessage] = useState('');

    const handleSuccess = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 5000);
    };

    const handleImageUploadSuccess = (message, filename) => {
        console.log(message);
        setUploadedFilename(filename);
    };

    const handleTextAnalysisSuccess = (message) => {
        setTextAnalysisResult(message);
    };

    return (
        <Container>
            {message && <div style={{ marginBottom: '20px', color: '#28a745' }}>{message}</div>}

            <Section>
                <Title>Datasets</Title>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <DatasetForm onSuccess={() => handleSuccess('Dataset created successfully!')} />
                </motion.div>
            </Section>

            <Section>
                <Title>Images</Title>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <ImageUploadForm onSuccess={(filename) => handleImageUploadSuccess('Image uploaded successfully!', filename)} />
                </motion.div>
                {uploadedFilename && <ImageActions filename={uploadedFilename} />}
            </Section>

            <Section>
                <Title>Text Analysis</Title>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <TextAnalysisForm onSuccess={handleTextAnalysisSuccess} />
                    {textAnalysisResult && (
                        <div>
                            <h3>Analysis Results</h3>
                            {/* Display results based on action performed */}
                            <pre>{JSON.stringify(textAnalysisResult, null, 2)}</pre>
                        </div>
                    )}
                </motion.div>
            </Section>
        </Container>
    );
};

export default Dashboard;
