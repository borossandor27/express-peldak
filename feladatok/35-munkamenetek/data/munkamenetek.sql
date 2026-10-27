-- =====================================================
-- 35. feladat - Munkamenetek és kijelentkezés (2 tábla, 1:N kapcsolat)
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újra importálva visszaáll az eredeti állapot.
--
-- Mintafelhasználók (e-mail / jelszó):
--   anna@pelda.hu  / Anna1234
--   bela@pelda.hu  / Bela1234
--
-- A munkamenetek táblában a tokeneknek csak a SHA-256 hash-e van.
-- Három token "nyers" alakját a requests.http fájl tartalmazza, hogy
-- ki tudd próbálni (telefon, régi laptop, Béla laptopja).
-- =====================================================

CREATE DATABASE IF NOT EXISTS `munkamenetek` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `munkamenetek`;

DROP TABLE IF EXISTS `munkamenetek`;
DROP TABLE IF EXISTS `felhasznalok`;

CREATE TABLE `felhasznalok` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nev` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `jelszo_hash` CHAR(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `munkamenetek` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `felhasznalo_id` INT NOT NULL,
  -- A token SHA-256 hash-e hexában: mindig 64 karakter. A token maga NINCS az adatbázisban.
  `token_hash` CHAR(64) NOT NULL,
  `eszkoz` VARCHAR(100) NOT NULL,
  `letrehozva` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utoljara` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lejar` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_token_hash` (`token_hash`),
  KEY `fk_munkamenetek_felhasznalo` (`felhasznalo_id`),
  CONSTRAINT `fk_munkamenetek_felhasznalo` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `felhasznalok` (`id`, `nev`, `email`, `jelszo_hash`) VALUES
(1, 'Kiss Anna', 'anna@pelda.hu', '$2b$10$fVAyLcsCb8NZi5e.QuKP8enz2nMLKWt/iSdhluPeYrjFmNptSF27.'),
(2, 'Nagy Béla', 'bela@pelda.hu', '$2b$10$bzFLmliuX.z4nOZ6Xe7qt./ddbN6qyXe8B6esSanK4E04Ce.16Yy2');

-- Anna már be van jelentkezve a telefonján és egy iskolai gépen; a régi laptopos munkamenete lejárt.
INSERT INTO `munkamenetek` (`id`, `felhasznalo_id`, `token_hash`, `eszkoz`, `letrehozva`, `utoljara`, `lejar`) VALUES
(1, 1, '3335de4025c4f9300592729507bfff668afea03964d278a10fa6a15329808eef', 'Anna telefonja', '2026-10-20 07:30:00', '2026-10-25 21:10:00', '2030-01-01 00:00:00'),
(2, 1, '5bda04a4045526ed9629cd825b69cb822c0298c2a306642d26f770974c63ba8f', 'Iskolai gép (B12)', '2026-10-22 10:00:00', '2026-10-22 10:45:00', '2030-01-01 00:00:00'),
(3, 1, '95b10b41f42aea715bef6b6be2fb28ef589b8d464f6e98686c5299b158d54c3f', 'Régi laptop', '2026-08-30 18:00:00', '2026-08-30 20:00:00', '2026-08-31 18:00:00'),
(4, 2, '0791f725ae67a167cb2852e967bdf7aec3f39055acb236946eb8fbf670993c1a', 'Béla laptopja', '2026-10-24 16:20:00', '2026-10-24 17:05:00', '2030-01-01 00:00:00');
