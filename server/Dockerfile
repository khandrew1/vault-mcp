FROM python:3.11-slim

WORKDIR /app

# Copy the dvs directory (now accessible from parent context)
COPY dvs ./dvs

# Copy server files
COPY server ./server

# Install requirements
RUN pip install -r server/requirements.txt

# Expose the port
EXPOSE 8000

# Set default PORT if not provided
ENV PORT=8000

CMD ["python", "server/app.py"]