const preguntas = [
  "¿Con qué frecuencia has sentido que no puedes controlar las cosas importantes de tu vida?",
  "¿Con qué frecuencia has sentido que estás sobrecargado(a)?",
  "¿Qué tan a menudo has sentido nerviosismo o agitación?",
  "¿Con qué frecuencia has sentido que todo te exige demasiado?",
  "¿Qué tan seguido has tenido dificultad para relajarte?",
  "¿Te ha costado concentrarte en lo que haces por el estrés?",
  "¿Te has sentido irritable o impaciente sin motivo claro?"
];

let respuestas = [];
let currentIndex = 0;

// Mostrar test y primera pregunta
function mostrarTest() {
  const nombre = document.getElementById("nombre").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();

  if (!nombre || !whatsapp) {
    alert("Por favor, ingresa tu nombre y WhatsApp (con código de país)");
    return;
  }

  // Guardar datos globales
  window.nombre = nombre;
  window.whatsapp = whatsapp;

  document.getElementById("inicio").style.display = "none";
  document.getElementById("test-container").style.display = "block";

  mostrarPreguntaActual();
}

// Mostrar la pregunta actual
function mostrarPreguntaActual() {
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const currentSpan = document.getElementById("current");

  questionEl.innerHTML = `<strong>${preguntas[currentIndex]}</strong>`;
  currentSpan.textContent = currentIndex + 1;

  optionsEl.innerHTML = "";
  const opciones = ["Nunca", "Algunas veces", "Bastantes veces", "Casi siempre"];
  opciones.forEach((opcion, i) => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="radio" name="resp" value="${i + 1}" ${respuestas[currentIndex] == i + 1 ? "checked" : ""}>
      ${opcion}
    `;
    optionsEl.appendChild(label);
  });
}

// Siguiente pregunta
function siguientePregunta() {
  const seleccion = document.querySelector('input[name="resp"]:checked');
  if (!seleccion) {
    alert("Por favor, selecciona una opción");
    return;
  }

  respuestas[currentIndex] = parseInt(seleccion.value);

  if (currentIndex < preguntas.length - 1) {
    currentIndex++;
    mostrarPreguntaActual();
  } else {
    calcularYEnviar();
  }
}

// Calcular y mostrar resultado
function calcularYEnviar() {
  const puntaje = respuestas.reduce((a, b) => a + b, 0);

  let nivel, mensaje;
  if (puntaje <= 10) {
    nivel = "Bajo";
    mensaje = "Vas bien, pero no bajes la guardia. La prevención es clave.";
  } else if (puntaje <= 16) {
    nivel = "Moderado";
    mensaje = "Tienes carga normal, pero empiezas a sentir el peso. Aprende a pausar.";
  } else if (puntaje <= 22) {
    nivel = "Alto";
    mensaje = "Estás bajo mucha presión. Necesitas desconectar y respirar.";
  } else {
    nivel = "Muy Alto";
    mensaje = "Tu cuerpo y mente están al límite. Es momento de actuar.";
  }

  document.getElementById("test-container").style.display = "none";
  document.getElementById("resultado").style.display = "block";
  document.getElementById("nivel").textContent = nivel;
  document.getElementById("mensaje").textContent = mensaje;

  // 🔥 Reemplaza con tu webhook cuando lo tengas
  const webhookUrl = "https://TU-N8N-WEBHOOK-AQUI.com/webhook/test-estres";

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: window.nombre,
      whatsapp: window.whatsapp,
      puntaje,
      nivel,
      mensaje,
      respuestas,
      fecha: new Date().toISOString()
    })
  })
  .then(() => console.log("✅ Datos enviados a n8n"))
  .catch(err => console.error("❌ Error:", err));

  // Enlace de WhatsApp
  const texto = `Hola, soy ${encodeURIComponent(window.nombre)}. Mi nivel de estrés es ${nivel} (${puntaje}/28). Quiero la guía de respiración.`;
  const link = `https://wa.me/${window.whatsapp.replace(/\s/g, '')}?text=${texto}`;
  document.getElementById("btn-whatsapp").href = link;
}