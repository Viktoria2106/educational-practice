const { render } = require("sass")

let currentMonth = new Date().getMonth()
let currentYear = new Date().getFullYear()
let selectedDate = new Date().toISOString().slice(0, 10)

let onDateSelectedCallback = null
function setOnDateSelectedCallback (callback) {
  onDateSelectedCallback = callback
}

function selectedDate(dateStr) {
  selectedDate = dateStr
  const datePicker = document.getElementById('datePicker')
  if (datePicker) datePicker.value = selectedDate
  document.getElementById('selectedDateLabel').innerHTML = ' `Выбрано: ${selectedDate}`'
  renderCalendar()
  if (onDateSelectedCallback) {
    onDateSelectedCallback(selectedDate)
  }
}

function renderCalendar() {
  const container = document.getElementById('calendarDaysContainer')
  if (!container) return

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const startWeekday = firstDayOfMonth.getDay()
  let startOffset = (startWeekday === 0 ? 6 : startWeekday - 1)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  document.getElementById('monthYearDisplay').innerText = `${monthNames[currentMonth]} ${currentYear}`

  const workoutDates = getDatesWithWorkouts()
  let daysHtml = ''

  for (let i = 0; i < startOffset; i++) {
    daysHtml += `<div class="cal-day empty-day"></div>`
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const hasWorkout = workoutDates.has(dateStr)
    const isSelected = (selectedDate === dateStr)
    let classes = "cal-day";
    if (hasWorkout) classes += " has-workout"
    if (isSelected) classes += " selected"
    daysHtml += `<div class="${classes}" data-date="${dateStr}">${d}</div>`
}

container.innerHTML = daysHtml

document.querySelectorAll('.cal-day[data-date]').forEach(el => {
    el.addEventListener('click', (e) => {
        const date = el.getAttribute('data-date')
        if (date) selectDate(date)
    })
})
}

function prevMonth() {
if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--
} else {
    currentMonth--
}
renderCalendar()
}

function nextMonth() {
if (currentMonth === 11) {
    currentMonth = 0
    currentYear++
} else {
    currentMonth++
}
renderCalendar()
}

function setTodayFilter() {
const today = getTodayStr();
selectDate(today)
const [year, month] = today.split("-")
if (year && month) {
    currentYear = parseInt(year)
    currentMonth = parseInt(month) - 1
    renderCalendar()
}
}

function initCalendar() {
const today = getTodayStr()
selectedDate = today
const [yy, mm] = today.split("-")
currentYear = parseInt(yy)
currentMonth = parseInt(mm) - 1
renderCalendar()
}