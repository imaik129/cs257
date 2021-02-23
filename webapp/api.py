import sys
import flask
import json
import config
import psycopg2

api = flask.Blueprint('api', __name__)

@app.route('/search_songs')
def get_results():
    pass
    return json.dumps(results_list)


@api.route('/dogs/')
def get_dogs():
    dogs = [{'name':'Ruby', 'birth_year':2003, 'death_year':2016, 'description':'a very good dog'},
            {'name':'Maisie', 'birth_year':2017, 'death_year':None, 'description':'a very good dog'}]
    return json.dumps(dogs)
