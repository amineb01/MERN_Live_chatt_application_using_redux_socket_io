const socketIO = require('socket.io')
const { Message } = require('./models/Message')

module.exports = function( server, ConnectedUsers) {

  const io = socketIO( server );
  io.on('connection', ( client ) => {
    client.on('subscribeToChanel', ( user ) => {
      updateConnectedUsers( client, user )
      setTimeout(() => {
        if ( ConnectedUsers.length>0 ) client.emit("newConnection", ConnectedUsers);
      }, 100);
    });

    client.on('event1', async ( data ) => {
      if ( ConnectedUsers.length>0 ){
        let sender   =ConnectedUsers.find((element) => {  return element.email=== data.sender})
        let receiver =ConnectedUsers.find((element) => {  return element.email=== data.receiver})
        if (receiver && sender) {
          const msg = { receiver: receiver.userId, sender: sender.userId, msg: data.msg }
          let savedMsg = await saveMessages( msg )
          if (io.sockets.sockets[sender.socketID]) io.sockets.sockets[sender.socketID].emit("event1", msg );
          if (io.sockets.sockets[receiver.socketID]) io.sockets.sockets[receiver.socketID].emit("event1", msg );
        }
      }
    });
    client.on("disconnect", () => client.emit("newConnection", ConnectedUsers));
  });

  function updateConnectedUsers( client, user ){
    if ( user.userId ){
      let findUser = ConnectedUsers.find((element) => {  return element.userId === user.userId })
      if ( !findUser ) ConnectedUsers.push({socketID:client.id, userId:user.userId, email:user.email})
      else findUser.socketID = client.id
    }
  }

  async function saveMessages( data ){
    var message = new Message({
      sender: data.sender,
      receiver: data.receiver,
      msg: data.msg,
    });

   return await message.save();
  }

}
