CREATE DATABASE currencies;

CREATE TABLE valiutos
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    currency TEXT NOT NULL UNIQUE,
    rate TEXT NOT NULL
);

CREATE TABLE history
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    from_num TEXT NOT NULL,
    to_cur TEXT NOT NULL
);