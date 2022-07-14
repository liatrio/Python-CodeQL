FROM python:alpine as build

ENV PYTHONUNBUFFERED 1

COPY requirements.txt ./
RUN set -ex \
    && apk add --no-cache --virtual .build-deps postgresql-dev build-base \
    && python3 -m venv /env \
    && /env/bin/pip3 install --upgrade pip \
    && /env/bin/pip3 install --no-cache-dir -r requirements.txt \
    && runDeps="$(scanelf --needed --nobanner --recursive /env \
        | awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' \
        | sort -u \
        | xargs -r apk info --installed \
        | sort -u)" \
    && apk add --virtual run

FROM python:alpine as main

RUN apk add --update --no-cache libpq

COPY --from=build /env/ /env/

WORKDIR /app

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV VIRTUAL_ENV /env
ENV PATH /env/bin:$PATH
EXPOSE 8080

COPY . /app/
ENTRYPOINT ["./start_server.sh"]
