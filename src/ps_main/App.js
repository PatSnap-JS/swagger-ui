
var React = require('react');
var ReactPropTypes = React.PropTypes;

var Header = require('./Header');
var SwaggerSection = require('./SwaggerSection');

var json = require('./sw.json');

var App = React.createClass({
	mixins:[],
	getInitialState:function(){
		return {}
	},
	updateSwaggers: function(files) {

	},

	render: function() {
		return (
				<div>
					<Header onClickView={updateSwaggers}/>
					<SwaggerSection spec={json}/>
					</div>
		);
	}

});

module.exports = App;

