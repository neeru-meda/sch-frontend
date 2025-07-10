import React from "react";

export default function FileUpload({ files, setFiles }) {
  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  return (
    <div className="mb-3">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        multiple
        onChange={handleChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#4A2343] file:text-white hover:file:bg-[#34182f]"
      />
      {files.length > 0 && (
        <ul className="mt-2 text-xs text-gray-600">
          {files.map((file, idx) => (
            <li key={idx} className="flex items-center gap-2">
              {file.name}
              <button type="button" className="text-red-500 hover:underline" onClick={() => removeFile(idx)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 