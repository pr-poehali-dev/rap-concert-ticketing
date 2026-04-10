import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/45d741fd-433c-4a63-82c0-13be20d1f2f0";
const CONCERT_DATE = new Date("2025-04-12T15:15:00+03:00");
const CONCERT_END = new Date("2025-04-12T16:00:00+03:00");
const ARTIST_IMG = "https://cdn.poehali.dev/projects/e4316de2-88ee-4404-b322-a98efbb4c99d/files/c4a2489a-2ad9-4de0-91e3-ea0b3042dcaa.jpg";

type Zone = "vip" | "premium" | "standard" | "fan";

interface Seat {
  id: number;
  row: number;
  seat: number;
  zone: Zone;
  price: number;
  taken: boolean;
}

const ZONE_CONFIG: Record<Zone, { label: string; color: string; bg: string; price: number }> = {
  vip:      { label: "VIP",      color: "#dc2626", bg: "bg-red-700",    price: 5000 },
  premium:  { label: "Премиум",  color: "#ea580c", bg: "bg-orange-600", price: 3000 },
  standard: { label: "Стандарт", color: "#2563eb", bg: "bg-blue-600",   price: 1500 },
  fan:      { label: "Фанзона",  color: "#16a34a", bg: "bg-green-700",  price: 800  },
};

function getEventStatus(now: Date) {
  if (now >= CONCERT_END) return "ended";
  if (now >= CONCERT_DATE) return "started";
  return "upcoming";
}

