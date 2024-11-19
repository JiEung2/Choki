FROM python:3.10-slim

WORKDIR /server

# OpenCV와 기타 시스템 의존성 설치
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    git \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# 전체 프로젝트 파일을 복사 (yolov5 포함)
COPY . .

# YOLOv5 requirements 설치
RUN pip install -r yolov5/requirements.txt

# 프로젝트 의존성 설치
RUN pip install --no-cache-dir -r requirements.txt

# 작업 디렉토리와 Python 경로 설정
ENV PYTHONPATH=/server:/server/yolov5

# gunicorn으로 실행
CMD ["gunicorn", \
     "--log-level=debug", \
     "--timeout", "300", \
     "--workers", "1", \
     "--threads", "4", \
     "--bind", "0.0.0.0:5000", \
     "app:app"]