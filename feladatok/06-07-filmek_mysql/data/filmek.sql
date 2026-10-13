-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Okt 13. 10:41
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
-- Adatbázis: `filmek`
--
CREATE DATABASE IF NOT EXISTS `filmek` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `filmek`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `filmek`
--

CREATE TABLE `filmek` (
  `id` int(11) NOT NULL,
  `cim` varchar(512) DEFAULT NULL,
  `rendezo` varchar(512) DEFAULT NULL,
  `ev` int(11) DEFAULT NULL,
  `mufaj` varchar(512) DEFAULT NULL,
  `ertekeles` double DEFAULT NULL,
  `hossz` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `filmek`
--

INSERT INTO `filmek` (`id`, `cim`, `rendezo`, `ev`, `mufaj`, `ertekeles`, `hossz`) VALUES
(1, 'A tanú', 'Bacsó Péter', 1969, 'vígjáték', 8.6, 110),
(2, 'Kontroll', 'Antal Nimród', 2003, 'thriller', 7.6, 105),
(3, 'Saul fia', 'Nemes Jeles László', 2015, 'dráma', 7.4, 107),
(4, 'Mindenki', 'Deák Kristóf', 2016, 'dráma', 7.6, 25),
(5, 'Macskafogó', 'Ternovszky Béla', 1986, 'animáció', 8.4, 96),
(6, 'Csinibaba', 'Tímár Péter', 1997, 'vígjáték', 7.9, 94),
(7, 'Eredet', 'Christopher Nolan', 2010, 'sci-fi', 8.8, 148),
(8, 'Mátrix', 'Wachowski testvérek', 1999, 'sci-fi', 8.7, 136),
(9, 'Toy Story', 'John Lasseter', 1995, 'animáció', 8.3, 81),
(10, 'Csillagok között', 'Christopher Nolan', 2014, 'sci-fi', 8.7, 169),
(11, 'A Keresztapa', 'Francis Ford Coppola', 1972, 'dráma', 9.2, 175),
(12, 'Hyppolit, a lakáj', 'Székely István', 1931, 'vígjáték', 7.9, 76);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `filmek`
--
ALTER TABLE `filmek`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `filmek`
--
ALTER TABLE `filmek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
