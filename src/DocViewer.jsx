import React, { useState, useEffect, useCallback, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';
import { FileText, Eye, Download, X, Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useEsc } from './hooks/useEsc';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const DocViewer = ({ title, description, data }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zoomScale, setZoomScale] = useState(1.5); // Default zoom untuk render
  const bookRef = useRef();

   const closeModal = () => {
    setSelectedDoc(null);
    setPages([]);
    setZoomScale(1.5);
  };

  useEsc(closeModal);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fungsi Download Langsung
  const downloadFile = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || 'dokumen.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback jika fetch gagal (misal masalah CORS)
      window.open(url, '_blank');
    }
  };

  const loadPdfPages = useCallback(async (pdfUrl, scale) => {
    setLoading(true);
    setPages([]);
    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      const images = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        images.push(canvas.toDataURL('image/jpeg', 0.8));
        
        canvas.width = 0;
        canvas.height = 0;
      }
      setPages(images);
    } catch (error) {
      console.error("Gagal memproses PDF:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDoc) loadPdfPages(selectedDoc.fileUrl, zoomScale);
  }, [selectedDoc, loadPdfPages, zoomScale]);

  const handleZoom = (type) => {
    if (type === 'in' && zoomScale < 3) setZoomScale(prev => prev + 0.5);
    if (type === 'out' && zoomScale > 1) setZoomScale(prev => prev - 0.5);
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase italic tracking-tighter">
            {title} <span className="text-gold-dignity">Lapas Blitar</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-2xl">{description}</p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((doc, idx) => (
            <div key={idx} className="group flex flex-col cursor-pointer" onClick={() => setSelectedDoc(doc)}>
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-900 border border-white/10 mb-5 shadow-2xl group-hover:border-gold-dignity/50 transition-all">
                <img src={doc.cover} alt={doc.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-4 bg-gold-dignity text-slate-900 rounded-2xl scale-75 group-hover:scale-100 transition-all">
                    <Eye size={24} strokeWidth={3} />
                  </div>
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-4 line-clamp-2">{doc.name}</h3>
              <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-gold-dignity hover:text-black text-white rounded-xl text-xs font-bold transition-all">
                Baca Digital Flipbook
              </button>
            </div>
          ))}
        </div>

        {/* Modal Flipbook */}
        {selectedDoc && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-10">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedDoc(null)}></div>
            
            <div className="relative w-full max-w-6xl h-full bg-slate-900 md:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-white/10 animate-in zoom-in-95">
              
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-3 overflow-hidden">
                   <FileText className="text-gold-dignity" />
                   <h2 className="text-white font-bold truncate pr-4">{selectedDoc.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  {/* Zoom Controls */}
                  <div className="flex bg-white/5 rounded-xl mr-2">
                    <button onClick={() => handleZoom('out')} className="p-3 text-white hover:text-gold-dignity transition-colors border-r border-white/10" title="Zoom Out"><ZoomOut size={20} /></button>
                    <button onClick={() => handleZoom('in')} className="p-3 text-white hover:text-gold-dignity transition-colors" title="Zoom In"><ZoomIn size={20} /></button>
                  </div>
                  
                  {/* Download Button */}
                  <button 
                    onClick={() => downloadFile(selectedDoc.fileUrl, selectedDoc.name + ".pdf")} 
                    className="p-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
                    title="Download PDF"
                  >
                    <Download size={20} />
                  </button>
                  
                  {/* Close Button */}
                  <button onClick={() => { setSelectedDoc(null); setPages([]); }} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center relative bg-[#0f172a] overflow-hidden p-4">
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-gold-dignity" size={48} />
                    <p className="text-gold-dignity font-bold tracking-widest text-xs uppercase">Rendering High Quality Pages...</p>
                  </div>
                ) : (
                  <div className="relative flex items-center justify-center w-full h-full">
                    <button onClick={() => bookRef.current.pageFlip().flipPrev()} className="absolute left-0 z-20 p-2 text-white/20 hover:text-gold-dignity transition-colors hidden md:block">
                      <ChevronLeft size={60} />
                    </button>

                    <div className="overflow-auto max-w-full max-h-full p-4 flex justify-center items-start scrollbar-hide">
                      {/* key={zoomScale} adalah kunci agar komponen refresh saat zoom berubah */}
                      <HTMLFlipBook 
                        key={zoomScale} 
                        width={Math.round(400 * zoomScale)} 
                        height={Math.round(580 * zoomScale)} 
                        size="fixed" // Gunakan 'fixed' agar ukuran patuh pada perkalian zoomScale
                        minWidth={315}
                        maxWidth={2000}
                        minHeight={400}
                        maxHeight={3000}
                        showCover={true}
                        mobileScrollSupport={true}
                        ref={bookRef}
                        className="book-shadow shadow-black/50 mx-auto"
                      >
                        {pages.map((image, index) => (
                          <div key={index} className="bg-white shadow-inner overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Halaman ${index + 1}`} 
                              className="w-full h-full object-contain pointer-events-none" 
                            />
                          </div>
                        ))}
                      </HTMLFlipBook>
                    </div>

                    <button onClick={() => bookRef.current.pageFlip().flipNext()} className="absolute right-0 z-20 p-2 text-white/20 hover:text-gold-dignity transition-colors hidden md:block">
                      <ChevronRight size={60} />
                    </button>
                  </div>
                )}
                
                {!loading && pages.length > 0 && (
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.3em]">
                        Zoom Level: {zoomScale}x
                    </div>
                    <div className="text-slate-600 text-[9px] uppercase tracking-[0.2em] animate-pulse">
                        Klik atau geser sudut halaman untuk membalik
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocViewer;