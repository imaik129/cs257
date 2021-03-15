//authors: Kevin Phung, Kyosuke Imai

//List of globally declared variables
let sorted = false;
var addbutton = "a,";
var delbutton = "d,";
var results_table=undefined ;
var playlist_url= getAPIBaseURL() + '/get_all_playlist_song_ids';
var get_playlist_results_url= getAPIBaseURL() + '/search_playlist';
var results_body_song = undefined;
var results_body_artist = undefined;
var results_body_genre = undefined;
var playlist_body= undefined;
var results_table_song= undefined;
var results_table_artist= undefined;
var results_table_genre= undefined;
var playlist_table= undefined;
var globalresults;
var globalPlaylistResults=undefined;
var playlist_songs;

all_playlist_names_url= getAPIBaseURL() + '/playlist_menu';
var globalPlaylistNames= undefined;


window.onload = initialize;


// Swaps placeholder text in the search bar based on the category chosen
function changePlaceHolder(){
  var chosenCategory = document.getElementById('DDButton');
  if (chosenCategory.value == 'song'){
    document.getElementById('search_string').placeholder = 'Search for song name here (e.g Yesterday)';
  }
  else if (chosenCategory.value == 'artist'){
    document.getElementById('search_string').placeholder = 'Search by artist name here (e.g The Beatles)';
  }
  else if (chosenCategory.value == 'genre'){
    document.getElementById('search_string').placeholder = 'Search by genre name here (e.g Rock)';
  }
  else if (chosenCategory.value == 'default'){
    document.getElementById('search_string').placeholder = 'Please pick a Category first';
  }

}

// Swaps between search/home page and Playlist page Panels
async function choosePanel(){

  var chosenPath = document.getElementById('SelectPlaylist');
  var divider_for_home=document.getElementById("divider_for_home");
  var divider_for_playlists=document.getElementById("divider_for_playlists");
  if (chosenPath.value== 'YourPlaylist'){
    divider_for_home.style.display= 'none';
    await returnPlaylistResults().then(
    load_results_into_table_playlists(globalPlaylistResults));
    // console.log(globalPlaylistResults)
    document.getElementById("top_header").innerHTML="Spotify Music <br/>  Advanced Search  <br/> Playlist Page";
    document.getElementById("DropDownMenu").style.display= 'none';
    document.getElementById("search_string").style.display= 'none';
    document.getElementById("search_button").style.display= 'none';
    if (globalPlaylistResults.length>0){
    divider_for_playlists.style.display= 'inline';

    document.getElementById("page_quote").innerHTML="<em> Your Playlist</em>";

  } else{
    document.getElementById("page_quote").innerHTML="<em> Empty Playlist</em>";
  }

  }
  else{
    divider_for_playlists.style.display= 'none';
    divider_for_home.style.display= 'inline';
    document.getElementById("top_header").innerHTML="Spotify Music <br/>  Advanced Search  <br/> Home Page";
    document.getElementById("page_quote").innerHTML="<em> Music is life itself. <br/> -Louis Armstrong</em>";
    document.getElementById("DropDownMenu").style.display= 'inline';
    document.getElementById("search_string").style.display= 'inline';
    document.getElementById("search_button").style.display= 'inline';

  }
}

// Completes URL string depending on search category chosen
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
  // else if (choseCategory.value == 'default'){
  //   var url ='/search_songs?search=' + searchString.value;
  //   return url;
  // }
}

//Just gets the base url for the API call
function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

async function returnPlaylistnames(){
  {await fetch(all_playlist_names_url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    globalPlaylistNames=results;
    // console.log(results)
  })
  }
}


function addPlaylistToDDM(playlist_names, row){
  var i = 0;
  var listofOptions = [];
  for (let item of playlist_names){
    var song_id=row.parentNode.parentNode.id;
    var distinctID = "a," + song_id;
    var AddPlaylistDDM = document.getElementById(distinctID);
    // var OptionValues = AddPlaylistDDM.options();
    var values = Array.from(AddPlaylistDDM.options);
    console.log("Values = " + values.length);
    for (i = 0; i < values.length; i++){
      var options = AddPlaylistDDM.options[i].text;
      console.log("option = " + options);
      listofOptions.push(options);
    }
    if(!listofOptions.includes(item.playlist_name)){
      console.log("in if case");
      var newOption = document.createElement("option");
      newOption.text = newOption.value = item.playlist_name;
      AddPlaylistDDM.appendChild(newOption);
    }

  }

}

async function combinedAddPlaylistsToDDM(row){
  await returnPlaylistnames()
  addPlaylistToDDM(globalPlaylistNames, row)
}




