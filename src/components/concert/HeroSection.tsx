import Icon from "@/components/ui/icon";
import { ARTIST_IMG, CONCERT_DATE } from "./concert-types";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface HeroSectionProps {
  status: "upcoming" | "started" | "ended";
  allTaken: boolean;
  countdown: Countdown | null;
}

export default function HeroSection({ status, allTaken, countdown }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-glow absolute inset-0 z-0" />
      <div
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, #0a0a0a 100%)" }}
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
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
              <Icon name="AlertTriangle" size={12} />
              Концерт ненастоящий
            </div>

            <div
              className="font-tour mb-1 leading-none"
              style={{
                fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
                background: "linear-gradient(90deg, #dc2626, #ff6b35, #dc2626)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 3s linear infinite",
              }}
            >
              KOMAR TOUR 2026
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
                <div className="font-druk text-lg text-white">
                  {CONCERT_DATE.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Countdown timer */}
            {status === "upcoming" && countdown && (
              <div className="flex gap-3 mb-8">
                {[
                  { val: countdown.days,    label: "дней" },
                  { val: countdown.hours,   label: "часов" },
                  { val: countdown.minutes, label: "минут" },
                  { val: countdown.seconds, label: "секунд" },
                ].map(({ val, label }) => (
                  <div key={label} className="ticket-card px-4 py-3 rounded-lg text-center min-w-[64px]">
                    <div className="font-druk text-2xl text-red-500 leading-none tabular-nums">
                      {String(val).padStart(2, "0")}
                    </div>
                    <div className="text-white/30 text-[10px] uppercase tracking-widest mt-1">{label}</div>
                  </div>
                ))}
              </div>
            )}

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
              <div
                className="absolute bottom-0 left-0 right-0 h-32 rounded-b-2xl"
                style={{ background: "linear-gradient(to top, #0a0a0a, transparent)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
