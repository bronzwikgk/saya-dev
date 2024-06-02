class FlowBuilder {
    constructor(editorSelector) {
        this.editor = document.querySelector(editorSelector);
        this.blockCount = 0;
        this.RigtBlockCount = 1
        this.BottomBlockCount = 1
        this.addInitialBlock();
    }

    addEventListeners(block) {
        const blockId = block.id;

        // Listener for the 'add-left' button
        block.querySelector('.add-left').addEventListener('click', () => {
            this.addBlock('left', blockId);
        });

        // Listener for the 'add-bottom' button
        block.querySelector('.add-bottom').addEventListener('click', () => {
            this.addBlock('bottom', blockId);
        });

        // Listener for textarea input to adjust font size and update text count
        block.querySelector('textarea').addEventListener('input', () => {
            this.adjustFontSize(blockId);
            this.updateTextCount(blockId);
        });

        // Listener for collapse
        block.querySelector('.collapse-cell').addEventListener('click', () => {
            this.toggleBlockState(blockId, 'collapse');
        });

        // Listener for expand
        block.querySelector('.expand-cell').addEventListener('click', () => {
            this.toggleBlockState(blockId, 'expand');
        });
        
        // Listener for right-click event on the block
        block.addEventListener('contextmenu', (event) => {
            event.stopPropagation();
            this.showContextMenu(event, blockId);
        });

        // Listener for click event to hide the menu
        document.addEventListener('click', () => {
            this.hideContextMenu(blockId);
        });
    }

    addInitialBlock() {
        this.addBlock(null, null);
    }

    // adjustBlockWidths() {
    //     const blocks = this.editor.querySelectorAll('.block');
    //     const widthPercentage = 90 / blocks.length;
    //     blocks.forEach(block => {
    //         block.style.width = `${widthPercentage}%`;
    //     });
    // }

    // New method to toggle collapse and expand state of the block
    toggleBlockState(blockId, action) {
        console.log(action);
        const block = document.getElementById(blockId);
        const textarea = block.querySelector('textarea');
        const collapseBtn = block.querySelector('.collapse-cell');
        const expandBtn = block.querySelector('.expand-cell');

        if (action === 'collapse') {
            textarea.style.display = 'none';
            collapseBtn.style.display = 'none';
            expandBtn.style.display = 'inline-block';
        } else if (action === 'expand') {
            textarea.style.display = 'block';
            collapseBtn.style.display = 'inline-block';
            expandBtn.style.display = 'none';
        }
    }


    updateTextCount(blockId) {
        const block = document.getElementById(blockId);
        const textarea = block.querySelector('textarea');
        const textCountSpan = block.querySelector('.text-count');

        const textCount = textarea.value.split(/\s+/).filter(Boolean).length; // Count non-empty words
        textCountSpan.textContent = `${textCount} words`;
    }

    // adjustFontSize(blockId) {
    //     const block = document.getElementById(blockId);
    //     const textarea = block.querySelector('textarea');
    //     const wordCount = textarea.value.split(/\s+/).length;

    //     // Adjust font size based on word count (this is a basic example, you can refine the logic)
    //     if (wordCount <= 10) {
    //         textarea.style.fontSize = '1em';
    //     } else if (wordCount <= 20) {
    //         textarea.style.fontSize = '0.8em';
    //     } else {
    //         textarea.style.fontSize = '0.6em';
    //     }
    // }

    // adjustFontSize(blockId) {
    //     const block = document.getElementById(blockId);
    //     const textarea = block.querySelector('textarea');

    //     let minFontSize = 10; // minimum font size in pixels
    //     let maxFontSize = 100; // maximum font size in pixels
    //     const tolerance = 1; // tolerance in pixels

    //     for (let i = 0; i < 10; i++) { // Limit to 10 iterations for performance
    //         const currentFontSize = (minFontSize + maxFontSize) / 2;
    //         textarea.style.fontSize = `${currentFontSize}px`;

    //         const overflowAmount = textarea.scrollHeight - textarea.clientHeight;

    //         if (Math.abs(overflowAmount) <= tolerance) {
    //             // If the overflow is within our tolerance, we've found a good font size
    //             break;
    //         } else if (overflowAmount > 0) {
    //             // If there's overflow, reduce the max font size
    //             maxFontSize = currentFontSize - 1;
    //         } else {
    //             // If there's extra space, increase the min font size
    //             minFontSize = currentFontSize + 1;
    //         }
    //     }
    // }

    hidecontrolButtons(parentId,direction){
        
            const parentBlock = document.getElementById(parentId);
            
            // Hide the corresponding '+' button in the parent block
            if (direction === 'left') {
                parentBlock.querySelector('.add-left').style.display = 'none';
            } else if (direction === 'bottom') {
                parentBlock.querySelector('.add-bottom').style.display = 'none';
            }

        
    }

    addBlock(direction, parentId) {
        console.log(direction);

        this.blockCount++;
        
        const newBlock = document.createElement('div');

        // if(direction){
        //     switch (direction) {
        //         case "left":
        //             this.RigtBlockCount++
        //             newBlock.id = `block-L${this.RigtBlockCount}`;
        //             break;

        //         case "bottom":
        //             this.BottomBlockCount++
        //             newBlock.id = `block-B${this.BottomBlockCount}`;

        //         default:
        //             break;
        //     }

        // }else{
        //     newBlock.id = `block-${this.RigtBlockCount}`
        // }
        newBlock.id = `block-${this.blockCount}`
        newBlock.className = 'block';

        newBlock.innerHTML = `
        
        <header class="block-header">
          <!-- Left Section -->
          <div class="left-section">
            <i class="ri-user-fill"></i>
            <!-- User icon -->
            <span class="cell-name">Untitled1</span>
            <!-- Cell name -->
          </div>

          <!-- Middle Section (Custom Dropdown) -->
          <!-- Middle Section (Custom Dropdown) -->
          <div class="middle-section">
            <select id="template-dropdown" class="template-dropdown">
              <option value="" disabled="" selected="">
                Choose a template
              </option>
              <option value="template1">Template 1</option>
              <option value="template2">Template 2</option>
              <option value="template3">Template 3</option>
            </select>
          </div>

          <!-- Right Section -->
          <div class="right-section">
            <i class="ri-subtract-fill"></i>
            <!-- Minimize icon -->
            <i class="ri-fullscreen-fill"></i>
            <!-- Full-screen icon -->
            <i class="ri-drag-move-fill"></i>
            <!-- Drag icon -->
            <i class="ri-more-2-fill dropdown"
                ><ul class="dropdown-content">
                  <li class="dropdown">
                    <a href="#"
                      >Create <span class="nav-shortcut">Ctrl + N</span></a
                    >
                  </li>

                  <li>
                    <a id="open-file-btn"
                      >Create New Window
                      <span class="nav-shortcut">Ctrl + 0</span></a
                    >
                  </li>
                  <li>
                    <a id="open-file-btn"
                      >Open <span class="nav-shortcut">Ctrl + O</span></a
                    >
                  </li>
                </ul>
              </i>
          </div>
        </header>
        <textarea placeholder="Detail Out What you need to do...."></textarea>
        
        <!-- Footer Section -->
<div class="block-footer">
<button class="collapse-cell">
<i class="ri-arrow-up-s-line"></i>
</button>
<button class="expand-cell" style="display:none">
<i class="ri-arrow-down-s-line"></i>
</button>
<span class="text-count">0 words</span>
</div>
<div class="context-menu">
<ul>
<li class="context-menu-option">Edit <span class="shortcut"></span></li>
<li class="context-menu-option">Select cell <span class="shortcut">Ctrl + shift + S</span>
<ul class="nested-menu">
<li>Sub-option 1</li>
<li>Sub-option 2</li>
</ul></li>
<li class="context-menu-option">Copy link to cell <span class="shortcut"></span></li>
<li class="context-menu-option">Delete Cell <span class="shortcut">Ctrl + M + D</span></li>
<li class="context-menu-option">Copy cell <span class="shortcut">Ctrl+C</span></li>
<li class="context-menu-option">Cut cell <span class="shortcut">Ctrl+X</span></li>
</ul>
           </div>

        <div class="controls">
          <button class="add-left">[ <i class="ri-add-fill"></i>]</button>
          <button class="add-bottom">
            [ <i class="ri-add-fill"></i>]
          </button>
        </div>
      
        `;

        this.editor.appendChild(newBlock);

        if (parentId) {
            const parentBlock = document.getElementById(parentId);
            var computedStyle = window.getComputedStyle(parentBlock);
            var leftValue = computedStyle.getPropertyValue("left");
            var topValue = computedStyle.getPropertyValue("top");
            var leftNumber = parseFloat(leftValue);
            var topNumber = parseFloat(topValue);
            let rectLeft = parentBlock.style.left
            let rectTop = parentBlock.style.top
            console.log(rectLeft, rectTop);
            if (direction === 'left') {
                newBlock.style.left = `${leftNumber + 475}px`; // 210 = width of block + 10px gap
                newBlock.style.top = `${topNumber}px`;
            } else if (direction === 'bottom') {
                newBlock.style.left = `${leftNumber}px`;
                newBlock.style.top = `${topNumber + 240}px`; // 110 = height of block + 10px gap
            }
        }

        // this.adjustBlockWidths();
        // this.adjustFontSize(newBlock.id);
        // Add event listeners to the new block
        this.addEventListeners(newBlock);
        if(parentId){
            this.hidecontrolButtons(parentId,direction)
            
            // Create a line to visually connect the new block with its parent
            const parentBlock = document.getElementById(parentId)
            this.createConnectionLine(parentBlock, newBlock);
        }

        // Add event listener to adjust font size on textarea input
        newBlock.querySelector('textarea').addEventListener('input', () => {
            this.updateTextCount(newBlock.id);
            this.adjustFontSize(newBlock.id);
        });
    }

    showContextMenu(event, blockId) {
        event.preventDefault(); // Prevent the default right-click menu
        const block = document.getElementById(blockId);
        const contextMenu = block.querySelector('.context-menu');
    
        // Get the bounding rectangle of the grandparent
        const grandparentRect = block.closest('.block').getBoundingClientRect();
    
        // Calculate the correct position for the context menu
        const correctTop = event.pageY - window.scrollY - grandparentRect.top;
        const correctLeft = event.pageX - window.scrollX - grandparentRect.left;
    
        // Position the menu at the corrected coordinates
        contextMenu.style.top = `${correctTop}px`;
        contextMenu.style.left = `${correctLeft}px`;
    
        contextMenu.style.display = 'block';
    }
    


    // New method to hide the context menu
    hideContextMenu(blockId) {
        const block = document.getElementById(blockId);
        const contextMenu = block.querySelector('.context-menu');

        contextMenu.style.display = 'none';
    }

  // New method to create a line connecting the parent and child blocks
createConnectionLine(parentBlock, childBlock) {
    const line = document.createElement('div');
    line.className = 'connection-line';

    // Calculate positions to draw the line (this is just a basic example, you can adjust as needed)
    const parentRect = parentBlock.getBoundingClientRect();
    const childRect = childBlock.getBoundingClientRect();
    const top = parentRect.height / 2;
    const left = parentRect.width;
    const width = childRect.left - parentRect.left - parentRect.width;

    line.style.top = `${top}px`;
    line.style.left = `${left/2}px`;
    line.style.width = `2px`;

    // Append the line to the parent block
    parentBlock.appendChild(line);
}


}


export { FlowBuilder }