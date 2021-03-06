//authors: Kevin Phung, Kyosuke Imai

let sorted = false;
var index=1;
var PlaylistIndex = 0;
var button = "b,";
var results_table=undefined ;
var playlist_url= getAPIBaseURL() + '/get_all_playlist_songs';
window.onload = initialize;



//change the Search bar placeholder based on selected category
function changePlaceHolder(){
  var chosenCategory = document.getElementById('DDButton');
  var searchString = document.getElementById('search_string');

  if (chosenCategory.value == 'song'){
    searchString.placeholder = 'search for song name here (e.g Yesterday)';
  }
  else if (chosenCategory.value == 'artist'){
    searchString.placeholder = 'search for artist name here (e.g The Beatles)';
  }
  else if (chosenCategory.value == 'genre'){
    searchString.placeholder = 'search for genre name here (e.g Rock)';
  }
  else if (chosenCategory.value == 'default'){
    searchString.placeholder = 'Please pick a Category first';
  }
}

//build endpoint based on chosen category and inputted search_string
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

//generate baseAPIURL
function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}






//load results for search by song into a table with specified elements
function load_results_into_table_song(results){
  results_table = document.getElementById("search_results_table_song");
  const results_header = document.getElementById("header_1");
  let datahtml= '';

  for (let item of results){
    var exact_button=button+index
    datahtml+= `<tr id=${item.song_id}><td>${index}</td>
    <td>${item.song_name}</td>
    <td>${item.artist_name}</td>
    <td>${item.release_year}</td>
    <td>${item.popularity}</td>
    <td>${item.tempo}</td>
    <td>${item.duration}</td>
    <td>${item.danceability}</td>
    <td><button onclick="insert_into_playlist(this)" align='center' id= ${exact_button} style= 'display:block' >Add to Playlist</button></td></tr>`;
    index=index+1;
    if(playlist_songs.indexOf(item.song_id) >= 0){
      // button='"' + button + '"'
      console.log(exact_button)
    // document.getElementById(exact_button).style.display= "none"
    }
  }
  results_table.innerHTML= datahtml;
  results_header.style.visibility = "visible";
}

//load results for search by artist with specified elements, including attributes specific to individual artists
function load_results_into_table_artist(results){
  results_table = document.getElementById("search_results_table_artist");
  const results_header = document.getElementById("header_2");
  let datahtml= '';

  for (let item of results){
    button = button + index;
    datahtml+= `<tr id=${item.song_id}><td>${index}</td>
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
    index=index+1;
    if(playlist_songs.indexOf(item.song_id) >= 0){
      // button='"' + button + '"'
      console.log(exact_button)
    // document.getElementById(exact_button).style.display= "none"
    }
  }
  results_table.innerHTML= datahtml;
  results_header.style.visibility = "visible";
}
//load results for search by genre with specified elements, including attributes specific to individual genres
function load_results_into_table_genre(results){
  results_table = document.getElementById("search_results_table_genre");
  const results_header = document.getElementById("header_3");
  let datahtml= '';

  for (let item of results){
    button = button + index;
    datahtml+= `<tr id=${item.song_id}><td>${index}</td>
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
    index=index+1;
    if(playlist_songs.indexOf(item.song_id) >= 0){
      // button='"' + button + '"'
      console.log(exact_button)
    // document.getElementById(exact_button).style.display= "none"
    }
  }
  results_table.innerHTML= datahtml;
  results_header.style.visibility = "visible";
}
//
// function load_results_into_table_song_2(results){
//   results_table = document.getElementById("search_results_table_song");
//   const results_header = document.getElementById("header_1");
//   let datahtml= '';
//
//   for (let item of results){
//     var exact_button=button+index
//     datahtml+= `<tr id=${item.song_id}><td>${index}</td>
//     <td>${item.song_name}</td>
//     <td>${item.artist_name}</td>
//     <td>${item.release_year}</td>
//     <td>${item.popularity}</td>
//     <td>${item.tempo}</td>
//     <td>${item.duration}</td>
//     <td>${item.danceability}</td>
//     <td><select id = "dropdown" onchange="add_song_to_playlist(this)" align = 'center' style= 'display:block'> Add to Playlist
//       <option value = "default"> Choose a Playlist </option>
//       <option value = "default"> PlaylistA </option>
//       <option value = "default"> PlaylistB </option>
//      </select>
//      </td></tr>`;
//     index=index+1;
//     if(playlist_songs.indexOf(item.song_id) >= 0){
//       // button='"' + button + '"'
//       console.log(exact_button)
//     // document.getElementById(exact_button).style.display= "none"
//     }
//   }
//   results_table.innerHTML= datahtml;
//   results_header.style.visibility = "visible";
// }
//
//
// function addPlaylistToDropDown(row){
//   var playlist_array = {
//     ValueA : 'Playlist1',
//     ValueB : 'Playlist2',
//     ValueC : 'Playlist3'
//   };
//   var select = row.parentNode.id;
//   for(playlist in playlist_array){
//       var option = select.createElement("option");
//       option.value = playlist;
//       option.text = playlist_array[playlist];
//       select.appendChild(option);
//
//   }
// }
//
// function add_song_to_playlist(row){
//   addPlaylistToDropDown(row);
//   PlaylistIndex = PlaylistIndex + 1;
//   var playlist_name = row.parentNod.id.value;
//   var song_id = row.parentNode.parentNode.id;
//   var playlist_id = PlaylistIndex;
//   var type = "insert";
//
//   inset_to_playlist_url = getAPIBaseURL() + '/insert_playlist_into_playlists'
//   const data = {playlist_id, playlist_name, song_id, type};
//   const options = {method: 'post', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
//   fetch(insert_to_playlist_url,options);
//
//   console.log("success")
// }

