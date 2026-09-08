import type { ReactNode } from "react";

interface NearbyWorkerCardProps {
  worker?: any;
  workerProfile?: any;
  profile?: any;
  onClick?: () => void;
  onSelect?: () => void;
  children?: ReactNode;
  [key: string]: any;
}

export function NearbyWorkerCard({
  worker,
  workerProfile,
  profile,
  onClick,
  onSelect,
  children,
}: NearbyWorkerCardProps) {
  const data = worker || workerProfile || profile || {};

  const name =
    data?.name ||
    data?.fullName ||
    data?.workerName ||
    "Nearby Worker";

  const profession =
    data?.profession ||
    data?.service ||
    data?.category ||
    "Service Professional";

  const rating = data?.rating ?? data?.averageRating ?? "—";

  const distance = data?.distance ?? data?.distanceKm;

  return (
    <div
      onClick={onClick || onSelect}
      style={{
        width: "100%",
        padding: "16px",
        marginBottom: "12px",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        background: "#fff",
        cursor: onClick || onSelect ? "pointer" : "default",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            flexShrink: 0,
          }}
        >
          👤
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: "16px" }}>{name}</h3>

          <p
            style={{
              margin: "4px 0",
              color: "#666",
              fontSize: "14px",
            }}
          >
            {profession}
          </p>

          <div style={{ fontSize: "13px", color: "#777" }}>
            ⭐ {rating}
            {distance !== undefined && ` • ${distance} km away`}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}

export default NearbyWorkerCard;