function insertIntoSelectedPlaylist(row){
  var song_id=row.parentNode.parentNode.id;
  insert_url= getAPIBaseURL() + '/insert_into_playlist'
  //display error message if try to add default
  AddPlaylistDDM=document.getElementById("a,"+ song_id);
  playlist_name = AddPlaylistDDM.value;

  const data= {playlist_name, song_id};
  const options = {method: 'post', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
  fetch(insert_url,options);

}


//Loads results into the table for searching by song name. Each row id is equivalent to the id of the song that populates it.
function load_results_into_table_song(results){
  let datahtml= '';
  results_body_song= document.getElementById("search_results_body_song");
  results_table_song= document.getElementById("search_results_table_song");
  var addbuttons_to_remove=[];

  for (let item of results){
    var exact_category=addbutton+item.song_id
    datahtml+= `<tr id=${item.song_id}>
    <td style="width:20%">${item.song_name}</td>
    <td style="width:15%">${item.artist_name}</td>
    <td style="width:8%">${item.release_year}</td>
    <td style="width:8%">${item.popularity}</td>
    <td style="width:8%">${item.tempo}</td>
    <td style="width:8%">${item.duration}</td>
    <td tyle="width:8%">${item.danceability}</td>
    <td style="width:15%"><select id= ${exact_category} onclick="combinedAddPlaylistsToDDM(this)" align='center' style= 'display:inline' style="width:20%" >Choose Playlist <option id = "default" value = "default"> Choose Playlist</option></select></td>
    <td style="width:10%"><button onclick = "insertIntoSelectedPlaylist(this)" style= 'display:inline' style="width:20%" >Choose Playlist</button></td></tr>`;
    // <td><select id= ${exact_category} onload = "combinedAddPlaylistsToDDM()" onchange= "insert_into_playlist(this)" align='center' style= 'display:inline' style="width:20%" >Add to Playlist <option id = "default" value = "default"> Add to Playlist</option></select></td></tr>`;
    // <td><button onclick="insert_into_playlist(this)" align='center' id= ${exact_button} style= 'display:inline' style="width:20%" >Add to Playlist</button></td></tr>`;
//checks if a song in the result is a song in the user's playlist.If true, it adds the song id to a list to remove the "add to playlist" button at the end
    // if(playlist_songs.indexOf(item.song_id) >= 0){
    //   addbuttons_to_remove.push(exact_button);
    // }
    // console.log(exact_category);
  }
  results_body_song.innerHTML= datahtml;
  results_table_song.style.display = "inline";

  //Checks if other tables are being displayed. If so, hides them
  if (results_table_genre != undefined){
    results_table_genre.style.display = "none";
  }
  if (results_table_artist != undefined){
    results_table_artist.style.display = "none";
  }

  addbuttons_to_remove.forEach(function (item) {
  document.getElementById(item).style.display='none';
});

}

//Loads results into the table for searching by artist name. Each row id is equivalent to the id of the song that populates it.
function load_results_into_table_artist(results){
  let datahtml= '';
  results_table_artist= document.getElementById("search_results_table_artist");
  results_body_artist= document.getElementById("search_results_body_artist");
  var addbuttons_to_remove=[];


  for (let item of results){
    var exact_category=addbutton+item.song_id
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
    <td><select id= ${exact_category} onclick="combinedAddPlaylistsToDDM(this)" align='center' style= 'display:inline' style="width:20%" >Add to Playlist <option id = "default" value = "default"> Add to Playlist</option></select></td>
    <td><button onclick = "insertIntoSelectedPlaylist(this)" style= 'display:inline' style="width:20%" >Add to Playlist</button></td></tr>`;

    //checks if a song in the result is a song in the user's playlist.If true, it adds the song id to a list to remove the "add to playlist" button at the end
    // if(playlist_songs.indexOf(item.song_id) >= 0){
    //   addbuttons_to_remove.push(exact_button);
    // }
  }
  results_body_artist.innerHTML= datahtml;
  results_table_artist.style.display = "inline";

  //Checks if other tables are being displayed. If so, hides them
  if (results_table_genre != undefined){
    results_table_genre.style.display = "none";
  }
  if (results_table_song != undefined){
    results_table_song.style.display = "none";
  }
  addbuttons_to_remove.forEach(function (item) {
  document.getElementById(item).style.display='none';
});
}

//Loads results into the table for searching by genre name. Each row id is equivalent to the id of the song that populates it.
function load_results_into_table_genre(results){
  let datahtml= '';
  results_body_genre= document.getElementById("search_results_body_genre");
  results_table_genre= document.getElementById("search_results_table_genre");
  var addbuttons_to_remove=[];

  for (let item of results){
    var exact_category=addbutton+item.song_id
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
    <td><select id= ${exact_category} onclick="combinedAddPlaylistsToDDM(this)" align='center' style= 'display:inline' style="width:20%" >Add to Playlist <option id = "default" value = "default"> Add to Playlist</option></select></td>
    <td><button onclick = "insertIntoSelectedPlaylist(this)" style= 'display:inline' style="width:20%" >Add to Playlist</button></td></tr>`;
    //checks if a song in the result is a song in the user's playlist.If true, it adds the song id to a list to remove the "add to playlist" button at the end
    // if(playlist_songs.indexOf(item.song_id) >= 0){
    //   addbuttons_to_remove.push(exact_button);
    // }

  }
  results_body_genre.innerHTML= datahtml;
  results_table_genre.style.display = "inline";

  //Checks if other tables are being displayed. If so, hides them
  if (results_table_artist != undefined){
    results_table_artist.style.display = "none";
  }
  if (results_table_song != undefined){
    results_table_song.style.display = "none";
  }
  addbuttons_to_remove.forEach(function (item) {
  document.getElementById(item).style.display='none';
});
}

//Loads all songs in user's playlist into the playlist table. Each row id is equivalent to the id of the song that populates it.
function load_results_into_table_playlists(playlist_results){
  let datahtml= '';
  playlist_table= document.getElementById("playlist_table");
  playlist_body= document.getElementById("playlist_body");
  var delbuttons_to_remove=[];

  for (let item of playlist_results){
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

//Deletes a song from the user's playlist via a JSON POST request
function delete_from_playlist(row)
{
var song_id=row.parentNode.parentNode.id;
  var type = "delete"
  delete_url= getAPIBaseURL() + '/delete_from_playlist'
  const data= {song_id, type};
  const options = {method: 'post', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
  fetch(delete_url,options);

  playlist_songs.push(song_id);
  button=document.getElementById("d,"+ song_id);
  button.style.display= 'none';
}

//Adds a song into the user's playlist via a JSON POST request.
function insert_into_playlist(row)
{
var song_id=row.parentNode.parentNode.id;
  var type = "insert"
  insert_url= getAPIBaseURL() + '/insert_into_playlist'
  const data= {song_id, type};
  const options = {method: 'post', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
  fetch(insert_url,options);

  playlist_songs.push(song_id);
  button=document.getElementById("a,"+ song_id);
  button.style.display= 'none';
}


//Chooses which table to load the JSON response into based on the search category
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

//Sends an API request to the server to obtain the data based on the search string  and category inputted by the user
async function returnResults(){
  get_playlist_record()
  var url = getAPIBaseURL() + getURLbyCategory();
  {await fetch(url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    chooseResults(results);
    globalresults=results;

  })
  // .then(returnPlaylistnames())
  // .then(addPlaylistsToDDM(globalPlaylistNames))
  }

}

//Sends an API request to the server to obtain all the songs in the user's playlist
async function returnPlaylistResults(){
  {await fetch(get_playlist_results_url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    globalPlaylistResults=results;
  })
  }
}

//Sends an API request to the server to obtain all the song_id's in the user's playlist
async function get_playlist_record(){
  {await fetch(playlist_url, {method: 'get'})
.then((response) => response.json())
.then(function(playlists){
  playlist_songs=playlists;

})
}
}

// function that runs on initializing the window. Still trying to figure out how to stop the full window from loading until returnPlaylistResults receives a response
async function initialize(){
    // await returnPlaylistResults().then(returnPlaylistResults())
    // .then(OnXevent()).then(returnPlaylistnames(globalPlaylistNames))
    await returnPlaylistResults().then(OnXevent())

    // returnPlaylistnames();
    // await returnPlaylistResults().then(returnPlaylistnames(globalPlaylistNames))


    //
    // await returnPlaylistnames();
    // addPlaylistsToDDM(globalPlaylistNames)

  }

function onPressKeyEnter(){
    var input = document.getElementById("search_string");
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("search_button").click();
    }
    });
  }


// assigns elements to names and assigns them their on X event.
  async function OnXevent(){
    var searchButton = document.getElementById('search_button');
    var DDButton = document.getElementById('DDButton');
    if(DDButton){
      DDButton.onchange = changePlaceHolder;
    }
    if (searchButton){
      onPressKeyEnter();
      searchButton.onclick = returnResults;
      // await returnPlaylistnames()
      // .then(addPlaylistsToDDM(globalPlaylistNames,globalresults))

    }



  }

  function go_to_playlists_page(){
    window.location.replace("http://localhost:5000/api/playlist_menu_page")
  }
