AUTHORS: Kevin Phung, Kyosuke Imai

*IMPORTANT: will need to import simplejson module for the program to work*

DATA: The dataset file contains more than 175000 songs collected from the Spotify Web API, each with individual metrics like tempo,danceability and popularity.

FEATURES CURRENTLY WORKING:
- Search by Categories (Song,Artist,genre): Users can search for songs using one of the 3 categories and return data

- Sort by X variable: Click on table headers to sort by ascending or descending order

- Add/remove from playlist: Add songs or remove them from a playlist


FEATURES NOT YET WORKING:
- Login system : to handle multiple users

- More playlist manipulation: Adding songs to different playlists and deleting them (Currently only 1 playlist exists)

- Data visualizer : Option to create some basic graphs to compare statistics between playlists or artists

- Faster and better searches: Search by artist currently takes a long time due to using double query instead of subqueries. Search by genre does not yet compile artists for songs with multiple artists

- display x results: Adding pages to view more than top 50 results for search by artist and top 200 for songs and genres

- Utilizing multiple templates: Plan on making playlists and their inventory a separate template along with data visualizer (would also fix some of our bugs when combined with URL redirects)

- click 'enter' to search

- sort playlist by most recent entry of songs

- have a changing music quote in middle of home page


EXTRA DETAILS TO IMPLEMENT:
-Bug fixes (Some are a little weird)

-Proper await and promise functions. (which will hopefully solve most of the bugs)

-More detailed comments
