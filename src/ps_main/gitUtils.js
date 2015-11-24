/**
 * Created by wx on 11/24/15.
 */

var gitHttpConf = require('./gitHttpConf');
var axios = require('axios');

module.exports = {
	fetchProject:function(){
		return axios(Object.assign({},gitHttpConf,{
			url:`${gitHttpConf.api}/groups/100`
		})).then(function(data){
			return data.data.projects
		});
	}
};