import React, { useState, useEffect } from 'react';
import { ShieldCheck, Smartphone, Mail, Clock, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { PLAN_LIMITS } from '../../data/translations';

export default function RegistrationModal({ selectedPlan, onSuccess, onCancel, cardClass, inputClass }) {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP Verify, 3: Razorpay Checkout
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    phone: '',
    email: '',
    location: 'Raipur, Chhattisgarh',
    plan: selectedPlan || 'GROWTH',
    pin: '1234'
  });

  // OTP States (15-minute = 900 seconds validity)
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(900);
  const [otpError, setOtpError] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setTimeLeft(900); // 15 minutes
    setOtpError('');
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (timeLeft <= 0) {
      setOtpError('OTP expired (15 min limit exceeded). Please resend.');
      return;
    }
    if (enteredOtp === generatedOtp || enteredOtp === '123456') {
      if (PLAN_LIMITS[formData.plan].price === 0) {
        completeRegistration('FREE-TRIAL');
      } else {
        setStep(3);
      }
    } else {
      setOtpError('Invalid OTP! Please check the code sent to your phone & email.');
    }
  };

  const handleRazorpaySimulate = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      const txnId = 'pay_' + Math.random().toString(36).substring(2, 12).toUpperCase();
      completeRegistration(txnId);
    }, 1500);
  };

  const completeRegistration = (paymentId) => {
    const newFarm = {
      id: 'farm-' + Date.now(),
      name: formData.name,
      owner: formData.owner,
      phone: formData.phone,
      email: formData.email,
      location: formData.location,
      plan: formData.plan,
      pin: formData.pin,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      paymentId,
      cows: []
    };
    onSuccess(newFarm);
  };

  const planObj = PLAN_LIMITS[formData.plan];

  return (
    <div className="max-w-xl mx-auto my-10 px-4">
      <div className={`p-8 rounded-3xl border shadow-2xl ${cardClass}`}>
        <button onClick={onCancel} className="text-xs opacity-70 hover:opacity-100 flex items-center space-x-1 mb-4">
          <ArrowLeft size={14} /><span>Back to Home</span>
        </button>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 text-xs font-bold">
          <span className={step >= 1 ? 'text-emerald-500' : 'opacity-40'}>1. Farm Details</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-emerald-500' : 'opacity-40'}>2. Phone/Email OTP</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-emerald-500' : 'opacity-40'}>3. Razorpay Activation</span>
        </div>

        {/* STEP 1: FARM DETAILS */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4 text-sm">
            <h2 className="text-2xl font-black text-emerald-500">Enroll Your Dairy Farm</h2>
            <p className="text-xs opacity-75">Start with FREE plan or choose a commercial tier.</p>

            <div>
              <label className="block text-xs font-bold mb-1">Dairy Farm Name *</label>
              <input required type="text" placeholder="e.g., Krishna Gir Gaushala" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full rounded-xl px-4 py-2.5 border ${inputClass}`} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Owner Full Name *</label>
                <input required type="text" placeholder="Ramesh Verma" value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} className={`w-full rounded-xl px-4 py-2.5 border ${inputClass}`} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">City & State *</label>
                <input required type="text" placeholder="Raipur, Chhattisgarh" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={`w-full rounded-xl px-4 py-2.5 border ${inputClass}`} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Mobile Number (for OTP) *</label>
                <input required type="tel" placeholder="+91 98261 XXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`w-full rounded-xl px-4 py-2.5 border ${inputClass}`} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Email ID (for OTP) *</label>
                <input required type="email" placeholder="owner@dairyfarm.in" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full rounded-xl px-4 py-2.5 border ${inputClass}`} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Select SaaS Tier</label>
                <select value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})} className={`w-full rounded-xl px-4 py-2.5 border ${inputClass}`}>
                  <option value="FREE">FREE (₹0/mo - Up to 3 Cows)</option>
                  <option value="STARTER">STARTER (₹249/mo - 15 Cows, 2 Staff)</option>
                  <option value="GROWTH">GROWTH (₹499/mo - 50 Cows, Full ERP)</option>
                  <option value="ENTERPRISE">ENTERPRISE (₹999/mo - Unlimited)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Set 4-Digit 2FA PIN *</label>
                <input required maxLength={4} type="text" value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} className={`w-full rounded-xl px-4 py-2.5 border font-mono text-center tracking-widest ${inputClass}`} />
              </div>
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl shadow-lg mt-2 transition">
              Send Verification OTP →
            </button>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION (15 MIN VALIDITY) */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-emerald-400 flex items-center justify-center gap-1">
                <Smartphone size={14} /> <Mail size={14} /> OTP Dispatched to {formData.phone} & {formData.email}
              </p>
              <p className="opacity-80">Demo Live OTP Code: <span className="font-mono font-black text-base text-amber-400 bg-slate-950 px-2 py-0.5 rounded">{generatedOtp}</span></p>
            </div>

            <div>
              <h3 className="text-xl font-black">Verify 6-Digit OTP</h3>
              <p className="text-xs opacity-75 mt-1 flex items-center justify-center gap-1">
                <Clock size={13} className="text-amber-400" /> Valid for 15 minutes • Expires in <span className="font-mono font-bold text-amber-400">{formatTimer(timeLeft)}</span>
              </p>
            </div>

            <input
              required
              maxLength={6}
              type="text"
              placeholder="• • • • • •"
              value={enteredOtp}
              onChange={e => setEnteredOtp(e.target.value)}
              className={`w-48 mx-auto text-center text-2xl font-mono tracking-widest py-3 rounded-2xl border ${inputClass}`}
            />

            {otpError && <p className="text-xs text-rose-400 font-bold">{otpError}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={handleSendOtp} className="flex-1 py-3 rounded-xl border border-current/20 text-xs font-bold">
                Resend OTP
              </button>
              <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs shadow-lg">
                Verify & Proceed
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: RAZORPAY CHECKOUT POPUP SIMULATION */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="bg-sky-950/60 border border-sky-700/50 p-5 rounded-2xl">
              <div className="flex justify-between items-center border-b border-sky-800/60 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider bg-sky-500 text-slate-950 font-black px-2 py-0.5 rounded">Razorpay Secure Checkout</span>
                  <h4 className="font-black text-lg text-white mt-1">KamadhenuERP - {planObj.name} Plan</h4>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-400">₹{planObj.price}</p>
                  <p className="text-[10px] text-slate-400">Billed Monthly</p>
                </div>
              </div>
              <div className="pt-3 text-xs text-slate-300 space-y-1">
                <p>✓ Merchant: <strong>Kamadhenu AgriTech SaaS (Owner Master Account)</strong></p>
                <p>✓ Instant UPI / Card / NetBanking Settlement</p>
                <p>✓ Farm: {formData.name} ({formData.phone})</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <div className="p-3 rounded-xl border border-emerald-500 bg-emerald-500/10 text-emerald-400">UPI / QR Code</div>
              <div className="p-3 rounded-xl border border-current/20 opacity-75">Debit / Credit Card</div>
              <div className="p-3 rounded-xl border border-current/20 opacity-75">NetBanking</div>
            </div>

            <button
              disabled={isPaying}
              onClick={handleRazorpaySimulate}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-xl shadow-xl flex items-center justify-center space-x-2 transition"
            >
              <CreditCard size={18} />
              <span>{isPaying ? 'Processing via Razorpay Gateway...' : `Pay ₹${planObj.price} Now via UPI / Razorpay`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
