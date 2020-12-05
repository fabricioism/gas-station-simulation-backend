const puerto = 3000;
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const car = require("./models/Carro.js");

let carro = new car.Carro();
console.log(JSON.stringify(carro));
carro = new car.Carro();
console.log(JSON.stringify(carro));
carro = new car.Carro();
console.log(JSON.stringify(carro));

app.use("/", express.static("front"));

io.on("connection", function (socket) {
  socket.on("iniciar", function (data) {
    console.log(`Iniciar con datos: ${JSON.stringify(data)}`);
    //Respuesta de vuelta al cliente
    socket.emit("respuesta-iniciar", { iniciar: true, mensaje: "Hola mundo" });
  });
  socket.on("disconnect", function () {
    console.log("Desconectado");
  });
});

http.listen(puerto, function () {
  console.log("Servicio iniciado en puerto", puerto);
});