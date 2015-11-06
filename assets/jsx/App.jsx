var React = require('react');
var Player = require('./Player.jsx');
var Library = require('./Library.jsx');
var Factoid = require('./Factoid.jsx');


var App = new React.createClass({

	render: function () {
		console.info('[App] render');
		return (
			<div className="row">
				<div id="play-side" className="col-sm-5">
					<Player/>
				</div>
				<div id="lib-side" className="col-sm-7">
			        <Factoid/>
			        <Library/>
				</div>
			</div>
		);
	},

});

React.render(<App/>, document.getElementById('app'));
