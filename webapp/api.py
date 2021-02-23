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

def get_search_details():
    '''
    Get a cursor that contains all the song sort by year
    Returns:
        cursor: the cursor object to iterate over
    '''
    song_name = flask.request.args.get('search')
    query = "\
        SELECT song_details.song_name, song_details.release_year, song_details.popularity, song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability \
        FROM song_details,song_characteristics \
        WHERE LOWER(song_details.song_name) LIKE LOWER('%" + song_name + "%') AND song_details.song_id=song_characteristics.song_id \
        ORDER BY popularity DESC\
        LIMIT 10;"

    connection = connection_to_database()
    try:
        cursor = connection.cursor()
        cursor.execute(query)
        return cursor
    except Exception as e:
        print(e)
        exit()

@api.route('/search_songs')
def song_results():
    cursor=get_search_details()
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
