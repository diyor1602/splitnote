import { useState, useRef, useEffect, Fragment } from "react";
import TextArea from "./components/TextArea";
import Toolbar from "./components/Toolbar";

let _id = 0;
const uid = () => ++_id;

const countWords = (text) => {
  if (!text.trim()) return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
};

const MIN_WIDTH = 15;
const MAX_PANELS = 6;

const loadState = () => {
  try {
    const saved = localStorage.getItem("splitnote_v2");
    if (saved) {
      const panels = JSON.parse(saved);
      if (Array.isArray(panels) && panels.length > 0) {
        _id = Math.max(...panels.map((p) => p.id)) + 1;
        return panels;
      }
    }
  } catch {
    void 0;
  }
  // migrate from v1
  const left = localStorage.getItem("leftText") ?? "";
  const right = localStorage.getItem("rightText") ?? "";
  return [
    { id: uid(), text: left, width: 50 },
    { id: uid(), text: right, width: 50 },
  ];
};

const App = () => {
  const [panels, setPanels] = useState(loadState);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") ?? "dark",
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [confirmId, setConfirmId] = useState(null);
  const containerRef = useRef(null);
  const drag = useRef(null);

  const commit = (next) => {
    setPanels(next);
    localStorage.setItem("splitnote_v2", JSON.stringify(next));
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!drag.current || !containerRef.current) return;
      const { idx, startX, startWidths } = drag.current;
      const rect = containerRef.current.getBoundingClientRect();
      const delta = ((e.clientX - startX) / rect.width) * 100;
      let a = startWidths[idx] + delta;
      let b = startWidths[idx + 1] - delta;
      if (a < MIN_WIDTH) {
        b -= MIN_WIDTH - a;
        a = MIN_WIDTH;
      }
      if (b < MIN_WIDTH) {
        a -= MIN_WIDTH - b;
        b = MIN_WIDTH;
      }
      a = Math.max(MIN_WIDTH, a);
      b = Math.max(MIN_WIDTH, b);
      setPanels((prev) =>
        prev.map((p, i) =>
          i === idx
            ? { ...p, width: a }
            : i === idx + 1
              ? { ...p, width: b }
              : p,
        ),
      );
    };
    const onUp = () => {
      if (!drag.current) return;
      drag.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setPanels((prev) => {
        localStorage.setItem("splitnote_v2", JSON.stringify(prev));
        return prev;
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const handleChange = (id, value) => {
    commit(panels.map((p) => (p.id === id ? { ...p, text: value } : p)));
  };

  const addPanel = () => {
    if (panels.length >= MAX_PANELS) return;
    const count = panels.length + 1;
    const factor = panels.length / count;
    commit([
      ...panels.map((p) => ({ ...p, width: p.width * factor })),
      { id: uid(), text: "", width: 100 / count },
    ]);
    setActiveIdx(panels.length);
  };

  const doRemove = (id) => {
    const idx = panels.findIndex((p) => p.id === id);
    const removed = panels[idx];
    const next = panels.filter((_, i) => i !== idx);
    const perPanel = removed.width / next.length;
    const updated = next.map((p) => ({ ...p, width: p.width + perPanel }));
    commit(updated);
    setActiveIdx((prev) => Math.min(prev, updated.length - 1));
    setConfirmId(null);
  };

  const removePanel = (id) => {
    if (panels.length <= 1) return;
    const panel = panels.find((p) => p.id === id);
    if (panel.text.trim()) {
      setConfirmId(id);
    } else {
      doRemove(id);
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const isDark = theme === "dark";

  const divClass = `w-1.5 shrink-0 cursor-col-resize transition-colors ${
    isDark ? "bg-gray-700 hover:bg-blue-500" : "bg-gray-200 hover:bg-blue-400"
  }`;
  const labelClass = `text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`;
  const closeClass = `text-xs leading-none transition-colors cursor-pointer ${
    isDark
      ? "text-gray-600 hover:text-red-400"
      : "text-gray-400 hover:text-red-500"
  }`;
  const wcClass = isDark
    ? "text-xs mt-1 text-gray-400"
    : "text-xs mt-1 text-gray-500";

  return (
    <div
      className={`h-screen w-screen flex flex-col ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Toolbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onAddPanel={addPanel}
        canAddPanel={panels.length < MAX_PANELS}
      />

      {/* Mobile: tab bar */}
      <div
        className={`flex md:hidden shrink-0 overflow-x-auto border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {panels.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActiveIdx(i)}
            className={`shrink-0 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeIdx === i
                ? isDark
                  ? "bg-gray-800"
                  : "bg-white"
                : isDark
                  ? "bg-gray-900 text-gray-400"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            Note {i + 1}
          </button>
        ))}
        {panels.length < MAX_PANELS && (
          <button
            onClick={addPanel}
            className={`shrink-0 px-3 py-2 text-sm cursor-pointer ${
              isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
            title="Add panel"
          >
            +
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {/* Desktop: multi-panel resizable */}
        <div className="hidden md:flex h-full" ref={containerRef}>
          {panels.map((panel, i) => (
            <Fragment key={panel.id}>
              <div
                style={{ width: `${panel.width}%` }}
                className="flex flex-col min-w-0"
              >
                <div className="flex items-center justify-between px-3 pt-2 pb-0">
                  <span className={labelClass}>Note {i + 1}</span>
                  {panels.length > 1 && (
                    <button
                      onClick={() => removePanel(panel.id)}
                      className={closeClass}
                      title="Close panel"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="flex-1 flex flex-col px-3 pb-3 pt-1 min-h-0">
                  <TextArea
                    isDark={isDark}
                    className="flex-1 min-h-0 resize-none"
                    value={panel.text}
                    onChange={(e) => handleChange(panel.id, e.target.value)}
                    placeholder="Start typing..."
                    autoComplete="off"
                  />
                  <p className={wcClass}>{countWords(panel.text)} words</p>
                </div>
              </div>
              {i < panels.length - 1 && (
                <div
                  className={divClass}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    drag.current = {
                      idx: i,
                      startX: e.clientX,
                      startWidths: panels.map((p) => p.width),
                    };
                    document.body.style.cursor = "col-resize";
                    document.body.style.userSelect = "none";
                  }}
                  onDoubleClick={() => {
                    const total = panels[i].width + panels[i + 1].width;
                    commit(
                      panels.map((p, j) =>
                        j === i || j === i + 1 ? { ...p, width: total / 2 } : p,
                      ),
                    );
                  }}
                />
              )}
            </Fragment>
          ))}
        </div>

        {/* Mobile: single active panel */}
        <div className="flex md:hidden flex-col p-3 h-full">
          {panels[activeIdx] && (
            <>
              <TextArea
                isDark={isDark}
                className="flex-1 min-h-0 resize-none"
                value={panels[activeIdx].text}
                onChange={(e) =>
                  handleChange(panels[activeIdx].id, e.target.value)
                }
                placeholder="Start typing..."
                autoComplete="off"
              />
              <div className="flex items-center justify-between mt-1">
                <p className={wcClass}>
                  {countWords(panels[activeIdx].text)} words
                </p>
                {panels.length > 1 && (
                  <button
                    onClick={() => removePanel(panels[activeIdx].id)}
                    className={`text-xs transition-colors cursor-pointer ${
                      isDark
                        ? "text-gray-600 hover:text-red-400"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    Remove
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {confirmId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setConfirmId(null)}
        >
          <div
            className={`rounded-lg shadow-xl p-5 w-72 ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-medium mb-1">Delete this note?</p>
            <p
              className={`text-xs mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              This note has content that will be permanently lost.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmId(null)}
                className={`px-3 py-1.5 text-sm rounded cursor-pointer transition-colors ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => doRemove(confirmId)}
                className="px-3 py-1.5 text-sm rounded cursor-pointer bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
