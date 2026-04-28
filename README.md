# 🚀LurkGuard-AI  
🛡️ AI-Powered Fraud Call Detection System  
# 📌 Overview  
LurkGuard-AI is an intelligent system designed to detect fraudulent phone calls using advanced AI techniques.
It analyzes text, audio, and video call recordings to classify them as:  
✅ Safe  
⚠️ Suspicious  
🚨 Fraud  
The system combines Machine Learning, Speech-to-Text, and Cloud Integration to provide real-time, unbiased fraud detection.  
# 🔥 Key Features  
🎤 Speech-to-Text Integration  
Converts call recordings (MP3/MP4/WAV) into text using Google Speech API  
# 📂 Multi-format File Upload Supports:  
.mp3  
.mp4  
.wav  
# 🧠 AI-Based Fraud Detection Uses trained ML model to classify call content  
# ☁️ Firebase Integration Stores predictions and call logs in cloud database  
# 📱 Modern Mobile-like UI Built using Lovable AI for a smooth, judge-friendly interface  
# ⚡ Real-time Analysis Instant prediction after upload  
# 🧾 Call Transcript Extraction Full text output from audio/video  
# 🏗️ Project Architecture  
  
User Input (Text / Audio / Video)  
        ↓  
Speech-to-Text (Google API)  
        ↓  
Text Processing  
        ↓  
ML Model Prediction  
        ↓  
Result (Safe / Fraud / Suspicious)  
        ↓  
Firebase Storage  
# 📁 Project Structure  
  
LurkGuard-AI/  
│  
├── app.py                  # Flask backend  
├── config.py               # Configurations  
├── predictor.py            # ML prediction logic  
├── keyword_engine.py       # Keyword-based detection  
│  
├── services/  
│   └── speech_to_text.py   # Audio/Video → Text conversion  
│  
├── models/  
│   ├── model.pkl  
│   └── vectorizer.pkl  
│  
├── data/  
│   └── dataset.csv  
│  
├── templates/  
│   └── index.html          # Frontend UI  
│
├── firebase_key.json       # Firebase credentials  
├── requirements.txt  
└── README.md  
# ⚙️ Tech Stack  
Frontend: HTML, CSS, JavaScript (Lovable AI Generated UI)  
Backend: Flask (Python)  
Machine Learning: Scikit-learn  
Speech Recognition: Google Cloud Speech-to-Text  
Cloud Database: Firebase Firestore  
Audio Processing: MoviePy, Pydub  
# 🧠 How It Works  
User uploads a call recording or enters text  
Audio/video is converted into text  
Text is processed and analyzed  
ML model predicts fraud probability  
Result is displayed and stored in Firebase  
# 🚀 Installation & Setup  
1️⃣ Clone Repository  
Bash  
git clone https://github.com/25A31A05KF/LurkGuard-AI.git  
cd LurkGuard-AI  
2️⃣ Create Virtual Environment  
Bash  
python -m venv venv  
venv\Scripts\activate   # Windows  
3️⃣ Install Dependencies  
Bash  
pip install -r requirements.txt  
4️⃣ Setup Firebase  
Add your firebase_key.json in root folder  
Enable Firestore in Firebase Console  
5️⃣ Setup Google Speech API  
Bash  
set GOOGLE_APPLICATION_CREDENTIALS=path_to_your_json  
6️⃣ Run Application  
Bash  
python app.py  
# 🌐 API Endpoints  
🔹 Predict from Text  
  
POST /predict  
🔹 Analyze Audio/Video File  
  
POST /analyze-file  
📊 Example Output  
{JSON  
  "text": "Your bank account will be blocked, share OTP",  
  "prediction": "Fraud"  
}  
# 💡 Future Enhancements  
🎙️ Live call monitoring  
🌍 Multi-language detection  
📈 Fraud probability scoring  
📊 Dashboard analytics  
📱 Mobile app integration  
