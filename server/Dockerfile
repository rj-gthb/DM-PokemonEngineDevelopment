FROM python:3.11-slim

WORKDIR /app

# Install dependencies and gunicorn
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy app source
COPY . .

# Port (Render/Cloud Run provide $PORT)
ENV PORT 5000

EXPOSE 5000

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:${PORT}", "--workers", "1"]
