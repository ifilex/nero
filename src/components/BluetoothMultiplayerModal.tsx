import React, { useState } from 'react';
import { Bluetooth, RefreshCw, Smartphone, Users, Wifi, Check, AlertCircle } from 'lucide-react';
import { retroSound } from '../audio/retroSounds';

interface BluetoothMultiplayerModalProps {
  onClose: () => void;
  onStartBluetoothGame: (opponentName: string, deviceId: string) => void;
  onStartPassAndPlay: () => void;
}

export const BluetoothMultiplayerModal: React.FC<BluetoothMultiplayerModalProps> = ({
  onClose,
  onStartBluetoothGame,
  onStartPassAndPlay,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState('BT-9904');
  const [nearbyDevices, setNearbyDevices] = useState([
    { id: 'bt_dev_01', name: 'MS-DOS 486 DX2 [En rango]', rssi: -45, player: 'Amigo Cercano' },
    { id: 'bt_dev_02', name: 'Pentium 133 MHz [En rango]', rssi: -62, player: 'Estratega Local' },
    { id: 'bt_dev_03', name: 'ThinkPad 750C [En rango]', rssi: -78, player: 'Challenger VGA' },
  ]);

  const handleScanWebBluetooth = async () => {
    retroSound.playBeep(900);
    setScanning(true);
    setScanError(null);

    // Check if Web Bluetooth is available
    if (typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
      try {
        const navAny = navigator as any;
        const device = await navAny.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['generic_access'],
        });
        if (device) {
          retroSound.playAchievement();
          onStartBluetoothGame(device.name || 'Dispositivo Bluetooth', device.id);
          onClose();
          return;
        }
      } catch (err: any) {
        // Fallback to simulated local Bluetooth beacon scanning
        console.log('Bluetooth prompt canceled or unsupported:', err);
      }
    }

    // Simulated local scanning
    setTimeout(() => {
      setScanning(false);
      setNearbyDevices((prev) => [
        { id: `bt_dev_${Date.now()}`, name: 'Nero-Node-' + Math.floor(100 + Math.random() * 899), rssi: -50, player: 'Jugador Próximo' },
        ...prev,
      ]);
    }, 1500);
  };

  const handleConnectDevice = (dev: { id: string; name: string; player: string }) => {
    retroSound.playAchievement();
    onStartBluetoothGame(`${dev.player} (${dev.name})`, dev.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-[#0000AA] text-white p-4 dos-box max-w-md w-full font-mono text-xs">
        {/* Title */}
        <div className="bg-[#AAAAAA] text-black px-2 py-1 font-pixel text-xs flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <Bluetooth className="w-4 h-4 text-blue-900" />
            <span>MULTIJUGADOR BLUETOOTH LOCAL</span>
          </div>
          <button
            onClick={onClose}
            className="bg-red-700 text-white px-1.5 font-bold hover:bg-red-600"
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-200 mb-3 font-dos text-base leading-snug">
          Empareja dos dispositivos mediante radiofrecuencia Bluetooth local o código de enlace rápido para competir en partidas cara a cara sin latencia.
        </p>

        {/* Quick Option 1: Pass & Play on same screen */}
        <div className="bg-[#000055] p-3 dos-inset mb-3 flex items-center justify-between">
          <div>
            <div className="font-pixel text-[10px] text-yellow-300 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>PASAR Y JUGAR (1 PANTALLA)</span>
            </div>
            <div className="text-[11px] text-gray-300 mt-0.5">
              Juega cara a cara en este mismo dispositivo por turnos.
            </div>
          </div>
          <button
            onClick={() => {
              retroSound.playBeep(1000);
              onStartPassAndPlay();
              onClose();
            }}
            className="px-2.5 py-1.5 bg-[#005500] hover:bg-[#007700] text-lime-300 font-pixel text-[9px] border border-white whitespace-nowrap"
          >
            JUGAR YA
          </button>
        </div>

        {/* Option 2: Bluetooth Device Scanner */}
        <div className="bg-[#000055] p-3 dos-inset space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[10px] text-cyan-300 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5" />
              <span>DISPOSITIVOS CERCANOS DETECTADOS:</span>
            </span>
            <button
              onClick={handleScanWebBluetooth}
              disabled={scanning}
              className="px-2 py-0.5 bg-[#0000AA] hover:bg-[#2222DD] text-yellow-300 border border-[#AAAAAA] font-pixel text-[9px] flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? 'BUSCANDO...' : 'ESCANEAR'}</span>
            </button>
          </div>

          {/* Device list */}
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {nearbyDevices.map((dev) => (
              <div
                key={dev.id}
                className="bg-[#000033] hover:bg-[#000066] p-2 border border-[#000088] flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
                    <Bluetooth className="w-3 h-3 text-cyan-400" />
                    <span>{dev.name}</span>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Oponente: <span className="text-yellow-300">{dev.player}</span> • Señal: {dev.rssi} dBm
                  </div>
                </div>
                <button
                  onClick={() => handleConnectDevice(dev)}
                  className="px-2 py-1 bg-[#005500] hover:bg-[#007700] text-white border border-white font-pixel text-[9px]"
                >
                  CONECTAR
                </button>
              </div>
            ))}
          </div>

          {/* Direct pairing code */}
          <div className="mt-2 pt-2 border-t border-[#000088] flex items-center justify-between">
            <span className="text-gray-300 text-[10px]">CÓDIGO DE ENLACE PIN:</span>
            <span className="font-pixel text-yellow-300 bg-black px-2 py-0.5 border border-gray-600">
              {pairingCode}
            </span>
          </div>
        </div>

        {/* Bottom Close */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#555555] hover:bg-[#777777] text-white border border-[#AAAAAA] font-pixel text-[10px]"
          >
            VOLVER
          </button>
        </div>
      </div>
    </div>
  );
};
