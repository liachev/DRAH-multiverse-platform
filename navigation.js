/**
 * Basic navigation script for the Multiverse Platform Simplified theme
 */
(function() {
    const siteNavigation = document.getElementById('site-navigation');
    const button = document.querySelector('.menu-toggle');

    // Return early if the navigation or button don't exist.
    if (!siteNavigation || !button) {
        return;
    }

    // Toggle navigation when button is clicked
    button.addEventListener('click', function() {
        siteNavigation.classList.toggle('toggled');
        
        if (button.getAttribute('aria-expanded') === 'true') {
            button.setAttribute('aria-expanded', 'false');
        } else {
            button.setAttribute('aria-expanded', 'true');
        }
    });
})();
