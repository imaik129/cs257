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
        SELECT song_details.song_name,artist_details.artist_name, song_details.release_year, song_details.popularity,\
        song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability, song_details.song_id \
        FROM song_details,song_characteristics,artist_details,song_artist_link \
        WHERE LOWER(song_details.song_name) LIKE LOWER(%s) AND song_details.song_id=song_characteristics.song_id \
        AND artist_details.artist_id=song_artist_link.artist_id AND song_details.song_id= song_artist_link.song_id \
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
        SELECT song_details.song_id, artist_characteristics.tempo, artist_characteristics.duration,\
        artist_characteristics.danceability \
        FROM song_details,artist_details,song_characteristics,artist_characteristics,song_artist_link\
        WHERE LOWER(artist_details.artist_name) LIKE LOWER(%s)\
        AND song_details.song_id = song_characteristics.song_id\
        AND artist_details.artist_id=artist_characteristics.artist_id \
        AND artist_details.artist_id = song_artist_link.artist_id\
        AND song_details.song_id = song_artist_link.song_id\
        ORDER BY song_details.song_id ASC\
        LIMIT 50;"

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
        SELECT song_details.song_name, genre_details.genre_name, artist_details.artist_name,\
        song_details.release_year, song_details.popularity, song_characteristics.tempo, \
        song_characteristics.duration, song_characteristics.danceability,\
        genre_characteristics.tempo, genre_characteristics.duration,\
        genre_characteristics.danceability, song_details.song_id \
        FROM song_details, song_characteristics, artist_details,\
        genre_details, genre_characteristics, artist_genre_link, song_artist_link\
        WHERE LOWER(genre_details.genre_name) LIKE LOWER(%s)\
        AND song_details.song_id = song_characteristics.song_id\
        AND genre_details.genre_id= genre_characteristics.genre_id\
        AND  song_details.song_id = song_artist_link.song_id\
        AND artist_details.artist_id= song_artist_link.artist_id\
        AND genre_details.genre_id = artist_genre_link.genre_id\
        AND artist_details.artist_id = artist_genre_link.artist_id\
        ORDER BY genre_details.genre_name ASC\
        LIMIT 150;"

    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query, (genre_name,))
        return cursor
    except Exception as e:
        print(e)
        exit()

def get_song_in_playlist():
    '''
    Get a cursor that contains all the song sort by year
    Returns:
        cursor: the cursor object to iterate over
    '''
    query = "\
        SELECT song_details.song_name,artist_details.artist_name, song_details.release_year, song_details.popularity,\
        song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability, song_details.song_id \
        FROM song_details,song_characteristics,artist_details,song_artist_link, temp_playlists\
        WHERE temp_playlists.song_id = song_details.song_id AND song_details.song_id=song_characteristics.song_id \
        AND artist_details.artist_id=song_artist_link.artist_id AND song_details.song_id= song_artist_link.song_id \
        ORDER BY song_details.popularity DESC , song_details.song_id DESC\
        LIMIT 150;"


    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query)
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
    prev_song_id=None
    prev_song_artists=None
    for row in cursor:
        song_dict = {}

        if prev_song_id== row[7]:
            song_details_list.pop()
            song_dict['song_name'] = row[0]
            song_dict['artist_name']= prev_song_artists + ' and ' + row[1]
            song_dict['release_year'] = row[2]
            song_dict['popularity'] = row[3]
            song_dict['tempo'] = row[4]
            song_dict['duration'] = row[5]
            song_dict['danceability'] = row[6]
            song_dict['song_id'] = row[7]
            song_details_list.append(song_dict)
            prev_song_artists= prev_song_artists + row[1]

        else:
            song_dict['song_name'] = row[0]
            song_dict['artist_name']= row[1]
            song_dict['release_year'] = row[2]
            song_dict['popularity'] = row[3]
            song_dict['tempo'] = row[4]
            song_dict['duration'] = row[5]
            song_dict['danceability'] = row[6]
            song_dict['song_id'] = row[7]
            song_details_list.append(song_dict)
            prev_song_id=row[7]
            prev_song_artists=row[1]

    cursor.close()
    return json.dumps(song_details_list)

