'use client';

import React, { useState } from 'react';
import { Place, CategoryType, AccessType } from '@/types';
import { createPlace } from '@/services/api';
import { X, Plus, MapPin, DollarSign, ShieldAlert, Check } from 'lucide-react';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoords: [number, number]; // [lng, lat]
  onPlaceAdded: (place: Place) => void;
}

const DISTRICTS = [
  'Kandy', 'Colombo', 'Galle', 'Badulla', 'Matale', 'Nuwara Eliya',
  'Matara', 'Anuradhapura', 'Polonnaruwa', 'Jaffna', 'Trincomalee',
  'Hambantota', 'Ratnapura', 'Kurunegala', 'Kalutara', 'Gampaha'
];

export default function AddPlaceModal({
  isOpen,
  onClose,
  currentCoords,
  onPlaceAdded,
}: AddPlaceModalProps) {
  const [name, setName] = useState('');
  const [nameSi, setNameSi] = useState('');
  const [nameTa, setNameTa] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('heritage');
  const [subCategory, setSubCategory] = useState('temple');
  const [lat, setLat] = useState(currentCoords[1].toFixed(4));
  const [lng, setLng] = useState(currentCoords[0].toFixed(4));
  const [district, setDistrict] = useState('Kandy');
  const [elevation, setElevation] = useState('500');

  // Pricing
  const [foreignLkr, setForeignLkr] = useState('');
  const [foreignUsd, setForeignUsd] = useState('');
  const [saarcLkr, setSaarcLkr] = useState('');
  const [localLkr, setLocalLkr] = useState('0');

  // Dress & Cultural Etiquette
  const [shouldersCovered, setShouldersCovered] = useState(false);
  const [kneesCovered, setKneesCovered] = useState(false);
  const [footwearRemoved, setFootwearRemoved] = useState(false);
  const [hotPavement, setHotPavement] = useState(false);
  const [photoRules, setPhotoRules] = useState('');

  // Access & Timing
  const [access, setAccess] = useState<AccessType>('car');
  const [visitWindow, setVisitWindow] = useState('6:30 AM - 9:30 AM');
  const [pujaTimes, setPujaTimes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUseCurrentCenter = () => {
    setLng(currentCoords[0].toFixed(4));
    setLat(currentCoords[1].toFixed(4));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      const newPlaceData: Partial<Place> = {
        name: name.trim(),
        local_names: {
          en: name.trim(),
          si: nameSi.trim() || undefined,
          ta: nameTa.trim() || undefined,
        },
        description: description.trim(),
        category,
        sub_category: subCategory.trim() || 'attraction',
        latitude: parseFloat(lat) || currentCoords[1],
        longitude: parseFloat(lng) || currentCoords[0],
        elevation_m: parseInt(elevation, 10) || 500,
        district,
        province: district === 'Kandy' || district === 'Matale' || district === 'Nuwara Eliya' ? 'Central Province' : 'Sri Lanka',
        pricing: {
          foreign_adult_lkr: foreignLkr ? parseInt(foreignLkr, 10) : 0,
          foreign_adult_usd: foreignUsd ? parseFloat(foreignUsd) : 0,
          saarc_adult_lkr: saarcLkr ? parseInt(saarcLkr, 10) : 0,
          local_adult_lkr: localLkr ? parseInt(localLkr, 10) : 0,
        },
        dress_code: {
          shoulders_covered: shouldersCovered,
          knees_covered: kneesCovered,
          footwear_removed: footwearRemoved,
          headwear_removed: footwearRemoved,
          hot_pavement_warning: hotPavement,
          photo_rules: photoRules.trim() || undefined,
        },
        best_time_to_visit: {
          recommended_window: visitWindow.trim() || undefined,
          puja_times: pujaTimes ? pujaTimes.split(',').map((s) => s.trim()) : [],
        },
        access_feasibility: access,
        parking_available: true,
      };

      const savedPlace = await createPlace(newPlaceData);
      onPlaceAdded(savedPlace);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      alert(`Could not save place: ${err}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-semibold uppercase tracking-wider mb-1">
            <Plus size={14} />
            <span>Database Maintenance</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Add New Place to Database</h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            Add a verified destination with dual pricing, cultural dress etiquette, and topography coordinates.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {success ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check size={28} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Place Added to CeylonCopilot Database!</h3>
              <p className="text-xs text-gray-500">Your place has been stored and is now live on the map and discovery list.</p>
            </div>
          ) : (
            <>
              {/* Section 1: Basic Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b pb-1">
                  1. Identification & Names
                </h3>
                
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Place Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lankatilaka Vihara or Pedro Tea Estate"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Sinhala Name (සිංහල)</label>
                    <input
                      type="text"
                      value={nameSi}
                      onChange={(e) => setNameSi(e.target.value)}
                      placeholder="e.g. ලංකාතිලක විහාරය"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Tamil Name (தமிழ்)</label>
                    <input
                      type="text"
                      value={nameTa}
                      onChange={(e) => setNameTa(e.target.value)}
                      placeholder="e.g. லங்காத்திலக விகாரை"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Historical context, architectural highlights, viewpoint tips..."
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Section 2: Location & Topography */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                    2. Geographic Coordinates & Topography
                  </h3>
                  <button
                    type="button"
                    onClick={handleUseCurrentCenter}
                    className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <MapPin size={12} />
                    <span>Use Map Center ({currentCoords[1].toFixed(2)}, {currentCoords[0].toFixed(2)})</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Elevation (m ASL)</label>
                    <input
                      type="number"
                      value={elevation}
                      onChange={(e) => setElevation(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryType)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white outline-none"
                    >
                      <option value="heritage">Heritage & Sacred</option>
                      <option value="nature">Nature & Hiking</option>
                      <option value="tea_agriculture">Tea & Estates</option>
                      <option value="wildlife">Wildlife & Marine</option>
                      <option value="food_local">Food & Local</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Sub-Category</label>
                    <input
                      type="text"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      placeholder="e.g. temple, waterfall, viewpoint"
                      className="w-full p-2.5 rounded-xl border border-gray-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">District</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white outline-none"
                    >
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: FR-2.2 Pricing Transparency */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b pb-1 flex items-center gap-1">
                  <DollarSign size={14} className="text-emerald-600" />
                  3. Dual-Pricing Transparency (LKR / USD)
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
                    <label className="font-semibold text-emerald-900 block mb-1">Foreign Adult (LKR)</label>
                    <input
                      type="number"
                      value={foreignLkr}
                      onChange={(e) => setForeignLkr(e.target.value)}
                      placeholder="e.g. 3000"
                      className="w-full p-2 rounded-lg border border-emerald-300 bg-white text-xs outline-none"
                    />
                    <label className="font-semibold text-emerald-900 block mt-2 mb-1">USD Eq. (~$)</label>
                    <input
                      type="number"
                      step="any"
                      value={foreignUsd}
                      onChange={(e) => setForeignUsd(e.target.value)}
                      placeholder="e.g. 10.0"
                      className="w-full p-2 rounded-lg border border-emerald-300 bg-white text-xs outline-none"
                    />
                  </div>

                  <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-200">
                    <label className="font-semibold text-blue-900 block mb-1">SAARC Adult (LKR)</label>
                    <input
                      type="number"
                      value={saarcLkr}
                      onChange={(e) => setSaarcLkr(e.target.value)}
                      placeholder="e.g. 1500"
                      className="w-full p-2 rounded-lg border border-blue-300 bg-white text-xs outline-none"
                    />
                    <span className="text-[10px] text-blue-600 mt-2 block">For Indian, Maldivian, Nepal etc. passport holders</span>
                  </div>

                  <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200">
                    <label className="font-semibold text-amber-900 block mb-1">Sri Lankan Citizen (LKR)</label>
                    <input
                      type="number"
                      value={localLkr}
                      onChange={(e) => setLocalLkr(e.target.value)}
                      placeholder="0 for temples, 100 for parks"
                      className="w-full p-2 rounded-lg border border-amber-300 bg-white text-xs outline-none"
                    />
                    <span className="text-[10px] text-amber-600 mt-2 block">0 if free entrance</span>
                  </div>
                </div>
              </div>

              {/* Section 4: FR-2.3 Cultural & Dress Etiquette */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b pb-1 flex items-center gap-1">
                  <ShieldAlert size={14} className="text-amber-600" />
                  4. Cultural & Dress Etiquette Flags
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shouldersCovered}
                      onChange={(e) => setShouldersCovered(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Shoulders covered</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={kneesCovered}
                      onChange={(e) => setKneesCovered(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Knees covered</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footwearRemoved}
                      onChange={(e) => setFootwearRemoved(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Remove shoes</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-red-200 bg-red-50 text-red-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hotPavement}
                      onChange={(e) => setHotPavement(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Hot rock pavement</span>
                  </label>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Photography Rules</label>
                  <input
                    type="text"
                    value={photoRules}
                    onChange={(e) => setPhotoRules(e.target.value)}
                    placeholder="e.g. Photography permitted; strictly no selfie backs to Buddha statues"
                    className="w-full p-2.5 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
              </div>

              {/* Section 5: Access & Timing */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Vehicle Feasibility</label>
                  <select
                    value={access}
                    onChange={(e) => setAccess(e.target.value as AccessType)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 bg-white outline-none"
                  >
                    <option value="car">Car / Van Accessible</option>
                    <option value="tuk_tuk_track">Narrow Tuk-Tuk Track</option>
                    <option value="4wd_only">4WD / High Clearance Only</option>
                    <option value="foot_trail">Foot Trail Only</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Optimal Window</label>
                  <input
                    type="text"
                    value={visitWindow}
                    onChange={(e) => setVisitWindow(e.target.value)}
                    placeholder="e.g. 6:30 AM - 9:00 AM"
                    className="w-full p-2.5 rounded-xl border border-gray-300 outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Puja Times (if temple)</label>
                  <input
                    type="text"
                    value={pujaTimes}
                    onChange={(e) => setPujaTimes(e.target.value)}
                    placeholder="e.g. 05:30 AM, 09:30 AM"
                    className="w-full p-2.5 rounded-xl border border-gray-300 outline-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 font-semibold hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !name.trim()}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white rounded-xl font-bold shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>{submitting ? 'Saving to Database...' : 'Save Place to Database'}</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
