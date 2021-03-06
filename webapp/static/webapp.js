//authors: Kevin Phung, Kyosuke Imai

let sorted = false;
var button = "b,";
var results_table=undefined ;
var playlist_url= getAPIBaseURL() + '/get_all_playlist_songs';
var results_body_song = undefined;
var results_body_artist = undefined;
var results_body_genre = undefined;
var results_table_song= undefined;
var results_table_artist= undefined;
var results_table_genre= undefined;
window.onload = initialize;




function changePlaceHolder(){
  var chosenCategory = document.getElementById('DDButton');
  if (chosenCategory.value == 'song'){
    document.getElementById('search_string').placeholder = 'search for song name here (e.g Yesterday)';
  }
  else if (chosenCategory.value == 'artist'){
    document.getElementById('search_string').placeholder = 'search for artist name here (e.g The Beatles)';
  }
  else if (chosenCategory.value == 'genre'){
    document.getElementById('search_string').placeholder = 'search for genre name here (e.g Rock)';
  }
  else if (chosenCategory.value == 'default'){
    document.getElementById('search_string').placeholder = 'Please pick a Category first';
  }

}

function getURLbyCategory(){

  var chosenCategory = document.getElementById('DDButton');
  var searchString = document.getElementById('search_string')

  if (chosenCategory.value == 'song'){
    var url ='/search_songs?search=' + searchString.value;
    return url;
  }
  else if (chosenCategory.value == 'artist'){
    var url ='/search_artist?search=' + searchString.value;
    return url;
  }

  else if (chosenCategory.value == 'genre'){
    var url ='/search_genre?search=' + searchString.value;
    return url;
  }


}

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}


function load_results_into_table_song(results){
  // results_table = document.getElementById("search_results_table_song");
  // const results_header = document.getElementById("header_song");
  let datahtml= '';
  results_body_song= document.getElementById("search_results_body_song");
  results_table_song= document.getElementById("search_results_table_song");
  var buttons_to_remove=[];

  for (let item of results){
    var exact_button=button+item.song_id
    datahtml+= `<tr id=${item.song_id}>
    <td>${item.song_name}</td>
    <td>${item.artist_name}</td>
    <td>${item.release_year}</td>
    <td>${item.popularity}</td>
    <td>${item.tempo}</td>
    <td>${item.duration}</td>
    <td>${item.danceability}</td>
    <td><button onclick="insert_into_playlist(this)" align='center' id= ${exact_button} style= 'display:inline' >Add to Playlist</button></td></tr>`;

    if(playlist_songs.indexOf(item.song_id) >= 0){
      buttons_to_remove.push(exact_button);
    }

  }
  results_body_song.innerHTML= datahtml;
  results_table_song.style.display = "inline";

  if (results_table_genre != undefined){
    results_table_genre.style.display = "none";
  }
  if (results_table_artist != undefined){
    results_table_artist.style.display = "none";
  }

  buttons_to_remove.forEach(function (item) {
  console.log(item);
  document.getElementById(item).style.display='none';
});

}


function load_results_into_table_artist(results){
  // results_table = document.getElementById("search_results_table_artist");
  // const results_header = document.getElementById("header_artist");
  let datahtml= '';
  results_table_artist= document.getElementById("search_results_table_artist");
  results_body_artist= document.getElementById("search_results_body_artist");
  var buttons_to_remove=[];


  for (let item of results){
    var exact_button=button+item.song_id
    datahtml+= `<tr id=${item.song_id}>
    <td>${item.song_name}</td>
    <td>${item.artist_name}</td>
    <td>${item.release_year}</td>
    <td>${item.popularity}</td>
    <td>${item.tempo}</td>
    <td>${item.duration}</td>
    <td>${item.danceability}</td>
    <td>${item.artist_tempo}</td>
    <td>${item.artist_duration}</td>
    <td>${item.artist_danceability}</td>
    <td><button onclick="insert_into_playlist(this)" align='center' id= ${exact_button} style= 'display:block' >Add to Playlist</button></td></tr>`;
    if(playlist_songs.indexOf(item.song_id) >= 0){
      buttons_to_remove.push(exact_button);
    }
  }
  results_body_artist.innerHTML= datahtml;
  results_table_artist.style.display = "inline";

  if (results_table_genre != undefined){
    results_table_genre.style.display = "none";
  }
  if (results_table_song != undefined){
    results_table_song.style.display = "none";
  }
  buttons_to_remove.forEach(function (item) {
  console.log(item);
  document.getElementById(item).style.display='none';
});
}

function load_results_into_table_genre(results){
  // results_table = document.getElementById("search_results_table_genre");
  // const results_header = document.getElementById("header_genre");
  let datahtml= '';
  results_body_genre= document.getElementById("search_results_body_genre");
  results_table_genre= document.getElementById("search_results_table_genre");
  var buttons_to_remove=[];

  for (let item of results){
    var exact_button=button+item.song_id
    datahtml+= `<tr id=${item.song_id}>
    <td>${item.song_name}</td>
    <td>${item.genre_name}</td>
    <td>${item.artist_name}</td>
    <td>${item.release_year}</td>
    <td>${item.popularity}</td>
    <td>${item.tempo}</td>
    <td>${item.duration}</td>
    <td>${item.danceability}</td>
    <td>${item.genre_tempo}</td>
    <td>${item.genre_duration}</td>
    <td>${item.genre_danceability}</td>
    <td><button onclick="insert_into_playlist(this)" align='center' id= ${exact_button} style= 'display:block' >Add to Playlist</button></td></tr>`;
    if(playlist_songs.indexOf(item.song_id) >= 0){
      buttons_to_remove.push(exact_button);
    }

  }
  results_body_genre.innerHTML= datahtml;
  results_table_genre.style.display = "inline";

  if (results_table_artist != undefined){
    results_table_artist.style.display = "none";
  }
  if (results_table_song != undefined){
    console.log(results_table_song)
    results_table_song.style.display = "none";
  }
  buttons_to_remove.forEach(function (item) {
  console.log(item);
  document.getElementById(item).style.display='none';
});
}


function insert_into_playlist(row)
{
	var song_id=row.parentNode.parentNode.id;
  var type = "insert"
  insert_url= getAPIBaseURL() + '/insert_into_playlist'
  const data= {song_id, type};
  const options = {method: 'post', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
  fetch(insert_url,options);

  playlist_songs.push(song_id);
  test=document.getElementById("b,"+ song_id);
  // console.log(test);
  test.style.display= 'none';
//   console.log(test);
// console.log("success")
}

var globalresults;
var playlist_songs;

function chooseResults(results){
    var chosenCategory = document.getElementById('DDButton');
    if(chosenCategory.value == 'song'){
      load_results_into_table_song(results);
    }
    else if(chosenCategory.value == 'artist'){
      load_results_into_table_artist(results);
    }
    else if (chosenCategory.value == 'genre'){
      load_results_into_table_genre(results);
    }
}

async function returnResults(){
  var url = getAPIBaseURL() + getURLbyCategory();
  {await fetch(url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    chooseResults(results);
    globalresults=results;
    console.log(globalresults);
  })
  }
}


async function get_playlist_record(){
  {await fetch(playlist_url, {method: 'get'})
.then((response) => response.json())
.then(function(playlists){
  playlist_songs=playlists;

})
}
}


function initialize(){
    get_playlist_record()

    var searchButton = document.getElementById('search_button');
    var DDButton = document.getElementById('DDButton');
    if(DDButton){
      DDButton.onchange = changePlaceHolder;
    }
    if (searchButton){
      searchButton.onclick = returnResults;
    }

  }
