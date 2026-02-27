import React, { useState, useEffect, useCallback } from 'react';
import { Navigation, MapPin, AlertCircle, Loader } from 'lucide-react';
import { Card, ScreenHeader } from '../ui';

// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function calculateQiblaDirection(lat, lng) {
  const phiK = (KAABA_LAT * Math.PI) / 180;
  const lambdaK = (KAABA_LNG * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;

  const qibla =
    (Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    ) *
      180) /
    Math.PI;

  return (qibla + 360) % 360;
}

function getDistanceToKaaba(lat, lng) {
  const R = 6371; // Earth's radius in km
  const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
  const dLng = ((KAABA_LNG - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function QiblaCompass({ onBack }) {
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          const angle = calculateQiblaDirection(latitude, longitude);
          setQiblaAngle(angle);
          setLoading(false);
        },
        () => {
          // Fallback to a default location
          setLocation({ lat: 40.7128, lng: -74.006 }); // NYC fallback
          setQiblaAngle(calculateQiblaDirection(40.7128, -74.006));
          setError('Using approximate location. Enable GPS for accuracy.');
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      // No geolocation available - set error on next tick to avoid setState in effect body
      const id = setTimeout(() => {
        setError('Geolocation is not supported by your browser.');
        setLoading(false);
      }, 0);
      return () => clearTimeout(id);
    }
  }, []);

  // Device orientation for compass
  const handleOrientation = useCallback((event) => {
    let alpha = event.alpha; // compass direction
    if (alpha !== null) {
      // On iOS, webkitCompassHeading is more reliable
      if (event.webkitCompassHeading) {
        setHeading(event.webkitCompassHeading);
      } else {
        setHeading(360 - alpha);
      }
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        } catch {
          // Permission denied or error
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    };

    requestPermission();
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, [handleOrientation]);

  const requestCompassPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
          setPermissionGranted(true);
        }
      } catch {
        setError('Compass permission denied. Please enable in browser settings.');
      }
    }
  };

  // The arrow should point toward Qibla relative to device heading
  const qiblaRelative = qiblaAngle - heading;
  const distance = location ? getDistanceToKaaba(location.lat, location.lng) : null;

  // Cardinal direction
  const getCardinal = (angle) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(((angle % 360) + 360) % 360 / 45) % 8];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 dark:bg-night-300 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-sanctuary-500 animate-spin mx-auto mb-4" />
          <p className="text-text-secondary dark:text-cream-300">Finding your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 flex flex-col pb-24">
      <ScreenHeader title="Qibla Direction" subtitle="Face the direction of the Kaaba" onBack={onBack} />
      <div className="px-5 max-w-lg mx-auto w-full">

        {error && (
          <Card className="mb-4 bg-amber-50 dark:bg-amber-900/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-300">{error}</p>
            </div>
          </Card>
        )}
      </div>

      {/* Compass */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <div className="relative w-72 h-72 mb-8">
          {/* Outer ring with cardinal directions */}
          <div
            className="absolute inset-0 transition-transform duration-200 ease-out"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            <svg viewBox="0 0 288 288" className="w-full h-full">
              {/* Outer circle */}
              <circle cx="144" cy="144" r="140" fill="none" stroke="currentColor" strokeWidth="2" className="text-cream-300 dark:text-night-100" />
              <circle cx="144" cy="144" r="130" fill="none" stroke="currentColor" strokeWidth="1" className="text-cream-200 dark:text-night-200" />

              {/* Degree marks */}
              {Array.from({ length: 72 }).map((_, i) => {
                const angle = i * 5;
                const isMajor = angle % 30 === 0;
                const isCardinal = angle % 90 === 0;
                const innerR = isCardinal ? 115 : isMajor ? 120 : 125;
                const outerR = 130;
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={144 + innerR * Math.sin(rad)}
                    y1={144 - innerR * Math.cos(rad)}
                    x2={144 + outerR * Math.sin(rad)}
                    y2={144 - outerR * Math.cos(rad)}
                    stroke="currentColor"
                    strokeWidth={isCardinal ? 2 : isMajor ? 1.5 : 0.5}
                    className={isCardinal ? 'text-text-tertiary' : 'text-cream-300 dark:text-night-50'}
                  />
                );
              })}

              {/* Cardinal letters */}
              {[
                { label: 'N', angle: 0, color: 'text-rose-500' },
                { label: 'E', angle: 90, color: 'text-text-tertiary' },
                { label: 'S', angle: 180, color: 'text-text-tertiary' },
                { label: 'W', angle: 270, color: 'text-text-tertiary' },
              ].map(({ label, angle, color }) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <text
                    key={label}
                    x={144 + 105 * Math.sin(rad)}
                    y={144 - 105 * Math.cos(rad)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={`text-sm font-semibold ${color}`}
                    fill="currentColor"
                    style={{ transform: `rotate(${heading}deg)`, transformOrigin: `${144 + 105 * Math.sin(rad)}px ${144 - 105 * Math.cos(rad)}px` }}
                  >
                    {label}
                  </text>
                );
              })}

              {/* Islamic geometric decoration in center */}
              <circle cx="144" cy="144" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold-200 dark:text-gold-800" />
              <circle cx="144" cy="144" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold-200 dark:text-gold-800" />
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = i * 45;
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={`inner-${i}`}
                    x1={144 + 40 * Math.sin(rad)}
                    y1={144 - 40 * Math.cos(rad)}
                    x2={144 + 60 * Math.sin(rad)}
                    y2={144 - 60 * Math.cos(rad)}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-gold-200 dark:text-gold-800"
                  />
                );
              })}
            </svg>
          </div>

          {/* Qibla arrow (stays fixed, points to Qibla relative to heading) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out"
            style={{ transform: `rotate(${qiblaRelative}deg)` }}
          >
            <svg viewBox="0 0 288 288" className="w-full h-full">
              {/* Arrow pointing up (which is where Qibla is relative to heading) */}
              <path
                d="M144 30 L154 80 L144 70 L134 80 Z"
                fill="currentColor"
                className="text-sanctuary-500"
              />
              <line
                x1="144"
                y1="80"
                x2="144"
                y2="200"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-sanctuary-500"
                opacity="0.3"
              />
              {/* Kaaba icon at arrow tip */}
              <rect x="137" y="20" width="14" height="14" rx="2" fill="currentColor" className="text-sanctuary-600" />
              <text x="144" y="30" textAnchor="middle" dominantBaseline="central" fontSize="8" fill="white">
                🕋
              </text>
            </svg>
          </div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-4 bg-sanctuary-500 rounded-full shadow-lg shadow-soft" />
          </div>
        </div>

        {/* Info */}
        <div className="text-center mb-6">
          <p className="text-4xl font-light text-text-primary mb-1">
            {Math.round(qiblaAngle)}°
            <span className="text-lg text-text-tertiary ml-2">{getCardinal(qiblaAngle)}</span>
          </p>
          <p className="text-sm text-text-secondary dark:text-cream-300">
            Qibla Direction from your location
          </p>
        </div>

        {!permissionGranted && (
          <button
            onClick={requestCompassPermission}
            className="mb-4 px-6 py-3 bg-sanctuary-600 text-white rounded-xl font-medium active:bg-sanctuary-700 transition-colors"
          >
            Enable Compass
          </button>
        )}

        {distance !== null && (
          <Card className="w-full max-w-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-sanctuary-500" />
                <div>
                  <p className="text-sm font-medium text-text-secondary dark:text-cream-200">
                    Distance to Kaaba
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {location ? `${location.lat.toFixed(2)}°, ${location.lng.toFixed(2)}°` : ''}
                  </p>
                </div>
              </div>
              <p className="text-lg font-medium text-sanctuary-600 dark:text-sanctuary-400">
                {distance.toLocaleString()} km
              </p>
            </div>
          </Card>
        )}

        {permissionGranted && (
          <p className="text-xs text-text-tertiary mt-4 text-center">
            Point the top of your phone toward the arrow direction
          </p>
        )}
        {!permissionGranted && (
          <p className="text-xs text-text-tertiary mt-4 text-center">
            The compass shows the static Qibla angle. Enable the compass for real-time direction.
          </p>
        )}
      </div>
    </div>
  );
}
