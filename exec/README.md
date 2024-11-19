# 빌드 및 배포 가이드
## 사용된 프레임워크 및 버전 정보
### EC2 인스턴스에서 작동하는 서비스
1. Docker (v27.3.1)
2. PostgreSQL (v13.16)
3. PostGIS (v3.0)
4. mongoDB (v6.0.19)
5. elasticsearch (v8.5.3)


### Docker Container로 작동하는 서비스
1. SpringBoot
    ```
    jieung/choki_backend:latest
    ```
2. Next
    ```
    jieung/choki_frontend:latest
    ```
3. jenkins
    ```
    jenkins/jenkins:jdk17
    ```
4. redis
    ``` 
    redis:7.4.1
    ```

### 사용된 IDE
1. IntelliJ IDEA Ultimate 2024.1.4
2. VSCode

### 백엔드 버전
```
Java: 17.0.11(Open JDK)
Spring Boot 3.3.5
```

### 프론트엔드 버전
```
"jotai": "^2.10.1"
"next": "15.0.1"
"react-unity-webgl": "^9.6.0"
"mapbox-gl": "^3.7.0"
```

## 빌드 환경변수
### SpringBoot()
- 일반 로그인
- S3 버킷 생성 필요
- application.properties
    ```
    spring.application.name=choki

    # DB
    ## PostgreSQL
    spring.datasource.url=jdbc:postgresql://choki.co.kr:5432/postgres
    spring.datasource.username=ubuntu
    spring.datasource.password=c102ssafy102
    spring.datasource.driver-class-name=org.postgresql.Driver

    # MongoDB
    spring.data.mongodb.host=k11c102.p.ssafy.io
    spring.data.mongodb.port=29000
    spring.data.mongodb.database=choki
    spring.data.mongodb.username=c102ssafy
    spring.data.mongodb.password=c102ssafy102!!
    spring.data.mongodb.authentication-database=choki

    # Redis
    spring.data.redis.port=46379
    spring.data.redis.host=k11c102.p.ssafy.io
    spring.data.redis.password=c102ssafy102

    # ElasticSearch
    spring.data.elasticsearch.username=c102
    spring.data.elasticsearch.password=c102c102
    spring.data.elasticsearch.uris=ip-172-26-7-194:9200

    # JPA
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
    spring.jpa.properties.hibernate.format_sql=true
    spring.jpa.hibernate.ddl-auto=update
    logging.level.org.hibernate.type.descriptor.sql=trace

    # jwt secret
    spring.jwt.secret=abae6a16fac1e3076bcbb5b5141b3b3e8c4dc9bb040967b72a07be19f3cd1a079c10531c6a8ec94246610d7c6480b53875522cb636c9314d63bcd71ca22a79ba

    # Swagger UI settings
    springdoc.swagger-ui.groups-order=DESC
    springdoc.swagger-ui.tags-sorter=alpha
    springdoc.swagger-ui.operations-sorter=method
    springdoc.swagger-ui.disable-swagger-default-url=true
    springdoc.swagger-ui.display-request-duration=true
    springdoc.swagger-ui.default-models-expand-depth=2
    springdoc.swagger-ui.default-model-expand-depth=2

    # API documentation path settings
    springdoc.api-docs.path=/api-docs

    # Enable Actuator support
    springdoc.show-actuator=true

    # Default media type settings
    springdoc.default-consumes-media-type=application/json
    springdoc.default-produces-media-type=application/json

    # Enable Pretty Print
    springdoc.writer-with-default-pretty-printer=true

    # Enable ModelAndView support
    springdoc.model-and-view-allowed=true

    # login endpoint visible
    springdoc.show-login-endpoint=true

    # API path matching settings
    springdoc.paths-to-match=/api/**

    # Amazon S3
    spring.cloud.aws.credentials.access-key=AKIA3C6FL6CXIGG5Y7MW
    spring.cloud.aws.credentials.secret-key=ONa0KeReGUwB7i+XqmlLFnGauh5gqC5jgabdwEk
    spring.cloud.aws.region.static=ap-southeast-2
    spring.cloud.aws.s3.region=ap-southeast-2
    spring.cloud.aws.s3.bucket=choki-s3
    spring.servlet.multipart.max-file-size=5MB
    logging.level.io.awspring.cloud=debug
    ```

### Next()
- 최상위 디렉토리에 .env 생성
- 필요한 변수명 작성

## nginx 프록시 설정
```
# HTTP 요청을 HTTPS로 리디렉션
server {
    listen 80;
    server_name choki.co.kr;

    # Redirect HTTP to HTTPS
    return 301 https://choki.co.kr$request_uri;
}

# HTTPS 요청을 처리
server {
    listen 443 ssl;
    server_name k11c102.p.ssafy.io;

    # Path to your SSL certificate and key
    ssl_certificate /etc/letsencrypt/live/choki.co.kr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/choki.co.kr/privkey.pem;

    # Optional: Additional SSL configurations
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDH+AESGCM:AES256+EECDH:AES256+EDH';
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;  # React Docker 컨테이너가 실행 중인 포트
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;  # 요청 타임아웃 설정
    }

    # Spring 백엔드 API 요청을 Docker 컨테이너에서 프록시 설정
    location /api {
        proxy_pass http://localhost:7001;  # Spring Docker 컨테이너가 실행 중인 포트
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;  # 요청 타임아웃 설정
    }

    location /ws {
        proxy_pass http://localhost:7001;  # Spring Docker 컨테이너가 실행 중인 포트
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 웹소켓을 위한 헤더
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 86400;  # 웹소켓 타임아웃을 늘려 안정적인 연결 유지
    }

    location /swagger {
        proxy_pass http://localhost:7001;  # Spring Docker 컨테이너가 실행 중인 포트
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;  # 요청 타임아웃 설정
    }


    location /es {
        proxy_pass https://localhost:9200;  # Spring Docker 컨테이너가 실행 중인 포트
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;  # 요청 타임아웃 설정
    }
}
```

## DB 덤프 파일 최신본

## 시연 시나리오