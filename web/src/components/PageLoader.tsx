// FILE: web\src\components\PageLoader.tsx
export default function PageLoader({ text = "Yükleniyor..." }: { text?: string }) {
  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <p>{text}</p>
    </div>
  );
}
