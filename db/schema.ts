import { sql } from "drizzle-orm";
import {
  mysqlTable,
  int,
  varchar,
  decimal,
  text,
  boolean,
  datetime,
  primaryKey,
  timestamp,
} from "drizzle-orm/mysql-core";

// PRODUCENT
export const producent = mysqlTable("PRODUCENT", {
  id: int("id").autoincrement().primaryKey(),
  nazwa: varchar("nazwa", { length: 50 }).notNull(),
  logo: varchar("logo", { length: 100 }),
  opis: varchar("opis", { length: 500 }),
});

// JEZYK
export const jezyk = mysqlTable("JEZYK", {
  id: int("id").autoincrement().primaryKey(),
  nazwa: varchar("nazwa", { length: 30 }).notNull(),
  flaga: varchar("flaga", { length: 100 }),
  skrot: varchar("skrot", { length: 10 }),
});

// RODZAJ
export const rodzaj = mysqlTable("RODZAJ", {
  id: int("id").autoincrement().primaryKey(),
  nazwa: varchar("nazwa", { length: 30 }).notNull(),
  opis: varchar("opis", { length: 300 }),
});

// GRA
export const gra = mysqlTable("GRA", {
  id: int("id").autoincrement().primaryKey(),
  nazwa: varchar("nazwa", { length: 50 }).notNull(),
  id_producenta: int("id_producenta").references(() => producent.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  cena: decimal("cena", { precision: 10, scale: 2 }),
  id_jezyk: int("id_jezyk").references(() => jezyk.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  data_wydania: datetime("data_wydania"),
  od_ilu_lat: int("od_ilu_lat"),
  id_rodzaj: int("id_rodzaj").references(() => rodzaj.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  opis: text("opis"),
  zdjecia: varchar("zdjecia", { length: 500 }),
  ocena: decimal("ocena", { precision: 3, scale: 1 }),
  dostepnosc: int("dostepnosc").default(0),
});

// KLIENT
export const klient = mysqlTable("KLIENT", {
  id: int("id").autoincrement().primaryKey(),
  id_konta: varchar("id_konta", { length: 36 }).notNull(),
  imie: varchar("imie", { length: 30 }).notNull(),
  email: varchar("email", { length: 30 }).notNull(),
  nazwisko: varchar("nazwisko", { length: 30 }).notNull(),
  telefon: varchar("telefon", { length: 20 }),
  miasto: varchar("miasto", { length: 40 }),
  kod_pocztowy: varchar("kod_pocztowy", { length: 10 }),
  ulica: varchar("ulica", { length: 50 }),
});

// METODA_PLATNOSCI
export const metodaPlatnosci = mysqlTable("METODA_PLATNOSCI", {
  id: int("id").autoincrement().primaryKey(),
  nazwa: varchar("nazwa", { length: 30 }).notNull(),
});

// TRANZAKCJA
export const tranzakcja = mysqlTable("TRANZAKCJA", {
  id: int("id").autoincrement().primaryKey(),
  id_klienta: int("id_klienta")
    .references(() => klient.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  data_tranzakcji: datetime("data_tranzakcji").default(sql`CURRENT_TIMESTAMP`),
  id_metody_platnosci: int("id_metody_platnosci").references(
    () => metodaPlatnosci.id,
    { onDelete: "set null", onUpdate: "cascade" }
  ),
  czy_online: boolean("czy_online").default(true),
  status: int("status").default(0),
});

// TRANZAKCJA_GRA (tabela pośrednicząca)
export const tranzakcjaGra = mysqlTable(
  "TRANZAKCJA_GRA",
  {
    id_tranzakcji: int("id_tranzakcji").references(() => tranzakcja.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    id_gra: int("id_gra").references(() => gra.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    ilosc: int("ilosc").default(1),
  },
  (table) => [primaryKey({ columns: [table.id_tranzakcji, table.id_gra] })]
);

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP`),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});
