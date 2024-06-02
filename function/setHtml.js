export function setHtml(selector, html, replace = true) {
    const element = document.querySelector(selector);
    if (element) {
      if (replace) {
        element.innerHTML = html;
      } else {
        element.innerHTML += html;
      }
    } else {
      console.error(`Element with selector "${selector}" not found.`);
    }
  }
  
  // Example usage:
  // Set the HTML content of an element with the selector "#myElement" to "Hello, World!"
//   setHtml("#myElement", "Hello, World!");
  
  // Example usage to add HTML content to the existing content:
//   setHtml("#myElement", "<br>How are you?", false);
  

