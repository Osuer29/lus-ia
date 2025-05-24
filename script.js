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
  status.textContent = "✔️ Mensaje recibido. Procesando...";

  // Simulación de llamada a la IA (aquí debes conectar con OpenAI)
  const aiResponse = await getLuzResponse(text);
  response.textContent = aiResponse;
};

recognition.onerror = (event) => {
  status.textContent = "❌ Error: " + event.error;
};

async function getLuzResponse(userInput) {
  // 👉 Aquí deberías usar tu propia clave y llamar a la API real de OpenAI
  const prompt = `El usuario dijo: "${userInput}". Eres Luz, una IA compasiva. Dale una respuesta empática que lo ayude a reflexionar, sentirse mejor y tomar una buena decisión.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer TU_API_KEY", // Reemplaza con tu clave real
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "system", content: "Eres Luz, una IA empática que ayuda con problemas personales." },
                 { role: "user", content: prompt }]
    })
  });

  const data = await res.json();
  return data.choices[0].message.content;
}
