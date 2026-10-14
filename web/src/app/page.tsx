'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Place, VisitSequenceResult } from '@/types';
import { fetchNearbyPlaces } from '@/services/api';
import { REGION_BY_ID } from '@/data/regions_data';
import { HOT_TOPICS } from '@/data/hot_topics_data';
import FilterBar from '@/components/filters/FilterBar';
import PlaceCard from '@/components/place/PlaceCard';
import PlaceDetailModal from '@/components/place/PlaceDetailModal';
import AddPlaceModal from '@/components/place/AddPlaceModal';
import SmartLoopsModal from '@/components/loops/SmartLoopsModal';
import OfflinePacksModal from '@/components/offline/OfflinePacksModal';
import CommunityReportModal from '@/components/community/CommunityReportModal';
import TripSequencerPanel from '@/components/itinerary/TripSequencerPanel';
import TukTukFareModal from '@/components/calculator/TukTukFareModal';
import { Compass, Plus } from 'lucide-react';

// Dynamic import for MapLibre GL to disable SSR
const CeylonMap = dynamic(() => import('@/components/map/CeylonMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-emerald-950/20 rounded-2xl flex items-center justify-center text-xs text-gray-500 font-medium animate-pulse">
      🗺️ Initializing Sri Lanka Vector Map...
    </div>
  ),
});

