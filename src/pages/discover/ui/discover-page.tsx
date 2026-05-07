'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import mapboxgl from 'mapbox-gl';
import { Clock3, ListFilter, MapPin, Navigation, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchPublicBranches } from '@/entities/venue';
import type { Branch } from '@/entities/venue';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { SPORTS } from '@/entities/sport';

type Coordinates = {
  latitude: number;
  longitude: number;
};

const DEFAULT_CENTER: Coordinates = {
  latitude: 10.762622,
  longitude: 106.660172,
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const toRadians = (value: number) => (value * Math.PI) / 180;

const getDistanceKm = (a: Coordinates, b: Coordinates) => {
  const earthRadius = 6371;
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  return 2 * earthRadius * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const formatTime = (time?: string) => {
  if (!time) return '--:--';
  return time.slice(0, 5);
};

const markerColorByKeyword = (branch: Branch) => {
  const keyword = `${branch.name} ${branch.address}`.toLowerCase();
  if (keyword.includes('pickle')) return '#3b82f6';
  if (keyword.includes('tennis')) return '#f59e0b';
  if (keyword.includes('football') || keyword.includes('soccer'))
    return '#ef4444';
  return '#22c55e';
};

function DiscoverMap({
  branches,
  center,
  activeBranchId,
  onSelectBranch,
  onBoundsChanged,
}: {
  branches: Branch[];
  center: Coordinates;
  activeBranchId?: string;
  onSelectBranch: (branchId: string) => void;
  onBoundsChanged: (bounds: mapboxgl.LngLatBounds | null) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const markerByBranchIdRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [center.longitude, center.latitude],
      zoom: 12,
    });
    mapRef.current.on('moveend', () => {
      onBoundsChanged(mapRef.current?.getBounds() ?? null);
    });
    onBoundsChanged(mapRef.current.getBounds());

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [center.latitude, center.longitude, onBoundsChanged]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [center.longitude, center.latitude],
      zoom: 12,
      essential: true,
    });
  }, [center.latitude, center.longitude]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    markerByBranchIdRef.current.clear();

    branches.forEach(branch => {
      if (branch.latitude == null || branch.longitude == null) return;

      const markerElement = document.createElement('button');
      markerElement.type = 'button';
      markerElement.className =
        'flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-base shadow-md';
      markerElement.style.backgroundColor = markerColorByKeyword(branch);
      markerElement.textContent = '🏸';
      markerElement.setAttribute('aria-label', branch.name);

      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([branch.longitude, branch.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 15 }).setHTML(
            `<strong>${branch.name}</strong><br/>${branch.address}`
          )
        )
        .addTo(mapRef.current as mapboxgl.Map);

      markerElement.addEventListener('click', () => onSelectBranch(branch.id));
      markersRef.current.push(marker);
      markerByBranchIdRef.current.set(branch.id, marker);
    });
  }, [branches, onSelectBranch]);

  useEffect(() => {
    if (!activeBranchId) return;
    const marker = markerByBranchIdRef.current.get(activeBranchId);
    if (!marker || !mapRef.current) return;
    const lngLat = marker.getLngLat();
    mapRef.current.flyTo({
      center: [lngLat.lng, lngLat.lat],
      zoom: 14,
      essential: true,
    });
    marker.togglePopup();
  }, [activeBranchId]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className='text-muted-foreground border-border rounded-lg border p-4 text-sm'>
        Add `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` to show map.
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className='border-border h-[420px] w-full rounded-xl border'
    />
  );
}

