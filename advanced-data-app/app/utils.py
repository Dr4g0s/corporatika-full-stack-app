import numpy as np
import nltk
import spacy
from sklearn.manifold import TSNE
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import PCA
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt


nltk.download('punkt')
nlp = spacy.load('en_core_web_sm')
analyzer = SentimentIntensityAnalyzer()


def allowed_file(filename):
    allowed_extensions = {'png', 'jpg', 'jpeg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def summarize_text(text):
    return text.split('.')[0] + '.'

def extract_keywords(text, num_keywords=5):
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform([text])
    feature_names = np.array(vectorizer.get_feature_names_out())
    sorted_indices = np.argsort(X.toarray()).flatten()[::-1]
    keywords = feature_names[sorted_indices[:num_keywords]]
    return keywords.tolist()

def analyze_sentiment(text):
    sentiment = analyzer.polarity_scores(text)
    return sentiment

def generate_tsne_plot(texts, output_path='static/tsne_plot.png'):
    # Convert texts to TF-IDF features
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform(texts)

    # Determine the number of PCA components
    n_samples, n_features = X.shape
    pca_n_components = min(n_samples, n_features)
    if pca_n_components > 50:
        pca_n_components = 50

    # Apply PCA for dimensionality reduction
    pca = PCA(n_components=pca_n_components)  # Reduce to a number of components less than or equal to min(n_samples, n_features)
    X_pca = pca.fit_transform(X.toarray())

    # Apply Barnes-Hut T-SNE
    tsne = TSNE(n_components=2, method='barnes_hut', random_state=0)
    X_tsne = tsne.fit_transform(X_pca)

    # Plot the T-SNE results
    plt.figure(figsize=(10, 8))
    plt.scatter(X_tsne[:, 0], X_tsne[:, 1])
    plt.title('T-SNE Visualization of Texts')
    plt.xlabel('Component 1')
    plt.ylabel('Component 2')
    plt.savefig(output_path)
    plt.close()
