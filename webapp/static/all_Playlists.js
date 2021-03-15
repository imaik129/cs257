var globalPlaylistNames= [];



function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}


function returnPlaylistnames(){
  all_playlist_names_url= getAPIBaseURL() + '/playlist_menu';
  {fetch(all_playlist_names_url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    load_playlists_into_table(results);
    for (let item of results){
      globalPlaylistNames.push(item.playlist_name);
    }
    console.log(globalPlaylistNames)
  })
  }
}


function load_playlists_into_table(playlist_names){
  console.log(playlist_names)
  for (let item of playlist_names){
    name=item.playlist_name;
    count= item.total_songs;
    create_row(name,count);
  }
  document.getElementById("playlists_table").style.display= "inline";
}

function create_row(name,total){
  var tbody = document.getElementById("playlists_table_body");
  var row = document.createElement("tr");
  var playlist_name = document.createElement("td");
  var count = document.createElement("td");
  var delete_cell = document.createElement("td");
  var delete_button=document.createElement("button");
  var href = getAPIBaseURL() + "/api/specific_playlist_page?playlist=" + name;
  row.setAttribute('id', name);
  playlist_name.appendChild(document.createTextNode(name));
  count.appendChild(document.createTextNode(total));
  delete_button.appendChild(document.createTextNode("Delete Playlist"));
  delete_cell.appendChild(delete_button)
  row.appendChild(playlist_name);
  row.appendChild(count);
  row.appendChild(delete_cell);
  tbody.appendChild(row);
  playlist_name.setAttribute("onclick", "go_to_playlist(this)");
  delete_button.setAttribute("onclick", "delete_playlist(this)")
}

function go_to_playlist(row){
  name= row.parentNode.id;
  url= getAPIBaseURL() + "/specific_playlist_page?playlist=" + name;
  window.location.replace(url)
}



function delete_playlist(row){
  var playlist_name=row.parentNode.parentNode.id
  var table= row.parentNode.parentNode.parentNode.id
  var tester = document.getElementById(playlist_name);
  delete_url= getAPIBaseURL() + '/delete_playlist'
  const data= {playlist_name};
  const options = {method: 'post', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
  fetch(delete_url,options);
  index=globalPlaylistNames.indexOf(playlist_name)
  globalPlaylistNames.splice(index,1);
  deleteRow(playlist_name)
}

function deleteRow(rowid)
{
    var row = document.getElementById(rowid);
    row.parentNode.removeChild(row);
}

function create_new_playlist(){
  var new_playlist_name=document.getElementById("input_playlist_name").value;
  if (globalPlaylistNames.includes(new_playlist_name)){
    window.alert("Playlist name already exists");
  }
  else if(new_playlist_name=="") {
    window.alert("Please enter a non-blank name for the playlist");
  }
  else{
    console.log(globalPlaylistNames)
    create_playlist_url= getAPIBaseURL() + '/create_playlist'
    const data= {new_playlist_name};
    const options = {method: 'post', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
    fetch(create_playlist_url,options);
    globalPlaylistNames.push(new_playlist_name);
    create_row(new_playlist_name,0);
    console.log(globalPlaylistNames)
  }
}


function initialize(){
  returnPlaylistnames()
}

window.onload = initialize();
