// const sidebar = document.getElementById("sidebar");

function toggleSubMenu(event) {
    // Get the clicked element (span)
   let clickedElement = event.target;
console.log(clickedElement);
    // If the clicked element is not the <span>, find its closest parent <span>
    if (clickedElement.tagName !== 'a') {
        clickedElement = clickedElement.closest('a');
    }

     // Ensure clickedElement is not null before proceeding
     if (clickedElement) {
        // Check if the next sibling of the clicked element is a submenu
        const nextElement = clickedElement.nextElementSibling;
        if (nextElement && nextElement.classList.contains('sub-menu')) {
            // Toggle the visibility of the submenu
            nextElement.classList.toggle("open");
        }
    }
  
}

// sidebar.getElementById("click",toggleSubMenu)


function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
    window.addEventListener("hashchange",function(){
        const sidebar = document.getElementById("sidebar");
        sidebar.classList.remove("open")
    })
}



