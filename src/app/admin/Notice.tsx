import * as ui from "./adminUi";

export default function Notice({ text }: { text: string }) {
  return (
    <div style={ui.card}>
      <p style={{ fontSize: 15, margin: 0 }}>{text}</p>
    </div>
  );
}
