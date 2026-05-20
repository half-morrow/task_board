FROM ruby:4.0.3

WORKDIR /app/backend

RUN apt-get update -qq \
  && apt-get install --no-install-recommends -y build-essential libpq-dev postgresql-client \
  && rm -rf /var/lib/apt/lists/*

COPY backend/Gemfile backend/Gemfile.lock ./
RUN bundle install

COPY backend ./

EXPOSE 3000
