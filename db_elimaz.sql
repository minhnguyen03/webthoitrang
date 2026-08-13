-- --------------------------------------------------------
-- Máy chủ:                      127.0.0.1
-- Phiên bản máy chủ:            11.5.2-MariaDB - mariadb.org binary distribution
-- HĐH máy chủ:                  Win64
-- HeidiSQL Phiên bản:           12.20.0.7320
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Đang kết xuất đổ cấu trúc cơ sở dữ liệu cho csdl
CREATE DATABASE IF NOT EXISTS `csdl` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `csdl`;

-- Đang kết xuất đổ cấu trúc cho bảng csdl.addresses
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `city` varchar(128) NOT NULL,
  `country` varchar(64) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `district` varchar(128) DEFAULT NULL,
  `is_default` bit(1) NOT NULL,
  `label` varchar(50) DEFAULT NULL,
  `line1` varchar(255) NOT NULL,
  `line2` varchar(255) DEFAULT NULL,
  `phone` varchar(32) NOT NULL,
  `receiver_name` varchar(160) NOT NULL,
  `ward` varchar(128) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`),
  CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.addresses: ~0 rows (xấp xỉ)

-- Đang kết xuất đổ cấu trúc cho bảng csdl.ai_feedback
CREATE TABLE IF NOT EXISTS `ai_feedback` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` text DEFAULT NULL,
  `conversation_id` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `message_id` varchar(255) NOT NULL,
  `rating` enum('NEGATIVE','POSITIVE') NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.ai_feedback: ~0 rows (xấp xỉ)

-- Đang kết xuất đổ cấu trúc cho bảng csdl.audit_logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `action` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `entity_id` bigint(20) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `old_value` text DEFAULT NULL,
  `request_method` varchar(255) DEFAULT NULL,
  `request_url` varchar(255) DEFAULT NULL,
  `resource_id` bigint(20) DEFAULT NULL,
  `resource_type` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.audit_logs: ~114 rows (xấp xỉ)
