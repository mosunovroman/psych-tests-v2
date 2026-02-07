<?php
// Database configuration for reg.ru hosting
// Copy this to config.php and fill in real credentials

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'your_database_name');
define('DB_USER', getenv('DB_USER') ?: 'your_database_user');
define('DB_PASS', getenv('DB_PASS') ?: 'YOUR_PASSWORD_HERE');

// Allowed origins (add more if needed)
$allowedOrigins = [
    'https://teloirazum.ru',
    'https://mind-pro.online',
    'http://localhost:5173',
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: https://teloirazum.ru');
}

// CORS and security headers
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database connection
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER,
                DB_PASS,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed']);
            exit;
        }
    }
    return $pdo;
}

// Get or create user by device ID
function getOrCreateUser($deviceId) {
    $pdo = getDB();

    $stmt = $pdo->prepare('SELECT id FROM users WHERE device_id = ?');
    $stmt->execute([$deviceId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Update last active
        $pdo->prepare('UPDATE users SET last_active = CURDATE() WHERE id = ?')->execute([$user['id']]);
        return $user['id'];
    }

    // Create new user
    $stmt = $pdo->prepare('INSERT INTO users (device_id, last_active) VALUES (?, CURDATE())');
    $stmt->execute([$deviceId]);

    // Initialize streak
    $userId = $pdo->lastInsertId();
    $pdo->prepare('INSERT INTO user_streaks (user_id, current_streak, longest_streak) VALUES (?, 0, 0)')->execute([$userId]);

    return $userId;
}

// JSON response helper
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
