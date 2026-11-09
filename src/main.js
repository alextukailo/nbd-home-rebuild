
import './style.css';

import {
  menu,
  header,
  rocket,
  scenes,
  heroTyping,
  scrollTyping,
  payments,
  contactForm,
  cookies,
} from './components';

const initScripts = {
  init: function () {
    menu();
    header();

    const rocketInstance = rocket();

    scenes(rocketInstance);
    heroTyping();
    scrollTyping();
    payments();
    contactForm();
    cookies();
  },
};

initScripts.init();
