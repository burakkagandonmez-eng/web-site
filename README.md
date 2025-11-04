# Eczane Asistan - Vapi Widget Demo

Dark tema ve animasyonlu parçacık efektleri ile tasarlanmış, **Vapi Widget** kullanan gerçek çalışan Eczane Asistan demo sayfası.

## 🎨 Tasarım Özellikleri

### Dark Theme & Animasyonlar
- **Siyah-koyu gri** ana tema
- **Mavi (#3B82F6)** ve **mor (#8B5CF6)** accent renkler
- Canvas tabanlı **animasyonlu parçacık sistemi**
- **Mouse takibi** ve **bağlantı çizgileri** efekti
- Inter font ailesi ile modern tipografi
- Responsive design (mobil/tablet/desktop)

### UI/UX Bileşenleri
- **Köşe widget**: Sağ alt köşede Vapi widget
- **Gizli süre gösterimi**: Konuşma başladığında görünen kırmızı sayaç
- **Scroll animasyonları**: Elementler sayfa kaydırıldıkça belirecek
- **Merkezi bilgilendirme**: Özellikler ve kullanım talimatları

## 🤖 Vapi Widget Entegrasyonu

### Widget Konfigürasyonu
```html
<vapi-widget
    public-key="ef32a2d0-df9d-4c2c-a540-06fe732a0ea8"
    assistant-id="791ae05f-4869-4e5a-bded-809f2b861e47"
    mode="chat"
    theme="dark"
    base-bg-color="#000000"
    accent-color="#3B82F6"
    title="TALK WITH AI"
    start-button-text="TIKLA KONUŞ"
    end-button-text="BITIR"
    voice-show-transcript="false"
    consent-required="true"
/>
```

### Özellikler
- ✅ **Gerçek çalışan sistem**: Vapi widget kullanıyor
- ✅ **Chat + Voice**: Hem yazılı hem sesli etkileşim
- ✅ **Dark tema uyumu**: Siyah-mavi renk paleti
- ✅ **Türkçe arayüz**: Türkçe metinler
- ✅ **Consent management**: Kullanıcı onayı sistemi
- ✅ **Transkript kapalı**: `voice-show-transcript="false"`

### Call Duration Sistemi
- **Gizli gösterim**: Konuşma başladığında sağ üstte çıkan kırmızı süre sayacı
- **Gerçek zamanlı**: Her saniye güncellenen MM:SS formatı
- **Otomatik gizleme**: Konuşma bitince otomatik kayboluyor
- **Animasyonlu**: Smooth geçiş efektleri

## 📱 Responsive Layout

### Ana Bölümler
1. **Header** - Sabit logo ve branding
2. **Hero Section** - Başlık ve açıklama
3. **Features Grid** - 3 özellik kartı
4. **Instructions** - Kullanım talimatları
5. **Vapi Widget** - Sağ alt köşede sabit
6. **Duration Widget** - Konuşma sırasında görünür

### Breakpoint'ler
- **Desktop (1200px+)**: 3 sütunlu feature grid
- **Tablet (768px-1199px)**: 2 sütunlu feature grid  
- **Mobile (320px-767px)**: Tek sütun, optimize edilmiş spacing

## 🎯 Kullanım Akışı

### 1. Sayfa Yükleme
```
Sayfa açılır → Particle animasyon başlar → Vapi widget yüklenir
```

### 2. Konuşma Başlatma
```
Kullanıcı "TALK WITH AI" butonuna tıklayınca → 
Mikrofon izni → Widget açılır → Konuşma başlar → 
Duration widget görünür
```

### 3. Konuşma Sırasında
```
Duration timer çalışır → Vapi asistan cevap verir → 
Kullanıcı konuşmaya devam edebilir
```

### 4. Konuşma Bitişi
```
"End Call" tıklandığında → Duration widget kaybolur → 
Timer durur
```

## 🛠️ Teknik Mimari

### JavaScript Sınıfları
```javascript
// Particle animasyon sistemi
class ParticleSystem { ... }

// Vapi widget entegrasyonu
class EczaneAsistanWidget { ... }

// Scroll animasyon yönetimi  
class ScrollAnimations { ... }

// Smooth scrolling
class SmoothScrolling { ... }
```

### Event Handling
```javascript
// Widget event'leri
widget.addEventListener('call-start', handleCallStart);
widget.addEventListener('call-end', handleCallEnd);

// Fallback state monitoring
setInterval(checkWidgetState, 1000);
```

### Duration Management
```javascript
startDurationTimer() → setInterval(updateDuration, 1000)
stopDurationTimer() → clearInterval()
```

## 🎨 Stil Sistemi

### Renk Paleti
```css
--primary: #3B82F6 (Mavi)
--secondary: #8B5CF6 (Mor)
--accent: #EF4444 (Kırmızı - Duration için)
--bg-primary: #000000 (Ana arkaplan)
--bg-secondary: #1a1a1a (İkincil arkaplan)
```

### Animation Tokens
```css
--transition-fast: 0.3s ease
--transition-medium: 0.6s ease
--border-radius: 16px
--shadow-strong: 0 20px 60px rgba(0,0,0,0.5)
```

## 🔧 Widget Özelleştirme

### CSS Custom Properties
```css
vapi-widget::part(container) {
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid rgba(59, 130, 246, 0.3);
}

vapi-widget::part(button) {
    background: linear-gradient(135deg, #3B82F6, #8B5CF6);
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
}
```

### Widget Konfigürasyon Parametreleri
- `public-key`: API anahtarı
- `assistant-id`: Asistan ID'si
- `theme`: `dark` (sabit)
- `accent-color`: `#3B82F6` (tema rengi)
- `start-button-text`: `"TIKLA KONUŞ"`
- `end-button-text`: `"BITIR"`
- `voice-show-transcript`: `"false"` (transkript kapalı)

## 📦 Dosya Yapısı

```
├── index.html          # Ana HTML + Vapi widget
├── styles.css          # Dark theme + Responsive
├── script.js           # Widget entegrasyonu + Animasyonlar
└── README.md           # Bu dokümantasyon
```

## 🚀 Deployment

### Hosting Gereksinimleri
1. **HTTPS zorunlu**: Vapi widget için güvenli bağlantı
2. **Mikrofon izinleri**: Browser mikrofon erişimi
3. **Vapi API limitleri**: Rate limiting kontrolü

### Hosting Adımları
```bash
# Dosyaları web sunucusuna yükle
cp *.html *.css *.js /var/www/demo/

# SSL sertifikası ayarla
certbot --nginx -d demo.eczaneasistan.com

# HTTPS ile test et
curl -I https://demo.eczaneasistan.com
```

## 🔍 Test Senaryoları

### Temel Fonksiyonlar
- [x] Sayfa yükleme ve particle animasyonu
- [x] Vapi widget görünümü
- [x] "TALK WITH AI" butonuna tıklama
- [x] Mikrofon izni istemi
- [x] Konuşma başlatma

### Duration Sistemi
- [x] Konuşma başlangıcında gösterim
- [x] Gerçek zamanlı sayaç (00:00 → 01:23)
- [x] Konuşma bitiminde gizleme
- [x] Animasyonlu geçişler

### Responsive Test
- [x] Desktop (1920x1080)
- [x] Tablet (768x1024) 
- [x] Mobile (375x667)
- [x] Mobile landscape

## 🐛 Troubleshooting

### Widget Yüklenmiyor
```javascript
// Developer tools'ta kontrol et
console.log(document.querySelector('vapi-widget'));
```

### Mikrofon İzni Reddedildi
```javascript
// Kullanıcıya uygun mesaj göster
navigator.permissions.query({name: 'microphone'});
```

### Duration Gösterilmiyor
```javascript
// Debug modu aktifleştir
localStorage.setItem('vapi-debug', 'true');
```

## 📈 Gelecek Geliştirmeler

### Planlanan Özellikler
- [ ] **Eczane veritabanı entegrasyonu**
- [ ] **Reçete yazma asistanı**
- [ ] **İlaç etkileşim kontrolü**
- [ ] **Çoklu dil desteği (İngilizce)**
- [ ] **Call analytics dashboard**
- [ ] **Voice command shortcuts**

### Teknik İyileştirmeler
- [ ] **Progressive Web App (PWA)**
- [ ] **Service Worker** cache yönetimi
- [ ] **Bundle optimization**
- [ ] **Performance monitoring**
- [ ] **A/B testing framework**

## 🔒 Güvenlik & Gizlilik

### Veri Koruma
- **GDPR uyumlu** consent sistemi
- **End-to-end encryption** Vapi tarafından
- **Local storage** sadece consent key'i
- **No data logging** kulanıcı konuşmaları

### API Güvenliği
- **Rate limiting** Vapi tarafından yönetiliyor
- **HTTPS only** zorunlu
- **CORS policy** uyumlu
- **XSS protection** mevcut

## 📞 Destek & İletişim

### Teknik Destek
- **Demo URL**: `https://demo.eczaneasistan.com`
- **Vapi Docs**: [docs.vapi.ai](https://docs.vapi.ai)
- **Email**: `support@eczaneasistan.com`

### Development
- **Widget SDK**: `@vapi-ai/client-sdk-react`
- **Version**: `widget.umd.js`
- **Browser Support**: Chrome 90+, Safari 14+, Edge 90+

---

**Eczane Asistan Widget Demo** - AI destekli gerçek sesli eczane asistanı