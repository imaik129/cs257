class SearchStringChecker:
    def __init__(self, search_string):
        self.search_string = search_string


    def get_search_string(self):
        return self.search_string

    def is_not_empty(self):
        if self.search_string==None:
            raise ValueError('search parameter cannot be empty')

        return True

    def string_is_ascii(self):
        if (self.search_string.isascii()):
            return True

        else:
            return False

    def is_too_long(self,n):
        if len(self.search_string)>= n :
            raise ValueError('search parameter is greater than %n characters')

        return False
