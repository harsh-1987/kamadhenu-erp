import React, { useState } from 'react';
import { MapPin, Phone, Search, Tag, CheckCircle, Lock } from 'lucide-react';

export default function BreedMarketplace({ farms, t, cardClass, inputClass, onBack }) {
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedBreed, setSelectedBreed] = useState('ALL');
  const [contactModal, setContactModal] = useState(null);

  // Extract unique locations and breeds across all enrolled farms
  const locations = ['ALL', ...new Set(farms.map(f => f.location))];
  const allCows = farms.flatMap(farm =>
    (farm.cows || [])
      .filter(cow => cow.inMarketplace)
      .map(cow => ({
        ...cow,
        farmName: farm.name,
        farmLocation: farm.location,
        farmPhone: farm.phone,
        farmOwner: farm.owner,
        farmPlan: farm.plan
      }))
  );

  const breeds = ['ALL', ...new Set(allCows.map(c => c.breed))];

  const filteredCows = allCows.filter(cow => {
    const matchLoc = selectedLocation === 'ALL' || cow.farmLocation === selectedLocation;
    const matchBreed = selectedBreed === 'ALL' || cow.breed === selectedBreed;
    return matchLoc && matchBreed;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full">
            🌾 Verified Multi-Farm Livestock & A2 Milk Directory
          </span>
          <h1 className="text-3xl font-black mt-2">Find Pure Breed Cows & Dairy Farms Near You</h1>
          <p className="text-sm opacity-75 mt-1">
            Search by city and cattle breed (Gir, Sahiwal, Desi, Murrah) to source pure milk or purchase verified livestock.
          </p>
        </div>
        <button onClick={onBack} className="px-4 py-2 rounded-xl border border-current/20 text-xs font-bold hover:bg-current/10">
          ← Back
        </button>
      </div>

      {/* Location & Breed Filters */}
      <div className={`p-5 rounded-3xl border grid grid-cols-1 md:grid-cols-3 gap-4 ${cardClass}`}>
        <div>
          <label className="text-xs font-bold opacity-75 block mb-1.5 flex items-center gap-1">
            <MapPin size={14} className="text-emerald-500" /> {t.filterLocation}
          </label>
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className={`w-full rounded-xl px-4 py-2.5 border text-sm font-bold ${inputClass}`}
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc === 'ALL' ? t.allLocations : loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold opacity-75 block mb-1.5 flex items-center gap-1">
            <Search size={14} className="text-amber-500" /> {t.filterBreed}
          </label>
          <select
            value={selectedBreed}
            onChange={e => setSelectedBreed(e.target.value)}
            className={`w-full rounded-xl px-4 py-2.5 border text-sm font-bold ${inputClass}`}
          >
            {breeds.map(b => (
              <option key={b} value={b}>{b === 'ALL' ? t.allBreeds : b}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <div className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-xs">
            <span className="opacity-75">Matching Verified Cattle:</span>
            <p className="text-lg font-black text-emerald-500">{filteredCows.length} Animals Found</p>
          </div>
        </div>
      </div>

      {/* Marketplace Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCows.map(item => (
          <div key={item.id} className={`p-6 rounded-3xl border flex flex-col justify-between transition hover:border-emerald-500/60 ${cardClass}`}>
            <div>
              <div className="flex justify-between items-start">
                <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full">
                  {item.breed}
                </span>
                <span className="text-xs font-mono opacity-60">Tag: {item.tag}</span>
              </div>

              <h3 className="text-xl font-black mt-3">{item.name}</h3>
              <p className="text-xs opacity-75 mt-1">Daily Milk Capacity: <strong>{item.dailyYield} Liters/day</strong></p>

              <div className="mt-4 p-3.5 rounded-2xl bg-current/5 space-y-1 text-xs">
                <p className="font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle size={13} /> {item.farmName}
                </p>
                <p className="opacity-75 flex items-center gap-1">
                  <MapPin size={12} /> {item.farmLocation}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-current/10 flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase opacity-60 font-bold">Sale Valuation</p>
                {item.showPrice ? (
                  <p className="text-lg font-black text-emerald-500">₹{Number(item.askingPrice).toLocaleString()}</p>
                ) : (
                  <p className="text-xs font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                    <Lock size={12} /> {t.priceOnRequest}
                  </p>
                )}
              </div>

              <button
                onClick={() => setContactModal(item)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Phone size={13} /><span>{t.contactFarm}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Farm Modal */}
      {contactModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl space-y-4 ${cardClass}`}>
            <h3 className="text-xl font-black text-emerald-500">Connect with {contactModal.farmName}</h3>
            <p className="text-xs opacity-80">
              Inquiring about: <strong>{contactModal.name} ({contactModal.breed})</strong> • Yield: {contactModal.dailyYield}L/day
            </p>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-sm">
              <p><strong>Farm Owner:</strong> {contactModal.farmOwner}</p>
              <p><strong>Location:</strong> {contactModal.farmLocation}</p>
              <p><strong>Direct Phone / WhatsApp:</strong> <span className="font-mono font-bold text-emerald-400">{contactModal.farmPhone}</span></p>
              <p><strong>Price Status:</strong> {contactModal.showPrice ? `₹${Number(contactModal.askingPrice).toLocaleString()}` : 'Price Hidden by Owner (Call to negotiate)'}</p>
            </div>
            <button onClick={() => setContactModal(null)} className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
