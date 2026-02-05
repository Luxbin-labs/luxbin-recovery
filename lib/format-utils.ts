export function weiToEth(wei: string, decimals: number = 18): string {
  if (!wei || wei === "0") return "0";
  const value = BigInt(wei);
  const divisor = BigInt(10 ** decimals);
  const whole = value / divisor;
  const remainder = value % divisor;
  const remainderStr = remainder.toString().padStart(decimals, "0").slice(0, 6);
  const trimmed = remainderStr.replace(/0+$/, "");
  if (!trimmed) return whole.toString();
  return `${whole}.${trimmed}`;
}

export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(timestamp: string): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function truncateAddress(address: string, chars: number = 6): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatUSD(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function todayFormatted(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
