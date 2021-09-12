const Room = require("./room");
const { random, getUser, getRoomOfUser, checkUsername, userInRooms } = require("../functions");

const socketfunc = socket => {
  socket.on("check", (user, room, width, height) => {
    if(!(room in users)){
      users[room] = new Room(room);
    }
    if(users[room].players.length >= max){
      socket.emit("error", "There are already 6 users in this room, so please join another.");
      console.log("error");
      return;
    }
    if(!true){
      socket.emit("error", "Your username has been taken in this room.");
    } else {
      socket.join(room);
      let id = socket.id;
      users[room].addPlayer(id, user, width, height);
      console.log(users[room].players[getUser(room, id)]);
      socket.emit("error", false);
      socket.broadcast.to(room).emit("joined", user);
      console.log(users);
    }
    console.log(users[room]);
  });

  socket.on("move", (direction, room) => {
    users[room].move(direction, socket.id);
  });

  socket.on("disconnect", () => {
    if(!userInRooms(socket.id)) return;
    console.log("left");
    users[getRoomOfUser(socket.id)].removePlayer(socket.id);
    console.log(users);
  });
}

module.exports = socketfunc;