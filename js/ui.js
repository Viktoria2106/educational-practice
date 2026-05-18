// Модуль отрисовки интерфейса

function renderWorkoutTable() {
  const tbody = document.getElementById("tableBody");
  if (!tbody) return;
  
  // Используем selectedDate из calendar.js (доступна глобально)
  const currentDate = typeof selectedDate !== 'undefined' ? selectedDate : getTodayStr();
  const workoutsOfDay = getWorkoutsByDate(currentDate);
  
  if (workoutsOfDay.length === 0) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="4">🏋️‍♀️ Нет упражнений на ${currentDate}. Добавьте через форму!</td></tr>`;
      return;
  }
  
  let html = "";
  for (let w of workoutsOfDay) {
      html += `<table>
                  <td><strong>${escapeHtml(w.exercise)}</strong></td>
                  <td>${w.weight} кг</td>
                  <td><span class="sets-badge">${w.sets} подходов × ${w.reps} повтор.</span></td>
                  <td><button class="delete-single-btn" data-id="${w.id}" style="background:none; width:auto; padding:5px 10px; cursor:pointer;">🗑️</button></td>
                </tr>`;
  }
  tbody.innerHTML = html;
  
  document.querySelectorAll('.delete-single-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          if (!isNaN(id)) {
              deleteWorkoutById(id);
              renderAll();
          }
      });
  });
}

// Функция обновления статистики
function updateStats() {
  document.getElementById("statsBadge").innerHTML = `📊 Всего упражнений: ${getWorkoutsCount()}`;
}

// ПОЛНОЕ ОБНОВЛЕНИЕ ВСЕГО ИНТЕРФЕЙСА
function renderAll() {
  renderCalendar();
  renderWorkoutTable();
  updateStats();
  
  const datePicker = document.getElementById("datePicker");
  if (datePicker && datePicker.value !== selectedDate) {
      datePicker.value = selectedDate;
  }
}

// Синхронизация datePicker
function initDatePickerSync() {
  const datePicker = document.getElementById("datePicker");
  if (datePicker) {
      datePicker.value = selectedDate;
      datePicker.addEventListener("change", (e) => {
          const newDate = e.target.value;
          if (newDate) {
              selectDate(newDate);
              const [year, month] = newDate.split("-");
              if (year && month) {
                  currentYear = parseInt(year);
                  currentMonth = parseInt(month) - 1;
                  renderCalendar();
                  renderWorkoutTable(); // ЯВНО ОБНОВЛЯЕМ ТАБЛИЦУ
              }
          }
      });
  }
}

// Экспорт в CSV
function exportAllCSV() {
  if (getWorkoutsCount() === 0) {
      alert("Нет данных для экспорта");
      return;
  }
  let csvRows = [["Упражнение", "Вес(кг)", "Подходы", "Повторений", "Дата"]];
  for (let w of workouts) {
      csvRows.push([w.exercise, w.weight, w.sets, w.reps, w.date]);
  }
  const csv = csvRows.map(row => row.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = "training_diary.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}