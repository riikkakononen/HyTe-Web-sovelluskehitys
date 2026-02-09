-- Drop the database if it exists and then create it (root account needed)
DROP DATABASE IF EXISTS AlignmentGuide;
CREATE DATABASE AlignmentGuide;

USE AlignmentGuide;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_level VARCHAR(10) DEFAULT 'regular'
);

CREATE TABLE DiaryEntries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    mood VARCHAR(50),
    weight DECIMAL(5,2),
    sleep_hours INT,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE MentalHealth (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    mood VARCHAR(50),
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE PhysicalHealth (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    symptoms TEXT,
    energy_level VARCHAR(50),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Insert sample data

INSERT INTO Users (username, password, email, created_at, user_level) VALUES
('johndoe', 'hashed_password', 'johndoe@example.com', '2024-01-01 09:00:00', 'regular'),
('janedoe', 'hashed_password', 'janedoe@example.com', '2024-01-02 10:00:00', 'admin'),
('alice_jones', 'hashed_password', 'alice@example.com', '2024-01-04 08:30:00', 'regular');

INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes, created_at) VALUES
(1, '2024-01-10', 'Happy', 70.5, 8, 'Had a great workout session', '2024-01-10 20:00:00'),
(2, '2024-01-11', 'Satisfied', 65.0, 7, 'Met with friends, had a good time', '2024-01-11 21:00:00'),
(3, '2024-01-12', 'Tired', 68.0, 6, 'Work was demanding', '2024-01-12 22:00:00');

INSERT INTO MentalHealth (user_id, entry_date, mood, notes, created_at) VALUES
(1, '2026-02-08', 'happy', 'Had a great day, felt energetic', '2026-02-08 20:00:00'),
(2, '2026-02-07', 'tired', 'Long day at work, need rest', '2026-02-07 22:16:58'),
(3, '2026-02-05', 'stressed', 'Busy day, a bit stressed out', '2026-02-05 22:22:22');

INSERT INTO PhysicalHealth (user_id, entry_date, symptoms, energy_level, created_at) VALUES
(1, '2026-02-08', 'headache', 'low', '2026-02-08 22.30.39'),
(2, '2026-02-08', 'feeling good', 'high', '2026-02-08 22.30.39'),
(3, '2026-02-08', 'fever, runny nose', 'low', '2026-02-08 22.30.39');

-- Query Examples

UPDATE PhysicalHealth SET energy_level = 'medium' WHERE user_id = 2;
SELECT user_id, mood, notes FROM MentalHealth WHERE entry_date LIKE '2024%';
DELETE FROM DiaryEntries WHERE entry_id = 3;