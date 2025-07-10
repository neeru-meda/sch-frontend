import React from "react";

const tabs = [
  { label: "My Posts", value: "my-posts" },
  { label: "Notes", value: "notes" },
  { label: "Jobs", value: "jobs" },
  { label: "Threads", value: "threads" },
];

export default function PostFilterBar({ category, setCategory }) {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.value}
          className={`px-6 py-2 text-2xl font-bold focus:outline-none transition-all
            ${category === tab.value
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-black'}
          `}
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            marginBottom: '-1px',
            cursor: 'pointer',
          }}
          onClick={() => setCategory(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
} 