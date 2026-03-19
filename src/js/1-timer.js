


//find input
const dateTimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");


startButton.disabled = true; //disable button by default

//Hier we save user selected date
let userSelectedDate = null;

//settings for flatpickr
const options = {
  enableTime: true,       // дозволяє вибір часу
  time_24hr: true,        // 24-годинний формат
  defaultDate: new Date(),// поточна дата за замовчуванням
  minuteIncrement: 1,     // крок хвилин
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const now = new Date();

    if (selectedDate <= now) {
      iziToast.error({
  title: "Error",
  message: "Please choose a date in the future",
  position: "topRight",
});

      startButton.disabled = true; // disable button if date is in the past
      userSelectedDate = null; // reset user selected date
    } else {
     

      startButton.disabled = false; // enable button if date is valid
      userSelectedDate = selectedDate; // save user selected date
    }
  },
};

//initialize flatpickr
flatpickr(dateTimePicker, options);

let timerId = null;
startButton.addEventListener("click", onStartClick);

function onStartClick() {
  // блокуємо
  startButton.disabled = true;
  dateTimePicker.disabled = true;


  // запускаємо таймер
  timerId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimerUI(0);
      dateTimePicker.disabled = false;
      return;
    }
        updateTimerUI(diff);
  }, 1000);
}

function updateTimerUI(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// форматування
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// конвертація часу
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
