// var playlist_details= undefined;
// var metric = undefined;
// var results=undefined;
// all_playlist_names_url= getAPIBaseURL() + '/playlist_menu';



function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

// async function get_both_playlist_details(){
//   // get value playlist1
//   // get value playlist2
//   // get value metric
//   url= getAPIBaseURL() + 'api/data_visualizer'
//   const data= {playlist1, playlist2, metric};
//   const options = {method: 'get', headers: {'Content-type': 'application/json' },body: JSON.stringify(data)};
//   await fetch(url,options)
//   .then((response) => response.json())
//   .then(function(results){
//     playlist_details=results;
//     console.log(playlist_details)
// })
// }

//onclick func
function get_one_playlist_details(){
  playlist1=document.getElementById('DDButtonPlaylist').value
  metric=document.getElementById('DDButtonMetric').value
  // playlist1='a'
  // metric='tempo'
  if (!(playlist1=='default' || metric=='default')){
  url= getAPIBaseURL() + '/graph_one_playlist?playlist1=' + playlist1 +'&metric=' + metric;
  console.log(url)
  {fetch(url,{method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    load_data_into_chart(results);
  })
}
}else{
  window.alert("Please select some options using the dropdown menus")
}}


function load_data_into_chart(playlist_details){
  // console.log(results)
  if (playlist_details.length===0){
    window.alert("There are no songs in this playlist!")
  } else{
    xLine=[]
    yLine=[]
    keys=Object.keys(playlist_details[0])
    if (keys.includes('tempo')){
    for (let item of playlist_details){
      xLine.push(item.song_name)
      yLine.push(item.tempo)
    }
  } else if (keys.includes('danceability')){
    for (let item of playlist_details){
    xLine.push(item.song_name)
    yLine.push(item.danceability)
  }
  }else if (keys.includes('duration')){
    for (let item of playlist_details){
    xLine.push(item.song_name)
    yLine.push(item.duration)
  }
  }else if (keys.includes('popularity')){
    for (let item of playlist_details){
    xLine.push(item.song_name)
    yLine.push(item.popularity)
  }
  }

  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: xLine,
          datasets: [{
              label: metric,
              data: yLine,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
}}

function returnPlaylistnames(){
  all_playlist_names_url= getAPIBaseURL() + '/playlist_menu';
  {fetch(all_playlist_names_url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    console.log(results)
    load_all_options_into_DropDownPlaylist(results)
  })
  }
}

function load_one_option_into_DropDownPlaylist(playlist_name){
  var DropDownPlaylist= document.getElementById('DDButtonPlaylist')
  var option=document.createElement("option")
  option.setAttribute('id',playlist_name)
  option.setAttribute('value',playlist_name)
  option.appendChild(document.createTextNode(playlist_name));
  DropDownPlaylist.appendChild(option)
}

function load_all_options_into_DropDownPlaylist(results){
  for (let item of results){
    name=item.playlist_name
    load_one_option_into_DropDownPlaylist(name)
  }
}

async function initialize(){
  returnPlaylistnames()
}
window.onload=initialize
