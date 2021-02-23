
window.onload = initialize;

function onSearchButton(){
  var searchString = document.getElementById('search_string')
  var url = getAPIBaseURL() + '/search_songs?search=' + searchString;
  fetch(url, {method: 'get'})
  .then((response) => response.json())
  .then(function(search){
    // var listBody = '';
    // for (var k = 0; k < cats.length; k++) {
    //     var cat = cats[k];
    //     listBody += '<li>' + cat['name']
    //               + ', ' + cat['birth_year']
    //               + '-' + cat['death_year']
    //               + ', ' + cat['description'];
    //               + '</li>\n';
    // }
  }
}

function initialize(){
    var searchButton = document.getElementById('search_button');
    button.onclick = onSearchButton;
}

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}


// function onCatsButton() {
//     var url = getAPIBaseURL() + '/search_songs?search=' ;
//
//     fetch(url, {method: 'get'})
//
//     .then((response) => response.json())
//
//     .then(function(search) {
//         var listBody = '';
//         for (var k = 0; k < cats.length; k++) {
//             var cat = cats[k];
//             listBody += '<li>' + cat['name']
//                       + ', ' + cat['birth_year']
//                       + '-' + cat['death_year']
//                       + ', ' + cat['description'];
//                       + '</li>\n';
//         }
//
//         var animalListElement = document.getElementById('animal_list');
//         if (animalListElement) {
//             animalListElement.innerHTML = listBody;
//         }
//     })
//
//     .catch(function(error) {
//         console.log(error);
//     });
// }
