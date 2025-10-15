// App.tsx에서 테스트
import { formatDate, formatRelativeTime, formatNumber } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { useLocalStorage, useIsMobile } from "@/shared/hooks";
import { CATEGORIES } from "@/shared/config";

function App() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const isMobile = useIsMobile();

  return (
    <div className="p-8">
      <h1>Shared 레이어 테스트</h1>

      <div className="space-y-4">
        <p>오늘: {formatDate(new Date())}</p>
        <p>1시간 전: {formatRelativeTime(new Date(Date.now() - 3600000))}</p>
        <p>조회수: {formatNumber(12500)}</p>
        <p>테마: {theme}</p>
        <p>모바일: {isMobile ? "Yes" : "No"}</p>
        <p>카테고리: {CATEGORIES.join(", ")}</p>

        <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          테마 변경
        </Button>
      </div>
    </div>
  );
}

export default App;
