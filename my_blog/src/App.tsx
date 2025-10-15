import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          FSD 블로그 프로젝트
        </h1>
        <p className="text-gray-600 mb-6">Shadcn/ui 컴포넌트 테스트</p>

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
  );
}

export default App;
