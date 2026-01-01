// 以下是使用Node.js进行GET和POST请求API接口的示例代码：

const https = require('https');
const querystring = require('querystring');

// 定义请求选项
const options = {
  hostname: 'api.wuyinkeji.com',
  path: '/api/img/nanoBanana-pro',
  method: 'GET'
};

// 发送GET请求
https.get(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
}).on('error', error => {
  console.error(error);
});

// 发送POST请求
const postData = querystring.stringify({
  'key1': 'value1',
  'key2': 'value2'
});

const postOptions = {
  hostname: 'api.wuyinkeji.com',
  path: '/api/img/nanoBanana-pro',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const postReq = https.request(postOptions, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

postReq.on('error', error => {
  console.error(error);
});

postReq.write(postData);
postReq.end();
/*
这个示例代码使用Node.js内置的`https`模块进行HTTP请求。

首先定义了一个GET请求的选项，然后使用`https.get()`方法发送了GET请求。在响应流上注册回调函数，以便在收到响应数据时将其输出到控制台。在出现错误时，也注册了错误处理程序。

类似地，我们也定义了一个POST请求选项，并使用`https.request()`方法发送它。需要在请求头中包含适当的`Content-Type`和`Content-Length`以确保服务器可以正确解析请求体。请求体由`write()`方法写入，并在请求结束时通过调用`end()`方法通知请求对象已经完成。

注意，此示例默认使用`querystring`模块将数据作为x-www-form-urlencoded格式进行编码。如果需要使用其他格式（如JSON），则需要相应地更改请求头和请求体的编码方式。

另外，为了确保HTTPS请求的安全性，您也可以添加其他选项，例如验证服务器证书、设置代理等。
*/




