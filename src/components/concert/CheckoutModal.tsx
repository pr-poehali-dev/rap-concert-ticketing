import Icon from "@/components/ui/icon";
import { Seat, ZONE_CONFIG } from "./concert-types";

interface CheckoutModalProps {
  seats: Seat[];
  selected: number[];
  totalPrice: number;
  form: { name: string; email: string; phone: string };
  formError: string;
  buying: boolean;
  onFormChange: (field: "name" | "email" | "phone", value: string) => void;
  onBuy: () => void;
  onClose: () => void;
}

export function CheckoutModal({
  seats,
  selected,
  totalPrice,
  form,
  formError,
  buying,
  onFormChange,
  onBuy,
  onClose,
}: CheckoutModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div
        className="ticket-card rounded-2xl p-8 w-full max-w-md border border-white/10 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="font-druk text-2xl text-white">ОФОРМЛЕНИЕ</div>
          <button onClick={onClose} className="text-white/30 hover:text-white/70">
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Order summary */}
        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <div className="text-white/40 text-xs uppercase tracking-widest mb-3">Ваши места</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {selected.map(id => {
              const s = seats.find(x => x.id === id);
              if (!s) return null;
              const cfg = ZONE_CONFIG[s.zone];
              return (
                <span
                  key={id}
                  className="text-xs px-2 py-1 rounded font-medium"
                  style={{ background: cfg.color + "33", color: cfg.color }}
                >
                  Р{s.row} М{s.seat} — {s.price.toLocaleString("ru")} ₽
                </span>
              );
            })}
          </div>
          <div className="flex justify-between items-center border-t border-white/10 pt-3">
            <span className="text-white/50 text-sm">Итого</span>
            <span className="font-druk text-xl text-red-500">{totalPrice.toLocaleString("ru")} ₽</span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest block mb-1.5">Имя</label>
            <input
              type="text"
              placeholder="Иван Иванов"
              value={form.name}
              onChange={e => onFormChange("name", e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>
          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest block mb-1.5">Email</label>
            <input
              type="email"
              placeholder="ivan@mail.ru"
              value={form.email}
              onChange={e => onFormChange("email", e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>
          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest block mb-1.5">Телефон</label>
            <input
              type="tel"
              placeholder="+7 900 000 00 00"
              value={form.phone}
              onChange={e => onFormChange("phone", e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>
        </div>

        {formError && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-3 py-2 rounded mb-4">
            {formError}
          </div>
        )}

        <button
          onClick={onBuy}
          disabled={buying}
          className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-900/50 text-white font-druk text-sm py-4 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
        >
          {buying ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Оформляем…
            </>
          ) : (
            <>
              <Icon name="Check" size={16} />
              Подтвердить заказ
            </>
          )}
        </button>
      </div>
    </div>
  );
}

interface SuccessModalProps {
  onClose: () => void;
}

export function SuccessModal({ onClose }: SuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="ticket-card rounded-2xl p-10 text-center max-w-sm mx-4 border border-green-900/40 animate-fade-in">
        <div className="text-6xl mb-4">🎟</div>
        <div className="font-druk text-3xl text-green-400 mb-2">ЗАКАЗ ПРИНЯТ!</div>
        <p className="text-white/50 text-sm mb-2">Билеты забронированы.</p>
        <p className="text-white/30 text-xs mb-8">Детали заказа отправлены на ваш email.</p>
        <button
          onClick={onClose}
          className="bg-green-700 hover:bg-green-600 text-white font-druk text-sm px-10 py-3 rounded-lg uppercase tracking-widest"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
