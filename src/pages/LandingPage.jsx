export default function LandingPage({ onStart }) {
  return (
    <div className="h-full w-full relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
        alt="Mountains"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="pt-8">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2">
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
            <span className="text-white text-xl font-bold">AlaTau</span>
          </div>
        </div>

        <div className="pb-8">
          <h1 className="text-white text-[36px] font-bold leading-tight">
            Открой<br />Казахстан
          </h1>
          <p className="text-white/70 text-base mt-3">
            Всё-в-одном туристический маркетплейс: маршруты, гиды, снаряжение и жильё
          </p>
          <button
            onClick={onStart}
            className="w-full mt-8 py-4 rounded-2xl text-base font-semibold border-none cursor-pointer active:scale-[0.97] transition-transform text-white"
            style={{ background: '#34C759' }}
          >
            Начать путешествие
          </button>
        </div>
      </div>
    </div>
  )
}
