import type { Text } from "./frame";

export function Text({ text }: { text: Text }) {
  return (
    <div style={{ left: text.x, top: text.y }} className="absolute">
      {text.text}
    </div>
  );
}
