//authors: Kevin Phung, Kyosuke Imai

//List of globally declared variables
var add_button_prefix = "a,";
var results_table_song= undefined;
var results_table_artist= undefined;
var results_table_genre= undefined;
var songID_playlist_results = undefined;
// var song_ids_and_playlist_names_url = getAPIBaseURL() + '/get_song_ids_by_playlist';
// all_playlist_names_url= getAPIBaseURL() + '/playlist_menu';
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
}

//Just gets the base url for the API call
function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}


function returnPlaylistnames(){
  all_playlist_names_url= getAPIBaseURL() + '/playlist_menu';
  {fetch(all_playlist_names_url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    globalPlaylistNames=results;
    console.log(results)
  })
  }
}

function checkIfDuplicate(row){
  var song_id=row.parentNode.parentNode.id;
  var distinctID = "a," + song_id;
  var AddPlaylistDDM = document.getElementById(distinctID);
  console.log("lengthth = " + songID_playlist_results.length);
  for (var dict of songID_playlist_results){
    console.log("song_id= " + dict.song_id)
    if(dict.playlist_name == AddPlaylistDDM.value){
      if(dict.song_id == song_id){
        console.log("NOOOO")
        return true;
      }
    }

  }
}

function loadAllPlaylists(){
  var song_ids_and_playlist_names_url = getAPIBaseURL() + '/get_song_ids_by_playlist';
  {fetch(song_ids_and_playlist_names_url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    songID_playlist_results = results;
    console.log(songID_playlist_results)
  })
  }
}

function addPlaylistToDDM(playlist_names, row){
  for (let item of playlist_names){
    var AddPlaylistDDM = document.getElementById(row);
    var newOption = document.createElement("option");
    newOption.text = newOption.value = item.playlist_name;
    AddPlaylistDDM.appendChild(newOption);
    }

  }




