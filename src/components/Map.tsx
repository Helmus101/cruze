import React, { useEffect, useRef, useState } from 'react';
import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';
import Overlay from 'ol/Overlay';
import { ParkingSpot } from '../types';
import { getAddressFromCoordinates } from '../utils/mockGeocoder';

import 'ol/ol.css';

interface MapProps {
  parkingSpots: ParkingSpot[];
  userLocation: [number, number] | null;
}

const parkingIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40">
  <path fill="#4CAF50" d="M50,0 C77.6,0 100,22.4 100,50 C100,77.6 77.6,100 50,100 C22.4,100 0,77.6 0,50 C0,22.4 22.4,0 50,0 Z"/>
  <path fill="#FFFFFF" d="M24.8,20.8 C33.6,12 44.8,7.2 56.8,7.2 C68.8,7.2 80,12 88.8,20.8 C97.6,29.6 102.4,40.8 102.4,52.8 C102.4,64.8 97.6,76 88.8,84.8 C80,93.6 68.8,98.4 56.8,98.4 C44.8,98.4 33.6,93.6 24.8,84.8 C16,76 11.2,64.8 11.2,52.8 C11.2,40.8 16,29.6 24.8,20.8 Z"/>
</svg>
`;

const Map: React.FC<MapProps> = ({ parkingSpots, userLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<OLMap | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      const initialCenter = userLocation ? fromLonLat([userLocation[1], userLocation[0]]) : fromLonLat([2.3522, 48.8566]);

      mapInstanceRef.current = new OLMap({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          center: initialCenter,
          zoom: 13
        })
      });

      mapInstanceRef.current.on('click', (event) => {
        const feature = mapInstanceRef.current?.forEachFeatureAtPixel(event.pixel, (feature) => feature);
        if (feature) {
          const geometry = feature.getGeometry();
          if (geometry instanceof Point) {
            const coords = toLonLat(geometry.getCoordinates());
            const spot = parkingSpots.find(s => s.longitude === coords[0] && s.latitude === coords[1]);
            if (spot) {
              setSelectedSpot(spot);
            }
          }
        } else {
          setSelectedSpot(null);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation, parkingSpots]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource
      });

      parkingSpots.forEach(spot => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([spot.longitude, spot.latitude]))
        });

        feature.setStyle(new Style({
          image: new Icon({
            src: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(parkingIcon),
            scale: 0.5
          })
        }));

        vectorSource.addFeature(feature);
      });

      if (userLocation) {
        const userFeature = new Feature({
          geometry: new Point(fromLonLat([userLocation[1], userLocation[0]]))
        });

        userFeature.setStyle(new Style({
          image: new Icon({
            src: 'https://cdn.jsdelivr.net/npm/lucide-static@0.344.0/icons/user.svg',
            scale: 1.5,
            color: 'blue'
          })
        }));

        vectorSource.addFeature(userFeature);
      }

      mapInstanceRef.current.addLayer(vectorLayer);

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(vectorLayer);
        }
      };
    }
  }, [parkingSpots, userLocation]);

  useEffect(() => {
    if (mapInstanceRef.current && popupRef.current) {
      const overlay = new Overlay({
        element: popupRef.current,
        positioning: 'bottom-center',
        stopEvent: false,
      });

      mapInstanceRef.current.addOverlay(overlay);

      if (selectedSpot) {
        overlay.setPosition(fromLonLat([selectedSpot.longitude, selectedSpot.latitude]));
      } else {
        overlay.setPosition(undefined);
      }
    }
  }, [selectedSpot]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <div ref={popupRef} className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-md">
        {selectedSpot && (
          <div>
            <p>{getAddressFromCoordinates(selectedSpot.latitude, selectedSpot.longitude)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;