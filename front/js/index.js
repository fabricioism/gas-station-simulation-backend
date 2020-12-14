const socket = io(`http://localhost:3000`);

// Hypertimer para simulacion de tiempo
var hypertimer = hypertimer({ rate: 10 });

const btnIniciar = document.getElementById("btn-iniciar");
const btnVariablesEstado = document.getElementById("btn-variables-estado");
const porcentajeDiesel = document.getElementById("porcentaje-diesel");
const porcentajeGasolina = document.getElementById("porcentaje-gasolina");
var datosEntrada = {};

$(document).ready(function () {
  btnVariablesEstado.addEventListener("click", function (e) {
    btnVariablesEstado.disabled = true;
    let capacidadMaxTanque = document.getElementById("capacidad-max-tanque");
    let capacidadMinTanque = document.getElementById("capacidad-min-tanque");
    let tiempoPreLlenado = document.getElementById("tiempo-pre-llenado");
    let tiempoPosLlenado = document.getElementById("tiempo-pos-llenado");
    let porcentajeMaxOcupado = document.getElementById(
      "porcentaje-max-ocupado"
    );
    let porcentajeAutosGasolina = document.getElementById(
      "porcentaje-autos-gasolina"
    );
    let tasaLlegada = document.getElementById("tasa-llegada");
    let data = {
      capacidadMaxTanque: capacidadMaxTanque.value
        ? parseFloat(capacidadMaxTanque.value)
        : 65,
      capacidadMinTanque: capacidadMinTanque.value
        ? parseFloat(capacidadMinTanque.value)
        : 45,
      tiempoPreLlenado: tiempoPreLlenado.value
        ? parseFloat(tiempoPreLlenado.value)
        : 0.5,
      tiempoPosLlenado: tiempoPosLlenado.value
        ? parseFloat(tiempoPosLlenado.value)
        : 1,
      porcentajeMaxOcupado: porcentajeMaxOcupado.value
        ? parseFloat(porcentajeMaxOcupado.value)
        : 0.75,
      porcentajeGasolina: porcentajeAutosGasolina.value
        ? parseFloat(porcentajeAutosGasolina.value)
        : 0.8,
      tasaLlegada: tasaLlegada.value ? parseFloat(tasaLlegada.value) : 5,
    };
    socket.emit("variables-estado", data);
  });
});
// MANEJO DE RESPUESTAS SOCKETS
/* socket.on("nombre-evento", function (data) {
 *   //manejo de respuesta a nombre-evento
 * });
 */
socket.on("respuesta-variables-estado", function (data) {
  if (data.exito) {
    btnVariablesEstado.disabled = false;
    Swal.fire({
      position: "center",
      icon: "success",
      title: `${data.mensaje}`,
      showConfirmButton: false,
      timer: 1000,
    });
  }
});
socket.on("respuesta-iniciar", function (data) {
  if (data.exito) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: `${data.mensaje}`,
      showConfirmButton: false,
      timer: 1000,
    });
    gestionBombas(datosEntrada);
    iniciarCronometro();
  } else {
    contenedor_bombas.innerHTML = "";
    contenedor_bombas.classList.add("preloader");
    contenedor_bombas.innerHTML += `
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden"></span>
      </div>
    `;
    Swal.fire({
      position: "center",
      icon: "error",
      title: `${data.mensaje}`,
      showConfirmButton: false,
      timer: 1000,
    });
  }
});
socket.on("respuesta-pausar", function (data) {
  if (data.exito) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: `${data.mensaje}`,
      showConfirmButton: false,
      timer: 1000,
    });
  } else {
    contenedor_bombas.innerHTML = "";
    contenedor_bombas.classList.add("preloader");
    contenedor_bombas.innerHTML += `
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden"></span>
      </div>
    `;
    Swal.fire({
      position: "center",
      icon: "error",
      title: `${data.mensaje}`,
      showConfirmButton: false,
      timer: 1000,
    });
  }
});
socket.on("respuesta-continuar", function (data) {
  if (data.exito) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: `${data.mensaje}`,
      showConfirmButton: false,
      timer: 1000,
    });
  } else {
    contenedor_bombas.innerHTML = "";
    contenedor_bombas.classList.add("preloader");
    contenedor_bombas.innerHTML += `
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden"></span>
      </div>
    `;
    Swal.fire({
      position: "center",
      icon: "error",
      title: `${data.mensaje}`,
      showConfirmButton: false,
      timer: 1000,
    });
  }
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
  } else {
    contenedor_bombas.innerHTML = "";
    contenedor_bombas.classList.add("preloader");
    contenedor_bombas.innerHTML += `
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden"></span>
      </div>
    `;
    Swal.fire({
      position: "center",
      icon: "error",
      title: `${data.mensaje}`,
      showConfirmButton: false,
      timer: 1000,
    });
  }
});
socket.on("actualizacion", function (data) {
  if (data.finalizado) {
    console.log("finalizado");
    // Cambiar estado a finalizado, mostrar boton limpiar datos, pausar cronometro
  }
  actualizarPorcentajes(data);
  actualizarBombas(data);
});

