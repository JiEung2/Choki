# Build Next.js 프로젝트
FROM node:lts-alpine AS build-stage
WORKDIR /app

# 필수 패키지 설치 (wget 사용)
RUN apk add --no-cache wget

# Next.js 의존성 설치
COPY package.json package-lock.json ./ 
RUN npm install

# 소스 코드 복사
COPY . .

# 퍼블릭 S3 URL에서 Unity 빌드 파일 다운로드
RUN wget -q -P ./public/unity https://choki-s3.s3.ap-southeast-2.amazonaws.com/unity/index.html && \
    wget -q -P ./public/unity/Build https://choki-s3.s3.ap-southeast-2.amazonaws.com/unity/Build/unitybuild.loader.js && \
    wget -q -P ./public/unity/Build https://choki-s3.s3.ap-southeast-2.amazonaws.com/unity/Build/unitybuild.framework.js && \
    wget -q -P ./public/unity/Build https://choki-s3.s3.ap-southeast-2.amazonaws.com/unity/Build/unitybuild.data && \
    wget -q -P ./public/unity/Build https://choki-s3.s3.ap-southeast-2.amazonaws.com/unity/Build/unitybuild.wasm && \
    wget -q -P ./public/unity/TemplateData https://choki-s3.s3.ap-southeast-2.amazonaws.com/unity/TemplateData/Group.svg && \
    wget -q -P ./public/unity/TemplateData https://choki-s3.s3.ap-southeast-2.amazonaws.com/unity/TemplateData/style.css

# Next.js 프로젝트 빌드
RUN npm run build

# Run Next.js 서버
FROM node:lts-alpine AS next-stage
WORKDIR /app

# 빌드 결과 복사
COPY --from=build-stage /app . 

# 서버 실행 포트 노출
EXPOSE 3000

# Next.js 서버 실행
CMD ["npm", "start"]
