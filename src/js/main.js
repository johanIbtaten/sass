import 'jquery';
import { sayHello } from './modules/greeting';
import { sum, product } from './modules/math-functions';
//import { showAlert } from "./modules/notLazyLoaded";
import css from '@scss/main.scss';
import lily from '@img/lily.jpg';
import pirate from '@img/pirate.svg';
import profits from '@img/profits.svg';
import shield from '@img/shield.svg';
import todolist from '@img/todolist.svg';

const btn = document.querySelector('.btn');
const title = document.querySelector('.title');

const img = document.createElement('img');
img.src = lily;

title.appendChild(img);

var active = false

btn.addEventListener('click', function () {
    active = !active
    if (active) {
        btn.style.color = 'red'
        title.style.color = 'blue'
    } else {
        btn.style.color = 'black'
        title.style.color = 'black'
    }
})


const resultGreeting = $('#resultGreeting');
const resultSum = $('#resultSum');
const resultProduct = $('#resultProduct');

const a = 3;
const b = 7;

console.log('salut');

document.getElementById('button').addEventListener('click', function () {
    import('./modules/print').then(module => {
        const print = module.default;
        print();
    })
});


resultGreeting.text(sayHello('Nice to see you! 🙂'));
resultSum.text('The sum of ' + a + ' and ' + b + ' is ' + sum(a, b) + '. ✨');
resultProduct.text('The product of ' + a + ' and ' + b + ' is ' + product(a, b) + '. 🚀');

/*
    const alertBtn = document.querySelector("#alert");
    const lazyAlertBtn = document.querySelector("#lazyAlert");

    alertBtn.addEventListener("click", () => {
        showAlert();
    });

    lazyAlertBtn.addEventListener("click", () => {
        import( './modules/lazyLoaded').then(module => {
            module.showLazyAlert();
        });
    });
*/


