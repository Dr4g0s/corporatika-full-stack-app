from flask import request, jsonify, send_from_directory
import app
from app import app, db
from app.models import Dataset
from app.utils import allowed_file, summarize_text, extract_keywords,\
    analyze_sentiment, generate_tsne_plot
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
import json
import os
from werkzeug.utils import secure_filename
from PIL import Image
import numpy as np
# from flask_socketio import emit
# from app import socketio



@app.route('/datasets', methods=['POST'])
def create_dataset():
    data = request.get_json()
    name = data.get('name')
    table_data = data.get('data')

    # Convert data to JSON format
    json_data = json.dumps(table_data)

    dataset = Dataset(name=name, data=json_data)
    db.session.add(dataset)
    db.session.commit()

    return jsonify({'message': 'Dataset created', 'dataset_id': dataset.id}), 201

@app.route('/datasets', methods=['GET'])
def get_all_datasets():
    datasets = Dataset.query.all()
    dataset_list = [{'id': ds.id, 'name': ds.name, 'data': ds.data} for ds in datasets]
    return jsonify(dataset_list)

@app.route('/datasets/<int:id>', methods=['GET'])
def get_dataset(id):
    dataset = Dataset.query.get_or_404(id)
    return jsonify({'id': dataset.id, 'name': dataset.name, 'data': dataset.data})

@app.route('/datasets/<int:id>', methods=['PUT'])
def update_dataset(id):
    dataset = Dataset.query.get_or_404(id)
    data = request.get_json()
    dataset.name = data.get('name', dataset.name)

    new_data = data.get('data', None)
    if new_data is not None:
        try:
            parsed_data = json.loads(new_data) if isinstance(new_data, str) else new_data
            if not isinstance(parsed_data, list):
                raise ValueError("Data should be a list of records")
            dataset.data = json.dumps(parsed_data)
        except (ValueError, TypeError, json.JSONDecodeError) as e:
            return jsonify({"error": str(e)}), 400

    db.session.commit()
    return jsonify({'message': 'Dataset updated'})

@app.route('/datasets/<int:id>', methods=['DELETE'])
def delete_dataset(id):
    dataset = Dataset.query.get_or_404(id)
    db.session.delete(dataset)
    db.session.commit()
    return jsonify({'message': 'Dataset deleted'})

@app.route('/datasets/<int:id>/statistics', methods=['GET'])
def get_dataset_statistics(id):
    dataset = Dataset.query.get_or_404(id)
    data = json.loads(dataset.data)

    # Convert JSON data to Pandas DataFrame
    df = pd.DataFrame(data)

    statistics = {
        'mean': df.mean().to_dict(),
        'median': df.median().to_dict(),
        'mode': df.mode().iloc[0].to_dict(),
        'quartiles': df.quantile([0.25, 0.5, 0.75]).to_dict(),
        'outliers': df.apply(lambda x: list(x[(x < (x.mean() - 2 * x.std())) | (x > (x.mean() + 2 * x.std()))])).to_dict(),
    }

    return jsonify(statistics)

@app.route('/datasets/<int:id>/visualize/<string:column>', methods=['GET'])
def visualize_dataset(id, column):
    dataset = Dataset.query.get_or_404(id)
    data = json.loads(dataset.data)

    df = pd.DataFrame(data)

    if column not in df.columns:
        return jsonify({'error': f"Column '{column}' not found"}), 404

    # Create a histogram of the specified column
    plt.figure(figsize=(10, 6))
    df[column].hist(bins=20)

    # Save the plot to a BytesIO object
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)

    # Encode the image to base64 to send over HTTP
    img_base64 = base64.b64encode(img.getvalue()).decode()

    return jsonify({'image': img_base64})


@app.route('/images/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({"message": "File uploaded", "filename": filename}), 201
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/images/<filename>/histogram', methods=['GET'])
def generate_histogram(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404
    
    image = Image.open(filepath)
    histogram = image.histogram()
    
    # Split into RGB channels
    r_hist = histogram[0:256]
    g_hist = histogram[256:512]
    b_hist = histogram[512:768]

    return jsonify({
        "red": r_hist,
        "green": g_hist,
        "blue": b_hist
    })

@app.route('/images/<filename>/segmentation', methods=['GET'])
def generate_segmentation_mask(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    image = Image.open(filepath).convert('L')  # Convert to grayscale
    np_image = np.array(image)

    # Apply threshold to create a binary mask
    threshold = 128
    mask = np_image > threshold
    mask_image = Image.fromarray(np.uint8(mask * 255))

    # Save and return the mask image
    mask_filename = f"mask_{filename}"
    mask_path = os.path.join(app.config['UPLOAD_FOLDER'], mask_filename)
    mask_image.save(mask_path)

    try:
        with open(mask_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
        return jsonify({
            "image": encoded_string,
            "message": "Segmentation mask created"
        })
    except Exception:
        return jsonify({
            "message": "Segmentation mask created",
            "mask_filename": mask_filename
        })

@app.route('/images/<filename>/manipulate', methods=['POST'])
def manipulate_image(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    # Load the image
    image = Image.open(filepath)

    # Example: Resize the image
    width = int(request.form.get('width', 100))
    height = int(request.form.get('height', 100))
    resized_image = image.resize((width, height))

    # Save the resized image
    manipulated_filename = f"resized_{filename}"
    manipulated_path = os.path.join(app.config['UPLOAD_FOLDER'], manipulated_filename)
    resized_image.save(manipulated_path)

    try:
        with open(manipulated_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

        return jsonify({
            "image": encoded_string,
            "message": "Image resized"
        })
    except Exception as e:
        return jsonify({
            "message": "Image resized",
            "manipulated_filename": manipulated_filename
        })


@app.route('/text/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text')
    if not text:
        return jsonify({"error": "Text is required"}), 400

    summary = summarize_text(text)
    return jsonify({"summary": summary})

@app.route('/text/keywords', methods=['POST'])
def keywords():
    data = request.json
    text = data.get('text')
    if not text:
        return jsonify({"error": "Text is required"}), 400

    num_keywords = data.get('num_keywords', 5)
    keywords = extract_keywords(text, num_keywords)
    return jsonify({"keywords": keywords})

@app.route('/text/sentiment', methods=['POST'])
def sentiment():
    data = request.json
    text = data.get('text')
    if not text:
        return jsonify({"error": "Text is required"}), 400

    sentiment = analyze_sentiment(text)
    return jsonify({"sentiment": sentiment})

@app.route('/text/tsne', methods=['POST'])
def tsne_visualization():
    try:
        data = request.json
        texts = data.get('texts')
        if not texts or not isinstance(texts, list):
            return jsonify({"error": "A list of texts is required"}), 400

        generate_tsne_plot(texts)

        static_folder = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), '..', 'static'
        )

        filename = f"tsne_plot.png"
        path = os.path.join(static_folder, filename)
        with open(path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
        return jsonify({
            "image": encoded_string,
        })
    
        return send_from_directory(static_folder, 'tsne_plot.png')
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400
