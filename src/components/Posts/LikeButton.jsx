import React, { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";

export default function LikeButton({ count, liked, onClick }) {
  return (
    <button
      className={`flex items-center gap-1 px-2 py-1 rounded transition-colors duration-150 text-sm font-semibold ${liked ? 'bg-[#4A2343] text-white' : 'bg-gray-100 text-[#4A2343]'} hover: cursor-pointer`}
      onClick={e => { e.stopPropagation(); onClick && onClick(e); }}
      type="button"
    >
      <FaThumbsUp />
      <span>{count}</span>
    </button>
  );
}