-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PUTNIK', 'VOZAC', 'ADMIN');

-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('AKTIVNA', 'ZAVRSENA', 'OTKAZANA');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('POTVRDJENA', 'OTKAZANA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "prezime" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lozinka" TEXT NOT NULL,
    "telefon" TEXT,
    "uloga" "Role" NOT NULL DEFAULT 'PUTNIK',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ride" (
    "id" SERIAL NOT NULL,
    "polaznaLokacija" TEXT NOT NULL,
    "odredisnaLokacija" TEXT NOT NULL,
    "datumVremePolaska" TIMESTAMP(3) NOT NULL,
    "brojSlobodnihMesta" INTEGER NOT NULL,
    "cenaPoMestu" DECIMAL(65,30) NOT NULL,
    "status" "RideStatus" NOT NULL DEFAULT 'AKTIVNA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vozacId" INTEGER NOT NULL,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "brojRezervisanihMesta" INTEGER NOT NULL,
    "datumRezervacije" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ReservationStatus" NOT NULL DEFAULT 'POTVRDJENA',
    "voznjaId" INTEGER NOT NULL,
    "korisnikId" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_vozacId_fkey" FOREIGN KEY ("vozacId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_voznjaId_fkey" FOREIGN KEY ("voznjaId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_korisnikId_fkey" FOREIGN KEY ("korisnikId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
