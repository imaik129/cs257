import sys
import flask
import json
import config
import psycopg2

api = flask.Blueprint('api', __name__)


def get_song_details():
    '''
    Get a cursor that contains all the song sort by year
    Returns:
        cursor: the cursor object to iterate over
    '''
    song_name = flask.request.args.get('search')
    query = "\
        SELECT song_details.song_name, song_details.release_year, song_details.popularity, song_characteristics.tempo, song_characteristics.duration,song_characteristics.danceability \
        FROM song_details,song_characteristics \
        WHERE song_details.song_name LIKE" + song_name + "\
        ORDER BY popularity;"

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
    cursor=get_song_details()
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
    return json.dumps(results_list)


@api.route('/dogs/')
def get_dogs():
    dogs = [{'name':'Ruby', 'birth_year':2003, 'death_year':2016, 'description':'a very good dog'},
            {'name':'Maisie', 'birth_year':2017, 'death_year':None, 'description':'a very good dog'}]
    return json.dumps(dogs)