@api.route('/search_artist')
def artist_results():
    """gets a json list of dictionaries of song names and other attributes of songs
    and its artists. If there are more than one authors assigned to the same song with
    the same song_id, the artists will be concatonated.
    """
    cursor_for_ids=get_song_id_by_artist()
    artist_details_list=[]

    for row in cursor_for_ids:
        song_id= row[0]
        artist_tempo=row[1]
        artist_duration=row[2]
        artist_danceability=row[3]


        query= "\
            SELECT song_details.song_name,artist_details.artist_name, song_details.release_year, song_details.popularity,\
            song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability, song_details.song_id \
            FROM song_details,song_characteristics,artist_details,song_artist_link \
            WHERE song_details.song_id = %s AND song_details.song_id=song_characteristics.song_id \
            AND artist_details.artist_id=song_artist_link.artist_id AND song_details.song_id= song_artist_link.song_id \
            ORDER BY popularity DESC\
            LIMIT 6;"


        connection = connection_to_database()
        try:
            cursor_for_artists = connection.cursor()
            cursor_for_artists.execute(query, (song_id,))
            artist_dict={}

            if cursor_for_artists.rowcount>1:
                artist_name=""
                for row2 in cursor_for_artists:
                    if artist_name=="":
                        artist_name= row2[1]
                    else:
                        artist_name= artist_name + ' and ' + row2[1]


                artist_dict['song_name'] = row2[0]
                artist_dict['artist_name'] = artist_name
                artist_dict['release_year'] = row2[2]
                artist_dict['popularity'] = row2[3]
                artist_dict['tempo'] = row2[4]
                artist_dict['duration'] = row2[5]
                artist_dict['danceability'] = row2[6]
                artist_dict['artist_tempo'] = artist_tempo
                artist_dict['artist_duration'] = artist_duration
                artist_dict['artist_danceability'] = artist_danceability
                artist_dict['song_id']=row2[7]
                artist_details_list.append(artist_dict)


            else:
                for row2 in cursor_for_artists:
                    artist_dict['song_name'] = row2[0]
                    artist_dict['artist_name'] = row2[1]
                    artist_dict['release_year'] = row2[2]
                    artist_dict['popularity'] = row2[3]
                    artist_dict['tempo'] = row2[4]
                    artist_dict['duration'] = row2[5]
                    artist_dict['danceability'] = row2[6]
                    artist_dict['artist_tempo'] = artist_tempo
                    artist_dict['artist_duration'] = artist_duration
                    artist_dict['artist_danceability'] = artist_danceability
                    artist_dict['song_id']=row2[7]
                    artist_details_list.append(artist_dict)



            cursor_for_artists.close()

        except Exception as e:
            print(e)
            exit()

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


@api.route('/search_playlist')
def playlist_results():
    cursor=get_song_in_playlist()
    song_details_list_playlist = []
    prev_song_id=None
    prev_song_artists=None
    for row in cursor:
        song_dict = {}

        if prev_song_id== row[7]:
            song_details_list_playlist.pop()
            song_dict['song_name'] = row[0]
            song_dict['artist_name']= prev_song_artists + ' and ' + row[1]
            song_dict['release_year'] = row[2]
            song_dict['popularity'] = row[3]
            song_dict['tempo'] = row[4]
            song_dict['duration'] = row[5]
            song_dict['danceability'] = row[6]
            song_dict['song_id'] = row[7]
            song_details_list_playlist.append(song_dict)
            prev_song_artists= prev_song_artists + row[1]

        else:
            song_dict['song_name'] = row[0]
            song_dict['artist_name']= row[1]
            song_dict['release_year'] = row[2]
            song_dict['popularity'] = row[3]
            song_dict['tempo'] = row[4]
            song_dict['duration'] = row[5]
            song_dict['danceability'] = row[6]
            song_dict['song_id'] = row[7]
            song_details_list_playlist.append(song_dict)
            prev_song_id=row[7]
            prev_song_artists=row[1]

    cursor.close()
    return json.dumps(song_details_list_playlist)




@api.route('/insert_into_playlist')
def insert():
    """sends query to insert into playlist table dynamically"""
    data= flask.request.get_json()
    id= data.get("song_id")
    query = "INSERT INTO temp_playlists (song_id) VALUES (%s);"
    connection = connection_to_database()
    try:
        cursor = connection.cursor()
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
    query = "DELETE FROM temp_playlists WHERE song_id = %s;"
    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query, (id,))
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
