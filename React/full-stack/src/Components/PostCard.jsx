import React from "react";

function PostCard({ name, price, description, instock }) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 max-w-xs bg-white shadow-md flex flex-col justify-between min-h-[220px]">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{name}</h2>
      <p className="text-gray-600 mb-4 text-sm flex-1">{description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-bold text-green-700 text-base">${price}</span>
        {instock ? (
          <button className="bg-green-700 hover:bg-green-800 text-white rounded px-4 py-1 text-sm font-medium transition-colors">Buy Now</button>
        ) : (
          <span className="text-red-600 font-semibold text-sm">Out of Stock</span>
        )}
      </div>
    </div>
  );
}

export default PostCard;
