-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.5.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for fashion_shop
CREATE DATABASE IF NOT EXISTS `fashion_shop` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `fashion_shop`;

-- Dumping structure for table fashion_shop.addresses
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

-- Dumping data for table fashion_shop.addresses: ~0 rows (approximately)
DELETE FROM `addresses`;

-- Dumping structure for table fashion_shop.audit_logs
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
) ENGINE=InnoDB AUTO_INCREMENT=282 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.audit_logs: ~176 rows (approximately)
DELETE FROM `audit_logs`;
INSERT INTO `audit_logs` (`id`, `action`, `created_at`, `entity_id`, `entity_type`, `error_message`, `ip_address`, `new_value`, `old_value`, `request_method`, `request_url`, `resource_id`, `resource_type`, `status`, `user_agent`, `user_id`, `username`) VALUES
	(1, 'REGISTER', '2025-10-09 22:42:20.702725', 1, 'User', NULL, NULL, 'New user registered: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(2, 'LOGIN', '2025-10-09 22:43:01.349951', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(3, 'REGISTER', '2025-10-10 14:48:16.066737', NULL, 'User', 'Phone already exists: 0123456789', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(4, 'REGISTER', '2025-10-10 14:49:25.668134', 2, 'User', NULL, NULL, 'New user registered: homequy001@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(5, 'LOGIN', '2025-10-10 14:49:39.882280', NULL, 'User', 'Failed login attempt for: vanquyd647@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(6, 'LOGIN', '2025-10-10 14:49:50.166600', NULL, 'User', 'Failed login attempt for: vanquyd647@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(7, 'LOGIN', '2025-10-10 14:49:50.885228', NULL, 'User', 'Failed login attempt for: vanquyd647@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(8, 'LOGIN', '2025-10-10 14:50:01.842479', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(9, 'REGISTER', '2025-10-10 15:16:17.343003', NULL, 'User', 'Email already exists: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(10, 'REGISTER', '2025-10-10 15:16:27.927982', NULL, 'User', 'Email already exists: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(11, 'REGISTER', '2025-10-10 15:18:22.220771', NULL, 'User', 'Email already exists: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(12, 'REGISTER', '2025-10-10 15:18:29.961582', 3, 'User', NULL, NULL, 'New user registered: vanquyd647@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(13, 'LOGIN', '2025-10-10 15:18:50.056932', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(14, 'CREATE', '2025-10-10 15:19:58.650572', 1, 'Product', NULL, NULL, 'Created product: mũ-lưỡi-trai-trekking-travel-100-xanh-đen-forclaz-8588543', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(15, 'CREATE', '2025-10-10 15:34:50.067084', 1, 'ProductVariant', NULL, NULL, 'Created variant SKU: 111, Stock: 123', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(16, 'CREATE', '2025-10-10 15:46:39.317490', 1, 'Order', NULL, NULL, 'Created order: ORD-20251010154639, Total: 246.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(17, 'UPDATE_STATUS', '2025-10-10 15:46:55.263288', 1, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(18, 'LOGIN', '2025-10-10 15:49:24.528127', NULL, 'User', 'Failed login attempt for: homequy001@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(19, 'LOGIN', '2025-10-10 15:49:39.376682', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(20, 'UPDATE_STATUS', '2025-10-10 15:50:12.976869', 1, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(21, 'UPDATE_STATUS', '2025-10-10 15:50:14.946716', 1, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(22, 'CREATE', '2025-10-10 15:50:29.731970', 2, 'Order', NULL, NULL, 'Created order: ORD-20251010155029, Total: 246.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(23, 'UPDATE_STATUS', '2025-10-10 15:50:47.845900', 2, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(24, 'CREATE', '2025-10-12 15:14:49.902236', 2, 'Product', NULL, NULL, 'Created product: Áo sơ mi nam dài tay kẻ sọc nhí Trendy Stripe LADOS', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(25, 'CREATE', '2025-10-12 15:15:53.179252', 2, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD8175, Stock: 10', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(26, 'CREATE', '2025-10-12 15:18:53.509968', 5, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD81786, Stock: 18', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(27, 'UPDATE', '2025-10-12 15:19:08.414313', 2, 'ProductVariant', NULL, NULL, 'SKU: LD8175, Price: 189000, Stock: 10, Active: true', 'SKU: LD8175, Price: 189.00, Stock: 10, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(28, 'UPDATE', '2025-10-12 15:19:14.672443', 5, 'ProductVariant', NULL, NULL, 'SKU: LD81786, Price: 189000, Stock: 18, Active: true', 'SKU: LD81786, Price: 189.00, Stock: 18, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(29, 'UPDATE', '2025-10-12 15:19:43.540031', 5, 'ProductVariant', NULL, NULL, 'SKU: LD81786, Price: 189000, Stock: 18, Active: true', 'SKU: LD81786, Price: 189000.00, Stock: 18, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(30, 'CREATE', '2025-10-12 15:21:33.988917', 3, 'Product', NULL, NULL, 'Created product: Áo Thun Polo Nam Ngắn Tay Jacquard Active Fit LADOS', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(31, 'UPDATE', '2025-10-12 15:21:47.330383', 3, 'Product', NULL, NULL, 'Name: Áo Thun Polo Nam Ngắn Tay Jacquard Active Fit LADOS, Active: true', 'Name: Áo Thun Polo Nam Ngắn Tay Jacquard Active Fit LADOS, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(32, 'CREATE', '2025-10-12 15:23:20.320556', 6, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD9207A, Stock: 23', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(33, 'CREATE', '2025-10-12 15:24:10.212671', 7, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD9207B, Stock: 12', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(34, 'UPDATE', '2025-10-12 15:24:17.661503', 6, 'ProductVariant', NULL, NULL, 'SKU: LD9207A, Price: 139000, Stock: 23, Active: true', 'SKU: LD9207A, Price: 139.00, Stock: 23, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(35, 'CREATE', '2025-10-12 15:27:43.131412', 4, 'Product', NULL, NULL, 'Created product: Quần Short Nam Chạy Bộ Tập Luyện Thể Thao Năng Động LADOS', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(36, 'CREATE', '2025-10-12 15:28:10.374522', 8, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD4173, Stock: 23', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(37, 'CREATE', '2025-10-12 15:28:36.104514', 9, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD4173A, Stock: 23', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(38, 'CREATE', '2025-10-12 15:30:40.504410', 5, 'Product', NULL, NULL, 'Created product: Áo Khoác Nỉ Hoodie', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(39, 'CREATE', '2025-10-12 15:31:13.808642', 10, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD2133, Stock: 124', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(40, 'CREATE', '2025-10-12 15:34:04.869556', 6, 'Product', NULL, NULL, 'Created product: Áo Khoác Kaki Nam Cổ Bẻ Classic Plain LADOS', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(41, 'CREATE', '2025-10-12 15:34:52.591037', 11, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD2127, Stock: 88', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(42, 'CREATE', '2025-10-12 15:35:33.852350', 12, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD2127A, Stock: 33', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(43, 'CREATE', '2025-10-12 15:36:51.183307', 7, 'Product', NULL, NULL, 'Created product: Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(44, 'CREATE', '2025-10-12 15:37:17.763262', 13, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD4198, Stock: 9', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(45, 'CREATE', '2025-10-12 15:37:51.974455', 14, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD4198A, Stock: 2', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(46, 'CREATE', '2025-10-12 15:41:06.489225', 8, 'Product', NULL, NULL, 'Created product: Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(47, 'CREATE', '2025-10-12 15:41:33.344526', 15, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD4184, Stock: 44', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(48, 'CREATE', '2025-10-12 15:42:05.293322', 16, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD4184A, Stock: 77', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(49, 'CREATE', '2025-10-12 15:43:37.541633', 9, 'Product', NULL, NULL, 'Created product: Quần Dài Kaki Túi Hộp Nam Style Tối Giản Mỗi Ngày LADOS', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(50, 'CREATE', '2025-10-12 15:44:11.254015', 17, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD4174, Stock: 188', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(51, 'CREATE', '2025-10-12 15:44:42.450963', 18, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD4174A, Stock: 334', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(52, 'CREATE', '2025-10-12 15:46:03.946549', 10, 'Product', NULL, NULL, 'Created product: Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(53, 'CREATE', '2025-10-12 15:46:50.629380', 19, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD4170, Stock: 12', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(54, 'CREATE', '2025-10-12 15:47:11.762347', 20, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD4170A, Stock: 33', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(55, 'LOGIN', '2025-10-12 16:02:38.699954', 2, 'User', NULL, NULL, 'User logged in: homequy001@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(56, 'LOGIN', '2025-10-12 16:09:43.253498', 2, 'User', NULL, NULL, 'User logged in: homequy001@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(57, 'LOGIN', '2025-10-12 16:09:51.772065', NULL, 'User', 'Failed login attempt for: vanquyd647@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(58, 'LOGIN', '2025-10-12 16:09:56.572598', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(59, 'UPDATE', '2025-10-12 16:10:28.116876', 1, 'ProductVariant', NULL, NULL, 'SKU: 111, Price: 123000, Stock: 119, Active: true', 'SKU: 111, Price: 123.00, Stock: 119, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(60, 'CREATE', '2025-10-12 16:42:45.002291', 3, 'Order', NULL, NULL, 'Created order: ORD-20251012164244, Total: 139000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(61, 'LOGIN', '2025-10-12 17:16:32.524605', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(62, 'AUTO_UPDATE', '2025-10-12 17:17:27.599422', 14, 'ProductVariant', NULL, NULL, 'Stock: 0, Active: false (Auto-deactivated due to out of stock)', 'Stock: 0, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(63, 'CREATE', '2025-10-12 17:17:27.628972', 4, 'Order', NULL, NULL, 'Created order: ORD-20251012171727, Total: 139000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(64, 'CREATE', '2025-10-12 17:22:53.421441', 5, 'Order', NULL, NULL, 'Created order: ORD-20251012172253, Total: 419000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(65, 'CREATE', '2025-10-12 17:33:30.034551', 6, 'Order', NULL, NULL, 'Created order: ORD-20251012173329, Total: 299000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(66, 'CREATE', '2025-10-12 17:53:16.870300', 7, 'Order', NULL, NULL, 'Created order: ORD-20251012175316, Total: 329000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(67, 'CREATE', '2025-10-12 17:58:38.185183', 8, 'Order', NULL, NULL, 'Created order: ORD-20251012175838, Total: 139000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(68, 'CREATE', '2025-10-12 18:03:17.857222', 9, 'Order', NULL, NULL, 'Created order: ORD-20251012180317, Total: 249000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(69, 'CREATE', '2025-10-12 18:07:46.422606', 10, 'Order', NULL, NULL, 'Created order: ORD-20251012180746, Total: 419000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(70, 'CREATE', '2025-10-12 18:10:16.326261', 11, 'Order', NULL, NULL, 'Created order: ORD-20251012181016, Total: 419000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(71, 'CREATE', '2025-10-12 18:14:05.175152', 12, 'Order', NULL, NULL, 'Created order: ORD-20251012181405, Total: 249000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(72, 'CREATE', '2025-10-12 18:28:56.278504', 13, 'Order', NULL, NULL, 'Created order: ORD-20251012182856, Total: 299000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(73, 'CREATE', '2025-10-12 18:49:25.115199', 14, 'Order', NULL, NULL, 'Created order: ORD-20251012184925, Total: 249000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(74, 'LOGIN', '2025-10-12 18:56:00.864946', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(75, 'CREATE', '2025-10-12 18:56:18.973286', 15, 'Order', NULL, NULL, 'Created order: ORD-20251012185618, Total: 299000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(76, 'CREATE', '2025-10-12 19:07:07.037342', 16, 'Order', NULL, NULL, 'Created order: ORD-20251012190706, Total: 329000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(77, 'CREATE', '2025-10-12 19:32:56.382251', 17, 'Order', NULL, NULL, 'Created order: ORD-20251012193256, Total: 299000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(78, 'CREATE', '2025-10-12 19:36:30.989996', 18, 'Order', NULL, NULL, 'Created order: ORD-20251012193630, Total: 299000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(79, 'CREATE', '2025-10-12 19:44:34.778559', 19, 'Order', NULL, NULL, 'Created order: ORD-20251012194434, Total: 299000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(80, 'CREATE', '2025-10-12 19:47:18.069513', 20, 'Order', NULL, NULL, 'Created order: ORD-20251012194718, Total: 299000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(81, 'CREATE', '2025-10-12 19:51:52.109643', 21, 'Order', NULL, NULL, 'Created order: ORD-20251012195152, Total: 419000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(82, 'CREATE', '2025-10-12 20:05:21.446250', 22, 'Order', NULL, NULL, 'Created order: ORD-20251012200521, Total: 419000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(83, 'CREATE', '2025-10-12 20:22:05.306166', 23, 'Order', NULL, NULL, 'Created order: ORD-20251012202205, Total: 299000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(84, 'LOGIN', '2025-10-12 20:25:51.155131', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(85, 'CREATE', '2025-10-12 20:26:53.294773', 24, 'Order', NULL, NULL, 'Created order: ORD-20251012202653, Total: 538000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(86, 'UPDATE_STATUS', '2025-10-13 15:36:15.708556', 22, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(87, 'UPDATE_STATUS', '2025-10-13 15:36:18.017119', 21, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(88, 'UPDATE_STATUS', '2025-10-13 15:36:18.995809', 20, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(89, 'UPDATE_STATUS', '2025-10-13 15:36:19.816968', 19, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(90, 'UPDATE_STATUS', '2025-10-13 15:36:20.521604', 18, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(91, 'UPDATE_STATUS', '2025-10-13 15:36:21.228421', 17, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(92, 'UPDATE_STATUS', '2025-10-13 15:36:22.014634', 16, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(93, 'UPDATE_STATUS', '2025-10-13 15:36:22.848054', 15, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(94, 'UPDATE_STATUS', '2025-10-13 15:36:23.776090', 14, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(95, 'UPDATE_STATUS', '2025-10-13 15:36:24.545437', 13, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(96, 'UPDATE_STATUS', '2025-10-13 15:36:25.993424', 12, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(97, 'UPDATE_STATUS', '2025-10-13 15:36:26.623422', 11, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(98, 'UPDATE_STATUS', '2025-10-13 15:36:27.342775', 10, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(99, 'UPDATE_STATUS', '2025-10-13 15:36:28.325277', 9, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(100, 'UPDATE_STATUS', '2025-10-13 15:36:30.577309', 19, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(101, 'UPDATE_STATUS', '2025-10-13 15:36:32.887431', 18, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(102, 'UPDATE_STATUS', '2025-10-13 15:36:33.938166', 18, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(103, 'UPDATE_STATUS', '2025-10-13 15:36:35.369938', 21, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(104, 'UPDATE_STATUS', '2025-10-13 15:36:36.716745', 23, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(105, 'LOGIN', '2025-10-13 15:38:18.889003', NULL, 'User', 'Failed login attempt for: vanquyd647@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(106, 'LOGIN', '2025-10-13 15:38:20.408683', 3, 'User', NULL, NULL, 'User logged in: vanquyd647@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(107, 'REGISTER', '2025-10-13 16:41:51.910617', NULL, 'User', 'Email already exists: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(108, 'LOGIN', '2025-10-13 16:42:09.610987', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(109, 'LOGIN', '2025-10-13 16:56:01.833667', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(110, 'CREATE', '2025-10-13 16:56:36.614891', 25, 'Order', NULL, NULL, 'Created order: ORD-20251013165636, Total: 299000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(111, 'CREATE', '2025-10-13 17:05:01.386223', 26, 'Order', NULL, NULL, 'Created order: ORD-20251013170501, Total: 329000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(112, 'UPDATE_STATUS', '2025-10-13 17:36:37.495174', 26, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(113, 'UPDATE_STATUS', '2025-10-13 17:36:39.922673', 26, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(114, 'UPDATE_STATUS', '2025-10-13 17:36:49.537096', 8, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(115, 'UPDATE_STATUS', '2025-10-13 17:36:52.555895', 8, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(116, 'UPDATE_STATUS', '2025-10-13 17:36:55.359862', 8, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(117, 'UPDATE_STATUS', '2025-10-13 17:42:52.536307', 3, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(118, 'UPDATE_STATUS', '2025-10-13 17:42:57.001548', 3, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(119, 'UPDATE_STATUS', '2025-10-13 17:42:59.548008', 3, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(120, 'CREATE', '2025-10-13 17:43:59.987766', 27, 'Order', NULL, NULL, 'Created order: ORD-20251013174359, Total: 139000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(121, 'UPDATE_STATUS', '2025-10-13 17:44:11.552212', 27, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(122, 'UPDATE_STATUS', '2025-10-13 17:44:15.846107', 27, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(123, 'UPDATE_STATUS', '2025-10-13 17:44:18.025199', 27, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(124, 'CREATE', '2025-10-13 17:45:05.938079', 28, 'Order', NULL, NULL, 'Created order: ORD-20251013174505, Total: 299000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(125, 'UPDATE_STATUS', '2025-10-13 17:46:06.857065', 28, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(126, 'UPDATE_STATUS', '2025-10-13 17:46:09.254593', 28, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(127, 'UPDATE_STATUS', '2025-10-13 17:46:11.744623', 28, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(128, 'CREATE', '2025-10-13 17:53:23.120299', 29, 'Order', NULL, NULL, 'Created order: ORD-20251013175323, Total: 419000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(129, 'UPDATE_STATUS', '2025-10-13 17:53:54.173266', 29, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(130, 'UPDATE_STATUS', '2025-10-13 17:53:56.452694', 29, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(131, 'UPDATE_STATUS', '2025-10-13 17:53:59.592261', 29, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(132, 'CREATE', '2025-10-13 17:55:31.726618', 30, 'Order', NULL, NULL, 'Created order: ORD-20251013175531, Total: 419000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(133, 'CREATE', '2025-10-13 17:57:59.672991', 31, 'Order', NULL, NULL, 'Created order: ORD-20251013175759, Total: 419000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(134, 'CANCEL', '2025-10-13 18:01:17.488886', 4, 'Order', NULL, NULL, 'Status: CANCELLED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(135, 'CREATE', '2025-10-13 19:21:29.044058', 32, 'Order', NULL, NULL, 'Created order: ORD-20251013192128, Total: 279000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(136, 'LOGIN', '2025-10-15 18:23:39.233574', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(137, 'CANCEL', '2025-10-15 18:39:49.861354', 31, 'Order', NULL, NULL, 'Status: CANCELLED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(138, 'CANCEL', '2025-10-15 18:39:52.642530', 32, 'Order', NULL, NULL, 'Status: CANCELLED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(139, 'UPDATE_STATUS', '2025-10-15 18:40:14.024764', 7, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(140, 'CREATE', '2025-10-15 21:24:06.637875', 33, 'Order', NULL, NULL, 'Created order: ORD-20251015212406, Total: 279000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(141, 'REGISTER', '2025-10-15 21:31:16.301431', 4, 'User', NULL, NULL, 'New user registered: huahonglongvy2k2@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(142, 'LOGIN', '2025-10-15 21:36:10.480877', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(143, 'CREATE', '2025-10-20 20:04:18.180598', 11, 'Product', NULL, NULL, 'Created product: Áo Sơ Mi Nam Dài Tay Oxford Premium LADOS – LD8177', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(144, 'CREATE', '2025-10-20 20:04:51.801411', 21, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD8177, Stock: 123', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(145, 'CREATE', '2025-10-20 20:05:12.300919', 22, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD8177A, Stock: 24', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(146, 'CREATE', '2025-10-20 20:14:24.447312', 12, 'Product', NULL, NULL, 'Created product: Áo Thun Thể Thao Nam Training Comfort LADOS – LD9231', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(147, 'CREATE', '2025-10-20 20:14:49.219116', 23, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD9231, Stock: 34', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(148, 'CREATE', '2025-10-20 20:15:04.608008', 24, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD9231A, Stock: 44', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(149, 'CREATE', '2025-10-20 20:16:22.821401', 13, 'Product', NULL, NULL, 'Created product: Áo Thun Ba Lỗ Nam Thể Thao In Số 8 Cá Tính LADOS – LD9208', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(150, 'CREATE', '2025-10-20 20:16:48.080126', 25, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD9208, Stock: 123', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(151, 'CREATE', '2025-10-20 20:17:01.994767', 26, 'ProductVariant', NULL, NULL, 'Created variant SKU: LD9208A, Stock: 23', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(152, 'CREATE', '2025-10-20 20:18:41.567921', 14, 'Product', NULL, NULL, 'Created product: Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS – LD4198', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(153, 'CREATE', '2025-10-20 20:19:38.339125', 30, 'ProductVariant', NULL, NULL, 'Created variant SKU: LDB4198, Stock: 35', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(154, 'CREATE', '2025-10-20 20:19:52.903209', 31, 'ProductVariant', NULL, NULL, 'Created variant SKU: LDD4198, Stock: 64', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(155, 'REGISTER', '2025-10-21 17:14:58.273029', 5, 'User', NULL, NULL, 'New user registered: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(156, 'LOGIN', '2025-10-21 17:16:12.760198', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(157, 'LOGIN', '2025-10-21 17:16:40.823992', 5, 'User', NULL, NULL, 'User logged in: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(158, 'LOGIN', '2025-10-21 17:17:08.080089', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(159, 'FORGOT_PASSWORD', '2025-10-21 17:34:11.010359', 5, 'User', NULL, NULL, 'Password reset requested for: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(160, 'FORGOT_PASSWORD', '2025-10-21 17:40:10.200121', 5, 'User', NULL, NULL, 'Password reset email sent to: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(161, 'FORGOT_PASSWORD', '2025-10-21 17:41:53.485226', 5, 'User', NULL, NULL, 'Password reset email sent to: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(162, 'RESET_PASSWORD', '2025-10-21 17:44:14.030518', 5, 'User', NULL, NULL, 'Password reset completed for: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(163, 'LOGIN', '2025-10-21 17:44:22.172447', NULL, 'User', 'Failed login attempt for: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(164, 'LOGIN', '2025-10-21 17:44:24.554605', 5, 'User', NULL, NULL, 'User logged in: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(165, 'CHANGE_PASSWORD', '2025-10-21 17:45:27.368299', NULL, 'User', 'Failed password change attempt for: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(166, 'CHANGE_PASSWORD', '2025-10-21 17:45:31.726596', 5, 'User', NULL, NULL, 'Password changed for: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(167, 'LOGIN', '2025-10-21 17:45:47.068357', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(168, 'FORGOT_PASSWORD', '2025-10-21 17:46:26.390223', 2, 'User', NULL, NULL, 'Password reset email sent to: homequy001@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(169, 'RESET_PASSWORD', '2025-10-21 17:46:45.491732', 2, 'User', NULL, NULL, 'Password reset completed for: homequy001@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(170, 'LOGIN', '2025-10-21 17:46:54.535223', 2, 'User', NULL, NULL, 'User logged in: homequy001@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(171, 'LOGIN', '2025-10-21 18:46:11.391234', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(172, 'UPDATE', '2025-10-21 18:46:23.381434', 13, 'ProductVariant', NULL, NULL, 'SKU: LD4198, Price: 139000, Stock: 1, Active: true', 'SKU: LD4198, Price: 139000.00, Stock: 7, Active: true', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(173, 'LOGIN', '2025-10-21 18:47:13.043605', 2, 'User', NULL, NULL, 'User logged in: homequy001@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(174, 'CREATE', '2025-10-21 18:49:52.009189', 34, 'Order', NULL, NULL, 'Created order: ORD-20251021184951, Total: 139000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(175, 'CREATE', '2025-10-21 18:55:11.436216', 35, 'Order', NULL, NULL, 'Created order: ORD-20251021185511, Total: 2691000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(176, 'LOGIN', '2025-11-17 17:19:01.523032', NULL, 'User', 'Failed login attempt for: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(177, 'LOGIN', '2025-11-17 17:19:03.913258', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(178, 'CREATE', '2025-11-17 17:19:25.952672', 36, 'Order', NULL, NULL, 'Created order: ORD-20251117171925, Total: 119000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(179, 'REGISTER', '2025-11-17 17:20:55.466429', 6, 'User', NULL, NULL, 'New user registered: lehoang01@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(180, 'CREATE', '2025-11-17 17:21:27.698183', 37, 'Order', NULL, NULL, 'Created order: ORD-20251117172127, Total: 139000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(181, 'LOGIN', '2025-11-17 17:41:28.316386', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(182, 'LOGIN', '2025-11-17 17:41:32.717869', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(183, 'LOGIN', '2025-11-17 17:41:34.284418', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(184, 'LOGIN', '2025-11-17 17:41:34.641414', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(185, 'LOGIN', '2025-11-17 17:41:34.865075', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(186, 'LOGIN', '2025-11-17 17:41:35.042573', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(187, 'LOGIN', '2025-11-17 17:41:35.242437', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(188, 'LOGIN', '2025-11-17 17:41:35.491571', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(189, 'LOGIN', '2025-11-17 17:41:35.697463', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(190, 'LOGIN', '2025-11-17 17:41:35.838800', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(191, 'LOGIN', '2025-11-17 17:41:36.052720', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(192, 'LOGIN', '2025-11-17 17:41:36.266800', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(193, 'LOGIN', '2025-11-17 17:41:36.450296', NULL, 'User', 'Failed login attempt for: donguyenkhang5@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(194, 'LOGIN', '2025-11-20 14:27:32.460640', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(195, 'LOGIN', '2025-11-20 14:37:44.083841', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(196, 'LOGIN', '2025-11-20 14:52:57.398647', NULL, 'User', 'Failed login attempt for: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(197, 'FORGOT_PASSWORD', '2025-11-20 14:53:09.465044', 5, 'User', NULL, NULL, 'Password reset email sent to: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(198, 'RESET_PASSWORD', '2025-11-20 14:53:48.979611', 5, 'User', NULL, NULL, 'Password reset completed for: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(199, 'LOGIN', '2025-11-20 14:54:04.168833', 5, 'User', NULL, NULL, 'User logged in: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(200, 'LOGIN', '2025-11-20 15:02:22.008966', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(201, 'LOGIN', '2025-11-20 15:02:43.383880', 5, 'User', NULL, NULL, 'User logged in: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(202, 'LOGIN', '2025-11-20 15:07:03.588079', 5, 'User', NULL, NULL, 'User logged in: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(203, 'LOGIN', '2025-11-20 15:13:11.417290', 5, 'User', NULL, NULL, 'User logged in: vanquyd648@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(204, 'LOGIN', '2025-11-20 15:13:22.286462', 1, 'User', NULL, NULL, 'User logged in: vanquyd666@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(205, 'LOGIN', '2025-11-20 15:25:40.567232', 1, 'User', NULL, NULL, 'User logged in: vanquyd6@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(206, 'CHANGE_PASSWORD', '2025-11-23 17:25:20.774970', 1, 'User', NULL, NULL, 'Password changed for: vanquyd6@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(207, 'CREATE', '2025-11-23 18:13:10.801994', 38, 'Order', NULL, NULL, 'Created order: ORD-20251123181310, Total: 119000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(208, 'UPDATE_PAYMENT_METHOD', '2025-11-23 18:22:24.694218', 38, 'Order', NULL, NULL, 'Payment Method: VNPAY', 'Payment Method: COD', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(209, 'LOGIN', '2025-11-23 18:24:16.877889', NULL, 'User', 'Failed login attempt for: vanquyd6@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(210, 'LOGIN', '2025-11-23 18:24:20.606774', 1, 'User', NULL, NULL, 'User logged in: vanquyd6@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(211, 'CREATE', '2025-11-23 18:25:35.411361', 39, 'Order', NULL, NULL, 'Created order: ORD-20251123182535, Total: 239000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(212, 'LOGIN', '2025-11-23 18:34:04.605098', 1, 'User', NULL, NULL, 'User logged in: vanquyd6@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(213, 'CREATE', '2025-11-23 18:59:22.041391', 40, 'Order', NULL, NULL, 'Created order: ORD-20251123185921, Total: 299000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(214, 'LOGIN', '2025-11-24 09:02:03.681740', 1, 'User', NULL, NULL, 'User logged in: vanquyd6@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(215, 'LOGIN', '2025-11-24 09:25:13.425788', 1, 'User', NULL, NULL, 'User logged in: vanquyd6@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(216, 'CREATE', '2025-11-24 09:25:50.546830', 41, 'Order', NULL, NULL, 'Created order: ORD-20251124092550, Total: 239000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(217, 'LOGIN', '2025-11-24 09:33:05.906084', 1, 'User', NULL, NULL, 'User logged in: vanquyd6@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(218, 'UPDATE_STATUS', '2025-11-24 09:51:49.371437', 39, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(219, 'UPDATE_STATUS', '2025-11-24 09:51:52.738263', 39, 'Order', NULL, NULL, 'Status: PACKING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(220, 'UPDATE_STATUS', '2025-11-24 09:51:56.415961', 39, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: PACKING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(221, 'UPDATE_STATUS', '2025-11-24 09:51:59.240587', 39, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(222, 'UPDATE_STATUS', '2025-11-24 09:52:21.373299', 35, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(223, 'UPDATE_STATUS', '2025-11-24 09:53:00.334924', 35, 'Order', NULL, NULL, 'Status: PACKING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(224, 'UPDATE_STATUS', '2025-11-24 09:53:05.722490', 35, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: PACKING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(225, 'UPDATE_STATUS', '2025-11-24 09:53:08.643265', 35, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(226, 'CREATE', '2025-11-24 10:27:41.563486', 42, 'Order', NULL, NULL, 'Created order: ORD-20251124102741, Total: 119000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(227, 'UPDATE_STATUS', '2025-11-24 10:28:50.288483', 42, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(228, 'UPDATE_STATUS', '2025-11-24 10:28:53.835560', 42, 'Order', NULL, NULL, 'Status: PACKING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(229, 'UPDATE_STATUS', '2025-11-24 10:28:56.539970', 42, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: PACKING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(230, 'UPDATE_STATUS', '2025-11-24 10:28:59.174356', 42, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(231, 'CREATE', '2025-11-24 10:29:35.910901', 43, 'Order', NULL, NULL, 'Created order: ORD-20251124102935, Total: 129000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(232, 'UPDATE_STATUS', '2025-11-24 10:29:52.158861', 43, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(233, 'UPDATE_STATUS', '2025-11-24 10:29:54.590996', 43, 'Order', NULL, NULL, 'Status: PACKING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(234, 'UPDATE_STATUS', '2025-11-24 10:29:57.057840', 43, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: PACKING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(235, 'UPDATE_STATUS', '2025-11-24 10:29:59.546009', 43, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(236, 'LOGIN', '2025-11-24 10:35:40.938501', NULL, 'User', 'Failed login attempt for: homequy001@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
	(237, 'LOGIN', '2025-11-24 10:35:44.090460', 2, 'User', NULL, NULL, 'User logged in: homequy001@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(238, 'CREATE', '2025-11-24 10:36:26.624858', 44, 'Order', NULL, NULL, 'Created order: ORD-20251124103626, Total: 239000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(239, 'CREATE', '2025-11-24 10:46:57.210713', 45, 'Order', NULL, NULL, 'Created order: ORD-20251124104657, Total: 119000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(240, 'UPDATE_STATUS', '2025-11-24 10:48:09.097702', 45, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(241, 'UPDATE_STATUS', '2025-11-24 10:48:11.673364', 45, 'Order', NULL, NULL, 'Status: PACKING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(242, 'UPDATE_STATUS', '2025-11-24 10:48:13.891036', 44, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(243, 'UPDATE_STATUS', '2025-11-24 10:48:16.596138', 44, 'Order', NULL, NULL, 'Status: PACKING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(244, 'UPDATE_STATUS', '2025-11-24 10:48:18.849085', 44, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: PACKING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(245, 'UPDATE_STATUS', '2025-11-24 10:48:21.096392', 45, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: PACKING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(246, 'UPDATE_STATUS', '2025-11-24 10:48:23.524951', 45, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(247, 'UPDATE_STATUS', '2025-11-24 10:48:25.862740', 44, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(248, 'CREATE', '2025-11-24 10:50:47.501190', 46, 'Order', NULL, NULL, 'Created order: ORD-20251124105047, Total: 329000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(249, 'UPDATE_STATUS', '2025-11-24 11:02:26.367416', 46, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(250, 'UPDATE_STATUS', '2025-11-24 11:02:28.910891', 46, 'Order', NULL, NULL, 'Status: PACKING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(251, 'UPDATE_STATUS', '2025-11-24 11:02:31.348313', 46, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: PACKING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(252, 'UPDATE_STATUS', '2025-11-24 11:02:34.214662', 46, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(253, 'CREATE', '2025-11-24 11:02:54.715932', 47, 'Order', NULL, NULL, 'Created order: ORD-20251124110254, Total: 139000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(254, 'UPDATE_STATUS', '2025-11-24 11:03:39.498301', 47, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(255, 'UPDATE_STATUS', '2025-11-24 11:03:42.345249', 47, 'Order', NULL, NULL, 'Status: PACKING', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(256, 'CREATE', '2025-11-24 11:04:00.999648', 48, 'Order', NULL, NULL, 'Created order: ORD-20251124110400, Total: 419000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(257, 'UPDATE_PAYMENT_METHOD', '2025-11-24 11:04:04.514216', 48, 'Order', NULL, NULL, 'Payment Method: VNPAY', 'Payment Method: COD', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(258, 'CREATE', '2025-11-24 11:21:22.984229', 49, 'Order', NULL, NULL, 'Created order: ORD-20251124112122, Total: 139000.00', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(259, 'UPDATE_PAYMENT_METHOD', '2025-11-24 11:21:38.221222', 49, 'Order', NULL, NULL, 'Payment Method: VNPAY', 'Payment Method: COD', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(260, 'UPDATE_PAYMENT_METHOD', '2025-11-24 11:21:41.503017', 49, 'Order', NULL, NULL, 'Payment Method: VNPAY', 'Payment Method: COD', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(261, 'UPDATE_PAYMENT_METHOD', '2025-11-24 11:22:01.818832', 49, 'Order', NULL, NULL, 'Payment Method: VNPAY', 'Payment Method: COD', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(262, 'UPDATE_PAYMENT_METHOD', '2025-11-24 11:23:38.552484', 49, 'Order', NULL, NULL, 'Payment Method: VNPAY', 'Payment Method: COD', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(263, 'UPDATE_PAYMENT_METHOD', '2025-11-24 11:23:43.271304', 49, 'Order', NULL, NULL, 'Payment Method: VNPAY', 'Payment Method: COD', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(264, 'UPDATE_PAYMENT_METHOD', '2025-11-24 11:25:05.651395', 49, 'Order', NULL, NULL, 'Payment Method: VNPAY', 'Payment Method: COD', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(265, 'UPDATE_PAYMENT_METHOD', '2025-11-24 11:28:04.213508', 49, 'Order', NULL, NULL, 'Payment Method: VNPAY', 'Payment Method: COD', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(266, 'UPDATE_PAYMENT_METHOD', '2025-11-24 11:30:29.417140', 49, 'Order', NULL, NULL, 'Payment Method: VNPAY', 'Payment Method: COD', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(267, 'UPDATE_PAYMENT_METHOD', '2025-11-24 11:31:42.122629', 49, 'Order', NULL, NULL, 'Payment Method: VNPAY', 'Payment Method: COD', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(268, 'REFUND', '2025-11-24 11:56:06.669648', 46, 'Order', NULL, NULL, 'Status: REFUNDED, Payment: REFUNDED, Reason: d', 'Status: COMPLETED, Payment: PAID', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(269, 'CANCEL', '2025-11-24 11:56:38.054684', 49, 'Order', NULL, NULL, 'Status: CANCELLED', 'Status: CANCELLED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(270, 'UPDATE_STATUS', '2025-11-24 12:00:14.692407', 41, 'Order', NULL, NULL, 'Status: CANCELLED', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(271, 'UPDATE_STATUS', '2025-11-24 12:05:36.181321', 48, 'Order', NULL, NULL, 'Status: CANCELLED', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(272, 'UPDATE_STATUS', '2025-11-24 12:05:46.857909', 38, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(273, 'UPDATE_STATUS', '2025-11-24 12:05:50.539760', 34, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(274, 'UPDATE_STATUS', '2025-11-24 12:06:03.442833', 6, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(275, 'UPDATE_STATUS', '2025-11-24 12:06:06.417407', 5, 'Order', NULL, NULL, 'Status: CONFIRMED', 'Status: PENDING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(276, 'UPDATE_STATUS', '2025-11-24 12:08:20.399766', 47, 'Order', NULL, NULL, 'Status: SHIPPING', 'Status: PACKING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(277, 'UPDATE_STATUS', '2025-11-24 12:08:23.447598', 47, 'Order', NULL, NULL, 'Status: COMPLETED', 'Status: SHIPPING', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(278, 'UPDATE_STATUS', '2025-11-24 12:09:19.304458', 2, 'Order', NULL, NULL, 'Status: CANCELLED', 'Status: CONFIRMED', NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(279, 'LOGIN', '2025-11-24 12:10:07.683135', 1, 'User', NULL, NULL, 'User logged in: vanquyd6@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(280, 'LOGIN', '2025-11-24 12:38:00.652968', 1, 'User', NULL, NULL, 'User logged in: vanquyd6@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL),
	(281, 'LOGIN', '2025-11-24 12:56:30.260447', 2, 'User', NULL, NULL, 'User logged in: homequy001@gmail.com', NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, NULL);

-- Dumping structure for table fashion_shop.brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(500) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoce3937d2f4mpfqrycbr0l93m` (`name`),
  UNIQUE KEY `UKpnhnc9urm6fro7oseu9vka70q` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.brands: ~2 rows (approximately)
DELETE FROM `brands`;
INSERT INTO `brands` (`id`, `description`, `logo`, `name`, `slug`, `is_active`) VALUES
	(1, '', NULL, 'Vip PRo', 'vip-pro', b'1'),
	(2, '', NULL, 'Lados', 'lados', b'1');

-- Dumping structure for table fashion_shop.carts
CREATE TABLE IF NOT EXISTS `carts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `customer_user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKon5vdk2dt1srt0ml3fnmeo7np` (`customer_user_id`),
  CONSTRAINT `FKh5jj49nfb6tq5mt7iug5xrilk` FOREIGN KEY (`customer_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.carts: ~4 rows (approximately)
DELETE FROM `carts`;
INSERT INTO `carts` (`id`, `created_at`, `updated_at`, `customer_user_id`) VALUES
	(1, '2025-10-09 22:42:20.557850', '2025-10-09 22:42:20.557850', 1),
	(2, '2025-10-10 14:49:25.649639', '2025-10-10 14:49:25.649639', 2),
	(3, '2025-10-10 15:18:29.884450', '2025-10-10 15:18:29.884450', 3),
	(4, '2025-10-15 21:31:16.276021', '2025-10-15 21:31:16.276021', 4),
	(5, '2025-10-21 17:14:58.255963', '2025-10-21 17:14:58.255963', 5),
	(6, '2025-11-17 17:20:55.462413', '2025-11-17 17:20:55.462413', 6);

-- Dumping structure for table fashion_shop.cart_items
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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.cart_items: ~2 rows (approximately)
DELETE FROM `cart_items`;
INSERT INTO `cart_items` (`id`, `added_at`, `quantity`, `cart_id`, `variant_id`) VALUES
	(35, '2025-10-15 21:32:41.490489', 1, 4, 15);

-- Dumping structure for table fashion_shop.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoul14ho7bctbefv8jywp5v3i2` (`slug`),
  KEY `FKsaok720gsu4u2wrgbk10b5n8d` (`parent_id`),
  CONSTRAINT `FKsaok720gsu4u2wrgbk10b5n8d` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.categories: ~13 rows (approximately)
DELETE FROM `categories`;
INSERT INTO `categories` (`id`, `description`, `name`, `slug`, `parent_id`, `image`, `is_active`) VALUES
	(1, '', 'VipS1', 'vips1', NULL, NULL, b'1'),
	(2, 'Thiết kế áo sơ mi thanh lịch cho mọi dịp', 'Áo sơ mi', 'ao-so-mi', NULL, NULL, b'1'),
	(3, '', 'Áo thun', 'ao-thun', NULL, NULL, b'0'),
	(4, '', 'Áo', 'ao', NULL, NULL, b'1'),
	(5, '', 'Áo khoác', 'ao-khoac', NULL, NULL, b'1'),
	(6, '', 'Quần dài', 'quan-dai', NULL, NULL, b'1'),
	(7, '', 'Quần tây', 'quan-tay', NULL, NULL, b'1'),
	(8, '', 'Quần', 'quan', NULL, NULL, b'1'),
	(9, '', 'Quần kaki', 'quan-kaki', NULL, NULL, b'1'),
	(10, '', 'Quần short', 'quan-short', NULL, NULL, b'1'),
	(11, '', 'Quần Jean', 'quan-jean', NULL, NULL, b'1'),
	(12, '', 'Áo thể thao', 'ao-the-thao', NULL, NULL, b'1'),
	(13, '', 'Quần thể thao', 'quan-the-thao', NULL, NULL, b'0'),
	(14, 'Chân váy thời trang nữ tính và hiện đại', 'Chân váy', 'chan-vay', NULL, NULL, b'1'),
	(15, 'Set đồ bộ phối sẵn, mặc là đẹp', 'Set bộ', 'set-bo', NULL, NULL, b'1');

-- Dumping structure for table fashion_shop.colors
CREATE TABLE IF NOT EXISTS `colors` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `hex` varchar(7) DEFAULT NULL,
  `name` varchar(60) NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkfulqa7c70otb7t3uwkgcpy43` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.colors: ~9 rows (approximately)
DELETE FROM `colors`;
INSERT INTO `colors` (`id`, `hex`, `name`, `is_active`) VALUES
	(1, '#13167c', 'xanh đen', b'1'),
	(2, '#91cfee', 'XANH GHI', b'1'),
	(3, '#2b8ef7', 'XANH BIỂN', b'1'),
	(4, '#000000', 'ĐEN', b'1'),
	(5, '#ffffff', 'TRẮNG', b'1'),
	(6, '#ceb07e', 'Kem', b'1'),
	(7, '#0a1066', 'XANH NAVY', b'1'),
	(8, '#757575', 'XÁM', b'1'),
	(9, '#465912', 'RÊU', b'1');

-- Dumping structure for table fashion_shop.coupons
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.coupons: ~1 rows (approximately)
DELETE FROM `coupons`;
INSERT INTO `coupons` (`id`, `code`, `end_at`, `is_active`, `max_discount`, `min_order_amount`, `per_user_limit`, `start_at`, `type`, `usage_limit`, `used_count`, `value`, `created_by`) VALUES
	(1, 'A111', '2025-11-11 22:02:00.000000', b'1', NULL, 100000.00, 1, '2025-10-05 22:02:00.000000', 'FIXED', 2, 2, 20000.00, 1);

-- Dumping structure for table fashion_shop.customer_profiles
CREATE TABLE IF NOT EXISTS `customer_profiles` (
  `user_id` bigint(20) NOT NULL,
  `birthday` date DEFAULT NULL,
  `gender` enum('FEMALE','MALE','OTHER') DEFAULT NULL,
  `loyalty_point` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `FK69orkdj1un5rh845ngvvmd1xs` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.customer_profiles: ~4 rows (approximately)
DELETE FROM `customer_profiles`;
INSERT INTO `customer_profiles` (`user_id`, `birthday`, `gender`, `loyalty_point`) VALUES
	(1, '1992-01-13', 'MALE', 4870),
	(2, NULL, NULL, 4970),
	(3, NULL, NULL, 0),
	(4, NULL, NULL, 0),
	(5, '2000-01-01', 'MALE', 0),
	(6, NULL, NULL, 0);

-- Dumping structure for table fashion_shop.employee_profiles
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

-- Dumping data for table fashion_shop.employee_profiles: ~4 rows (approximately)
DELETE FROM `employee_profiles`;
INSERT INTO `employee_profiles` (`user_id`, `employee_code`, `hire_date`, `position`, `manager_user_id`) VALUES
	(2, 'EMP-20251123174853', '2025-11-23', 'Administrator', NULL),
	(3, 'EMP-20251123174848', '2025-11-23', 'Product Manager', NULL),
	(4, 'EMP-20251123175031', '2025-11-23', 'Product Manager', NULL),
	(5, 'EMP-20251123175044', '2025-11-23', 'Product Manager', NULL),
	(6, 'EMP-20251123175048', '2025-11-23', 'Product Manager', NULL);

-- Dumping structure for table fashion_shop.inventory_movements
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
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.inventory_movements: ~56 rows (approximately)
DELETE FROM `inventory_movements`;
INSERT INTO `inventory_movements` (`id`, `created_at`, `note`, `quantity`, `reason`, `created_by`, `related_order_id`, `variant_id`) VALUES
	(1, '2025-10-10 15:46:39.298892', 'Order: ORD-20251010154639', -2, 'SALE', 1, 1, 1),
	(2, '2025-10-10 15:50:29.725207', 'Order: ORD-20251010155029', -2, 'SALE', 1, 2, 1),
	(3, '2025-10-12 16:42:44.975361', 'Order: ORD-20251012164244', -1, 'SALE', 1, 3, 14),
	(4, '2025-10-12 17:17:27.609802', 'Order: ORD-20251012171727', -1, 'SALE', 1, 4, 14),
	(5, '2025-10-12 17:22:53.404759', 'Order: ORD-20251012172253', -1, 'SALE', 1, 5, 16),
	(6, '2025-10-12 17:33:30.010062', 'Order: ORD-20251012173329', -1, 'SALE', 1, 6, 20),
	(7, '2025-10-12 17:53:16.851088', 'Order: ORD-20251012175316', -1, 'SALE', 1, 7, 17),
	(8, '2025-10-12 17:58:38.161256', 'Order: ORD-20251012175838', -1, 'SALE', 1, 8, 13),
	(9, '2025-10-12 18:03:17.840868', 'Order: ORD-20251012180317', -1, 'SALE', 1, 9, 11),
	(10, '2025-10-12 18:07:46.404844', 'Order: ORD-20251012180746', -1, 'SALE', 1, 10, 15),
	(11, '2025-10-12 18:10:16.300146', 'Order: ORD-20251012181016', -1, 'SALE', 1, 11, 15),
	(12, '2025-10-12 18:14:05.144544', 'Order: ORD-20251012181405', -1, 'SALE', 1, 12, 11),
	(13, '2025-10-12 18:28:56.260357', 'Order: ORD-20251012182856', -1, 'SALE', 1, 13, 20),
	(14, '2025-10-12 18:49:25.088716', 'Order: ORD-20251012184925', -1, 'SALE', 1, 14, 11),
	(15, '2025-10-12 18:56:18.962076', 'Order: ORD-20251012185618', -1, 'SALE', 1, 15, 19),
	(16, '2025-10-12 19:07:07.015350', 'Order: ORD-20251012190706', -1, 'SALE', 1, 16, 17),
	(17, '2025-10-12 19:32:56.363796', 'Order: ORD-20251012193256', -1, 'SALE', 1, 17, 20),
	(18, '2025-10-12 19:36:30.976257', 'Order: ORD-20251012193630', -1, 'SALE', 1, 18, 20),
	(19, '2025-10-12 19:44:34.759980', 'Order: ORD-20251012194434', -1, 'SALE', 1, 19, 20),
	(20, '2025-10-12 19:47:18.052786', 'Order: ORD-20251012194718', -1, 'SALE', 1, 20, 20),
	(21, '2025-10-12 19:51:52.098456', 'Order: ORD-20251012195152', -1, 'SALE', 1, 21, 15),
	(22, '2025-10-12 20:05:21.431738', 'Order: ORD-20251012200521', -1, 'SALE', 1, 22, 15),
	(23, '2025-10-12 20:22:05.294388', 'Order: ORD-20251012202205', -1, 'SALE', 1, 23, 20),
	(24, '2025-10-12 20:26:53.288153', 'Order: ORD-20251012202653', -1, 'SALE', 1, 24, 10),
	(25, '2025-10-12 20:26:53.289767', 'Order: ORD-20251012202653', -1, 'SALE', 1, 24, 20),
	(26, '2025-10-13 16:56:36.604584', 'Order: ORD-20251013165636', -1, 'SALE', 1, 25, 19),
	(27, '2025-10-13 17:05:01.368002', 'Order: ORD-20251013170501', -1, 'SALE', 1, 26, 18),
	(28, '2025-10-13 17:43:59.974216', 'Order: ORD-20251013174359', -1, 'SALE', 1, 27, 13),
	(29, '2025-10-13 17:45:05.921923', 'Order: ORD-20251013174505', -1, 'SALE', 1, 28, 19),
	(30, '2025-10-13 17:53:23.110669', 'Order: ORD-20251013175323', -1, 'SALE', 1, 29, 16),
	(31, '2025-10-13 17:55:31.723565', 'Order: ORD-20251013175531', -1, 'SALE', 1, 30, 16),
	(32, '2025-10-13 17:57:59.663702', 'Order: ORD-20251013175759', -1, 'SALE', 1, 31, 16),
	(33, '2025-10-13 18:01:17.483841', 'Order cancelled: ORD-20251012171727', 1, 'RETURN', NULL, 4, 14),
	(34, '2025-10-13 19:21:29.004068', 'Order: ORD-20251013192128', -1, 'SALE', 1, 32, 19),
	(35, '2025-10-15 18:39:49.835633', 'Order cancelled: ORD-20251013175759', 1, 'RETURN', NULL, 31, 16),
	(36, '2025-10-15 18:39:52.641017', 'Order cancelled: ORD-20251013192128', 1, 'RETURN', NULL, 32, 19),
	(37, '2025-10-15 21:24:06.626584', 'Order: ORD-20251015212406', -1, 'SALE', 1, 33, 20),
	(38, '2025-10-21 18:49:51.991793', 'Order: ORD-20251021184951', -1, 'SALE', 1, 34, 13),
	(39, '2025-10-21 18:55:11.425052', 'Order: ORD-20251021185511', -9, 'SALE', 1, 35, 19),
	(40, '2025-11-17 17:19:25.944364', 'Order: ORD-20251117171925', -1, 'SALE', 1, 36, 24),
	(41, '2025-11-17 17:21:27.692647', 'Order: ORD-20251117172127', -1, 'SALE', 6, 37, 30),
	(42, '2025-11-23 18:13:10.775642', 'Order: ORD-20251123181310', -1, 'SALE', 1, 38, 23),
	(43, '2025-11-23 18:25:35.402563', 'Order: ORD-20251123182535', -1, 'SALE', 1, 39, 22),
	(44, '2025-11-23 18:59:22.016722', 'Order: ORD-20251123185921', -1, 'SALE', 1, 40, 20),
	(45, '2025-11-24 09:25:50.537713', 'Order: ORD-20251124092550', -1, 'SALE', 1, 41, 22),
	(46, '2025-11-24 10:27:41.557025', 'Order: ORD-20251124102741', -1, 'SALE', 1, 42, 24),
	(47, '2025-11-24 10:29:35.904787', 'Order: ORD-20251124102935', -1, 'SALE', 1, 43, 26),
	(48, '2025-11-24 10:36:26.621176', 'Order: ORD-20251124103626', -1, 'SALE', 2, 44, 22),
	(49, '2025-11-24 10:46:57.198199', 'Order: ORD-20251124104657', -1, 'SALE', 2, 45, 24),
	(50, '2025-11-24 10:50:47.495545', 'Order: ORD-20251124105047', -1, 'SALE', 2, 46, 18),
	(51, '2025-11-24 11:02:54.703931', 'Order: ORD-20251124110254', -1, 'SALE', 2, 47, 30),
	(52, '2025-11-24 11:04:00.996397', 'Order: ORD-20251124110400', -1, 'SALE', 2, 48, 16),
	(53, '2025-11-24 11:21:22.979487', 'Order: ORD-20251124112122', -1, 'SALE', 2, 49, 31),
	(54, '2025-11-24 11:56:06.602321', 'Order REFUNDED: ORD-20251124105047', 1, 'RETURN', NULL, 46, 18),
	(55, '2025-11-24 11:56:38.052683', 'Order CANCELLED: ORD-20251124112122', 1, 'RETURN', NULL, 49, 31),
	(56, '2025-11-24 12:05:36.112447', 'Order CANCELLED: ORD-20251124110400', 1, 'RETURN', NULL, 48, 16),
	(57, '2025-11-24 12:09:19.302757', 'Order CANCELLED: ORD-20251010155029', 2, 'RETURN', NULL, 2, 1);

-- Dumping structure for table fashion_shop.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(40) NOT NULL,
  `coupon_code` varchar(40) DEFAULT NULL,
  `discount_total` decimal(12,2) NOT NULL,
  `grand_total` decimal(12,2) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
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
  `payment_method` enum('COD','MOMO','VNPAY','ZALOPAY') NOT NULL,
  `payment_status` enum('FAILED','PAID','REFUNDED','UNPAID') NOT NULL,
  `payment_time` datetime(6) DEFAULT NULL,
  `payment_transaction_id` varchar(100) DEFAULT NULL,
  `loyalty_points_earned` int(11) NOT NULL,
  `loyalty_points_used` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKgt3o4a5bqj59e9y6wakgk926t` (`code`),
  KEY `FKnr2jtai5a4jbute3j4rh49ggi` (`customer_user_id`),
  CONSTRAINT `FKnr2jtai5a4jbute3j4rh49ggi` FOREIGN KEY (`customer_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.orders: ~46 rows (approximately)
DELETE FROM `orders`;
INSERT INTO `orders` (`id`, `code`, `coupon_code`, `discount_total`, `grand_total`, `note`, `placed_at`, `ship_city`, `ship_country`, `ship_district`, `ship_line1`, `ship_line2`, `ship_name`, `ship_phone`, `ship_ward`, `shipping_fee`, `status`, `subtotal`, `tax_total`, `updated_at`, `customer_user_id`, `payment_method`, `payment_status`, `payment_time`, `payment_transaction_id`, `loyalty_points_earned`, `loyalty_points_used`) VALUES
	(1, 'ORD-20251010154639', NULL, 0.00, 246.00, '', '2025-10-10 15:46:39.291353', 'Ho Chi Minh', 'Vietnam', '123', 'hcm12', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'COMPLETED', 246.00, 0.00, '2025-10-10 15:50:14.948712', 1, 'COD', 'FAILED', NULL, NULL, 0, 0),
	(2, 'ORD-20251010155029', NULL, 0.00, 246.00, 'werw', '2025-10-10 15:50:29.722195', 'Ho Chi Minh', 'Vietnam', 'werw', 'hcmdcddd', NULL, 'Duong Van Quy', '0999999999', 'rwer', 0.00, 'CANCELLED', 246.00, 0.00, '2025-11-24 12:09:19.298968', 1, 'COD', 'FAILED', NULL, NULL, 0, 0),
	(3, 'ORD-20251012164244', NULL, 0.00, 139000.00, '12', '2025-10-12 16:42:44.966064', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'COMPLETED', 139000.00, 0.00, '2025-10-13 17:42:59.549027', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(4, 'ORD-20251012171727', NULL, 0.00, 139000.00, '123', '2025-10-12 17:17:27.601927', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CANCELLED', 139000.00, 0.00, '2025-10-13 18:01:17.487353', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(5, 'ORD-20251012172253', NULL, 0.00, 419000.00, '', '2025-10-12 17:22:53.399660', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '12312', 0.00, 'CONFIRMED', 419000.00, 0.00, '2025-11-24 12:06:06.417407', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(6, 'ORD-20251012173329', NULL, 0.00, 299000.00, '', '2025-10-12 17:33:29.999912', 'Ho Chi Minh', 'Vietnam', '123', 'hcm22', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 299000.00, 0.00, '2025-11-24 12:06:03.442833', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(7, 'ORD-20251012175316', NULL, 0.00, 329000.00, '', '2025-10-12 17:53:16.846572', 'Ho Chi Minh', 'Vietnam', '12314', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '12314', 0.00, 'CONFIRMED', 329000.00, 0.00, '2025-10-15 18:40:14.025764', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(8, 'ORD-20251012175838', NULL, 0.00, 139000.00, '123', '2025-10-12 17:58:38.153992', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123123', 0.00, 'COMPLETED', 139000.00, 0.00, '2025-10-13 17:36:55.359862', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(9, 'ORD-20251012180317', NULL, 0.00, 249000.00, '', '2025-10-12 18:03:17.836364', 'Ho Chi Minh', 'Vietnam', '12314', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 249000.00, 0.00, '2025-10-13 15:36:28.326254', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(10, 'ORD-20251012180746', NULL, 0.00, 419000.00, '', '2025-10-12 18:07:46.401334', 'Ho Chi Minh', 'Vietnam', '123', '123123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 419000.00, 0.00, '2025-10-13 15:36:27.344301', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(11, 'ORD-20251012181016', NULL, 0.00, 419000.00, '', '2025-10-12 18:10:16.293434', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 419000.00, 0.00, '2025-10-13 15:36:26.624431', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(12, 'ORD-20251012181405', NULL, 0.00, 249000.00, '1231', '2025-10-12 18:14:05.131237', 'Ho Chi Minh', 'Vietnam', '123', '123123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 249000.00, 0.00, '2025-10-13 15:36:25.994405', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(13, 'ORD-20251012182856', NULL, 0.00, 299000.00, '', '2025-10-12 18:28:56.254847', 'Ho Chi Minh', 'Vietnam', '123', '123222', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 299000.00, 0.00, '2025-10-13 15:36:24.546440', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(14, 'ORD-20251012184925', NULL, 0.00, 249000.00, '', '2025-10-12 18:49:25.082651', 'Ho Chi Minh', 'Vietnam', '123', '123123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 249000.00, 0.00, '2025-10-13 15:36:23.777068', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(15, 'ORD-20251012185618', NULL, 0.00, 299000.00, '', '2025-10-12 18:56:18.957964', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 299000.00, 0.00, '2025-10-13 15:36:22.849042', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(16, 'ORD-20251012190706', NULL, 0.00, 329000.00, '', '2025-10-12 19:07:07.007799', 'Ho Chi Minh', 'Vietnam', '123123', '123ww', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 329000.00, 0.00, '2025-10-13 15:36:22.015618', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(17, 'ORD-20251012193256', NULL, 0.00, 299000.00, '123', '2025-10-12 19:32:56.353460', 'Ho Chi Minh', 'Vietnam', '321', 'hcm33', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 299000.00, 0.00, '2025-10-13 15:36:21.230370', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(18, 'ORD-20251012193630', NULL, 0.00, 299000.00, '123', '2025-10-12 19:36:30.972662', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'COMPLETED', 299000.00, 0.00, '2025-10-13 15:36:33.939140', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(19, 'ORD-20251012194434', NULL, 0.00, 299000.00, '', '2025-10-12 19:44:34.756393', 'Ho Chi Minh', 'Vietnam', '1231', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123123', 0.00, 'SHIPPING', 299000.00, 0.00, '2025-10-13 15:36:30.577309', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(20, 'ORD-20251012194718', NULL, 0.00, 299000.00, '1231', '2025-10-12 19:47:18.048264', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 299000.00, 0.00, '2025-10-13 15:36:18.997813', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(21, 'ORD-20251012195152', NULL, 0.00, 419000.00, '', '2025-10-12 19:51:52.096456', 'Ho Chi Minh', 'Vietnam', '12314', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'SHIPPING', 419000.00, 0.00, '2025-10-13 15:36:35.369938', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(22, 'ORD-20251012200521', NULL, 0.00, 419000.00, '', '2025-10-12 20:05:21.428252', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 419000.00, 0.00, '2025-10-13 15:36:15.723595', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(23, 'ORD-20251012202205', NULL, 0.00, 299000.00, '', '2025-10-12 20:22:05.291388', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'SHIPPING', 299000.00, 0.00, '2025-10-13 15:36:36.718729', 1, 'VNPAY', 'PAID', '2025-10-12 20:22:42.076389', '15199947', 0, 0),
	(24, 'ORD-20251012202653', NULL, 0.00, 538000.00, '', '2025-10-12 20:26:53.286120', 'Hồ Chí Minh', 'Vietnam', 'Ssksksks', 'DT 1-3, ấp 6, xã Đông Thạnh, Hóc Môn', NULL, 'Nguyễn Thành Hiệp', '0866853100', 'Sjsjsjs', 0.00, 'CONFIRMED', 538000.00, 0.00, '2025-10-12 20:28:11.603021', 1, 'VNPAY', 'PAID', '2025-10-12 20:28:11.602005', '15199951', 0, 0),
	(25, 'ORD-20251013165636', NULL, 0.00, 299000.00, '', '2025-10-13 16:56:36.595363', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123123', 0.00, 'CONFIRMED', 299000.00, 0.00, '2025-10-13 16:57:15.827473', 1, 'VNPAY', 'PAID', '2025-10-13 16:57:15.827473', '15201200', 0, 0),
	(26, 'ORD-20251013170501', NULL, 0.00, 329000.00, '', '2025-10-13 17:05:01.364489', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123123', 0.00, 'COMPLETED', 329000.00, 0.00, '2025-10-13 17:36:39.922673', 1, 'VNPAY', 'PAID', '2025-10-13 17:05:34.462737', '15201219', 0, 0),
	(27, 'ORD-20251013174359', NULL, 0.00, 139000.00, '', '2025-10-13 17:43:59.970195', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123123', 0.00, 'COMPLETED', 139000.00, 0.00, '2025-10-13 17:44:18.026224', 1, 'COD', 'PAID', '2025-10-13 17:44:18.023201', NULL, 0, 0),
	(28, 'ORD-20251013174505', NULL, 0.00, 299000.00, '', '2025-10-13 17:45:05.917929', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123123', 0.00, 'COMPLETED', 299000.00, 0.00, '2025-10-13 17:46:11.744623', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(29, 'ORD-20251013175323', NULL, 0.00, 419000.00, '', '2025-10-13 17:53:23.108155', 'Ho Chi Minh', 'Vietnam', 'werw', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123123', 0.00, 'COMPLETED', 419000.00, 0.00, '2025-10-13 17:53:59.593261', 1, 'VNPAY', 'PAID', '2025-10-13 17:53:59.591260', NULL, 0, 0),
	(30, 'ORD-20251013175531', NULL, 0.00, 419000.00, '', '2025-10-13 17:55:31.721460', 'Ho Chi Minh', 'Vietnam', '123', 'hcmdd', NULL, 'Duong Van Quy', '0999999999', '123123', 0.00, 'CONFIRMED', 419000.00, 0.00, '2025-10-13 17:57:18.062677', 1, 'VNPAY', 'PAID', '2025-10-13 17:57:18.054556', '15201304', 0, 0),
	(31, 'ORD-20251013175759', NULL, 0.00, 419000.00, '', '2025-10-13 17:57:59.661487', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', 'rwer', 0.00, 'CANCELLED', 419000.00, 0.00, '2025-10-15 18:39:49.866477', 1, 'VNPAY', 'UNPAID', NULL, NULL, 0, 0),
	(32, 'ORD-20251013192128', 'A111', 20000.00, 279000.00, '', '2025-10-13 19:21:28.956341', 'Ho Chi Minh', 'Vietnam', 'ádasd', 'hcmdd', NULL, 'Duong Van Quy', '0999999999', 'ádas', 0.00, 'CANCELLED', 299000.00, 0.00, '2025-10-15 18:39:52.642530', 1, 'COD', 'UNPAID', NULL, NULL, 0, 0),
	(33, 'ORD-20251015212406', 'A111', 20000.00, 279000.00, '', '2025-10-15 21:24:06.616796', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 299000.00, 0.00, '2025-10-15 21:28:05.660385', 1, 'VNPAY', 'PAID', '2025-10-15 21:28:05.646759', '15205079', 0, 0),
	(34, 'ORD-20251021184951', NULL, 0.00, 139000.00, '', '2025-10-21 18:49:51.965166', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '12312', 0.00, 'CONFIRMED', 139000.00, 0.00, '2025-11-24 12:05:50.539760', 1, 'COD', 'UNPAID', NULL, NULL, 0, 0),
	(35, 'ORD-20251021185511', NULL, 0.00, 2691000.00, '', '2025-10-21 18:55:11.420212', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '1231', 0.00, 'COMPLETED', 2691000.00, 0.00, '2025-11-24 09:53:08.640162', 1, 'COD', 'PAID', '2025-11-24 09:53:08.638154', NULL, 0, 0),
	(36, 'ORD-20251117171925', NULL, 0.00, 119000.00, '', '2025-11-17 17:19:25.940857', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '12312', 0.00, 'CONFIRMED', 119000.00, 0.00, '2025-11-17 17:20:01.212068', 1, 'VNPAY', 'PAID', '2025-11-17 17:20:01.211507', '15266711', 0, 0),
	(37, 'ORD-20251117172127', NULL, 0.00, 139000.00, '', '2025-11-17 17:21:27.690947', 'tp HCM', 'Vietnam', 'Thuận An', 'Bình nhâm 21', NULL, 'Hiệp', '0335266166', 'Thuận An', 0.00, 'CONFIRMED', 139000.00, 0.00, '2025-11-17 17:22:22.339520', 6, 'VNPAY', 'PAID', '2025-11-17 17:22:22.339520', '15266721', 0, 0),
	(38, 'ORD-20251123181310', NULL, 0.00, 119000.00, '', '2025-11-23 18:13:10.743783', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 119000.00, 0.00, '2025-11-24 12:05:46.857909', 1, 'VNPAY', 'UNPAID', NULL, NULL, 1190, 0),
	(39, 'ORD-20251123182535', NULL, 0.00, 239000.00, '', '2025-11-23 18:25:35.399065', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '12312', 0.00, 'COMPLETED', 239000.00, 0.00, '2025-11-24 09:51:59.242021', 1, 'VNPAY', 'PAID', '2025-11-24 09:51:59.237581', NULL, 2390, 0),
	(40, 'ORD-20251123185921', NULL, 0.00, 299000.00, '', '2025-11-23 18:59:22.006683', 'Ho Chi Minh', 'Vietnam', '123123', 'Nguyen Thai Son', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CONFIRMED', 299000.00, 0.00, '2025-11-24 09:02:40.442412', 1, 'VNPAY', 'PAID', '2025-11-24 09:02:40.441683', '15283335', 2990, 0),
	(41, 'ORD-20251124092550', NULL, 0.00, 239000.00, '', '2025-11-24 09:25:50.534696', 'Ho Chi Minh', 'Vietnam', '123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '123', 0.00, 'CANCELLED', 239000.00, 0.00, '2025-11-24 12:00:14.691227', 1, 'VNPAY', 'PAID', '2025-11-24 09:26:18.749721', '15283389', 2390, 0),
	(42, 'ORD-20251124102741', NULL, 0.00, 119000.00, '', '2025-11-24 10:27:41.552743', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '12312', 0.00, 'COMPLETED', 119000.00, 0.00, '2025-11-24 10:28:59.171271', 1, 'COD', 'PAID', '2025-11-24 10:28:59.169272', NULL, 1190, 0),
	(43, 'ORD-20251124102935', NULL, 0.00, 129000.00, '', '2025-11-24 10:29:35.901742', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', 'rwer', 0.00, 'COMPLETED', 129000.00, 0.00, '2025-11-24 10:29:59.543274', 1, 'COD', 'PAID', '2025-11-24 10:29:59.542265', NULL, 1290, 0),
	(44, 'ORD-20251124103626', NULL, 0.00, 239000.00, '123', '2025-11-24 10:36:26.619641', 'Ho Chi Minh', 'Vietnam', '123123', 'Nguyen Thai Son', NULL, 'Quy Duong', '0999999999', '12312', 0.00, 'COMPLETED', 239000.00, 0.00, '2025-11-24 10:48:25.860030', 2, 'COD', 'PAID', '2025-11-24 10:48:25.859035', NULL, 2390, 0),
	(45, 'ORD-20251124104657', NULL, 0.00, 119000.00, '', '2025-11-24 10:46:57.195238', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '12312', 0.00, 'COMPLETED', 119000.00, 0.00, '2025-11-24 10:48:23.248237', 2, 'COD', 'PAID', '2025-11-24 10:48:23.244683', NULL, 1190, 0),
	(46, 'ORD-20251124105047', NULL, 0.00, 329000.00, '', '2025-11-24 10:50:47.492032', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '12312', 0.00, 'REFUNDED', 329000.00, 0.00, '2025-11-24 11:56:06.484626', 2, 'COD', 'REFUNDED', '2025-11-24 11:02:34.206525', NULL, 3290, 0),
	(47, 'ORD-20251124110254', NULL, 0.00, 139000.00, '', '2025-11-24 11:02:54.698896', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', '12312', 0.00, 'COMPLETED', 139000.00, 0.00, '2025-11-24 12:08:23.449608', 2, 'COD', 'PAID', '2025-11-24 11:03:16.347367', NULL, 1390, 0),
	(48, 'ORD-20251124110400', NULL, 0.00, 419000.00, '', '2025-11-24 11:04:00.993390', 'Ho Chi Minh', 'Vietnam', '123123', 'Nguyen Thai Son', NULL, 'Quy Duong', '0999999999', '12312', 0.00, 'CANCELLED', 419000.00, 0.00, '2025-11-24 12:05:36.150907', 2, 'VNPAY', 'REFUNDED', '2025-11-24 11:04:33.916783', '15283646', 4190, 0),
	(49, 'ORD-20251124112122', NULL, 0.00, 139000.00, '', '2025-11-24 11:21:22.977482', 'Ho Chi Minh', 'Vietnam', '123123', 'hcm123', NULL, 'Duong Van Quy', '0999999999', 'rwer', 0.00, 'CANCELLED', 139000.00, 0.00, '2025-11-24 11:56:38.044166', 2, 'VNPAY', 'REFUNDED', '2025-11-24 11:32:16.681310', '15283712', 1390, 0);

-- Dumping structure for table fashion_shop.order_items
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
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.order_items: ~35 rows (approximately)
DELETE FROM `order_items`;
INSERT INTO `order_items` (`id`, `color_name`, `discount_amount`, `line_total`, `product_name`, `quantity`, `size_name`, `sku`, `unit_price`, `order_id`, `product_id`, `variant_id`) VALUES
	(1, 'xanh đen', 0.00, 246.00, 'mũ-lưỡi-trai-trekking-travel-100-xanh-đen-forclaz-8588543', 2, 'X', '111', 123.00, 1, 1, 1),
	(2, 'xanh đen', 0.00, 246.00, 'mũ-lưỡi-trai-trekking-travel-100-xanh-đen-forclaz-8588543', 2, 'X', '111', 123.00, 2, 1, 1),
	(3, 'XÁM', 0.00, 139000.00, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS', 1, 'M', 'LD4198A', 139000.00, 3, 7, 14),
	(4, 'XÁM', 0.00, 139000.00, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS', 1, 'M', 'LD4198A', 139000.00, 4, 7, 14),
	(5, 'XANH NAVY', 0.00, 419000.00, 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 1, 'XL', 'LD4184A', 419000.00, 5, 8, 16),
	(6, 'XÁM', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '32', 'LD4170A', 299000.00, 6, 10, 20),
	(7, 'ĐEN', 0.00, 329000.00, 'Quần Dài Kaki Túi Hộp Nam Style Tối Giản Mỗi Ngày LADOS', 1, 'XXL', 'LD4174', 329000.00, 7, 9, 17),
	(8, 'ĐEN', 0.00, 139000.00, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS', 1, 'XL', 'LD4198', 139000.00, 8, 7, 13),
	(9, 'Kem', 0.00, 249000.00, 'Áo Khoác Kaki Nam Cổ Bẻ Classic Plain LADOS', 1, 'XL', 'LD2127', 249000.00, 9, 6, 11),
	(10, 'XANH GHI', 0.00, 419000.00, 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 1, 'XL', 'LD4184', 419000.00, 10, 8, 15),
	(11, 'XANH GHI', 0.00, 419000.00, 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 1, 'XL', 'LD4184', 419000.00, 11, 8, 15),
	(12, 'Kem', 0.00, 249000.00, 'Áo Khoác Kaki Nam Cổ Bẻ Classic Plain LADOS', 1, 'XL', 'LD2127', 249000.00, 12, 6, 11),
	(13, 'XÁM', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '32', 'LD4170A', 299000.00, 13, 10, 20),
	(14, 'Kem', 0.00, 249000.00, 'Áo Khoác Kaki Nam Cổ Bẻ Classic Plain LADOS', 1, 'XL', 'LD2127', 249000.00, 14, 6, 11),
	(15, 'ĐEN', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '31', 'LD4170', 299000.00, 15, 10, 19),
	(16, 'ĐEN', 0.00, 329000.00, 'Quần Dài Kaki Túi Hộp Nam Style Tối Giản Mỗi Ngày LADOS', 1, 'XXL', 'LD4174', 329000.00, 16, 9, 17),
	(17, 'XÁM', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '32', 'LD4170A', 299000.00, 17, 10, 20),
	(18, 'XÁM', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '32', 'LD4170A', 299000.00, 18, 10, 20),
	(19, 'XÁM', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '32', 'LD4170A', 299000.00, 19, 10, 20),
	(20, 'XÁM', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '32', 'LD4170A', 299000.00, 20, 10, 20),
	(21, 'XANH GHI', 0.00, 419000.00, 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 1, 'XL', 'LD4184', 419000.00, 21, 8, 15),
	(22, 'XANH GHI', 0.00, 419000.00, 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 1, 'XL', 'LD4184', 419000.00, 22, 8, 15),
	(23, 'XÁM', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '32', 'LD4170A', 299000.00, 23, 10, 20),
	(24, 'ĐEN', 0.00, 239000.00, 'Áo Khoác Nỉ Hoodie', 1, 'XL', 'LD2133', 239000.00, 24, 5, 10),
	(25, 'XÁM', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '32', 'LD4170A', 299000.00, 24, 10, 20),
	(26, 'ĐEN', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '31', 'LD4170', 299000.00, 25, 10, 19),
	(27, 'RÊU', 0.00, 329000.00, 'Quần Dài Kaki Túi Hộp Nam Style Tối Giản Mỗi Ngày LADOS', 1, 'XXL', 'LD4174A', 329000.00, 26, 9, 18),
	(28, 'ĐEN', 0.00, 139000.00, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS', 1, 'XL', 'LD4198', 139000.00, 27, 7, 13),
	(29, 'ĐEN', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '31', 'LD4170', 299000.00, 28, 10, 19),
	(30, 'XANH NAVY', 0.00, 419000.00, 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 1, 'XL', 'LD4184A', 419000.00, 29, 8, 16),
	(31, 'XANH NAVY', 0.00, 419000.00, 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 1, 'XL', 'LD4184A', 419000.00, 30, 8, 16),
	(32, 'XANH NAVY', 0.00, 419000.00, 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 1, 'XL', 'LD4184A', 419000.00, 31, 8, 16),
	(33, 'ĐEN', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '31', 'LD4170', 299000.00, 32, 10, 19),
	(34, 'XÁM', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '32', 'LD4170A', 299000.00, 33, 10, 20),
	(35, 'ĐEN', 0.00, 139000.00, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS', 1, 'XL', 'LD4198', 139000.00, 34, 7, 13),
	(36, 'ĐEN', 0.00, 2691000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 9, '31', 'LD4170', 299000.00, 35, 10, 19),
	(37, 'ĐEN', 0.00, 119000.00, 'Áo Thun Thể Thao Nam Training Comfort LADOS – LD9231', 1, 'XXL', 'LD9231A', 119000.00, 36, 12, 24),
	(38, 'ĐEN', 0.00, 139000.00, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS – LD4198', 1, 'XL', 'LDB4198', 139000.00, 37, 14, 30),
	(39, 'TRẮNG', 0.00, 119000.00, 'Áo Thun Thể Thao Nam Training Comfort LADOS – LD9231', 1, 'XL', 'LD9231', 119000.00, 38, 12, 23),
	(40, 'XANH BIỂN', 0.00, 239000.00, 'Áo Sơ Mi Nam Dài Tay Oxford Premium LADOS – LD8177', 1, 'L', 'LD8177A', 239000.00, 39, 11, 22),
	(41, 'XÁM', 0.00, 299000.00, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '32', 'LD4170A', 299000.00, 40, 10, 20),
	(42, 'XANH BIỂN', 0.00, 239000.00, 'Áo Sơ Mi Nam Dài Tay Oxford Premium LADOS – LD8177', 1, 'L', 'LD8177A', 239000.00, 41, 11, 22),
	(43, 'ĐEN', 0.00, 119000.00, 'Áo Thun Thể Thao Nam Training Comfort LADOS – LD9231', 1, 'XXL', 'LD9231A', 119000.00, 42, 12, 24),
	(44, 'TRẮNG', 0.00, 129000.00, 'Áo Thun Ba Lỗ Nam Thể Thao In Số 8 Cá Tính LADOS – LD9208', 1, 'XL', 'LD9208A', 129000.00, 43, 13, 26),
	(45, 'XANH BIỂN', 0.00, 239000.00, 'Áo Sơ Mi Nam Dài Tay Oxford Premium LADOS – LD8177', 1, 'L', 'LD8177A', 239000.00, 44, 11, 22),
	(46, 'ĐEN', 0.00, 119000.00, 'Áo Thun Thể Thao Nam Training Comfort LADOS – LD9231', 1, 'XXL', 'LD9231A', 119000.00, 45, 12, 24),
	(47, 'RÊU', 0.00, 329000.00, 'Quần Dài Kaki Túi Hộp Nam Style Tối Giản Mỗi Ngày LADOS', 1, 'XXL', 'LD4174A', 329000.00, 46, 9, 18),
	(48, 'ĐEN', 0.00, 139000.00, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS – LD4198', 1, 'XL', 'LDB4198', 139000.00, 47, 14, 30),
	(49, 'XANH NAVY', 0.00, 419000.00, 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 1, 'XL', 'LD4184A', 419000.00, 48, 8, 16),
	(50, 'XÁM', 0.00, 139000.00, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS – LD4198', 1, 'XL', 'LDD4198', 139000.00, 49, 14, 31);

-- Dumping structure for table fashion_shop.password_reset_tokens
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.password_reset_tokens: ~2 rows (approximately)
DELETE FROM `password_reset_tokens`;
INSERT INTO `password_reset_tokens` (`id`, `created_at`, `expires_at`, `token`, `used`, `user_id`) VALUES
	(4, '2025-10-21 17:46:26.387224', '2025-10-22 17:46:26.387224', '35ca0f23-9fd5-4bd8-b6c9-76f9a3efd85b', b'1', 2),
	(5, '2025-11-20 14:53:09.461010', '2025-11-21 14:53:09.459486', 'dc938581-e16c-40c6-a2be-bf4194979e14', b'1', 5);

-- Dumping structure for table fashion_shop.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `bank_code` varchar(255) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `payment_info` text DEFAULT NULL,
  `payment_method` varchar(255) NOT NULL,
  `response_code` varchar(255) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `order_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK81gagumt0r8y3rmudcgpbk42l` (`order_id`),
  CONSTRAINT `FK81gagumt0r8y3rmudcgpbk42l` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.payments: ~10 rows (approximately)
DELETE FROM `payments`;
INSERT INTO `payments` (`id`, `amount`, `bank_code`, `completed_at`, `created_at`, `payment_info`, `payment_method`, `response_code`, `status`, `transaction_id`, `order_id`) VALUES
	(1, 239000, 'NCB', '2025-11-24 09:26:18.747180', '2025-11-24 09:26:18.748205', 'Thanh toan don hang: ORD-20251124092550', 'VNPAY', '00', 'COMPLETED', '15283389', 41),
	(2, 119000, NULL, '2025-11-24 10:27:59.480481', '2025-11-24 10:27:41.555961', 'Thanh toán khi nhận hàng', 'COD', NULL, 'COMPLETED', NULL, 42),
	(3, 129000, NULL, '2025-11-24 10:29:59.545502', '2025-11-24 10:29:35.903861', 'Thanh toán khi nhận hàng', 'COD', NULL, 'COMPLETED', NULL, 43),
	(4, 239000, NULL, '2025-11-24 10:37:36.997171', '2025-11-24 10:36:26.621176', 'Thanh toán khi nhận hàng', 'COD', NULL, 'COMPLETED', NULL, 44),
	(5, 119000, NULL, '2025-11-24 10:47:17.535720', '2025-11-24 10:46:57.197203', 'Thanh toán khi nhận hàng', 'COD', NULL, 'COMPLETED', NULL, 45),
	(6, 329000, NULL, '2025-11-24 10:54:39.028598', '2025-11-24 10:50:47.494545', 'Thanh toán khi nhận hàng', 'COD', NULL, 'REFUNDED', NULL, 46),
	(7, 139000, NULL, '2025-11-24 11:03:16.344316', '2025-11-24 11:02:54.701929', 'Thanh toán khi nhận hàng', 'COD', NULL, 'COMPLETED', NULL, 47),
	(9, 419000, 'NCB', '2025-11-24 11:04:33.916783', '2025-11-24 11:04:33.916783', 'Thanh toan don hang: ORD-20251124110400', 'VNPAY', '00', 'REFUNDED', '15283646', 48),
	(10, 139000, NULL, NULL, '2025-11-24 11:21:22.979487', 'Thanh toán khi nhận hàng', 'COD', NULL, 'CANCELLED', NULL, 49),
	(11, 139000, 'NCB', '2025-11-24 11:32:16.679313', '2025-11-24 11:32:16.680308', 'Thanh toan don hang: ORD-20251124112122', 'VNPAY', '00', 'REFUNDED', '15283712', 49);

-- Dumping structure for table fashion_shop.payment_transactions
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.payment_transactions: ~12 rows (approximately)
DELETE FROM `payment_transactions`;
INSERT INTO `payment_transactions` (`id`, `amount`, `bank_code`, `bank_tran_no`, `card_type`, `created_at`, `ip_address`, `order_info`, `pay_date`, `payment_method`, `raw_data`, `response_code`, `secure_hash`, `status`, `transaction_id`, `transaction_type`, `txn_ref`, `updated_at`, `order_id`) VALUES
	(1, 299000.00, 'NCB', 'VNP15201200', 'ATM', '2025-10-13 16:57:15.825473', NULL, 'Thanh toan don hang: ORD-20251013165636', '20251013165929', 'VNPAY', '{"vnp_Amount":"29900000","vnp_BankCode":"NCB","vnp_BankTranNo":"VNP15201200","vnp_CardType":"ATM","vnp_OrderInfo":"Thanh toan don hang: ORD-20251013165636","vnp_PayDate":"20251013165929","vnp_ResponseCode":"00","vnp_TmnCode":"R1BA8HSM","vnp_TransactionNo":"15201200","vnp_TransactionStatus":"00","vnp_TxnRef":"ORD-20251013165636"}', '00', NULL, 'SUCCESS', '15201200', 'RETURN_CALLBACK', 'ORD-20251013165636', '2025-10-13 16:57:15.825473', 25),
	(2, 329000.00, 'NCB', 'VNP15201219', 'ATM', '2025-10-13 17:05:34.460373', NULL, 'Thanh toan don hang: ORD-20251013170501', '20251013170753', 'VNPAY', '{"vnp_Amount":"32900000","vnp_BankCode":"NCB","vnp_BankTranNo":"VNP15201219","vnp_CardType":"ATM","vnp_OrderInfo":"Thanh toan don hang: ORD-20251013170501","vnp_PayDate":"20251013170753","vnp_ResponseCode":"00","vnp_TmnCode":"R1BA8HSM","vnp_TransactionNo":"15201219","vnp_TransactionStatus":"00","vnp_TxnRef":"ORD-20251013170501"}', '00', NULL, 'SUCCESS', '15201219', 'RETURN_CALLBACK', 'ORD-20251013170501', '2025-10-13 17:05:34.460373', 26),
	(3, 419000.00, 'NCB', 'VNP15201304', 'ATM', '2025-10-13 17:57:18.033364', NULL, 'Thanh toan don hang: ORD-20251013175531', '20251013175934', 'VNPAY', '{"vnp_Amount":"41900000","vnp_BankCode":"NCB","vnp_BankTranNo":"VNP15201304","vnp_CardType":"ATM","vnp_OrderInfo":"Thanh toan don hang: ORD-20251013175531","vnp_PayDate":"20251013175934","vnp_ResponseCode":"00","vnp_TmnCode":"R1BA8HSM","vnp_TransactionNo":"15201304","vnp_TransactionStatus":"00","vnp_TxnRef":"ORD-20251013175531"}', '00', NULL, 'SUCCESS', '15201304', 'RETURN_CALLBACK', 'ORD-20251013175531', '2025-10-13 17:57:18.033364', 30),
	(4, 279000.00, 'NCB', 'VNP15205079', 'ATM', '2025-10-15 21:28:05.601270', NULL, 'Thanh toan don hang: ORD-20251015212406', '20251015212830', 'VNPAY', '{"vnp_Amount":"27900000","vnp_BankCode":"NCB","vnp_BankTranNo":"VNP15205079","vnp_CardType":"ATM","vnp_OrderInfo":"Thanh toan don hang: ORD-20251015212406","vnp_PayDate":"20251015212830","vnp_ResponseCode":"00","vnp_TmnCode":"R1BA8HSM","vnp_TransactionNo":"15205079","vnp_TransactionStatus":"00","vnp_TxnRef":"ORD-20251015212406"}', '00', NULL, 'SUCCESS', '15205079', 'RETURN_CALLBACK', 'ORD-20251015212406', '2025-10-15 21:28:05.601270', 33),
	(5, 119000.00, 'NCB', 'VNP15266711', 'ATM', '2025-11-17 17:20:01.210145', NULL, 'Thanh toan don hang: ORD-20251117171925', '20251117171953', 'VNPAY', '{"vnp_Amount":"11900000","vnp_BankCode":"NCB","vnp_BankTranNo":"VNP15266711","vnp_CardType":"ATM","vnp_OrderInfo":"Thanh toan don hang: ORD-20251117171925","vnp_PayDate":"20251117171953","vnp_ResponseCode":"00","vnp_TmnCode":"R1BA8HSM","vnp_TransactionNo":"15266711","vnp_TransactionStatus":"00","vnp_TxnRef":"ORD-20251117171925"}', '00', NULL, 'SUCCESS', '15266711', 'RETURN_CALLBACK', 'ORD-20251117171925', '2025-11-17 17:20:01.210145', 36),
	(6, 139000.00, 'NCB', 'VNP15266721', 'ATM', '2025-11-17 17:22:22.337001', NULL, 'Thanh toan don hang: ORD-20251117172127', '20251117172206', 'VNPAY', '{"vnp_Amount":"13900000","vnp_BankCode":"NCB","vnp_BankTranNo":"VNP15266721","vnp_CardType":"ATM","vnp_OrderInfo":"Thanh toan don hang: ORD-20251117172127","vnp_PayDate":"20251117172206","vnp_ResponseCode":"00","vnp_TmnCode":"R1BA8HSM","vnp_TransactionNo":"15266721","vnp_TransactionStatus":"00","vnp_TxnRef":"ORD-20251117172127"}', '00', NULL, 'SUCCESS', '15266721', 'RETURN_CALLBACK', 'ORD-20251117172127', '2025-11-17 17:22:22.337001', 37),
	(7, 299000.00, 'NCB', 'VNP15283335', 'ATM', '2025-11-24 09:02:40.438360', NULL, 'Thanh toan don hang: ORD-20251123185921', '20251124090242', 'VNPAY', '{"vnp_Amount":"29900000","vnp_BankCode":"NCB","vnp_BankTranNo":"VNP15283335","vnp_CardType":"ATM","vnp_OrderInfo":"Thanh toan don hang: ORD-20251123185921","vnp_PayDate":"20251124090242","vnp_ResponseCode":"00","vnp_TmnCode":"O83BXNKK","vnp_TransactionNo":"15283335","vnp_TransactionStatus":"00","vnp_TxnRef":"ORD-20251123185921"}', '00', NULL, 'SUCCESS', '15283335', 'RETURN_CALLBACK', 'ORD-20251123185921', '2025-11-24 09:02:40.438360', 40),
	(8, 239000.00, 'NCB', 'VNP15283389', 'ATM', '2025-11-24 09:26:18.736810', NULL, 'Thanh toan don hang: ORD-20251124092550', '20251124092621', 'VNPAY', '{"vnp_Amount":"23900000","vnp_BankCode":"NCB","vnp_BankTranNo":"VNP15283389","vnp_CardType":"ATM","vnp_OrderInfo":"Thanh toan don hang: ORD-20251124092550","vnp_PayDate":"20251124092621","vnp_ResponseCode":"00","vnp_TmnCode":"O83BXNKK","vnp_TransactionNo":"15283389","vnp_TransactionStatus":"00","vnp_TxnRef":"ORD-20251124092550"}', '00', NULL, 'SUCCESS', '15283389', 'RETURN_CALLBACK', 'ORD-20251124092550', '2025-11-24 09:26:18.736810', 41),
	(9, 329000.00, NULL, NULL, NULL, '2025-11-24 10:54:39.080971', NULL, 'Thanh toán COD cho đơn hàng ORD-20251124105047', '20251124105439', 'COD', '{}', '00', NULL, 'SUCCESS', 'COD-1763956479072', 'COD_CONFIRM', 'ORD-20251124105047', '2025-11-24 10:54:39.080971', 46),
	(10, 139000.00, NULL, NULL, NULL, '2025-11-24 11:03:16.357357', NULL, 'Thanh toán COD cho đơn hàng ORD-20251124110254', '20251124110316', 'COD', '{}', '00', NULL, 'SUCCESS', 'COD-1763956996356', 'COD_CONFIRM', 'ORD-20251124110254', '2025-11-24 11:03:16.357357', 47),
	(11, 419000.00, 'NCB', 'VNP15283646', 'ATM', '2025-11-24 11:04:33.912868', NULL, 'Thanh toan don hang: ORD-20251124110400', '20251124110435', 'VNPAY', '{"vnp_Amount":"41900000","vnp_BankCode":"NCB","vnp_BankTranNo":"VNP15283646","vnp_CardType":"ATM","vnp_OrderInfo":"Thanh toan don hang: ORD-20251124110400","vnp_PayDate":"20251124110435","vnp_ResponseCode":"00","vnp_TmnCode":"O83BXNKK","vnp_TransactionNo":"15283646","vnp_TransactionStatus":"00","vnp_TxnRef":"ORD-20251124110400"}', '00', NULL, 'SUCCESS', '15283646', 'RETURN_CALLBACK', 'ORD-20251124110400', '2025-11-24 11:04:33.912868', 48),
	(12, 139000.00, 'NCB', 'VNP15283712', 'ATM', '2025-11-24 11:32:16.675803', NULL, 'Thanh toan don hang: ORD-20251124112122', '20251124113218', 'VNPAY', '{"vnp_Amount":"13900000","vnp_BankCode":"NCB","vnp_BankTranNo":"VNP15283712","vnp_CardType":"ATM","vnp_OrderInfo":"Thanh toan don hang: ORD-20251124112122","vnp_PayDate":"20251124113218","vnp_ResponseCode":"00","vnp_TmnCode":"O83BXNKK","vnp_TransactionNo":"15283712","vnp_TransactionStatus":"00","vnp_TxnRef":"ORD-20251124112122"}', '00', NULL, 'SUCCESS', '15283712', 'RETURN_CALLBACK', 'ORD-20251124112122', '2025-11-24 11:32:16.675803', 49);

-- Dumping structure for table fashion_shop.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(128) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK7lcb6glmvwlro3p2w2cewxtvd` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.permissions: ~10 rows (approximately)
DELETE FROM `permissions`;
INSERT INTO `permissions` (`id`, `code`, `description`, `name`) VALUES
	(1, 'PRODUCT_CREATE', NULL, 'Tạo sản phẩm'),
	(2, 'PRODUCT_UPDATE', NULL, 'Sửa sản phẩm'),
	(3, 'PRODUCT_DELETE', NULL, 'Xóa sản phẩm'),
	(4, 'PRODUCT_VIEW', NULL, 'Xem sản phẩm'),
	(5, 'ORDER_VIEW', NULL, 'Xem đơn hàng'),
	(6, 'ORDER_UPDATE', NULL, 'Cập nhật đơn hàng'),
	(7, 'ORDER_DELETE', NULL, 'Xóa đơn hàng'),
	(8, 'COUPON_MANAGE', NULL, 'Quản lý mã giảm giá'),
	(9, 'USER_MANAGE', NULL, 'Quản lý người dùng'),
	(10, 'ROLE_MANAGE', NULL, 'Quản lý vai trò');

-- Dumping structure for table fashion_shop.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `material` varchar(120) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.products: ~14 rows (approximately)
DELETE FROM `products`;
INSERT INTO `products` (`id`, `created_at`, `description`, `is_active`, `material`, `name`, `origin`, `slug`, `updated_at`, `brand_id`, `created_by`, `updated_by`) VALUES
	(1, '2025-10-10 15:19:58.647054', '', b'1', 'vải', 'mũ-lưỡi-trai-trekking-travel-100-xanh-đen-forclaz-8588543', 'Việt Nam', '11', '2025-10-10 15:19:58.647054', 1, 1, 1),
	(2, '2025-10-12 15:14:49.896188', 'Áo Sơ Mi Nam Chất Đũi Nhẹ Mát, Thấm Hút Tốt\nÁo sơ mi nam dài tay vải đũi xốp cao cấp, mềm nhẹ, có độ xốp đặc trưng giúp bề mặt vải mát tay, thoáng khí và thấm hút tốt. Chất đũi tự nhiên mang lại cảm giác mặc nhẹ tênh, không bức bí.\n\nao so mi nam dui xop cao cap lados ld8175\n\nÁo Sơ Mi Nam Dáng Basic Chuẩn Style Hàn\nÁo sơ mi nam kẻ sọc form basic dài tay, vai áo chuẩn, dáng suông nhẹ ôm cơ thể vừa vặn,dễ mặc cho nhiều dáng người. Cổ bẻ truyền thống, tay dài có nút cài, mang đến vẻ ngoài chỉn chu.\n\nStyle trẻ trung – thanh lịch – kiểu Hàn nhẹ nhàng, thích hợp mặc đi làm, đi cà phê, gặp gỡ bạn bè hay phối layer khi du lịch.', b'1', 'Vải đũi xốp mềm nhẹ, thoáng khí', 'Áo sơ mi nam dài tay kẻ sọc nhí Trendy Stripe LADOS', 'Việt Nam', 'ao-so-mi-nam-dai-tay-trendy-stripe-lados', '2025-10-12 15:14:49.896188', 2, 1, 1),
	(3, '2025-10-12 15:21:33.985790', 'LADOS-LD9207 là mẫu áo polo nam ngắn tay sử dụng vải Jacquard thể thao cao cấp, có khả năng thấm hút mồ hôi nhanh. Bề mặt vải không quá dày, tạo cảm giác mát, khô thoáng và dễ chịu ngay cả khi vận động nhiều. Phù hợp để mặc đi làm, mặc hàng ngày hoặc vận động nhẹ.\n\nao thun polo nam jacquard mat nhe lados ld9207\n\n1.3. Áo Thun Polo Nam Ngắn Tay Thể Thao, Thiết Kế Tối Giản\nÁo được thiết kế theo dáng Regular Fit, giữ phom gọn ở vai và thân nhưng vẫn thoải mái khi di chuyển. Cổ áo bẻ chắc chắn, không bị gập hay mất form sau nhiều lần giặt. Logo in nhỏ, đơn sắc, đảm bảo tổng thể tối giản và thanh lịch. \n\n', b'1', 'Thun Jacquard thể thao – mềm mại, co giãn tốt, thấm hút mồ hôi.', 'Áo Thun Polo Nam Ngắn Tay Jacquard Active Fit LADOS', 'Việt Nam – Sản xuất bởi Công ty TNHH May mặc Lowkey Sài Gòn.', 'ao-thun-polo-nam-ngan-tay-jacquard-active-fit-lados', '2025-10-12 15:21:47.332396', 2, 1, 1),
	(4, '2025-10-12 15:27:43.128865', 'Quần Short Nam Chạy Bộ Thể Thao Vải Dù Bền Đẹp LADOS\nQuần Short Thể Thao Nam LADOS – LD4173 với chất liệu dù cao cấp, quần nhẹ, thoáng khí và co giãn tốt, giúp bạn tự tin vận động trong mọi hoạt động thể thao hoặc sinh hoạt hàng ngày.', b'1', 'Vải dù cao cấp', 'Quần Short Nam Chạy Bộ Tập Luyện Thể Thao Năng Động LADOS', 'Công ty TNHH May Mặc Lowkey Sài Gòn.', 'quan-short-du-the-thao-nam-lados', '2025-10-12 15:27:43.128865', 2, 1, 1),
	(5, '2025-10-12 15:30:40.502411', 'Áo Khoác Hoodie Trơn LADOS, Nỉ Bông Mềm Mại\nÁo khoác nỉ không chỉ dày dặn mà còn siêu mềm mại khi chạm vào da, mang lại cảm giác êm ái và ấm áp cho những ngày se lạnh. Vải Nỉ Bông còn có khả năng giữ nhiệt tốt, nhưng vẫn đảm bảo sự thoáng khí cần thiết, giúp bạn tránh khỏi tình trạng bí bách.', b'1', 'Nỉ bông cotton cao cấp', 'Áo Khoác Nỉ Hoodie', 'Công ty TNHH May Mặc Lowkey Sài Gòn.', 'ao-khoac-ni-hoodie-khoa-keo-2-chieu-lados', '2025-10-12 15:30:40.502411', 2, 1, 1),
	(6, '2025-10-12 15:34:04.867945', 'Áo cổ bẻ lịch lãm, màu trơn đơn giản nhưng tinh tế. Áo có khóa kéo chắc chắn, hai túi ngoài tiện dụng và đặc biệt là có túi trong để cất giữ đồ dùng cá nhân an toàn.', b'1', 'Kaki Poly cao cấp', 'Áo Khoác Kaki Nam Cổ Bẻ Classic Plain LADOS', 'Công ty TNHH May Mặc Lowkey Sài Gòn.', 'ao-khoac-kaki-nam-co-be-lados', '2025-10-12 15:34:04.867945', 2, 1, 1),
	(7, '2025-10-12 15:36:51.180293', 'Phối sọc năng động, lưng chun co giãn, dây rút dễ điều chỉnh', b'1', 'Thun tổ ong cao cấp, mềm mát, co giãn tốt', 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS', 'Công ty TNHH May mặc Lowkey Sài Gòn', 'quan-short-nam-the-thao-cool-motion-lados', '2025-10-12 15:36:51.180293', 2, 1, 1),
	(8, '2025-10-12 15:41:06.487662', 'Quần có thiết kế tối giản, hiện đại, phù hợp với nhiều hoàn cảnh khác nhau. Túi trước và sau được may chắc chắn, đường may tỉ mỉ, cẩn thận, đảm bảo độ bền cao.', b'1', '63% Cotton, 21% Poly, 14% Tencel, 2% Spandex', 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 'Công ty TNHH May Mặc Lowkey Sài Gòn.', 'quan-jean-nam-sieu-nhe-pro-jean-lados', '2025-10-12 15:41:06.487662', 2, 1, 1),
	(9, '2025-10-12 15:43:37.538573', 'Quần dài kiểu dáng túi hộp, tiện lợi và trẻ trung. Cạp trung vừa vặn, đường may chắc chắn, độ bền cao. Dễ phối đồ, phù hợp với áo thun, sơ mi hoặc áo khoác.', b'1', 'Vải Kaki cao cấp', 'Quần Dài Kaki Túi Hộp Nam Style Tối Giản Mỗi Ngày LADOS', 'Công ty TNHH May Mặc Lowkey Sài Gòn.', 'quan-dai-tui-hop-nam-lados', '2025-10-12 15:43:37.538573', 2, 1, 1),
	(10, '2025-10-12 15:46:03.945505', 'Quần tây ống ôm, cạp vừa vặn, đường may sắc sảo, tinh tế. Phù hợp mặc đi làm, đi tiệc hoặc các sự kiện trang trọng.', b'1', 'Vải tuyết tằm cao cấp', 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 'Công ty TNHH May Mặc Lowkey Sài Gòn.', 'quan-tay-nam-form-slim-lados', '2025-10-12 15:46:03.945505', 2, 1, 1),
	(11, '2025-10-20 20:04:18.176091', 'Sang trọng, thanh lịch, trẻ trung – phù hợp cho môi trường công sở hoặc các buổi gặp gỡ.', b'1', 'Oxford Premium – mềm mại', 'Áo Sơ Mi Nam Dài Tay Oxford Premium LADOS – LD8177', 'Việt Nam', 'ao-so-mi-nam-dai-tay-oxford-premium-lados-ld8177', '2025-10-20 20:04:18.176091', 2, 1, 1),
	(12, '2025-10-20 20:14:24.445311', 'Regular Fit, cổ tròn – Dáng áo suông vừa phải, không quá bó sát, giúp người mặc thoải mái tối đa trong mọi chuyển động như chạy bộ, tập gym, tập pickleball,…', b'1', 'Vải thun mè cao cấp đặc trưng với các lỗ thông khí li ti', 'Áo Thun Thể Thao Nam Training Comfort LADOS – LD9231', 'Việt Nam', 'ao-thun-the-thao-training-comfort-lados-ld9231', '2025-10-20 20:14:24.445311', 2, 1, 1),
	(13, '2025-10-20 20:16:22.820397', 'Năng động – trẻ trung – sporty casual', b'1', 'Vải lưới mè thể thao – thoáng khí, thấm hút mồ hôi', 'Áo Thun Ba Lỗ Nam Thể Thao In Số 8 Cá Tính LADOS – LD9208', 'Công ty TNHH May mặc Lowkey Sài Gòn', 'ao-thun-ba-lo-nam-the-thao-in-so-8-ca-tinh-lados-ld9208', '2025-10-20 20:16:22.820397', 2, 1, 1),
	(14, '2025-10-20 20:18:41.566391', 'Trẻ trung, năng động – phù hợp tập luyện các hoạt động thể thao', b'1', 'Thun tổ ong cao cấp, mềm mát, co giãn tốt', 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS – LD4198', 'Việt Nam', 'quan-short-nam-the-thao-cool-motion-lados-ld4198', '2025-10-20 20:18:41.566391', NULL, 1, 1);

-- Dumping structure for table fashion_shop.product_categories
CREATE TABLE IF NOT EXISTS `product_categories` (
  `product_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `FKd112rx0alycddsms029iifrih` (`category_id`),
  CONSTRAINT `FKd112rx0alycddsms029iifrih` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `FKlda9rad6s180ha3dl1ncsp8n7` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.product_categories: ~23 rows (approximately)
DELETE FROM `product_categories`;
INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES
	(2, 2),
	(11, 2),
	(3, 3),
	(12, 3),
	(13, 3),
	(11, 4),
	(12, 4),
	(13, 4),
	(5, 5),
	(6, 5),
	(9, 6),
	(10, 6),
	(10, 7),
	(9, 8),
	(14, 8),
	(9, 9),
	(4, 10),
	(7, 10),
	(14, 10),
	(8, 11),
	(12, 12),
	(13, 12),
	(14, 13);

-- Dumping structure for table fashion_shop.product_images
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.product_images: ~40 rows (approximately)
DELETE FROM `product_images`;
INSERT INTO `product_images` (`id`, `alt_text`, `sort_order`, `url`, `product_id`, `variant_id`) VALUES
	(1, 'mũ-lưỡi-trai-trekking-travel-100-xanh-đen-forclaz-8588543', 0, '/image_product/8eacce5c-c815-4c8a-a7c6-41594807e514.avif', 1, 1),
	(2, 'Áo sơ mi nam dài tay kẻ sọc nhí Trendy Stripe LADOS', 0, '/image_product/7f1dc901-c969-4488-a809-081a0c38070d.jpg', 2, NULL),
	(3, 'Áo sơ mi nam dài tay kẻ sọc nhí Trendy Stripe LADOS', 1, '/image_product/0630506d-5e58-4d55-9a12-c6ac4938d21a.jpg', 2, 2),
	(4, 'Áo sơ mi nam dài tay kẻ sọc nhí Trendy Stripe LADOS', 2, '/image_product/69654ff4-06b8-42eb-a929-8cb0081d6844.jpg', 2, 5),
	(5, 'Áo Thun Polo Nam Ngắn Tay Jacquard Active Fit LADOS', 0, '/image_product/3a2723b2-0217-4713-8bbc-49cf0a44193d.jpg', 3, NULL),
	(6, 'Áo Thun Polo Nam Ngắn Tay Jacquard Active Fit LADOS', 1, '/image_product/1f2ab8a4-5ae7-4424-ad4a-f25be8709a49.jpg', 3, NULL),
	(7, 'Áo Thun Polo Nam Ngắn Tay Jacquard Active Fit LADOS', 2, '/image_product/2559b158-17c3-4f06-89bb-1fb34eabd2a3.jpg', 3, 6),
	(8, 'Áo Thun Polo Nam Ngắn Tay Jacquard Active Fit LADOS', 3, '/image_product/86b927f3-fafe-46ab-8f66-a46322e2f40a.jpg', 3, 7),
	(9, 'Quần Short Nam Chạy Bộ Tập Luyện Thể Thao Năng Động LADOS', 0, '/image_product/ae5f792c-1308-498c-99d9-571318d234f8.jpg', 4, NULL),
	(10, 'Quần Short Nam Chạy Bộ Tập Luyện Thể Thao Năng Động LADOS', 1, '/image_product/54e27372-1047-4fa8-80d7-af6f3ba64aef.jpg', 4, 8),
	(11, 'Quần Short Nam Chạy Bộ Tập Luyện Thể Thao Năng Động LADOS', 2, '/image_product/b4b7ebed-dde9-421c-b5e9-abe6ae8115bd.jpg', 4, 9),
	(12, 'Áo Khoác Nỉ Hoodie', 0, '/image_product/c7246129-bac1-42c1-a485-b7b0b3263bc0.jpg', 5, NULL),
	(13, 'Áo Khoác Nỉ Hoodie', 1, '/image_product/ba6ac015-7f4c-47e9-b16f-bc91e6940db4.jpg', 5, 10),
	(14, 'Áo Khoác Kaki Nam Cổ Bẻ Classic Plain LADOS', 0, '/image_product/63b9107d-dda7-4778-966d-ad7f0c051786.jpg', 6, NULL),
	(15, 'Áo Khoác Kaki Nam Cổ Bẻ Classic Plain LADOS', 1, '/image_product/ad8c36b3-e859-46a1-8c48-a731849912cb.jpg', 6, 11),
	(16, 'Áo Khoác Kaki Nam Cổ Bẻ Classic Plain LADOS', 2, '/image_product/b0868bea-a8c8-421f-a54b-db4eb1583c18.jpg', 6, 12),
	(17, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS', 0, '/image_product/c92a3994-a75b-4ca9-a72f-11c8ea12fd10.jpg', 7, NULL),
	(18, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS', 1, '/image_product/a44681fd-8033-4eb9-bd97-50f565525d4e.jpg', 7, 13),
	(19, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS', 2, '/image_product/fcfc7d12-d073-4746-a81a-613d6827e96a.jpg', 7, 14),
	(20, 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 0, '/image_product/457ba9e1-d040-44dd-ba21-edef91f56c4c.jpg', 8, NULL),
	(21, 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 1, '/image_product/9d816cbf-80cb-4149-b5de-d90db079ec5f.jpg', 8, 15),
	(22, 'Quần Jean Nam Siêu Nhẹ PRO JEAN LADOS', 2, '/image_product/0c14b122-4800-42b2-a027-0ede48ee6c8d.jpg', 8, 16),
	(23, 'Quần Dài Kaki Túi Hộp Nam Style Tối Giản Mỗi Ngày LADOS', 0, '/image_product/2c0015aa-853a-46cc-9c81-0dad44b4077c.jpg', 9, NULL),
	(24, 'Quần Dài Kaki Túi Hộp Nam Style Tối Giản Mỗi Ngày LADOS', 1, '/image_product/cce44a30-9c0f-4cdc-a802-856f744c473f.jpg', 9, 17),
	(25, 'Quần Dài Kaki Túi Hộp Nam Style Tối Giản Mỗi Ngày LADOS', 2, '/image_product/d9c7a1df-2cb7-4be8-8bbd-871c989aba8c.jpg', 9, 18),
	(26, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 0, '/image_product/e00db565-9b46-45a4-bdbb-4b92dffeeb06.png', 10, NULL),
	(27, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 1, '/image_product/bd13911b-92be-4c32-9239-7e353a3debf9.jpg', 10, 19),
	(28, 'Quần Tây Nam Ống Ôm Thanh Lịch Form Slim LADOS', 2, '/image_product/1f106ade-3f00-45eb-9f59-5c0e6d75c26d.jpg', 10, 20),
	(29, 'Áo Sơ Mi Nam Dài Tay Oxford Premium LADOS – LD8177', 0, '/image_product/3ed7cd6d-f07e-4cfc-b05c-adb8cda1bf0d.jpg', 11, NULL),
	(30, 'Áo Sơ Mi Nam Dài Tay Oxford Premium LADOS – LD8177', 1, '/image_product/de7ddfd2-fe28-4357-9dde-ab62051eb900.jpg', 11, 21),
	(31, 'Áo Sơ Mi Nam Dài Tay Oxford Premium LADOS – LD8177', 2, '/image_product/88d8c5ec-0787-4aa8-ac3f-382fbdd61ca4.jpg', 11, 22),
	(32, 'Áo Thun Thể Thao Nam Training Comfort LADOS – LD9231', 0, '/image_product/b8ba71ce-373b-4c6a-a317-a49a633ccdd7.jpg', 12, NULL),
	(33, 'Áo Thun Thể Thao Nam Training Comfort LADOS – LD9231', 1, '/image_product/48719e03-ff5e-420f-a310-cddd4d853f63.jpg', 12, 23),
	(34, 'Áo Thun Thể Thao Nam Training Comfort LADOS – LD9231', 2, '/image_product/460dd138-729d-4e10-a969-de0159063bec.jpg', 12, 24),
	(35, 'Áo Thun Ba Lỗ Nam Thể Thao In Số 8 Cá Tính LADOS – LD9208', 0, '/image_product/d7eb450e-2a2c-4815-a71a-cb3133d2b88d.jpg', 13, NULL),
	(36, 'Áo Thun Ba Lỗ Nam Thể Thao In Số 8 Cá Tính LADOS – LD9208', 1, '/image_product/b0094054-52bd-470d-995f-63804cb75761.jpg', 13, 25),
	(37, 'Áo Thun Ba Lỗ Nam Thể Thao In Số 8 Cá Tính LADOS – LD9208', 2, '/image_product/f0df8e31-d010-4a08-b5a8-f354c4cbd1fd.jpg', 13, 26),
	(38, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS – LD4198', 0, '/image_product/7d1c23e5-f09c-4647-bd8a-16dd115cf547.jpg', 14, NULL),
	(39, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS – LD4198', 1, '/image_product/ec7b3ff8-396c-4558-b4b0-fe4434f1fc77.jpg', 14, 30),
	(40, 'Quần Short Nam Thể Thao Cool Motion Phối Sọc Cá Tính LADOS – LD4198', 2, '/image_product/d8dd1c49-0147-4295-b44d-525de6ebc351.jpg', 14, 31);

-- Dumping structure for table fashion_shop.product_reviews
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.product_reviews: ~1 rows (approximately)
DELETE FROM `product_reviews`;
INSERT INTO `product_reviews` (`id`, `comment`, `created_at`, `is_approved`, `rating`, `title`, `updated_at`, `product_id`, `user_id`) VALUES
	(1, 'tư34tw4fsdasdfsafs', '2025-10-15 18:23:55.111208', b'1', 5, '1231231', '2025-10-15 18:23:55.111208', 10, 1),
	(2, 'ppppokmomomok', '2025-11-24 12:24:37.619795', b'1', 5, 'NICE', '2025-11-24 12:24:37.619795', 14, 1),
	(3, 'ịoimomimomoi', '2025-11-24 12:24:53.961881', b'1', 1, 'NICE', '2025-11-24 12:24:53.961881', 13, 1);

-- Dumping structure for table fashion_shop.product_variants
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.product_variants: ~26 rows (approximately)
DELETE FROM `product_variants`;
INSERT INTO `product_variants` (`id`, `barcode`, `compare_at_price`, `created_at`, `is_active`, `price`, `sku`, `stock`, `updated_at`, `weight_gram`, `color_id`, `product_id`, `size_id`) VALUES
	(1, NULL, NULL, '2025-10-10 15:34:50.058435', b'1', 123000.00, '111', 121, '2025-11-24 12:09:19.299945', NULL, 1, 1, 1),
	(2, NULL, NULL, '2025-10-12 15:15:53.177236', b'1', 189000.00, 'LD8175', 10, '2025-10-12 15:19:08.413328', NULL, 2, 2, 2),
	(5, NULL, NULL, '2025-10-12 15:18:53.506174', b'1', 189000.00, 'LD81786', 18, '2025-10-12 15:19:14.672443', NULL, 3, 2, 3),
	(6, NULL, NULL, '2025-10-12 15:23:20.318055', b'1', 139000.00, 'LD9207A', 23, '2025-10-12 15:24:17.660978', NULL, 4, 3, 4),
	(7, NULL, NULL, '2025-10-12 15:24:10.209537', b'1', 139000.00, 'LD9207B', 12, '2025-10-12 15:24:10.209537', NULL, 5, 3, 2),
	(8, NULL, NULL, '2025-10-12 15:28:10.373523', b'1', 95000.00, 'LD4173', 23, '2025-10-12 15:28:10.373523', NULL, 4, 4, 3),
	(9, NULL, NULL, '2025-10-12 15:28:36.102512', b'1', 95000.00, 'LD4173A', 23, '2025-10-12 15:28:36.102512', NULL, 4, 4, 2),
	(10, NULL, NULL, '2025-10-12 15:31:13.806641', b'1', 239000.00, 'LD2133', 123, '2025-10-12 20:26:53.293774', NULL, 4, 5, 2),
	(11, NULL, NULL, '2025-10-12 15:34:52.589492', b'1', 249000.00, 'LD2127', 85, '2025-10-12 18:49:25.116198', NULL, 6, 6, 2),
	(12, NULL, NULL, '2025-10-12 15:35:33.851327', b'1', 249000.00, 'LD2127A', 33, '2025-10-12 15:35:33.851327', NULL, 7, 6, 2),
	(13, NULL, NULL, '2025-10-12 15:37:17.761359', b'1', 139000.00, 'LD4198', 0, '2025-10-21 18:49:51.957449', NULL, 4, 7, 2),
	(14, NULL, NULL, '2025-10-12 15:37:51.973453', b'0', 139000.00, 'LD4198A', 1, '2025-10-13 18:01:17.487353', NULL, 8, 7, 3),
	(15, NULL, NULL, '2025-10-12 15:41:33.343504', b'1', 419000.00, 'LD4184', 40, '2025-10-12 20:05:21.446250', NULL, 2, 8, 2),
	(16, NULL, NULL, '2025-10-12 15:42:05.292320', b'1', 419000.00, 'LD4184A', 74, '2025-11-24 12:05:36.051897', NULL, 7, 8, 2),
	(17, NULL, NULL, '2025-10-12 15:44:11.253011', b'1', 329000.00, 'LD4174', 186, '2025-10-12 19:07:07.038851', NULL, 4, 9, 5),
	(18, NULL, NULL, '2025-10-12 15:44:42.449489', b'1', 329000.00, 'LD4174A', 333, '2025-11-24 11:56:06.595612', NULL, 9, 9, 5),
	(19, NULL, NULL, '2025-10-12 15:46:50.627380', b'1', 299000.00, 'LD4170', 0, '2025-10-21 18:55:11.415293', NULL, 4, 10, 6),
	(20, NULL, NULL, '2025-10-12 15:47:11.760653', b'1', 299000.00, 'LD4170A', 23, '2025-11-23 18:59:22.001148', NULL, 8, 10, 7),
	(21, NULL, NULL, '2025-10-20 20:04:51.799388', b'1', 239000.00, 'LD8177', 123, '2025-10-20 20:04:51.799388', NULL, 8, 11, 2),
	(22, NULL, NULL, '2025-10-20 20:05:12.298920', b'1', 239000.00, 'LD8177A', 21, '2025-11-24 10:36:26.618763', NULL, 3, 11, 4),
	(23, NULL, NULL, '2025-10-20 20:14:49.216484', b'1', 119000.00, 'LD9231', 33, '2025-11-23 18:13:10.732738', NULL, 5, 12, 2),
	(24, NULL, NULL, '2025-10-20 20:15:04.606010', b'1', 119000.00, 'LD9231A', 41, '2025-11-24 10:46:57.191785', NULL, 4, 12, 5),
	(25, NULL, NULL, '2025-10-20 20:16:48.077592', b'1', 129000.00, 'LD9208', 123, '2025-10-20 20:16:48.077592', NULL, 4, 13, 2),
	(26, NULL, NULL, '2025-10-20 20:17:01.993770', b'1', 129000.00, 'LD9208A', 22, '2025-11-24 10:29:35.899924', NULL, 5, 13, 2),
	(30, NULL, NULL, '2025-10-20 20:19:38.337200', b'1', 139000.00, 'LDB4198', 33, '2025-11-24 11:02:54.695229', NULL, 4, 14, 2),
	(31, NULL, NULL, '2025-10-20 20:19:52.902201', b'1', 139000.00, 'LDD4198', 64, '2025-11-24 11:56:38.050955', NULL, 8, 14, 2);

-- Dumping structure for table fashion_shop.refresh_tokens
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
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.refresh_tokens: ~24 rows (approximately)
DELETE FROM `refresh_tokens`;
INSERT INTO `refresh_tokens` (`id`, `created_at`, `expires_at`, `token`, `user_id`) VALUES
	(8, '2025-10-12 15:06:21.965570', '2025-10-19 15:06:21.963571', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjY2QGdtYWlsLmNvbSIsImlhdCI6MTc2MDI1NjM4MSwiZXhwIjoxNzYwODYxMTgxfQ.vuNrwHOWKvhO2bsWNRWJF8h2t9pSRuXKsWZJiruSpaPdfkJvNRU00Aq3wx5wTzg7', 1),
	(9, '2025-10-12 16:02:38.649431', '2025-10-19 16:02:38.648375', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJob21lcXV5MDAxQGdtYWlsLmNvbSIsImlhdCI6MTc2MDI1OTc1OCwiZXhwIjoxNzYwODY0NTU4fQ.b5wIo3zHCXxRn_fqDiK_NesxAFkOO7Zd0ELx24Jcu0mfpPgoa_R1kBcGs7XZyTqO', 2),
	(10, '2025-10-12 16:09:43.248979', '2025-10-19 16:09:43.248979', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJob21lcXV5MDAxQGdtYWlsLmNvbSIsImlhdCI6MTc2MDI2MDE4MywiZXhwIjoxNzYwODY0OTgzfQ.ELwnzcYEZfEUbWoGzgqpdVEFw1IqmggVsd68qedhvoipumXAlEJJRNPpRSmexLzJ', 2),
	(11, '2025-10-12 16:09:56.569077', '2025-10-19 16:09:56.569077', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjY2QGdtYWlsLmNvbSIsImlhdCI6MTc2MDI2MDE5NiwiZXhwIjoxNzYwODY0OTk2fQ.NMnU9xF6blAAO-x44RUx2sBTbI2EkVjXfk5vNNcO6xDnWlUNPzPJ68SKpzo02WW1', 1),
	(12, '2025-10-12 17:16:32.471321', '2025-10-19 17:16:32.468284', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjY2QGdtYWlsLmNvbSIsImlhdCI6MTc2MDI2NDE5MiwiZXhwIjoxNzYwODY4OTkyfQ.Rg7w7IxryrrGdxg2EzJRYBTy7eiqmXeyxbJ0Fwh3oEL8ECCn_MOmZzVpoM9Wo1jp', 1),
	(14, '2025-10-12 20:25:51.151015', '2025-10-19 20:25:51.151015', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjY2QGdtYWlsLmNvbSIsImlhdCI6MTc2MDI3NTU1MSwiZXhwIjoxNzYwODgwMzUxfQ.IcBB7aoo3hO24gHLPJFnC7JfLF7sgd9KdqIDjSKWVfrIVY9b2fjwX1YA_ydnN-Zn', 1),
	(21, '2025-10-15 21:19:20.579230', '2025-10-22 21:19:20.577106', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjY2QGdtYWlsLmNvbSIsImlhdCI6MTc2MDUzNzk2MCwiZXhwIjoxNzYxMTQyNzYwfQ.jlk86YdhIQzTZbB8rCklX8Z3ZqyyLcfCrU8jL1PoUH23BlXuaK6CAsdd5EoS8he3', 1),
	(22, '2025-10-15 21:31:16.293865', '2025-10-22 21:31:16.293865', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJodWFob25nbG9uZ3Z5MmsyQGdtYWlsLmNvbSIsImlhdCI6MTc2MDUzODY3NiwiZXhwIjoxNzYxMTQzNDc2fQ.aox7Q0Q3LK6OofVrdohARyHAQJ3DWQMRCwjWYS0PuvplBbrDtoQFsPyqLovYlBtY', 4),
	(23, '2025-10-15 21:36:10.477330', '2025-10-22 21:36:10.477330', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjY2QGdtYWlsLmNvbSIsImlhdCI6MTc2MDUzODk3MCwiZXhwIjoxNzYxMTQzNzcwfQ.CO3ygKLjFw3DPmzdafe6D6Q1dxkgyaIdS6ZZK0hN5FgMmhXuEd1mtLb-e8VaEn1n', 1),
	(30, '2025-10-21 17:44:24.549467', '2025-10-28 17:44:24.549467', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjQ4QGdtYWlsLmNvbSIsImlhdCI6MTc2MTA0MzQ2NCwiZXhwIjoxNzYxNjQ4MjY0fQ.XgalyIT9D9yJjcBiHsTv0-r57G3FYeCyxl0duHsDj2vYujHYhtTHwQUqIyl20PAf', 5),
	(31, '2025-10-21 17:45:47.065317', '2025-10-28 17:45:47.065317', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjY2QGdtYWlsLmNvbSIsImlhdCI6MTc2MTA0MzU0NywiZXhwIjoxNzYxNjQ4MzQ3fQ.9Opo6LJdIHMEYZtbnmCWAEDuFT6RMAL1tWcxekKAAfTf2qcZUrkPLyulTepZAbOd', 1),
	(32, '2025-10-21 17:46:54.533229', '2025-10-28 17:46:54.533229', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJob21lcXV5MDAxQGdtYWlsLmNvbSIsImlhdCI6MTc2MTA0MzYxNCwiZXhwIjoxNzYxNjQ4NDE0fQ.Ba1ODPXEtjX4xjYjtPtglcleLrBKtiEH8Z9ZXt0LsfXxt0wtNstOTOAzdVZOsjHj', 2),
	(33, '2025-10-21 18:46:11.348555', '2025-10-28 18:46:11.346771', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjY2QGdtYWlsLmNvbSIsImlhdCI6MTc2MTA0NzE3MSwiZXhwIjoxNzYxNjUxOTcxfQ.DFj9pPWzam91XS49-3wtzIPl1LFYGFvjPvtH0utXudFmtWbADnY4vBlNmufckKNe', 1),
	(34, '2025-10-21 18:47:13.040488', '2025-10-28 18:47:13.040488', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJob21lcXV5MDAxQGdtYWlsLmNvbSIsImlhdCI6MTc2MTA0NzIzMywiZXhwIjoxNzYxNjUyMDMzfQ.M1Y214g-G2FwR5_ed5uW6ywixuIpFKy3cvCpU_KPLOwbh3ilkKsIoBd1rpIRuRMe', 2),
	(35, '2025-11-17 17:19:03.907117', '2025-11-24 17:19:03.907117', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjY2QGdtYWlsLmNvbSIsImlhdCI6MTc2MzM3NDc0MywiZXhwIjoxNzYzOTc5NTQzfQ.Ujl_pLARRa_0jbwlAZ8YEdzdmMRHzS0KlD90zHqdOir2uzH4L1z3hgw5DgSdAkMp', 1),
	(37, '2025-11-20 14:27:32.422057', '2025-11-27 14:27:32.420372', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjY2QGdtYWlsLmNvbSIsImlhdCI6MTc2MzYyMzY1MiwiZXhwIjoxNzY0MjI4NDUyfQ.oylsut3nUjXRdoqGCQeWy4f2Ekg_8de2pQXviYQ-K2-q6lLET4O8V95YfWvQKwoy', 1),
	(40, '2025-11-20 15:02:21.998680', '2025-11-27 15:02:21.997680', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjY2QGdtYWlsLmNvbSIsImlhdCI6MTc2MzYyNTc0MSwiZXhwIjoxNzY0MjMwNTQxfQ.s0rQS9aVfJcTWzhN3E9KrTGMHUcbsyx3mJbsiO9rBOiuulDDmX8Tn29GBSIDdVmC', 1),
	(42, '2025-11-20 15:07:03.585818', '2025-11-27 15:07:03.584799', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjQ4QGdtYWlsLmNvbSIsImlhdCI6MTc2MzYyNjAyMywiZXhwIjoxNzY0MjMwODIzfQ.XipmZXENPVCJEpM_hux4xRjEC1c4tcYWNfMR09BA0eyxcA0uJCcrOemTCnvwj8-b', 5),
	(44, '2025-11-20 15:13:22.278604', '2025-11-27 15:13:22.278604', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNjY2QGdtYWlsLmNvbSIsImlhdCI6MTc2MzYyNjQwMiwiZXhwIjoxNzY0MjMxMjAyfQ.hzeZ2Pb7JJvXkH6an1jYWvAUeuzvbvURZSY9yZSZK56SeYmPVN_4lLQhNpAef7jT', 1),
	(46, '2025-11-23 16:59:18.324953', '2025-11-30 16:59:18.323939', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNkBnbWFpbC5jb20iLCJpYXQiOjE3NjM4OTE5NTgsImV4cCI6MTc2NDQ5Njc1OH0.sOv6ZYHTApP8YGejt-bc5gcSyq1S-nhoqKeowNUzcPxt0dIeYSoc7_MoSYdYp9UE', 1),
	(47, '2025-11-23 18:24:20.599609', '2025-11-30 18:24:20.598581', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNkBnbWFpbC5jb20iLCJpYXQiOjE3NjM4OTcwNjAsImV4cCI6MTc2NDUwMTg2MH0.pHnnVnX7fy1lfuOPVoY8XnyXrRDA13195y5VsaO99i1HI4jwCN49QxliigWNFowt', 1),
	(48, '2025-11-23 18:34:04.546474', '2025-11-30 18:34:04.545951', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNkBnbWFpbC5jb20iLCJpYXQiOjE3NjM4OTc2NDQsImV4cCI6MTc2NDUwMjQ0NH0.DGNxVcOY-DMEtLlrwdLm3jeTmdCRl3tIEehrInL1_pjyEKxbGWsbnfvgSySvVdgf', 1),
	(49, '2025-11-24 09:02:03.650572', '2025-12-01 09:02:03.648068', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNkBnbWFpbC5jb20iLCJpYXQiOjE3NjM5NDk3MjMsImV4cCI6MTc2NDU1NDUyM30.ydCWCT_hA2Nx4XbUZ8f95is2OHw-mLoIzJyEUqtv4JJ4VfODYuE0DN8c95QRUEpg', 1),
	(50, '2025-11-24 09:25:13.418243', '2025-12-01 09:25:13.416736', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNkBnbWFpbC5jb20iLCJpYXQiOjE3NjM5NTExMTMsImV4cCI6MTc2NDU1NTkxM30.Ct_jpmTLudkN0anafTZRlCEtvK4Gsjo-Ag8oLQs2ClnmEiw76MPE44fgv7sFqrii', 1),
	(53, '2025-11-24 12:10:07.680601', '2025-12-01 12:10:07.680601', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNkBnbWFpbC5jb20iLCJpYXQiOjE3NjM5NjEwMDcsImV4cCI6MTc2NDU2NTgwN30.Mpbr11OnxKW7e9TAR0kOXhohLavUF73_zuI7Zc4gqeeZF-E7zowLzGEyN-Xr1k1e', 1),
	(54, '2025-11-24 12:38:00.625245', '2025-12-01 12:38:00.623143', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ2YW5xdXlkNkBnbWFpbC5jb20iLCJpYXQiOjE3NjM5NjI2ODAsImV4cCI6MTc2NDU2NzQ4MH0.sNP50HglWVtmbNMz6b69mV7jt44TEtnJ_i1ULOKXo6vHNGZGQYz0ErV-hIUbNtbc', 1),
	(55, '2025-11-24 12:56:30.230499', '2025-12-01 12:56:30.229503', 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJob21lcXV5MDAxQGdtYWlsLmNvbSIsImlhdCI6MTc2Mzk2Mzc5MCwiZXhwIjoxNzY0NTY4NTkwfQ.cN4COTsfzNNY1X6GVXrU3sC0SiG5qflMyenJk-eNgJw6DSKWIieqJ1LLZtA_LDiV', 2);

-- Dumping structure for table fashion_shop.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(64) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKch1113horj4qr56f91omojv8` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.roles: ~4 rows (approximately)
DELETE FROM `roles`;
INSERT INTO `roles` (`id`, `code`, `created_at`, `description`, `name`) VALUES
	(1, 'ADMIN', '2025-10-09 22:41:34.281125', 'Có toàn quyền trên hệ thống', 'Quản lý (toàn quyền)'),
	(2, 'STAFF_PRODUCT', '2025-10-09 22:41:34.292730', 'Quản lý sản phẩm và tồn kho', 'Nhân viên quản lý sản phẩm'),
	(3, 'STAFF_SALES', '2025-10-09 22:41:34.294249', 'Xử lý đơn hàng và chăm sóc khách hàng', 'Nhân viên bán hàng'),
	(4, 'CUSTOMER', '2025-10-09 22:41:34.295260', 'Khách hàng mua sắm', 'Khách hàng');

-- Dumping structure for table fashion_shop.role_permissions
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` bigint(20) NOT NULL,
  `permission_id` bigint(20) NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `FKegdk29eiy7mdtefy5c7eirr6e` (`permission_id`),
  CONSTRAINT `FKegdk29eiy7mdtefy5c7eirr6e` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `FKn5fotdgk8d1xvo8nav9uv3muc` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.role_permissions: ~17 rows (approximately)
DELETE FROM `role_permissions`;
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
	(1, 1),
	(2, 1),
	(1, 2),
	(2, 2),
	(1, 3),
	(2, 3),
	(1, 4),
	(2, 4),
	(3, 4),
	(1, 5),
	(3, 5),
	(1, 6),
	(3, 6),
	(1, 7),
	(1, 8),
	(1, 9),
	(1, 10);

-- Dumping structure for table fashion_shop.shipments
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.shipments: ~0 rows (approximately)
DELETE FROM `shipments`;

-- Dumping structure for table fashion_shop.sizes
CREATE TABLE IF NOT EXISTS `sizes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `note` varchar(100) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKrmd719hqv99q34v9yfelrkq3v` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.sizes: ~8 rows (approximately)
DELETE FROM `sizes`;
INSERT INTO `sizes` (`id`, `name`, `note`, `is_active`) VALUES
	(1, 'X', NULL, b'1'),
	(2, 'XL', NULL, b'1'),
	(3, 'M', NULL, b'1'),
	(4, 'L', NULL, b'1'),
	(5, 'XXL', NULL, b'1'),
	(6, '31', NULL, b'1'),
	(7, '32', NULL, b'1'),
	(8, '30', NULL, b'1');

-- Dumping structure for table fashion_shop.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(190) NOT NULL,
  `email_verified_at` datetime(6) DEFAULT NULL,
  `full_name` varchar(160) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `last_login_at` datetime(6) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKdu5v5sr43g5bfnji4vb8hg5s3` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.users: ~7 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `created_at`, `email`, `email_verified_at`, `full_name`, `is_active`, `last_login_at`, `password_hash`, `phone`, `updated_at`) VALUES
	(1, '2025-10-09 22:42:20.551298', 'vanquyd6@gmail.com', NULL, 'Duong Van Quy', b'1', '2025-11-24 12:38:00.648747', '$2a$10$4VtdlyQI84/wBf2/yNDjUOviGSaLJRe58RCUDi2dYJOn248f9Qghy', '0123456789', '2025-11-24 12:38:00.653544'),
	(2, '2025-10-10 14:49:25.645124', 'homequy0011234@gmail.com', NULL, 'Do Nguyen Khang', b'1', '2025-11-24 12:56:30.253217', '$2a$10$QbotKQ77d/x3YmRgiPstHegjKADBnbZc11gnjduZNL.nWF7QWtXee', '0123456990', '2025-11-24 14:27:34.194514'),
	(3, '2025-10-10 15:18:29.878391', 'vanquyd68u77@gmail.com', NULL, 'Hiep Nguyen', b'1', '2025-10-13 15:38:20.406156', '$2a$10$1h4jlgmuncV3ZaE9uAriHOSjxnqgtoINdtTqPrQjmBpRBcRw0QSfu', '0123456788', '2025-11-23 17:49:56.879727'),
	(4, '2025-10-15 21:31:16.270056', 'huahonglongvy2dddk2@gmail.com', NULL, 'Hứa Hồng Long Vỹ', b'1', NULL, '$2a$10$2jjDtWVfNckSIJ9ilU0EAupsc9q4Kasz4DmcvQIrbYjSAka12BCeS', '0888552324', '2025-11-23 17:50:31.320931'),
	(5, '2025-10-21 17:14:58.234997', 'vanquyda1@gmail.com', NULL, 'Duong Van Quy hyy', b'1', '2025-11-20 15:13:11.413809', '$2a$10$aIY.HLamyI.b.FD7wvmt4OZ5ZJS8KZEfV0v1i1dlvQwl0SMZXaH2G', '0123456589', '2025-11-23 17:50:44.729049'),
	(6, '2025-11-17 17:20:55.458914', 'lehoang01a2@gmail.com', NULL, 'Hoang', b'1', NULL, '$2a$10$qKPJAe0L45r4Gjpf3aTmLeSYz1WcBLwBYYPqgRdvjOI6ayL0fPaR.', '0147852369', '2025-11-23 17:50:48.097446'),
	(7, '2025-11-23 17:51:42.756295', 'vanquyd666aa@gmail.com', NULL, 'Quy Duong', b'1', NULL, '$2a$10$8VrwB4W1fwh5p9nFckFMIeZJyGsSwpFWmOHjkVL0z35GZdCIaSy1G', '0999999990', '2025-11-23 17:51:42.756295');

-- Dumping structure for table fashion_shop.user_roles
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table fashion_shop.user_roles: ~11 rows (approximately)
DELETE FROM `user_roles`;
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
	(1, 1),
	(2, 1),
	(3, 2),
	(4, 2),
	(5, 2),
	(6, 2),
	(3, 4),
	(4, 4),
	(5, 4),
	(6, 4),
	(7, 4);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
