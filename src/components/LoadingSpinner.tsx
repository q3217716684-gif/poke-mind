// 加载动画组件
export default function LoadingSpinner({ text = "AI 分析中..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-4">
        {/* 旋转的精灵球 */}
        <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-spin border-t-transparent border-b-white border-l-white" />
        <div className="absolute inset-[12px] rounded-full border-2 border-white/20" />
        <div className="absolute inset-[20px] rounded-full bg-white/10" />
      </div>
      <p className="text-gray-400 animate-pulse">{text}</p>
    </div>
  );
}
