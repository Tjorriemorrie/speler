import pylast


class LastFm():
    # You have to have your own unique two values for API_KEY and API_SECRET
    # Obtain yours from http://www.last.fm/api/account for Last.fm
    API_KEY = '2b532992c84242d372f5c0044d6883e5'
    API_SECRET = '3c6688ac84deda063a697f5662a93eb0'

    def __init__(self, username=None, password=None):
        self.network = pylast.LastFMNetwork(
            api_key=self.API_KEY,
            api_secret=self.API_SECRET,
            username=username if username else 'tjorriemorrie',
            password_hash=password if password else pylast.md5('last^fm'),
        )

    # now you can use that object everywhere
    # artist = network.get_artist("System of a Down")
    # artist.shout("<3")