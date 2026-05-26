import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  siteConfig as defaultSiteConfig,
  speakers as defaultSpeakers,
  schedule as defaultSchedule,
  ticketTiers as defaultTicketTiers,
  galleryImages as defaultGalleryImages,
  sponsors as defaultSponsors,
  tedxBoilerplate,
} from '../data/siteData';

const STORAGE_KEYS = {
  siteConfig: 'tedx_site_config',
  speakers: 'tedx_speakers',
  schedule: 'tedx_schedule',
  ticketTiers: 'tedx_ticket_tiers',
  galleryImages: 'tedx_gallery_images',
  sponsors: 'tedx_sponsors',
};

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    return fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}



const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [siteConfig, setSiteConfigState] = useState(defaultSiteConfig);
  const [speakers, setSpeakersState] = useState(defaultSpeakers);
  const [schedule, setScheduleState] = useState(defaultSchedule);
  const [ticketTiers, setTicketTiersState] = useState(defaultTicketTiers);
  const [galleryImages, setGalleryImagesState] = useState(defaultGalleryImages);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const [sponsors, setSponsorsState] = useState(defaultSponsors);



  // Load data from localStorage (demo mode - no Supabase)
  useEffect(() => {
    console.log('📱 Running in demo mode - using localStorage and default data');
    
    // Load from localStorage or use defaults
    setSiteConfigState(loadFromStorage(STORAGE_KEYS.siteConfig, defaultSiteConfig));
    setSpeakersState(loadFromStorage(STORAGE_KEYS.speakers, defaultSpeakers));
    setScheduleState(loadFromStorage(STORAGE_KEYS.schedule, defaultSchedule));
    setTicketTiersState(loadFromStorage(STORAGE_KEYS.ticketTiers, defaultTicketTiers));
    setGalleryImagesState(loadFromStorage(STORAGE_KEYS.galleryImages, defaultGalleryImages));
    setSponsorsState(loadFromStorage(STORAGE_KEYS.sponsors, defaultSponsors));
    
    setLoading(false);
  }, []);

  const updateSiteConfig = useCallback(async (newConfig) => {
    setSiteConfigState(newConfig);
    saveToStorage(STORAGE_KEYS.siteConfig, newConfig);
    console.log('✅ Site config updated');
  }, []);

  const updateSpeakers = useCallback(async (newSpeakers) => {
    setSpeakersState(newSpeakers);
    saveToStorage(STORAGE_KEYS.speakers, newSpeakers);
    console.log('✅ Speakers updated');
  }, []);

  const deleteSpeaker = useCallback(async (speakerId) => {
    console.log('✅ Speaker deleted');
  }, []);

  const updateSchedule = useCallback(async (newSchedule) => {
    setScheduleState(newSchedule);
    saveToStorage(STORAGE_KEYS.schedule, newSchedule);
    console.log('✅ Schedule updated');
  }, []);

  const updateTicketTiers = useCallback(async (newTiers) => {
    setTicketTiersState(newTiers);
    saveToStorage(STORAGE_KEYS.ticketTiers, newTiers);
    console.log('✅ Ticket tiers updated');
  }, []);

  const updateGalleryImages = useCallback(async (newImages, deletedIds = []) => {
    setGalleryImagesState(newImages);
    saveToStorage(STORAGE_KEYS.galleryImages, newImages);
    console.log('✅ Gallery images updated');
  }, []);

  const deleteGalleryImage = useCallback(async (imageId) => {
    console.log('✅ Gallery image deleted');
  }, []);

  const fetchGalleryImages = useCallback(async () => {
    // In demo mode, gallery images are loaded from localStorage on startup
    setGalleryLoading(false);
    setGalleryLoaded(true);
    console.log('✅ Gallery images loaded');
  }, []);

  const updateSponsors = useCallback(async (newSponsors) => {
    setSponsorsState(newSponsors);
    saveToStorage(STORAGE_KEYS.sponsors, newSponsors);
    console.log('✅ Sponsors updated');
  }, []);

  const deleteSponsor = useCallback(async (sponsorId) => {
    console.log('✅ Sponsor deleted');
  }, []);

  const resetToDefaults = useCallback(() => {
    updateSiteConfig(defaultSiteConfig);
    updateSpeakers(defaultSpeakers);
    updateSchedule(defaultSchedule);
    updateTicketTiers(defaultTicketTiers);
    updateGalleryImages(defaultGalleryImages);
    updateSponsors(defaultSponsors);
  }, [updateSiteConfig, updateSpeakers, updateSchedule, updateTicketTiers, updateGalleryImages, updateSponsors]);

  const value = {
    loading,
    siteConfig,
    updateSiteConfig,
    speakers,
    updateSpeakers,
    deleteSpeaker,
    schedule,
    updateSchedule,
    ticketTiers,
    updateTicketTiers,
    galleryImages,
    galleryLoading,
    galleryLoaded,
    fetchGalleryImages,
    updateGalleryImages,
    deleteGalleryImage,
    sponsors,
    updateSponsors,
    deleteSponsor,
    resetToDefaults,
    tedxBoilerplate,
  };

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
  return ctx;
}
