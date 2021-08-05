const corsOptions = {
  // origin: 'http://localhost:8000', // 접근 권한을 부여하는 도메인 (Web Server)
  origin: 'http://3.34.139.247:3000', // 접근 권한을 부여하는 도메인 (Web Server)
  credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
  optionsSuccessStatus: 200, // 응답 상태 200으로 설정
};

export default corsOptions;
