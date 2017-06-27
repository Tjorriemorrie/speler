import React from 'react'
import {findDOMNode} from 'react-dom'


export default class Factoid extends React.Component {

    constructor(props) {
        console.info('[Factoid] constructor')
        super(props)
        this.state = {
            'show': false,
            'section': null,
            'data': {},
            'form': {},
        }
    }

    componentDidMount() {
        console.info('[Factoid] componentDidMount')
        this.loadFact()
    }

    render() {
        console.info('[Factoid] render', this.state)

        if (!this.state.show) {
            return null
        }

        return this['render_' + this.state.section]()
    }

    loadFact() {
        console.info('[Factoid] loadFact')

        fetch('/factoid')
            .then(r => r.json())
            .then(r => {
                if (!r.hasOwnProperty('section') || !r.hasOwnProperty('data')) {
                    return this.setState(Object.assign({}, {
                        'section': 'error',
                        'data': 'no section provided',
                        'show': true
                    }))
                }

                if (typeof this['render_' + r.section] !== 'function') {
                    return this.setState(Object.assign({}, {
                        'section': 'error',
                        'data': 'render_' + r.section + ' not implemented',
                        'show': true
                    }))
                }

                return this.setState(Object.assign({
                    'show': true,
                    'form': {},
                }, r))
            })
    }
    
    render_error() {
        return <div className="alert alert-danger">{this.state.data}</div>
    }

    render_success() {
        setTimeout(() => this.setState({'show': false}), 1E4)
        const msg = this.state.data
        console.info('[Factoid] render_success', msg)
        return <div className="alert alert-info">{msg}</div>
    }

    render_id3_parsed() {
        setTimeout(() => this.loadFact(), 6E4)
        console.info('[Factoid] render_id3_parsed', this.state.data)
        let msg = 'You have ' + this.state.data + ' unparsed songs'
        return <div className="alert alert-info">{msg}</div>
    }

    render_is_songs_named() {
        const song = this.state.data
        console.info('[Factoid] render_is_songs_named', song)
        return <form ref="formSong" className="form" onSubmit={e => this.submitSong(e, song.id)}>
            <dl>
                <dt>What is the name of this song?</dt>
                <dd><span>{song.path_name}</span></dd>
                <dd>
                    <small className="text-muted">{song.web_path}</small>
                </dd>
            </dl>
            <p><label>Song name:</label></p>
            <input type="text" name="name" className="form-control input-sm" required autoFocus autoComplete="off"
                onChange={e => this.setState({'form': {'name': e.target.value}})} />
            <button type="submit" className="btn btn-default btn-sm">Submit</button>
        </form>
    }

    render_is_songs_tracked() {
        const song = this.state.data
        console.info('[Factoid] render_is_songs_tracked', song)
        return <form className="form" onSubmit={e => this.submitSong(e, song.id)}>
            <dl>
                <dt>What is the track of this song?</dt>
                <dd><span>{song.path_name}</span></dd>
                <dd><small className="text-muted">{song.web_path}</small></dd>
            </dl>
            <p><label>Number of tracks:</label></p>
            <input type="number" name="song_track_number" className="form-control input-sm" required autoFocus autoComplete="off"
                onChange={e => this.setState({'form': {'song_track_number': e.target.value}})} />
            <button type="submit" className="btn btn-default btn-sm">Submit</button>
        </form>
    }

    render_is_songs_artist() {
        const song = this.state.data
        console.info('[Factoid] render_is_songs_artist', song)
        return <form className="form" onSubmit={e => this.submitSong(e, song.id)}>
            <dl>
                <dt>Who is the artist of this song?</dt>
                <dd>{song.name}</dd>
                <dd><small className="text-muted">{song.web_path}</small></dd>
            </dl>
            <p><label>Artist name:</label></p>
            <input type="text" className="form-control input-sm" name="artist.name" required autoFocus autoComplete="off"
                onChange={e => this.setState({'form': {'artist.name': e.target.value}})} />
            <button type="submit" className="btn btn-default btn-sm">Submit</button>
        </form>
    }

