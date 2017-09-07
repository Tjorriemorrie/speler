from datetime import datetime, timedelta
from mutagen.mp3 import MP3
from mutagen.mp4 import MP4
from mutagen.id3 import ID3, COMM, TRCK, TPE1, TIT2, TALB
import os
from sqlalchemy import or_, and_
from random import choice
from itertools import combinations
from app import app, db
from app.models import Song, Queue, History, Rating, Artist, Album


def scanDirectory():
    app.logger.info('Scanning {}'.format(app.config['MUSIC_FOLDER']))

    # find new files
    new_paths = []
    for curdir, subdirs, files in os.walk(app.config['MUSIC_FOLDER']):
        for file_name in files:
            file_path = os.path.abspath(os.path.join(curdir, file_name))
            # app.logger.debug(file_path)

            if not Song.query.filter_by(abs_path=file_path).first():
                new_paths.append(file_path)

    if new_paths:
        for file_path in new_paths:
            if any([file_path.lower().endswith(ext) for ext in ['mp3', 'm4a']]):
                song = Song(file_path)
                db.session.add(song)
            else:
                app.logger.warn('Did not add this file based on extension: {}'.format(file_path))
            # app.logger.debug('Adding {}'.format(file_path))
        app.logger.info('Committing {} new files...'.format(len(new_paths)))
        db.session.commit()

    app.logger.info('{} songs added...'.format(len(new_paths)))
    return len(new_paths)


def validateSongs():
    app.logger.info('Validating songs')
    songs = Song.query.all()
    lost_songs = []
    for song in songs:
        if not os.path.isfile(song.abs_path):
            # app.logger.warn('Song not found', song)
            lost_songs.append(song)

    if lost_songs:
        for song in lost_songs:
            db.session.delete(song)
        app.logger.info('Committing {} lost files...'.format(len(lost_songs)))
        db.session.commit()

    app.logger.info('{} songs lost'.format(len(lost_songs)))
    return len(lost_songs)


def parseId3Tags():
    app.logger.info('Parsing ID3 tags...')
    songs = Song.query.filter(Song.id3_parsed.is_(False)).limit(50).all()
    app.logger.info('{} songs found to parse...'.format(len(songs)))

    # app.logger.info(EasyID3.valid_keys.keys())
    # app.logger.info(EasyMP4Tags.List)
    for song in songs:

        # get tag info
        info = {}
        if song.path_name.lower().endswith('mp3'):
            meta = MP3(song.abs_path)
            # app.logger.debug(meta.tags)
            try:
                info['song_title'] = meta.tags['TIT2'].text[0]
            except KeyError:
                info['song_title'] = song.path_name
            try:
                trck = meta.tags['TRCK'].text[0]
                if '/' in trck:
                    info['track_number'], info['total_tracks'] = trck.split('/')
                else:
                    info['track_number'] = trck
                    info['total_tracks'] = None
            except KeyError:
                info['track_number'] = 1
                info['total_tracks'] = 1
            try:
                info['track_number'] = int(info['track_number'])
            except (ValueError, TypeError):
                info['track_number'] = None
            try:
                info['total_tracks'] = int(info['total_tracks'])
            except (ValueError, TypeError):
                info['total_tracks'] = None
            try:
                info['artist_name'] = meta.tags['TPE1'].text[0]
            except KeyError:
                info['artist_name'] = 'unknown artist'
            try:
                info['album_name'] = meta.tags['TALB'].text[0]
            except KeyError:
                info['album_name'] = 'unknown album'
            info['disc_number'] = int(meta.tags['TPOS'].text[0].split('/')[0]) if 'TPOS' in meta else 1
            info['total_discs'] = int(meta.tags['TPOS'].text[0].split('/')[1]) if 'TPOS' in meta and '/' in meta.tags['TPOS'].text[0] else 1
            info['year'] = int(meta.tags['TDRC'].text[0].year) if 'TDRC' in meta else None
        elif song.path_name.lower().endswith('m4a'):
            meta = MP4(song.abs_path)
            info['song_title'] = meta[u'\xa9nam'][0]
            info['track_number'] = int(meta[u'trkn'][0][0])
            info['total_tracks'] = int(meta[u'trkn'][0][1])
            info['artist_name'] = meta[u'\xa9ART'][0]
            info['album_name'] = meta[u'\xa9alb'][0]
            info['disc_number'] = int(meta[u'disk'][0][0]) if u'disk' in meta else 1
            info['total_discs'] = int(meta[u'disk'][0][1]) if u'disk' in meta else 1
            info['year'] = int(meta[u'\xa9day'][0]) if u'\xa9day' in meta else None
        else:
            raise Exception('Unknown extension {}'.format(song.path_name))
        app.logger.debug(info)

        # artist info
        artist = Artist.query.filter_by(name_id=info['artist_name'].lower().strip()).first()
        if not artist:
            artist = Artist(info['artist_name'])
            db.session.add(artist)
            db.session.commit()
            app.logger.info('{} <= {}'.format(artist, info['artist_name']))
        song.artist_id = artist.id

        # album info
        album = Album.query.filter_by(name_id=info['album_name'].lower().strip(), artist=artist).first()
        if not album:
            album = Album(info['album_name'], artist)
            album.disc_number = info['disc_number']
            album.total_discs = info['total_discs']
            album.total_tracks = info['total_tracks']
            album.year = info['year']
            db.session.add(album)
            db.session.commit()
            app.logger.info('{} <= {}'.format(album, info['album_name']))
        song.album_id = album.id

        # song info
        song.name = info['song_title']
        song.track_number = info['track_number']
        song.id3_parsed = True

    db.session.commit()

    app.logger.info('Parsed {} ID3 tags...'.format(len(songs)))
    return len(songs)


