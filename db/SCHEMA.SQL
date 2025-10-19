-- =========================================
-- Baza danych: bubel
-- =========================================
CREATE DATABASE IF NOT EXISTS bubel CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_polish_ci;

USE bubel;

-- =========================================
-- Tabela PRODUCENT
-- =========================================
CREATE TABLE
    PRODUCENT (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nazwa VARCHAR(50) NOT NULL,
        logo VARCHAR(100),
        opis VARCHAR(500)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_polish_ci;

-- =========================================
-- Tabela JEZYK
-- =========================================
CREATE TABLE
    JEZYK (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nazwa VARCHAR(30) NOT NULL,
        flaga VARCHAR(100),
        skrot VARCHAR(10)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_polish_ci;

-- =========================================
-- Tabela RODZAJ
-- =========================================
CREATE TABLE
    RODZAJ (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nazwa VARCHAR(30) NOT NULL,
        opis VARCHAR(300)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_polish_ci;

-- =========================================
-- Tabela GRA
-- =========================================
CREATE TABLE
    GRA (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nazwa VARCHAR(50) NOT NULL,
        id_producenta INT,
        cena DECIMAL(10, 2) CHECK (cena >= 0),
        id_jezyk INT,
        data_wydania DATE,
        od_ilu_lat INT CHECK (od_ilu_lat >= 0),
        id_rodzaj INT,
        opis TEXT,
        zdjecia VARCHAR(500),
        ocena FLOAT CHECK (ocena BETWEEN 0 AND 10),
        dostepnosc INT DEFAULT 0 CHECK (dostepnosc >= 0),
        FOREIGN KEY (id_producenta) REFERENCES PRODUCENT (id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (id_jezyk) REFERENCES JEZYK (id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (id_rodzaj) REFERENCES RODZAJ (id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_polish_ci;

-- =========================================
-- Tabela KLIENT
-- =========================================
CREATE TABLE
    KLIENT (
        id INT AUTO_INCREMENT PRIMARY KEY,
        imie VARCHAR(30) NOT NULL,
        nazwisko VARCHAR(30) NOT NULL,
        telefon VARCHAR(20),
        miasto VARCHAR(40),
        kod_pocztowy VARCHAR(10),
        ulica VARCHAR(50)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_polish_ci;

-- =========================================
-- Tabela METODA_PLATNOSCI
-- =========================================
CREATE TABLE
    METODA_PLATNOSCI (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nazwa VARCHAR(30) NOT NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_polish_ci;

-- =========================================
-- Tabela TRANZAKCJA
-- =========================================
CREATE TABLE
    TRANZAKCJA (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_klienta INT NOT NULL,
        data_tranzakcji DATETIME DEFAULT CURRENT_TIMESTAMP,
        id_metody_platnosci INT,
        czy_online BOOLEAN DEFAULT TRUE,
        status INT DEFAULT 0,
        FOREIGN KEY (id_klienta) REFERENCES KLIENT (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (id_metody_platnosci) REFERENCES METODA_PLATNOSCI (id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_polish_ci;

-- =========================================
-- Tabela pośrednicząca TRANZAKCJA_GRA
-- =========================================
CREATE TABLE
    TRANZAKCJA_GRA (
        id_tranzakcji INT,
        id_gra INT,
        ilosc INT DEFAULT 1 CHECK (ilosc > 0),
        PRIMARY KEY (id_tranzakcji, id_gra),
        FOREIGN KEY (id_tranzakcji) REFERENCES TRANZAKCJA (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (id_gra) REFERENCES GRA (id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_polish_ci;