// function returnAllElementsInPlaylist(){
//
// }


//insert song into playlist
function insert_into_playlist(row)
{
	var song_id=row.parentNode.parentNode.id;
  var type = "insert"
  insert_url= getAPIBaseURL() + '/insert_into_playlist'
  const data= {song_id, type};
  const options = {method: 'post', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
  fetch(insert_url,options);

  playlist_songs.push(song_id);

  // document.getElementById("b,"+row).style.display= "none";
console.log("success")
}

var globalresults;
var playlist_songs;

//choose which table (song, artist, genre) to load based on chosen Category
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

//fetch results using api endpoint and load results into specified table
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


async function initialize(){
    {await fetch(playlist_url, {method: 'get'})
    .then((response) => response.json())
    .then(function(playlists){
    playlist_songs=playlists;
    // console.log(globalresults);
    })
  }
    var DDButton = document.getElementById('DDButton');
    var searchButton = document.getElementById('search_string');
    if(DDButton){
      DDButton.onchange = changePlaceHolder;
    }
    //addPlaylistToDropDown();
    if (searchButton){
      searchButton.onclick = returnResults;
    }

  }



  // function initialize(){
  //       var searchButton = document.getElementById('search_string');
  //       if (searchButton) {
  //           searchButton.onclick = onSearchButton;
  //       }
  //   }
  // function onSearchButtonSong(){
  //   var searchString = document.getElementById('search_string')
  //   var url = getAPIBaseURL() + getURLbyCategory();
  //   fetch(url, {method: 'get'})
  //   .then((response) => response.json())
  //   .then(function(songs){
  //     var listBody = '';
  //     for (var k = 0; k < songs.length; k++)  {
  //         var song = songs[k];
  //         listBody += '<li>name:' + song['song_name']
  //                   + ',release_year: ' + song['release_year']
  //                   + ',popularity:' + song['popularity']
  //                   + ',tempo: ' + song['tempo']
  //                   + ',duration: ' + song['duration']
  //                   + ',danceability: ' + song['danceability'];
  //                   + '</li>\n';
  //                 }
  //
  //                 var songs_list_element = document.getElementById('songs_list');
  //                 if (songs_list_element) {
  //                     songs_list_element.innerHTML = listBody;
  //                 }
  //             })
  //
  //             .catch(function(error) {
  //                 console.log(error);
  //             });
  //   }
