function setGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const date = now.getDate();
    const month = now.getMonth();
    
    let greeting = '';
    let message = '';
    
    // Time-based greetings
    if (hour >= 4 && hour < 5) {
        greeting = 'Early bird!';
        message = 'The world is still sleeping...';
    } else if (hour >= 5 && hour < 7) {
        greeting = 'Good dawn';
        message = 'A new day begins!';
    } else if (hour >= 7 && hour < 12) {
        greeting = 'Good morning';
        message = 'Hope you have a productive day!';
    } else if (hour >= 12 && hour < 13) {
        greeting = 'Good noon';
        message = 'Time for a break?';
    } else if (hour >= 13 && hour < 17) {
        greeting = 'Good afternoon';
        message = 'How is your day going?';
    } else if (hour >= 17 && hour < 19) {
        greeting = 'Good evening';
        message = 'The day is winding down';
    } else if (hour >= 19 && hour < 22) {
        greeting = 'Good night';
        message = 'Hope you had a great day!';
    } else if (hour >= 22 && hour < 24) {
        greeting = 'Late night hours';
        message = 'Time to rest soon?';
    } else {
        greeting = 'Burning the midnight oil';
        message = 'Don\'t stay up too late!';
    }
    
    // Day-based messages
    if (day === 0) { // Sunday
        message += ' Enjoy your Sunday!';
    } else if (day === 5) { // Friday
        message += ' Happy Friday!';
    } else if (day === 6) { // Saturday
        message += ' Have a wonderful weekend!';
    }
    
    // Special dates
    if (month === 11 && date === 25) { // Christmas
        message = 'Merry Christmas!';
    } else if (month === 0 && date === 1) { // New Year
        message = 'Happy New Year!';
    } else if (month === 9 && date === 31) { // Halloween
        message = 'Happy Halloween!';
    }
    
    // Weather-based (simulated)
    const weatherTypes = ['sunny', 'cloudy', 'rainy', 'windy'];
    const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    message += ` It's a ${randomWeather} day.`;
    
    // Update the DOM
    const greetingElement = document.getElementById('greeting-text');
    if (greetingElement) {
        greetingElement.textContent = greeting;
    }
    
    const messageElement = document.getElementById('additional-message');
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    // Update time display
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setGreeting();
    setInterval(setGreeting, 60000);
});