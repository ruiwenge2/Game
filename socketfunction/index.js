const Filter = require("bad-words");
var filter = new Filter();

const Room = require("../room");
const { random, getUser, getRoomOfUser, checkUsername, userInRooms } = require("../game/functions");

const socketfunc = socket => {
  socket.on("check", (user, room, weapon, width, height) => {
    if(!(room in users)){
      users[room] = new Room(room);
      users[room].generateRocks();
      users[room].generateGold();
    }
    if(!user){
      socket.emit("error", "Please enter a username.");
      return socket.disconnect();
    }
    if(!(weapon in weapon_limits)){
      socket.emit("error", "Invalid weapon.");
      return socket.disconnect();
    }
    if(users[room].players.length >= max){
      socket.emit("error", "There are already 6 users in this room, so please join another.");
      return socket.disconnect();
    }
    for(let i of user){
      if(!allchars.includes(i)){
        socket.emit("error", "Username can only contain alphanumeric characters and underscores.");
        return socket.disconnect();
      }
    }
    if(user.length > max_user_length){
      socket.emit("error", "Your username cannot be longer than 15 characters.");
      return socket.disconnect();
    }
    socket.join(room);
    let id = socket.id;
    users[room].addPlayer(id, user, weapon);
    socket.emit("error", false);
    socket.broadcast.to(room).emit("joined", user);
    console.log(`${user} joined the room ${room}`)
    if(users[room].players.length >= 6){
      io.emit("removeroom", room);
    } else if(users[room].players.length == 1){
      io.emit("newroom", room);
    }
  });

  socket.on("move", (direction, room) => {
    try {
      users[room].move(direction, socket.id);
    } catch(e){
      console.log(e);
    }
  });

  socket.on("releasekey", room => {
    try {
      users[room].release(socket.id);
    } catch(e){
      console.log(e);
    }
  });

  socket.on("useweapon", angle => {
    try {
      users[getRoomOfUser(socket.id)].useWeapon(socket.id, angle);
    } catch(e){
      console.log(e);
    }
  });

  socket.on("lost", () => {
    socket.disconnect();
  });

  socket.on("chat message", message => {
    let id = socket.id;
    let room = getRoomOfUser(id);
    let user = users[room].players[getUser(room, id)].name;
    io.to(room).emit("chat message", user, filter.clean(message));
  });

  socket.on("disconnect", () => {
    if(!userInRooms(socket.id)) return;
    let room = getRoomOfUser(socket.id);
    users[room].removePlayer(socket.id);
    if(users[room].players.length == 0){
      io.emit("removeroom", room);
    } else if(users[room].players.length == 5){
      io.emit("newroom", room);
    }
  });
}

module.exports = socketfunc;