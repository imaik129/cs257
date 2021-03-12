all_playlist_names_url= getAPIBaseURL() + '/playlist_menu';
var globalPlaylistNames= undefined;



function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

async function returnPlaylistnames(){
  {await fetch(all_playlist_names_url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    globalPlaylistNames=results;
    console.log(results)
  })
  }
}


function load_playlists_into_table(playlist_names){
  for (let item in playlist_names){
    tester(playlist_names[item])
  }
}

function tester(item){
  var ul = document.getElementById("playlist_body");
  var li = document.createElement("li");
  var a_Tag = document.createElement("a");
  var href = "/api/specific_playlist_page?playlist=" + item;
  li.setAttribute('id', item);
  a_Tag.setAttribute("href", href);
  a_Tag.appendChild(document.createTextNode(item));
  li.appendChild(a_Tag);
  ul.appendChild(li);
}

function deleteItemFromPlaylistsList(){
  var ul = document.getElementById("allPlaylists");
  var newPlaylist = document.getElementById("input_playlist_name");
  var item = document.getElementById(newPlaylist.value);
  ul.removeChild(item);
}


function create_new_playlist(){
  var new_playlist_name=document.getElementById("input_playlist_name").value;
  if (globalPlaylistNames.includes(new_playlist_name)){
    window.alert("Playlist name already exists");
  } else{
    create_playlist_url= getAPIBaseURL() + '/create_playlist'
    const data= {new_playlist_name};
    const options = {method: 'post', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
    fetch(create_playlist_url,options);
    globalPlaylistNames.push(new_playlist_name)
    console.log(globalPlaylistNames)
  }
}



async function initialize(){
  await returnPlaylistnames();
  load_playlists_into_table(globalPlaylistNames)
}


window.onload = initialize();
