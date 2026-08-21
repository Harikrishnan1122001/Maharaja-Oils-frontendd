const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

/**
 * Purely presentational horizontal progress stepper for an order's
 * lifecycle. Read-only — it doesn't change orderStatus itself, it just
 * visualizes whatever status the order is already in.
 */
const OrderStatusStepper = ({ status }) => {
  const isCancelled = status === "Cancelled";
  const activeIndex = STEPS.indexOf(status);

  return (
    <div style={styles.wrap} data-reveal="1">
      {isCancelled ? (
        <div style={styles.cancelledBar}>
          <span style={styles.cancelledDot} />
          This order was cancelled
        </div>
      ) : (
        <div style={styles.steps}>
          {STEPS.map((step, i) => {
            const done = i <= activeIndex;
            const isLast = i === STEPS.length - 1;
            return (
              <div key={step} style={styles.stepItem}>
                <div style={styles.stepCol}>
                  <div style={{ ...styles.dot, ...(done ? styles.dotDone : {}) }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span style={{ ...styles.label, ...(done ? styles.labelDone : {}) }}>{step}</span>
                </div>
                {!isLast && (
                  <div style={{ ...styles.connector, ...(i < activeIndex ? styles.connectorDone : {}) }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrap: { padding: "20px 22px" },
  steps: { display: "flex", alignItems: "flex-start" },
  stepItem: { display: "flex", alignItems: "center", flex: 1, minWidth: 0 },
  stepCol: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 },
  dot: {
    width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--white)", border: "2px solid var(--line)", color: "var(--wood-soft)", fontWeight: 700,
    fontSize: "0.82rem", transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
  },
  dotDone: { background: "var(--wood)", borderColor: "var(--wood)", color: "var(--ivory)" },
  label: { fontSize: "0.72rem", fontWeight: 600, color: "var(--wood-soft)", textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "center", whiteSpace: "nowrap" },
  labelDone: { color: "var(--wood)" },
  connector: { flex: 1, height: 2, background: "var(--line)", margin: "0 6px", marginTop: 15, transition: "background 0.3s ease" },
  connectorDone: { background: "var(--wood)" },
  cancelledBar: {
    display: "flex", alignItems: "center", gap: 10, color: "var(--clay)", fontWeight: 600, fontSize: "0.9rem",
    background: "#FBE7DF", padding: "12px 16px", borderRadius: "var(--radius)",
  },
  cancelledDot: { width: 8, height: 8, borderRadius: "50%", background: "var(--clay)", display: "inline-block", flexShrink: 0 },
};

export default OrderStatusStepper;
