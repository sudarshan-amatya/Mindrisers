// Get current file name
const file = window.location.pathname.split("/").pop();

// Extract page number (page1.html → 1)
let pageNum = parseInt(file.replace("page", "").replace(".html", "")) || 1;

// Select all page links
const links = document.querySelectorAll(".pagination a");

// Remove active from all
links.forEach(link => link.classList.remove("active"));

// Add active to the correct page
links[pageNum - 1].classList.add("active");

// Prev & Next buttons
const prevBtn = document.querySelector(".btn1"); 
const nextBtn = document.querySelector(".btn2");

// Set Prev
if (pageNum > 1) {
    prevBtn.onclick = () => {
        window.location.href = `page${pageNum - 1}.html`;
    };
} else {
    prevBtn.disabled = true;
}

// Set Next
if (pageNum < 5) { // total pages
    nextBtn.onclick = () => {
        window.location.href = `page${pageNum + 1}.html`;
    };
} else {
    nextBtn.disabled = true;
}
