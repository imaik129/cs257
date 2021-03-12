"""authors: Kevin Phung, Kyosuke Imai"""
import sys
import argparse
import flask
import api

app = flask.Flask(__name__, static_folder='static', template_folder='templates')
# app.config["TEMPLATES_AUTO_RELOAD"] = True
app.register_blueprint(api.api, url_prefix='/api')

# This route delivers the user your site's home page.
@app.route('/')
def home():
    return flask.render_template('index.html')

# This route supports relative links among your web pages, assuming those pages
# are stored in the templates/ directory or one of its descendant directories,
# without requiring you to have specific routes for each page.
# @app.route("/<string:path>")
@app.route('/<path:path>', methods=['GET', 'POST'])
def shared_header_catchall(path):
    
    if path== 'api/playlist_menu_page':
        return flask.render_template('allPlaylists.html')

    elif path == 'api/insert_into_playlist':
        return api.insert()

    elif path == 'api/delete_from_playlist':
        return api.delete()

    elif path == 'api/specific_playlist_page':
        return flask.render_template('specific_playlist_page.html')




    else:
        return flask.render_template('index.html')

    # else:
    #     return flask.render_template('index.html')
    # return flask.render_template('playlist_menu.html')
    # print(path)

#     if flask.request.method == 'GET':
#         if path== 'api/playlist_menu':
#             return flask.render_template('index.html')
#
#         elif path== 'specific_playlist':
#             return flask.render_template('specific_playlist.html')
#
#         else:
#             return flask.render_template('index.html')
#
#
#
#
#
#
# #split method for if request if "GET" or "POST". Both methods return to index.html for now.
#     if flask.request.method == 'GET':
#
#         # if path== 'search_playlist':
#         #     return flask.render_template('playlist.html')
#         if path== 'playlist_menu':
#             return flask.render_template('playlist_menu.html')
#             # sdasda
#             # return redirect("http://localhost:5000/api/playlist_menu")
#
#         elif path== 'specific_playlist':
#             return flask.render_template('specific_playlist.html')
#
#         # else:
#         #     return flask.render_template('index.html')
#
#
#
# #If Post, checks for type insert or delete and assigns appropriate api function
# #I wonder if api.insert and api.remove can be removed and itll still work
#     elif flask.request.method == 'POST':
#         data= flask.request.get_json()
#         if data.get('type')=="insert":
#             return api.insert()
#             # return flask.render_template('index.html')
#
#         elif data.get('type')=="delete":
#             return api.delete()
#             # return flask.render_template('playlist.html')




if __name__ == '__main__':
    parser = argparse.ArgumentParser('A tiny Flask application, including API')
    parser.add_argument('host', help='the host on which this application is running')
    parser.add_argument('port', type=int, help='the port on which this application is listening')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True)
