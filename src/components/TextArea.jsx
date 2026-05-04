const TextArea = ({ className = "", isDark = true, ...props }) => {
  const base = isDark
    ? "bg-gray-800 text-white placeholder-gray-500"
    : "bg-white text-gray-900 placeholder-gray-400 border border-gray-200";
  return (
    <textarea
      className={`w-full p-4 focus:outline-none rounded ${base} ${className}`}
      {...props}
    />
  );
};

export default TextArea;