// FIN MANEJO DE RESPUESTAS SOCKETS

// Gestion de la informacion
let temporizador = document.getElementById("temporizador");
let finalizar = document.getElementById("finalizar");
let pausar = document.getElementById("pausar");
let continuar = document.getElementById("continuar");
let resetear = document.getElementById("resetear");
let configuracion = document.getElementById("configurar");
let botones = document.getElementById("botones");
let tiempo = 0;

init();

/* iniciar, pausar, continuar, finalizar */

function init() {
  btnIniciar.addEventListener("click", function (e) {
    datosEntrada = obtenerInformacion();
    if (
      parseFloat(datosEntrada.cantidad_diesel) < 0 ||
      parseFloat(datosEntrada.cantidad_gasolina) < 0
    ) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Ingrese valores validos",
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      hypertimer.config({ rate: parseInt(datosEntrada.velocidad_simulacion) });
      socket.emit("iniciar", datosEntrada);
    }
  });
  finalizar.addEventListener("click", finalizarCronometro);
  pausar.addEventListener("click", pausarCronometro);
  continuar.addEventListener("click", continuarCronometro);
  resetear.addEventListener("click", function () {
    resetearCronometro();
  });
}

function iniciarCronometro() {
  data = obtenerInformacion();
  intervalo = hypertimer.setInterval(function () {
    tiempo += 0.01;
    temporizador.innerHTML = `${tiempo.toFixed(2)}min`;
  }, 600);
  btnIniciar.style.display = "none";
  pausar.style.display = "block";
  finalizar.style.display = "block";
  configuracion.style.display = "none";
  document.getElementById("bombas").disabled = "disabled";
  document.getElementById("diesel").disabled = "disabled";
  document.getElementById("gasolina").disabled = "disabled";
  document.getElementById("flujo").disabled = "disabled";
  document.getElementById("velocidad").disabled = "disabled";
}

function continuarCronometro() {
  intervalo = hypertimer.setInterval(function () {
    tiempo += 0.01;
    temporizador.innerHTML = `${tiempo.toFixed(2)}min`;
  }, 600);
  continuar.style.display = "none";
  pausar.style.display = "block";
  socket.emit("continuar", {});
}

function pausarCronometro() {
  hypertimer.clearInterval(intervalo);
  pausar.style.display = "none";
  continuar.style.display = "block";
  socket.emit("pausar", {});
}

function finalizarCronometro() {
  hypertimer.clearInterval(intervalo);
  socket.emit("finalizar", {});
  continuar.style.display = "none";
  pausar.style.display = "none";
  finalizar.style.display = "none";
  resetear.style.display = "block";
}

