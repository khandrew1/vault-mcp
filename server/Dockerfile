FROM python:3.11-slim

WORKDIR /app

# Copy the dvs directory from parent context
COPY ../dvs ./dvs

# Copy server files
COPY . .

# Install requirements
RUN pip install -r requirements.txt

# Expose the port
EXPOSE 8000

# Set default PORT if not provided
ENV PORT=8000

CMD ["python", "app.py"]