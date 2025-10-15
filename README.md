# 📚 FSD 아키텍처 학습 프로젝트: 블로그 애플리케이션

## 🎯 프로젝트 개요
- **기술 스택**: React + TypeScript + Vite + Shadcn/ui + Tailwind CSS v4
- **아키텍처**: Feature-Sliced Design (FSD)
- **프로젝트**: 블로그 애플리케이션
- **Node 버전**: v22.20.0

## 📖 FSD란?

Feature-Sliced Design은 프론트엔드 프로젝트를 위한 아키텍처 방법론입니다.
- **목표**: 코드의 확장성, 유지보수성, 이해하기 쉬운 구조
- **핵심 원칙**: 레이어별 책임 분리, 단방향 의존성

## 🏗️ FSD 레이어 구조

```
src/
├── app/          # 애플리케이션 진입점 (라우터, 글로벌 프로바이더, 전역 스타일)
├── pages/        # 페이지 컴포넌트 (라우트별 페이지)
├── widgets/      # 독립적인 복합 UI 블록 (Header, PostList, Sidebar 등)
├── features/     # 사용자 기능/비즈니스 시나리오 (CreatePost, LikePost 등)
├── entities/     # 비즈니스 엔티티 (Post, User, Comment)
└── shared/       # 재사용 가능한 공통 코드 (UI kit, utils, 헬퍼)
```

### 레이어 의존성 규칙 (중요!)
```
app → pages → widgets → features → entities → shared
```
- 상위 레이어는 하위 레이어만 import 가능
- 하위 레이어는 상위 레이어를 절대 import 불가
- 같은 레이어 내에서는 cross-import 금지

## 📋 학습 단계 (총 12단계)

### 기본 설정 (1-3단계)
- [ ] **1단계**: Vite + React + TypeScript 프로젝트 생성
- [ ] **2단계**: Tailwind CSS v4 설정 및 구성
- [ ] **3단계**: Shadcn/ui 초기 설정

### FSD 아키텍처 구성 (4-5단계)
- [ ] **4단계**: FSD 폴더 구조 생성 및 각 레이어 상세 설명
- [ ] **5단계**: 절대 경로 import 설정 (path alias)

### FSD 레이어별 구현 (6-11단계)
- [ ] **6단계**: entities 레이어 - 비즈니스 엔티티 (Post, User, Comment)
- [ ] **7단계**: shared 레이어 - 공통 UI 컴포넌트와 유틸리티
- [ ] **8단계**: features 레이어 - 사용자 기능 (CreatePost, LikePost, CommentPost)
- [ ] **9단계**: widgets 레이어 - 복합 블록 (PostList, Header, Sidebar)
- [ ] **10단계**: pages 레이어 - 페이지 조합 (HomePage, PostDetailPage)
- [ ] **11단계**: app 레이어 - 앱 진입점 (라우터, 프로바이더)

### 코드 품질 (12단계)
- [ ] **12단계**: ESLint + FSD 플러그인으로 아키텍처 규칙 강제

## 🎓 학습 목표

각 단계를 완료하면:
1. ✅ FSD 아키텍처의 핵심 개념 이해
2. ✅ 레이어별 책임과 역할 구분
3. ✅ 의존성 규칙을 준수하는 코드 작성
4. ✅ 확장 가능하고 유지보수하기 쉬운 프로젝트 구조
5. ✅ 실전 프로젝트에 바로 적용 가능한 스킬

## 📁 상세 Task 파일

각 단계별 상세 내용은 `tasks/` 폴더에서 확인:
- [1단계: Vite 프로젝트 생성](./tasks/step-01-vite-setup.md)
- [2단계: Tailwind CSS v4](./tasks/step-02-tailwind-setup.md)
- [3단계: Shadcn/ui](./tasks/step-03-shadcn-setup.md)
- [4단계: FSD 구조](./tasks/step-04-fsd-structure.md)
- [5단계: Path Alias](./tasks/step-05-path-alias.md)
- [6단계: Entities](./tasks/step-06-entities.md)
- [7단계: Shared](./tasks/step-07-shared.md)
- [8단계: Features](./tasks/step-08-features.md)
- [9단계: Widgets](./tasks/step-09-widgets.md)
- [10단계: Pages](./tasks/step-10-pages.md)
- [11단계: App](./tasks/step-11-app.md)
- [12단계: ESLint](./tasks/step-12-eslint.md)

## 🚀 시작하기

1. 현재 디렉토리에서 시작
2. 각 단계를 순서대로 진행
3. 각 단계별 task 파일을 참고하여 학습

---

**참고 자료**
- [FSD 공식 문서](https://feature-sliced.design/)
- [Vite 공식 문서](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
