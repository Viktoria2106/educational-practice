CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    weight DECIMAL(6,2) NOT NULL CHECK (weight >= 0),
    sets INTEGER NOT NULL CHECK (sets BETWEEN 1 AND 100),
    reps INTEGER NOT NULL CHECK (reps >= 1),
    workout_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE INDEX idx_workouts_date ON workouts(workout_date);
CREATE INDEX idx_workouts_user ON workouts(user_id);
CREATE INDEX idx_workouts_exercise ON workouts(exercise_id);


INSERT OR IGNORE INTO users (username) VALUES ('default_user');


INSERT OR IGNORE INTO exercises (name) VALUES 
    ('Жим лежа'),
    ('Приседания со штангой'),
    ('Становая тяга'),
    ('Тяга штанги в наклоне'),
    ('Жим ногами'),
    ('Подтягивания');


INSERT INTO workouts (user_id, exercise_id, weight, sets, reps, workout_date) VALUES
(1, (SELECT id FROM exercises WHERE name = 'Жим лежа'), 80.0, 3, 8, DATE('now')),
(1, (SELECT id FROM exercises WHERE name = 'Приседания со штангой'), 100.0, 4, 6, DATE('now')),
(1, (SELECT id FROM exercises WHERE name = 'Тяга штанги в наклоне'), 65.0, 3, 10, DATE('now', '-1 day')),
(1, (SELECT id FROM exercises WHERE name = 'Становая тяга'), 120.0, 3, 5, DATE('now', '-2 days')),
(1, (SELECT id FROM exercises WHERE name = 'Жим ногами'), 150.0, 3, 12, DATE('now', '-3 days'));

SELECT DISTINCT workout_date 
FROM workouts 
ORDER BY workout_date;