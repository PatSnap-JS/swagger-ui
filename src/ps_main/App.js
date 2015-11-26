
var React = require('react');
var ReactPropTypes = React.PropTypes;

var Header = require('./Header');
var SwaggerSection = require('./SwaggerSection');
var PortTable = require('./PortTable');


var App = React.createClass({
	mixins:[],
	getInitialState:function(){
		return {
			files:[],
			dropdownOpen:true
		}
	},
	updateSwaggers: function(files) {
		this.setState({
			files:files
		});
	},
	toggleDropdown:function(){
		this.setState({
			dropdownOpen:!this.state.dropdownOpen
		})
	},
	render: function() {
		var comp = this;
		var state= this.state;
		var files = comp.state.files;
		return (
				<div>
					<Header onToggleUsage={this.toggleDropdown} onClickView={this.updateSwaggers}/>
					{state.dropdownOpen ? <PortTable/> :[]}
					{
							files.map((file)=>(<SwaggerSection key={file.id} file={file}/>))
					}

				</div>
		);
	}

});

module.exports = App;

