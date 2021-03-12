"""authors: Kevin Phung, Kyosuke Imai"""
import sys
import flask
import simplejson as json
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
    Get a cursor that contains all the song sorted by popularity
    Returns:
        cursor: the cursor object with song attribues to iterate over
    '''
    song_name = flask.request.args.get('search')
    song_name = '%' +  song_name + '%'
    query = "\
        SELECT song_details.song_name, STRING_AGG(artist_details.artist_name, ' and '), song_details.release_year, song_details.popularity,\
        song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability, song_details.song_id \
        FROM song_details,song_characteristics,artist_details,song_artist_link \
        WHERE LOWER(song_details.song_name) LIKE LOWER(%s) AND song_details.song_id=song_characteristics.song_id \
        AND artist_details.artist_id=song_artist_link.artist_id AND song_details.song_id= song_artist_link.song_id \
        GROUP BY song_details.song_name,song_details.release_year, song_details.popularity,\
        song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability, song_details.song_id\
        ORDER BY song_details.popularity DESC , song_details.song_id DESC\
        LIMIT 150;"


    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query, (song_name,))
        return cursor
    except Exception as e:
        print(e)
        exit()


def get_song_id_by_artist():
    '''
    Get a cursor that contains all the song_ids of song in the playlist TABLE, sorted by song_id in ascending order
    Returns:
        cursor: the cursor object to iterate over
    '''
    artist_name = flask.request.args.get('search')
    artist_name = '%' +  artist_name + '%'
    query = "\
        With SubQ as (SELECT song_details.song_id, artist_characteristics.tempo, artist_characteristics.duration,\
        artist_characteristics.danceability \
        FROM song_details,artist_details,song_characteristics,artist_characteristics,song_artist_link\
        WHERE LOWER(artist_details.artist_name) LIKE LOWER(%s)\
        AND song_details.song_id = song_characteristics.song_id\
        AND artist_details.artist_id=artist_characteristics.artist_id \
        AND artist_details.artist_id = song_artist_link.artist_id\
        AND song_details.song_id = song_artist_link.song_id\
        ORDER BY song_details.song_id ASC\
        LIMIT 150)\
        SELECT song_details.song_name,STRING_AGG(artist_details.artist_name, ' and '), song_details.release_year, song_details.popularity,\
            song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability, song_details.song_id, SubQ.tempo, SubQ.duration, SubQ.danceability \
            FROM song_details,song_characteristics,artist_details,song_artist_link,SubQ \
            WHERE song_details.song_id = SubQ.song_id AND song_details.song_id=song_characteristics.song_id \
            AND artist_details.artist_id=song_artist_link.artist_id AND song_details.song_id= song_artist_link.song_id \
	    GROUP BY song_details.song_name, song_details.release_year, song_details.popularity,\
            song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability, song_details.song_id, SubQ.tempo, SubQ.duration, SubQ.danceability \
            ORDER BY popularity DESC\
            LIMIT 150;"

    connection = connection_to_database()
    try:
        cursor_for_ids = connection.cursor()
        cursor_for_ids.execute(query, (artist_name,))
        return cursor_for_ids

    except Exception as e:
        print(e)
        exit()


def get_song_by_genre():
    '''
    Get a cursor that gets songs by its genre.
    Returns:
        cursor: the cursor object to iterate over
    '''
    genre_name = flask.request.args.get('search')
    genre_name = '%' +  genre_name + '%'
    query = "\
        With SubQ1 as (SELECT artist_details.artist_id, genre_details.genre_id,genre_details.genre_name, genre_characteristics.tempo,genre_characteristics.duration,\
    genre_characteristics.danceability\
	FROM artist_details, genre_details, genre_characteristics, artist_genre_link\
	WHERE  LOWER(genre_details.genre_name) LIKE LOWER(%s)\
	AND genre_details.genre_id = genre_characteristics.genre_id\
	AND artist_details.artist_id= artist_genre_link.artist_id\
	AND genre_details.genre_id = artist_genre_link.genre_id\
	ORDER BY artist_details.artist_id)\
SELECT  song_details.song_name,SubQ1.genre_name,STRING_AGG(artist_details.artist_name, ' and ') artist_name, song_details.release_year, song_details.popularity,\
        song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability,SubQ1.tempo,SubQ1.duration,SubQ1.danceability,song_details.song_id\
        FROM song_details,song_characteristics,artist_details,song_artist_link,SubQ1\
        WHERE artist_details.artist_id= SubQ1.artist_id\
        AND song_details.song_id = song_characteristics.song_id\
        AND artist_details.artist_id = song_artist_link.artist_id\
        AND song_details.song_id = song_artist_link.song_id\
	GROUP BY song_details.song_id,song_details.song_name,song_details.release_year, song_details.popularity,\
        song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability,SubQ1.tempo,SubQ1.duration,SubQ1.danceability,SubQ1.genre_name\
        ORDER BY song_details.popularity DESC ,song_details.song_id ASC;"

    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query, (genre_name,))
        return cursor
    except Exception as e:
        print(e)
        exit()

def get_song_in_playlist(playlist_name):
    '''
    Get a cursor that contains all the song sort by year
    Returns:
        cursor: the cursor object to iterate over
    '''
    print(playlist_name)
    playlist_name= '%' + 'dad' +'%'
    query="\
        With SubQ1 as (SELECT song_id FROM all_playlists WHERE playlist_name = %s ORDER BY song_id DESC OFFSET 1)\
        SELECT song_details.song_name,STRING_AGG(artist_details.artist_name, ' and ') artist_name,song_details.release_year, song_details.popularity,\
        song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability, song_details.song_id\
        FROM song_details,artist_details,SubQ1,song_artist_link,song_characteristics\
        WHERE SubQ1.song_id = song_details.song_id AND artist_details.artist_id=song_artist_link.artist_id and song_details.song_id=song_artist_link.song_id AND song_details.song_id=song_characteristics.song_id\
        GROUP BY song_details.song_name,song_details.release_year, song_details.popularity,song_characteristics.tempo,song_characteristics.duration,song_characteristics.danceability, song_details.song_id\
	    ORDER BY song_details.popularity DESC , song_details.song_id DESC;"

    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query,(playlist_name,))
        return cursor
    except Exception as e:
        print(e)
        exit()

@api.route('/help')
def get_help():
    """return api-design.txt which describes all the requests and responses with their
    corresponding api end-points.
    """
    help_file = open('doc/api-design.txt')
    text = help_file.read()
    return flask.render_template('help.html', help_text=text)

@api.route('/search_songs')
def song_results():
    cursor=get_song_by_search()
    song_details_list = []
    for row in cursor:
        song_dict = {}
        song_dict['song_name'] = row[0]
        song_dict['artist_name']= row[1]
        song_dict['release_year'] = row[2]
        song_dict['popularity'] = row[3]
        song_dict['tempo'] = row[4]
        song_dict['duration'] = row[5]
        song_dict['danceability'] = row[6]
        song_dict['song_id'] = row[7]
        song_details_list.append(song_dict)

    cursor.close()
    return json.dumps(song_details_list)

@api.route('/search_artist')
def artist_results():
    """gets a json list of dictionaries of song names and other attributes of songs
    and its artists. If there are more than one authors assigned to the same song with
    the same song_id, the artists will be concatonated.
    """
    cursor=get_song_id_by_artist()
    artist_details_list=[]
    for row in cursor:
        artist_dict={}
        artist_dict['song_name'] = row[0]
        artist_dict['artist_name'] = row[1]
        artist_dict['release_year'] = row[2]
        artist_dict['popularity'] = row[3]
        artist_dict['tempo'] = row[4]
        artist_dict['duration'] = row[5]
        artist_dict['danceability'] = row[6]
        artist_dict['artist_tempo'] = row[8]
        artist_dict['artist_duration'] = row[9]
        artist_dict['artist_danceability'] = row[10]
        artist_dict['song_id']=row[7]

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
        genre_dict['song_id']= row[11]

        genre_details_list.append(genre_dict)

    cursor.close()
    return json.dumps(genre_details_list)


@api.route('/create_playlist')
def create():
    """sends query to create a playlist"""
    data= flask.request.get_json()
    playlist_name= data.get("new_playlist_name")
    query = "INSERT INTO all_playlists (playlist_name) VALUES (%s);"
    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        # cursor.execute(query, (playlist_name,id))
        cursor.execute(query, (playlist_name,))
        connection.commit()
        cursor.close()
    except Exception as e:
        print(e)
        exit()

@api.route('/insert_into_playlist')
def insert():
    """sends query to insert into playlist table dynamically"""
    data= flask.request.get_json()
    id= data.get("song_id")
    playlist_name= data.get("playlist_name")
    query = "INSERT INTO all_playlists (playlist_name,song_id) VALUES (%s,%s);"
    # query = "INSERT INTO temp_playlists (song_id) VALUES (%s);"
    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        # cursor.execute(query, (playlist_name,id))
        cursor.execute(query, (id,))
        connection.commit()
        cursor.close()
    except Exception as e:
        print(e)
        exit()



@api.route('/delete_from_playlist')
def delete():
    """sends query to delete from a playlist"""
    data= flask.request.get_json()
    id= data.get("song_id")
    playlist_name= data.get("playlist_name")
    query = "DELETE FROM all_playlists WHERE playlist_name = %s AND song_id=%s ;"
    # query = "DELETE FROM temp_playlists WHERE playlist_name = %s AND song_id = %s;"
    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query, (playlist_name,id))
        connection.commit()
        cursor.close()
    except Exception as e:
        print(e)
        exit()


@api.route('/get_all_playlist_song_ids')
def retrieve():
    """sends query to retrieve all the song_ids in a playlist
    returns json list"""
    query = "SELECT * FROM temp_playlists;"
    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query)
        songs_list=[]
        for row in cursor:
            songs_list.append(row[0])
        cursor.close()
    except Exception as e:
        print(e)
        exit()

    return json.dumps(songs_list)


@api.route('/playlist_menu')
def playlist_name_retriever():
    """sends query to retrieve all the playlist names and
    returns json list"""
    query = "SELECT playlist_name FROM all_playlists;"
    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query)
        songs_list=[]
        for row in cursor:
            songs_list.append(row[0])
        cursor.close()
    except Exception as e:
        print(e)
        exit()

    return json.dumps(songs_list)

@api.route('/specific_playlist_info')
def specific_playlist_info():
    """sends query to retrieve details for specific playlist
    returns json list"""
    playlist_name = flask.request.args.get('playlist')
    cursor=get_song_in_playlist(playlist_name)
    song_details_list_playlist = []
    for row in cursor:
        song_dict = {}
        song_dict['song_name'] = row[0]
        song_dict['artist_name']= row[1]
        song_dict['release_year'] = row[2]
        song_dict['popularity'] = row[3]
        song_dict['tempo'] = row[4]
        song_dict['duration'] = row[5]
        song_dict['danceability'] = row[6]
        song_dict['song_id'] = row[7]
        song_details_list_playlist.append(song_dict)

    cursor.close()
    return json.dumps(song_details_list_playlist)