function resetearCronometro() {
  document.getElementById("bombas").disabled = false;
  document.getElementById("diesel").disabled = false;
  document.getElementById("gasolina").disabled = false;
  document.getElementById("flujo").disabled = false;
  document.getElementById("velocidad").disabled = false;
  btnIniciar.style.display = "block";
  resetear.style.display = "none";
  configuracion.style.display = "block";
  contenedor_bombas.innerHTML = "";
  contenedor_bombas.innerHTML += `
    <h3>INICIE LA SIMULACIÓN</h3>
  `;
  tiempo = 0;
  temporizador.innerHTML = `${tiempo.toFixed(2)}min`;
}

function obtenerInformacion() {
  let Entradas = {
    cantidad_bombas: document.getElementById("bombas").value,
    cantidad_diesel: document.getElementById("diesel").value,
    cantidad_gasolina: document.getElementById("gasolina").value,
    flujo_bombas: document.getElementById("flujo").value,
    velocidad_simulacion: document.getElementById("velocidad").value,
  };

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
              <td id="atendidos-cantidad-${i}" class="cantidad-autos">0</td>
              <td id="atendidos-cantidad-diesel-${i}" class="cantidad-autos" style="color: #ffca2b">
                0
              </td>
              <td id="atendidos-cantidad-gasolina-${i}" class="cantidad-autos" style="color: #dc3545">
                0
              </td>
            </tr>
            <tr>
              <td id="atendidos-litros-${i}" class="cantidad-litros">0 litros</td>
              <td id="atendidos-litros-diesel-${i}" class="cantidad-litros" style="color: #ffca2b">
                0 litros
              </td>
              <td id="atendidos-litros-gasolina-${i}" class="cantidad-litros" style="color: #dc3545">
                0 litros
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }
}

function actualizarPorcentajes(data) {
  nivelDiesel = Math.round(data.porcentajeDiesel);
  nivelGasolina = Math.round(data.porcentajeGasolina);
  porcentajeDiesel.style.width = `${nivelDiesel}%`;
  porcentajeDiesel.setAttribute("aria-valuenow", `${nivelDiesel}`);
  porcentajeDiesel.innerHTML = `<b>${nivelDiesel}%<b>`;
  porcentajeGasolina.style.width = `${nivelGasolina}%`;
  porcentajeGasolina.setAttribute("aria-valuenow", `${nivelGasolina}`);
  porcentajeGasolina.innerHTML = `<b>${nivelGasolina}%<b>`;
}

function actualizarBombas(data) {
  for (let i = 0; i < data.bombas.length; i++) {
    let bomba = data.bombas[i];
    let atendidosCantidad = document.getElementById(`atendidos-cantidad-${i}`);
    let atendidosCantidadDiesel = document.getElementById(
      `atendidos-cantidad-diesel-${i}`
    );
    let atendidosCantidadGasolina = document.getElementById(
      `atendidos-cantidad-gasolina-${i}`
    );
    let atendidosLitros = document.getElementById(`atendidos-litros-${i}`);
    let atendidosLitrosDiesel = document.getElementById(
      `atendidos-litros-diesel-${i}`
    );
    let atendidosLitrosGasolina = document.getElementById(
      `atendidos-litros-gasolina-${i}`
    );
    atendidosCantidad.innerHTML = bomba.atendidosCantidad;
    atendidosCantidadDiesel.innerHTML = bomba.atendidosCantidadDiesel;
    atendidosCantidadGasolina.innerHTML = bomba.atendidosCantidadGasolina;
    atendidosLitros.innerHTML = bomba.atendidosLitros.toFixed(2) + " litros";
    atendidosLitrosDiesel.innerHTML =
      bomba.atendidosLitrosDiesel.toFixed(2) + " litros";
    atendidosLitrosGasolina.innerHTML =
      bomba.atendidosLitrosGasolina.toFixed(2) + " litros";
  }
}
