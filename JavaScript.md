//jQuery-Ajax
$.ajax({
	url: 'https://api.wuyinkeji.com/api/img/nanoBanana-pro',
	data: {
	//接口参数，一行一个，可按照接口文档-请求参数 的参数填写，或者直接复制开发工具下面的测试代码。
		key: 'tLdPCRBfuA4nK1Exu9h9lNh2a6',
		参数名: '参数值',

	},
	type: 'GET', //请求协议（GET或POST），一般默认GET，部分接口需要POST请求，根据实际情况修改为POST即可。
	dataType: 'json',
	success: function(data) {
		console.log(data); //请求成功，输出结果到控制台
	},
	timeout: 3000, //超时时间
	error: function(data) {
		console.log('请求失败'); //失败处理
	}
});


