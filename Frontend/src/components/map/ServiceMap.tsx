import type { ReactNode } from "react";

interface LocationPickerModalProps {
  children?: ReactNode;
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onSelect?: (location: any) => void;
  [key: string]: any;
}

export function LocationPickerModal({
  children,
  isOpen,
  open,
  onClose,
}: LocationPickerModalProps) {
  const visible = isOpen ?? open ?? false;

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>Choose Location</h2>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {children || (
          <p style={{ color: "#666" }}>
            Select your service location.
          </p>
        )}
      </div>
    </div>
  );
}

export default LocationPickerModal;
