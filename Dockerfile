FROM python:3.10-slim

WORKDIR /app

# Copy all project files into the container
COPY . /app

# Install dependencies
RUN pip install -r requirements.txt

# Expose ports: 8080 for web, 9999 for the Pi Pico socket
EXPOSE 8080
EXPOSE 9999

# Run your app exactly how you do locally
CMD ["python", "app.py"]