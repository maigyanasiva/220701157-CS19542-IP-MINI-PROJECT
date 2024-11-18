document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeBtn = document.getElementById('close-btn');
    const scrollProgress = document.getElementById('scrollProgress');

    // Open sidebar when hamburger icon is clicked
    hamburgerIcon.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    // Close sidebar when the close button is clicked
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // Vertical Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.height = `${scrolled}%`; // Adjust the height instead of width
    });
});
