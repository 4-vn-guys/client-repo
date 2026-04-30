'use client';

import { useEffect, useRef, useState } from 'react';
import { Geocoder } from '@mapbox/search-js-react';
import mapboxgl from 'mapbox-gl';
import { Field, FieldLabel } from './field';
import { Input } from './input';
import { useLocale, useTranslations } from 'next-intl';

type Coordinates = {
  latitude: number;
  longitude: number;
};

export type LocationPickerProps = {
  accessToken?: string;
  latitude: number;
  longitude: number;
  onChange: (coordinates: Coordinates) => void;
};

const roundCoordinate = (value: number) => Number(value.toFixed(6));

export function LocationPickerInner({
  accessToken,
  latitude,
  longitude,
  onChange,
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map>();
  const [searchValue, setSearchValue] = useState('');
  const locale = useLocale();
  const tLocation = useTranslations('Components.LocationPicker');

  const updateCoordinates = (lngLat: mapboxgl.LngLatLike, shouldFly = false) => {
    const coordinates = mapboxgl.LngLat.convert(lngLat);

    markerRef.current?.setLngLat(coordinates);

    if (shouldFly) {
      mapRef.current?.flyTo({
        center: coordinates,
        zoom: 15,
        essential: true,
      });
    }

    onChange({
      latitude: roundCoordinate(coordinates.lat),
      longitude: roundCoordinate(coordinates.lng),
    });
  };

  useEffect(() => {
    if (!accessToken || !mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = accessToken;

    const initialCenter: [number, number] = [longitude, latitude];
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: 14,
    });

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat(initialCenter)
      .addTo(map);

    marker.on('dragend', () => {
      updateCoordinates(marker.getLngLat());
    });

    map.on('click', event => {
      updateCoordinates(event.lngLat, true);
    });

    mapRef.current = map;
    markerRef.current = marker;
    setMapInstance(map);

    return () => {
      marker.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      setMapInstance(undefined);
    };
    // Mapbox owns the map lifecycle after initial mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    if (!markerRef.current) return;

    markerRef.current.setLngLat([longitude, latitude]);
  }, [latitude, longitude]);

  if (!accessToken) {
    return (
      <div className='border-border bg-muted/20 rounded-lg border p-4'>
        <p className='text-muted-foreground mb-4 text-sm'>
          {tLocation('missingToken')}
        </p>
        <div className='grid gap-4 md:grid-cols-2'>
          <Field>
            <FieldLabel htmlFor='branch-latitude'>
              {tLocation('latitude')}
            </FieldLabel>
            <Input
              id='branch-latitude'
              type='number'
              step='any'
              value={latitude}
              onChange={event =>
                onChange({
                  latitude: Number(event.target.value),
                  longitude,
                })
              }
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='branch-longitude'>
              {tLocation('longitude')}
            </FieldLabel>
            <Input
              id='branch-longitude'
              type='number'
              step='any'
              value={longitude}
              onChange={event =>
                onChange({
                  latitude,
                  longitude: Number(event.target.value),
                })
              }
              required
            />
          </Field>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      <div className='space-y-2'>
        <FieldLabel>{tLocation('branchLocation')}</FieldLabel>
        <Geocoder
          accessToken={accessToken}
          map={mapInstance}
          mapboxgl={mapboxgl}
          marker={false}
          value={searchValue}
          onChange={setSearchValue}
          onRetrieve={feature => {
            const coordinates = feature.geometry?.coordinates;

            if (!coordinates || coordinates.length < 2) return;

            updateCoordinates([coordinates[0], coordinates[1]], true);
          }}
          options={{
            language: locale,
            country: 'VN',
            proximity: {
              lng: longitude,
              lat: latitude,
            },
          }}
          placeholder={tLocation('searchPlaceholder')}
        />
      </div>

      <div
        ref={mapContainerRef}
        className='border-border h-72 overflow-hidden rounded-lg border'
      />

      <p className='text-muted-foreground text-xs'>
        {tLocation('instructions', {
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        })}
      </p>
    </div>
  );
}
