# 3단계: Shadcn/ui 초기 설정

## 📝 이 단계에서 배울 내용
- Shadcn/ui의 개념과 특징
- Shadcn/ui 설치 및 설정
- 첫 번째 컴포넌트 추가

## 🎯 Shadcn/ui란?

**Shadcn/ui**는 복사-붙여넣기 방식의 컴포넌트 라이브러리입니다.

### 기존 라이브러리와의 차이:
| 특징 | MUI/Ant Design | Shadcn/ui |
|------|---------------|-----------|
| 설치 방식 | npm 패키지 | 소스코드 복사 |
| 커스터마이징 | 제한적 | 완전한 제어 |
| 번들 크기 | 전체 라이브러리 | 필요한 것만 |
| 소유권 | 라이브러리 | 내 프로젝트 |

### 왜 Shadcn/ui인가?
- ✅ **완전한 제어** - 소스코드를 직접 수정 가능
- ✅ **Zero 의존성** - npm 패키지 아님, 코드를 복사
- ✅ **Tailwind 기반** - 커스터마이징 쉬움
- ✅ **접근성** - WAI-ARIA 준수
- ✅ **FSD 친화적** - shared/ui에 완벽하게 맞음

## ✅ 실행할 명령어

### 1. Shadcn/ui 초기화
```bash
npx shadcn@latest init
```

**설정 선택 (대화형):**
```
✔ Preflight and global CSS variables? yes
✔ Where is your global CSS file? src/index.css
✔ Configure the import alias for components? @/components
✔ Configure the import alias for utils? @/lib/utils
✔ Are you using React Server Components? no
✔ Write configuration to components.json? yes
```

### 2. 첫 번째 컴포넌트 추가
```bash
npx shadcn@latest add button
```

이 명령어는:
- `src/components/ui/button.tsx` 생성
- 필요한 유틸리티 함수 생성
- Tailwind 설정 업데이트

## 📂 생성되는 구조

```
FSD_Study/
├── src/
│   ├── components/         # Shadcn 컴포넌트 (나중에 shared/ui로 이동)
│   │   └── ui/
│   │       └── button.tsx
│   └── lib/
│       └── utils.ts        # cn() 유틸리티
├── components.json         # Shadcn 설정
└── tailwind.config.ts      # 업데이트됨
```

## 🧪 Button 컴포넌트 테스트

### App.tsx 수정:
```tsx
import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          FSD 블로그 프로젝트
        </h1>
        <p className="text-gray-600 mb-6">
          Shadcn/ui 컴포넌트 테스트
        </p>

        <div className="space-y-3">
          <Button className="w-full">기본 버튼</Button>
          <Button variant="secondary" className="w-full">
            보조 버튼
          </Button>
          <Button variant="outline" className="w-full">
            아웃라인 버튼
          </Button>
          <Button variant="ghost" className="w-full">
            고스트 버튼
          </Button>
          <Button variant="destructive" className="w-full">
            삭제 버튼
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
```

## 🎨 유용한 Shadcn/ui 컴포넌트

### 추가로 설치할 수 있는 컴포넌트:
```bash
# 카드 컴포넌트
npx shadcn@latest add card

# 입력 필드
npx shadcn@latest add input

# 텍스트영역
npx shadcn@latest add textarea

# 폼 컴포넌트
npx shadcn@latest add form

# 다이얼로그
npx shadcn@latest add dialog

# 드롭다운 메뉴
npx shadcn@latest add dropdown-menu

# 아바타
npx shadcn@latest add avatar

# 뱃지
npx shadcn@latest add badge
```

## 🔍 주요 파일 설명

### `components.json`
Shadcn/ui 설정 파일:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### `src/lib/utils.ts`
`cn()` 헬퍼 함수 - 조건부 클래스 병합:
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**사용 예:**
```tsx
<Button className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>
  버튼
</Button>
```

## 🎓 FSD와 Shadcn/ui

### 나중에 할 일 (4-5단계에서):
1. `src/components/ui` → `src/shared/ui`로 이동
2. path alias 업데이트
3. FSD 구조에 맞게 재구성

**FSD에서의 위치:**
```
src/
└── shared/
    └── ui/
        ├── button.tsx      # Shadcn Button
        ├── card.tsx        # Shadcn Card
        ├── input.tsx       # Shadcn Input
        └── ...
```

## 🎨 커스터마이징

### 버튼 변형 추가하기
`button.tsx`를 수정하여 새로운 variant 추가 가능:
```typescript
const buttonVariants = cva(
  "...",
  {
    variants: {
      variant: {
        default: "...",
        // 새로운 변형 추가
        success: "bg-green-500 text-white hover:bg-green-600",
      }
    }
  }
)
```

## ⚠️ 문제 해결

### Path alias 오류
`tsconfig.json` 확인:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

`vite.config.ts`에 resolve 추가:
```typescript
import path from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### 타입 오류
```bash
npm install -D @types/node
```

## 🎓 다음 단계 준비

이 단계를 완료하면:
- ✅ Shadcn/ui 설정 완료
- ✅ 기본 UI 컴포넌트 사용 가능
- ✅ 커스터마이징 가능한 컴포넌트 보유

**다음 단계**: [4단계 - FSD 폴더 구조 생성](./step-04-fsd-structure.md)

## 📚 참고 자료
- [Shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [컴포넌트 목록](https://ui.shadcn.com/docs/components)
- [테마 커스터마이징](https://ui.shadcn.com/themes)
