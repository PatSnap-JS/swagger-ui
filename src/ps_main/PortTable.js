var React = require('react');
var gitHttpConf = require('./gitHttpConf');
var axios = require('axios');
var path = require('path');



var PortTable = React.createClass({

	getInitialState:()=>({
		usage:{}
	}),
	getUsage:function(){
		var comp = this;
		return axios({url:'/port_usage.json'})
			.then((resp)=>resp.data)
			.then(function(d){
				comp.setState({
					usage:d
				});
			})
	},
	componentWillMount:function(){
		this.getUsage()
	},
	render: function() {
		var comp = this;
		var usage = this.state.usage;

		return (
				<div className="port-usage">
				<table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
					<thead>
					<tr>
						<th className="mdl-data-table__cell--non-numeric">Port</th>
						<th>Doc File</th>
					</tr>
					</thead>
					<tbody>
					{
							Object.keys(usage).map(function(portNum,idx){
								return <tr key={portNum}>
									<td>{portNum}</td>
									<td className="mdl-data-table__cell--non-numeric">{usage[portNum]}</td>
								</tr>
							})
					}
					</tbody>
				</table>
					</div>
		);
	}

});

module.exports = PortTable;