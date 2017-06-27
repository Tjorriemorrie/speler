import React from 'react'


export default class Scanner extends React.Component {

    constructor(props) {
        console.info('[Scanner] constructor')
        super(props)
        this.state = {
            'isScanning': false
        }
    }

    render() {
        console.info('[Scanner] render')

        return <button className="btn btn-default btn-sm pull-right" onClick={() => this.scanDirectory()}>{this.state.isScanning ? 'Scanning...' : 'Refresh'}</button>
    }

    scanDirectory() {
        console.info('[Scanner] scandir')
        if (this.state.isScanning) {
            alert('Scanning in progress')
        } else {
            this.setState({'isScanning': true})
            $.getJSON('/scan/dir')
                .done(function () {
                    console.info('[Scanner] scanDirectory: done')
                    this.scanId3s()
                }.bind(this))
        }
    }

    scanId3s() {
        console.info('[Scanner] scanId3s')
        $.getJSON('/scan/id3')
            .done(function (data) {
                console.info('[Scanner] scanId3s: done')
                if (data['parsed'] >= 50) {
                    this.scanId3s()
                } else {
                    this.setState({'isScanning': false})
                }
            }.bind(this))
    }
}
