FROM python:3.11-slim

WORKDIR /app

# Install uv
RUN pip install uv

# Copy project files for uv
COPY pyproject.toml uv.lock ./

# Install dependencies using uv (much faster than pip)
# uv will handle PyTorch installation efficiently
RUN uv sync --frozen

# Pre-download the model early (this layer will be cached)
# The model files are downloaded at runtime by sentence-transformers, not during pip/uv install
RUN uv run python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/all-mpnet-base-v2')"

# Copy the dvs directory (now accessible from parent context)
COPY dvs ./dvs

# Copy server files
COPY server ./server

# Expose the port
EXPOSE 8000

# Set default PORT if not provided
ENV PORT=8000

CMD ["uv", "run", "server/app.py"]