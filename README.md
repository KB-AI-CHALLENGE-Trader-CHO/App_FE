# 📱 AIvestLog - 투자 매매일지 앱

개인 투자자들을 위한 캘린더 기반 매매일지 기록 및 AI 분석 앱입니다.

## 🎯 주요 기능

- **📅 캘린더 기반 매매일지**: 날짜별 거래 내역 관리
- **📝 거래 기록**: 매수/매도 내역 상세 기록
- **🔍 종목 자동완성**: 실시간 종목 검색 및 자동완성
- **📊 AI 분석 리포트**: 주간/월간 투자 성과 분석
- **📈 통계 분석**: 거래 패턴 및 수익률 분석
- **🎨 KB 브랜드 디자인**: KB Yellow & Gray 컬러 테마

## 🛠 기술 스택

- **Frontend**: React Native + Expo
- **Language**: TypeScript
- **UI Library**: React Native Paper, React Native Calendars
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: AsyncStorage (로컬 데이터 저장)
- **Charts**: React Native Chart Kit
- **Icons**: Expo Vector Icons

## 📋 요구사항

- Node.js 16.0 이상
- npm 또는 yarn
- Expo CLI
- Android Studio (Android 개발용)
- Xcode (iOS 개발용, macOS만)

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/AinvestLog.git
```

### 2. 의존성 설치

```bash
npm install
```

### 3. Expo CLI 설치 (전역)

```bash
npm install -g @expo/cli
```

### 4. 앱 실행

#### 개발 모드

```bash
npx expo start
```

#### 특정 플랫폼 실행

```bash
# Android
npx expo start --android

# iOS
npx expo start --ios

# 웹
npx expo start --web
```

### 5. QR 코드 스캔 (모바일 테스트)

1. Expo Go 앱을 스마트폰에 설치
2. 터미널에 표시된 QR 코드를 스캔
3. 앱이 모바일에서 실행됩니다

## 📁 프로젝트 구조

```
AinvestLog/
├── src/
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── TradeModal.tsx
│   │   ├── SymbolAutoComplete.tsx
│   │   └── ...
│   ├── screens/            # 화면 컴포넌트
│   │   ├── HomeScreen.tsx
│   │   ├── AiReportScreen.tsx
│   │   └── StatsScreen.tsx
│   ├── models/             # 데이터 타입 정의
│   │   └── Trade.ts
│   ├── hooks/              # 커스텀 훅
│   ├── utils/              # 유틸리티 함수
│   ├── constants/          # 상수 정의
│   └── storage/            # 데이터 저장 관련
├── assets/                 # 이미지, 폰트 등
├── App.tsx                 # 앱 진입점
└── package.json
```

## 🎨 디자인 시스템

### 브랜드 컬러

- **KB Yellow**: `#FFCC00` - 주요 액션, 강조 요소
- **KB Gray**: `#645B4C` - 텍스트, 라벨, 기본 정보

### 주요 컴포넌트

- 캘린더: 날짜 선택 및 거래 내역 표시
- 거래 모달: 매수/매도 정보 입력
- 자동완성: 종목 검색 및 선택
- 통계 차트: 거래 패턴 시각화

## 📱 주요 화면

### 1. 홈 화면 (HomeScreen)

- 월별 캘린더 뷰
- 선택된 날짜의 거래 내역
- 매매일지 추가 버튼

### 2. 거래 입력 모달 (TradeModal)

- 종목명 자동완성
- 매수/매도 유형 선택
- 수량, 단가, 평단가 입력
- 메모 기능

### 3. AI 리포트 화면 (AiReportScreen)

- 주간/월간 투자 분석
- AI 기반 성과 리포트
- 프리미엄 기능

### 4. 통계 화면 (StatsScreen)

- 거래 패턴 분석
- 수익률 차트
- 종목별 통계

## 🔧 개발 가이드

### 새로운 컴포넌트 추가

1. `src/components/` 폴더에 컴포넌트 생성
2. TypeScript 타입 정의
3. KB 브랜드 컬러 적용

### 새로운 화면 추가

1. `src/screens/` 폴더에 화면 생성
2. 네비게이션 설정
3. 필요한 컴포넌트 import

### 데이터 모델 수정

1. `src/models/` 폴더의 타입 정의 수정
2. 관련 컴포넌트 업데이트
3. 저장소 로직 수정

## 🚀 배포

### Expo 빌드

```bash
# Android APK 빌드
npx expo build:android

# iOS IPA 빌드
npx expo build:ios
```

### 스토어 배포

1. Expo 빌드 완료 후 다운로드
2. 각 플랫폼 스토어에 업로드
3. 심사 및 배포

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**AIvestLog** - 더 나은 투자 결정을 위한 스마트한 매매일지 📈
