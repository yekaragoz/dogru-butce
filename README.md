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