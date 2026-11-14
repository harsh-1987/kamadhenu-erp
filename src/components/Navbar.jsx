import React from 'react';
import { Globe, Sun, Moon, Trees, Shield } from 'lucide-react';

export default function Navbar({
  t, lang, setLang, theme, setTheme,
  currentView, setCurrentView, activeFarm
}) {
  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('emerald');
    else setTheme('dark');
  };

  const navBg = theme === 'light'
    ? 'bg-white border-slate-200 text-slate-900'
    : theme === 'emerald'
    ? 'bg-emerald-950 border-emerald-800 text-emerald-50'
    : 'bg-slate-950 border-slate-800 text-slate-100';

  return (
    <header className={`border-b px-6 py-3.5 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50 transition-colors ${navBg}`}>
      <div
        onClick={() => setCurrentView('landing')}
        className="flex items-center space-x-3 cursor-pointer"
      >
        <div className="bg-emerald-600 text-white p-2 rounded-xl font-bold text-xl shadow">🐄</div>
        <div>
          <span className="text-xl font-black tracking-tight text-emerald-500">{t.brand}</span>
          {activeFarm && currentView === 'app' && (
            <p className="text-[11px] opacity-75">{activeFarm.name} • {activeFarm.location}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Marketplace Quick Link */}
        <button
          onClick={() => setCurrentView('marketplace')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            currentView === 'marketplace'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
          }`}
        >
          🔍 {t.marketplaceBtn}
        </button>

        {/* Theme Switcher */}
        <button
          onClick={cycleTheme}
          title="Switch Theme (Dark / Light / Farm Green)"
          className="p-2 rounded-xl border border-current/20 hover:bg-current/10 transition flex items-center space-x-1 text-xs font-bold"
        >
          {theme === 'dark' && <><Moon size={15} className="text-sky-400" /><span className="hidden sm:inline">Dark</span></>}
          {theme === 'light' && <><Sun size={15} className="text-amber-500" /><span className="hidden sm:inline">Light</span></>}
          {theme === 'emerald' && <><Trees size={15} className="text-emerald-400" /><span className="hidden sm:inline">Farm</span></>}
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          className="px-3 py-1.5 rounded-xl border border-current/20 hover:bg-current/10 text-xs font-bold flex items-center space-x-1"
        >
          <Globe size={14} />
          <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* Super Admin Portal */}
        <button
          onClick={() => setCurrentView('superadmin')}
          className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 text-xs font-bold flex items-center space-x-1"
        >
          <Shield size={14} />
          <span>{t.superAdminBtn}</span>
        </button>

        {/* Enroll CTA */}
        {currentView !== 'register' && (
          <button
            onClick={() => setCurrentView('register')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs shadow-lg transition"
          >
            + {t.enrollBtn}
          </button>
        )}
      </div>
    </header>
  );
}
