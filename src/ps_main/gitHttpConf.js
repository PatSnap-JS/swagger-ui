

module.exports = Object.freeze({
	host:'//git.patsnap.com',
	api:'//git.patsnap.com/api/v3',

	method:'get',
	headers:{
		//'PRIVATE-TOKEN':'-QqmV1eGs7WQqCkeupDz'
		'PRIVATE-TOKEN':'xXrXcDDtFrNYHxoy1tkp'
	},
	responseType: 'json',
	transformResponse: [function (data) {
		return data;
	}]
});