def get_song():
    """Return highest priority song adjusted for time since last played"""
    # first play unrated songs
    songs = Song.query.filter(
        Song.count_played == 0).order_by(
        Song.abs_path).all()

    if len(songs):
        app.logger.debug('Returning unplayed random song from {}'.format(len(songs)))
        song = choice(songs)

    # return highest priority
    else:
        sql = Song.query.order_by(Song.priority.desc())
        app.logger.info('Priority SQL: {}'.format(sql))
        song = sql.first()

    app.logger.info('selected song = {}'.format(song))
    return song


def create_history(song):
    app.logger.info('Creating history')

    # create history
    history = History(song)
    db.session.add(history)

    db.session.commit()

    return history


def get_recent_history():
    hour_ago = datetime.now() - timedelta(minutes=60)
    histories = History.query.filter(
        History.played_at > hour_ago
    ).order_by(
        History.played_at.desc()
    ).limit(10).all()
    return histories


def get_match(song):
    match = None
    histories = get_recent_history()[:5]
    songs = [song] + [h.song for h in histories]
    song_ids = [s.id for s in songs]
    ratings = Rating.query.filter(and_(
        Rating.song_winner_id.in_(song_ids),
        Rating.song_loser_id.in_(song_ids),
    )).all()
    for a, b, c in combinations(songs, 3):
        comb_ids = [a.id, b.id, c.id]
        if len(set(comb_ids)) < 3:
            continue
        comb_ratings = [r for r in ratings
                        if r.song_winner_id in comb_ids
                        and r.song_loser_id in comb_ids]
        app.logger.debug('{} ratings for {}'.format(len(comb_ratings), comb_ids))
        if not comb_ratings:
            match = [a, b, c]
            break

    return match


def set_match_result(winner_song, loser_ids):
    app.logger.info('Creating ratings...')
    ratings = []
    for loser_id in [i for i in map(int, loser_ids) if i != winner_song.id]:
        loser_song = Song.query.get(loser_id)
        app.logger.info('Rating: winner {} loser {}'.format(winner_song.id, loser_song.id))
        rating = Rating(winner_song, loser_song)
        ratings.append(rating)

    if ratings:
        for rating in ratings:
            db.session.add(rating)
        db.session.commit()

    app.logger.info('{} ratings'.format(len(ratings)))
    return ratings


###############################################################################
## SONG details
###############################################################################

