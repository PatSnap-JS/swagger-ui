
var React = require('react');


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
				dom_id: "swagger-ui-container"
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

	render: function() {
		return (
			<div id="swagger-ui-container" className="swagger-ui-wrap">

			</div>
		);
	}

});

module.exports = SwaggerSection;
