import React from 'react'
import ReactDOM from 'react-dom'
import Player from './Player.jsx'
import Library from './Library.jsx'
require('./../less/speler.less')


export default class App extends React.Component {

	render() {
		console.info('[App] render')
		return (
			<div className="row">
				<div id="play-side" className="col-sm-5">
					<Player/>
				</div>
				<div id="lib-side" className="col-sm-7">
                    <Library/>
				</div>
			</div>
		)
	}
                    //<Factoid/>

}

ReactDOM.render(<App/>, document.getElementById('app'))
