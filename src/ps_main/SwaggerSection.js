
var React = require('react');
var _ = require('lodash');

var SwaggerSection = React.createClass({
	propTypes:{
		spec:React.PropTypes.object
	},
	updateView:function(){
		var spec = this.props.spec;
		if(spec) {
			this.swaggerUi = new SwaggerUi({
				url: 'http://127.0.0.1/v2/swagger.json',
				spec: spec,
				dom_id: this.containerId
			});
			this.swaggerUi.load();
		}
	},
	componentDidMount:function(){
		this.updateView();
	},
	componentWillReceiveProps:function(){
		this.updateView();
	},
	containerId : 'swagger-ui-container',
	render: function() {
		this.containerId = _.uniqueId('swagger-ui-container-');
		return (
			<div id={this.containerId} className="swagger-ui-wrap">

			</div>
		);
	}

});

module.exports = SwaggerSection;
