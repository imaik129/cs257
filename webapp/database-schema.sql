CREATE TABLE artist_details (
  artist_id SERIAL,
  artist_name text
);

CREATE TABLE artist_characteristics (
  artist_id SERIAL,
  tempo int,
  duration int,
  danceability int
);

CREATE TABLE song_details (
  song_id SERIAL,
  song_name text,
  -- artist_id int,
  release_year int,
  popularity int
);

CREATE TABLE song_characteristics (
  song_id SERIAL,
  tempo int,
  duration int,
  danceability int
);


CREATE TABLE genre_details (
  genre_id SERIAL,
  genre_name text,
  -- artist_id int
);

CREATE TABLE genre_characteristics (
  genre_id SERIAL,
  tempo int,
  duration int,
  danceability int
);

CREATE TABLE song_artist_link (
  artist_id int,
  song_id int,
);

CREATE TABLE artist_genre_link (
  artist_id int,
  genre_id int,
);
