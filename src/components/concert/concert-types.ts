export const API_URL = "https://functions.poehali.dev/45d741fd-433c-4a63-82c0-13be20d1f2f0";
export const CONCERT_DATE = new Date("2026-04-11T15:15:00+03:00");
export const CONCERT_END = new Date("2026-04-11T16:00:00+03:00");
export const ARTIST_IMG = "https://cdn.poehali.dev/projects/e4316de2-88ee-4404-b322-a98efbb4c99d/files/c4a2489a-2ad9-4de0-91e3-ea0b3042dcaa.jpg";

export type Zone = "vip" | "premium" | "standard" | "fan";

export interface Seat {
  id: number;
  row: number;
  seat: number;
  zone: Zone;
  price: number;
  taken: boolean;
}

export const ZONE_CONFIG: Record<Zone, { label: string; color: string; bg: string; price: number }> = {
  vip:      { label: "VIP",      color: "#dc2626", bg: "bg-red-700",    price: 5000 },
  premium:  { label: "Премиум",  color: "#ea580c", bg: "bg-orange-600", price: 3000 },
  standard: { label: "Стандарт", color: "#2563eb", bg: "bg-blue-600",   price: 1500 },
  fan:      { label: "Фанзона",  color: "#16a34a", bg: "bg-green-700",  price: 800  },
};

export function getEventStatus(now: Date) {
  if (now >= CONCERT_END) return "ended";
  if (now >= CONCERT_DATE) return "started";
  return "upcoming";
}

export function getRowZone(row: number): Zone {
  if (row <= 2) return "vip";
  if (row <= 5) return "premium";
  if (row <= 10) return "standard";
  return "fan";
}
