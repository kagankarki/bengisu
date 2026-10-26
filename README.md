# Merhaba Bengisu ☕️

Bengisu için sade, Apple tarzı, animasyonlu bir davet sayfası.
Akış: karşılama → soru (Evet / kaçan "Hayır" butonu) → tarih–saat–**harita ile mekan** seçimi → teşekkür.

Teknolojiler: **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Leaflet** (ücretsiz harita, yalnızca Türkiye), **Firebase (Firestore)**.

## Çalıştırma

```bash
npm install
npm run dev
```

Ardından tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

## Mekan seçimi (harita)

Mekan harita üzerinden seçilir; harita **yalnızca Türkiye** ile sınırlıdır.
Açılışta harita **Ankara**'ya ortalanır ve işaretçi otomatik Ankara'ya düşer.

- Arama kutusuna yaz (kafe, restoran, adres — sadece Türkiye) ve seç, **veya**
- Doğrudan haritaya dokun / işaretçiyi sürükle (Türkiye dışı seçilemez).

Harita tamamen **ücretsiz ve anahtarsızdır**: Leaflet + Esri "Light Gray" altlık,
arama/adres için OpenStreetMap (Nominatim). Hiçbir API anahtarı gerekmez.

Seçilen yerin adı ve koordinatları kaydedilir; teşekkür ekranındaki mekan bağlantısı
doğrudan **Google Maps**'te açılır.

## Firebase

Proje zaten çalışan bir Firebase yapılandırmasıyla gelir (`lib/firebase.ts` içindeki
varsayılanlar). Gönderilen planlar Firestore'da `coffeeDates` koleksiyonuna kaydedilir.

> Firebase web anahtarları gizli değildir; güvenlik `firestore.rules` ile sağlanır.
> Farklı bir projeye bağlanmak için `.env.local.example` dosyasını `.env.local`
> olarak kopyalayıp değerleri doldurabilirsin.

### Firestore kurallarını yayınla (önemli)

Kayıtların kaydedilebilmesi için `firestore.rules` içeriğini
**Firebase Console → Firestore Database → Rules** bölümüne yapıştırıp **Publish** et.
Bu kurallar ziyaretçilerin yalnızca yeni plan **oluşturmasına** izin verir; kimse
kayıtları okuyamaz/değiştiremez/silemez (gelen planları yalnızca sen Console'dan görürsün).

## Yapı

```
app/
  layout.tsx        # kök layout, meta, arkaplan
  page.tsx          # adımları yöneten durum makinesi
  globals.css       # Tailwind + cam efekti / arkaplan
components/
  Greeting.tsx      # "Merhaba Bengisu…" karşılama dizisi
  Question.tsx      # kahve sorusu + kaçan "Hayır" (mobil dahil)
  Scheduler.tsx     # tarih / saat / harita ile mekan
  MapPicker.tsx     # Leaflet harita (yalnızca Türkiye, açılışta Ankara)
  ThankYou.tsx      # teşekkür + Firebase kaydı + Maps bağlantısı
  CoffeeMark.tsx    # kahve fincanı SVG
lib/
  firebase.ts       # Firebase başlatma + savePlan()
  types.ts          # DatePlan / SelectedPlace tipleri
firestore.rules     # Firestore güvenlik kuralları
```
