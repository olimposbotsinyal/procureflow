// web/src/components/ProfitabilityBadge.tsx
/**
 * Masraf tasarrufu (profitability) göstergesi
 */
interface ProfitabilityBadgeProps {
  amount?: number | null;
  percent?: number | null;
}

export function ProfitabilityBadge({ amount, percent }: ProfitabilityBadgeProps) {
  if (amount === null || amount === undefined || amount === 0) {
    return null;
  }

  const isPositive = amount > 0;
  const color = isPositive ? "#10b981" : "#ef4444";
  const bgColor = isPositive ? "#ecfdf5" : "#fef2f2";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: "4px",
        background: bgColor,
        color: color,
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {isPositive ? "+" : "-"}₺{Math.abs(amount).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
      {percent !== null && percent !== undefined && ` (${isPositive ? "+" : "-"}${Math.abs(percent).toFixed(1)}%)`}
    </span>
  );
}