function insertIntoSelectedPlaylist(row){
  if (checkIfDuplicate(row)==true){
    window.alert("The song is already in the Playlist!");
  }
  else{
    var song_id=row.parentNode.parentNode.id;
    insert_url= getAPIBaseURL() + '/insert_into_playlist'
    //display error message if try to add default
    AddPlaylistDDM=document.getElementById("a,"+ song_id);
    playlist_name = AddPlaylistDDM.value;
    if (playlist_name=='default'){
      window.alert("Please choose a playlist to add to, or make a new one");
    } else{
    const data= {playlist_name, song_id};
    const options = {method: 'post', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
    fetch(insert_url,options);
    songID_playlist_results.push({'playlist_name':playlist_name, 'song_id':song_id});

  }
}
}


//Loads results into the table for searching by song name. Each row id is equivalent to the id of the song that populates it.
function load_results_into_table_song(results){
  let datahtml= '';
  results_body_song= document.getElementById("search_results_body_song");
  results_table_song= document.getElementById("search_results_table_song");
  var list_of_dropdowns=[]

  for (let item of results){
    var exact_category=add_button_prefix+item.song_id
    list_of_dropdowns.push(exact_category)
    datahtml+= `<tr id=${item.song_id}>
    <td style="width:20%">${item.song_name}</td>
    <td style="width:15%">${item.artist_name}</td>
    <td style="width:8%">${item.release_year}</td>
    <td style="width:8%">${item.popularity}</td>
    <td style="width:8%">${item.tempo}</td>
    <td style="width:8%">${item.duration}</td>
    <td tyle="width:8%">${item.danceability}</td>
    <td style="width:15%"><select id= ${exact_category} align='center' style= 'display:inline' style="width:20%" >Choose Playlist <option id = "default" value = "default"> Choose Playlist</option></select></td>
    <td style="width:10%"><button onclick = "insertIntoSelectedPlaylist(this)" style= 'display:inline' style="width:20%" >Choose Playlist</button></td></tr>`;
  }
  results_body_song.innerHTML= datahtml;
  for (let item of list_of_dropdowns){
  addPlaylistToDDM(globalPlaylistNames, item)
}
  results_table_song.style.display = "inline";
  //Checks if other tables are being displayed. If so, hides them
  if (results_table_genre != undefined){
    results_table_genre.style.display = "none";
  }
  if (results_table_artist != undefined){
    results_table_artist.style.display = "none";
  }


}

//Loads results into the table for searching by artist name. Each row id is equivalent to the id of the song that populates it.
function load_results_into_table_artist(results){
  let datahtml= '';
  results_table_artist= document.getElementById("search_results_table_artist");
  results_body_artist= document.getElementById("search_results_body_artist");
  var list_of_dropdowns=[]


  for (let item of results){
    var exact_category=add_button_prefix+item.song_id
    if (list_of_dropdowns.indexOf(exact_category)==-1){
    list_of_dropdowns.push(exact_category)
  }else{
    exact_category=exact_category.split(',')
    exact_category[0]=exact_category[0]+'a'
    exact_category=exact_category.join()
    console.log(exact_category);
    list_of_dropdowns.push(exact_category)
  }
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
    <td><select id= ${exact_category} align='center' style= 'display:inline' style="width:20%" >Add to Playlist <option id = "default" value = "default"> Add to Playlist</option></select></td>
    <td><button onclick = "insertIntoSelectedPlaylist(this)" style= 'display:inline' style="width:20%" >Add to Playlist</button></td></tr>`;

  }
  results_body_artist.innerHTML= datahtml;
  for (let item of list_of_dropdowns){
  addPlaylistToDDM(globalPlaylistNames, item)
}
  results_table_artist.style.display = "inline";

  //Checks if other tables are being displayed. If so, hides them
  if (results_table_genre != undefined){
    results_table_genre.style.display = "none";
  }
  if (results_table_song != undefined){
    results_table_song.style.display = "none";
  }

}

//Loads results into the table for searching by genre name. Each row id is equivalent to the id of the song that populates it.
function load_results_into_table_genre(results){
  let datahtml= '';
  results_body_genre= document.getElementById("search_results_body_genre");
  results_table_genre= document.getElementById("search_results_table_genre");
  var list_of_dropdowns=[]

  for (let item of results){
    var exact_category=add_button_prefix+item.song_id
    if (list_of_dropdowns.indexOf(exact_category)==-1){
    list_of_dropdowns.push(exact_category)
  }else{
    exact_category=exact_category.split(',')
    exact_category[0]=exact_category[0]+'a'
    exact_category=exact_category.join()
    console.log(exact_category);
    list_of_dropdowns.push(exact_category)
  }
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
    <td><select id= ${exact_category} align='center' style= 'display:inline' style="width:20%" >Add to Playlist <option id = "default" value = "default"> Add to Playlist</option></select></td>
    <td><button onclick = "insertIntoSelectedPlaylist(this)" style= 'display:inline' style="width:20%" >Add to Playlist</button></td></tr>`;


  }
  results_body_genre.innerHTML= datahtml;
  for (let item of list_of_dropdowns){
  addPlaylistToDDM(globalPlaylistNames, item)
}
  results_table_genre.style.display = "inline";

  //Checks if other tables are being displayed. If so, hides them
  if (results_table_artist != undefined){
    results_table_artist.style.display = "none";
  }
  if (results_table_song != undefined){
    results_table_song.style.display = "none";
  }

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


function returnResults(){
  var url = getAPIBaseURL() + getURLbyCategory();
  {fetch(url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    chooseResults(results);


  })
  }

}



// function that runs on initializing the window. Still trying to figure out how to stop the full window from loading until returnPlaylistResults receives a response
// async function initialize(){
function initialize(){
    loadAllPlaylists();
    returnPlaylistnames()
    OnXevent()

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
// async function OnXevent(){
 function OnXevent(){
    var searchButton = document.getElementById('search_button');
    var DDButton = document.getElementById('DDButton');
    if(DDButton){
      DDButton.onchange = changePlaceHolder;
    }
    if (searchButton){
      onPressKeyEnter();
      searchButton.onclick = returnResults;
    }

  }