export function DiscoverPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams?.get('search') ?? '');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [onlyNearby, setOnlyNearby] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [activeBranchId, setActiveBranchId] = useState<string | undefined>();
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [visibleBounds, setVisibleBounds] =
    useState<mapboxgl.LngLatBounds | null>(null);
  const [useMapArea, setUseMapArea] = useState(false);

  const { data: branches = [], isLoading } = useQuery({
    queryKey: ['public-branches', search],
    queryFn: () =>
      fetchPublicBranches({ perPage: 30, search: search || undefined }),
  });

  const getBranchSport = (branch: Branch) => {
    const text = `${branch.name} ${branch.address}`.toLowerCase();
    if (text.includes('badminton') || text.includes('cầu lông'))
      return 'Badminton';
    if (text.includes('pickle')) return 'Pickleball';
    if (text.includes('tennis')) return 'Tennis';
    if (text.includes('football') || text.includes('bóng đá'))
      return 'Football';
    if (text.includes('basketball') || text.includes('bóng rổ'))
      return 'Basketball';
    return 'Badminton';
  };

  const visibleBranches = useMemo(() => {
    let rows = [...branches];

    if (selectedSport !== 'all') {
      rows = rows.filter(branch => getBranchSport(branch) === selectedSport);
    }

    if (openNowOnly) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      rows = rows.filter(branch => {
        if (!branch.openTime || !branch.closeTime) return true;
        const [openHour, openMinute] = branch.openTime.split(':').map(Number);
        const [closeHour, closeMinute] = branch.closeTime
          .split(':')
          .map(Number);
        const open = openHour * 60 + openMinute;
        const close = closeHour * 60 + closeMinute;
        return currentMinutes >= open && currentMinutes <= close;
      });
    }

    if (onlyNearby && userLocation) {
      rows = rows.filter(branch => {
        if (branch.latitude == null || branch.longitude == null) return false;
        return (
          getDistanceKm(userLocation, {
            latitude: branch.latitude,
            longitude: branch.longitude,
          }) <= 10
        );
      });
    }

    if (useMapArea && visibleBounds) {
      rows = rows.filter(branch => {
        if (branch.latitude == null || branch.longitude == null) return false;
        return visibleBounds.contains([branch.longitude, branch.latitude]);
      });
    }

    if (!userLocation) return rows;

    return rows.sort((a, b) => {
      const aHasCoords = a.latitude != null && a.longitude != null;
      const bHasCoords = b.latitude != null && b.longitude != null;
      if (!aHasCoords && !bHasCoords) return 0;
      if (!aHasCoords) return 1;
      if (!bHasCoords) return -1;

      const da = getDistanceKm(userLocation, {
        latitude: a.latitude as number,
        longitude: a.longitude as number,
      });
      const db = getDistanceKm(userLocation, {
        latitude: b.latitude as number,
        longitude: b.longitude as number,
      });
      return da - db;
    });
  }, [
    branches,
    onlyNearby,
    openNowOnly,
    selectedSport,
    useMapArea,
    userLocation,
    visibleBounds,
  ]);

  const mapCenter = userLocation ?? DEFAULT_CENTER;

  return (
    <div className='mx-auto min-h-screen max-w-[1400px] space-y-4 p-3 md:p-4'>
      <div className='grid h-[calc(100vh-2.5rem)] grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)]'>
        <aside className='bg-card border-border order-2 flex h-full flex-col overflow-hidden rounded-2xl border lg:order-1'>
          <div className='border-border space-y-3 border-b p-4'>
            <h1 className='text-xl font-bold'>Find badminton courts nearby</h1>
            <p className='text-muted-foreground text-sm'>
              Search by court name, area, or discover around your current
              location.
            </p>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                value={search}
                onChange={event => setSearch(event.target.value)}
                className='pl-9'
                placeholder='Search venue name or location'
              />
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                size='sm'
                variant={useMapArea ? 'solid' : 'outline'}
                onClick={() => setUseMapArea(value => !value)}
              >
                Search this map area
              </Button>
              <Button
                size='sm'
                variant={onlyNearby ? 'solid' : 'outline'}
                onClick={() => setOnlyNearby(value => !value)}
              >
                Near me (10km)
              </Button>
              <Button
                size='sm'
                variant={openNowOnly ? 'solid' : 'outline'}
                onClick={() => setOpenNowOnly(value => !value)}
              >
                Open now
              </Button>
              <Button
                size='sm'
                variant='outline'
                icon={<Navigation className='h-4 w-4' />}
                iconPlacement='left'
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(position => {
                    setUserLocation({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    });
                  });
                }}
              >
                Use my location
              </Button>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                size='sm'
                variant={selectedSport === 'all' ? 'solid' : 'outline'}
                onClick={() => setSelectedSport('all')}
              >
                All sports
              </Button>
              {SPORTS.map(sport => (
                <Button
                  key={sport.name}
                  size='sm'
                  variant={selectedSport === sport.name ? 'solid' : 'outline'}
                  onClick={() => setSelectedSport(sport.name)}
                >
                  <span className='mr-1'>{sport.emoji}</span>
                  {sport.name}
                </Button>
              ))}
            </div>
          </div>

          <div className='flex items-center justify-between px-4 py-3 text-sm'>
            <p className='text-muted-foreground'>
              {isLoading
                ? 'Loading courts...'
                : `${visibleBranches.length} courts found`}
            </p>
            <span className='text-muted-foreground inline-flex items-center gap-1'>
              <ListFilter className='h-4 w-4' />
              Smart filters
            </span>
          </div>

          <div className='flex-1 space-y-2 overflow-y-auto px-3 pb-3'>
            {visibleBranches.length === 0 && !isLoading ? (
              <Card>
                <CardContent className='p-4 text-sm'>
                  No courts match current filters.
                </CardContent>
              </Card>
            ) : null}
            {visibleBranches.map(branch => {
              const distance =
                userLocation &&
                branch.latitude != null &&
                branch.longitude != null
                  ? getDistanceKm(userLocation, {
                      latitude: branch.latitude,
                      longitude: branch.longitude,
                    })
                  : null;

              const active = activeBranchId === branch.id;
              return (
                <div
                  key={branch.id}
                  role='button'
                  tabIndex={0}
                  onClick={() => setActiveBranchId(branch.id)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setActiveBranchId(branch.id);
                    }
                  }}
                  className={`w-full cursor-pointer text-left ${active ? 'ring-primary rounded-xl ring-2' : ''}`}
                >
                  <Card className='hover:border-primary/40 transition-colors'>
                    <CardHeader className='space-y-1 pb-2'>
                      <CardTitle className='line-clamp-1 text-base'>
                        {branch.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 text-sm'>
                      <div className='text-muted-foreground flex items-start gap-2'>
                        <MapPin className='mt-0.5 h-4 w-4 shrink-0' />
                        <span className='line-clamp-2'>{branch.address}</span>
                      </div>
                      <div className='text-muted-foreground flex items-center gap-2'>
                        <Clock3 className='h-4 w-4 shrink-0' />
                        <span>
                          {formatTime(branch.openTime)} -{' '}
                          {formatTime(branch.closeTime)}
                        </span>
                      </div>
                      {distance != null ? (
                        <p className='text-muted-foreground'>
                          {distance.toFixed(1)} km away
                        </p>
                      ) : null}
                      <div className='pt-1'>
                        <Button
                          size='sm'
                          className='w-full'
                          onClick={event => {
                            event.stopPropagation();
                            router.push(`/book/${branch.id}`);
                          }}
                        >
                          Book this court
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </aside>

        <section className='order-1 h-full lg:order-2'>
          <div className='bg-card border-border relative h-full overflow-hidden rounded-2xl border'>
            <div className='absolute top-3 left-3 z-10 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium shadow'>
              🏸 Badminton map view
            </div>
            <div className='absolute top-3 right-3 z-10 rounded-full bg-white/95 px-3 py-1.5 text-xs shadow'>
              {userLocation ? 'Using your location' : 'Default city center'}
            </div>
            <div className='h-full w-full'>
              <DiscoverMap
                branches={visibleBranches}
                center={mapCenter}
                activeBranchId={activeBranchId}
                onSelectBranch={setActiveBranchId}
                onBoundsChanged={setVisibleBounds}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
