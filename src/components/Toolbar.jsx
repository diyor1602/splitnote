const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Toolbar = ({
  isDark,
  onToggleTheme,
  onShare,
  onDownloadPDF,
  shareToast,
}) => {
  const btn = isDark
    ? "p-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors cursor-pointer"
    : "p-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors cursor-pointer";

  return (
    <header
      className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${
        isDark ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <h1 className="text-lg font-semibold tracking-tight">SplitNote</h1>
      <div className="flex items-center gap-2">
        {shareToast && (
          <span
            className={`text-xs px-2 py-1 rounded ${
              shareToast.type === "warning"
                ? isDark
                  ? "bg-amber-900 text-amber-300"
                  : "bg-amber-100 text-amber-700"
                : isDark
                ? "bg-green-900 text-green-300"
                : "bg-green-100 text-green-700"
            }`}
          >
            {shareToast.message}
          </span>
        )}
        <button onClick={onShare} className={btn} title="Share notes">
          <ShareIcon />
        </button>
        <button onClick={onDownloadPDF} className={btn} title="Download as PDF">
          <DownloadIcon />
        </button>
        <button
          onClick={onToggleTheme}
          className={btn}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
};

export default Toolbar;
