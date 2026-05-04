import TextArea from "./components/TextArea";

import { useState } from "react";

const countWords = (text) => {
  if (!text.trim()) return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

const App = () => {
  const [leftText, setLeftText] = useState(
    localStorage.getItem("leftText") || "",
  );
  const [rightText, setRightText] = useState(
    localStorage.getItem("rightText") || "",
  );

  return (
    <div className="bg-gray-900 h-screen w-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mt-4">
          <div className="w-full">
            <TextArea
              className="min-h-[calc(100vh-140px)] max-h-[calc(100vh-140px)]"
              value={leftText}
              onChange={(e) => {
                setLeftText(e.target.value);
                localStorage.setItem("leftText", e.target.value);
              }}
            />
            <div className="mt-2 text-sm text-gray-400">
              {countWords(leftText)} words
            </div>
          </div>
          <div className="w-full">
            <TextArea
              className="min-h-[calc(100vh-140px)] max-h-[calc(100vh-140px)]"
              value={rightText}
              onChange={(e) => {
                setRightText(e.target.value);
                localStorage.setItem("rightText", e.target.value);
              }}
            />
            <div className="mt-2 text-sm text-gray-400">
              {countWords(rightText)} words
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
