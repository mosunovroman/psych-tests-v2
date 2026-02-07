-- Mind Pro Gamification Schema
-- Run this in phpMyAdmin on reg.ru hosting

CREATE TABLE IF NOT EXISTS badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10) NOT NULL,
    threshold INT DEFAULT 1,
    category ENUM('tests', 'streak', 'special') DEFAULT 'tests',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active DATE
);

CREATE TABLE IF NOT EXISTS user_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS user_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_date DATE NOT NULL,
    tests_completed INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, activity_date)
);

CREATE TABLE IF NOT EXISTS user_streaks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_activity_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default badges
INSERT INTO badges (code, name, description, icon, threshold, category) VALUES
('first_test', 'Первый шаг', 'Пройден первый тест', '🎯', 1, 'tests'),
('tests_5', 'Исследователь', 'Пройдено 5 тестов', '🔍', 5, 'tests'),
('tests_10', 'Знаток себя', 'Пройдено 10 тестов', '🧠', 10, 'tests'),
('tests_25', 'Эксперт', 'Пройдено 25 тестов', '🏆', 25, 'tests'),
('tests_50', 'Мастер', 'Пройдено 50 тестов', '👑', 50, 'tests'),
('streak_3', 'Постоянство', '3 дня подряд', '🔥', 3, 'streak'),
('streak_7', 'Неделя силы', '7 дней подряд', '💪', 7, 'streak'),
('streak_14', 'Две недели', '14 дней подряд', '⭐', 14, 'streak'),
('streak_30', 'Месяц заботы', '30 дней подряд', '🌟', 30, 'streak'),
('all_tests', 'Полный курс', 'Пройдены все типы тестов', '🎓', 1, 'special')
ON DUPLICATE KEY UPDATE name=VALUES(name);
