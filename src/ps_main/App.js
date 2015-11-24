
var React = require('react');
var ReactPropTypes = React.PropTypes;

var Header = require('./Header');
var SwaggerSection = require('./SwaggerSection');


var App = React.createClass({
	mixins:[],
	getInitialState:function(){
		return {
			files:[]
		}
	},
	updateSwaggers: function(files) {
		this.setState({
			files:files
		});
	},

	render: function() {
		var comp = this;
		var files = comp.state.files;
		return (
				<div>
					<Header onClickView={this.updateSwaggers}/>
					{
							files.map((file)=>(<SwaggerSection key={file.id} file={file}/>))
					}

				</div>
		);
	}

});

module.exports = App;

