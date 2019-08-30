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
  });

  function updateConnectedUsers( client, user ){
    if ( user.userId ){
      let findUser = ConnectedUsers.find((element) => {  return element.userId === user.userId })
      if ( !findUser ) ConnectedUsers.push({socketID:client.id, userId:user.userId, email:user.email})
      else findUser.socketID = user.userId
    }
  }


}
