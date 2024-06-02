import { OpenAi } from "./sendToOpenAi.js";

class Editor {
    constructor() {
        this.cellsContainer = document.getElementById('cells');
        this.addCellButton = document.getElementById('add-cell-btn');
        this.fileList = document.getElementById('file-list');
        this.newFileButton = document.getElementById('new-file-btn');
        this.openFileInput = document.getElementById('open-file-input');
        this.openFileButton = document.getElementById('open-file-btn');
        this.saveFileButton = document.getElementById('save-file-btn');
        this.actionButtons = document.getElementById("actionButtons")
        // this.saveAsFileButton = document.getElementById('save-as-file-btn');
        this.saveAsMdButton = document.getElementById('save-as-md-btn');
        this.currentFile = null;  // To keep track of the currently opened file
        this.currentFileNameDisplay = document.getElementById('current-file-name');
        this.updateFileList();
        this.tabContainer = document.getElementById('tabContainer');
        this.activeFileElement = null;  // Will hold the active file's LI element for styling
        this.runMultipleMode = false; // Add this line to the constructor
        this.runMultipleButton = document.createElement('button');
        this.mainWindow = document.getElementById("main-window")
        this.runMultipleButton.textContent = 'Run Multiple';
        this.actionButtons.appendChild(this.runMultipleButton);
        this.runSelectedButton = document.createElement('button');
        this.runSelectedButton.textContent = 'Run Selected';
        this.runSelectedButton.style.display = 'none';
        this.actionButtons.appendChild(this.runSelectedButton)

        // For every cell-input (textarea) in the editor, add the input event to adjust height

        this.openAi = new OpenAi()
        this.bindEvents();

    }

    bindEvents() {
        this.addCellButton.addEventListener('click', () => this.addCell());
        this.newFileButton.addEventListener('click', () => this.newFile());
        this.openFileInput.addEventListener('change', (e) => this.openFile(e));
        this.openFileButton.addEventListener('click', () => this.openFileInput.click());
        this.saveFileButton.addEventListener('click', () => this.saveFile());
        // this.saveAsFileButton.addEventListener('click', () => this.saveFileAs());
        this.saveAsMdButton.addEventListener('click', () => this.saveAsMd());
        this.runMultipleButton.addEventListener('click', () => this.toggleMultipleRunMode());
        this.runSelectedButton.addEventListener('click', () => this.runSelectedCells());
    }

    adjustTextAreaHeight() {
        document.querySelectorAll('textarea').forEach(textarea => {
            // Initial adjustment (useful if there's any default content)
            this.autoAdjustTextareaHeight(textarea);

            // Adjust height on input event
            textarea.addEventListener('input', () => {
                this.autoAdjustTextareaHeight(textarea);
            });
        });

    }

    autoAdjustTextareaHeight(textarea) {
        textarea.style.height = 'auto'; // First reset the height
        textarea.style.height = `${textarea.scrollHeight}px`; // Then set it to its content height
    }


    addCell(content = '') {
        const cell = document.createElement('div');
        cell.className = 'cell';

        const textarea = document.createElement('textarea');
        textarea.value = content;

        const sentToOpenAiButton = document.createElement("button")
        sentToOpenAiButton.textContent = "Sent to OpenAI";
        sentToOpenAiButton.classList.add("send-to-openai")

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'Delete Cell';
        deleteBtn.classList.add("deleteCellBtn")

        const cellSelector = document.createElement('input');
        cellSelector.type = 'checkbox';
        cellSelector.className = 'cell-selector';
        cellSelector.style.display = 'none';
        cell.appendChild(cellSelector);


        // Handle cell deletion
        deleteBtn.addEventListener('click', () => this.deleteCell(cell));
        // sent to openai 
        sentToOpenAiButton.addEventListener('click', () => this.askOpenAI(cell));

        cell.appendChild(textarea);
        cell.appendChild(deleteBtn);
        cell.appendChild(sentToOpenAiButton)


        this.cellsContainer.appendChild(cell);
        if (content) {
            this.autoAdjustTextareaHeight(textarea);
        }

    }

    deleteCell(cell) {
        if (confirm("Are you sure you want to delete this cell?")) {
            this.cellsContainer.removeChild(cell);
        }
    }

    async askOpenAI(cell) {
        let input = cell.querySelector('textarea').value;
        let response = await this.openAi.sendToOpenAI(input);
        // Create a new cell to display the response
        this.addCell(response);
        return response
    }

    newFile() {
        const filename = prompt("Enter a filename:");
        if (filename && !localStorage.getItem(filename)) {
            // Save the new file in localStorage with an empty array
            localStorage.setItem(filename, JSON.stringify([]));

            // Set the current file to the newly created one
            this.currentFile = filename;
            this.openTab(this.currentFile);

            // Update the cells and the file list
            this.cellsContainer.innerHTML = '';
            this.addCellButton.style.display="block"
            this.updateFileList();
        } else if (localStorage.getItem(filename)) {
            alert('A file with this name already exists.');
        }
    }

