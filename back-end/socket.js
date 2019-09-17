const socketIO = require('socket.io')


module.exports = function( server, ConnectedUsers) {

  const io = socketIO( server );
  io.on('connection', ( client ) => {
    client.on('subscribeToChanel', ( user ) => {
      updateConnectedUsers( client, user )
      setTimeout(() => {
        if ( ConnectedUsers.length>0 ) client.emit("newConnection", ConnectedUsers);
      }, 100);
    });

    client.on('event1', data => {
      if ( ConnectedUsers.length>0 ){

        let sender   =ConnectedUsers.find((element) => {  return element.email=== data.sender})
        let receiver =ConnectedUsers.find((element) => {  return element.email=== data.receiver})
        if (receiver && sender) {
          console.log(ConnectedUsers)
          console.log("receiver",io.sockets.sockets[sender.socketID].id)
          console.log("sender",io.sockets.sockets[receiver.socketID].id)
          if (io.sockets.sockets[sender.socketID]) io.sockets.sockets[sender.socketID].emit("event1", { receiver: data.receiver, sender: data.sender, msg: data.msg });
          if (io.sockets.sockets[receiver.socketID]) io.sockets.sockets[receiver.socketID].emit("event1", { receiver: data.receiver, sender: data.sender, msg: data.msg });
        }
      }
    });
    client.on("disconnect", () => console.log("Client disconnected"));
  });

  function updateConnectedUsers( client, user ){
    if ( user.userId ){
      let findUser = ConnectedUsers.find((element) => {  return element.userId === user.userId })
      if ( !findUser ) ConnectedUsers.push({socketID:client.id, userId:user.userId, email:user.email})
      else findUser.socketID = client.id
    }
  }


}
