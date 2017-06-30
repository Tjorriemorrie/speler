import _ from "lodash";
import React from "react";
import {freezer} from "./Freezer.jsx";
import History from "./History.jsx";
import Match from "./Match.jsx";
import SongDetails from "./SongDetails.jsx";


export default class Player extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            'current_song': null,
        }
    }

    componentDidMount() {
        this.audio_el = this.refs.audio_el

        this.audio_el.volume = 0.50
        console.info('[Player] audio_tag volume set to 50%')

        this.audio_el.addEventListener('ended', () => freezer.emit('current_song:ended'))
        console.info('[Player] audio_tag event listener added for ended')

        freezer.on('current_song:changed', song => this.setState({'current_song': song}))
        freezer.emit('current_song:load')
    }

    componentDidUpdate() {
        if (this.state.current_song) {
            document.title = this.state.current_song.name + ' ~ ' + this.state.current_song.artist.name
            this.audio_el.play()
            console.info('[Player] playing song')
        } else {
            document.title = 'speler'
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-11">
                    {this.renderAudio()}
                    {this.renderCurrentSong()}
                    <Match />
                    <History />
                </div>
            </div>
        )
    }

    renderAudio() {
        const {current_song, ...rest} = this.state
        const src = _.get(current_song, 'web_path', '')
        console.info('[Player] render audio', src)
        return <div>
            <audio ref="audio_el" src={src} controls />
            <a onClick={() => freezer.emit('current_song:ended')} href="#" className="audio_next">&rArr;</a>
        </div>
    }

    renderCurrentSong() {
        const {current_song, ...rest} = this.state
        if (!current_song) {
            return
        }
        console.info('[Player] render current song')
        return <div className="current_song">

            <strong>
                <small className="text-muted">{current_song.track_number} </small>
                <span title={current_song.id}> {current_song.name}</span>
                {(!current_song.played) ? <span className="new">New</span> : ''}
            </strong>
            <br/><small>
                <span>{(current_song.artist) ? current_song.artist.name : 'no artist'}</span>
                <br/><em><small className="text-muted">{(current_song.album) ? current_song.album.year : ''}</small> {(current_song.album) ? current_song.album.name : 'no album'}</em>
            </small>
        </div>
    }
}
