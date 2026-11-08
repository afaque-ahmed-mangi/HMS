export default function StatCard({ title, value, icon: Icon, color, trend }) {
  const colorMap = {
    indigo: {
      bg: 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-indigo-500/30',
      glow: 'shadow-[0_8px_20px_-4px_rgba(99,102,241,0.4)]',
    },
    green: {
      bg: 'bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-emerald-500/30',
      glow: 'shadow-[0_8px_20px_-4px_rgba(16,185,129,0.4)]',
    },
    blue: {
      bg: 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-blue-500/30',
      glow: 'shadow-[0_8px_20px_-4px_rgba(59,130,246,0.4)]',
    },
    amber: {
      bg: 'bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-amber-500/30',
      glow: 'shadow-[0_8px_20px_-4px_rgba(245,158,11,0.4)]',
    },
    red: {
      bg: 'bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-rose-500/30',
      glow: 'shadow-[0_8px_20px_-4px_rgba(244,63,94,0.4)]',
    },
    purple: {
      bg: 'bg-gradient-to-tr from-purple-600 to-purple-500 text-white shadow-purple-500/30',
      glow: 'shadow-[0_8px_20px_-4px_rgba(168,85,247,0.4)]',
    },
  };

  const currentTheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="stat-tile-3d p-5 rounded-2xl relative overflow-hidden group">
      {/* 3D Glass Top Reflection */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-800 tracking-tight">{value}</p>
          {trend && (
            <p
              className={`mt-1.5 text-xs font-semibold flex items-center gap-1 ${
                trend > 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-[11px] text-slate-400">vs last month</span>
            </p>
          )}
        </div>

        {/* 3D Raised Icon Emblem */}
        <div
          className={`h-12 w-12 rounded-2xl flex items-center justify-center p-2.5 transition-transform duration-300 transform group-hover:scale-110 group-hover:rotate-3 ${currentTheme.bg} ${currentTheme.glow}`}
          style={{
            boxShadow:
              '0 8px 16px -2px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.6)',
          }}
        >
          <Icon size={22} className="drop-shadow-sm" />
        </div>
      </div>
    </div>
  );
}
