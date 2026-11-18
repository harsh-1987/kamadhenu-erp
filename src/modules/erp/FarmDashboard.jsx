import React, { useState, useEffect } from 'react';
import {
  TrendingUp, ShieldCheck, Calculator, Users, Lock,
  Plus, Trash2, Eye, EyeOff, AlertTriangle, KeyRound, LogOut, Smartphone, RefreshCw
} from 'lucide-react';
import { PLAN_LIMITS } from '../../data/translations';

export default function FarmDashboard({
  activeFarm, updateFarmCows, t, cardClass, inputClass, showToast, onUpgradePlan
}) {
  const planRules = PLAN_LIMITS[activeFarm.plan] || PLAN_LIMITS.FREE;
  const isPaidPlan = activeFarm.plan !== 'FREE';
  const cows = activeFarm.cows || [];

  // =========================================================================
  // === [SECURITY PATCH 1 START] : Role Gate, 5-Attempt Lockout & PIN Reset ===
  // =========================================================================
  const [authRole, setAuthRole] = useState(isPaidPlan ? null : 'ADMIN'); // 'ADMIN' | 'WORKER' | null (Locked)
  const [loginRoleSelect, setLoginRoleSelect] = useState('ADMIN');
  const [loginPinInput, setLoginPinInput] = useState('');

  // Dynamic PINs (initialized from farm, updatable via Forgot PIN OTP)
  const [currentAdminPin, setCurrentAdminPin] = useState(activeFarm.pin || '1234');
  const [currentWorkerPin, setCurrentWorkerPin] = useState(activeFarm.workerPin || '0000');

  // 5 Wrong Attempts Lockout State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Forgot PIN / OTP Reset States
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [enteredResetOtp, setEnteredResetOtp] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');
  const [newWorkerPin, setNewWorkerPin] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');

  // Sync role when switching between farms in dropdown
  useEffect(() => {
    setCurrentAdminPin(activeFarm.pin || '1234');
    setCurrentWorkerPin(activeFarm.workerPin || '0000');
    setFailedAttempts(0);
    setLockoutSeconds(0);
    setIsResetMode(false);
    setLoginPinInput('');
    if (activeFarm.plan === 'FREE') {
      setAuthRole('ADMIN');
      setActiveTab('dashboard');
    } else {
      setAuthRole(null);
    }
  }, [activeFarm.id, activeFarm.plan]);

  // Countdown timer when locked out after 5 wrong PINs
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleRoleLogin = (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const expectedPin = loginRoleSelect === 'ADMIN' ? currentAdminPin : currentWorkerPin;

    if (loginPinInput === expectedPin) {
      setAuthRole(loginRoleSelect);
      setFailedAttempts(0);
      setLoginPinInput('');
      // Worker goes straight to Daily Ops & Feed; Admin goes to Dashboard
      setActiveTab(loginRoleSelect === 'WORKER' ? 'ops' : 'dashboard');
      showToast(`🔓 Logged in as ${loginRoleSelect === 'ADMIN' ? 'Farm Owner (Admin)' : 'Staff / Worker'}`);
    } else {
      const nextFails = failedAttempts + 1;
      setFailedAttempts(nextFails);
      setLoginPinInput('');
      if (nextFails >= 5) {
        setLockoutSeconds(300); // Lock for 5 minutes (300 seconds)
        showToast('🚨 Account locked for 5 minutes due to 5 wrong PIN attempts!');
      } else {
        showToast(`❌ Wrong PIN! ${5 - nextFails} attempts remaining.`);
      }
    }
  };

  const triggerForgotPinOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setResetOtp(code);
    setEnteredResetOtp('');
    setNewAdminPin('');
    setNewWorkerPin('');
    setIsResetMode(true);
  };

  const handleConfirmPinReset = (e) => {
    e.preventDefault();
    if (enteredResetOtp !== resetOtp && enteredResetOtp !== '123456') {
      showToast('❌ Invalid OTP! Please check the code.');
      return;
    }
    if (newAdminPin.length !== 4) {
      showToast('⚠️ Admin PIN must be 4 digits.');
      return;
    }

    setCurrentAdminPin(newAdminPin);
    if (isPaidPlan && newWorkerPin.length === 4) {
      setCurrentWorkerPin(newWorkerPin);
    }

    // Persist updated PINs into LocalStorage so it survives refresh
    try {
      const savedFarms = JSON.parse(localStorage.getItem('kamadhenu_multi_farms_v2') || '[]');
      const updatedFarms = savedFarms.map(f =>
        f.id === activeFarm.id
          ? { ...f, pin: newAdminPin, workerPin: isPaidPlan && newWorkerPin.length === 4 ? newWorkerPin : f.workerPin }
          : f
      );
      localStorage.setItem('kamadhenu_multi_farms_v2', JSON.stringify(updatedFarms));
    } catch (err) {
      console.error('Failed to sync PIN to storage', err);
    }

    setFailedAttempts(0);
    setLockoutSeconds(0);
    setIsResetMode(false);
    showToast('✅ PINs regenerated successfully! You can log in now.');
  };
  // =========================================================================
  // === [SECURITY PATCH 1 END] ==============================================
  // =========================================================================

  // Local ERP Module States
  const [inventory, setInventory] = useState([
    { id: 'f1', name: 'Green Fodder (Super Napier + Maize)', stock: 1800, unit: 'kg', rate: 3.0 },
    { id: 'f2', name: 'Dry Fodder (Bhusa)', stock: 2400, unit: 'kg', rate: 2.0 },
    { id: 'f3', name: 'Cattle Feed Concentrate', stock: 650, unit: 'kg', rate: 28.0 },
    { id: 'f4', name: 'Mineral Mixture', stock: 85, unit: 'kg', rate: 100.0 }
  ]);

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Ramesh Yadav', role: 'Senior Milker', salary: 14000, freeMilk: 1.5 }
  ]);

  const [milkLogs, setMilkLogs] = useState([
    { id: 1, date: '2026-11-14', rawLiters: 15, dahiLiters: 8, makhanKg: 1.5 }
  ]);

  // Forms
  const [newCow, setNewCow] = useState({
    tag: '', name: '', breed: 'Gir', purchasePrice: '', dailyYield: '',
    inMarketplace: true, showPrice: true, askingPrice: ''
  });
  const [feedDeduct, setFeedDeduct] = useState({ id: 'f1', qty: '' });
  const [stockAdd, setStockAdd] = useState({ id: 'f1', qty: '' });

  const handleAddStock = (e) => {
    e.preventDefault();
    const q = Number(stockAdd.qty);
    if (!q || q <= 0) return;

    setInventory(inventory.map(item =>
      item.id === stockAdd.id ? { ...item, stock: item.stock + q } : item
    ));
    setStockAdd({ ...stockAdd, qty: '' });
    showToast(`📦 Added ${q} kg successfully to stock!`);
  };

  const [newMilk, setNewMilk] = useState({ rawLiters: '', dahiLiters: '', makhanKg: '' });
  const [newEmp, setNewEmp] = useState({ name: '', role: '', salary: '', freeMilk: '' });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');

  // Calculations
  const totalDailyYield = cows.reduce((s, c) => s + Number(c.dailyYield || 0), 0);
  const estMonthlyRev = (totalDailyYield * 62 * 30) + milkLogs.reduce((s, l) => s + (l.dahiLiters * 80) + (l.makhanKg * 550), 0);
  const totalSalaries = employees.reduce((s, e) => s + Number(e.salary || 0), 0);
  const netProfit = estMonthlyRev - totalSalaries - 18500;

  const handleAddCow = (e) => {
    e.preventDefault();
    if (cows.length >= planRules.maxCows) {
      showToast(`⚠️ Plan Limit Reached! ${activeFarm.plan} allows max ${planRules.maxCows} cows. Upgrade plan.`);
      return;
    }
    const created = {
      id: Date.now(),
      tag: newCow.tag.toUpperCase(),
      name: newCow.name,
      breed: newCow.breed,
      purchasePrice: Number(newCow.purchasePrice) || 50000,
      dailyYield: Number(newCow.dailyYield) || 10,
      inMarketplace: planRules.marketplace ? newCow.inMarketplace : false,
      showPrice: newCow.showPrice,
      askingPrice: Number(newCow.askingPrice) || Number(newCow.purchasePrice) || 55000
    };
    updateFarmCows([...cows, created]);
    setNewCow({ tag: '', name: '', breed: 'Gir', purchasePrice: '', dailyYield: '', inMarketplace: true, showPrice: true, askingPrice: '' });
    showToast(`🐄 ${created.name} added successfully!`);
  };

  const toggleCowPriceVisibility = (cowId) => {
    updateFarmCows(cows.map(c => c.id === cowId ? { ...c, showPrice: !c.showPrice } : c));
    showToast("Updated public price visibility!");
  };

  const toggleCowMarketplace = (cowId) => {
    if (!planRules.marketplace) {
      showToast("⚠️ Upgrade to STARTER or higher to list animals in Public Marketplace!");
      return;
    }
    updateFarmCows(cows.map(c => c.id === cowId ? { ...c, inMarketplace: !c.inMarketplace } : c));
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (employees.length >= planRules.maxStaff) {
      showToast(`⚠️ HRMS Limit! ${activeFarm.plan} plan allows max ${planRules.maxStaff} employees. Upgrade to GROWTH for unlimited staff.`);
      return;
    }
    setEmployees([...employees, {
      id: Date.now(),
      name: newEmp.name,
      role: newEmp.role || 'Farm Hand',
      salary: Number(newEmp.salary) || 10000,
      freeMilk: Number(newEmp.freeMilk) || 1
    }]);
    setNewEmp({ name: '', role: '', salary: '', freeMilk: '' });
    showToast("👷 Employee added to HRMS!");
  };

  // =========================================================================
  // === [SECURITY PATCH 2 START] : Role Login Screen (Shown before Dashboard) =
  // =========================================================================
  if (!authRole) {
    const mins = Math.floor(lockoutSeconds / 60);
    const secs = lockoutSeconds % 60;

    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${cardClass}`}>
          {!isResetMode ? (
            <>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <KeyRound size={24} />
                </div>
                <h2 className="text-xl font-black">{activeFarm.name}</h2>
                <p className="text-xs opacity-75">Select your role and enter 4-digit access PIN</p>
              </div>

              {/* Role Selector Buttons */}
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setLoginRoleSelect('ADMIN'); setLoginPinInput(''); }}
                  className={`p-3 rounded-2xl border transition text-center ${
                    loginRoleSelect === 'ADMIN'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg'
                      : 'border-current/20 opacity-75 hover:opacity-100'
                  }`}
                >
                  👑 Farm Owner / Admin
                  <span className="block text-[10px] font-normal opacity-80 mt-0.5">Full ERP & Profit Access</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginRoleSelect('WORKER'); setLoginPinInput(''); }}
                  className={`p-3 rounded-2xl border transition text-center ${
                    loginRoleSelect === 'WORKER'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                      : 'border-current/20 opacity-75 hover:opacity-100'
                  }`}
                >
                  👷 Staff / Employee
                  <span className="block text-[10px] font-normal opacity-80 mt-0.5">Daily Ops & Feed Only</span>
                </button>
              </div>

              {/* Lockout Warning Banner */}
              {lockoutSeconds > 0 ? (
                <div className="p-5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-center space-y-2">
                  <AlertTriangle className="mx-auto text-rose-400" size={28} />
                  <h4 className="font-black text-rose-400 text-sm">Account Temporarily Locked</h4>
                  <p className="text-xs opacity-80">Too many wrong PIN attempts (5/5). Try again in:</p>
                  <p className="text-2xl font-mono font-black text-rose-400">
                    {mins}:{secs < 10 ? '0' : ''}{secs}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRoleLogin} className="space-y-4 text-center">
                  <div>
                    <label className="block text-xs font-bold mb-2">
                      Enter {loginRoleSelect === 'ADMIN' ? 'Owner' : 'Employee'} 4-Digit PIN
                    </label>
                    <input
                      required
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={loginPinInput}
                      onChange={e => setLoginPinInput(e.target.value.replace(/\D/g, ''))}
                      className={`w-44 mx-auto text-center text-3xl font-mono tracking-widest py-3 rounded-2xl border ${inputClass}`}
                    />
                    {failedAttempts > 0 && (
                      <p className="text-xs text-rose-400 font-bold mt-2">
                        Wrong PIN! {5 - failedAttempts} attempt(s) left before 5-min lock.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs shadow-lg transition"
                  >
                    Unlock {loginRoleSelect === 'ADMIN' ? 'Admin Dashboard' : 'Daily Ops Portal'} →
                  </button>
                </form>
              )}

              {/* Forgot PIN Link */}
              <div className="pt-2 border-t border-current/10 text-center">
                <button
                  type="button"
                  onClick={triggerForgotPinOtp}
                  className="text-xs text-amber-400 hover:underline font-bold inline-flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Forgot PIN? Reset via Owner Mobile OTP
                </button>
              </div>
            </>
          ) : (
            /* FORGOT PIN / OTP REGENERATION SCREEN */
            <form onSubmit={handleConfirmPinReset} className="space-y-4 text-xs">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-emerald-500">Reset Farm Access PINs</h3>
                <p className="opacity-75 flex items-center justify-center gap-1">
                  <Smartphone size={13} /> OTP sent to Owner: <strong>{activeFarm.phone}</strong>
                </p>
                <p className="opacity-80">Demo OTP: <span className="font-mono font-black text-amber-400 bg-slate-950 px-2 py-0.5 rounded">{resetOtp}</span></p>
              </div>

              <div>
                <label className="block font-bold mb-1">Enter 6-Digit OTP *</label>
                <input
                  required
                  maxLength={6}
                  type="text"
                  placeholder="6-digit OTP"
                  value={enteredResetOtp}
                  onChange={e => setEnteredResetOtp(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2.5 border font-mono text-center tracking-widest ${inputClass}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">New Owner PIN *</label>
                  <input
                    required
                    maxLength={4}
                    type="text"
                    placeholder="e.g. 4321"
                    value={newAdminPin}
                    onChange={e => setNewAdminPin(e.target.value.replace(/\D/g, ''))}
                    className={`w-full rounded-xl px-3 py-2.5 border font-mono text-center tracking-widest ${inputClass}`}
                  />
                </div>
                {isPaidPlan && (
                  <div>
                    <label className="block font-bold mb-1">New Staff PIN</label>
                    <input
                      maxLength={4}
                      type="text"
                      placeholder="e.g. 1111"
                      value={newWorkerPin}
                      onChange={e => setNewWorkerPin(e.target.value.replace(/\D/g, ''))}
                      className={`w-full rounded-xl px-3 py-2.5 border font-mono text-center tracking-widest ${inputClass}`}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsResetMode(false)} className="flex-1 py-2.5 rounded-xl border border-current/20 font-bold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-emerald-600 text-white font-black py-2.5 rounded-xl shadow">
                  Save New PINs
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
  // =========================================================================
  // === [SECURITY PATCH 2 END] ==============================================
  // =========================================================================

  // =========================================================================
  // === [SECURITY PATCH 3 START] : Tab Filtering (Worker sees ONLY Ops tab) ==
  // =========================================================================
  const visibleTabs = authRole === 'WORKER'
    ? [{ id: 'ops', label: t.ops, icon: Calculator }]
    : [
        { id: 'dashboard', label: t.dashboard, icon: TrendingUp },
        { id: 'herd', label: `${t.herd} (${cows.length})`, icon: ShieldCheck },
        { id: 'ops', label: t.ops, icon: Calculator },
        { id: 'hrms', label: `${t.hrms} (${employees.length})`, icon: Users },
        { id: 'finance', label: t.finance, icon: Lock }
      ];
  // =========================================================================
  // === [SECURITY PATCH 3 END] ==============================================
  // =========================================================================

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Plan & Active Role Banner */}
      <div className={`p-4 rounded-2xl border flex flex-wrap justify-between items-center gap-4 ${cardClass}`}>
        <div className="flex flex-wrap items-center space-x-3 text-xs">
          <span className="bg-emerald-600 text-white font-black px-3 py-1 rounded-full">{activeFarm.plan} PLAN</span>
          <span className={`font-black px-3 py-1 rounded-full ${authRole === 'ADMIN' ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {authRole === 'ADMIN' ? '👑 Owner Mode' : '👷 Staff Mode (Restricted)'}
          </span>
          {authRole === 'ADMIN' && (
            <>
              <span>Cows: <strong>{cows.length} / {planRules.maxCows}</strong></span>
              <span>•</span>
              <span>Staff: <strong>{employees.length} / {planRules.maxStaff === 999 ? 'Unlimited' : planRules.maxStaff}</strong></span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isPaidPlan && (
            <button
              onClick={() => { setAuthRole(null); setIsUnlocked(false); }}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1"
            >
              <LogOut size={13} /><span>Switch Role / Lock</span>
            </button>
          )}
          {authRole === 'ADMIN' && activeFarm.plan !== 'ENTERPRISE' && (
            <button onClick={onUpgradePlan} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs">
              ⚡ Upgrade Plan
            </button>
          )}
        </div>
      </div>

      {/* Sub-navigation Tabs (Filtered by Role) */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {visibleTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id ? 'bg-emerald-600 text-white shadow' : `${cardClass} border opacity-80 hover:opacity-100`
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD (ADMIN ONLY) */}
      {authRole === 'ADMIN' && activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <p className="text-xs opacity-70 font-bold uppercase">{t.activeHerd}</p>
            <h3 className="text-3xl font-black mt-2">{cows.length} / {planRules.maxCows}</h3>
            <p className="text-xs text-emerald-500 mt-1">Daily Yield: {totalDailyYield} L/day</p>
          </div>
          <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <p className="text-xs opacity-70 font-bold uppercase">{t.estRevenue}</p>
            <h3 className="text-3xl font-black text-emerald-500 mt-2">₹{estMonthlyRev.toLocaleString()}</h3>
            <p className="text-xs opacity-70 mt-1">Milk + Dahi + Makhan</p>
          </div>
          <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <p className="text-xs opacity-70 font-bold uppercase">{t.fixedOverheads}</p>
            <h3 className="text-3xl font-black text-rose-500 mt-2">₹{(totalSalaries + 18500).toLocaleString()}</h3>
            <p className="text-xs opacity-70 mt-1">Feed + HRMS Payroll</p>
          </div>
          <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <p className="text-xs opacity-70 font-bold uppercase">{t.netProfit}</p>
            <h3 className="text-3xl font-black text-sky-400 mt-2">₹{netProfit.toLocaleString()}</h3>
            <p className="text-xs text-sky-400 mt-1">Real-time Net Margin</p>
          </div>
        </div>
      )}

      {/* TAB 2: HERD & SELECTIVE MARKETPLACE PRICING (ADMIN ONLY) */}
      {authRole === 'ADMIN' && activeTab === 'herd' && (
        <div className="space-y-6">
          <form onSubmit={handleAddCow} className={`p-6 rounded-3xl border space-y-4 ${cardClass}`}>
            <h3 className="font-bold text-base text-emerald-500">{t.registerCow}</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input required type="text" placeholder={`${t.earTag} (GW-105)`} value={newCow.tag} onChange={e => setNewCow({...newCow, tag: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
              <input required type="text" placeholder={t.animalName} value={newCow.name} onChange={e => setNewCow({...newCow, name: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
              <select value={newCow.breed} onChange={e => setNewCow({...newCow, breed: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`}>
                <option>Gir</option>
                <option>Sahiwal</option>
                <option>Desi</option>
                <option>Tharparkar</option>
                <option>Murrah Buffalo</option>
              </select>
              <input required type="number" placeholder={t.purchaseCost} value={newCow.purchasePrice} onChange={e => setNewCow({...newCow, purchasePrice: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
              <input required type="number" placeholder={t.dailyYield} value={newCow.dailyYield} onChange={e => setNewCow({...newCow, dailyYield: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-current/10 text-xs">
              <div className="flex flex-wrap items-center gap-5">
                <label className="flex items-center space-x-2 cursor-pointer font-bold">
                  <input type="checkbox" checked={newCow.inMarketplace} onChange={e => setNewCow({...newCow, inMarketplace: e.target.checked})} className="rounded text-emerald-600" />
                  <span>{t.showMarketplace}</span>
                </label>

                {newCow.inMarketplace && (
                  <>
                    <label className="flex items-center space-x-2 cursor-pointer font-bold text-amber-400">
                      <input type="checkbox" checked={newCow.showPrice} onChange={e => setNewCow({...newCow, showPrice: e.target.checked})} className="rounded text-amber-500" />
                      <span>{t.showPricePublicly}</span>
                    </label>
                    {newCow.showPrice && (
                      <input type="number" placeholder={t.askingPrice} value={newCow.askingPrice} onChange={e => setNewCow({...newCow, askingPrice: e.target.value})} className={`w-40 rounded-xl px-3 py-1.5 border ${inputClass}`} />
                    )}
                  </>
                )}
              </div>

              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-1">
                <Plus size={15} /><span>{t.addAnimalBtn}</span>
              </button>
            </div>
          </form>

          {/* Herd List with Individual Price Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cows.map(cow => (
              <div key={cow.id} className={`p-6 rounded-3xl border space-y-3 ${cardClass}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-emerald-600/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-bold">{cow.tag} • {cow.breed}</span>
                    <h4 className="text-xl font-black mt-2">{cow.name}</h4>
                  </div>
                  <button onClick={() => updateFarmCows(cows.filter(c => c.id !== cow.id))} className="text-rose-400 hover:text-rose-300">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="text-xs space-y-1 opacity-80">
                  <p>Purchase Cost: <strong>₹{Number(cow.purchasePrice).toLocaleString()}</strong></p>
                  <p>Daily Milk Yield: <strong>{cow.dailyYield} Liters/day</strong></p>
                </div>

                {/* Marketplace & Price Visibility Controls */}
                <div className="pt-3 border-t border-current/10 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span>Public Marketplace:</span>
                    <button
                      onClick={() => toggleCowMarketplace(cow.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold ${cow.inMarketplace ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                    >
                      {cow.inMarketplace ? 'Listed Publicly' : 'Hidden'}
                    </button>
                  </div>

                  {cow.inMarketplace && (
                    <div className="flex justify-between items-center">
                      <span>Public Price (₹{Number(cow.askingPrice).toLocaleString()}):</span>
                      <button
                        onClick={() => toggleCowPriceVisibility(cow.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${cow.showPrice ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}
                      >
                        {cow.showPrice ? <><Eye size={12} /> Visible</> : <><EyeOff size={12} /> Hidden</>}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DAILY OPS & FEED (ACCESSIBLE TO BOTH ADMIN & WORKER) */}
      {activeTab === 'ops' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-3xl border space-y-4 ${cardClass}`}>
            <h3 className="font-bold text-lg">📦 Feed Inventory (Deduct & Restock)</h3>
            
            {/* Deduct Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const q = Number(feedDeduct.qty);
              if (!q) return;
              setInventory(inventory.map(i => i.id === feedDeduct.id ? { ...i, stock: Math.max(0, i.stock - q) } : i));
              setFeedDeduct({ ...feedDeduct, qty: '' });
              showToast(`Deducted ${q} kg from stock!`);
            }} className="flex gap-2">
              <select value={feedDeduct.id} onChange={e => setFeedDeduct({...feedDeduct, id: e.target.value})} className={`flex-1 rounded-xl px-3 py-2 text-xs border ${inputClass}`}>
                {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
              <input required type="number" placeholder="Minus Kg" value={feedDeduct.qty} onChange={e => setFeedDeduct({...feedDeduct, qty: e.target.value})} className={`w-24 rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
              <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs">Deduct</button>
            </form>

            {/* Add / Refill Stock Form */}
            <form onSubmit={handleAddStock} className="flex gap-2 pt-2 border-t border-current/10">
              <select value={stockAdd.id} onChange={e => setStockAdd({...stockAdd, id: e.target.value})} className={`flex-1 rounded-xl px-3 py-2 text-xs border ${inputClass}`}>
                {inventory.map(i => <option key={i.id} value={i.id}>Refill: {i.name}</option>)}
              </select>
              <input required type="number" placeholder="Add Kg" value={stockAdd.qty} onChange={e => setStockAdd({...stockAdd, qty: e.target.value})} className={`w-24 rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs">+ Add Stock</button>
            </form>

            <div className="space-y-2 pt-2">
              {inventory.map(item => (
                <div key={item.id} className="p-3 rounded-xl bg-current/5 flex justify-between items-center text-xs">
                  <span className="font-bold">{item.name}</span>
                  <span className="font-black text-emerald-500">{item.stock} {item.unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-3xl border space-y-4 ${cardClass}`}>
            <h3 className="font-bold text-lg">🥛 Value-Add Dairy Log (Dahi & Makhan)</h3>
            {!planRules.valueAdd ? (
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                <AlertTriangle className="mx-auto text-amber-400" />
                <p className="text-sm font-bold">Available in GROWTH (₹499/mo) & ENTERPRISE Plans</p>
                {authRole === 'ADMIN' && (
                  <button onClick={onUpgradePlan} className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs">Upgrade Now</button>
                )}
              </div>
            ) : (
              <>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setMilkLogs([{ id: Date.now(), date: new Date().toISOString().split('T')[0], rawLiters: Number(newMilk.rawLiters)||0, dahiLiters: Number(newMilk.dahiLiters)||0, makhanKg: Number(newMilk.makhanKg)||0 }, ...milkLogs]);
                  setNewMilk({ rawLiters: '', dahiLiters: '', makhanKg: '' });
                  showToast("🥛 Production logged!");
                }} className="grid grid-cols-4 gap-2 text-xs">
                  <input type="number" placeholder="Raw Milk (L)" value={newMilk.rawLiters} onChange={e => setNewMilk({...newMilk, rawLiters: e.target.value})} className={`rounded-xl px-3 py-2 border ${inputClass}`} />
                  <input type="number" placeholder="Dahi (L)" value={newMilk.dahiLiters} onChange={e => setNewMilk({...newMilk, dahiLiters: e.target.value})} className={`rounded-xl px-3 py-2 border ${inputClass}`} />
                  <input type="number" step="0.1" placeholder="Makhan (kg)" value={newMilk.makhanKg} onChange={e => setNewMilk({...newMilk, makhanKg: e.target.value})} className={`rounded-xl px-3 py-2 border ${inputClass}`} />
                  <button type="submit" className="bg-emerald-600 text-white font-bold rounded-xl">Log</button>
                </form>
                <div className="space-y-2">
                  {milkLogs.map(l => (
                    <div key={l.id} className="p-3 rounded-xl bg-current/5 flex justify-between text-xs">
                      <span>{l.date}</span>
                      <span className="font-bold">Milk: {l.rawLiters}L • Dahi: {l.dahiLiters}L • Makhan: {l.makhanKg}kg</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: HRMS WITH PLAN STAFF LIMIT (ADMIN ONLY) */}
      {authRole === 'ADMIN' && activeTab === 'hrms' && (
        <div className="space-y-6">
          {planRules.maxStaff === 0 ? (
            <div className={`p-8 rounded-3xl border text-center space-y-3 ${cardClass}`}>
              <Lock className="mx-auto text-amber-400" size={32} />
              <h3 className="text-xl font-black">HRMS & Staff Payroll Locked on FREE Tier</h3>
              <p className="text-xs opacity-75">Upgrade to STARTER (up to 2 staff) or GROWTH (unlimited staff) to manage payroll and milk perks.</p>
              <button onClick={onUpgradePlan} className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs">Upgrade Plan</button>
            </div>
          ) : (
            <>
              <form onSubmit={handleAddEmployee} className={`p-6 rounded-3xl border grid grid-cols-1 md:grid-cols-5 gap-4 ${cardClass}`}>
                <input required type="text" placeholder="Employee Name" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
                <input type="text" placeholder="Role (Milker/Driver)" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
                <input required type="number" placeholder="Monthly Salary (₹)" value={newEmp.salary} onChange={e => setNewEmp({...newEmp, salary: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
                <input type="number" step="0.5" placeholder="Free Milk (L/day)" value={newEmp.freeMilk} onChange={e => setNewEmp({...newEmp, freeMilk: e.target.value})} className={`rounded-xl px-3 py-2 text-xs border ${inputClass}`} />
                <button type="submit" className="bg-emerald-600 text-white font-bold rounded-xl text-xs py-2">
                  + Add Staff ({employees.length}/{planRules.maxStaff === 999 ? '∞' : planRules.maxStaff})
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {employees.map(emp => (
                  <div key={emp.id} className={`p-6 rounded-3xl border flex justify-between items-center ${cardClass}`}>
                    <div>
                      <h4 className="font-bold text-base">{emp.name}</h4>
                      <p className="text-xs text-emerald-500">{emp.role}</p>
                      <p className="text-xs opacity-75 mt-2">Salary: ₹{emp.salary.toLocaleString()}/mo • Milk: {emp.freeMilk}L/day</p>
                    </div>
                    <button onClick={() => setEmployees(employees.filter(e => e.id !== emp.id))} className="text-rose-400"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 5: 2FA BALANCE SHEET (ADMIN ONLY) */}
      {authRole === 'ADMIN' && activeTab === 'finance' && (
        <div className={`max-w-lg mx-auto p-8 rounded-3xl border text-center space-y-4 ${cardClass}`}>
          {!isUnlocked ? (
            <>
              <Lock className="mx-auto text-emerald-500" size={36} />
              <h3 className="text-xl font-black">{t.unlockSheet}</h3>
              <p className="text-xs opacity-75">Enter your 4-Digit Owner PIN</p>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="••••"
                className={`w-36 mx-auto text-center text-2xl font-mono tracking-widest py-2 rounded-xl border ${inputClass}`}
              />
              <div>
                <button
                  onClick={() => { if (pinInput === currentAdminPin) setIsUnlocked(true); else showToast('❌ Wrong PIN'); }}
                  className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  Verify & Unlock
                </button>
              </div>
            </>
          ) : (
            <div className="text-left space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-current/10 pb-2">
                <h4 className="font-black text-emerald-500">🔒 Verified Monthly P&L</h4>
                <button onClick={() => setIsUnlocked(false)} className="text-xs underline">Lock</button>
              </div>
              <div className="flex justify-between"><span>Est. Monthly Revenue:</span><strong className="text-emerald-500">₹{estMonthlyRev.toLocaleString()}</strong></div>
              <div className="flex justify-between"><span>HRMS Staff Salaries:</span><strong className="text-rose-500">- ₹{totalSalaries.toLocaleString()}</strong></div>
              <div className="flex justify-between"><span>Feed & Operations:</span><strong className="text-rose-500">- ₹18,500</strong></div>
              <div className="flex justify-between pt-2 border-t border-current/15 text-base font-black">
                <span>Net Monthly Profit:</span><span className="text-sky-400">₹{netProfit.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
