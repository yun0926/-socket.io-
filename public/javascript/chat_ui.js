//防止XSS攻击
function divEscapedContentElement(message){
    return $('<div></div>').text(message);
}

function divSystemContentElement(message){
    return $('<div></div>').html('<i>'+ message +'</i>')
}

//处理原始的用户输入
function processUserInput(chatApp,socket){
    var message = $('#send-message').val();
    var systemMessage;
    if(message.charAt(0) == '/'){       //如果用户输入的内容以斜杠（／）开头，将其作为聊天命令
        systemMessage = chatApp.processCommand(message);
        if(systemMessage){
            $('#messages').append(divSystemContentElement(systemMessage));
        }
       
    }else{
        chatApp.sendMessage($("#room").text(),message);  //将非命令输入广播给其他用户
        $("#messages").append(divEscapedContentElement(message));
        $("#messages").scrollTop($("#message").prop("scrollHeight"));
    }
     $("#send-message").val('');
}