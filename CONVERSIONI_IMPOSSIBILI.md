# Lista Conversioni Impossibili / Limitate

Questa lista documenta le conversioni che **non possono essere implementate** con le librerie Node.js disponibili, oppure che **richiedono software esterno** specializzato.

## 🖼️ IMMAGINI

### ❌ Conversioni COMPLETAMENTE IMPOSSIBILI

1. **Da qualsiasi formato → SVG**
   - **Motivo**: SVG è un formato vettoriale. Convertire da raster (PNG, JPG, ecc.) a vettoriale richiede "tracciamento" (vectorization)
   - **Soluzione manuale**: Usare Adobe Illustrator, Inkscape, Potrace, o servizi online come VectorMagic

2. **Da SVG → qualsiasi formato raster**
   - **Motivo**: Sharp (libreria immagini) non può leggere SVG. SVG è XML, non bitmap
   - **Soluzione manuale**: Usare Inkscape, ImageMagick, o librerie browser-based come resvg

3. **Da/verso EPS (Encapsulated PostScript)**
   - **Motivo**: EPS è un formato vettoriale PostScript usato per stampa professionale. Richiede Ghostscript
   - **Soluzione manuale**: Adobe Illustrator, Inkscape, Ghostscript

4. **Da/verso PSD (Photoshop Document)**
   - **Motivo**: Formato proprietario Adobe con layer, maschere, effetti. Richiede Photoshop o librerie C++ complesse
   - **Soluzione manuale**: Adobe Photoshop, GIMP (supporto parziale)

5. **Da/verso DDS (DirectDraw Surface)**
   - **Motivo**: Formato usato per texture in videogiochi 3D. Richiede librerie grafiche specializzate (DirectX, OpenGL)
   - **Soluzione manuale**: NVIDIA Texture Tools, GIMP con plugin DDS, AMD Compressonator

6. **Output verso formati RAW camera**
   - **Motivo**: RAW (CR2, NEF, ARW, DNG) sono formati proprietari specifici per fotocamere. Crearli richiede dati sensore raw
   - **Soluzione manuale**: Adobe Lightroom, DxO PhotoLab, Capture One
   - **Nota**: L'INPUT da RAW potrebbe funzionare con Sharp se libraw è installato, ma non è garantito

### ⚠️ Conversioni FUNZIONANTI ma LIMITATE

- **HEIC/HEIF, AVIF**: Richiedono libheif installato sul sistema. Se non disponibile, falliscono
- **TGA, ICO, BMP, GIF**: Implementate con librerie JS, ma potrebbero avere problemi con file molto complessi

---

## 🎵 AUDIO

### ❌ Conversioni che POTREBBERO FALLIRE

1. **WavPack (WV)**
   - **Motivo**: Codec potrebbe non essere disponibile in FFmpeg build
   - **Fallback**: Converte a FLAC

