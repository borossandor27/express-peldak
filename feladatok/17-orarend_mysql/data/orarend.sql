-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Okt 13. 12:09
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `orarend`
--
CREATE DATABASE IF NOT EXISTS `orarend` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `orarend`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `orarend`
--

CREATE TABLE `orarend` (
  `id` int(11) NOT NULL,
  `nap` enum('hétfő','kedd','szerda','csütörtök','péntek') NOT NULL,
  `ora` tinyint(3) UNSIGNED NOT NULL,
  `tanar_id` int(11) NOT NULL,
  `tantargy_id` int(11) NOT NULL,
  `terem_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `orarend`
--

INSERT INTO `orarend` (`id`, `nap`, `ora`, `tanar_id`, `tantargy_id`, `terem_id`) VALUES
(1, 'hétfő', 1, 1, 1, 1),
(2, 'hétfő', 2, 2, 2, 2),
(3, 'hétfő', 3, 3, 3, 3),
(4, 'hétfő', 4, 4, 4, 4),
(5, 'hétfő', 5, 4, 4, 4),
(6, 'hétfő', 6, 5, 5, 5),
(7, 'kedd', 1, 6, 6, 2),
(8, 'kedd', 2, 1, 1, 1),
(9, 'kedd', 3, 1, 7, 6),
(10, 'kedd', 4, 2, 8, 2),
(11, 'kedd', 5, 3, 3, 3),
(12, 'kedd', 6, 2, 9, 2),
(13, 'szerda', 2, 4, 10, 7),
(14, 'szerda', 3, 4, 10, 7),
(15, 'szerda', 4, 1, 1, 1),
(16, 'szerda', 5, 5, 5, 5),
(17, 'szerda', 6, 6, 6, 2),
(18, 'csütörtök', 1, 3, 3, 3),
(19, 'csütörtök', 2, 2, 2, 2),
(20, 'csütörtök', 3, 1, 1, 1),
(21, 'csütörtök', 4, 1, 7, 6),
(22, 'csütörtök', 5, 4, 4, 4),
(23, 'péntek', 1, 1, 1, 1),
(24, 'péntek', 2, 6, 6, 2),
(25, 'péntek', 3, 5, 5, 5),
(26, 'péntek', 4, 3, 3, 3),
(27, 'péntek', 5, 4, 10, 7),
(28, 'péntek', 6, 4, 10, 7);

-- --------------------------------------------------------

--
-- A nézet helyettes szerkezete `orarend_adatokkal`
-- (Lásd alább az aktuális nézetet)
--
CREATE TABLE `orarend_adatokkal` (
`nap` enum('hétfő','kedd','szerda','csütörtök','péntek')
,`ora` tinyint(3) unsigned
,`tantargy` varchar(100)
,`tanar` varchar(100)
,`terem` varchar(50)
);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tanarok`
--

CREATE TABLE `tanarok` (
  `id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `tanarok`
--

INSERT INTO `tanarok` (`id`, `nev`) VALUES
(4, 'Fekete László'),
(1, 'Kovács Judit'),
(3, 'Nagy Tamás'),
(2, 'Szabó Éva'),
(5, 'Tóth Gábor'),
(6, 'Varga Ilona');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tantargyak`
--

CREATE TABLE `tantargyak` (
  `id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `tantargyak`
--

INSERT INTO `tantargyak` (`id`, `nev`) VALUES
(3, 'Angol nyelv'),
(7, 'Fizika'),
(4, 'Informatika'),
(2, 'Magyar irodalom'),
(8, 'Magyar nyelv'),
(1, 'Matematika'),
(9, 'Osztályfőnöki'),
(5, 'Testnevelés'),
(6, 'Történelem'),
(10, 'Webprogramozás');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termek`
--

CREATE TABLE `termek` (
  `id` int(11) NOT NULL,
  `nev` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `termek`
--

INSERT INTO `termek` (`id`, `nev`) VALUES
(1, '12'),
(6, '15'),
(2, '21'),
(3, '8'),
(4, 'Labor 1'),
(7, 'Labor 2'),
(5, 'Tornaterem');

-- --------------------------------------------------------

--
-- Nézet szerkezete `orarend_adatokkal`
--
DROP TABLE IF EXISTS `orarend_adatokkal`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `orarend_adatokkal`  AS SELECT `o`.`nap` AS `nap`, `o`.`ora` AS `ora`, `t`.`nev` AS `tantargy`, `tan`.`nev` AS `tanar`, `te`.`nev` AS `terem` FROM (((`orarend` `o` join `tantargyak` `t` on(`t`.`id` = `o`.`tantargy_id`)) join `tanarok` `tan` on(`tan`.`id` = `o`.`tanar_id`)) join `termek` `te` on(`te`.`id` = `o`.`terem_id`)) ORDER BY field(`o`.`nap`,'hétfő','kedd','szerda','csütörtök','péntek') ASC, `o`.`ora` ASC ;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `orarend`
--
ALTER TABLE `orarend`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_nap_ora` (`nap`,`ora`),
  ADD KEY `fk_orarend_tanar` (`tanar_id`),
  ADD KEY `fk_orarend_tantargy` (`tantargy_id`),
  ADD KEY `fk_orarend_terem` (`terem_id`);

--
-- A tábla indexei `tanarok`
--
ALTER TABLE `tanarok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nev` (`nev`);

--
-- A tábla indexei `tantargyak`
--
ALTER TABLE `tantargyak`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nev` (`nev`);

--
-- A tábla indexei `termek`
--
ALTER TABLE `termek`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nev` (`nev`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `orarend`
--
ALTER TABLE `orarend`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT a táblához `tanarok`
--
ALTER TABLE `tanarok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `tantargyak`
--
ALTER TABLE `tantargyak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `termek`
--
ALTER TABLE `termek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `orarend`
--
ALTER TABLE `orarend`
  ADD CONSTRAINT `fk_orarend_tanar` FOREIGN KEY (`tanar_id`) REFERENCES `tanarok` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orarend_tantargy` FOREIGN KEY (`tantargy_id`) REFERENCES `tantargyak` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orarend_terem` FOREIGN KEY (`terem_id`) REFERENCES `termek` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
