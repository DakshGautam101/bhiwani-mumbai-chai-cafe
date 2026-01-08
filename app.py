from flask import Flask, request, jsonify
from flask_cors import CORS
import pywhatkit
import datetime

app = Flask(__name__)
CORS(app)  # Enables CORS for Next.js frontend

@app.route("/send-message", methods=["POST"])
def send_message():
    try:
        data = request.json
        phone = data.get("to")
        message = data.get("message")

        if not phone or not message:
            return jsonify({"error": "Phone number and message are required"}), 400

        # Try sending instantly
        try:
            pywhatkit.sendwhatmsg_instantly(
                phone,
                message,
                wait_time=10,
                tab_close=True
            )
            return jsonify({"success": True, "message": "WhatsApp message sent instantly!"})
        except Exception as e:
            # If instant fails, schedule after 1 minute as fallback
            now = datetime.datetime.now()
            send_time = now + datetime.timedelta(minutes=1)
            pywhatkit.sendwhatmsg(
                phone,
                message,
                send_time.hour,
                send_time.minute,
                wait_time=10,
                tab_close=True
            )
            return jsonify({"success": True, "message": "WhatsApp message scheduled (instant send failed).", "fallback_error": str(e)})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)
