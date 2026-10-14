-- =====================================================
-- 07 - mintaadatbázis (ugyanazok a könyvek, mint a 04-crud példában)
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újra importálva visszaáll az eredeti állapot (a tábla törlődik és újra létrejön).
-- =====================================================

CREATE DATABASE IF NOT EXISTS `express_pelda` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `express_pelda`;

DROP TABLE IF EXISTS `konyvek`;

CREATE TABLE `konyvek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cim` varchar(200) NOT NULL,
  `szerzo` varchar(100) NOT NULL,
  `ev` int(11) NOT NULL,
  -- MySQL-ben nincs igazi logikai típus: a BOOLEAN = TINYINT(1), értéke 0 vagy 1
  `kiolcsonozve` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `konyvek` (`id`, `cim`, `szerzo`, `ev`, `kiolcsonozve`) VALUES
(1, 'A Pál utcai fiúk', 'Molnár Ferenc', 1906, 0),
(2, 'Egri csillagok', 'Gárdonyi Géza', 1899, 1),
(3, 'Légy jó mindhalálig', 'Móricz Zsigmond', 1920, 0),
(4, 'Az ember tragédiája', 'Madách Imre', 1861, 0);
