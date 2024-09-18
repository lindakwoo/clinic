FROM python:3.10-bullseye
ENV PYTHONUNBUFFERED 1
WORKDIR /app
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . /app/
RUN python manage.py collectstatic --noinput
EXPOSE 8000
CMD ["sh", "-c", "python manage.py migrate && gunicorn clinic.wsgi:application --bind 0.0.0.0:8000"]
