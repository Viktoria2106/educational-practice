// Модель данных (хранилище)

const STORAGE_KEY = "ironSingleEntryDiary";
let workouts = [];  // массив объектов { id, exercise, weight, sets, reps, date }

function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            workouts = JSON.parse(stored);
            if (!workouts.every(w => w.id)) {
                workouts = workouts.map((w, idx) => ({ ...w, id: w.id || Date.now() + idx }));
                saveData();
            }
        } catch (e) {
            workouts = [];
        }
    }
    if (workouts.length === 0) {
        const today = getTodayStr();
        const yesterday = getDateStr(-1);
        workouts = [
            { id: Date.now() + 1, exercise: "Жим лежа", weight: 80, sets: 3, reps: 8, date: today },
            { id: Date.now() + 2, exercise: "Приседания со штангой", weight: 100, sets: 4, reps: 6, date: today },
            { id: Date.now() + 3, exercise: "Тяга штанги в наклоне", weight: 65, sets: 3, reps: 10, date: yesterday },
        ];
        saveData();
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function addWorkout(exercise, weight, sets, reps, date) {
    if (!exercise || exercise.trim() === "") {
        alert("Введите название упражнения");
        return false;
    }
    let w = parseFloat(weight);
    let s = parseInt(sets, 10);
    let r = parseInt(reps, 10);
    if (isNaN(w) || w < 0) {
        alert("Введите корректный вес");
        return false;
    }
    if (isNaN(s) || s < 1 || s > 100) {
        alert("Количество подходов должно быть от 1 до 100");
        return false;
    }
    if (isNaN(r) || r < 1) {
        alert("Количество повторений должно быть больше 0");
        return false;
    }
    let validDate = date || getTodayStr();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(validDate)) validDate = getTodayStr();

    const newWorkout = {
        id: generateId(),
        exercise: exercise.trim(),
        weight: w,
        sets: s,
        reps: r,
        date: validDate
    };
    workouts.push(newWorkout);
    saveData();
    return true;
}

function deleteWorkoutById(id) {
    workouts = workouts.filter(w => w.id !== id);
    saveData();
}

function deleteAllWorkouts() {
    if (confirm("⚠️ Очистить ВСЕ записи? Отмена невозможна.")) {
        workouts = [];
        saveData();
        return true;
    }
    return false;
}

function getWorkoutsByDate(dateStr) {
    return workouts.filter(w => w.date === dateStr).sort((a, b) => a.exercise.localeCompare(b.exercise));
}

function getDatesWithWorkouts() {
    const set = new Set();
    workouts.forEach(w => set.add(w.date));
    return set;
}

function getWorkoutsCount() {
    return workouts.length;
}