export default function Index() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(new Date());
  const [activeZoneFilter, setActiveZoneFilter] = useState<Zone | "all">("all");

  const fetchSeats = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setSeats(data.seats || []);
    } catch {
      setError("Не удалось загрузить схему зала");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeats();
    const tick = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(tick);
  }, [fetchSeats]);

  const status = getEventStatus(now);
  const allTaken = seats.length > 0 && seats.every(s => s.taken);

  const toggleSeat = (seatId: number) => {
    if (status !== "upcoming") return;
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.taken) return;
    setSelected(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const totalPrice = selected.reduce((sum, id) => {
    const s = seats.find(x => x.id === id);
    return sum + (s?.price || 0);
  }, 0);

  const handleBuy = async () => {
    if (!selected.length) return;
    setBuying(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seat_ids: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка покупки");
      setSuccess(true);
      setSelected([]);
      await fetchSeats();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка покупки");
    } finally {
      setBuying(false);
    }
  };

  // Group seats by row
  const rows = Array.from(new Set(seats.map(s => s.row))).sort((a, b) => a - b);
  const seatsByRow = rows.reduce<Record<number, Seat[]>>((acc, row) => {
    acc[row] = seats.filter(s => s.row === row);
    return acc;
  }, {});

  const getRowZone = (row: number): Zone => {
    if (row <= 2) return "vip";
    if (row <= 5) return "premium";
    if (row <= 10) return "standard";
    return "fan";
  };

  const filteredRows = activeZoneFilter === "all"
    ? rows
    : rows.filter(r => getRowZone(r) === activeZoneFilter);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Noise overlay */}
      <div className="fixed inset-0 noise-overlay z-0 pointer-events-none" />

      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="hero-glow absolute inset-0 z-0" />
        <div className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, #0a0a0a 100%)"
          }}
        />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
          <div className="font-druk text-2xl tracking-widest text-white">
            KOMAR<span className="text-red-500">.</span>TICKETS
          </div>
          <div className="flex items-center gap-3 text-xs text-white/40 font-medium uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-red-500 pulse-red inline-block" />
            Краснодар
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-0 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            {/* Left: info */}
            <div className="animate-fade-in">
              {/* FAKE badge */}
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                <Icon name="AlertTriangle" size={12} />
                Концерт ненастоящий — демо-проект
              </div>

              <div className="font-druk text-7xl lg:text-9xl leading-none mb-4 text-white">
                KOMAR
              </div>
              <div className="font-druk text-xl lg:text-2xl text-red-500 mb-8 tracking-widest">
                Краснодар · Сб, 11 апреля · 15:15
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="ticket-card px-5 py-4 rounded-lg">
                  <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Площадка</div>
                  <div className="font-druk text-lg text-white">Ozon Арена</div>
                </div>
                <div className="ticket-card px-5 py-4 rounded-lg">
                  <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Город</div>
                  <div className="font-druk text-lg text-white">Краснодар</div>
                </div>
                <div className="ticket-card px-5 py-4 rounded-lg">
                  <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Дата</div>
                  <div className="font-druk text-lg text-white">11 АПРЕЛЯ 2025</div>
                </div>
              </div>

              {status === "upcoming" && !allTaken && (
                <a
                  href="#tickets"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-druk text-sm px-8 py-4 rounded transition-all duration-200 uppercase tracking-widest"
                >
                  <Icon name="Ticket" size={16} />
                  Выбрать места
                </a>
              )}
              {status === "started" && (
                <div className="inline-flex items-center gap-2 bg-zinc-800 text-white/50 font-druk text-sm px-8 py-4 rounded uppercase tracking-widest">
                  <Icon name="Lock" size={16} />
                  Касса закрыта
                </div>
              )}
              {status === "ended" && (
                <div className="inline-flex items-center gap-2 bg-zinc-900 text-white/30 font-druk text-sm px-8 py-4 rounded uppercase tracking-widest">
                  <Icon name="Clock" size={16} />
                  Событие прошло
                </div>
              )}
              {allTaken && status === "upcoming" && (
                <div className="inline-flex items-center gap-2 bg-zinc-800 text-white/50 font-druk text-sm px-8 py-4 rounded uppercase tracking-widest">
                  <Icon name="XCircle" size={16} />
                  Билеты распроданы
                </div>
              )}
            </div>

            {/* Right: artist photo */}
            <div className="flex justify-center lg:justify-end animate-fade-in">
              <div className="relative w-72 lg:w-96">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-red-600/30 via-transparent to-transparent blur-2xl" />
                <img
                  src={ARTIST_IMG}
                  alt="KOMAR"
                  className="relative w-full rounded-2xl object-cover"
                  style={{ maxHeight: "500px", objectPosition: "top" }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-32 rounded-b-2xl"
                  style={{ background: "linear-gradient(to top, #0a0a0a, transparent)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS BANNERS */}
      {status === "started" && (
        <div className="bg-yellow-500/10 border-y border-yellow-500/20 py-4 text-center">
          <p className="font-druk text-yellow-400 tracking-widest text-sm">
            🔒 КАССА НЕДОСТУПНА — КОНЦЕРТ ИДЁТ ПРЯМО СЕЙЧАС
          </p>
        </div>
      )}
      {status === "ended" && (
        <div className="bg-zinc-900/80 border-y border-zinc-700/30 py-6 text-center">
          <p className="font-druk text-white/30 tracking-widest text-lg">
            СОБЫТИЕ ПРОШЛО
          </p>
        </div>
      )}
      {allTaken && status === "upcoming" && (
        <div className="bg-red-950/40 border-y border-red-900/30 py-6 text-center">
          <p className="font-druk text-red-400 tracking-widest text-lg">
            🎟 ВСЕ БИЛЕТЫ РАСКУПЛЕНЫ
          </p>
          <p className="text-white/40 text-sm mt-1">Следите за анонсами в соцсетях</p>
        </div>
      )}

      {/* TICKETS SECTION */}
      {status === "upcoming" && !allTaken && (
        <section id="tickets" className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="font-druk text-4xl lg:text-5xl mb-3">ВЫБОР МЕСТ</div>
            <p className="text-white/40 text-sm uppercase tracking-widest">Нажмите на место, чтобы выбрать</p>
          </div>

          {/* Zone Legend */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {(["all", "vip", "premium", "standard", "fan"] as const).map(z => {
              const cfg = z === "all" ? null : ZONE_CONFIG[z];
              const isActive = activeZoneFilter === z;
              const available = z === "all"
                ? seats.filter(s => !s.taken).length
                : seats.filter(s => s.zone === z && !s.taken).length;
              return (
                <button
                  key={z}
                  onClick={() => setActiveZoneFilter(z)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    isActive
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  {cfg && (
                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: cfg.color }} />
                  )}
                  {z === "all" ? "Все зоны" : cfg!.label}
                  <span className="text-xs opacity-60 ml-1">{available}</span>
                  {z !== "all" && (
                    <span className="text-xs font-druk ml-1" style={{ color: cfg!.color }}>
                      {cfg!.price.toLocaleString("ru")} ₽
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Stage indicator */}
          <div className="flex justify-center mb-6">
            <div className="px-16 py-2 bg-white/5 border border-white/10 rounded-sm font-druk text-xs tracking-[0.4em] text-white/30 uppercase">
              Сцена
            </div>
          </div>

          {/* Seat map */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[600px] space-y-1.5">
                {filteredRows.map(rowNum => {
                  const rowSeats = seatsByRow[rowNum] || [];
                  const zone = getRowZone(rowNum);
                  const cfg = ZONE_CONFIG[zone];
                  return (
                    <div key={rowNum} className="flex items-center gap-2">
                      <div className="w-8 text-right text-white/20 text-xs font-mono">{rowNum}</div>
                      <div
                        className="w-1 h-5 rounded-full opacity-60"
                        style={{ background: cfg.color }}
                      />
                      <div className="flex gap-1 flex-wrap">
                        {rowSeats.map(seat => {
                          const isTaken = seat.taken;
                          const isSelected = selected.includes(seat.id);
                          return (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat.id)}
                              title={`Ряд ${seat.row}, Место ${seat.seat} — ${cfg.label} — ${seat.price.toLocaleString("ru")} ₽`}
                              disabled={isTaken}
                              className={`w-6 h-6 rounded-sm text-[8px] font-bold transition-all duration-150 ${
                                isTaken
                                  ? "opacity-20 cursor-not-allowed"
                                  : isSelected
                                  ? "ring-2 ring-white scale-110"
                                  : "seat-available hover:opacity-90 cursor-pointer"
                              }`}
                              style={{
                                background: isTaken
                                  ? `${cfg.color}33`
                                  : isSelected
                                  ? "#ffffff"
                                  : cfg.color,
                                color: isSelected ? cfg.color : "rgba(255,255,255,0.9)",
                              }}
                            >
                              {seat.seat}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cart */}
          {selected.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-fade-in">
              <div className="ticket-card rounded-2xl p-5 shadow-2xl border border-white/10 backdrop-blur-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-druk text-lg text-white">
                      {selected.length} {selected.length === 1 ? "место" : selected.length < 5 ? "места" : "мест"}
                    </div>
                    <div className="text-white/40 text-xs mt-0.5">
                      {selected.map(id => {
                        const s = seats.find(x => x.id === id);
                        return s ? `Р${s.row}М${s.seat}` : "";
                      }).join(", ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-druk text-2xl text-red-500">
                      {totalPrice.toLocaleString("ru")} ₽
                    </div>
                    <button
                      onClick={() => setSelected([])}
                      className="text-white/30 text-xs hover:text-white/60 mt-0.5"
                    >
                      Очистить
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-3 py-2 rounded mb-3">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleBuy}
                  disabled={buying}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-900/50 text-white font-druk text-sm py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  {buying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Оформляем…
                    </>
                  ) : (
                    <>
                      <Icon name="CreditCard" size={16} />
                      Купить билеты
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={() => setSuccess(false)}
            >
              <div className="ticket-card rounded-2xl p-10 text-center max-w-sm mx-4 border border-green-900/50 animate-fade-in">
                <div className="text-5xl mb-4">🎟</div>
                <div className="font-druk text-3xl text-green-400 mb-2">ГОТОВО!</div>
                <p className="text-white/60 mb-6">Билеты успешно куплены. Спасибо за покупку!</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-green-700 hover:bg-green-600 text-white font-druk text-sm px-8 py-3 rounded-lg uppercase tracking-widest"
                >
                  Закрыть
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-druk text-white/20 text-sm tracking-widest">KOMAR.TICKETS</div>
          <div className="text-white/20 text-xs text-center">
            ⚠️ Это ненастоящий концерт. Демо-проект. Оплата не производится.
          </div>
          <div className="text-white/20 text-xs">Ozon Арена, Краснодар</div>
        </div>
      </footer>
    </div>
  );
}
