const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  path: '/collab',
  cors: {
    origin: true,
    methods: 'PUT, PATCH, POST, DELETE',
    allowedHeaders: 'Origin, Authorization, Content-Type, Accept',
    credentials: true,
    optionsSuccessStatus: 200
  }, 
  pingTimeout: 300000,
  pingInterval: 100000
}); 

const PORT = 8004;

httpServer.listen(PORT, () => {
  console.log(`collab-service listening on port ${PORT}.`);
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected.`);

  let matchedRoomId;

  socket.on("join", (roomId) => {
    console.log(`${socket.id} joining room ${roomId}`)
    matchedRoomId = roomId
    socket.join(matchedRoomId);
  })

  socket.on("leave", (m) => {
    console.log(`${socket.id} leaving room ${matchedRoomId}`);
    // socket.leave(matchedRoomId);
    socket.broadcast.to(matchedRoomId).emit("leave", `${socket.id} leaving room ${matchedRoomId}`);
    console.log(`Existing rooms: ${Array.from(io.sockets.adapter.rooms.keys())}.`);
  })

  socket.on("question", (question) => {
    console.log(`${socket.id} emitting question ${question.questionTitle} to ${matchedRoomId}.`);
    io.to(matchedRoomId).emit("question", question);
  })

  socket.on("change", (change) => {
    console.log(`${socket.id} emitting change ${change} to ${matchedRoomId}.`);
    socket.broadcast.to(matchedRoomId).emit("change", change);
  })

  socket.on("message", (message) => {
    console.log(`${socket.id} emitting message ${message} to ${matchedRoomId}`);
    socket.broadcast.to(matchedRoomId).emit("message", message);
  })

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected.`);
    io.to(matchedRoomId).emit("message", `User disconnected.`);
    console.log(`Existing rooms: ${Array.from(io.sockets.adapter.rooms.keys())}.`);
  })

  socket.on("request", (question) => {
    console.log(`${socket.id} requested a change of question to ${question.questionId} ${matchedRoomId}`);
    if (io.engine.clientsCount == 1) {
      io.to(matchedRoomId).emit("question", question);
    } 
    socket.broadcast.to(matchedRoomId).emit("request", question);
  })
});
