FROM python:3.11-slim

WORKDIR /app

# Install requirements first (better Docker layer caching)
COPY server/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

# Pre-download the model early (this layer will be cached)
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/all-mpnet-base-v2')"

# Copy the dvs directory (now accessible from parent context)
COPY dvs ./dvs

# Copy server files
COPY server ./server

# Expose the port
EXPOSE 8000

# Set default PORT if not provided
ENV PORT=8000

CMD ["python", "server/app.py"]