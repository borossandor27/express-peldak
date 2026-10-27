-- =====================================================
-- 34. feladat - Jegyzetfüzet felhasználókkal (2 tábla, 1:N kapcsolat)
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újra importálva visszaáll az eredeti állapot.
--
-- Mintafelhasználók (e-mail / jelszó):
--   anna@pelda.hu    / Anna1234     (3 jegyzet)
--   bela@pelda.hu    / Bela1234     (2 jegyzet)
--   csilla@pelda.hu  / Csilla123    (nincs jegyzete)
-- =====================================================

CREATE DATABASE IF NOT EXISTS `jegyzetfuzet` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `jegyzetfuzet`;

DROP TABLE IF EXISTS `jegyzetek`;
DROP TABLE IF EXISTS `felhasznalok`;

CREATE TABLE `felhasznalok` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nev` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  -- A jelszót SOHA nem tároljuk, csak a bcrypt hash-ét (mindig 60 karakter)
  `jelszo_hash` CHAR(60) NOT NULL,
  `letrehozva` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `jegyzetek` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `felhasznalo_id` INT NOT NULL,
  `cim` VARCHAR(100) NOT NULL,
  `szoveg` TEXT NOT NULL,
  `letrehozva` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modositva` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_jegyzetek_felhasznalo` (`felhasznalo_id`),
  -- Ha a felhasználót töröljük, a jegyzetei is törlődnek
  CONSTRAINT `fk_jegyzetek_felhasznalo` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `felhasznalok` (`id`, `nev`, `email`, `jelszo_hash`, `letrehozva`) VALUES
(1, 'Kiss Anna',   'anna@pelda.hu',   '$2b$10$fVAyLcsCb8NZi5e.QuKP8enz2nMLKWt/iSdhluPeYrjFmNptSF27.', '2026-09-01 08:00:00'),
(2, 'Nagy Béla',   'bela@pelda.hu',   '$2b$10$bzFLmliuX.z4nOZ6Xe7qt./ddbN6qyXe8B6esSanK4E04Ce.16Yy2', '2026-09-02 14:30:00'),
(3, 'Tóth Csilla', 'csilla@pelda.hu', '$2b$10$D60R0cnhAnTYXFCNNoU0je2AohHJPzd2IEclspLp8VeVMb2g.RvvK', '2026-09-10 19:45:00');

INSERT INTO `jegyzetek` (`id`, `felhasznalo_id`, `cim`, `szoveg`, `letrehozva`, `modositva`) VALUES
(1, 1, 'Bevásárlás',       'tej, kenyér, alma',                           '2026-10-01 08:15:00', NULL),
(2, 1, 'Matek dolgozat',   'Csütörtökön: másodfokú egyenletek',           '2026-10-05 17:40:00', '2026-10-06 07:10:00'),
(3, 2, 'Edzés',            'Kedd és péntek 17:00, a tornateremben',       '2026-10-06 19:00:00', NULL),
(4, 1, 'Születésnap',      'Béla szülinapja: október 30.',                '2026-10-12 10:05:00', NULL),
(5, 2, 'Backend beadandó', 'Express + MySQL, határidő: november 10.',     '2026-10-14 21:30:00', NULL);
