
var React = require('react');
var _ = require('lodash');

var SwaggerSection = React.createClass({
	propTypes:{
		file:React.PropTypes.object
	},
	updateView:function(){
		var file = this.props.file;
		if(file) {
			this.swaggerUi = new SwaggerUi({
				url: file.url,
				dom_id: this.getContainerId(file)
			});
			this.swaggerUi.load();
		}
	},
	componentDidMount:function(){
		this.updateView();
	},
	componentWillReceiveProps:function(nextProp){
		if(nextProp.file.id != this.props.file.id){
			this.updateView();
		}
	},
	getContainerId : function(file){
		return 'swagger-ui-container-'+file.id;
	},
	render: function() {
		var file = this.props.file;
		return (
			<div id={this.getContainerId(file)} className="swagger-ui-wrap ps-swagger-block">

			</div>
		);
	}

});

module.exports = SwaggerSection;
