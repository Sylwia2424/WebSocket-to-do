const express = require('express');
const socket = require('socket.io');
const app = express();
let tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is runnng ...');
});

const io = socket(server);

io.on('connection', socket => {
  console.log('New user:' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', newTask => {
    if(!tasks.find(task => task.id == newTask.id)) {
      tasks.push(newTask)
      socket.broadcast.emit('addTask', newTask);
    }
  });

  socket.on('removeTask', (id) => {
    tasks = tasks.filter((task) => task.id !== id);
    socket.broadcast.emit('removeTask', tasks);
  });
});

app.use((req, res) => {
   res.status(404).send({ message: 'Not found...' });
});