INSERT INTO `audit_logs` (`id`, `action`, `created_at`, `entity_id`, `entity_type`, `error_message`, `ip_address`, `new_value`, `old_value`, `request_method`, `request_url`, `resource_id`, `resource_type`, `status`, `user_agent`, `user_id`, `username`) VALUES
	(1, 'LOGIN', '2026-07-21 20:43:41.785136', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(2, 'LOGIN', '2026-07-21 20:47:04.553212', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(3, 'LOGIN', '2026-07-21 20:57:05.742405', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(4, 'LOGIN', '2026-07-21 20:59:09.348269', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(5, 'LOGIN', '2026-07-21 21:02:03.227124', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(6, 'LOGIN', '2026-07-21 21:07:47.386683', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(7, 'LOGIN', '2026-07-21 21:13:03.790852', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(8, 'LOGIN', '2026-07-21 21:24:51.867302', NULL, 'User', 'Failed login attempt for: vanquyd6@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(9, 'LOGIN', '2026-07-21 21:25:08.519500', NULL, 'User', 'Failed login attempt for: vanquyd6@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(10, 'REGISTER', '2026-07-21 21:45:17.016906', 6, 'User', NULL, NULL, 'New user registered: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(11, 'LOGIN', '2026-07-21 21:45:59.118480', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(12, 'LOGIN', '2026-07-21 21:47:32.139068', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(13, 'LOGIN', '2026-07-21 21:51:17.357650', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(14, 'LOGIN', '2026-07-21 21:56:01.105170', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(15, 'LOGIN', '2026-07-21 22:37:09.118692', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(16, 'REGISTER', '2026-07-22 09:27:09.827062', 7, 'User', NULL, NULL, 'New user registered: minh@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(17, 'LOGIN', '2026-07-22 10:05:15.580449', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(18, 'DELETE', '2026-07-22 10:32:46.283785', 2, 'Product', NULL, NULL, 'Active: false', 'Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(19, 'DELETE', '2026-07-22 10:51:43.634773', 1, 'Product', NULL, NULL, 'Active: false', 'Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(20, 'DELETE', '2026-07-22 10:51:55.793129', 1, 'Product', NULL, NULL, 'Active: false', 'Active: false', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(21, 'LOGIN', '2026-07-22 12:32:43.854708', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(22, 'LOGIN', '2026-07-22 20:30:06.689116', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(23, 'REGISTER', '2026-07-22 20:31:32.640432', 8, 'User', NULL, NULL, 'New user registered: testadmin@test.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(24, 'LOGIN', '2026-07-22 20:31:33.001002', 8, 'User', NULL, NULL, 'User logged in: testadmin@test.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(25, 'LOGIN', '2026-07-22 20:33:36.423057', 2, 'User', NULL, NULL, 'User logged in: staff@fashion.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(26, 'LOGIN', '2026-07-22 21:09:37.733268', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(27, 'LOGIN', '2026-07-24 22:25:06.221202', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(28, 'LOGIN', '2026-07-26 22:27:00.590744', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(29, 'DELETE', '2026-07-26 22:28:03.256907', 2, 'Product', NULL, NULL, 'Active: false', 'Active: false', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(30, 'LOGIN', '2026-07-27 00:58:09.797701', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(31, 'REGISTER', '2026-08-02 22:32:14.932126', NULL, 'User', 'Phone already exists: 0354978870', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(32, 'REGISTER', '2026-08-02 22:32:24.285615', NULL, 'User', 'Phone already exists: 0766021707', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(33, 'REGISTER', '2026-08-02 22:32:41.114090', 9, 'User', NULL, NULL, 'New user registered: nguyentuanminh280303@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(34, 'LOGIN', '2026-08-02 22:36:23.299237', NULL, 'User', 'Failed login attempt for: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(35, 'LOGIN', '2026-08-02 22:36:27.502234', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(36, 'LOGIN', '2026-08-02 22:52:04.826447', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(37, 'LOGIN', '2026-08-02 23:03:04.322356', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(38, 'LOGIN', '2026-08-04 09:28:13.804545', NULL, 'User', 'Failed login attempt for: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(39, 'LOGIN', '2026-08-04 09:28:20.814152', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(40, 'LOGIN', '2026-08-04 09:32:50.581463', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(41, 'CREATE', '2026-08-04 09:37:32.552632', 1, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-011-VANG-S, Stock: 20', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(42, 'DELETE', '2026-08-04 09:42:31.491413', 1, 'Product', NULL, NULL, 'Active: false', 'Active: false', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(43, 'LOGIN', '2026-08-04 09:44:40.327863', NULL, 'User', 'Failed login attempt for: nguyentuanminh280303@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(44, 'LOGIN', '2026-08-04 09:44:43.463996', 9, 'User', NULL, NULL, 'User logged in: nguyentuanminh280303@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(45, 'UPDATE', '2026-08-04 10:40:50.957324', 1, 'ProductVariant', NULL, NULL, 'SKU: EA26-103-VANG-S, Price: 399, Stock: 20, Active: true', 'SKU: EA26-011-VANG-S, Price: 400.00, Stock: 20, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(46, 'UPDATE', '2026-08-04 10:41:15.971091', 1, 'ProductVariant', NULL, NULL, 'SKU: EA26-103-VANG-S, Price: 399000, Stock: 20, Active: true', 'SKU: EA26-103-VANG-S, Price: 399.00, Stock: 20, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(47, 'CREATE', '2026-08-04 10:41:50.608476', 10, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-103-VANG-M, Stock: 19', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(48, 'CREATE', '2026-08-04 10:44:51.587513', 11, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-104-HONG-S, Stock: 39', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(49, 'CREATE', '2026-08-04 10:45:50.255336', 12, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-104-TIM-S, Stock: 23', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(50, 'UPDATE', '2026-08-04 10:49:25.904079', 10, 'ProductVariant', NULL, NULL, 'SKU: EA26-103-VANG-M, Price: 399000, Stock: 19, Active: true', 'SKU: EA26-103-VANG-M, Price: 399000.00, Stock: 19, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(51, 'UPDATE', '2026-08-04 10:50:20.960347', 10, 'ProductVariant', NULL, NULL, 'SKU: EA26-103-VANG-M, Price: 399000, Stock: 19, Active: true', 'SKU: EA26-103-VANG-M, Price: 399000.00, Stock: 19, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(52, 'LOGIN', '2026-08-04 12:14:12.433632', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(53, 'CREATE', '2026-08-04 12:22:37.261915', 13, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-104-VANG-S, Stock: 10', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(54, 'CREATE', '2026-08-04 13:18:17.981384', 14, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-105, Stock: 30', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(55, 'CREATE', '2026-08-04 13:21:17.652994', 34, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-105-M, Stock: 20', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(56, 'UPDATE', '2026-08-04 13:21:25.087697', 14, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-S, Price: 399000, Stock: 30, Active: true', 'SKU: EA26-105, Price: 399000.00, Stock: 30, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(57, 'CREATE', '2026-08-04 13:23:44.525671', 35, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-105-L, Stock: 30', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(58, 'CREATE', '2026-08-04 13:24:30.544155', 36, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA23-105, Stock: 20', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(59, 'UPDATE', '2026-08-04 13:24:43.994500', 36, 'ProductVariant', NULL, NULL, 'SKU: EA23-105-S, Price: 399000, Stock: 20, Active: true', 'SKU: EA23-105, Price: 399000.00, Stock: 20, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(60, 'UPDATE', '2026-08-04 13:25:35.988483', 36, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-S, Price: 399000, Stock: 20, Active: true', 'SKU: EA23-105-S, Price: 399000.00, Stock: 20, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(61, 'UPDATE', '2026-08-04 13:25:46.393121', 36, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-TRANG-S, Price: 399000, Stock: 20, Active: true', 'SKU: EA23-105-S, Price: 399000.00, Stock: 20, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(62, 'CREATE', '2026-08-04 13:26:12.821196', 39, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-105-TRANG-M, Stock: 15', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(63, 'CREATE', '2026-08-04 13:26:55.917127', 40, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-105-TRANG-L, Stock: 10', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(64, 'LOGIN', '2026-08-06 10:08:13.747283', NULL, 'User', 'Failed login attempt for: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(65, 'LOGIN', '2026-08-06 10:08:16.886334', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(66, 'CREATE', '2026-08-06 10:17:39.430859', 41, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-103-VANG-L, Stock: 2', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(67, 'UPDATE', '2026-08-06 10:17:51.047438', 1, 'ProductVariant', NULL, NULL, 'SKU: EA26-103-VANG-S, Price: 399000, Stock: 4, Active: true', 'SKU: EA26-103-VANG-S, Price: 399000.00, Stock: 20, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(68, 'UPDATE', '2026-08-06 10:18:00.338184', 10, 'ProductVariant', NULL, NULL, 'SKU: EA26-103-VANG-M, Price: 399000, Stock: 8, Active: true', 'SKU: EA26-103-VANG-M, Price: 399000.00, Stock: 19, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(69, 'UPDATE', '2026-08-06 10:19:00.822628', 14, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-DEN-S, Price: 399000, Stock: 13, Active: true', 'SKU: EA26-105-S, Price: 399000.00, Stock: 30, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(70, 'UPDATE', '2026-08-06 10:19:22.498790', 34, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-DEN-M, Price: 399000, Stock: 23, Active: true', 'SKU: EA26-105-M, Price: 399000.00, Stock: 20, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(71, 'UPDATE', '2026-08-06 10:19:41.565285', 35, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-DEN-L, Price: 399000, Stock: 13, Active: true', 'SKU: EA26-105-L, Price: 399000.00, Stock: 30, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(72, 'UPDATE', '2026-08-06 10:20:37.575009', 36, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-TRANG-S, Price: 399000, Stock: 31, Active: true', 'SKU: EA26-105-TRANG-S, Price: 399000.00, Stock: 20, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(73, 'UPDATE', '2026-08-06 10:20:53.409834', 39, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-TRANG-M, Price: 399000, Stock: 58, Active: true', 'SKU: EA26-105-TRANG-M, Price: 399000.00, Stock: 15, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(74, 'UPDATE', '2026-08-06 10:21:10.659628', 40, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-TRANG-L, Price: 399000, Stock: 27, Active: true', 'SKU: EA26-105-TRANG-L, Price: 399000.00, Stock: 10, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(75, 'UPDATE', '2026-08-06 10:21:17.719832', 40, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-TRANG-L, Price: 399000, Stock: 28, Active: true', 'SKU: EA26-105-TRANG-L, Price: 399000.00, Stock: 27, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(76, 'UPDATE', '2026-08-06 10:25:27.733046', 11, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-HONG-S, Price: 399000, Stock: 39, Active: true', 'SKU: EA26-104-HONG-S, Price: 399000.00, Stock: 39, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(77, 'CREATE', '2026-08-06 10:26:41.951983', 42, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-104-HONG-M, Stock: 5', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(78, 'DELETE', '2026-08-06 10:26:51.881635', 13, 'ProductVariant', NULL, NULL, 'Active: false', 'Active: true, Stock: 10', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(79, 'DELETE', '2026-08-06 10:26:54.686282', 12, 'ProductVariant', NULL, NULL, 'Active: false', 'Active: true, Stock: 23', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(80, 'CREATE', '2026-08-06 10:27:17.265910', 43, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-104-HONG-L, Stock: 0', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(81, 'LOGIN', '2026-08-06 10:28:55.376774', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(82, 'CREATE', '2026-08-06 10:49:04.482258', 52, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-104-S, Stock: 3', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(83, 'UPDATE', '2026-08-06 10:49:19.281711', 52, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-TIM-S, Price: 399000, Stock: 3, Active: true', 'SKU: EA26-104-S, Price: 399000.00, Stock: 3, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(84, 'UPDATE', '2026-08-06 10:49:23.850487', 52, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-TIM-S, Price: 399000, Stock: 3, Active: true', 'SKU: EA26-104-S, Price: 399000.00, Stock: 3, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(85, 'CREATE', '2026-08-06 10:50:27.002436', 53, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-104-M, Stock: 4', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(86, 'CREATE', '2026-08-06 10:51:12.303696', 54, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-104-L, Stock: 2', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(87, 'CREATE', '2026-08-06 10:56:03.586490', 57, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-1-YELLOW-S, Stock: 19', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(88, 'UPDATE', '2026-08-06 10:56:20.697460', 57, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-YELLOW-S, Price: 399000, Stock: 19, Active: true', 'SKU: EA26-1-YELLOW-S, Price: 399000.00, Stock: 19, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(89, 'UPDATE', '2026-08-06 10:56:31.428305', 54, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-TIM-L, Price: 399000, Stock: 2, Active: true', 'SKU: EA26-104-L, Price: 399000.00, Stock: 2, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(90, 'UPDATE', '2026-08-06 10:56:44.073646', 53, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-TIM-M, Price: 399000, Stock: 4, Active: true', 'SKU: EA26-104-M, Price: 399000.00, Stock: 4, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(91, 'UPDATE', '2026-08-06 10:56:51.597897', 52, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-TIM-S, Price: 399000, Stock: 3, Active: true', 'SKU: EA26-104-S, Price: 399000.00, Stock: 3, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(92, 'UPDATE', '2026-08-06 10:56:56.095643', 52, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-TIM-S, Price: 399000, Stock: 3, Active: true', 'SKU: EA26-104-S, Price: 399000.00, Stock: 3, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(93, 'UPDATE', '2026-08-06 10:56:57.234083', 52, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-TIM-S, Price: 399000, Stock: 3, Active: true', 'SKU: EA26-104-S, Price: 399000.00, Stock: 3, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(94, 'UPDATE', '2026-08-06 10:56:57.422713', 52, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-TIM-S, Price: 399000, Stock: 3, Active: true', 'SKU: EA26-104-S, Price: 399000.00, Stock: 3, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(95, 'UPDATE', '2026-08-06 10:57:06.453571', 52, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-TIM-S, Price: 399000, Stock: 3, Active: true', 'SKU: EA26-104-S, Price: 399000.00, Stock: 3, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(96, 'UPDATE', '2026-08-06 10:57:25.003538', 52, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-TIM-S, Price: 399000, Stock: 3, Active: true', 'SKU: EA26-104-S, Price: 399000.00, Stock: 3, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(97, 'CREATE', '2026-08-06 11:00:50.393423', 58, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-1-YELLOW-M, Stock: 41', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(98, 'CREATE', '2026-08-06 11:01:32.878683', 59, 'ProductVariant', NULL, NULL, 'Created variant SKU: EA26-1-YELLOW-L, Stock: 19', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(99, 'UPDATE', '2026-08-06 11:01:39.389465', 59, 'ProductVariant', NULL, NULL, 'SKU: EA26-1-YELLOW-L, Price: 399000, Stock: 20, Active: true', 'SKU: EA26-1-YELLOW-L, Price: 399000.00, Stock: 19, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(100, 'UPDATE', '2026-08-06 11:01:39.750004', 59, 'ProductVariant', NULL, NULL, 'SKU: EA26-1-YELLOW-L, Price: 399000, Stock: 20, Active: true', 'SKU: EA26-1-YELLOW-L, Price: 399000.00, Stock: 20, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(101, 'LOGIN', '2026-08-06 14:12:18.782089', 9, 'User', NULL, NULL, 'User logged in: nguyentuanminh280303@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(102, 'CREATE', '2026-08-06 14:28:06.287439', 13, 'Order', NULL, NULL, 'Created order: ORD-20260806142806-81EC, Total: 399000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(103, 'LOGIN', '2026-08-07 14:26:25.668018', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(104, 'UPDATE', '2026-08-07 14:27:24.160163', 14, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-DEN-S, Price: 399000, Stock: 13, Active: true', 'SKU: EA26-105-DEN-S, Price: 399000.00, Stock: 13, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(105, 'UPDATE', '2026-08-07 14:36:39.514461', 57, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-VANG-S, Price: 399000, Stock: 19, Active: true', 'SKU: EA26-104-YELLOW-S, Price: 399000.00, Stock: 19, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(106, 'UPDATE', '2026-08-07 14:36:42.702886', 57, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-VANG-S, Price: 399000, Stock: 19, Active: true', 'SKU: EA26-104-YELLOW-S, Price: 399000.00, Stock: 19, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(107, 'UPDATE', '2026-08-07 14:36:55.896038', 57, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-YELLOW-S, Price: 399000, Stock: 19, Active: true', 'SKU: EA26-104-YELLOW-S, Price: 399000.00, Stock: 19, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(108, 'UPDATE', '2026-08-07 14:37:47.779074', 11, 'ProductVariant', NULL, NULL, 'SKU: EA26-1-PINK-1, Price: 399000, Stock: 39, Active: true', 'SKU: EA26-104-HONG-S, Price: 399000.00, Stock: 39, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(109, 'UPDATE', '2026-08-07 14:38:05.951515', 11, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-PINK-1, Price: 399000, Stock: 39, Active: true', 'SKU: EA26-1-PINK-1, Price: 399000.00, Stock: 39, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(110, 'UPDATE', '2026-08-07 14:38:12.045785', 11, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-PINK-S, Price: 399000, Stock: 39, Active: true', 'SKU: EA26-104-PINK-1, Price: 399000.00, Stock: 39, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(111, 'UPDATE', '2026-08-07 14:38:27.815864', 42, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-PINK-M, Price: 399000, Stock: 5, Active: true', 'SKU: EA26-104-HONG-M, Price: 399000.00, Stock: 5, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(112, 'UPDATE', '2026-08-07 14:38:47.954858', 43, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-PINK-L, Price: 399000, Stock: 0, Active: true', 'SKU: EA26-104-HONG-L, Price: 399000.00, Stock: 0, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(113, 'UPDATE', '2026-08-07 14:39:03.695483', 52, 'ProductVariant', NULL, NULL, 'SKU: EA26-104-PURPLE-S, Price: 399000, Stock: 3, Active: true', 'SKU: EA26-104-S, Price: 399000.00, Stock: 3, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(114, 'UPDATE', '2026-08-07 15:09:11.035773', 14, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-DEN-S, Price: 399000, Stock: 13, Active: true', 'SKU: EA26-105-DEN-S, Price: 399000.00, Stock: 13, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(115, 'UPDATE', '2026-08-07 15:09:19.171873', 34, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-DEN-M, Price: 399000, Stock: 23, Active: true', 'SKU: EA26-105-DEN-M, Price: 399000.00, Stock: 23, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(116, 'UPDATE', '2026-08-07 15:09:26.366634', 35, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-DEN-L, Price: 399000, Stock: 13, Active: true', 'SKU: EA26-105-DEN-L, Price: 399000.00, Stock: 13, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(117, 'UPDATE', '2026-08-07 15:09:39.728721', 36, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-TRANG-S, Price: 399000, Stock: 31, Active: true', 'SKU: EA26-105-TRANG-S, Price: 399000.00, Stock: 31, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(118, 'UPDATE', '2026-08-07 15:09:45.544756', 39, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-TRANG-M, Price: 399000, Stock: 57, Active: true', 'SKU: EA26-105-TRANG-M, Price: 399000.00, Stock: 57, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(119, 'UPDATE', '2026-08-07 15:09:52.241923', 40, 'ProductVariant', NULL, NULL, 'SKU: EA26-105-TRANG-L, Price: 399000, Stock: 28, Active: true', 'SKU: EA26-105-TRANG-L, Price: 399000.00, Stock: 28, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(120, 'LOGIN', '2026-08-10 09:36:12.126472', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(121, 'LOGIN', '2026-08-10 09:48:03.244341', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(122, 'LOGIN', '2026-08-10 09:53:02.908538', 6, 'User', NULL, NULL, 'User logged in: minhdzvkl203@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(123, 'LOGIN', '2026-08-10 10:04:40.137178', 9, 'User', NULL, NULL, 'User logged in: nguyentuanminh280303@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(124, 'LOGIN', '2026-08-10 10:06:23.238268', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(125, 'LOGIN', '2026-08-10 10:06:59.480300', NULL, 'User', 'Failed login attempt for: admin@fashion.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(126, 'LOGIN', '2026-08-10 10:07:05.708901', 3, 'User', NULL, NULL, 'User logged in: customer@fashion.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(127, 'LOGIN', '2026-08-10 10:07:05.838892', 2, 'User', NULL, NULL, 'User logged in: staff@fashion.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(128, 'LOGIN', '2026-08-10 10:07:34.074600', 3, 'User', NULL, NULL, 'User logged in: customer@fashion.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(129, 'LOGIN', '2026-08-10 10:07:41.690895', 3, 'User', NULL, NULL, 'User logged in: customer@fashion.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(130, 'LOGIN', '2026-08-10 10:08:15.086882', 3, 'User', NULL, NULL, 'User logged in: customer@fashion.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(131, 'CREATE', '2026-08-10 10:08:15.175434', 20, 'Order', NULL, NULL, 'Created order: ORD-20260810100815-1066, Total: 399000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(132, 'CREATE', '2026-08-10 10:58:26.403933', 25, 'Order', NULL, NULL, 'Created order: ORD-20260810105826-A2E1, Total: 399000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(500) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoce3937d2f4mpfqrycbr0l93m` (`name`),
  UNIQUE KEY `UKpnhnc9urm6fro7oseu9vka70q` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.brands: ~0 rows (xấp xỉ)

-- Đang kết xuất đổ cấu trúc cho bảng csdl.cart_items
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `added_at` datetime(6) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `cart_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnu5ubwpsshgdbogmqp78tg6ej` (`cart_id`,`variant_id`),
  KEY `FK5yyw1o0dor9gmxfra1dqvn4qa` (`variant_id`),
  CONSTRAINT `FK5yyw1o0dor9gmxfra1dqvn4qa` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.cart_items: ~1 rows (xấp xỉ)
INSERT INTO `cart_items` (`id`, `added_at`, `quantity`, `cart_id`, `variant_id`) VALUES
	(3, '2026-08-06 14:12:18.963318', 1, 7, 34);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.carts
CREATE TABLE IF NOT EXISTS `carts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `customer_user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKon5vdk2dt1srt0ml3fnmeo7np` (`customer_user_id`),
  CONSTRAINT `FKh5jj49nfb6tq5mt7iug5xrilk` FOREIGN KEY (`customer_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.carts: ~5 rows (xấp xỉ)
INSERT INTO `carts` (`id`, `created_at`, `updated_at`, `customer_user_id`) VALUES
	(1, '2026-07-21 20:39:37.455180', '2026-07-21 20:39:37.455180', 3),
	(4, '2026-07-21 21:45:16.948053', '2026-07-21 21:45:16.948053', 6),
	(5, '2026-07-22 09:27:09.721356', '2026-07-22 09:27:09.721356', 7),
	(6, '2026-07-22 20:31:32.440040', '2026-07-22 20:31:32.440040', 8),
	(7, '2026-08-02 22:32:40.983203', '2026-08-02 22:32:40.983203', 9);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoul14ho7bctbefv8jywp5v3i2` (`slug`),
  KEY `FKsaok720gsu4u2wrgbk10b5n8d` (`parent_id`),
  CONSTRAINT `FKsaok720gsu4u2wrgbk10b5n8d` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.categories: ~3 rows (xấp xỉ)
INSERT INTO `categories` (`id`, `description`, `image`, `is_active`, `name`, `slug`, `parent_id`) VALUES
	(1, 'Thiết kế áo sơ mi thanh lịch cho mọi dịp', NULL, b'1', 'Áo sơ mi', 'ao-so-mi', NULL),
	(2, 'Chân váy thời trang nữ tính và hiện đại', NULL, b'1', 'Chân váy', 'chan-vay', NULL),
	(3, 'Set đồ bộ phối sẵn, mặc là đẹp', NULL, b'1', 'Set bộ', 'set-bo', NULL);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.colors
CREATE TABLE IF NOT EXISTS `colors` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `hex` varchar(7) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkfulqa7c70otb7t3uwkgcpy43` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.colors: ~11 rows (xấp xỉ)
INSERT INTO `colors` (`id`, `hex`, `is_active`, `name`) VALUES
	(1, '#fbbf24', b'1', 'Vàng'),
	(4, '#ef4444', b'1', 'Đỏ'),
	(6, '#000000', b'1', 'white'),
	(7, '#000000', b'1', 'red'),
	(8, '#000000', b'1', 'black'),
	(9, '#000000', b'1', 'blue'),
	(10, '#000000', b'1', 'pink'),
	(11, '#000000', b'1', 'Tím'),
	(14, '#ec4899', b'1', 'Hồng'),
	(15, '#111827', b'1', 'Đen'),
	(16, '#f9fafb', b'1', 'Trắng');

-- Đang kết xuất đổ cấu trúc cho bảng csdl.coupons
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(40) NOT NULL,
  `end_at` datetime(6) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `max_discount` decimal(10,2) DEFAULT NULL,
  `min_order_amount` decimal(12,2) DEFAULT NULL,
  `per_user_limit` int(11) DEFAULT NULL,
  `start_at` datetime(6) NOT NULL,
  `type` enum('FIXED','PERCENT') NOT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `created_by` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKeplt0kkm9yf2of2lnx6c1oy9b` (`code`),
  KEY `FK5ta2iuowjf2sx01vtu35oi2an` (`created_by`),
  CONSTRAINT `FK5ta2iuowjf2sx01vtu35oi2an` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.coupons: ~0 rows (xấp xỉ)

-- Đang kết xuất đổ cấu trúc cho bảng csdl.customer_profiles
CREATE TABLE IF NOT EXISTS `customer_profiles` (
  `user_id` bigint(20) NOT NULL,
  `birthday` date DEFAULT NULL,
  `gender` enum('FEMALE','MALE','OTHER') DEFAULT NULL,
  `loyalty_point` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `FK69orkdj1un5rh845ngvvmd1xs` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.customer_profiles: ~2 rows (xấp xỉ)
INSERT INTO `customer_profiles` (`user_id`, `birthday`, `gender`, `loyalty_point`) VALUES
	(3, '1998-01-01', 'OTHER', 0),
	(6, NULL, NULL, 0),
	(7, NULL, NULL, 0),
	(8, NULL, NULL, 0),
	(9, NULL, NULL, 0);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.employee_profiles
CREATE TABLE IF NOT EXISTS `employee_profiles` (
  `user_id` bigint(20) NOT NULL,
  `employee_code` varchar(50) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `manager_user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UKo5scj9se5eonxgnurwabuo2rh` (`employee_code`),
  KEY `FKtffrvjyu4jp6eks8kga7rgjri` (`manager_user_id`),
  CONSTRAINT `FKeotvdthm6gd1pavuhb075uocm` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKtffrvjyu4jp6eks8kga7rgjri` FOREIGN KEY (`manager_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.employee_profiles: ~2 rows (xấp xỉ)
INSERT INTO `employee_profiles` (`user_id`, `employee_code`, `hire_date`, `position`, `manager_user_id`) VALUES
	(1, 'ADM-001', '2026-07-21', 'Administrator', NULL),
	(2, 'STF-001', '2026-07-21', 'Operations Staff', NULL);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.inventory_movements
CREATE TABLE IF NOT EXISTS `inventory_movements` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `reason` enum('ADJUST','PURCHASE','RETURN','SALE') NOT NULL,
  `created_by` bigint(20) DEFAULT NULL,
  `related_order_id` bigint(20) DEFAULT NULL,
  `variant_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKo5wo5rt3i3bvxti09ohclqs06` (`created_by`),
  KEY `FKitkohoiacbdhpt7uotdf0hga2` (`related_order_id`),
  KEY `FK52v4o49rlyvhrcxntwrf7k79t` (`variant_id`),
  CONSTRAINT `FK52v4o49rlyvhrcxntwrf7k79t` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `FKitkohoiacbdhpt7uotdf0hga2` FOREIGN KEY (`related_order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKo5wo5rt3i3bvxti09ohclqs06` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.inventory_movements: ~2 rows (xấp xỉ)
INSERT INTO `inventory_movements` (`id`, `created_at`, `note`, `quantity`, `reason`, `created_by`, `related_order_id`, `variant_id`) VALUES
	(13, '2026-08-06 14:28:06.266696', 'Order: ORD-20260806142806-81EC', -1, 'SALE', 6, 13, 39),
	(20, '2026-08-10 10:08:15.161429', 'Order: ORD-20260810100815-1066', -1, 'SALE', 3, 20, 14),
	(25, '2026-08-10 10:58:26.381775', 'Order: ORD-20260810105826-A2E1', -1, 'SALE', 6, 25, 35);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `color_name` varchar(60) DEFAULT NULL,
  `discount_amount` decimal(12,2) NOT NULL,
  `line_total` decimal(12,2) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `quantity` int(11) NOT NULL,
  `size_name` varchar(32) DEFAULT NULL,
  `sku` varchar(64) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  KEY `FKocimc7dtr037rh4ls4l95nlfi` (`product_id`),
  KEY `FKemq71edpbn9wsxnxncfn1algp` (`variant_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKemq71edpbn9wsxnxncfn1algp` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `FKocimc7dtr037rh4ls4l95nlfi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.order_items: ~2 rows (xấp xỉ)
INSERT INTO `order_items` (`id`, `color_name`, `discount_amount`, `line_total`, `product_name`, `quantity`, `size_name`, `sku`, `unit_price`, `order_id`, `product_id`, `variant_id`) VALUES
	(13, 'blue', 0.00, 399000.00, 'Sơ mì dài tay cổ Đức', 1, 'M', 'EA26-105-TRANG-M', 399000.00, 13, 3, 39),
	(20, 'Đen', 0.00, 399000.00, 'Sơ mì dài tay cổ Đức', 1, 'S', 'EA26-105-DEN-S', 399000.00, 20, 3, 14),
	(25, 'Đen', 0.00, 399000.00, 'Sơ mì dài tay cổ Đức', 1, 'L', 'EA26-105-DEN-L', 399000.00, 25, 3, 35);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(40) NOT NULL,
  `coupon_code` varchar(40) DEFAULT NULL,
  `discount_total` decimal(12,2) NOT NULL,
  `grand_total` decimal(12,2) NOT NULL,
  `loyalty_points_earned` int(11) NOT NULL,
  `loyalty_points_used` int(11) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `payment_method` enum('COD','MOMO','VNPAY','ZALOPAY') NOT NULL,
  `payment_status` enum('FAILED','PAID','REFUNDED','UNPAID') NOT NULL,
  `payment_time` datetime(6) DEFAULT NULL,
  `payment_transaction_id` varchar(100) DEFAULT NULL,
  `placed_at` datetime(6) DEFAULT NULL,
  `ship_city` varchar(128) NOT NULL,
  `ship_country` varchar(64) NOT NULL,
  `ship_district` varchar(128) DEFAULT NULL,
  `ship_line1` varchar(255) NOT NULL,
  `ship_line2` varchar(255) DEFAULT NULL,
  `ship_name` varchar(160) NOT NULL,
  `ship_phone` varchar(32) NOT NULL,
  `ship_ward` varchar(128) DEFAULT NULL,
  `shipping_fee` decimal(12,2) NOT NULL,
  `status` enum('CANCELLED','COMPLETED','CONFIRMED','PACKING','PENDING','REFUNDED','SHIPPING') NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `tax_total` decimal(12,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `customer_user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKgt3o4a5bqj59e9y6wakgk926t` (`code`),
  KEY `FKnr2jtai5a4jbute3j4rh49ggi` (`customer_user_id`),
  CONSTRAINT `FKnr2jtai5a4jbute3j4rh49ggi` FOREIGN KEY (`customer_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.orders: ~2 rows (xấp xỉ)
INSERT INTO `orders` (`id`, `code`, `coupon_code`, `discount_total`, `grand_total`, `loyalty_points_earned`, `loyalty_points_used`, `note`, `payment_method`, `payment_status`, `payment_time`, `payment_transaction_id`, `placed_at`, `ship_city`, `ship_country`, `ship_district`, `ship_line1`, `ship_line2`, `ship_name`, `ship_phone`, `ship_ward`, `shipping_fee`, `status`, `subtotal`, `tax_total`, `updated_at`, `customer_user_id`) VALUES
	(13, 'ORD-20260806142806-81EC', NULL, 0.00, 399000.00, 7, 0, '', 'VNPAY', 'UNPAID', NULL, NULL, '2026-08-06 14:28:06.264747', 'TP. Hồ Chí Minh', 'Vietnam', 'gsdfgdfgd', 'fdssfd', '', 'nguyen tuan minh', '0354978870', 'dfsadfsd', 0.00, 'PENDING', 399000.00, 0.00, '2026-08-06 14:28:06.264747', 6),
	(20, 'ORD-20260810100815-1066', NULL, 0.00, 399000.00, 7, 0, '', 'VNPAY', 'UNPAID', NULL, NULL, '2026-08-10 10:08:15.155426', 'Ho Chi Minh', 'Vietnam', NULL, '123 Duong ABC', NULL, 'Nguyen Van A', '0901234567', NULL, 0.00, 'PENDING', 399000.00, 0.00, '2026-08-10 10:08:15.155426', 3),
	(25, 'ORD-20260810105826-A2E1', NULL, 0.00, 399000.00, 7, 0, '', 'COD', 'UNPAID', NULL, NULL, '2026-08-10 10:58:26.343289', 'TP. Hồ Chí Minh', 'Vietnam', 'cau giay', 'nghia tan', '', 'nguyen tuan minh', '0354978870', 'nghia do', 0.00, 'PENDING', 399000.00, 0.00, '2026-08-10 10:58:26.343289', 6);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK71lqwbwtklmljk3qlsugr1mig` (`token`),
  KEY `FKk3ndxg5xp6v7wd4gjyusp15gq` (`user_id`),
  CONSTRAINT `FKk3ndxg5xp6v7wd4gjyusp15gq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.password_reset_tokens: ~0 rows (xấp xỉ)

-- Đang kết xuất đổ cấu trúc cho bảng csdl.payment_transactions
CREATE TABLE IF NOT EXISTS `payment_transactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `amount` decimal(12,2) NOT NULL,
  `bank_code` varchar(20) DEFAULT NULL,
  `bank_tran_no` varchar(100) DEFAULT NULL,
  `card_type` varchar(20) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `order_info` text DEFAULT NULL,
  `pay_date` varchar(20) DEFAULT NULL,
  `payment_method` enum('COD','MOMO','VNPAY','ZALOPAY') NOT NULL,
  `raw_data` text DEFAULT NULL,
  `response_code` varchar(10) DEFAULT NULL,
  `secure_hash` text DEFAULT NULL,
  `status` enum('CANCELLED','FAILED','PENDING','REFUNDED','SUCCESS') NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `transaction_type` varchar(50) DEFAULT NULL,
  `txn_ref` varchar(100) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `order_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKnsous9qyrjv5ss8que6o6617` (`order_id`),
  CONSTRAINT `FKnsous9qyrjv5ss8que6o6617` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.payment_transactions: ~0 rows (xấp xỉ)

-- Đang kết xuất đổ cấu trúc cho bảng csdl.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `bank_code` varchar(255) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `payment_info` mediumtext DEFAULT NULL,
  `payment_method` varchar(255) NOT NULL,
  `response_code` varchar(255) DEFAULT NULL,
  `status` enum('CANCELLED','COMPLETED','FAILED','PENDING','REFUNDED') NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `order_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK81gagumt0r8y3rmudcgpbk42l` (`order_id`),
  CONSTRAINT `FK81gagumt0r8y3rmudcgpbk42l` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.payments: ~0 rows (xấp xỉ)
INSERT INTO `payments` (`id`, `amount`, `bank_code`, `completed_at`, `created_at`, `payment_info`, `payment_method`, `response_code`, `status`, `transaction_id`, `order_id`) VALUES
	(1, 399000, NULL, NULL, '2026-08-10 10:58:26.378774', 'Thanh toán khi nhận hàng', 'COD', NULL, 'PENDING', NULL, 25);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(128) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK7lcb6glmvwlro3p2w2cewxtvd` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.permissions: ~10 rows (xấp xỉ)
INSERT INTO `permissions` (`id`, `code`, `description`, `name`) VALUES
	(1, 'PRODUCT_CREATE', NULL, 'Tao san pham'),
	(2, 'PRODUCT_UPDATE', NULL, 'Sua san pham'),
	(3, 'PRODUCT_DELETE', NULL, 'Xoa san pham'),
	(4, 'PRODUCT_VIEW', NULL, 'Xem san pham'),
	(5, 'ORDER_VIEW', NULL, 'Xem don hang'),
	(6, 'ORDER_UPDATE', NULL, 'Cap nhat don hang'),
	(7, 'ORDER_DELETE', NULL, 'Xoa don hang'),
	(8, 'COUPON_MANAGE', NULL, 'Quan ly ma giam gia'),
	(9, 'USER_MANAGE', NULL, 'Quan ly nguoi dung'),
	(10, 'ROLE_MANAGE', NULL, 'Quan ly vai tro');

-- Đang kết xuất đổ cấu trúc cho bảng csdl.product_categories
CREATE TABLE IF NOT EXISTS `product_categories` (
  `product_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `FKd112rx0alycddsms029iifrih` (`category_id`),
  CONSTRAINT `FKd112rx0alycddsms029iifrih` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `FKlda9rad6s180ha3dl1ncsp8n7` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.product_categories: ~3 rows (xấp xỉ)
INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES
	(1, 1),
	(2, 1),
	(3, 1);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.product_images
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `alt_text` varchar(200) DEFAULT NULL,
  `sort_order` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqnq71xsohugpqwf3c9gxmsuy` (`product_id`),
  KEY `FKqnqjv00ocaxfmu2k6b99ycdad` (`variant_id`),
  CONSTRAINT `FKqnq71xsohugpqwf3c9gxmsuy` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKqnqjv00ocaxfmu2k6b99ycdad` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.product_images: ~6 rows (xấp xỉ)
INSERT INTO `product_images` (`id`, `alt_text`, `sort_order`, `url`, `product_id`, `variant_id`) VALUES
	(6, 'EA26.103', 0, '/image/f420c98c-8af6-48fd-b249-0936d73f3210.jpg', 2, NULL),
	(8, 'EA26.123', 0, '/image/2e47ce8b-913c-4bd8-b1dc-91a1af3d3e51.jpg', 1, NULL),
	(9, 'EA26.123', 1, '/image/cf76670b-afd1-40ce-b710-6d688f19f1f7.jpg', 1, NULL),
	(12, 'EA26.104', 2, '/image/2190e2a3-fcaf-4f42-a79a-bbc4879eed90.jpg', 1, NULL),
	(13, 'EA26.105', 0, '/image/385db52f-228e-4bd6-819e-70e2e2987576.jpg', 3, NULL),
	(14, 'EA26.105', 1, '/image/2399eefb-b4d0-4e86-9dd7-1f57b1a3084e.jpg', 3, NULL);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.product_reviews
CREATE TABLE IF NOT EXISTS `product_reviews` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` text DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `is_approved` bit(1) NOT NULL,
  `rating` int(11) NOT NULL,
  `title` varchar(150) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKi8pvlswx9d9ul91orv429gxf` (`product_id`,`user_id`),
  KEY `FK58i39bhws2hss3tbcvdmrm60f` (`user_id`),
  CONSTRAINT `FK35kxxqe2g9r4mww80w9e3tnw9` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FK58i39bhws2hss3tbcvdmrm60f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.product_reviews: ~0 rows (xấp xỉ)

-- Đang kết xuất đổ cấu trúc cho bảng csdl.product_variants
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `barcode` varchar(64) DEFAULT NULL,
  `compare_at_price` decimal(12,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `sku` varchar(64) NOT NULL,
  `stock` int(11) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `weight_gram` int(11) DEFAULT NULL,
  `color_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `size_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKq935p2d1pbjm39n0063ghnfgn` (`sku`),
  KEY `FKnps1p21p470pq59fdj0ddwnrs` (`color_id`),
  KEY `FKosqitn4s405cynmhb87lkvuau` (`product_id`),
  KEY `FKt7j608wes333gojuoh0f8l488` (`size_id`),
  CONSTRAINT `FKnps1p21p470pq59fdj0ddwnrs` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`),
  CONSTRAINT `FKosqitn4s405cynmhb87lkvuau` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKt7j608wes333gojuoh0f8l488` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.product_variants: ~20 rows (xấp xỉ)
INSERT INTO `product_variants` (`id`, `barcode`, `compare_at_price`, `created_at`, `is_active`, `price`, `sku`, `stock`, `updated_at`, `weight_gram`, `color_id`, `product_id`, `size_id`) VALUES
	(1, '', NULL, '2026-08-04 09:37:32.407294', b'1', 399000.00, 'EA26-103-VANG-S', 4, '2026-08-06 10:17:51.046173', NULL, 1, 2, 1),
	(10, '', NULL, '2026-08-04 10:41:50.604293', b'1', 399000.00, 'EA26-103-VANG-M', 8, '2026-08-06 10:18:00.337188', NULL, 1, 2, 6),
	(11, '', NULL, '2026-08-04 10:44:51.577074', b'1', 399000.00, 'EA26-104-PINK-S', 39, '2026-08-07 14:38:12.045785', NULL, 14, 1, 1),
	(12, '', NULL, '2026-08-04 10:45:50.251220', b'0', 399000.00, 'EA26-104-TIM-S', 23, '2026-08-06 10:26:54.685776', NULL, 8, 1, 1),
	(13, '', NULL, '2026-08-04 12:22:37.248826', b'0', 399000.00, 'EA26-104-VANG-S', 10, '2026-08-06 10:26:51.880635', NULL, 1, 1, 1),
	(14, '', NULL, '2026-08-04 13:18:17.959300', b'1', 399000.00, 'EA26-105-DEN-S', 12, '2026-08-10 10:08:15.149330', NULL, 15, 3, 1),
	(34, '', NULL, '2026-08-04 13:21:17.648156', b'1', 399000.00, 'EA26-105-DEN-M', 23, '2026-08-07 15:09:19.171873', NULL, 15, 3, 6),
	(35, '', NULL, '2026-08-04 13:23:44.522955', b'1', 399000.00, 'EA26-105-DEN-L', 12, '2026-08-10 10:58:26.330551', NULL, 15, 3, 7),
	(36, '', NULL, '2026-08-04 13:24:30.541429', b'1', 399000.00, 'EA26-105-TRANG-S', 31, '2026-08-07 15:09:39.728721', NULL, 16, 3, 1),
	(39, '', NULL, '2026-08-04 13:26:12.817637', b'1', 399000.00, 'EA26-105-TRANG-M', 57, '2026-08-07 15:09:45.544756', NULL, 16, 3, 6),
	(40, '', NULL, '2026-08-04 13:26:55.911248', b'1', 399000.00, 'EA26-105-TRANG-L', 28, '2026-08-07 15:09:52.241923', NULL, 16, 3, 7),
	(41, '', NULL, '2026-08-06 10:17:39.419601', b'1', 399000.00, 'EA26-103-VANG-L', 2, '2026-08-06 10:17:39.419601', NULL, 1, 2, 7),
	(42, '', NULL, '2026-08-06 10:26:41.947984', b'1', 399000.00, 'EA26-104-PINK-M', 5, '2026-08-07 14:38:27.815864', NULL, 14, 1, 6),
	(43, '', NULL, '2026-08-06 10:27:17.263397', b'1', 399000.00, 'EA26-104-PINK-L', 0, '2026-08-07 14:38:47.954858', NULL, 14, 1, 7),
	(52, '', NULL, '2026-08-06 10:49:04.453580', b'1', 399000.00, 'EA26-104-PURPLE-S', 3, '2026-08-07 14:39:03.695483', NULL, 11, 1, 1),
	(53, '', NULL, '2026-08-06 10:50:26.997437', b'1', 399000.00, 'EA26-104-TIM-M', 4, '2026-08-06 10:56:44.072639', NULL, 11, 1, 6),
	(54, '', NULL, '2026-08-06 10:51:12.300487', b'1', 399000.00, 'EA26-104-TIM-L', 2, '2026-08-06 10:56:31.435902', NULL, 11, 1, 7),
	(57, '', NULL, '2026-08-06 10:56:03.573504', b'1', 399000.00, 'EA26-104-YELLOW-S', 19, '2026-08-06 10:56:20.697460', NULL, 1, 1, 1),
	(58, '', NULL, '2026-08-06 11:00:50.387910', b'1', 399000.00, 'EA26-1-YELLOW-M', 41, '2026-08-06 11:00:50.387910', NULL, 1, 1, 6),
	(59, '', NULL, '2026-08-06 11:01:32.875687', b'1', 399000.00, 'EA26-1-YELLOW-L', 20, '2026-08-06 11:01:39.389465', NULL, 1, 1, 7);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `material` varchar(120) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `origin` varchar(120) DEFAULT NULL,
  `slug` varchar(220) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `brand_id` bigint(20) DEFAULT NULL,
  `created_by` bigint(20) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKostq1ec3toafnjok09y9l7dox` (`slug`),
  KEY `FKa3a4mpsfdf4d2y6r8ra3sc8mv` (`brand_id`),
  KEY `FKl0lce8i162ldn9n01t2a6lcix` (`created_by`),
  KEY `FKdeswm6d74skv6do803axl6edj` (`updated_by`),
  CONSTRAINT `FKa3a4mpsfdf4d2y6r8ra3sc8mv` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  CONSTRAINT `FKdeswm6d74skv6do803axl6edj` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKl0lce8i162ldn9n01t2a6lcix` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.products: ~3 rows (xấp xỉ)
INSERT INTO `products` (`id`, `created_at`, `description`, `is_active`, `material`, `name`, `origin`, `slug`, `updated_at`, `brand_id`, `created_by`, `updated_by`) VALUES
	(1, '2026-07-22 10:21:02.946328', '', b'1', 'vải', 'Sơ mì dài tay cổ Đức họa tiết', 'Việt Nam', 'EA26.104', '2026-08-06 11:01:39.389465', NULL, 6, 6),
	(2, '2026-07-22 10:23:41.413628', '', b'1', '', 'Sơ mì dài tay cổ Đức', '', 'EA26.103', '2026-08-06 10:17:51.046173', NULL, 6, 6),
	(3, '2026-08-04 12:25:16.989248', '', b'1', 'vải mát', 'Sơ mì dài tay cổ Đức', 'Việt Nam', 'EA26.105', '2026-08-06 10:19:00.821633', NULL, 6, 6);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.refresh_tokens
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `token` varchar(500) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKghpmfn23vmxfu3spu3lfg4r2d` (`token`),
  KEY `FK1lih5y2npsf8u5o3vhdb9y0os` (`user_id`),
  CONSTRAINT `FK1lih5y2npsf8u5o3vhdb9y0os` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.refresh_tokens: ~6 rows (xấp xỉ)
INSERT INTO `refresh_tokens` (`id`, `created_at`, `expires_at`, `token`, `user_id`) VALUES
	(4, '2026-07-22 09:27:09.808911', '2026-07-29 09:27:09.807911', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtaW5oQGdtYWlsLmNvbSIsImlhdCI6MTc4NDY4NzIyOSwiZXhwIjoxNzg1MjkyMDI5fQ.u0mA2uBVDZHdBzEZJ18iWZaR8GtrU_Qw5JlWunAH46TzFP9Ug1Jb4rlwai2cDPUBjbIF9p53TUq1YFUPJNxL3g', 7),
	(8, '2026-07-22 20:31:32.983240', '2026-07-29 20:31:32.982237', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0YWRtaW5AdGVzdC5jb20iLCJpYXQiOjE3ODQ3MjcwOTIsImV4cCI6MTc4NTMzMTg5Mn0.85ewSv9Gm5dbvhbhT4BEITnQpuQGg1p8ldJlc4Rni55dqiQD-XQLbRFVt1-TjalJr73_jwIKKpneCZMEYwkOkQ', 8),
	(28, '2026-08-10 09:53:02.876261', '2026-08-17 09:53:02.873252', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtaW5oZHp2a2wyMDNAZ21haWwuY29tIiwiaWF0IjoxNzg2MzMwMzgyLCJleHAiOjE3ODY5MzUxODJ9.i4PTidhvQYV9gEtyV8Ur3WiaenTYjiB5ZM8HUA0QuBWZdrWjCGRaoguN0HZpOYAhDX1x-nor2k4R5PGVP2X9yg', 6),
	(29, '2026-08-10 10:04:40.106016', '2026-08-17 10:04:40.105011', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuZ3V5ZW50dWFubWluaDI4MDMwM0BnbWFpbC5jb20iLCJpYXQiOjE3ODYzMzEwODAsImV4cCI6MTc4NjkzNTg4MH0._e4JW4QHW26hPovj0q0peNUZiSTxmUoNGcNk1eHp7kYVbN1yLRY7C6O-vEJYT6Wqn0h3Aqz61nG3XK0FnOmDlA', 9),
	(31, '2026-08-10 10:07:05.834892', '2026-08-17 10:07:05.834892', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdGFmZkBmYXNoaW9uLmNvbSIsImlhdCI6MTc4NjMzMTIyNSwiZXhwIjoxNzg2OTM2MDI1fQ.jdWGGXG4qXam77y5HbBq7JjcBpNUylyIuMhkql-Ra_yamdVn6rQMBnj_lyZJD12E1Na7MUbiEL3hEj4lxQsePA', 2),
	(34, '2026-08-10 10:08:15.082888', '2026-08-17 10:08:15.082888', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjdXN0b21lckBmYXNoaW9uLmNvbSIsImlhdCI6MTc4NjMzMTI5NSwiZXhwIjoxNzg2OTM2MDk1fQ.R2lX9IqdAzlrrhs6LHZQK00rTpT8L8UvVlGcOcaT8PehM8CrhV9CGrsPNPpyYqEG4_6PMiZqwwhwhvQubIK5nA', 3);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.role_permissions
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` bigint(20) NOT NULL,
  `permission_id` bigint(20) NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `FKegdk29eiy7mdtefy5c7eirr6e` (`permission_id`),
  CONSTRAINT `FKegdk29eiy7mdtefy5c7eirr6e` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `FKn5fotdgk8d1xvo8nav9uv3muc` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.role_permissions: ~17 rows (xấp xỉ)
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
	(1, 1),
	(1, 2),
	(1, 3),
	(1, 4),
	(1, 5),
	(1, 6),
	(1, 7),
	(1, 8),
	(1, 9),
	(1, 10),
	(2, 1),
	(2, 2),
	(2, 3),
	(2, 4),
	(3, 4),
	(3, 5),
	(3, 6);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(64) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKch1113horj4qr56f91omojv8` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.roles: ~4 rows (xấp xỉ)
INSERT INTO `roles` (`id`, `code`, `created_at`, `description`, `name`) VALUES
	(1, 'ADMIN', '2026-07-21 20:39:37.043033', 'Co toan quyen tren he thong', 'Quan ly toan quyen'),
	(2, 'STAFF_PRODUCT', '2026-07-21 20:39:37.077315', 'Quan ly san pham va ton kho', 'Nhan vien san pham'),
	(3, 'STAFF_SALES', '2026-07-21 20:39:37.092956', 'Xu ly don hang va cham soc khach hang', 'Nhan vien ban hang'),
	(4, 'CUSTOMER', '2026-07-21 20:39:37.097786', 'Khach hang mua sam', 'Khach hang');

-- Đang kết xuất đổ cấu trúc cho bảng csdl.shipments
CREATE TABLE IF NOT EXISTS `shipments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `carrier` varchar(100) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `delivered_at` datetime(6) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `shipped_at` datetime(6) DEFAULT NULL,
  `status` enum('CANCELLED','DELIVERED','IN_TRANSIT','LOST','PICKED','READY','RETURNED') NOT NULL,
  `tracking_number` varchar(120) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `order_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrnt4wht95lxxplspltrg9681s` (`order_id`),
  CONSTRAINT `FKrnt4wht95lxxplspltrg9681s` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.shipments: ~0 rows (xấp xỉ)

-- Đang kết xuất đổ cấu trúc cho bảng csdl.sizes
CREATE TABLE IF NOT EXISTS `sizes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `is_active` bit(1) DEFAULT NULL,
  `name` varchar(32) NOT NULL,
  `note` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKrmd719hqv99q34v9yfelrkq3v` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.sizes: ~3 rows (xấp xỉ)
INSERT INTO `sizes` (`id`, `is_active`, `name`, `note`) VALUES
	(1, b'1', 'S', 'S'),
	(6, b'1', 'M', 'M'),
	(7, b'1', 'L', 'L');

-- Đang kết xuất đổ cấu trúc cho bảng csdl.user_roles
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.user_roles: ~5 rows (xấp xỉ)
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
	(1, 1),
	(2, 2),
	(2, 3),
	(3, 4),
	(6, 1),
	(7, 4),
	(8, 4),
	(9, 4);

-- Đang kết xuất đổ cấu trúc cho bảng csdl.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(190) NOT NULL,
  `email_verified_at` datetime(6) DEFAULT NULL,
  `full_name` varchar(160) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `last_login_at` datetime(6) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKdu5v5sr43g5bfnji4vb8hg5s3` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Đang kết xuất đổ dữ liệu cho bảng csdl.users: ~7 rows (xấp xỉ)
INSERT INTO `users` (`id`, `created_at`, `email`, `email_verified_at`, `full_name`, `is_active`, `last_login_at`, `password_hash`, `phone`, `updated_at`) VALUES
	(1, '2026-07-21 20:39:37.199092', 'admin@fashion.com', '2026-07-21 20:39:37.199092', 'Fashion Admin', b'1', NULL, '$2a$10$8K3v7vX9zL5mN7pQ2wR8tU5vX9zL5mN7pQ2wR8tU5vX9zL5mN7pQ', '0900000001', '2026-07-21 20:39:37.199092'),
	(2, '2026-07-21 20:39:37.302405', 'staff@fashion.com', '2026-07-21 20:39:37.302405', 'Fashion Staff', b'1', '2026-08-10 10:07:05.836891', '$2a$10$nsuE4S29l301nEW2QoS2U.cmnW9mXS8r5R9kFYpfLgn1VNsXb.Fdu', '0900000002', '2026-08-10 10:07:05.838892'),
	(3, '2026-07-21 20:39:37.423472', 'customer@fashion.com', '2026-07-21 20:39:37.423472', 'Fashion Customer', b'1', '2026-08-10 10:08:15.084882', '$2a$10$FEHq59OK36ALvlHYlyzNYOpTsH.bB75Y3Zqp0qO/HlWnSzTezK7fG', '0900000003', '2026-08-10 10:08:15.086882'),
	(6, '2026-07-21 21:45:16.941048', 'minhdzvkl203@gmail.com', NULL, 'nguyen tuan minh', b'1', '2026-08-10 09:53:02.901538', '$2a$10$G4gCOJ3OV2a6FuvZ5egHEu6qKW8ML6AfjhueFcQFJoBv/ZZPVR7xe', '0354978870', '2026-08-10 09:53:02.951504'),
	(7, '2026-07-22 09:27:09.613835', 'minh@gmail.com', NULL, 'Nguyễn Tuấn Minh', b'1', NULL, '$2a$10$bVXRlz8V8ORg0nYEUbW6N.po/C4tpZ6wfIHW2Q8x3XBStZ2Jk1f1K', '0766021707', '2026-07-22 09:27:09.613835'),
	(8, '2026-07-22 20:31:32.378616', 'testadmin@test.com', NULL, 'Test Admin', b'1', '2026-07-22 20:31:32.988772', '$2a$10$E89.OFIryCmYkK0uA9rJ7uIIxhxoET4qpwT2pXrp1DjqLn/kXrgVa', '0900000099', '2026-07-22 20:31:33.011036'),
	(9, '2026-08-02 22:32:40.945515', 'nguyentuanminh280303@gmail.com', NULL, 'Nguyễn Tuấn Minh', b'1', '2026-08-10 10:04:40.130178', '$2a$10$vqMGwjWBRjxKjMjnlCZyv.KDtBU9q/xsnRmUOhUQb/VPYRvHzJZcW', '0886608895', '2026-08-10 10:04:40.175821');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
