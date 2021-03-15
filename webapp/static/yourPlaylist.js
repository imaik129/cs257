
var specific_playlist_url= getAPIBaseURL()+ "/specific_playlist_info"+ window.location.search;
var globalPlaylistinfo= undefined;
var delbutton= "d,";

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

async function returnPlaylistdata(){
  {await fetch(specific_playlist_url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    // globalPlaylistinfo=results;
    // console.log(results)
    load_results_into_table_playlists(results)
  })
  }
}


function load_results_into_table_playlists(globalPlaylistinfo){
  let datahtml= '';
  playlist_table= document.getElementById("playlist_table");
  playlist_body= document.getElementById("playlist_body");
  var delbuttons_to_remove=[];

  for (let item of globalPlaylistinfo){
    var exact_button=delbutton+item.song_id
    datahtml+= `<tr id=${item.song_id}>
    <td>${item.song_name}</td>
    <td>${item.artist_name}</td>
    <td>${item.release_year}</td>
    <td>${item.popularity}</td>
    <td>${item.tempo}</td>
    <td>${item.duration}</td>
    <td>${item.danceability}</td>
    <td><button onclick="delete_from_playlist(this)" align='center' id= ${exact_button} style= 'display:inline' >Delete from Playlist</button></td></tr>`;

    // if(playlist_songs.indexOf(item.song_id) < 0){
    //   delbuttons_to_remove.push(exact_button);
    // }

  }
  playlist_body.innerHTML= datahtml;
  playlist_table.style.display = "inline";


//   delbuttons_to_remove.forEach(function (item) {
//   document.getElementById(item).style.display='none';
// });

}

function delete_from_playlist(row)
{
	var song_id=row.parentNode.parentNode.id;
  var playlist_name= specific_playlist_url.substr(-1);
  delete_url= getAPIBaseURL() + '/delete_from_playlist'
  const data= {song_id,playlist_name};
  const options = {method: 'post', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
  fetch(delete_url,options);

  button=document.getElementById("d,"+ song_id);
  button.style.display= 'none';
}


async function initialize(){
  // await returnPlaylistdata();
  // load_results_into_table_playlists(globalPlaylistinfo)
  returnPlaylistdata()
}


window.onload = initialize();
