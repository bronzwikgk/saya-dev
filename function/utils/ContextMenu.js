class ContextMenuManager {
    constructor() {
      // Store all registered context menus
      this.contextMenus = {};
  
      // Hide all menus when clicking anywhere
      document.addEventListener('click', () => {
        this.hideAllMenus();
      });
    }
  
    // Register a new context menu
registerMenu(elementSelector, menuId) {
    const elements = document.querySelectorAll(elementSelector);
  
    if (elements.length === 0) {
      console.warn(`Element ${elementSelector} not found`);
      return;
    }
  
    // Store the menu for later use
    this.contextMenus[menuId] = document.getElementById(menuId);
  
    // Attach right-click event listener to the elements
    elements.forEach(element => {
      element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();  // Stop event from bubbling up to parent elements
        this.showMenu(e.pageX, e.pageY, menuId);
      });
    });
  }
  
  
    // Show the specified context menu
    showMenu(x, y, menuId) {
      this.hideAllMenus();
      const menu = this.contextMenus[menuId];
  
      if (!menu) {
        console.warn(`Menu ${menuId} not registered`);
        return;
      }
  
      menu.style.top = `${y}px`;
      menu.style.left = `${x}px`;
      menu.style.display = 'block';
    }
  
    // Hide all registered context menus
    hideAllMenus() {
      Object.values(this.contextMenus).forEach((menu) => {
        menu.style.display = 'none';
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const manager = new ContextMenuManager();
    manager.registerMenu('.navbar', 'contextMenuNavbar');
    manager.registerMenu('.sidebar', 'contextMenuSidebar');
    manager.registerMenu('.editor', 'contextMenuEditor');
  });
  