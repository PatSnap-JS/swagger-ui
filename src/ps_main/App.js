
var React = require('react');
var ReactPropTypes = React.PropTypes;

var Header = require('./Header');
var SwaggerSection = require('./SwaggerSection');

var json = require('./weather.json');

var App = React.createClass({
	mixins:[],
	getInitialState:function(){
		return {}
	},
	onStoreChange: function() {

	},

	render: function() {
		return (
				<div>
					<Header/>
					<SwaggerSection spec={json}/>
					</div>
		);
	}

});

module.exports = App;

