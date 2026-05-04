import { useState, useRef, useEffect } from "react";
import TextArea from "./components/TextArea";
import Toolbar from "./components/Toolbar";

const countWords = (text) => {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
};

const getInitialText = (side) => localStorage.getItem(`${side}Text`) ?? "";

const App = () => {
  const [leftText, setLeftText] = useState(() => getInitialText("left"));
  const [rightText, setRightText] = useState(() => getInitialText("right"));
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") ?? "dark");
  const [splitPercent, setSplitPercent] = useState(50);
  const [activePanel, setActivePanel] = useState("left");

  const containerRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPercent(Math.min(Math.max(pct, 20), 80));
    };
    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const handleLeftChange = (e) => {
    setLeftText(e.target.value);
    localStorage.setItem("leftText", e.target.value);
  };

  const handleRightChange = (e) => {
    setRightText(e.target.value);
    localStorage.setItem("rightText", e.target.value);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const isDark = theme === "dark";
  const wc = isDark ? "text-xs mt-1 text-gray-400" : "text-xs mt-1 text-gray-500";

  return (
    <div
      className={`h-screen w-screen flex flex-col ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Toolbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Mobile: tab switcher */}
      <div
        className={`flex md:hidden shrink-0 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {["left", "right"].map((p) => (
          <button
            key={p}
            onClick={() => setActivePanel(p)}
            className={`flex-1 py-2 text-sm font-medium capitalize transition-colors cursor-pointer ${
              activePanel === p
                ? isDark
                  ? "bg-gray-800"
                  : "bg-white"
                : isDark
                ? "bg-gray-900"
                : "bg-gray-100"
            }`}
          >
            {p} · {countWords(p === "left" ? leftText : rightText)} words
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop: resizable split view */}
        <div className="hidden md:flex h-full" ref={containerRef}>
          <div
            style={{ width: `${splitPercent}%` }}
            className="flex flex-col p-3 min-w-0"
          >
            <TextArea
              isDark={isDark}
              className="flex-1 min-h-0 resize-none"
              value={leftText}
              onChange={handleLeftChange}
              placeholder="Start typing..."
            />
            <p className={wc}>{countWords(leftText)} words</p>
          </div>

          <div
            className={`w-1.5 shrink-0 cursor-col-resize transition-colors ${
              isDark
                ? "bg-gray-700 hover:bg-blue-500"
                : "bg-gray-200 hover:bg-blue-400"
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              isDragging.current = true;
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
            }}
            onDoubleClick={() => setSplitPercent(50)}
          />

          <div
            style={{ width: `${100 - splitPercent}%` }}
            className="flex flex-col p-3 min-w-0"
          >
            <TextArea
              isDark={isDark}
              className="flex-1 min-h-0 resize-none"
              value={rightText}
              onChange={handleRightChange}
              placeholder="Start typing..."
            />
            <p className={wc}>{countWords(rightText)} words</p>
          </div>
        </div>

        {/* Mobile: single panel */}
        <div className="flex md:hidden flex-col p-3 h-full">
          <TextArea
            isDark={isDark}
            className="flex-1 min-h-0 resize-none"
            value={activePanel === "left" ? leftText : rightText}
            onChange={activePanel === "left" ? handleLeftChange : handleRightChange}
            placeholder="Start typing..."
          />
          <p className={wc}>
            {countWords(activePanel === "left" ? leftText : rightText)} words
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
