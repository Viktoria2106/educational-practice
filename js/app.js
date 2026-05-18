function bindEvents() {
  document.getElementById("addWorkoutBtn")?.addEventListener("click", () => {
      const exercise = document.getElementById("exerciseName").value
      const weight = document.getElementById("weight").value
      const sets = document.getElementById("setsCount").value
      const reps = document.getElementById("repsPerSet").value
      let date = document.getElementById("datePicker").value
      if (!date) date = selectedDate;
      
      if (addWorkout(exercise, weight, sets, reps, date)) {
          document.getElementById("exerciseName").value = ""

          selectDate(date)
          const [yy, mm] = date.split("-")
          if (yy && mm) {
              currentYear = parseInt(yy)
              currentMonth = parseInt(mm) - 1
              renderCalendar()
          }
          renderWorkoutTable()
          updateStats()
      }
  })
  
  document.getElementById("prevMonthBtn")?.addEventListener("click", () => {
      prevMonth()
  })
  
  document.getElementById("nextMonthBtn")?.addEventListener("click", () => {
      nextMonth()
  })
  
  document.getElementById("filterTodayBtn")?.addEventListener("click", () => {
      setTodayFilter()
  })
  
  document.getElementById("clearAllBtn")?.addEventListener("click", () => {
      if (deleteAllWorkouts()) {
          renderAll()
      }
  })
  
  document.getElementById("exportBtn")?.addEventListener("click", () => {
      exportAllCSV()
  })
}

function init() {
  loadData()
  initCalendar()
  
  setOnDateSelectedCallback(function(date) {
      renderWorkoutTable()
      updateStats()
  })
  
  bindEvents()
  initDatePickerSync()
  renderAll()
}

init()