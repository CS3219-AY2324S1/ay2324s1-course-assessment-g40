const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io')

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: 'PUT, PATCH, POST, DELETE',
    allowedHeaders: 'Origin, Authorization, Content-Type, Accept',
    credentials: true,
    optionsSuccessStatus: 200
  }
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

  socket.on("leave", () => {
    console.log(`${socket.id} leaving room ${matchedRoomId}`);
    socket.leave(matchedRoomId);
    console.log(`Existing rooms: ${Array.from(io.sockets.adapter.rooms.keys())}.`);
  })

  socket.on("question", (question) => {
    console.log(`${socket.id} emitting question ${question} to ${matchedRoomId}.`);
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
    console.log(`Existing rooms: ${Array.from(io.sockets.adapter.rooms.keys())}.`);
  })

  socket.on("request", (question) => {
    console.log(`${socket.id} requested a change of question to ${question.questionId}`);
    socket.broadcast.to(matchedRoomId).emit("request", question);
  })
});
