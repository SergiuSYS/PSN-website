console.log("page loaded");

async function get_data(){
    await fetch('/data')
        .then(response => response.json())
        .then(data => {

            document.getElementById("temp").textContent = data.temperature;
            document.getElementById("hum").textContent = data.humidity;
            document.getElementById("flood").textContent = data.flood;

            console.log(data);

            // ALERTS (fixed nesting)
            const alerts = data.alerts.alerts;
            const alertsList = document.getElementById("alertsList");

            alertsList.innerHTML = "";

            alerts.forEach(alert => {
                const li = document.createElement("li");
                li.textContent = alert.date + " - " + alert.water_level;
                alertsList.appendChild(li);
            });

            // MESSAGES (fixed typo: messgaes -> messages OR keep backend name)
            const messages = data.messages.messgaes;
            const messagesList = document.getElementById("messagesList");

            messagesList.innerHTML = "";

            messages.forEach(msg => {
                const li = document.createElement("li");
                li.textContent = msg.text;
                messagesList.appendChild(li);
            });

        })
        .catch(error => console.log(error))
}
setInterval(get_data, 2000);
function sendColor() {
    const color = document.getElementById("colorPicker").value;
    const rgb = hexToRgb(color);

    fetch('/led', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rgb)
    })
    .then(res => res.text())
    .then(data => console.log("Sent:", data))
    .catch(err => console.error(err));
}


function hexToRgb(hex) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return { r, g, b };
}
function sendMessage() {
    const message = document.getElementById("messageInput").value;

    fetch('/send-msg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    })
        .then(response => response.text())
        .then(data => {
            console.log("Sent:", data);
            document.getElementById("messageInput").value = "";
        })
        .catch(error => console.log(error))
}