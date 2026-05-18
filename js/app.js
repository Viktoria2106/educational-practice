// Главный файл приложения

function bindEvents() {
  document.getElementById("addWorkoutBtn")?.addEventListener("click", () => {
      const exercise = document.getElementById("exerciseName").value;
      const weight = document.getElementById("weight").value;
      const sets = document.getElementById("setsCount").value;
      const reps = document.getElementById("repsPerSet").value;
      let date = document.getElementById("datePicker").value;
      if (!date) date = selectedDate;
      
      if (addWorkout(exercise, weight, sets, reps, date)) {
          // Очищаем поле упражнения, остальные поля оставляем
          document.getElementById("exerciseName").value = "";
          
          // Обновляем отображение
          selectDate(date);
          const [yy, mm] = date.split("-");
          if (yy && mm) {
              currentYear = parseInt(yy);
              currentMonth = parseInt(mm) - 1;
              renderCalendar();
          }
          renderWorkoutTable(); // ЯВНО ОБНОВЛЯЕМ ТАБЛИЦУ
          updateStats();
      }
  });
  
  document.getElementById("prevMonthBtn")?.addEventListener("click", () => {
      prevMonth();
      // prevMonth уже вызывает renderCalendar и колбэк
  });
  
  document.getElementById("nextMonthBtn")?.addEventListener("click", () => {
      nextMonth();
  });
  
  document.getElementById("filterTodayBtn")?.addEventListener("click", () => {
      setTodayFilter();
  });
  
  document.getElementById("clearAllBtn")?.addEventListener("click", () => {
      if (deleteAllWorkouts()) {
          renderAll();
      }
  });
  
  document.getElementById("exportBtn")?.addEventListener("click", () => {
      exportAllCSV();
  });
}

function init() {
  loadData();
  initCalendar();
  
  // Устанавливаем колбэк для обновления таблицы при выборе даты
  setOnDateSelectedCallback(function(date) {
      renderWorkoutTable();
      updateStats();
  });
  
  bindEvents();
  initDatePickerSync();
  renderAll();
}

// Запуск приложения
init();