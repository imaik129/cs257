//
// let sorted = false;
// var url = getAPIBaseURL() + '/search_songs?search=hello' ;
//
// function getAPIBaseURL() {
//     var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
//     return baseURL;
// }
//
//
// function load_results_into_table(results){
//   const results_table = document.getElementById("search_results_table");
//   let datahtml= '';
//
//   for (let item of results){
//     datahtml+= `<tr><td>${item.song_name}</td>
//     <td>${item.artist_name}</td>
//     <td>${item.release_year}</td>
//     <td>${item.popularity}</td>
//     <td>${item.tempo}</td>
//     <td>${item.duration}</td>
//     <td>${item.danceability}</td></tr>`;
//   }
//   results_table.innerHTML= datahtml;
// }
//
// function sortColumn(columnName){
//   getResults(function(results){
//   const dataType= typeof results[0][columnName]
//   sorted= !sorted;
//
//   switch(dataType){
//     case 'number':
//     sortNumberColumn(sorted,columnName)
//     break;
//
//   }
//   load_results_into_table(results);
// })
// }
//
// function sortNumberColumn(sort,columnName){
//   getResults(function(results){
//   results=results.sort((p1,p2) => {
//     return sort ? p1[columnName] - p2[columnName] : p2[columnName] - p1[columnName]
//   });
// })
// }
//
//
//
// function getResults(callback){
// {fetch(url, {method: 'get'})
// .then((response) => response.json())
// .then(function(results){
//   callback(results);
// })
// }
// }
//
//
//
// function initialize(){
//   getResults(function(results){
//   load_results_into_table(results);
// })
// }
//
//
// window.onload=initialize



let sorted = false;
var url = getAPIBaseURL() + '/search_songs?search=hello' ;

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}


function load_results_into_table(results){
  const results_table = document.getElementById("search_results_table");
  let datahtml= '';

  for (let item of results){
    datahtml+= `<tr><td>${item.song_name}</td>
    <td>${item.artist_name}</td>
    <td>${item.release_year}</td>
    <td>${item.popularity}</td>
    <td>${item.tempo}</td>
    <td>${item.duration}</td>
    <td>${item.danceability}</td></tr>`;
  }
  results_table.innerHTML= datahtml;
}

function sortColumn(columnName){
  const dataType= typeof globalresults[0][columnName]
  sorted= !sorted;

  switch(dataType){
    case 'number':
    sortNumberColumn(sorted,columnName)
    break;

  }
  load_results_into_table(globalresults);
}

function sortNumberColumn(sort,columnName){

  globalresults=globalresults.sort((p1,p2) => {
    return sort ? p1[columnName] - p2[columnName] : p2[columnName] - p1[columnName]
  });

}



// function getResults(callback){
// {fetch(url, {method: 'get'})
// .then((response) => response.json())
// .then(function(results){
// })
// }
// }


var globalresults;

async function initialize(){
  {await fetch(url, {method: 'get'})
  .then((response) => response.json())
  .then(function(results){
    load_results_into_table(results);
    globalresults=results
    console.log(globalresults)
})
}}


window.onload=initialize
