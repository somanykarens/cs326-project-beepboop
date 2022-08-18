// imports


// UI Components
//  - We grab the DOM elements we need to work with to make our code cleaner.
const aboutElement = document.getElementById('about');
const aboutNavLink = document.getElementById('about-nav-link');
const dynamicElement = document.getElementById('dynamic-view-details');
const dynamic1Link = document.getElementById('dynamic1');
const dynamic2Link = document.getElementById('dynamic2');
const dynamic3Link = document.getElementById('dynamic3');

const fillerText = "Next level selfies cronut ethical. Tofu tumblr you probably haven't heard of them, man braid literally forage swag chillwave. Pug yr flannel tumeric. Coloring book yr chillwave snackwave, shoreditch shaman gentrify typewriter tumeric DIY copper mug small batch. Scenester waistcoat YOLO hexagon kombucha poke 8-bit meditation. Selvage scenester forage williamsburg. Hoodie fingerstache tacos mustache, hashtag quinoa next level sartorial craft beer retro disrupt lo-fi.";

aboutNavLink.addEventListener('click', () => {
    aboutElement.innerText = 'Filler text ... ' + fillerText;
});

dynamic1Link.addEventListener('click', () => {
    dynamicElement.innerText = 'trying to do something 1';
});

dynamic2Link.addEventListener('click', () => {
    dynamicElement.innerText = 'trying to do something 2';
});

dynamic3Link.addEventListener('click', () => {
    dynamicElement.innerText = 'trying to do something 3';
});