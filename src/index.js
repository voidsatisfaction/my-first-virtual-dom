import './style.css';
import Please from 'pleasejs';

if (module.hot) {
  module.hot.accept();
}

const div = document.getElementById('color');
const button = document.getElementById('button');

function changeColor() {
  div.style.backgroundColor = Please.make_color();
}

button.addEventListener('click', changeColor);