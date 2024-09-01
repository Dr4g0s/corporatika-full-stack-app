# Project README

## Overview

This project involves a backend API and a frontend application. The backend is built with Flask, and the frontend is developed using React. The project includes functionalities such as dataset management, image manipulation, and text analysis.

## Table of Contents

1. [Backend Setup](#backend-setup)
2. [Frontend Setup](#frontend-setup)
3. [Running the Project](#running-the-project)
4. [API Endpoints](#api-endpoints)
5. [Troubleshooting](#troubleshooting)

---

## Backend Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/your-repository.git
    cd your-repository/advanced-data-app
    ```

2. **Create a Virtual Environment**

    ```bash
    python -m venv venv
    ```

3. **Activate the Virtual Environment**

    - **Windows:**

      ```bash
      venv\Scripts\activate
      ```

    - **macOS/Linux:**

      ```bash
      source venv/bin/activate
      ```

4. **Install Dependencies**

    ```bash
    pip install -r requirements.txt
    ```

5. **Run the Backend**

    ```bash
    python run.py
    ```

    The backend will be available at `http://127.0.0.1:5000`.

---

## Frontend Setup

### Prerequisites

- Node.js 16.x or higher
- npm (Node package manager)

### Installation

1. **Navigate to the Frontend Directory**

    ```bash
    cd your-repository/advanced-data-frontend
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Run the Frontend**

    ```bash
    npm start
    ```

    The frontend will be available at `http://localhost:3000`.

---

## Running the Project

1. **Start the Backend**

    Follow the [Backend Setup](#backend-setup) instructions to run the Flask server.

2. **Start the Frontend**

    Follow the [Frontend Setup](#frontend-setup) instructions to start the React development server.

---

## API Endpoints

Here’s a brief overview of the key API endpoints:

- **Dataset Management**
  - `POST /api/datasets` - Create a new dataset
  - `GET /api/datasets/<id>` - Retrieve a dataset by ID
  - `PUT /api/datasets/<id>` - Update a dataset
  - `DELETE /api/datasets/<id>` - Delete a dataset

- **Image Manipulation**
  - `POST /api/images/upload` - Upload an image
  - `POST /api/images/<filename>/histogram` - Get histogram of an image
  - `POST /api/images/<filename>/segmentation` - Get segmentation mask of an image
  - `POST /api/images/<filename>/manipulate` - Resize an image

- **Text Analysis**
  - `POST /api/summarize` - Summarize texts
  - `POST /api/keywords` - Extract keywords from texts
  - `POST /api/sentiment` - Analyze sentiment of texts
  - `POST /api/tsne_visualization` - Generate T-SNE plot from texts

---
