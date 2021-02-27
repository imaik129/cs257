import csv

#read files ("ID","Name","Sex","Age","Height","Weight","Team","NOC","Games","Year","Season","City","Sport","Event","Medal")

class song_row:
    def __init__(self, song_name, artist, release_year, popularity, tempo, duration,danceability):
        self.song_name = song_name
        self.artist= artist
        self.release_year = release_year
        self.popularity = popularity
        self.tempo = tempo
        self.duration = duration
        self.danceability = danceability

class song_details:
	"""athlete object that takes in name and sex"""
	def __init__(self, name, release_year,popularity):
		self.name = name
		self.release_year = release_year
		self.popularity= popularity


def create_song_details_table(all_rows):
    song_details_table = []
    song_details_dict = {}
    index = 1
    for song_row in all_rows:
        one_song_details = song_details(song_row.song_name, song_row.release_year, song_row.popularity)
        if one_song_details not in song_details_dict:
            this_row = [index, song_row.song_name, song_row.release_year, song_row.popularity]
            song_details_table.append(this_row)
            song_details_dict[one_song_details] = index
            index = index + 1
    return song_details_table, song_details_dict

class song_characteristics:
	"""olympic game object that takes in year, season, and city of the given olympic game"""
	def __init__(self, tempo, duration, danceability):
		self.tempo = tempo
		self.duration = duration
		self.danceability = danceability

# create an country table: ID, abrivated name, fully spelled country name (later),
def create_song_characteristics_table(all_rows):
    song_characteristics_table = []
    song_characteristics_dict = {}
    index = 1
    for song_row in all_rows:
        one_song_characteristics = song_characteristics(song_row.tempo, song_row.duration, song_row.danceability)
        if one_song_characteristics not in song_characteristics_dict:
            this_row = [index, song_row.tempo, song_row.duration, song_row.danceability]
            song_characteristics_table.append(this_row)
            song_characteristics_dict[one_song_characteristics] = index
            index = index + 1
    return song_characteristics_table, song_characteristics_dict

class artist_row:
    def __init__(self, artist_name, tempo, duration,danceability):
        self.artist_name = artist_name
        self.tempo = tempo
        self.duration = duration
        self.danceability = danceability


class artist_details:
	"""athlete object that takes in name and sex"""
	def __init__(self, name):
		self.name = name

def create_artist_details_table(all_rows):
    artist_details_table = []
    artist_details_dict = {}
    index = 1
    for artist_row in all_rows:
        one_artist_details = artist_details(artist_row.artist_name)
        if one_artist_details not in artist_details_dict:
            this_row = [index, artist_row.artist_name,]
            artist_details_table.append(this_row)
            artist_details_dict[one_artist_details] = index
            index = index + 1
    return artist_details_table, artist_details_dict

class artist_characteristics:
	"""athlete object that takes in name and sex"""
	def __init__(self, tempo, duration, danceability):
		self.tempo = tempo
		self.duration = duration
		self.danceability = danceability

def create_artist_characteristics_table(all_rows):
    artist_characteristics_table = []
    artist_characteristics_dict = {}
    index = 1
    for artist_row in all_rows:
        one_artist_characteristics = artist_characteristics(artist_row.tempo, artist_row.duration, artist_row.danceability)
        if one_artist_characteristics not in artist_characteristics_dict:
            this_row = [index, artist_row.tempo, artist_row.duration, artist_row.danceability]
            artist_characteristics_table.append(this_row)
            artist_characteristics_dict[one_artist_characteristics] = index
            index = index + 1
    return artist_characteristics_table, artist_characteristics_dict


#---------------------------------------------------------------------

class genre_row:
    def __init__(self, genre_name, tempo, duration,danceability):
        self.genre_name = genre_name
        self.tempo = tempo
        self.duration = duration
        self.danceability = danceability

class genre_details:
	"""athlete object that takes in name and sex"""
	def __init__(self, name):
		self.name = name

def create_genre_details_table(all_rows):
    genre_details_table = []
    genre_details_dict = {}
    index = 1
    for genre_row in all_rows:
        one_genre_details = genre_details(genre_row.genre_name)
        if one_genre_details not in genre_details_dict:
            this_row = [index, genre_row.genre_name,]
            genre_details_table.append(this_row)
            genre_details_dict[one_genre_details] = index
            index = index + 1
    return genre_details_table, genre_details_dict

class genre_characteristics:
	"""athlete object that takes in name and sex"""
	def __init__(self, tempo, duration, danceability):
		self.tempo = tempo
		self.duration = duration
		self.danceability = danceability

def create_genre_characteristics_table(all_rows):
    genre_characteristics_table = []
    genre_characteristics_dict = {}
    index = 1
    for genre_row in all_rows:
        one_genre_characteristics = genre_characteristics(genre_row.tempo, genre_row.duration, genre_row.danceability)
        if one_genre_characteristics not in genre_characteristics_dict:
            this_row = [index, genre_row.tempo, genre_row.duration, genre_row.danceability]
            genre_characteristics_table.append(this_row)
            genre_characteristics_dict[one_genre_characteristics] = index
            index = index + 1
    return genre_characteristics_table, genre_characteristics_dict


