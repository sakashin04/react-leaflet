import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Gsimap() {
  return (
    <MapContainer center={[35.681236, 139.767125]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://maps.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
        attribution="&copy; 地理院タイル"
      />
    </MapContainer>
  );
} 