"""authors: Kevin Phung, Kyosuke Imai"""
import sys
import flask
import json
from config import *
import psycopg2
import argparse

api = flask.Blueprint('api', __name__)
app = flask.Flask(__name__)


def connection_to_database():
    '''
    Return a connection object to the postgres database
    '''
    try:
        connection = psycopg2.connect(database = database, user= user, password = password)
        return connection
    except Exception as e:
        print(e)
        exit()

def get_song_by_search():
    '''
    Get a cursor that contains all the song sort by year
    Returns:
        cursor: the cursor object to iterate over
    '''
    song_name = flask.request.args.get('search')
    song_name = '%' +  song_name + '%'
    query = "\
        SELECT song_details.song_name, song_details.release_year, song_details.popularity, song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability \
        FROM song_details,song_characteristics \
        WHERE LOWER(song_details.song_name) LIKE LOWER(%s) AND song_details.song_id=song_characteristics.song_id \
        ORDER BY popularity DESC\
        LIMIT 10;"


    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query, (song_name,))
        return cursor
    except Exception as e:
        print(e)
        exit()

def get_song_by_artist():
    '''
    Get a cursor that contains all the  sorted alphabetically
    Returns:
        cursor: the cursor object to iterate over
    '''
    artist_name = flask.request.args.get('search')
    artist_name = '%' +  artist_name + '%'
    query = "\
        SELECT song_details.song_name, artist_details.artist_name, \
        song_details.release_year, song_details.popularity, song_characteristics.tempo, \
        song_characteristics.duration, song_characteristics.danceability,\
        artist_characteristics.tempo, artist_characteristics.duration,\
        artist_characteristics.danceability \
        FROM artist_details, artist_characteristics, song_details, song_characteristics, song_artist_link\
        WHERE LOWER(artist_details.artist_name) LIKE LOWER(%s)\
        AND song_details.song_id = song_characteristics.song_id\
        AND artist_details.artist_id=artist_characteristics.artist_id \
        AND artist_details.artist_id = song_artist_link.artist_id\
        AND song_details.song_id = song_artist_link.song_id\
        ORDER BY artist_name ASC\
        LIMIT 10;"

    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query, (song_name,))
        return cursor
    except Exception as e:
        print(e)
        exit()

def get_song_by_genre():
    '''
    Get a cursor that contains all the song sort by year
    Returns:
        cursor: the cursor object to iterate over
    '''
    genre_name = flask.request.args.get('search')
    genre_name = '%' +  genre_name + '%'
    query = "\
        SELECT song_details.song_name, genre_details.genre_name, artist_details.artist_name,\
        song_details.release_year, song_details.popularity, song_characteristics.tempo, \
        song_characteristics.duration, song_characteristics.danceability,\
        genre_characteristics.tempo, genre_characteristics.duration,\
        genre_characteristics.danceability \
        FROM song_details, song_characteristics, artist_details,\
        genre_details, genre_characteristics, artist_genre_link\
        WHERE LOWER(genre_details.genre_name) LIKE LOWER(%s)\
        AND song_details.song_id = song_characteristics.song_id\
        AND genre_details.artist_id= genre_characteristics.artist_id \
        AND genre_details.genre_id = artist_genre_link.genre_id\
        AND artist_details.artist_id = artist_genre_link.artist_id\
        ORDER BY genre ASC\
        LIMIT 10;"

    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query, (song_name,))
        return cursor
    except Exception as e:
        print(e)
        exit()

# def add_playlist_to_all_playlists():
#     query = "INSERT INTO all_playlists\
#     VALUES ()\
#     "


@api.route('/search_songs')
def song_results():
    cursor=get_song_by_search()
    song_details_list = []
    for row in cursor:
        song_dict = {}
        song_dict['song_name'] = row[0]
        song_dict['release_year'] = row[1]
        song_dict['popularity'] = row[2]
        song_dict['tempo'] = row[3]
        song_dict['duration'] = row[4]
        song_dict['danceability'] = row[5]
        song_details_list.append(song_dict)

    cursor.close()
    return json.dumps(song_details_list)

@api.route('/search_artist')
def artist_results():
    cursor=get_song_by_artist()
    artist_details_list = []
    for row in cursor:
        artist_dict = {}
        artist_dict['song_name'] = row[0]
        artist_dict['artist_name'] = row[1]
        artist_dict['release_year'] = row[2]
        artist_dict['popularity'] = row[3]
        artist_dict['tempo'] = row[4]
        artist_dict['duration'] = row[5]
        artist_dict['danceability'] = row[6]
        artist_dict['artist_tempo'] = row[7]
        artist_dict['artist_duration'] = row[8]
        artist_dict['artist_danceability'] = row[9]

        artist_details_list.append(artist_dict)

    cursor.close()
    return json.dumps(artist_details_list)

@api.route('/search_genre')
def genre_results():
    cursor=get_song_by_genre()
    genre_details_list = []
    for row in cursor:
        genre_dict = {}
        genre_dict['song_name'] = row[0]
        genre_dict['genre_name'] = row[1]
        genre_dict['artist_name'] = row[2]
        genre_dict['release_year'] = row[3]
        genre_dict['popularity'] = row[4]
        genre_dict['tempo'] = row[5]
        genre_dict['duration'] = row[6]
        genre_dict['danceability'] = row[7]
        genre_dict['genre_tempo'] = row[8]
        genre_dict['genre_duration'] = row[9]
        genre_dict['genre_danceability'] = row[10]

        genre_details_list.append(genre_dict)

    cursor.close()
    return json.dumps(artist_details_list)
