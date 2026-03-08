// src/components/Cell.jsx
import React from "react";

export default function Cell({ row, col, type, onClick }) {
  let className = type === 1 ? "cell wall" : "cell path";
  return (
    <div className={className} onClick={() => onClick(row,col)}>
      {type === 3 && <img src="/mouse.png" alt="mouse" style={{ width:"80%" }} />}
      {type === 2 && <img src="/cheese.webp" alt="cheese" style={{ width:"80%" }} />}
    </div>
  );
}