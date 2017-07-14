var Chat = function(socket){
    this.socket = socket;
}

//发送聊天消息
Chat.prototype.sendMessage = function(room,text){
    var message = {
        room:room,
        text:text
    }
    this.socket.emit('message',message);
}

//变更房间
Chat.prototype.changeRoom = function(room){
    this,socket.emit('join',{
        newRoom:room
    })
}

//处理聊天命令
Chat.prototype.processCommand = function(command){
    var words = command.split(' ');
    var commandNew = words[0].substring(1,5);//从第一个单词开始解析命令
    var word = command.split('[');
    var name = word[1].substring(0,word[1].length-1)
    console.log(name)
    var message = false;


    switch(commandNew){
        case 'join':
            words.shift();
            var room = words.joins(' ');
            this.changeRoom(room);          //处理房间的变换／创建
            break;
        case 'nick':
            words.shift();
            this.socket.emit('nameAttempt',name);  //处理更名尝试
            break;
        default:
            message = 'Unrecognized command';   //如果命令无法识别，返回错误消息
            break;
    }
    return message;
}

