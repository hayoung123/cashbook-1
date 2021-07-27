import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const PORT: number = Number(process.env.PORT) || 4000;

const app: express.Application = express();

const corsOptions = {
  origin: 'http://localhost:3000', // 접근 권한을 부여하는 도메인 (Web Server)
  credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
  optionsSuccessStatus: 200, // 응답 상태 200으로 설정
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.all('*', (req, res, next) => {
  res.status(404).send('404');
});

app.listen(PORT, () => {
  console.log(`server opened at ${PORT}`);
});
