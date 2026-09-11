# Convoy – rezervacija vožnji

Diplomski rad: **Rezervacija vožnji – razvoj REST web servisa sa veb i mobilnim klijentom**

- Kandidat: Andrija Stojanović, 07/23 IT
- Mentor: Dragoljub Pilipović
- Univerzitet „Union“, Računarski fakultet, Beograd 2026.

Convoy je aplikacija za deljenje vožnje. Vozač objavljuje vožnju, a putnik je pronalazi i rezerviše mesta. Sistem se sastoji od tri dela koji koriste isti REST API i istu bazu podataka.

| Folder | Opis | Tehnologije |
|---|---|---|
| `voznje-backend` | REST API server | Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT |
| `voznje-web` | Veb aplikacija | React, Vite, TypeScript, Tailwind CSS |
| `voznje-mobile` | Mobilna aplikacija | React Native, Expo, NativeWind |

## Potrebno za pokretanje

- Node.js 20 ili noviji
- PostgreSQL
- Za mobilnu aplikaciju: telefon sa instaliranom aplikacijom **Expo Go** (projekat koristi Expo SDK 57)

## 1. Backend

Napraviti praznu PostgreSQL bazu, na primer `voznje_db`.

```bash
cd voznje-backend
npm install
cp .env.example .env
```

U fajlu `.env` upisati podatke za svoju bazu i proizvoljan tajni ključ za JWT. Zatim napraviti tabele i pokrenuti server:

```bash
npx prisma migrate dev
npm run dev
```

Server radi na adresi `http://localhost:3000`.

## 2. Veb aplikacija

U novom terminalu:

```bash
cd voznje-web
npm install
npm run dev
```

Aplikacija se otvara u pretraživaču na adresi koju Vite ispiše u terminalu (podrazumevano `http://localhost:5173`).

## 3. Mobilna aplikacija

Telefon mora biti povezan na istu Wi-Fi mrežu kao računar na kome radi backend.

U fajlu `voznje-mobile/src/api/client.ts` zameniti IP adresu u `baseURL` IP adresom svog računara u lokalnoj mreži:

```ts
baseURL: 'http://192.168.x.x:3000/api',
```

IP adresa se na macOS-u vidi u System Settings → Wi-Fi → Details, a na Windowsu komandom `ipconfig`.

Zatim:

```bash
cd voznje-mobile
npm install
npx expo start
```

QR kod iz terminala skenirati kamerom telefona (iOS) ili iz aplikacije Expo Go (Android).

## Korišćenje

Pri registraciji se bira uloga:

- **Putnik** pretražuje vožnje, rezerviše mesta i može da otkaže rezervaciju.
- **Vozač** objavljuje vožnje, vidi putnike i zaradu, i može da otkaže ili obriše svoju vožnju.

Za probu je najlakše napraviti dva naloga, jedan vozača i jedan putnika.

## Glavni API endpoint-i

| Metod | Ruta | Opis | Prijava |
|---|---|---|---|
| POST | `/api/auth/register` | Registracija | Ne |
| POST | `/api/auth/login` | Prijava, vraća JWT token | Ne |
| GET | `/api/rides` | Lista aktivnih vožnji, sa pretragom | Ne |
| GET | `/api/rides/:id` | Detalji vožnje | Ne |
| POST | `/api/rides` | Kreiranje vožnje | Da |
| GET | `/api/rides/moje-voznje` | Vožnje ulogovanog vozača | Da |
| DELETE | `/api/rides/:id` | Brisanje vožnje bez rezervacija | Da |
| PATCH | `/api/rides/:id/otkazi` | Otkazivanje vožnje | Da |
| POST | `/api/reservations` | Kreiranje rezervacije | Da |
| PATCH | `/api/reservations/:id/otkazi` | Otkazivanje rezervacije | Da |
| GET | `/api/reservations/moje` | Rezervacije ulogovanog putnika | Da |

Zaštićene rute očekuju zaglavlje `Authorization: Bearer <token>`.
