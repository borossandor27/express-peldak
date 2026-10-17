-- =====================================================
-- 09 - Jogosultságkezelés: felhasználók szerepkörrel
--
-- A konyvtar.sql UTÁN importáld (ugyanabba a konyvtar adatbázisba kerül).
-- Újraimportálva visszaállítja az eredeti felhasználókat és szerepköröket.
--
-- Mintafelhasználók (mindegyik jelszava: Jelszo123):
--   olvaso@konyvtar.hu      user
--   konyvtaros@konyvtar.hu  librarian
--   admin@konyvtar.hu       admin
-- =====================================================

USE `konyvtar`;

DROP TABLE IF EXISTS `felhasznalok`;

CREATE TABLE `felhasznalok` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nev` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `jelszo_hash` CHAR(60) NOT NULL,
  -- Az ENUM csak a felsorolt értékeket engedi, és alapból mindenki "user"
  `szerepkor` ENUM('user', 'librarian', 'admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A hash a "Jelszo123" jelszóhoz tartozik (bcrypt, 10-es költségtényező)
INSERT INTO `felhasznalok` (`nev`, `email`, `jelszo_hash`, `szerepkor`) VALUES
('Olvasó Olga', 'olvaso@konyvtar.hu', '$2b$10$cOqG2pSy8kSCgvq6bA3kAesb3at6Rn4nRPV5VeUF4.nTWFgzEEBdS', 'user'),
('Könyvtáros Kata', 'konyvtaros@konyvtar.hu', '$2b$10$cOqG2pSy8kSCgvq6bA3kAesb3at6Rn4nRPV5VeUF4.nTWFgzEEBdS', 'librarian'),
('Admin Ádám', 'admin@konyvtar.hu', '$2b$10$cOqG2pSy8kSCgvq6bA3kAesb3at6Rn4nRPV5VeUF4.nTWFgzEEBdS', 'admin');
