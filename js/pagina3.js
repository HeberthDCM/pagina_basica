document.addEventListener('DOMContentLoaded', function() {
    const selectorColor = document.getElementById('selector-color');
    
    selectorColor.addEventListener('change', function() {
        const color = this.value;
        document.querySelector('.main-content').style.backgroundColor = color;
    });
});