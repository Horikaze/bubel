import { uploadImagesAction } from "@/actions/uploadImages";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

export const copyToPublicFolder = (sourceFile: string) => {
  // Źródło (pełna ścieżka pliku, który chcesz skopiować)
  const sourcePath = path.resolve(sourceFile);

  // Folder docelowy (public/uploads)
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Upewnij się, że folder istnieje
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Nazwa pliku
  const fileName = path.basename(sourcePath);

  // Ścieżka docelowa
  const destinationPath = path.join(uploadDir, fileName);

  // Kopiowanie pliku
  fs.copyFileSync(sourcePath, destinationPath);

  // Zwróć URL względem public/
  return `/uploads/${fileName}`;
};

async function main() {
  const rodzajeData = [
    {
      nazwa: "RPG",
      opis: "gracz wciela się w postać i rozwija jej umiejętności, podejmując decyzje wpływające na fabułę (np. Wiedźmin 3).",
    },
    {
      nazwa: "FPS",
      opis: "gra akcji z perspektywy pierwszej osoby, głównie oparta na strzelaniu i walce (np. Call of Duty).",
    },
    {
      nazwa: "Strategia",
      opis: "gra wymagająca planowania i zarządzania zasobami, często w czasie rzeczywistym lub turowa (np. Civilization VI).",
    },
    {
      nazwa: "Przygodowa",
      opis: "gra skupiająca się na eksploracji, rozwiązywaniu zagadek i narracji (np. The Legend of Zelda: Breath of the Wild).",
    },
  ];
  const jezykData = [
    {
      nazwa: "Polski",
      skrot: "PL",
      flaga: copyToPublicFolder("dummyData/flags/svg/pol.svg"),
    },
    {
      nazwa: "Angielski",
      skrot: "EN",
      flaga: copyToPublicFolder("dummyData/flags/svg/usa.svg"),
    },
    {
      nazwa: "Japoński",
      skrot: "JP",
      flaga: copyToPublicFolder("dummyData/flags/svg/jpn.svg"),
    },
  ];
  await prisma.jezyk.createMany({
    data: jezykData,
  });
  await prisma.rodzaj.createMany({
    data: rodzajeData,
  });
  const rodzaje = await prisma.rodzaj.findMany({
    where: {
      nazwa: {
        in: rodzajeData.map((rodzaj) => rodzaj.nazwa),
      },
    },
  });
  const jezyki = await prisma.jezyk.findMany();

  const cdProjekt = await prisma.producent.create({
    data: {
      nazwa: "CD Projekt Red",
      opis: "polski producent gier komputerowych, założony w 2002 roku jako spółka zależna CD Projektu. Studio należało do holdingu CDP Investment, połączonego później z przedsiębiorstwem Optimus. Siedziba znajdowała się w Warszawie..",
      logo: copyToPublicFolder("dummyData/producenci/cd_projekt.png"),
    },
  });
  const ubisoft = await prisma.producent.create({
    data: {
      nazwa: "Ubisoft",
      opis: "francuski producent i wydawca gier komputerowych, założony w 1986 roku przez pięciu braci Guillemot. Siedziba główna firmy znajduje się w Montreuil pod Paryżem. Ubisoft jest jednym z największych producentów gier na świecie, znanym z takich serii jak Assassin's Creed, Far Cry czy Just Dance.",
      logo: copyToPublicFolder("dummyData/producenci/ubisoft.png"),
    },
  });
  const ea = await prisma.producent.create({
    data: {
      nazwa: "Electronic Arts",
      opis: "amerykański producent i wydawca gier komputerowych, założony w 1982 roku przez Tripa Hawkinsa. Siedziba główna firmy znajduje się w Redwood City w Kalifornii. EA jest jednym z największych producentów gier na świecie, znanym z takich serii jak FIFA, The Sims czy Battlefield.",
      logo: copyToPublicFolder("dummyData/producenci/ea.png"),
    },
  });
  const w3 = await prisma.gra.create({
    data: {
      nazwa: "Wiedźmin 3: Dziki Gon",
      opis: "Wiedźmin 3: Dziki Gon to trzecia część popularnej serii gier RPG stworzonych przez polskie studio CD Projekt Red. Gra opowiada historię Geralta z Rivii, wiedźmina, który przemierza rozległy świat fantasy, walcząc z potworami i podejmując decyzje wpływające na losy bohaterów i świata.",
      data_wydania: new Date("2015-05-19"),
      id_producenta: cdProjekt.id,
      id_rodzaj: rodzaje.find((r) => r.nazwa === "RPG")!.id,
      zdjecia: `${copyToPublicFolder(
        "dummyData/w3/w3box.png"
      )}, ${copyToPublicFolder("dummyData/w3/w31.png")}, ${copyToPublicFolder(
        "dummyData/w3/w32.png"
      )}, ${copyToPublicFolder("dummyData/w3/w33.png")}`,
      cena: 129.99,
      dostepnosc: 100,
      id_jezyk: jezyki.find((j) => j.skrot === "PL")!.id,
      od_ilu_lat: 18,
    },
  });
  const cyberpunk = await prisma.gra.create({
    data: {
      nazwa: "Cyberpunk 2077",
      opis: "Cyberpunk 2077 to gra RPG osadzona w otwartym świecie futurystycznego miasta Night City, stworzonego przez CD Projekt Red. Gracze wcielają się w postać V, najemnika poszukującego unikalnego implantu, który obiecuje nieśmiertelność. Gra oferuje bogatą fabułę, liczne misje poboczne oraz możliwość personalizacji postaci i stylu gry.",
      data_wydania: new Date("2020-12-10"),
      id_producenta: cdProjekt.id,
      id_rodzaj: rodzaje.find((r) => r.nazwa === "RPG")!.id,
      zdjecia: `${copyToPublicFolder(
        "dummyData/cyberpunk/cyberpunkbox.png"
      )}, ${copyToPublicFolder(
        "dummyData/cyberpunk/cp1.png"
      )}, ${copyToPublicFolder(
        "dummyData/cyberpunk/cp2.png"
      )}, ${copyToPublicFolder("dummyData/cyberpunk/cp3.png")}`,
      cena: 200,
      dostepnosc: 100,
      id_jezyk: jezyki.find((j) => j.skrot === "PL")!.id,
      od_ilu_lat: 18,
    },
  });
  const ac = await prisma.gra.create({
    data: {
      nazwa: "Assassin's Creed Origins",
      opis: "Assassin's Creed Origins to gra akcji z otwartym światem opracowana przez Ubisoft. Akcja gry toczy się w starożytnym Egipcie i opowiada historię Bayeka, medżaja, który staje się pierwszym asasynem. Gra oferuje bogaty świat do eksploracji, liczne misje i rozwijanie umiejętności postaci.",
      data_wydania: new Date("2017-10-27"),
      id_producenta: ubisoft.id,
      id_rodzaj: rodzaje.find((r) => r.nazwa === "Przygodowa")!.id,
      zdjecia: `${copyToPublicFolder(
        "dummyData/ac/acbox.png"
      )}, ${copyToPublicFolder("dummyData/ac/ac1.png")}, ${copyToPublicFolder(
        "dummyData/ac/ac2.png"
      )}, ${copyToPublicFolder("dummyData/ac/ac3.png")}`,
      cena: 150,
      dostepnosc: 60,
      id_jezyk: jezyki.find((j) => j.skrot === "EN")!.id,
      od_ilu_lat: 16,
    },
  });
  await prisma.metodaPlatnosci.createMany({
    data: [
      { nazwa: "Karta kredytowa/debetowa" },
      { nazwa: "PayPal" },
      { nazwa: "Przelew tradycyjny" },
      { nazwa: "Blik" },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