def setSongName(song, name):
    app.logger.info('setSongInfo')

    if not name:
        raise Exception('Song has no name given')

    # update name
    app.logger.info('Updating name for song {}'.format(song))
    if song.path_name.lower().endswith('mp3'):
        tags = ID3(song.abs_path)
        tags["TIT2"] = TIT2(encoding=3, text=u'{}'.format(name))
        tags.save(song.abs_path)
    elif song.path_name.lower().endswith('m4a'):
        tags = MP4(song.abs_path)
        raise Exception('Do song info for mp4')

    # update album
    song.name = name
    db.session.commit()
    app.logger.info('Update song in db')


def setSongTrackNumber(song, track_number):
    app.logger.info('setSongTrackNumber')

    if not track_number:
        raise Exception('Song has no track number given')

    # update track number
    app.logger.info('Updating track number {} for song {}'.format(track_number, song))
    total_tracks = song.album and song.album.total_tracks
    if song.path_name.lower().endswith('mp3'):
        tags = ID3(song.abs_path)
        tags["TRCK"] = TRCK(encoding=3, text=u'{}/{}'.format(track_number, total_tracks))
        tags.save(song.abs_path)
    elif song.path_name.lower().endswith('m4a'):
        mp4_song = MP4(song.abs_path)
        mp4_song.tags['trkn'] = (song.track_number, total_tracks)
        mp4_song.save()

    # update album
    song.track_number = track_number
    db.session.commit()
    app.logger.info('Update song in db')


def setSongArtist(song, artist_name):
    app.logger.info('setSongArtist')

    if not artist_name:
        raise Exception('Song has no artist name given')

    # update tag
    app.logger.info('Updating artist {} for song {}'.format(artist_name, song))
    if song.path_name.lower().endswith('mp3'):
        tags = ID3(song.abs_path)
        tags["TPE1"] = TPE1(encoding=3, text=u'{}'.format(artist_name))
        tags.save(song.abs_path)
    elif song.path_name.lower().endswith('m4a'):
        tags = MP4(song.abs_path)
        raise Exception('Do song info for mp4')

    # update model
    artist = Artist.query.filter_by(name=artist_name).first()
    if not artist:
        artist = Artist(artist_name)
        db.session.add(artist)
        db.session.commit()
        app.logger.info('{} <= {}'.format(artist, artist_name))
    song.artist_id = artist.id

    db.session.commit()
    app.logger.info('Update song in db')


def setSongAlbum(song, album_name):
    app.logger.info('setSongAlbum')

    if not album_name:
        raise Exception('Song has no album name given')

    # update tag
    app.logger.info('Updating album {} for song {}'.format(album_name, song))
    if song.path_name.lower().endswith('mp3'):
        tags = ID3(song.abs_path)
        tags["TALB"] = TALB(encoding=3, text=u'{}'.format(album_name))
        tags.save(song.abs_path)
    elif song.path_name.lower().endswith('m4a'):
        tags = MP4(song.abs_path)
        raise Exception('Do song info for mp4')

    # get track info
    try:
        trck = tags['TRCK'].text[0]
    except KeyError:
        trck = ''
    if '/' in trck:
        track_number, total_tracks = trck.split('/')
    else:
        track_number = trck
        total_tracks = None
    try:
        total_tracks = int(total_tracks)
    except (ValueError, TypeError):
        total_tracks = None
    disc_number = int(tags['TPOS'].text[0].split('/')[0]) if 'TPOS' in tags else 1
    total_discs = int(tags['TPOS'].text[0].split('/')[1]) if 'TPOS' in tags and '/' in tags['TPOS'].text[0] else 1
    year = int(tags['TDRC'].text[0].year) if 'TDRC' in tags else None

    # update model
    album = Album.query.filter_by(name=album_name, artist=song.artist).first()
    if not album:
        album = Album(album_name, song.artist)
        album.disc_number = disc_number
        album.total_discs = total_discs
        album.total_tracks = total_tracks
        album.year = year
        db.session.add(album)
        db.session.commit()
        app.logger.info('Created new album {} <= {}'.format(album, album_name))
    song.album_id = album.id

    album.count_songs = len(album.songs)

    db.session.commit()
    app.logger.info('Update song in db')


