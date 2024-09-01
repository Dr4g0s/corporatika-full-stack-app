import os

class Config:
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    SECRET_KEY = os.environ.get('SECRET_KEY', 'supersecretkey')
