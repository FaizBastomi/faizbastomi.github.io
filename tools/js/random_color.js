document.addEventListener("DOMContentLoaded", () => {
    let button = document.getElementById("generate");
    let copy = document.getElementById("copy");
    let textBox = document.getElementById("result");

    /** Generate random hex */
    function generate() {
        let bg_colour = Math.floor(Math.random() * 16777215).toString(16);
        bg_colour = "#" + ("000000" + bg_colour).slice(-6);
        document.querySelector("body").setAttribute(`style`, `background-color: ${bg_colour};`);
        textBox.setAttribute('value', bg_colour.slice(1));
    }

    /** Copy to clipboard */
    function copyClipboard() {
        textBox.select();
        navigator.clipboard.writeText("#" + textBox.value);
    }
    button.addEventListener("click", generate);
    copy.addEventListener("click", copyClipboard);
    generate();
});