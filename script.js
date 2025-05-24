const recordButton = document.getElementById("recordButton");
const userText = document.getElementById("userText");
const response = document.getElementById("response");
const status = document.getElementById("status");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recordButton.onclick = () => {
  recognition.start();
  status.textContent = "🎤 Grabando... habla ahora.";
};

recognition.onresult = async (event) => {
  const text = event.results[0][0].transcript;
  userText.textContent = text;
  status.textContent = "✔️ Mensaje recibido. Analizando...";

  const tipo = detectarTipoDeProblema(text);
  const aiResponse = await getLuzResponse(text, tipo);
  response.textContent = aiResponse;

  guardarConversacion(text, aiResponse, tipo);
};

recognition.onerror = (event) => {
  status.textContent = "❌ Error: " + event.error;
};

// Detección de tipo de problema
function detectarTipoDeProblema(texto) {
  const palabrasClave = {
    amor: ["pareja", "me dejó", "relación", "amor", "infidelidad", "rompí"],
    dinero: ["deuda", "dinero", "trabajo", "pagar", "plata", "desempleado"],
    salud: ["ansiedad", "estrés", "depresión", "angustia", "cansado"],
    familia: ["mamá", "papá", "hermano", "familia", "hogar"],
    identidad: ["no sé qué hacer", "sin sentido", "quién soy", "futuro"],
  };

  for (const [tipo, palabras] of Object.entries(palabrasClave)) {
    if (palabras.some(palabra => texto.toLowerCase().includes(palabra))) {
      return tipo;
    }
  }

  return "otro";
}

// Comunicación con la IA
async function getLuzResponse(userInput, tipoProblema) {
  const prompt = `El usuario habló sobre un tema de tipo "${tipoProblema}". Dijo: "${userInput}". Responde como Luz, una IA compasiva. Dale apoyo emocional y algunas ideas que lo ayuden a sentirse mejor o pensar con claridad. Sé empática, amable y cuidadosa.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer TU_API_KEY", // ← REEMPLAZA esto con tu API KEY
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres Luz, una IA que da contención emocional y orientación de forma amable y sabia." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await res.json();
  return data.choices[0].message.content;
}

// Guardar conversación en localStorage
function guardarConversacion(pregunta, respuesta, tipo) {
  const historial = JSON.parse(localStorage.getItem("historialLuz")) || [];
  historial.push({ pregunta, respuesta, tipo, fecha: new Date().toLocaleString() });
  localStorage.setItem("historialLuz", JSON.stringify(historial));
}
