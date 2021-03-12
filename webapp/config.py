database = 'spotify'
user = 'kevin'
password = 'test'


"With SubQ as (SELECT artist_details.artist_id, genre_details.genre_id,genre_details.genre_name, genre_characteristics.tempo,genre_characteristics.duration,\
    genre_characteristics.danceability\
	FROM artist_details, genre_details, genre_characteristics, artist_genre_link\
	WHERE  LOWER(genre_details.genre_name)= LOWER('trap latino')\
	AND genre_details.genre_id = genre_characteristics.genre_id\
	AND artist_details.artist_id= artist_genre_link.artist_id\
	AND genre_details.genre_id = artist_genre_link.genre_id\
	ORDER BY artist_details.artist_id\
	LIMIT 5)\
    SELECT song_details.song_name,STRING_AGG(artist_details.artist_name, ' and '), song_details.release_year, song_details.popularity,\
            song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability, song_details.song_id, SubQ.tempo, SubQ.duration, SubQ.danceability \
            FROM song_details,song_characteristics,artist_details,song_artist_link,artist_genre_link,SubQ \
            WHERE artist_details.artist_id = SubQ.artist_id AND song_details.song_id=song_characteristics.song_id \
            AND SubQ.artist_id=artist_genre_link.artist_id AND SubQ.genre_id= artist_genre_link.genre_id\
	    GROUP BY song_details.song_name, song_details.release_year, song_details.popularity,\
            song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability, song_details.song_id, SubQ.tempo, SubQ.duration, SubQ.danceability \
            ORDER BY popularity DESC\
            LIMIT 5;"


"With SubQ1 as (SELECT artist_details.artist_id, genre_details.genre_id,genre_details.genre_name, genre_characteristics.tempo,genre_characteristics.duration,\
    genre_characteristics.danceability\
	FROM artist_details, genre_details, genre_characteristics, artist_genre_link\
	WHERE  LOWER(genre_details.genre_name)= LOWER('trap latino')\
	AND genre_details.genre_id = genre_characteristics.genre_id\
	AND artist_details.artist_id= artist_genre_link.artist_id\
	AND genre_details.genre_id = artist_genre_link.genre_id\
	ORDER BY artist_details.artist_id\
	LIMIT 50),\
With SubQ2 as (SELECT song_details.song_id,STRING_AGG(artist_details.artist_name, ' and '), song_details.release_year, song_details.popularity,\
        song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability\
        FROM song_details,song_characteristics,artist_details,song_artist_link,SubQ1\
        WHERE artist_details.artist_id= SubQ1.artist_id\
        AND song_details.song_id = song_characteristics.song_id\
        AND artist_details.artist_id = song_artist_link.artist_id\
        AND song_details.song_id = song_artist_link.song_id\
	GROUP BY song_details.song_id,song_details.release_year, song_details.popularity,\
        song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability\
        ORDER BY song_details.song_id ASC\
        LIMIT 150)\
SELECT SubQ2.song_id,SubQ2.artist_name,SubQ2.release_year,SubQ2.popularity,SubQ2.tempo,SubQ2.duration,SubQ2.danceability,SubQ1.genre_name,SubQ1.tempo,SubQ1.duration,SubQ1.danceability\
From SubQ1,SubQ2\
WHERE SubQ1.artist_id=artist_genre_link.artist_id AND SubQ1.genre_id=artist_genre_link.genre_id\
ORDER BY SubQ2.song_id\
LIMIT 50;"
