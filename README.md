# YZO205 Assignment-1: Operational AI - Bütçe Takip Web Uygulaması

**Öğrenci:** Yusuf Efe Karagöz 250563004
**Program:** Ankara Havacılık MYO - Yapay Zeka Operatörlüğü
**Proje Adı:** Doğru Bütçe Takip Web Sitesi

## 🚀 Proje Bağlantıları
* **Canlı Demo (Vercel):** [https://yusuf-yzo-websitesi.vercel.app/]
* **GitHub Repository:** [https://github.com/yekaragoz/dogru-butce]

## 🎯 Proje Özeti
Bu proje, YZO205 dersi Assignment-1 gereksinimleri doğrultusunda geliştirilmiş, statik (HTML/CSS/JS) bir kişisel bütçe takip uygulamasıdır. Backend veya veritabanı kullanılmamış, veriler tarayıcının LocalStorage belleğinde tutulmuştur. Projenin asıl odak noktası kod karmaşıklığı değil; AI destekli kodlama, versiyon kontrolü (Git/GitHub) ve sürekli dağıtım (Vercel CI/CD) operasyonlarının uçtan uca uygulanmasıdır.

## 🛠️ Kullanılan Araçlar ve Operasyonel Süreç

### 1. AI Ajanı Kullanımı (Development)
* **Araç:** Google Antigravity ve OpenAi / Gemini (gemininin web sitesinde bir etkisi yoktur.)
* Projenin iskeleti, HTML yapısı ve CSS tasarımı tamamen prompt mühendisliği ve AI etkileşimi ile oluşturulmuştur. Hatalı kod üretimleri, promptlar düzeltilerek geri alınmış ve istenen tasarım elde edilmiştir.

### 2. Versiyon Kontrolü (Git & GitHub CLI)
* Tüm proje lokalde `git init` ile başlatılmış ve her anlamlı değişiklik `git commit` ile kayıt altına alınmıştır.
* GitHub CLI (`gh`) aracı kullanılarak repository doğrudan terminal üzerinden oluşturulmuş ve kodlar `gh repo create --private --source . --remote origin --push` komutuyla buluta aktarılmıştır.

### 3. Sürekli Dağıtım (Vercel Deployment & Update Loop)
* Proje Vercel'e GitHub üzerinden bağlanarak "Production" ortamına alınmıştır.
* **Zorunlu Güncelleme Döngüsü:** CI/CD otomasyonunu doğrulamak adına projeye 3 ardışık güncelleme (Footer metni, yazdırma butonu ve durum göstergesi) yapılmıştır. Her `git push` komutunun ardından Vercel'in siteyi saniyeler içinde otomatik olarak canlıya aldığı test edilmiş ve onaylanmıştır.


---

## 📦 Kurulum ve Çalıştırma

1. **Depoyu klonlayın**
   ```bash
   git clone https://github.com/yekaragoz/dogru-butce.git
   cd dogru-butce
   ```
2. **Statik siteyi yerel olarak çalıştırın** (opsiyonel). Bu proje sadece HTML/CSS/JS dosyalarından oluştuğu için herhangi bir server gerektirmez; dosyaları doğrudan tarayıcıda açabilirsiniz. Ancak canlı yenileme ve CORS kontrolü için basit bir geliştirici sunucusu önerilir:
   ```bash
   npx serve .
   # veya python ile
   python -m http.server 8000
   ```
3. **Vercel’e dağıtma**
   - Vercel hesabınızı oluşturup, GitHub entegrasyonunu aktif edin.
   - Repository’yi Vercel’e bağlayın; otomatik olarak bir *Production* ortamı oluşturulacaktır.
   - Her `git push` sonrası Vercel’ın CI/CD pipeline’ı proje dosyalarını **saniyeler içinde** dağıtır.

## ✨ Özellikler

- **Kişisel Bütçe Takibi**: Gelir‑gider kalemlerini ekleyip, aylık toplamları otomatik olarak hesaplar.
- **Yerel Depolama**: Tüm veri `LocalStorage`‑da saklanır; sunucu‑tarafı veri tabanı yoktur.
- **Mobil Uyumluluk**: Responsive tasarım sayesinde mobil ve tablet cihazlarda rahat kullanım.
- **Dinamik Grafikler**: Dönemsel harcama trendlerini gösteren basit bir çubuk grafiği (Chart.js kullanılmaktadır).
- **Çoklu Dil Desteği**: HTML içinde `lang` attribute’u ve çeviri dosyalarıyla temel İngilizce/Türkçe alternatifi.

## 🛠️ Teknoloji yığını

| Katman | Teknoloji |
|--------|-----------|
| Front‑end | HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript |
| Grafik | Chart.js (CDN üzerinden) |
| CI/CD | Vercel (GitHub‑triggered) |
| Versiyon Kontrol | Git & GitHub CLI (`gh`) |
| Geliştirme Asistanı | Google Antigravity (AI‑aided coding) |

## 🤝 Katkıda Bulunma

1. Fork oluşturun ve `main` dalından yeni bir branch açın (`feature/isim`).
2. Değişikliklerinizi yapıp, anlamlı bir commit mesajı ekleyin.
3. Pull‑request açın; CI otomatik olarak Vercel preview URL’i oluşturur.
4. Kod incelemesi sonrası merge edilir.

> **Not:** Proje yalnızca statik dosyalardan oluştuğu için çalıştırma ortamı sadece bir web sunucusudur. Backend‑tarafı eklemek istiyorsanız `api/` klasörüne bir Node/Express server ekleyebilirsiniz.

## 📜 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakınız.

## 📞 İletişim

- **Yusuf Efe Karagöz** – <mailto:yusuf.karagoz@example.com>
- GitHub Issues: <https://github.com/yekaragoz/dogru-butce/issues>

---
