document.addEventListener("scroll", function() {
        let jumbotron = document.getElementById("jumbocome");
        let scrollY = window.scrollY;
        let targetTop = Math.max(30 - scrollY * 0.1, 10);
        jumbotron.style.top = targetTop + "%";
});

