let net = require('net');
var fs=require('fs');	
let PORT = 3001;

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
net.createServer(function(sock) {
    // 监听连接建立
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);
 	sock.on("connection",(a)=>{
 		console.log(a);
 	})
	
	// 监听Arduino发送的data	
	sock.on('data', function(data) {
		//将收到的数据打印出来 所接收数据 0已拿走 1未拿走
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
		
		//写入重量0/1
		fs.writeFile('./zhongliang.txt', data, function(err) {
			if (err) {
				throw err;
			}
			else{	
				console.log('write ok');
			}
		});
		
		//读取颜色.txt,将颜色返回至硬件(将文本文件和JS文件放置于同一Node.js文件夹下)
		//读取文本文件 7代表红色 8代表绿色 9代表黄色
		fs.readFile('./demoRead.txt','utf-8',function(err,dataT){
			if(err){
				console.error(err);
			}
			else{
				console.log(dataT + 'read ok');
				//返回7 / 8 / 9
				sock.write('=' + dataT);
			}
		});
		
	});
	
    // 监听连接关闭
    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });
}).listen(PORT);