    openFile(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.cellsContainer.innerHTML = e.target.result;
                this.currentFile = file.name;
                this.openTab(this.currentFile);
                this.currentFileNameDisplay.textContent = file.name;
                this.updateFileList();
            };
            reader.readAsText(file);
        }
    }

    saveFile() {
        if (this.currentFile) {
            const cellContents = [];
            const cells = this.cellsContainer.querySelectorAll('.cell textarea');
            cells.forEach(textarea => cellContents.push(textarea.value));
            localStorage.setItem(this.currentFile, JSON.stringify(cellContents));
        } else {
            this.saveFileAs();
        }
    }

    saveFileAs() {
        const filename = prompt("Enter filename:");
        if (filename) {
            localStorage.setItem(filename, this.cellsContainer.innerHTML);
            this.currentFile = filename;
            this.currentFileNameDisplay.textContent = filename;
            this.updateFileList();
        }
    }

    saveAsMd() {
        const fileName = prompt("Enter the name for the .md file:", this.currentFile ? this.currentFile : "untitled.md");
        if (!fileName) return;

        // Retrieve the content of the editor as an array
        let contentArray = [];
        const cells = this.cellsContainer.querySelectorAll('.cell textarea');
        cells.forEach(textarea => contentArray.push(textarea.value));


        // Convert the array of cell contents into a Markdown formatted string
        const markdownContent = contentArray.map(item => `## ${item}\n`).join('\n');

        // Save the Markdown content to localStorage as well
        this.saveFile(fileName, markdownContent);

        // Create a Blob with the markdown content and download it
        const blob = new Blob([markdownContent], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName.includes('.md') ? fileName : `${fileName}.md`;
        a.click();

        // Cleanup
        URL.revokeObjectURL(url);
    }

    // updateFileList() {
    //     // Clear the file list
    //     this.fileList.innerHTML = '';

    //     // Get all files from local storage (this is just a demo; in real-world apps, files would be fetched from a backend or other sources)
    //     for (let i = 0; i < localStorage.length; i++) {
    //         const filename = localStorage.key(i);
    //         const li = document.createElement('li');
    //         li.textContent = filename;

    //         li.addEventListener('click', () => this.loadFileFromList(filename));

    //         this.fileList.appendChild(li);
    //         this.adjustTextAreaHeight()
    //     }
    // }

    updateFileList() {
        console.log("files updated");
        // Clear the file list
        this.fileList.innerHTML = '';


        for (let i = 0; i < localStorage.length; i++) {
            const filename = localStorage.key(i);

            const li = document.createElement('li');
            li.textContent = filename;

            // Highlight if the current file is the one being rendered
            if (filename === this.currentFile) {
                li.classList.add('active-file');
                this.activeFileElement = li;
            }

            li.addEventListener('click', () => this.loadFileFromList(filename));

            this.fileList.appendChild(li);
            this.adjustTextAreaHeight()
        }
        
    }


    loadFileFromList(filename) {
        const contentArray = JSON.parse(localStorage.getItem(filename));
        if (contentArray) {
            // Clear existing cells before loading
            this.cellsContainer.innerHTML = '';

            contentArray.forEach(content => {
                this.addCell(content);
            });

            // Remove highlight from previously active file
            if (this.activeFileElement) {
                this.activeFileElement.classList.remove('active-file');
            }

            // Highlight the currently clicked file
            const newActiveFileElement = Array.from(this.fileList.querySelectorAll('li')).find(li => li.textContent === filename);

            if (newActiveFileElement) {
                newActiveFileElement.classList.add('active-file');
                this.activeFileElement = newActiveFileElement;
            }

            this.currentFile = filename;
            this.openTab(this.currentFile);
            this.adjustTextAreaHeight()
        }
        this.addCellButton.style.display="block"
    }

    // New Method: Open a new tab
    openTab(filename) {
        // If a tab with this filename already exists, just switch to it
        const existingTab = this.tabContainer.querySelector(`[data-filename="${filename}"]`);
        if (existingTab) {
            this.switchToTab(existingTab);
            return;
        }

        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.setAttribute('data-filename', filename);
        tab.textContent = filename;

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '<i class="ri-close-line"></i>';
        closeBtn.className = 'close-tab';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();  // Prevent triggering the tab click
            this.closeTab(tab);
        });

        tab.appendChild(closeBtn);
        tab.addEventListener('click', () => this.loadFileFromTab(filename));

        this.tabContainer.appendChild(tab);
    }

    // New Method: Load content from tab
    loadFileFromTab(filename) {
        this.loadFileFromList(filename);  // This will load the content to the main window

        // Highlight the current tab and de-highlight others
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active-tab'));
        const activeTab = this.tabContainer.querySelector(`[data-filename="${filename}"]`);
        activeTab.classList.add('active-tab');
    }

    // New Method: Close a tab
    closeTab(tabElement) {
        const filename = tabElement.getAttribute('data-filename');
        if (filename === this.currentFile) {
            this.currentFile = null;
            this.cellsContainer.innerHTML = '';  // Clear editor content
        }
        tabElement.remove();
    }

    toggleMultipleRunMode() {
        this.runMultipleMode = !this.runMultipleMode;
        const checkboxes = this.cellsContainer.querySelectorAll('.cell-selector');
        if (this.runMultipleMode) {
            checkboxes.forEach(cb => cb.style.display = 'block');
            this.runSelectedButton.style.display = 'block';
        } else {
            checkboxes.forEach(cb => cb.style.display = 'none');
            this.runSelectedButton.style.display = 'none';
        }
    }

    async runSelectedCells() {
        const cells = this.cellsContainer.querySelectorAll(".cell");
        for (let cell of cells) {
            if (cell.querySelector('.cell-selector').checked) {
                await this.askOpenAI(cell);
            }
        }
        this.toggleMultipleRunMode(); // revert back to normal mode after running
    }


    // Additional methods related to file operations can be added later
}



export { Editor }
