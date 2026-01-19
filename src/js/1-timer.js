
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

//доступ до елементів в DOM
const refs = {
  input: document.querySelector("#datetime-picker"),
  startBtn: document.querySelector("[data-start]"),
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};

//забороняємо натискання кнопки "Start" до вибору дати
refs.startBtn.disabled = true;

//змінна для збереження вибраної дати користувачем
let userSelectedDate = null;


const options = {
  enableTime: true,           //увімкнення вибору часу
  time_24hr: true,            //24-годинний формат часу
  defaultDate: new Date(),    //встановлення поточної дати за замовчуванням
  minuteIncrement: 1,         //крок збільшення хвилин
  
  onClose(selectedDates) {    //функція, що виконується при закритті календаря
    const now = new Date();
    const selectedDate = selectedDates[0];
    
    // Якщо дата не в майбутньому - показуємо повідомлення і блокуємо кнопку
    if (selectedDate <= now) {
      userSelectedDate = null;
      refs.startBtn.disabled = true;

      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "center",
        timeout: 3000,
        closeOnEscape: true,
        closeOnClick: true,
        overlay: true
      });

      return;
    } else {
      //зберігаємо вибрану дату і розблоковуємо кнопку
      userSelectedDate = selectedDate;
      refs.startBtn.disabled = false;
    }
  },
};

//Ініціалізація flatpickr на елементі input з вказаними опціями   
flatpickr(refs.input, options);

//обробник кліку по кнопці "Start"
refs.startBtn.addEventListener("click", onStart);
function onStart() {

  //запобігаємо запуск таймера, якщо дата не вибрана
  if (!userSelectedDate) return;

  //блокуємо кнопку "Start" і поле вводу після запуску таймера
  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  // показуємо актуальний залишок часу (без очікування 1 секунди)
  updateTimer(userSelectedDate - new Date());

  // Запускаємо інтервал
  timerId = setInterval(() => {
   
    const delta = userSelectedDate - new Date();

    if (delta <= 0) {
      // якщо час вийшов, зупиняємо таймер
      clearInterval(timerId);
      timerId = null;

      // встановлюємо всі значення таймера в 0
      setTimerValues({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      
      refs.input.disabled = false;    // розблоковуємо поле вводу дати      
      userSelectedDate = null;        // скидаємо вибрану дату
      refs.startBtn.disabled = true;  // блокуємо кнопку "Start" до нового вибору дати

      return;
    }

    updateTimer(delta);
  }, 1000);
}

// оновлюємо таймер
function updateTimer(ms) {
  const time = convertMs(ms);
  setTimerValues(time);
}

// оновлення в DOM з форматуванням
function setTimerValues({ days, hours, minutes, seconds }) {
  refs.days.textContent = String(days); // дні можуть бути > 2 цифр
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

// функція додавання провідного нуля
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// функція конвертації мс у дні/год/хв/сек
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}