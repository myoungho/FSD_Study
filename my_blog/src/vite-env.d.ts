/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  // 필요한 환경 변수를 여기에 추가하세요
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
