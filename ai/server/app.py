from flask import Flask, request, send_file, Response
from flask_cors import CORS
from flask import jsonify
from PIL import Image
import io
import torch
import cv2
import base64
import os

import pathlib
if os.name == 'nt':  # Windows 환경인 경우
    temp = pathlib.PosixPath
    pathlib.PosixPath = pathlib.WindowsPath
app = Flask(__name__)

app.json.ensure_ascii = False

CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "https://choki.co.kr"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": [
            "Content-Type",
            "Authorization",
            "Content-Length",
            "Content-Disposition",
            "Accept",
            "X-Requested-With"
        ]
    }
})

@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

model_path='model/best.pt'
# model = torch.load(model_path)

model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path)
model.conf=0.1

@app.route('/ai/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    image = Image.open(io.BytesIO(file.read()))  # 이미지를 읽어 PIL 포맷으로 변환

    # YOLO 모델로 객체 탐지
    results = model(image)
    print(results.show())
    class_names = model.names

    # 결과 이미지 얻기
    detected_image = results.render()[0]
    pil_image = Image.fromarray(detected_image)

    # 이미지를 Base64로 인코딩
    buffered = io.BytesIO()
    pil_image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    # 결과를 JSON으로 변환
    predictions = []
    for detection in results.xyxy[0]:  # results.xyxy[0]은 텐서 형태의 결과
        class_id = int(detection[5])
        pred = {
            'xmin': float(detection[0]),
            'ymin': float(detection[1]),
            'xmax': float(detection[2]),
            'ymax': float(detection[3]),
            'confidence': float(detection[4]),
            'class': int(detection[5]),
            'name': class_names[class_id]
        }
        predictions.append(pred)

    # JSON 응답 반환
    return jsonify({
        'status': 200,
        'data' : {
            'predictions': predictions,
            'image': {
                'data': f'data:image/jpeg;base64,{img_str}',
                'width': pil_image.width,
                'height': pil_image.height
            }
        },
        'message' : "분류 성공"
    })

if __name__ == '__main__':
    app.run()
