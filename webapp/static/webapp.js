//authors: Kevin Phung, Kyosuke Imai

let sorted = false;
var index=1;
var button = "b,";
var results_table=undefined ;
window.onload = initialize;
// window.addEventListener("load",change, false);
////document.getElementById("DDButton").addEventListener("change", changePlaceHolder);
// function change(){
//   document.getElementById('DDButton').addEventListener("change",changePlaceHolder);
// }

// var DDButton = document.getElementById('DDButton');
// DDButton.addEventListener("onChange", changePlaceHolder, false);



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
  results_table = document.getElementById("search_results_table_song");
  const results_header = document.getElementById("header_1");
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
    <td onclick="retrieveData(this)" align='center' ><button id= ${button}>Add to Playlist</button></td></tr>`;
    index=index+1;
  }
  results_table.innerHTML= datahtml;
  results_header.style.visibility = "visible";
}

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
    <td onclick="retrieveData(this)" align='center' ><button id= ${button}>Add to Playlist</button></td></tr>`;
    index=index+1;
  }
  results_table.innerHTML= datahtml;
  results_header.style.visibility = "visible";
}

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
    <td onclick="retrieveData(this)" align='center' ><button id= ${button}>Add to Playlist</button></td></tr>`;
    index=index+1;
  }
  results_table.innerHTML= datahtml;
  results_header.style.visibility = "visible";
}


function retrieveData(row){
	var song_id=row.parentNode.id;
    // var p=results_table.rows[0].cells[2].innerHTML;
    alert("n="+ song_id);
    // alert("p="+p);
  }

var globalresults;

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

function initialize(){
    var searchButton = document.getElementById('search_button');
    var DDButton = document.getElementById('DDButton');
    if(DDButton){
      DDButton.onchange = changePlaceHolder;
    }
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
