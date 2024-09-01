import styled from 'styled-components';

export const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (max-width: 768px) {
        padding: 10px;
    }
`;

export const Section = styled.section`
    margin-bottom: 40px;
    padding: 20px;
    border-radius: 8px;
    background: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        margin-bottom: 20px;
        padding: 15px;
    }
`;

export const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 20px;
    color: #333;

    @media (max-width: 768px) {
        font-size: 1.5rem;
        margin-bottom: 10px;
    }
`;

export const Button = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
        background-color: #0056b3;
    }

    @media (max-width: 768px) {
        padding: 8px 16px;
    }
`;

export const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
    font-size: 1rem;

    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    background-color: #f9f9f9;
`;

export const Image = styled.img`
    max-width: 100%;
    max-height: 500px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;