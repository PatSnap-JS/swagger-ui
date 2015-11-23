var React = require('react');
var gitHttpConf = require('./gitHttpConf');
var axios = require('axios');
var path = require('path');

function getFormData(form){
	var unindexed_array = $(form).serializeArray();
	var indexed_array = {};

	unindexed_array.map(function(n, i){
		indexed_array[n['name']] = n['value'];
	});

	return indexed_array;
}

var projectNameMap = new Map();

var Header = React.createClass({

	getDefaultProps:function(){
		return {
			onClickView:_.noop()
		}
	},
	getInitialState:()=>({
		projects:[],
		branches:[]
	}),
	getProject:function(){
		var comp = this;
		return axios(Object.assign({},gitHttpConf,{
			url:`${gitHttpConf.api}/groups/100`
		})).then((data)=>data.data.projects)
		.then(function(projects){
			projects.forEach(function(o){
				projectNameMap.set(String(o.id),o.name);
			});

			comp.setState({projects:projects})
		})
	},
	projectChanged:function(evt){
		var comp = this;
		var projectId = evt.target.value;
		if(projectId){
			comp.setState({branches:[]});
			return axios(Object.assign({},gitHttpConf,{
				url:`${gitHttpConf.api}/projects/${projectId}/repository/branches`
			}))
					.then((data)=>data.data)
					.then(function(data){
						comp.setState({branches:data})
					})
		}
	},
	fetchFiles:function(evt){
		var comp = this;
		evt.preventDefault();
		var formData = getFormData(evt.target);

		axios(Object.assign({},gitHttpConf,{
			url:`${gitHttpConf.api}/projects/${formData.projectId}/repository/tree`,
			params:{ref_name:formData.branch}
		}))
				.then((data)=>data.data)
				.then(function(files){
					var fileData = files.filter(function(fileObj){
						var ext = path.extname(fileObj.name);
						return ext == '.json' || ext == '.ymal';
					}).map(function(fileObj){
						return {
							id:fileObj.id,
							name:fileObj.name,
							url:`${gitHttpConf.host}/swagger-doc/${projectNameMap.get(formData.projectId)}/raw/${formData.branch}/${fileObj.name}`
						};
					});
					return fileData;
				})
		.then(function(files){
			comp.props.onClickView(files);
		})
	},
	componentWillMount:function(){
		this.getProject();
	},
	render: function() {
		var comp = this;
		var state = this.state;

		return (
				<header id="header">
				<div className="swagger-ui-wrap">
					<a id="logo" href="http://swagger.io">swagger</a>
					<form onSubmit={comp.fetchFiles} id='api_selector'>
						<div className='input'>
							<select name="projectId" onChange={comp.projectChanged}>
								<option value={null}>Select Project</option>
								{state.projects.map(o => (<option key={o.id} value={o.id}>{o.name}</option>) )}
							</select>
						</div>
						<div className='input'>
							<select name="branch" onChange={comp.branchChanged}>
								<option value={null}>Select Branch</option>
								{state.branches.map(o => (<option key={o.name} value={o.name}>{`#${o.name}`}</option>) )}

							</select>
						</div>
						<div className='input'>
							<button className="btn-view">View</button>
						</div>
					</form>
				</div>
				</header>
		);
	}

});

module.exports = Header;