    render_is_songs_album() {
        const song = this.state.data
        console.info('[Factoid] render_is_songs_album', song)
        return <form className="form" onSubmit={e => this.submitSong(e, song.id)}>
            <dl>
                <dt>What is the album of this song?</dt>
                <dd>{song.name}</dd>
                <dd><small className="text-muted">{song.web_path}</small></dd>
            </dl>
            <p><label>Album name:</label></p>
            <input type="text" className="form-control input-sm" name="album.name" required autoFocus autoComplete="off"
                   onChange={e => this.setState({'form': {'album.name': e.target.value}})} />
            <button type="submit" className="btn btn-default btn-sm">Submit</button>
        </form>
    }

    render_is_albums_sized() {
        const album = this.state.data
        console.info('[Factoid] is_albums_sized', album)
        return <form className="form" onSubmit={e => this.submitAlbum(e, album.id)}>
            <dl>
                <dt>How many tracks does this album have?</dt>
                <dd><span>{album.name}</span></dd>
                <dd>~ {album.artist.name}</dd>
            </dl>
            <p><label>Number of tracks on album:</label></p>
            <input type="number" name="total_tracks" className="form-control input-sm" required autoFocus autoComplete="off"
                   onChange={e => this.setState({'form': {'total_tracks': e.target.value}})} />
            <button type="submit" className="btn btn-default btn-sm">Submit</button>
        </form>
    }

    render_is_albums_artist() {
        const album = this.state.data
        console.info('[Factoid] render_is_albums_artist', album)
        return <form className="form" onSubmit={e => this.submitAlbum(e, album.id)}>
            <dl>
                <dt>What is the artist of this album?</dt>
                <dd>{album.name}</dd>
                <dd><small className="text-muted">{album.web_path}</small></dd>
            </dl>
            <p><label>Artist name:</label></p>
            <input type="text" className="form-control input-sm" name="artist.name" required autoFocus autoComplete="off"
                   onChange={e => this.setState({'form': {'artist.name': e.target.value}})} />
            <button type="submit" className="btn btn-default btn-sm">Submit</button>
        </form>
    }

    render_is_albums_complete() {
        const {album, songs} = this.state.data
        console.info('[Factoid] is_albums_complete', album)
        return <form className="form" onSubmit={e => this.submitAlbum(e, album.id)}>
            <h4>This album has missing tracks!</h4>
            <dl>
                <dt>The albums has currently <strong>{songs.length}</strong> tracks but
                    expected <strong>{album.total_tracks}</strong>.</dt>
                <dd><span>{album.name}</span></dd>
                <dd>~ {album.artist.name}</dd>
            </dl>
            <p><label>Number of tracks on album:</label></p>
            <input type="number" className="form-control input-sm" id="album_size" name="total_tracks" required autoFocus
                   onChange={e => this.setState({'form': {'total_tracks': e.target.value}})} />
            <button type="submit" className="btn btn-default btn-sm">Submit</button>
            <hr/>
            <dl>
                <dt>{songs.length} songs that belong to the album:</dt>
                {songs.map(song => <dd>{song.web_path}</dd>)}
            </dl>
        </form>
    }

    render_is_albums_bad() {
        const {album} = this.state.data
        console.info('[Factoid] is_albums_bad', album)
        return <div>
            <h4>This album is bad, you're never going to listen to it</h4>
            <dl>
                <dt>{album.artist.name}</dt>
                <dt>{album.name}</dt>
                {(album.songs.map(song => {
                    <dd>{song.name}</dd>
                }))}
            </dl>
        </div>
    }

    submitSong(e, song_id) {
        console.info('[Factoid] submitSong')
        e.preventDefault()
        const form = Object.assign({'id': song_id}, this.state.form)
        console.info('[Factoid] submitSong form', form)
        this.sendFactoid(form, '/factoid/songs')
    }

    submitAlbum(e, album_id) {
        console.info('[Factoid] submitAlbum')
        e.preventDefault()
        const form = Object.assign({'id': album_id}, this.state.form)
        console.info('[Factoid] submitAlbum form', form)
        this.sendFactoid(form, '/factoid/albums')
    }

    sendFactoid(form, url) {
        console.info('[Factoid] sendFactoid')

        // remove factoid during submit
        this.setState({'show': false})

        // submit form
        fetch(url, {
            'method': 'POST',
            'headers': new Headers({'Content-Type': 'application/json'}),
            'body': JSON.stringify(form),
        })
            .then(r => {
                console.info('[Factoid] sendFactoid res', r.json())
                this.loadFact()
            })
            .catch(e => {
                console.error('[Factoid] sendFactoid: error', e.message)
                alert('Error sendFactoid')
            })
    }

}
