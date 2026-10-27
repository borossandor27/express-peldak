-- =====================================================
-- 36. feladat - Javítsd ki! Biztonsági hibák
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újra importálva visszaáll az eredeti állapot (pl. egy sikeres "támadás" után).
--
-- Mintafelhasználók (e-mail / jelszó):
--   anna@pelda.hu    / Anna1234   (admin)
--   bela@pelda.hu    / Bela1234
--   csilla@pelda.hu  / Csilla123
-- =====================================================

CREATE DATABASE IF NOT EXISTS `biztonsag` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `biztonsag`;

DROP TABLE IF EXISTS `felhasznalok`;

CREATE TABLE `felhasznalok` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nev` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `jelszo_hash` CHAR(60) NOT NULL,
  `szerep` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `letrehozva` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `felhasznalok` (`id`, `nev`, `email`, `jelszo_hash`, `szerep`, `letrehozva`) VALUES
(1, 'Kiss Anna',   'anna@pelda.hu',   '$2b$10$fVAyLcsCb8NZi5e.QuKP8enz2nMLKWt/iSdhluPeYrjFmNptSF27.', 'admin', '2026-09-01 08:00:00'),
(2, 'Nagy Béla',   'bela@pelda.hu',   '$2b$10$bzFLmliuX.z4nOZ6Xe7qt./ddbN6qyXe8B6esSanK4E04Ce.16Yy2', 'user',  '2026-09-02 14:30:00'),
(3, 'Tóth Csilla', 'csilla@pelda.hu', '$2b$10$D60R0cnhAnTYXFCNNoU0je2AohHJPzd2IEclspLp8VeVMb2g.RvvK', 'user',  '2026-09-10 19:45:00');
