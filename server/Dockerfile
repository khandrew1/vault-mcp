FROM python:3.11-slim

WORKDIR /app

# Install uv
RUN pip install uv

# Copy project files for uv
COPY pyproject.toml uv.lock ./

# Pre-install PyTorch CPU version (lighter and faster than CUDA version)
# This avoids the large download during uv sync
RUN uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies using uv (much faster than pip)
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