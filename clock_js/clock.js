const hours = document.querySelector('#hours'),
      minutes = document.querySelector('#minutes'),
      seconds = document.querySelector('#seconds');
setInterval(() => {
    const time = new Date()
    hours.textContent = (time.getHours() < 10) ? `0${time.getHours()}` : time.getHours();
    minutes.textContent = (time.getMinutes() < 10) ? `0${time.getMinutes()}` : time.getMinutes();
    seconds.textContent = (time.getSeconds() < 10) ? `0${time.getSeconds()}` : time.getSeconds();
}, 1000);