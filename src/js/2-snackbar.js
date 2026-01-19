import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

form.addEventListener("submit", onFormSubmit);

//функція обробки відправки форми
function onFormSubmit(event) {
  event.preventDefault();

  // дістаємо значення
  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  // викликаємо функцію створення промісу
   createPromise(delay, state)
    .then((delayValue) => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${delayValue}ms`,
        position: "topRight",
        timeout: 5000
      });
    })
    .catch((delayValue) => {
      iziToast.error({
        message: `❌ Rejected promise in ${delayValue}ms`,
        position: "topRight",
        timeout: 5000
      });
    });

    form.reset(); // очищуємо форму після відправки  
}


  // функція створення промісу
function createPromise(delay, state) {
    
        return new Promise((resolve, reject) => {
            // створюємо таймер, який спрацює через delay мс
            setTimeout(() => {
            // залежно від state виконуємо resolve або reject
            if (state === "fulfilled") {
                resolve(delay); 
            } else {
                reject(delay); 
            }
          }, delay);
        });
    }

  




