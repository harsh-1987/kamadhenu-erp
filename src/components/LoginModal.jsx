import React, { useState } from 'react';
import { KeyRound, ArrowLeft, LogIn } from 'lucide-react';

export default function LoginModal({
  farms = [],
  onLoginSuccess,
  onGoToRegister,
  onCancel,
  cardClass,
  inputClass,
  showToast
}) {
  const [phoneInput, setPhoneInput] = useState('');
  const [roleType, setRoleType] = useState('ADMIN'); // 'ADMIN' or 'WORKER'
  const [pinInput, setPinInput] = useState('');

  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneInput(cleaned);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (phoneInput.length !== 10) {
      showToast?.('⚠️ Please enter a valid 10-digit registered mobile number.');
      return;
    }

    const matchedFarm = farms.find((f) => {
      const farmDigits = String(f.phone || '').replace(/\D/g, '').slice(-10);
      return farmDigits === phoneInput;
    });

    if (!matchedFarm) {
      showToast?.('❌ No dairy farm found with this mobile number. Please enroll first.');
      return;
    }

    if (matchedFarm.status === 'Suspended') {
      showToast?.('🚫 This farm is currently Suspended by Super Admin.');
      return;
    }

    const expectedPin =
      roleType === 'ADMIN'
        ? (matchedFarm.pin || '1234')
        : (matchedFarm.workerPin || matchedFarm.pin || '0000');

    if (pinInput !== expectedPin) {
      showToast?.(`❌ Incorrect ${roleType === 'ADMIN' ? 'Owner' : 'Worker'} PIN!`);
      return;
    }

    onLoginSuccess(matchedFarm, roleType);
  };

  return (
    <div className="w-full max-w-md mx-auto my-10 px-4">
      <div className={`p-7 rounded-3xl border shadow-2xl space-y-6 ${cardClass}`}>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs opacity-70 hover:opacity-100 flex items-center space-x-1"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <LogIn size={24} />
          </div>
          <h2 className="text-2xl font-black text-emerald-500">Login to KamadhenuERP</h2>
          <p className="text-xs opacity-75">
            Sign in with your registered mobile number & 4-digit PIN
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-sm">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setRoleType('ADMIN');
                setPinInput('');
              }}
              className={`p-2.5 rounded-xl border transition ${
                roleType === 'ADMIN'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                  : 'border-current/20 opacity-75 hover:opacity-100'
              }`}
            >
              👑 Owner / Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleType('WORKER');
                setPinInput('');
              }}
              className={`p-2.5 rounded-xl border transition ${
                roleType === 'WORKER'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                  : 'border-current/20 opacity-75 hover:opacity-100'
              }`}
            >
              👷 Staff / Worker
            </button>
          </div>

          {/* Mobile Number (+91) */}
          <div>
            <label className="block text-xs font-bold mb-1">Registered Mobile Number *</label>
            <div className="flex">
              <span className="bg-emerald-600/20 border border-r-0 border-current/20 rounded-l-xl px-3 flex items-center text-xs font-bold text-emerald-400">
                +91
              </span>
              <input
                required
                type="tel"
                maxLength={10}
                placeholder="9826145001"
                value={phoneInput}
                onChange={handlePhoneChange}
                className={`w-full rounded-r-xl px-4 py-2.5 border font-mono ${inputClass}`}
              />
            </div>
          </div>

          {/* 4-Digit PIN */}
          <div>
            <label className="block text-xs font-bold mb-1 flex items-center gap-1">
              <KeyRound size={13} className="text-emerald-400" />
              <span>4-Digit {roleType === 'ADMIN' ? 'Owner' : 'Worker'} PIN *</span>
            </label>
            <input
              required
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className={`w-full rounded-xl px-4 py-2.5 border font-mono text-center text-2xl tracking-widest ${inputClass}`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl shadow-lg transition"
          >
            Login to Farm Dashboard →
          </button>
        </form>

        <div className="pt-3 border-t border-current/10 text-center text-xs">
          <span className="opacity-75">Don't have a farm account yet? </span>
          <button
            type="button"
            onClick={onGoToRegister}
            className="text-emerald-400 font-bold hover:underline"
          >
            Enroll New Farm
          </button>
        </div>
      </div>
    </div>
  );
}
