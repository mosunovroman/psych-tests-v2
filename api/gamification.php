<?php
require_once 'config.php';

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];
$deviceId = $input['deviceId'] ?? $_GET['deviceId'] ?? null;

if (!$deviceId) {
    jsonResponse(['error' => 'Device ID required'], 400);
}

$userId = getOrCreateUser($deviceId);
$pdo = getDB();

switch ($action) {
    case 'get_stats':
        // Get user stats
        $stats = getUserStats($pdo, $userId);
        jsonResponse($stats);
        break;

    case 'record_test':
        // Record test completion and check for new badges
        $testId = $input['testId'] ?? null;
        $result = recordTestCompletion($pdo, $userId, $testId);
        jsonResponse($result);
        break;

    case 'get_badges':
        // Get all badges with earned status
        $badges = getAllBadges($pdo, $userId);
        jsonResponse($badges);
        break;

    default:
        jsonResponse(['error' => 'Unknown action'], 400);
}

function getUserStats($pdo, $userId) {
    // Get streak info
    $stmt = $pdo->prepare('SELECT current_streak, longest_streak, last_activity_date FROM user_streaks WHERE user_id = ?');
    $stmt->execute([$userId]);
    $streak = $stmt->fetch(PDO::FETCH_ASSOC) ?: ['current_streak' => 0, 'longest_streak' => 0];

    // Get total tests completed
    $stmt = $pdo->prepare('SELECT COALESCE(SUM(tests_completed), 0) as total FROM user_activity WHERE user_id = ?');
    $stmt->execute([$userId]);
    $tests = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get earned badges count
    $stmt = $pdo->prepare('SELECT COUNT(*) as count FROM user_badges WHERE user_id = ?');
    $stmt->execute([$userId]);
    $badgesCount = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get recent badges (last 3)
    $stmt = $pdo->prepare('
        SELECT b.code, b.name, b.icon, ub.earned_at
        FROM user_badges ub
        JOIN badges b ON ub.badge_id = b.id
        WHERE ub.user_id = ?
        ORDER BY ub.earned_at DESC
        LIMIT 3
    ');
    $stmt->execute([$userId]);
    $recentBadges = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return [
        'streak' => [
            'current' => (int)$streak['current_streak'],
            'longest' => (int)$streak['longest_streak'],
            'lastActivity' => $streak['last_activity_date']
        ],
        'testsCompleted' => (int)$tests['total'],
        'badgesEarned' => (int)$badgesCount['count'],
        'recentBadges' => $recentBadges
    ];
}

function recordTestCompletion($pdo, $userId, $testId) {
    $today = date('Y-m-d');
    $newBadges = [];

    // Update or insert activity for today
    $stmt = $pdo->prepare('
        INSERT INTO user_activity (user_id, activity_date, tests_completed)
        VALUES (?, ?, 1)
        ON DUPLICATE KEY UPDATE tests_completed = tests_completed + 1
    ');
    $stmt->execute([$userId, $today]);

    // Update streak
    $stmt = $pdo->prepare('SELECT current_streak, last_activity_date FROM user_streaks WHERE user_id = ?');
    $stmt->execute([$userId]);
    $streakData = $stmt->fetch(PDO::FETCH_ASSOC);

    $currentStreak = (int)($streakData['current_streak'] ?? 0);
    $lastActivity = $streakData['last_activity_date'];

    if ($lastActivity === $today) {
        // Already active today, no streak change
    } elseif ($lastActivity === date('Y-m-d', strtotime('-1 day'))) {
        // Consecutive day
        $currentStreak++;
    } else {
        // Streak broken, start new
        $currentStreak = 1;
    }

    // Update streak in DB
    $stmt = $pdo->prepare('
        UPDATE user_streaks
        SET current_streak = ?,
            longest_streak = GREATEST(longest_streak, ?),
            last_activity_date = ?
        WHERE user_id = ?
    ');
    $stmt->execute([$currentStreak, $currentStreak, $today, $userId]);

    // Get total tests completed
    $stmt = $pdo->prepare('SELECT COALESCE(SUM(tests_completed), 0) as total FROM user_activity WHERE user_id = ?');
    $stmt->execute([$userId]);
    $totalTests = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Check for new badges
    $newBadges = checkAndAwardBadges($pdo, $userId, $totalTests, $currentStreak, $testId);

    return [
        'success' => true,
        'streak' => $currentStreak,
        'totalTests' => $totalTests,
        'newBadges' => $newBadges
    ];
}

function checkAndAwardBadges($pdo, $userId, $totalTests, $currentStreak, $testId) {
    $newBadges = [];

    // Get all badges user doesn't have
    $stmt = $pdo->prepare('
        SELECT b.* FROM badges b
        WHERE b.id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = ?)
    ');
    $stmt->execute([$userId]);
    $availableBadges = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($availableBadges as $badge) {
        $earned = false;

        switch ($badge['category']) {
            case 'tests':
                if ($totalTests >= $badge['threshold']) {
                    $earned = true;
                }
                break;
            case 'streak':
                if ($currentStreak >= $badge['threshold']) {
                    $earned = true;
                }
                break;
        }

        if ($earned) {
            // Award badge
            $stmt = $pdo->prepare('INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)');
            $stmt->execute([$userId, $badge['id']]);

            if ($pdo->rowCount() > 0) {
                $newBadges[] = [
                    'code' => $badge['code'],
                    'name' => $badge['name'],
                    'description' => $badge['description'],
                    'icon' => $badge['icon']
                ];
            }
        }
    }

    return $newBadges;
}

function getAllBadges($pdo, $userId) {
    $stmt = $pdo->prepare('
        SELECT
            b.code, b.name, b.description, b.icon, b.threshold, b.category,
            CASE WHEN ub.id IS NOT NULL THEN 1 ELSE 0 END as earned,
            ub.earned_at
        FROM badges b
        LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = ?
        ORDER BY b.category, b.threshold
    ');
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
