-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Počítač: localhost
-- Vytvořeno: Pát 09. dub 2021, 16:54
-- Verze serveru: 8.0.23
-- Verze PHP: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `projecto`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `categories`
--

CREATE TABLE `categories` (
  `id` int UNSIGNED NOT NULL,
  `name` tinytext COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Vypisuji data pro tabulku `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Scope definition'),
(2, 'Requirement specification'),
(3, 'Estimates, restrictions, assumptions'),
(4, 'Technical processes'),
(5, 'Technology'),
(6, 'Technical interfaces'),
(7, 'Design'),
(8, 'Performance'),
(9, 'Reliability, sustainability'),
(10, 'Security'),
(11, 'Safety'),
(12, 'Tests, acceptation'),
(13, 'Project management'),
(14, 'Program/portfolio management'),
(15, 'Operative management'),
(16, 'Organization'),
(17, 'Sources'),
(18, 'Communication'),
(19, 'Adequacy of information'),
(20, 'Safety, health protection'),
(21, 'Quality'),
(22, 'Reputation'),
(23, 'Terms and conditions'),
(24, 'Internal mediation'),
(25, 'Market flexibility'),
(26, 'Subcontracting'),
(27, 'Customer stability'),
(28, 'Partners, strategies'),
(29, 'Legislation'),
(30, 'Monetary Policy'),
(31, 'Environment'),
(32, 'Natural influences'),
(33, 'Competition'),
(34, 'Tax policy'),
(35, 'Social aspects'),
(36, 'Demographic aspects'),
(37, 'Pressure groups'),
(38, 'Higher power');

-- --------------------------------------------------------

--
-- Struktura tabulky `projects`
--

CREATE TABLE `projects` (
  `id` int UNSIGNED NOT NULL,
  `project_manager_id` int UNSIGNED NOT NULL,
  `risk_manager_id` int UNSIGNED DEFAULT NULL,
  `name` tinytext COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','archived') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `risks`
--

CREATE TABLE `risks` (
  `id` int UNSIGNED NOT NULL,
  `category_id` int UNSIGNED NOT NULL,
  `project_id` int UNSIGNED NOT NULL,
  `risk_manager_id` int UNSIGNED NOT NULL,
  `name` tinytext COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `threat` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `starters` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `response` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `probability` float NOT NULL,
  `impact` float NOT NULL,
  `status` enum('concept','active','closed','deleted','occured') COLLATE utf8mb4_unicode_ci NOT NULL,
  `identified_at` datetime DEFAULT NULL,
  `status_updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `responded_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `name` tinytext COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` tinytext COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` tinytext COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','risk_manager','project_manager', 'user') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `user_projects`
--

DROP TABLE IF EXISTS `user_projects`;
CREATE TABLE `user_projects` (
                                 `created_at` datetime NOT NULL,
                                 `updated_at` datetime NOT NULL,
                                 `user_id` int(10) UNSIGNED NOT NULL,
                                 `project_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Klíče pro exportované tabulky
--

--
-- Klíče pro tabulku `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Klíče pro tabulku `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `risk_manager_id` (`risk_manager_id`),
  ADD KEY `projects_project_manager_id` (`project_manager_id`);

--
-- Klíče pro tabulku `risks`
--
ALTER TABLE `risks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `risks_category_id` (`category_id`),
  ADD KEY `risks_project_id` (`project_id`),
  ADD KEY `risks_risk_manager_id` (`risk_manager_id`);

--
-- Klíče pro tabulku `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_projects`
--
ALTER TABLE `user_projects`
    ADD PRIMARY KEY (`user_id`,`project_id`),
  ADD KEY `project_id` (`project_id`);


--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT pro tabulku `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pro tabulku `risks`
--
ALTER TABLE `risks`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pro tabulku `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Omezení pro exportované tabulky
--

--
-- Omezení pro tabulku `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_project_manager_id` FOREIGN KEY (`project_manager_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `projects_risk_manager_id` FOREIGN KEY (`risk_manager_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;


--
-- Constraints for table `user_projects`
--
ALTER TABLE `user_projects`
    ADD CONSTRAINT `user_projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_projects_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Omezení pro tabulku `risks`
--
ALTER TABLE `risks`
  ADD CONSTRAINT `risks_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `risks_project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `risks_risk_manager_id` FOREIGN KEY (`risk_manager_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
