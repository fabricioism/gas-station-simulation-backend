const socket = io(`http://localhost:3000`);

// Hypertimer para simulacion de tiempo
var hypertimer = hypertimer({ rate: 10 });

const btnIniciar = document.getElementById("btn-iniciar");
/* iniciar, pausar, continuar, finalizar */
btnIniciar.addEventListener("click", function (e) {
  let data = obtenerInformacion();
  console.log("data", data);
  hypertimer.config({ rate: parseInt(data.velocidad_simulacion) });
  socket.emit("iniciar", data);
  gestionBombas(data);
});

let ejemplo = {
  mensaje: "mensaje",
};

// MANEJO DE RESPUESTAS SOCKETS
/* socket.on("nombre-evento", function (data) {
 *   //manejo de respuesta a nombre-evento
 * });
 */
socket.on("respuesta-iniciar", function (data) {
  if (data.exito) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: `${data.mensaje}`,
      showConfirmButton: false,
      timer: 1000,
    });
  }
});
socket.on("respuesta-pausar", function (data) {
  //Manejo
  console.log("pausado");
});
socket.on("respuesta-continuar", function (data) {
  //Manejo
});
socket.on("respuesta-finalizar", function (data) {
  if (data.exito) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: `${data.mensaje}`,
      showConfirmButton: false,
      timer: 1000,
    });
  }
  //Manejo
});
socket.on("actualizacion", function (data) {
  console.log("Actualizacion recibida", data);
});

// FIN MANEJO DE RESPUESTAS SOCKETS

// Gestion de la informacion
let temporizador = document.getElementById("temporizador");
let resetear = document.getElementById("resetear");
let botones = document.getElementById("botones");
let tiempo = 0,
  intervale = 0;
let verificador = false;

resetear.disabled = "disabled";

init();

function init() {
  btnIniciar.addEventListener("click", iniciarCronometro);
  resetear.addEventListener("click", resetearCronometro);
}

function iniciarCronometro() {
  data = obtenerInformacion();
  if (verificador == false) {
    intervalo = hypertimer.setInterval(function () {
      tiempo += 0.01;
      temporizador.innerHTML = `${tiempo.toFixed(2)}min`;
    }, 600);
    verificador = true;
    btnIniciar.innerHTML = "";
    btnIniciar.className = "btn btn-warning";
    btnIniciar.innerHTML = ` 
       <b>Pausar</b>
     `;
    console.log("continuar");
    resetear.disabled = false;
  } else {
    verificador = false;
    hypertimer.clearInterval(intervalo);
    btnIniciar.innerHTML = "";
    btnIniciar.className = "btn btn-success";
    btnIniciar.innerHTML = `
       <b>Continuar</b>
     `;
    socket.emit("pausar", ejemplo);
  }
}

function resetearCronometro() {
  btnIniciar.className = "btn btn-info";
  btnIniciar.innerHTML = ` 
       <b>Iniciar</b>
     `;
  verificador = false;
  tiempo = 0.0;
  temporizador.innerHTML = `${tiempo}.00min`;
  hypertimer.clearInterval(intervalo);
  resetear.disabled = "disabled";
  document.getElementById("bombas").disabled = false;
  document.getElementById("diesel").disabled = false;
  document.getElementById("gasolina").disabled = false;
  document.getElementById("flujo").disabled = false;
  document.getElementById("velocidad").disabled = false;
  socket.emit("finalizar", ejemplo);
}

function obtenerInformacion() {
  let Entradas = {
    cantidad_bombas: document.getElementById("bombas").value,
    cantidad_diesel: document.getElementById("diesel").value,
    cantidad_gasolina: document.getElementById("gasolina").value,
    flujo_bombas: document.getElementById("flujo").value,
    velocidad_simulacion: document.getElementById("velocidad").value,
  };

  document.getElementById("bombas").disabled = "disabled";
  document.getElementById("diesel").disabled = "disabled";
  document.getElementById("gasolina").disabled = "disabled";
  document.getElementById("flujo").disabled = "disabled";
  document.getElementById("velocidad").disabled = "disabled";
  return Entradas;
}

function gestionBombas(data) {
  let contenedor_bombas = document.getElementById("contenedor_bombas");
  contenedor_bombas.innerHTML = "";

  for (let i = 0; i < data.cantidad_bombas; i++) {
    contenedor_bombas.innerHTML += `
        <div class="col-6 bomba">
        <h5>BOMBA # ${i + 1}</h5>
        <table class="table table-borderless">
          <thead>
            <tr>
              <th scope="col" class="titulo-tabla">Atentidos</th>
              <th scope="col" class="titulo-tabla">Diesel</th>
              <th scope="col" class="titulo-tabla">Gasolina</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="cantidad-autos">50</td>
              <td class="cantidad-autos" style="color: #ffca2b">
                24
              </td>
              <td class="cantidad-autos" style="color: #dc3545">
                26
              </td>
            </tr>
            <tr>
              <td class="cantidad-litros">150 litros</td>
              <td class="cantidad-litros" style="color: #ffca2b">
                75 litros
              </td>
              <td class="cantidad-litros" style="color: #dc3545">
                75 litros
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }
}
