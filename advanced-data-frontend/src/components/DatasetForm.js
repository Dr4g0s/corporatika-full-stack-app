import React, { useState } from 'react';
import { Form, Input, Button } from './styles';
import { createDataset } from '../api';

const DatasetForm = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const [jsonData, setJsonData] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: name,
            data: JSON.parse(jsonData) // Convert string to JSON
        };

        createDataset(data)
            .then(() => {
                setName('');
                setJsonData('');
                onSuccess();
            })
            .catch((error) => console.error('Error creating dataset:', error));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                type="text"
                placeholder="Dataset Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder="Enter a list of JSON data [{key: val}, {key: val}, ...]"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                rows="10"
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }}
                required
            />
            <Button type="submit">Create Dataset</Button>
        </Form>
    );
};

export default DatasetForm;