#---------------------------------------------------------------------

#I want to connect the song_index and artist_index
#The way to do this is by comparing artist_name as value in artist_details_dict
#and artist_name in song_rows (list of song_row objects).
# to get the artist_id


# def create_song_artist_link_table(song_rows, song_details_dictionary, artist_details_dict):
#     song_artist_link_table = []
#     artist_dict_keys = list(artist_details_dict.keys())
#     if there are multiple strings sperated by comma in song_rows.artists, make a new song row object
#     with another song_id and artist name
#     and add to song_details_dictionary
#     stip the artist name of the square brackets []
#     for song_row in song_rows:
#         one_song_details = song_details(song_row.song_name, song_row.release_year, song_row.popularity)
#         print(song_details_dictionary.keys)
#         song_id = song_details_dictionary[one_song_details]
#         song_id = song_details_dict[one_song_details]
#         for artist_name in artist_dict_keys:
#             if song_row.artist == artist_name.name:
#                  this_row = [song_id, artist_id]
#                  song_artist_link_table.append(this_row)
#     return song_artist_link_table


#---------------------------------------------------------
def make_csv_row(this_row):
	if len(this_row) < 1:
		print("yooo! your row aint right!")
		return
	out_csv_row = str(this_row[0])
	for i in range(1, len(this_row)):
		csv_save_cell = str(this_row[i]).replace(",", "").replace('"', "(", 1)
		csv_save_cell = csv_save_cell.replace('"', ")")
		out_csv_row = out_csv_row + "," + csv_save_cell

	return (out_csv_row + '\n')

def print_table(table_list, file_name, header_list):
	"""print method to print the tables into a csv file given the table list, file name and the header of the individual columns """
	# example header_list ["ID", "country_three_letter", "full country_name"]
	num_col = len(table_list[0])
	if num_col != len(header_list):
		print("yooo! the number of cols between your list and header_list doesn't match!")
		print(num_col)
		print(len(header_list))
		return

	outfile = open(file_name, 'w')
	outfile.write(make_csv_row(header_list))

	# write actual data
	for row in table_list:
		outfile.write(make_csv_row(row))
	outfile.close()

def main():
    #----------------------------------------------------------------------------
    song_rows = []
    for song_roww in song_rows:
        print(song_roww)
    with open('TestSearch.csv') as file:
        read_in_file = list((csv.reader(file, skipinitialspace=True)))

    for row in read_in_file[1:]:
        if len(row) > 1:
            this_row = song_row(row[12], row[1], row[14], row[13], row[16], row[3], row[2])
            song_rows.append(this_row)


    song_details_table, song_details_dict = create_song_details_table(song_rows)
    song_details_header =["song_ID", "song_name", "release_year","popularity"]
    print_table(song_details_table, "song_details.csv", song_details_header)

    song_characteristics_table, song_characteristics_dict = create_song_characteristics_table(song_rows)
    song_characteristics_header = ["song_ID", "tempo", "duration","danceability"]
    print_table(song_characteristics_table, "song_characteristics.csv", song_characteristics_header)

    #--------------------------------------------------------------------------------------
    artist_rows = []
    with open('data_by_artist.csv') as file:
        read_in_file = list((csv.reader(file, skipinitialspace=True)))

    for row in read_in_file[1:]:
        if len(row) > 1:
            this_row = artist_row(row[0], row[9], row[3], row[2])
            artist_rows.append(this_row)

    artist_details_table, artist_details_dict = create_artist_details_table(artist_rows)
    artist_details_header =["artist_ID", "artist_name"]
    print_table(artist_details_table, "artist_details.csv", artist_details_header)

    artist_characteristics_table, artist_characteristics_dict = create_artist_characteristics_table(artist_rows)
    artist_characteristics_header = ["artist_ID", "average tempo", " average duration","average danceability"]
    print_table(artist_characteristics_table, "artist_characteristics.csv", artist_characteristics_header)

    #---------------------------------------------------------------------------------
    genre_rows = []
    with open('data_by_genres.csv') as file:
        read_in_file = list((csv.reader(file, skipinitialspace=True)))

    for row in read_in_file[1:]:
        if len(row) > 1:
            this_row = genre_row(row[0], row[9], row[3], row[2])
            genre_rows.append(this_row)


    genre_details_table, genre_details_dict = create_genre_details_table(genre_rows)
    genre_details_header =["genre_ID", "genre_name"]
    print_table(genre_details_table, "genre_details.csv", genre_details_header)

    genre_characteristics_table, genre_characteristics_dict = create_genre_characteristics_table(genre_rows)
    genre_characteristics_header = ["getnre_ID", "average tempo", " average duration","average danceability"]
    print_table(genre_characteristics_table, "genre_characteristics.csv", genre_characteristics_header)

    #---------------------------------------------------------------

    song_artist_link_table = create_song_artist_link_table(song_rows, song_details_dict, artist_details_dict)
    song_artist_link_table_header = ["song_id", "artist_id"]
    print_table(song_artist_link_table, "song_artist_link.csv", song_artist_link_table_header)
if __name__ == '__main__':
    main()
