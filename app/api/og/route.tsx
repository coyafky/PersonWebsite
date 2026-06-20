import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Coya's Site";
  const date = searchParams.get("date") ?? "";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "80px",
        background: "linear-gradient(135deg, #1A2138 0%, #2A3656 100%)",
        color: "#FBF7EF",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <svg width="48" height="48" viewBox="0 0 128 128" fill="none">
          <rect width="128" height="128" rx="28" fill="#FBF7EF" />
          <path d="M31 38C31 33.5817 34.5817 30 39 30H89C93.4183 30 97 33.5817 97 38V90C97 94.4183 93.4183 98 89 98H39C34.5817 98 31 94.4183 31 90V38Z" fill="#1A2138" />
        </svg>
        <span style={{ fontSize: "24px", color: "#A07A8C" }}>Coya&apos;s Site</span>
      </div>
      <h1
        style={{
          fontSize: "48px",
          fontWeight: 700,
          lineHeight: 1.3,
          margin: "0 0 16px",
          maxWidth: "900px",
        }}
      >
        {title}
      </h1>
      {date ? (
        <p style={{ fontSize: "20px", color: "#C9A66B", margin: 0 }}>{date}</p>
      ) : null}
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
