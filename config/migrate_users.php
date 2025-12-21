<?php
require_once 'db_connect.php';

try {
    // Check if users table exists and has old structure
    $stmt = $conn->prepare("SHOW TABLES LIKE 'users'");
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        // Check if first_name column exists
        $stmt = $conn->prepare("SHOW COLUMNS FROM users LIKE 'first_name'");
        $stmt->execute();
        
        if ($stmt->rowCount() == 0) {
            // Table exists but doesn't have new structure - add columns
            echo "Adding new columns to users table...\n";
            
            // Add new columns
            $conn->exec("ALTER TABLE users ADD COLUMN first_name VARCHAR(50) AFTER password");
            $conn->exec("ALTER TABLE users ADD COLUMN last_name VARCHAR(50) AFTER first_name");
            $conn->exec("ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER last_name");
            $conn->exec("ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER phone");
            $conn->exec("ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at");
            
            // Convert user_type to role
            $conn->exec("ALTER TABLE users ADD COLUMN role ENUM('admin', 'student') DEFAULT 'student' AFTER user_type");
            
            // Migrate existing data
            $conn->exec("UPDATE users SET role = user_type WHERE user_type IS NOT NULL");
            
            // Split name into first_name and last_name for existing users
            $conn->exec("UPDATE users SET 
                first_name = CASE 
                    WHEN name IS NOT NULL AND name != '' THEN 
                        CASE 
                            WHEN LOCATE(' ', name) > 0 THEN TRIM(SUBSTRING(name, 1, LOCATE(' ', name) - 1))
                            ELSE name
                        END
                    ELSE 'User'
                END,
                last_name = CASE 
                    WHEN name IS NOT NULL AND name != '' AND LOCATE(' ', name) > 0 THEN 
                        TRIM(SUBSTRING(name, LOCATE(' ', name) + 1))
                    ELSE 'Name'
                END
            WHERE first_name IS NULL");
            
            // Remove old columns
            $conn->exec("ALTER TABLE users DROP COLUMN user_type");
            $conn->exec("ALTER TABLE users DROP COLUMN name");
            $conn->exec("ALTER TABLE users DROP COLUMN roll_number");
            
            echo "✅ Users table structure updated successfully!\n";
        } else {
            echo "✅ Users table already has new structure!\n";
        }
    } else {
        // Create new users table
        echo "Creating new users table...\n";
        
        $conn->exec("CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'student') DEFAULT 'student',
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");
        
        echo "✅ Users table created successfully!\n";
    }
    
    // Insert default admin user if not exists
    $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    $stmt->execute();
    
    if ($stmt->fetchColumn() == 0) {
        echo "Creating default admin user...\n";
        
        $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, 'admin', 'Admin', 'User')");
        $stmt->execute(['admin@hms.com', $adminPassword]);
        
        echo "✅ Default admin user created: admin@hms.com / admin123\n";
    }
    
    echo "✅ Database migration completed successfully!\n";
    
} catch (PDOException $e) {
    echo "❌ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>