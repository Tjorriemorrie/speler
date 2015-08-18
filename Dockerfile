FROM python:latest
RUN apt-get update && apt-get install -y -q mercurial
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt