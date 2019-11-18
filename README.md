# pNan-backend
[![Build Status](https://travis-ci.com/Skyhyunmi/pNan-backend.svg?token=cJp4ZrbSHxsQMoD64kwe&branch=master)](https://travis-ci.com/Skyhyunmi/pNan-backend)

피난처 backend 서버 저장소입니다.

## ❄️ Getting Started

This instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### 🔨 Project setup

1. install dependency with `npm install`
1. Add your Database information to `.env` like `.env.sample`
1. run server with `npm start`

### 📝 Check Lints
```
npm run lint
```

### 🐋 Dockerfile usage
```
docker build -f ./dockerfile -t pnan:dev .
docker run -it -p 3000:3000 --rm pnan:dev
```