export default function HomePage() {
  const [selectedRegionId, setSelectedRegionId] = useState('all-sri-lanka');
  const [selectedHotTopicId, setSelectedHotTopicId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([80.7718, 7.8731]);
  const [radiusKm, setRadiusKm] = useState(250);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxTravelTime, setMaxTravelTime] = useState<number | null>(null);

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [reportPlace, setReportPlace] = useState<Place | null>(null);

  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [showLoopsModal, setShowLoopsModal] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showTukTukModal, setShowTukTukModal] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Sequencer State
  const [showSequencer, setShowSequencer] = useState(false);
  const [sequenceStartCoords, setSequenceStartCoords] = useState<[number, number]>([80.7718, 7.8731]);
  const [sequenceStartName, setSequenceStartName] = useState<string>('All Sri Lanka');
  const [activeSequenceResult, setActiveSequenceResult] = useState<VisitSequenceResult | null>(null);

  const loadPlaces = async () => {
    setLoading(true);
    try {
      const data = await fetchNearbyPlaces({
        lng: mapCenter[0],
        lat: mapCenter[1],
        radius_km: radiusKm,
        category: selectedCategory,
        max_travel_time_mins: maxTravelTime || undefined,
      });
      setPlaces(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapCenter, radiusKm, selectedCategory, maxTravelTime]);

  const handleSelectRegion = (regId: string) => {
    setSelectedRegionId(regId);
    setSelectedHotTopicId(null);
    const reg = REGION_BY_ID[regId];
    if (reg) {
      setMapCenter(reg.coords);
      setSequenceStartCoords(reg.coords);
      setSequenceStartName(reg.name);
      setRadiusKm(reg.radiusKm);
    }
  };

  const handleSelectHotTopic = (topicId: string | null) => {
    setSelectedHotTopicId(topicId);
    if (topicId) {
      const topic = HOT_TOPICS.find((t) => t.id === topicId);
      if (topic) {
        setMapCenter(topic.center);
        setRadiusKm(topic.radiusKm);
        setSequenceStartCoords(topic.center);
        setSequenceStartName(topic.label);
      }
    } else {
      const reg = REGION_BY_ID[selectedRegionId];
      if (reg) {
        setMapCenter(reg.coords);
        setRadiusKm(reg.radiusKm);
      }
    }
  };

  // Filter places matching active hot topic
  const displayedPlaces = useMemo(() => {
    if (!selectedHotTopicId) return places;
    const topic = HOT_TOPICS.find((t) => t.id === selectedHotTopicId);
    if (!topic) return places;
    return places.filter(topic.matches);
  }, [places, selectedHotTopicId]);

  const currentTopic = HOT_TOPICS.find((t) => t.id === selectedHotTopicId);
  const currentRegion = REGION_BY_ID[selectedRegionId];

  const handlePlaceAdded = (newPlace: Place) => {
    setPlaces((prev) => [newPlace, ...prev.filter((p) => p.id !== newPlace.id)]);
    setMapCenter([newPlace.longitude, newPlace.latitude]);
    setSelectedPlace(newPlace);
    setSyncNotice(`Added "${newPlace.name}" to database!`);
    setTimeout(() => setSyncNotice(null), 3000);
  };

  const handleStartSequenceFromPlace = (place: Place) => {
    setSequenceStartCoords([place.longitude, place.latitude]);
    setSequenceStartName(place.name);
    setShowSequencer(true);
  };

  const handleOpenSequencerFromBar = () => {
    setSequenceStartCoords(mapCenter);
    const label = currentTopic?.label || currentRegion?.shortName || 'Selected Map Location';
    setSequenceStartName(label);
    setShowSequencer(true);
  };

  const handleMapClick = (coords: [number, number]) => {
    if (showSequencer) {
      setSequenceStartCoords(coords);
      setSequenceStartName(`Map Point (${coords[1].toFixed(3)}, ${coords[0].toFixed(3)})`);
    }
  };

  const handleSelectPlaceById = (placeId: string) => {
    const found = places.find((p) => p.id === placeId);
    if (found) setSelectedPlace(found);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f4f8f4] overflow-hidden font-sans">
      {/* Top sticky navigation and filter bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        radiusKm={radiusKm}
        onChangeRadius={setRadiusKm}
        maxTravelTime={maxTravelTime}
        onChangeMaxTravelTime={setMaxTravelTime}
        selectedRegionId={selectedRegionId}
        onSelectRegion={handleSelectRegion}
        selectedHotTopicId={selectedHotTopicId}
        onSelectHotTopic={handleSelectHotTopic}
        onOpenOfflinePacks={() => setShowOfflineModal(true)}
        onOpenLoops={() => setShowLoopsModal(true)}
        onOpenAddPlace={() => setShowAddPlaceModal(true)}
        onOpenSequencer={handleOpenSequencerFromBar}
        onOpenTukTukFare={() => setShowTukTukModal(true)}
        placesCount={displayedPlaces.length}
      />

      {/* Sync feedback toast banner */}
      {syncNotice && (
        <div className="bg-emerald-800 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between shadow-md transition-all">
          <span>{syncNotice}</span>
          <button onClick={() => setSyncNotice(null)} className="text-emerald-200 hover:text-white">✕</button>
        </div>
      )}

      {/* Main content grid: sidebar list & interactive vector map */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Side: Places List */}
        <div className="w-full md:w-[420px] lg:w-[460px] h-[45vh] md:h-full flex flex-col border-r border-emerald-200 bg-[#f9fcf9] z-10 shrink-0">
          {/* Header count & status */}
          <div className="px-4 py-2.5 bg-emerald-50/90 border-b border-emerald-200/90 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-950 truncate pr-2">
              {currentTopic ? (
                <>
                  🔥 <span className="text-amber-800 font-bold">{currentTopic.label}:</span>{' '}
                  <strong className="text-emerald-800">{displayedPlaces.length}</strong> highlights
                </>
              ) : (
                <>
                  Found <strong className="text-emerald-800">{displayedPlaces.length}</strong> places in{' '}
                  <span className="font-bold text-gray-800">{currentRegion?.shortName || 'Sri Lanka'}</span>
                </>
              )}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {selectedHotTopicId && (
                <button
                  onClick={() => setSelectedHotTopicId(null)}
                  className="text-[11px] text-amber-700 hover:text-amber-900 font-bold underline"
                >
                  Clear topic
                </button>
              )}
              <button
                onClick={() => setShowAddPlaceModal(true)}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <Plus size={12} />
                <span>Add Custom</span>
              </button>
            </div>
          </div>

          {/* Cards container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {loading ? (
              <div className="text-center py-16 text-gray-400 text-xs animate-pulse">
                Calculating topography-adjusted travel times...
              </div>
            ) : displayedPlaces.length === 0 ? (
              <div className="text-center py-16 px-4 text-gray-500 text-xs space-y-3">
                <Compass className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="font-medium">
                  {selectedHotTopicId
                    ? `No places found matching "${currentTopic?.label}" in this area.`
                    : `No places found within ${radiusKm} km of this point.`}
                </p>
                <div className="flex flex-col gap-2 items-center">
                  {selectedHotTopicId && (
                    <button
                      onClick={() => setSelectedHotTopicId(null)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs text-xs"
                    >
                      Show All Highlights
                    </button>
                  )}
                  <button
                    onClick={() => setRadiusKm(250)}
                    className="text-emerald-700 underline text-[11px]"
                  >
                    Expand to Nationwide View (250 km)
                  </button>
                </div>
              </div>
            ) : (
              displayedPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isSelected={selectedPlace?.id === place.id}
                  onSelect={(p) => setSelectedPlace(p)}
                  onStartSequence={handleStartSequenceFromPlace}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Side: Map Canvas */}
        <div className="flex-1 h-[55vh] md:h-full relative p-2 md:p-3 bg-[#eaf4ea]">
          <CeylonMap
            center={mapCenter}
            radiusKm={radiusKm}
            places={displayedPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={(p) => setSelectedPlace(p)}
            sequenceResult={activeSequenceResult}
            onMapClick={handleMapClick}
          />
        </div>
      </div>

      {/* Sequencer Side Panel */}
      <TripSequencerPanel
        isOpen={showSequencer}
        onClose={() => setShowSequencer(false)}
        startCoords={sequenceStartCoords}
        startName={sequenceStartName}
        onSelectPlaceById={handleSelectPlaceById}
        onSequenceUpdated={setActiveSequenceResult}
        onChangeStartPoint={(coords, name) => {
          setSequenceStartCoords(coords);
          setSequenceStartName(name);
        }}
      />

      {/* Modals */}
      {selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onSelectPlace={(p) => setSelectedPlace(p)}
          onOpenReport={(p) => setReportPlace(p)}
          onStartSequence={handleStartSequenceFromPlace}
        />
      )}

      <AddPlaceModal
        isOpen={showAddPlaceModal}
        onClose={() => setShowAddPlaceModal(false)}
        currentCoords={mapCenter}
        onPlaceAdded={handlePlaceAdded}
      />

      <SmartLoopsModal
        isOpen={showLoopsModal}
        onClose={() => setShowLoopsModal(false)}
      />

      <OfflinePacksModal
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
      />

      <TukTukFareModal
        isOpen={showTukTukModal}
        onClose={() => setShowTukTukModal(false)}
      />

      {reportPlace && (
        <CommunityReportModal
          place={reportPlace}
          onClose={() => setReportPlace(null)}
        />
      )}
    </div>
  );
}
