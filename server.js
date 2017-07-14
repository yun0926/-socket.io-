var http = require('http');  //内置的http模块提供了HTTP服务器和客户端功能
var fs = require('fs');
var path = require('path');

var mime = require('mime');  //附加的mime模块有根据文件扩展名的出MIME类型的能力

var cache = {};  //用来缓存文件内容的对象

//所请求的文件不存在时发送404错误
function send404(response){
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('Error 404:resource not found,');
    response.end();
}

//提供文件数据服务
function sendFile(response,filePath,fileContents){
    response.writeHead(
        200,
        {"content-type":mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

// 提供静态文件服务
function serverStatic(response,cache,absPath){
    if(cache[absPath]){                             //检查文件是否缓存在内存中
        sendFile(response,absPath,cache[absPath]);  //从内存中返回文件
    }else{
        fs.exists(absPath,function(exists){       //检查文件是否存在
            if(exists){
                fs.readFile(absPath,function(err,data){  //从内存中读取文件
                    if(err){
                        send404(response);
                    }else{
                        cache[absPath] = data;
                        sendFile(response,absPath,data);  //从内存中读取文件并返回
                    }
                })
            }else{
                send404(response)  //发送http404响应
            }
        });
    }
}

//创建http服务器的逻辑
var server = http.createServer(function(request,response){  //创建http服务器，用匿名函数定义对每个请求的处理行为
    var filePath = false;
    if(request.url == '/'){
        filePath = 'public/index.html';   //确认返回的默认html文件
    }else{
        filePath = 'public' + request.url;  //将url路径转为文件的相对路径
    }
    var absPath = './' + filePath;
    serverStatic(response,cache,absPath);  //返回静态文件
})

//启动服务器，监听TCP/IP端口3000
server.listen(3000,function(){
    console.log("Server listening on port 3000.");
})

var chatServer = require('./lib/chat_server');
chatServer.listen(server);