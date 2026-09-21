import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export function OgCard({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#07090d",
        color: "#e8edf5",
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 48,
          bottom: 48,
          width: 4,
          background: "#3ee0c8",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 88px 72px 112px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#3ee0c8",
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: title.length > 42 ? 52 : 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            maxWidth: 960,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 28,
              color: "#9aa3b5",
              maxWidth: 880,
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function renderOgImage(props: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return new ImageResponse(<OgCard {...props} />, {
    ...size,
  });
}
