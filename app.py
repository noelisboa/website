from flask import Flask, request, jsonify, render_template # type: ignore
import json

app = Flask(__name__)

# Archivo para almacenar solicitudes
REQUESTS_FILE = "requests.json"

# Cargar solicitudes desde el archivo (si existe)
def load_requests():
    try:
        with open(REQUESTS_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

# Guardar solicitudes en el archivo
def save_requests(requests):
    with open(REQUESTS_FILE, "w") as file:
        json.dump(requests, file, indent=4)

@app.route('/')
def home():
    return render_template('index.html')  # Formulario principal

@app.route('/submit', methods=['POST'])
def submit_request():
    # Recibir datos del usuario
    data = request.json
    name = data.get('name')
    surname = data.get('surname')

    # Guardar la solicitud en el archivo
    requests = load_requests()
    requests.append({"name": name, "surname": surname, "status": "pending"})
    save_requests(requests)

    return jsonify({"message": "Solicitud enviada. Espera nuestra aprobación."})

@app.route('/admin', methods=['GET'])
def admin_panel():
    # Página de administración
    return render_template('admin.html', requests=load_requests())

@app.route('/approve', methods=['POST'])
def approve_request():
    # Aprobar una solicitud
    data = request.json
    name = data.get('name')
    surname = data.get('surname')

    requests = load_requests()
    for req in requests:
        if req["name"] == name and req["surname"] == surname and req["status"] == "pending":
            req["status"] = "approved"
            save_requests(requests)
            return jsonify({"message": f"Solicitud de {name} {surname} aprobada."})

    return jsonify({"error": "Solicitud no encontrada."})

if __name__ == '__main__':
    app.run(debug=True)