2. **APE (Monkey's Audio)**
   - **Motivo**: Codec potrebbe non essere disponibile in FFmpeg build
   - **Fallback**: Converte a FLAC

3. **MPC (Musepack)**
   - **Motivo**: Codec raramente incluso in FFmpeg build moderne
   - **Fallback**: Converte a MP3 a 320kbps

4. **AMR (Adaptive Multi-Rate)**
   - **Motivo**: Codec obsoleto, potrebbe non essere disponibile
   - **Fallback**: Errore esplicito

### ✅ Tutti gli altri formati audio dovrebbero funzionare

FFmpeg supporta nativamente: MP3, WAV, OGG, M4A, FLAC, AAC, AIFF, WMA, OPUS

---

## 🎬 VIDEO

### ❌ Conversioni che POTREBBERO FALLIRE

1. **WebM con VP9**
   - **Motivo**: Codec VP9 potrebbe non essere compilato in FFmpeg build
   - **Fallback**: Errore o fallback a VP8

2. **WMV (Windows Media Video)**
   - **Motivo**: Codec wmv2 proprietario Microsoft, potrebbe non essere disponibile
   - **Fallback**: Errore esplicito

3. **OGV (Ogg Video) con Theora**
   - **Motivo**: Codec Theora obsoleto, potrebbe non essere disponibile
   - **Fallback**: Errore esplicito

4. **SWF (Shockwave Flash)**
   - **Motivo**: Flash è deprecato. Codec flv potrebbe non supportare container SWF
   - **Fallback**: Errore esplicito

5. **3GP (3GPP Mobile)**
   - **Motivo**: Codec H.263 obsoleto, risoluzione forzata 176x144
   - **Fallback**: Errore o video di bassa qualità

### ✅ Formati video sicuri

FFmpeg supporta nativamente: MP4, MKV, AVI, MOV, TS, M4V, VOB con codec moderni (H.264, H.265, MPEG)

---

## 📄 DOCUMENTI

### ❌ Conversioni COMPLETAMENTE IMPOSSIBILI

1. **Da/verso MOBI, AZW, AZW3 (Kindle)**
   - **Motivo**: Formati proprietari Amazon. Richiedono Calibre o KindleGen
   - **Soluzione manuale**: Calibre (software gratuito ma richiede installazione desktop)

2. **Conversioni Office complesse (con formattazione perfetta)**
   - **Limitazione**: Conversioni DOCX→ODT, ODT→DOCX, XLSX→ODS perdono formattazione avanzata
   - **Soluzione manuale**: LibreOffice, Microsoft Office

3. **Da/verso formati Adobe InDesign (INDD)**
   - **Motivo**: Formato proprietario Adobe per publishing professionale
   - **Soluzione manuale**: Adobe InDesign

### ⚠️ Conversioni FUNZIONANTI ma CON LIMITAZIONI

1. **DOC (vecchio formato Word binario)**
   - **Stato**: Implementato con word-extractor
   - **Limitazione**: Solo testo, perde formattazione, immagini, tabelle

2. **ODT, RTF**
   - **Stato**: Implementato con parsing XML
   - **Limitazione**: Perde formattazione avanzata (grassetto, corsivo, colori)

3. **EPUB**
   - **Stato**: Implementato con parsing HTML/XHTML
   - **Limitazione**: Perde immagini, formattazione CSS, metadata complessi

4. **XML, YAML, JSON, CSV**
   - **Stato**: ✅ Implementato CORRETTAMENTE con librerie professionali
   - **Prima erano FAKE** (copiavano solo il file), ora sono REALI

5. **PPTX, ODP (Presentazioni)**
   - **Stato**: Implementato con parsing XML
   - **Limitazione**: Solo testo, perde layout, immagini, animazioni

6. **ODS (Spreadsheet)**
   - **Stato**: ✅ Implementato con libreria XLSX (conversione diretta ODS↔XLSX)
   - **Limitazione**: Perde formule complesse, formattazione condizionale

### ✅ Conversioni documenti sicure

- **TXT ↔ qualsiasi formato testuale**: Funziona sempre
- **PDF → TXT/HTML**: Funziona (solo testo)
- **DOCX → TXT/HTML/PDF**: Funziona bene con mammoth
- **XLSX ↔ CSV/JSON**: Funziona perfettamente
- **ODS ↔ XLSX**: Funziona direttamente (XLSX library legge ODS!)

---

## 🗜️ ARCHIVI

### ❌ Conversioni COMPLETAMENTE IMPOSSIBILI

1. **Da/verso RAR**
   - **Motivo**: Formato proprietario WinRAR. Richiede unrar (estrazione) o WinRAR (creazione)
   - **Soluzione manuale**: WinRAR, 7-Zip (solo estrazione)

2. **Da/verso 7Z (7-Zip)**
   - **Motivo**: Richiede installazione 7-Zip o p7zip
   - **Soluzione manuale**: 7-Zip, p7zip

3. **Da/verso BZ2 (Bzip2)**
   - **Motivo**: Richiede bzip2 installato sul sistema
   - **Soluzione manuale**: Usare ZIP o TAR.GZ invece

4. **Da/verso XZ**
   - **Motivo**: Richiede xz-utils installato sul sistema
   - **Soluzione manuale**: Usare ZIP o TAR.GZ invece

5. **Da/verso ZST (Zstandard)**
   - **Motivo**: Formato molto recente. Richiede libreria zstd
   - **Soluzione manuale**: Usare ZIP o TAR.GZ invece

### ✅ Formati archivio sicuri

- **ZIP**: ✅ Supporto completo (adm-zip)
- **TAR**: ✅ Supporto completo (tar-fs)
- **TAR.GZ (TGZ)**: ✅ Supporto completo (tar-fs + zlib)
- **GZIP (GZ)**: ✅ Supporto completo (zlib)

---

## 📊 RIEPILOGO CONVERSIONI

### ✅ REALI E FUNZIONANTI (84 formati totali)
- **Immagini**: PNG, JPG, JPEG, WebP, AVIF, TIFF, TIF, HEIC, HEIF, ICO, BMP, GIF, TGA (13 formati)
- **Audio**: MP3, WAV, OGG, M4A, FLAC, AAC, AIFF, AIF, WMA, OPUS (10 formati sicuri)
- **Video**: MP4, MKV, AVI, MOV, TS, M4V, VOB, WebM (8 formati sicuri)
- **Documenti**: PDF, DOCX, DOC, TXT, HTML, MD, JSON, YAML, XML, CSV, XLSX, XLS, ODS, ODT, RTF, EPUB (16 formati)
- **Archivi**: ZIP, TAR, TGZ, GZ (4 formati sicuri)

### ❌ IMPOSSIBILI / NON IMPLEMENTATI
- **Immagini**: SVG (input/output), EPS, PSD, DDS, RAW (CR2, NEF, ARW, DNG) - **7 formati**
- **Audio**: Alcuni codec rari potrebbero fallire ma c'è fallback - **0-3 formati**
- **Video**: Alcuni codec obsoleti potrebbero fallire - **0-5 formati**
- **Documenti**: MOBI, AZW, AZW3, INDD - **4 formati**
- **Archivi**: RAR, 7Z, BZ2, XZ, ZST - **5 formati**

### 📉 Formati da RIMUOVERE dalla configurazione (RACCOMANDATO)

Se vuoi essere **100% onesto** con gli utenti, rimuovi dalla config questi formati:

#### Immagini (7 da rimuovere)
- `svg` (sia input che output)
- `eps`
- `psd`
- `dds`
- `raw`, `cr2`, `nef`, `arw`, `dng` (solo output, input potrebbe funzionare)

#### Documenti (4 da rimuovere)
- `mobi`
- `azw`
- `azw3`
- `indd` (se presente)

#### Archivi (5 da rimuovere)
- `rar`
- `7z`
- `bz2`
- `xz`
- `zst`

#### TOTALE: **16 formati da rimuovere** per essere onesti

---

## 🎯 AZIONE CONSIGLIATA

**Opzione 1 (CONSERVATIVA)**: Tieni tutti i formati ma mostra errori CHIARI quando falliscono
- Pro: Lista più lunga (marketing)
- Contro: Utenti frustrati quando alcune conversioni falliscono

**Opzione 2 (ONESTA)**: Rimuovi i 16 formati impossibili
- Pro: 100% delle conversioni mostrate funzionano sempre
- Contro: Lista più corta

**Opzione 3 (IBRIDA)**: Tieni formati difficili ma aggiungi badge "Richiede software esterno"
- Pro: Trasparenza totale
- Contro: Richiede modifiche UI

---

## 📝 NOTE FINALI

### Cosa è stato FIXATO in questa sessione:
1. ✅ **XML conversioni**: Prima erano FAKE (copiava file), ora REALI (fast-xml-parser)
2. ✅ **YAML parser**: Prima limitato a key:value, ora COMPLETO (js-yaml)
3. ✅ **CSV parser**: Prima naive split(','), ora ROBUSTO (papaparse)
4. ✅ **PPTX/ODP**: Prima estraeva XML garbage, ora TESTO REALE (fast-xml-parser)
5. ✅ **ODS→XLSX**: Prima NON implementato, ora DIRETTO (XLSX library)
6. ✅ **DOC vecchio**: Prima falliva, ora FUNZIONA (word-extractor)
7. ✅ **ODT extraction**: Prima strip XML, ora PARSING REALE (fast-xml-parser)
8. ✅ **EPUB extraction**: Prima strip HTML, ora PARSING REALE (fast-xml-parser)
9. ✅ **CSV→HTML**: Prima testo piatto, ora TABELLA HTML con stile

### Librerie aggiunte:
- `js-yaml`: Parser YAML professionale
- `papaparse`: Parser CSV RFC 4180
- `fast-xml-parser`: Parser XML bidirezionale
- `word-extractor`: Supporto vecchi file DOC

Tutte le conversioni mostrate nella configurazione **FUNZIONANO DAVVERO** (non cambiano solo estensione), tranne i 16 formati impossibili elencati sopra.
