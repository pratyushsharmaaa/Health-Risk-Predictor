import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
from huggingface_hub import InferenceClient
import traceback


# Load environment variables from .env
load_dotenv()

# Initialize Flask
BASEDIR = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)

# Global CORS configuration
CORS(
    app,
    supports_credentials=True,
    resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}}
)

# Configure Flask
app.config.update({
    'SECRET_KEY': 'your-secret-key',
    # <-- use an absolute path so SQLite always lives in backend/healthcare.db
    'SQLALCHEMY_DATABASE_URI': f"sqlite:///{os.path.join(BASEDIR, 'healthcare.db')}",
    'UPLOAD_FOLDER': os.path.join(BASEDIR, 'uploads'),
    'MAX_CONTENT_LENGTH': 16 * 1024 * 1024  # Limit file size to 16MB
})

# Initialize extensions
db = SQLAlchemy(app)

# Initialize Hugging Face Inference client
HF_TOKEN = os.getenv("HF_API_TOKEN")
print(">>> HF_API_TOKEN is set?", bool(HF_TOKEN))
hf_client = InferenceClient(token=HF_TOKEN)


# Models
# backend/app.py (excerpt)

class User(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    username       = db.Column(db.String(80), unique=True, nullable=False)
    password_hash  = db.Column(db.String(200), nullable=False)
    role           = db.Column(db.String(10), nullable=False)

    # New profile columns:
    first_name     = db.Column(db.String(80), nullable=False)
    last_name      = db.Column(db.String(80), nullable=False)
    dob            = db.Column(db.String(20), nullable=True)
    gender         = db.Column(db.String(10), nullable=True)
    address        = db.Column(db.String(200), nullable=True)
    phone          = db.Column(db.String(20), nullable=True)
    height         = db.Column(db.Float,   nullable=True)
    height_unit    = db.Column(db.String(5), nullable=True)
    weight         = db.Column(db.Float,   nullable=True)
    weight_unit    = db.Column(db.String(5), nullable=True)





# Create tables
with app.app_context():
    db.create_all()


# Helper to get current user
def current_user():
    uid = session.get('user_id')
    return User.query.get(uid) if uid else None


@app.route('/')
def index():
    return "Healthcare Flask Backend Running"


# Chat endpoint using HF
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json or {}
    prompt = data.get('prompt', '').strip()
    if not prompt:
        return jsonify(error='No prompt provided'), 400

    try:
        result = hf_client.text_generation(
            f"As a concise medical assistant: {prompt}",
            model="google/flan-t5-small",
            max_new_tokens=150,
            temperature=0.7
        )
        reply = result[0].get("generated_text", "").strip()
        return jsonify(reply=reply), 200

    except Exception:
        print("=== /api/chat ERROR ===")
        traceback.print_exc()
        return jsonify(error='Internal server error'), 500


# Register
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json or {}

    # Validate required fields
    required = ['username', 'password_hash', 'first_name', 'last_name']
    for f in required:
        if not data.get(f):
            return jsonify(error=f"{f} is required"), 400

    if User.query.filter_by(username=data.get('username')).first():
        return jsonify(error='Username taken'), 400
    user = User(
        username=data['username'],
        password_hash=data['password_hash'],
        role=data.get('role', 'User'),
        first_name = data['first_name'],
        last_name = data['last_name'],
        dob = data.get('dob'),
        gender = data.get('gender'),
        address = data.get('address'),
        phone = data.get('phone'),
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(success=True), 201


# Login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    user = User.query.filter_by(username=data.get('username')).first()
    if not user or user.password_hash != data.get('password_hash'):
        return jsonify(error='Invalid credentials'), 401
    session['user_id'], session['role'] = user.id, user.role
    return jsonify(username=user.username, role=user.role), 200


# Logout
@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify(success=True), 200


# ——— New “/api/me” endpoints ——————————————————————————

@app.route('/api/me', methods=['GET'])
def get_me():
    user = current_user()
    if not user:
        return jsonify(error='Unauthorized'), 401

    # send back *all* profile columns
    return jsonify({
        'username':    user.username,
        'role':        user.role,
        'first_name':  user.first_name,
        'last_name':   user.last_name,
        'dob':         user.dob,
        'gender':      user.gender,
        'address':     user.address,
        'phone':       user.phone,
        'height':      user.height,
        'height_unit': user.height_unit,
        'weight':      user.weight,
        'weight_unit': user.weight_unit,
    }), 200



@app.route('/api/me', methods=['PATCH'])
def patch_me():
    user = current_user()
    if not user:
        return jsonify(error='Unauthorized'), 401

    data = request.json or {}

    # Only overwrite fields if provided
    user.username      = data.get('username', user.username)
    user.first_name    = data.get('first_name', user.first_name)
    user.last_name     = data.get('last_name',  user.last_name)
    user.dob           = data.get('dob',        user.dob)
    user.gender        = data.get('gender',     user.gender)
    user.address       = data.get('address',    user.address)
    user.phone         = data.get('phone',      user.phone)
    # height/weight only if you want inline editing here:
    user.height        = data.get('height',     user.height)
    user.height_unit   = data.get('height_unit',user.height_unit)
    user.weight        = data.get('weight',     user.weight)
    user.weight_unit   = data.get('weight_unit',user.weight_unit)

    db.session.commit()
    return jsonify(success=True), 200


# ——————————————————————————————————————————————

# List users (Admin only)
@app.route('/api/users', methods=['GET'])
def list_users():
    if session.get('role') != 'Admin':
        return jsonify(error='Forbidden'), 403
    users = User.query.all()
    return jsonify([{'id': u.id, 'username': u.username, 'role': u.role} for u in users]), 200


@app.route('/api/user/update_profile', methods=['POST'])
def update_profile():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    try:
        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500


# Upload endpoint
@app.route('/api/upload', methods=['OPTIONS', 'POST'])
def upload_report():
    if request.method == 'OPTIONS':
        return '', 204

    if 'user_id' not in session:
        return jsonify(error='Unauthorized'), 401

    f = request.files.get('report')
    rpt_type = request.form.get('report_type')

    if not f or not rpt_type:
        return jsonify(error='Missing file or report_type'), 400

    filename = secure_filename(f.filename)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    f.save(path)

    try:
        if rpt_type == 'liver':
            from extraction_liver import extract_liver_report
            result = extract_liver_report(path)
        else:
            from extraction_diabetes import extract_diabetes_report
            result = extract_diabetes_report(path)

    except Exception as primary_err:
        app.logger.warning(f"Primary parse failed: {primary_err}\nFalling back to OCR extractor…")
        try:
            if rpt_type == 'liver':
                from extraction_liver_ocr import extract_liver_report_ocr
                result = extract_liver_report_ocr(path)
            else:
                # you could implement extraction_diabetes_ocr.py similarly
                from extraction_diabetes import extract_diabetes_report
                result = extract_diabetes_report(path)
        except Exception as fallback_err:
            app.logger.error(f"OCR parse also failed: {fallback_err}")
            traceback.print_exc()
            return jsonify(error=f"Server error: {fallback_err}"), 500

    return jsonify(result), 200

# Manual Diabetes Input Prediction
@app.route('/api/manual-diabetes', methods=['POST'])
def manual_diabetes():
    try:
        from models.diabetes_model import predict_diabetes
        data = request.json or {}

        fields = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'Age']
        for field in fields:
            if field not in data:
                return jsonify(error=f"Missing field: {field}"), 400

        feature_vector = [float(data[field]) for field in fields]
        prediction, probability = predict_diabetes(feature_vector)

        advice = (
            f"Based on these values, a predicted class of {prediction} indicates "
            f"{'presence' if prediction == 1 else 'absence'} of diabetes risk. "
            "Consult a doctor for a full checkup."
        )

        return jsonify({
            'lab_values': data,
            'prediction': int(prediction),
            'probability': float(probability),
            'advice': advice
        }), 200

    except Exception as e:
        print("=== /api/manual-diabetes ERROR ===")
        print(e)
        return jsonify(error="Server error during manual diabetes prediction"), 500


# Manual Liver Input Prediction
@app.route('/api/manual-liver', methods=['POST'])
def manual_liver():
    try:
        from models.liver_model import predict_liver_disease
        data = request.json or {}

        # Accept either key in incoming JSON
        if 'SERUM_PROTEIN' in data:
            data['Total_Protiens'] = data.pop('SERUM_PROTEIN')

        # Now validate against the model’s required keys
        fields = [
            'Total_Bilirubin',
            'Direct_Bilirubin',
            'Alkaline_Phosphotase',
            'Total_Protiens',
            'Albumin',
            'Albumin_and_Globulin_Ratio'
        ]
        for field in fields:
            if field not in data:
                return jsonify(error=f"Missing field: {field}"), 400

        # Build feature vector
        feature_vector = [float(data[field]) for field in fields]
        prediction, probability = predict_liver_disease(feature_vector)

        advice = (
            f"Based on these values, a predicted class of {prediction} indicates "
            f"{'presence' if prediction == 1 else 'absence'} of liver disease. "
            "Consult a doctor for medical guidance."
        )

        return jsonify({
            'lab_values': data,
            'prediction': int(prediction),
            'probability': float(probability),
            'advice': advice
        }), 200

    except Exception as e:
        print("=== /api/manual-liver ERROR ===", e)
        return jsonify(error="Server error during manual liver prediction"), 500


# Serve uploads
@app.route('/uploads/<filename>')
def serve_uploads(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
