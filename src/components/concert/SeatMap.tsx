import Icon from "@/components/ui/icon";
import { Seat, Zone, ZONE_CONFIG, getRowZone } from "./concert-types";

interface SeatMapProps {
  seats: Seat[];
  selected: number[];
  loading: boolean;
  error: string;
  activeZoneFilter: Zone | "all";
  onZoneFilter: (z: Zone | "all") => void;
  onToggleSeat: (id: number) => void;
  onCheckout: () => void;
  onClearSelected: () => void;
  totalPrice: number;
}

export default function SeatMap({
  seats,
  selected,
  loading,
  error,
  activeZoneFilter,
  onZoneFilter,
  onToggleSeat,
  onCheckout,
  onClearSelected,
  totalPrice,
}: SeatMapProps) {
  const rows = Array.from(new Set(seats.map(s => s.row))).sort((a, b) => a - b);
  const seatsByRow = rows.reduce<Record<number, Seat[]>>((acc, row) => {
    acc[row] = seats.filter(s => s.row === row);
    return acc;
  }, {});
  const filteredRows = activeZoneFilter === "all"
    ? rows
    : rows.filter(r => getRowZone(r) === activeZoneFilter);

  return (
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
              onClick={() => onZoneFilter(z)}
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
                  <div className="w-1 h-5 rounded-full opacity-60" style={{ background: cfg.color }} />
                  <div className="flex gap-1 flex-wrap">
                    {rowSeats.map(seat => {
                      const isTaken = seat.taken;
                      const isSelected = selected.includes(seat.id);
                      return (
                        <button
                          key={seat.id}
                          onClick={() => onToggleSeat(seat.id)}
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
                  onClick={onClearSelected}
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
              onClick={onCheckout}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-druk text-sm py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Icon name="CreditCard" size={16} />
              Оформить билеты
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
