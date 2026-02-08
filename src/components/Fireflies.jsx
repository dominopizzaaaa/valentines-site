export default function Fireflies() {
  return (
    <div className="firefly-layer">
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="firefly-dot"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );
}
