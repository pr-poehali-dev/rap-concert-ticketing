import { useState, useEffect, useCallback } from "react";
import HeroSection from "@/components/concert/HeroSection";
import SeatMap from "@/components/concert/SeatMap";
import { CheckoutModal, SuccessModal } from "@/components/concert/CheckoutModal";
import { API_URL, CONCERT_DATE, Zone, Seat, getEventStatus } from "@/components/concert/concert-types";

export default function Index() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(new Date());
  const [activeZoneFilter, setActiveZoneFilter] = useState<Zone | "all">("all");
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [formError, setFormError] = useState("");

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
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, [fetchSeats]);

  const status = getEventStatus(now);
  const allTaken = seats.length > 0 && seats.every(s => s.taken);

  const getCountdown = () => {
    const diff = CONCERT_DATE.getTime() - now.getTime();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };
  const countdown = getCountdown();

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

  const handleCheckout = () => {
    if (!selected.length) return;
    setFormError("");
    setShowCheckout(true);
  };

  const handleBuy = async () => {
    setBuying(true);
    setFormError("");
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seat_ids: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка оформления");
      setSuccess(true);
      setSelected([]);
      setShowCheckout(false);
      setForm({ name: "", email: "", phone: "" });
      await fetchSeats();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Ошибка оформления");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 noise-overlay z-0 pointer-events-none" />

      <HeroSection status={status} allTaken={allTaken} countdown={countdown} />

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
          <p className="font-druk text-white/30 tracking-widest text-lg">СОБЫТИЕ ПРОШЛО</p>
        </div>
      )}
      {allTaken && status === "upcoming" && (
        <div className="bg-red-950/40 border-y border-red-900/30 py-6 text-center">
          <p className="font-druk text-red-400 tracking-widest text-lg">🎟 ВСЕ БИЛЕТЫ РАСКУПЛЕНЫ</p>
          <p className="text-white/40 text-sm mt-1">Следите за анонсами в соцсетях</p>
        </div>
      )}

      {/* TICKETS SECTION */}
      {status === "upcoming" && !allTaken && (
        <SeatMap
          seats={seats}
          selected={selected}
          loading={loading}
          error={error}
          activeZoneFilter={activeZoneFilter}
          onZoneFilter={setActiveZoneFilter}
          onToggleSeat={toggleSeat}
          onCheckout={handleCheckout}
          onClearSelected={() => setSelected([])}
          totalPrice={totalPrice}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          seats={seats}
          selected={selected}
          totalPrice={totalPrice}
          form={form}
          formError={formError}
          buying={buying}
          onFormChange={(field, value) => setForm(f => ({ ...f, [field]: value }))}
          onBuy={handleBuy}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {success && <SuccessModal onClose={() => setSuccess(false)} />}

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-druk text-white/20 text-sm tracking-widest">KOMAR.TICKETS</div>
          <div className="text-white/20 text-xs text-center">
            ⚠️ Концерт ненастоящий — учебный проект
          </div>
          <div className="text-white/20 text-xs">Ozon Арена, Краснодар</div>
        </div>
      </footer>
    </div>
  );
}
