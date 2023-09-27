// Powered by Quotable
// https://github.com/lukePeavey/quotable

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const quote = document.querySelector("q.small i");

    async function updateQuote() {
        // Fetch a random quote from Quotable API
        const response = await fetch("https://api.quotable.io/quotes/random?maxLength=70");
        const data = await response.json();
        if (response.ok) {
            // update DOM Elements
            quote.textContent = data[0].content;
        } else {
            console.log(data);
        }
    }

    updateQuote();
});