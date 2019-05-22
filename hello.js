/*const circle = require('./squre.js');
const  sqruer = new circle(2);
console.log(`mySquare 的面积是 ${sqruer.area()}`);*/

/*const myEmitter = require('./circle.js')
myEmitter.emit('event','a');*/

/*// 准备module对象:  moudle.exports 过程
var module = {
  id: 'hello',
  exports: {}
};
var load = function (module) {
  // 读取的hello.js代码:
  function greet(name) {
    console.log('Hello, ' + name + '!');
  }

  module.exports = greet;
  // hello.js代码结束
  return module.exports;
};
var exported = load(module);
// 保存module:
save(module, exported);*/
var
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');

// 从命令行参数获取root目录，默认是当前目录:
var root = path.resolve(process.argv[2] || '.');

console.log('Static root dir: ' + root);

// 创建服务器:
var server = http.createServer(function (request, response) {
    // 获得URL的path，类似 '/css/bootstrap.css':
    var pathname = url.parse(request.url).pathname +`test3.js`;
    // 获得对应的本地文件路径，类似 '/srv/www/css/bootstrap.css':
    console.log(pathname)
    var filepath = path.join(root, pathname);
    // 获取文件状态:
    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            // 没有出错并且文件存在:
            console.log('200 ' + request.url);
            // 发送200响应:
            response.writeHead(200);
            // 将文件流导向response:
            fs.createReadStream(filepath).pipe(response);
        } else {
            // 出错了或者文件不存在:
            console.log('404 ' + request.url);
            // 发送404响应:
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
});
// 让服务器监听8080端口:
server.listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');
