const TextArea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`w-full bg-gray-800 p-4 focus:outline-none ${className}`}
      {...props}
    />
  );
};

export default TextArea;
