// src/components/Game/Cell.jsx
export default function Cell({ value, onClick, isWinning }) {
  return (
    <button
      onClick={onClick}
      className={`cell ${value} ${value ? "filled" : ""} ${isWinning ? "winning" : isWinning}`}
      disabled={value != null}
    >
      {value}
    </button>
  );
}
