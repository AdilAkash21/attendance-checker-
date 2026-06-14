import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { X, Camera } from 'lucide-react'

export default function QRScanner({ onScan, onClose }) {
  const onScanRef = useRef(onScan)
  onScanRef.current = onScan

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        scanner.stop().catch(() => {})
        onScanRef.current(decodedText)
      },
      () => {}
    ).catch(() => {})
    return () => { scanner.stop().catch(() => {}) }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fadeIn">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm text-white font-medium flex items-center gap-2">
          <Camera size={16} /> Scan QR Code
        </span>
        <button onClick={onClose} aria-label="Close scanner" className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div id="qr-reader" className="w-full max-w-xs rounded-xl overflow-hidden" />
      </div>
      <p className="text-xs text-white/60 text-center pb-6 px-4">
        Point your camera at a QR code to mark attendance
      </p>
    </div>
  )
}
