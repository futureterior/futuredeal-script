# FutureDeal 대본 자동화 시스템

퓨처테리어 퓨처딜 영상 대본을 자동 생성하는 내부 툴입니다.

## 기능
- 제품명 + 링크 입력 → 롱폼 8~12분 대본 자동 생성
- 퓨처딜 오프닝 / 채널 구독 / 설명란 CTA / 마감 압박 멘트 자동 포함
- 정보 검증 버튼 (스펙/수치 팩트체크)
- 추가 조사 버튼 (웹서치로 리뷰/경쟁사 정보 보강)

## Netlify 배포 방법

### 1. GitHub에 올리기
```bash
git init
git add .
git commit -m "init futuredeal script generator"
git remote add origin https://github.com/YOUR_REPO
git push -u origin main
```

### 2. Netlify 연결
- netlify.com → New site from Git → GitHub 레포 선택
- Build command: (비워두기)
- Publish directory: `.`

### 3. 환경변수 설정 (필수!)
Netlify 대시보드 → Site settings → Environment variables
```
ANTHROPIC_API_KEY = sk-ant-...
```

### 4. index.html 수정
배포 후 `index.html`에서:
```javascript
const DEV_MODE = false; // ← false로 변경
const DEV_API_KEY = '';  // ← 비워두기 (Netlify 환경변수 사용)
```

## 로컬 테스트 방법
1. `index.html`에서 `DEV_MODE = true` 확인
2. `DEV_API_KEY = 'sk-ant-...'` 입력
3. 브라우저에서 `index.html` 직접 열기

## 비용 관리
- Claude Sonnet 4 기준 대본 1개 생성 ≈ 약 20~30원
- Netlify 환경변수로 API 키 관리 (프론트에 노출 없음)
- 월 사용량은 Anthropic 콘솔에서 모니터링 가능

## 파일 구조
```
futuredeal-script/
├── index.html              ← 메인 앱
├── netlify.toml            ← Netlify 설정
├── README.md
└── netlify/
    └── functions/
        └── claude.js       ← API 프록시 (API 키 보호)
```
