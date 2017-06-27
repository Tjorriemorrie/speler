import Freezer from 'freezer-js'


export let freezer = new Freezer({
    'current_song': null,
    'histories': [],
    'matches': [],
})


function f() {
    return fetch(...arguments)
        .catch(r => {
            alert(r)
            throw new Error(r)
        })
        .then(r => {
            if (r.ok) {
                return r
            }
            console.dir(r)
            alert(r)
            throw new Error(r)
        })
        .then(r => r.json())
}


freezer.on('current_song:load', () => {
    f('/song/load').then(r => {
        freezer.get().set({'current_song': r})
        freezer.emit('current_song:changed', r)
    })
})


freezer.on('current_song:ended', () => {
    let fd = new FormData()
    fd.append('id', freezer.get().current_song.id)

    freezer.get().set({'current_song': null})
    freezer.emit('current_song:changed', null)

    f('/song/ended', {
        method: 'POST',
        body: fd
    }).then(r => {
        freezer.emit('histories:load')
        freezer.emit('current_song:load')
        freezer.emit('match:load')
        return r
    })
})


freezer.on('histories:load', () => {
    f('/histories/load').then(r => {
        freezer.get().set({'histories': r})
        freezer.emit('histories:changed', r)
    })
})


freezer.on('match:load', () => {
    f('/match/load')
        .then(r => {
            freezer.get().set({'match': r})
            freezer.emit('match:changed', r)
            freezer.emit('ping')
        })
})


freezer.on('match:set', winner => {
    let fd = new FormData()
    fd.append('winner', winner.id)
    freezer.get().match.forEach(loser => {
        if (loser.id != winner.id) {
            fd.append('losers[]', loser.id)
        }
    })

    freezer.get().set({'match': null})
    freezer.emit('match:changed', null)

    f('/match/set', {
        method: 'POST',
        body: fd
    }).then(r => freezer.emit('match:load'))
})


freezer.on('ping', () => {
    let audio_ping = new Audio('/static/sounds/ping.mp3')
    audio_ping.play()
})