###############################################################################
## ALBUM details
###############################################################################

def setAlbumName(album, name):
    """update album name. If there is an existing album (with same artist), then just delete the
    current album and set the songs to that album"""
    app.logger.info('setAlbumName: {}'.format(name))
    existing_album = Album.query.filter(
        name == name,
        Album.id != album.id,
        Album.artist_id == album.artist_id
    ).first()

    if existing_album:
        app.logger.debug('Found existing album by name: {}'.format(existing_album))
        for song in album.songs:
            song.album_id = existing_album.id
        db.session.delete(album)
        app.logger.debug('Album deleted and songs set to existing album by that name')
        db.session.commit()
        return existing_album
    else:
        app.logger.debug('Album name changed')
        album.name = name
        db.session.commit()
        return album


def setAlbumSize(album, total_tracks):
    app.logger.info('setAlbumSize')

    total_tracks = int(total_tracks)

    # update tag
    for song in album.songs:
        app.logger.info('Updating total tracks for song {}'.format(song))
        if song.path_name.lower().endswith('mp3'):
            tags = ID3(song.abs_path)
            tags["TRCK"] = TRCK(encoding=3, text=u'{}/{}'.format(song.track_number, total_tracks))
            tags.save(song.abs_path)
        elif song.path_name.lower().endswith('m4a'):
            mp4_song = MP4(song.abs_path)
            mp4_song.tags['trkn'] = [(song.track_number, total_tracks)]
            mp4_song.save()

    # update album
    album.total_tracks = int(total_tracks)
    album.count_songs = len(album.songs)
    db.session.commit()
    app.logger.info('Update album')

    return album


def setAlbumArtist(album, artist_name):
    app.logger.info('setAlbumArtist')

    if not artist_name:
        raise Exception('Album has no artist name given')

    # update model
    artist = Artist.query.filter_by(name=artist_name).first()
    if not artist:
        artist = Artist(artist_name)
        db.session.add(artist)
        db.session.commit()
        app.logger.info('{} <= {}'.format(artist, artist_name))
    album.artist_id = artist.id

    # update tag
    app.logger.info('Updating artist {} for album {}'.format(artist_name, album))
    for song in album.songs:
        if song.path_name.lower().endswith('mp3'):
            tags = ID3(song.abs_path)
            tags["TPE1"] = TPE1(encoding=3, text=u'{}'.format(artist_name))
            tags.save(song.abs_path)
        elif song.path_name.lower().endswith('m4a'):
            tags = MP4(song.abs_path)
            raise Exception('Do song info for mp4')

    db.session.commit()
    app.logger.info('Update album with artist in db')


###############################################################################
## ARTIST details
###############################################################################

def setArtistName(artist, name):
    app.logger.info('New artist name: {}'.format(name))

    # update song artist title
    for song in artist.songs:
        app.logger.info('Updating artist for song {}'.format(song))
        if song.path_name.lower().endswith('mp3'):
            tags = ID3(song.abs_path)
            tags["TPE1"] = TPE1(encoding=3, text=u'{}'.format(name))
            tags.save(song.abs_path)
        elif song.path_name.lower().endswith('m4a'):
            tags = MP4(song.abs_path)
            raise Exception('Do total tracks for mp4')

    # see if new name does not already exists
    artist_by_name = Artist.query.filter(
        Artist.name == name,
        Artist.id != artist.id
    ).first()

    if artist_by_name:
        app.logger.info('Artist already exists with name {}'.format(name))
        for song in artist.songs:
            song = Song.query.get(song.id)

            # update album
            if song.album.artist.id != artist_by_name.id:
                album = song.album
                album.artist = artist_by_name
                db.session.commit()

            # update song
            song.artist = artist_by_name
        db.session.commit()
        return artist_by_name

    else:
        # update artist
        artist.name = name
        app.logger.info('Artist name updated')
        db.session.commit()
        return artist



