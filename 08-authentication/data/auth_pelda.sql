-- =====================================================
-- 08 - Hitelesítés: felhasználók táblája
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újraimportálva visszaállítja az eredeti állapotot.
--
-- Mintafelhasználó:  teszt@pelda.hu  /  Jelszo123
-- =====================================================

CREATE DATABASE IF NOT EXISTS `auth_pelda` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `auth_pelda`;

DROP TABLE IF EXISTS `felhasznalok`;

CREATE TABLE `felhasznalok` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nev` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  -- A jelszót SOHA nem tároljuk, csak a bcrypt hash-ét (mindig 60 karakter)
  `jelszo_hash` CHAR(60) NOT NULL,
  `letrehozva` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  -- Egy e-mail címmel csak egyszer lehet regisztrálni
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- A hash a "Jelszo123" jelszóhoz tartozik (bcrypt, 10-es költségtényező)
INSERT INTO `felhasznalok` (`nev`, `email`, `jelszo_hash`) VALUES
('Teszt Elek', 'teszt@pelda.hu', '$2b$10$cOqG2pSy8kSCgvq6bA3kAesb3at6Rn4nRPV5VeUF4.nTWFgzEEBdS');
