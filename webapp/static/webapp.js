window.onload = initialize;


function initialize(){
    var searchButton = document.getElementById('search_button');
    if (searchButton) {
        searchButton.onclick = onSearchButton;
    }
}

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

function onSearchButton(){
  var searchString = document.getElementById('search_string')
  var url = getAPIBaseURL() + '/search_songs?search=' + searchString.value;

  fetch(url, {method: 'get'})
  .then((response) => response.json())
  .then(function(songs){
    var listBody = '';
    for (var k = 0; k < songs.length; k++)  {
        var song = songs[k];
        listBody += '<li>name:' + song['song_name']
                  + ',release_year: ' + song['release_year']
                  + ',popularity:' + song['popularity']
                  + ',tempo: ' + song['tempo']
                  + ',duration: ' + song['duration']
                  + ',danceability: ' + song['danceability'];
                  + '</li>\n';
                }

                var songs_list_element = document.getElementById('songs_list');
                if (songs_list_element) {
                    songs_list_element.innerHTML = listBody;
                }
            })

            .catch(function(error) {
                console.log(error);
            });
          }
