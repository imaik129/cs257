function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}


function returnPlaylistdata(){
  var specific_playlist_url= getAPIBaseURL()+ "/specific_playlist_info"+ window.location.search;
  {fetch(specific_playlist_url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    load_results_into_table_playlists(results)
  })
  }
}

function load_results_into_table_playlists(results){
  var del_button_prefix= "d,";
  let datahtml= '';
  playlist_table= document.getElementById("playlist_table");
  playlist_body= document.getElementById("playlist_body");

  for (let item of results){
    var exact_button=del_button_prefix+item.song_id
    datahtml+= `<tr id=${item.song_id}>
    <td>${item.song_name}</td>
    <td>${item.artist_name}</td>
    <td>${item.release_year}</td>
    <td>${item.popularity}</td>
    <td>${item.tempo}</td>
    <td>${item.duration}</td>
    <td>${item.danceability}</td>
    <td><button onclick="delete_from_playlist(this)" align='center' id= ${exact_button} style= 'display:inline' >Delete from Playlist</button></td></tr>`;


  }
  playlist_body.innerHTML= datahtml;
  playlist_table.style.display = "inline";



}

function delete_from_playlist(row)
{
	var song_id=row.parentNode.parentNode.id;
  param = new URLSearchParams(window.location.search);
  playlist_name = param.get('playlist');
  delete_url= getAPIBaseURL() + '/delete_from_playlist'
  const data= {song_id,playlist_name};
  const options = {method: 'post', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
  fetch(delete_url,options);

  button=document.getElementById("d,"+ song_id);
  button.style.display= 'none';
}


function initialize(){
  returnPlaylistdata()
}

window.onload = initialize();
