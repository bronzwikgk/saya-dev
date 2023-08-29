import { IndexedDB } from "./js/utils/idb.js";
import { Loader } from "./js/utils/loader.js";
import { generateUniqueId } from "./js/utils/uniqueId.js";
import { Auth } from "./js/auth.js";
import { TreeEditor } from "./js/tree.js";
import { OpenAI } from "./js/utils/gptApi.js";



const tree = new TreeEditor()
const api = "TfdHXlLlvulMCEeqtlwIT3BlbkFJi15tP9s6cgSfbcvDeawA"
// const api = new OpenAI("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");
const auth = new Auth()
var modal = document.getElementById("shareModal");
var close = document.getElementsByClassName("close")[0];
const openModalButton = document.getElementById("openShareModall")
// const textarea = document.getElementById('doc-content');
const main = document.getElementById('doc-content');
const sidebar = document.getElementById('sidebar');
let saveTimeoutId;
let selectedDocId
let timeoutId
const baseUrl = "http://localhost:3000"
let syncTimeout = null
let clickedDoc

async function getIdsFromURL() {
  const hashValue = window.location.hash; // e.g., "/RootId/NodeId"
  const parts = hashValue.split('/');
  console.log(parts);
  if (!parts[2]) {
    return {
      rootId: parts[1]
    }
  } else {
    return {
      rootId: parts[1],
      nodeId: parts[2]
    };
  }
}

let ids = await getIdsFromURL()
console.log(ids);

// Cache your dropdown for performance
const dropdown = createDropdown();

function createDropdown() {
  const dropdownElement = document.createElement('div');
  // ... Rest of the dropdown creation code ...
  dropdownElement.style.display = 'none';
  dropdownElement.style.position = 'absolute';
  dropdownElement.style.zIndex = '10';
  dropdownElement.style.background = '#fff';
  dropdownElement.style.border = '1px solid #ccc';
  dropdownElement.style.padding = '10px';
  dropdownElement.style.width = '200px';
  dropdownElement.innerHTML = `
  <div>Media</div>
  <div>Animation</div>
  <div>Bullet list</div>
  <!-- Add as many options as you need -->
`;
  document.body.appendChild(dropdownElement);
  return dropdownElement;
}

// Genric apiRequest Function 
async function apiRequest(url, method, data) {

  try {
    const response = await fetch(baseUrl+url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'), // assuming the token is stored in localStorage
        'docid': ids.rootId
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Request Failed: ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error making API request:", error);
    return null;
  }
}

// function to export document 
function exportDocument(format) {
  console.log("export" + format);
  window.location.href = `/documents/export/${format}`;
}

// fucntion to checkAuthentication 
function checkAuthentication() {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/signIn.html';  // Redirect to sign-in page
  }
}

// Recursive function to render a document and its children
async function renderDocument(doc, parentElement) {
  const docElement = document.createElement('div');
  docElement.classList.add('doc');
  docElement.dataset.id = doc.entityId;
  docElement.dataset.childrenFetched = 'false';

  // Create the expand/collapse button
  const expandCollapseButton = document.createElement('span');
  expandCollapseButton.classList.add('expand-collapse-button');
  expandCollapseButton.textContent = document.children.length ? '►' : ''
  docElement.appendChild(expandCollapseButton)

  // icons 
  // Add the document icon
  const docIcon = document.createElement('span');
  docIcon.classList.add('ri-pages-line', 'doc-icon');
  docElement.appendChild(docIcon);

  const titleElement = document.createElement('a');
  titleElement.classList.add('doc-title');
  titleElement.href = `#/${ids.rootId}/${doc.entityId}`
  // Check title length and trim if necessary
  if (doc.title.length > 20) {
    titleElement.textContent = doc.title.substring(0, 17) + "...";  // Taking 12 characters + "..."
  } else {
    titleElement.textContent = doc.title;
  }

  docElement.appendChild(titleElement);

  const addButton = document.createElement('span');
  addButton.classList.add('add-node-button');
  addButton.innerHTML = '<i class="ri-add-line addNode"></i>';
  docElement.appendChild(addButton);

  const childrenContainer = document.createElement('div');
  childrenContainer.classList.add('doc-children');

  docElement.appendChild(childrenContainer);


  parentElement.appendChild(docElement);

}

// Function to create nodes
async function createNode(newNodeTitle, parentId) {
  console.log(parentId);
  try {
    // Sample data for the new node, modify according to your requirements
    const newNodeData = {
      title: newNodeTitle,
      parentId: parentId,
      entityId: generateUniqueId(),
      syncStatus: "new",
      lastModified: Date.now(),
      children: []
    };

    const node = await IndexedDB.Create('MyDatabase', 'documents', newNodeData);
    console.log('New node created in IndexedDB');

    // Fetch the parent document and update its children
    const parentDoc = await IndexedDB.GetByID('MyDatabase', 'documents', parentId);
    parentDoc.children.push(node.entityId);
    await IndexedDB.Update('MyDatabase', 'documents', parentDoc);


    return node
    // Optionally, you can update the UI with the new node here.

  } catch (error) {
    console.error('Error creating new node in IndexedDB:', error);
  }



}

// Fucntion to create bullet Points 
async function bulletPoints(docId) {

  // Fetch the documents from the server
  let doc = await IndexedDB.GetByID('MyDatabase', 'documents', docId);


  const allDocuments = await IndexedDB.GetAll('MyDatabase', 'documents');
  let children = allDocuments.filter(doc => doc.parentId === docId);

  // Get the main content area
  main.dataset.id = docId
  main.innerHTML = '';  // Clear the main content area

  // create and append a div for parent 
  const parentDiv = document.createElement('div');
  parentDiv.contentEditable = true;
  parentDiv.dataset.id = doc.entityId;
  parentDiv.classList.add('bullet-head');
  parentDiv.textContent = doc.title;


  main.appendChild(parentDiv);

  // Create and append a div for each child document
  for (let child of children) {
    const childDiv = document.createElement('div');
    childDiv.dataset.id = child.entityId;
    childDiv.classList.add('bullet-point');
    childDiv.setAttribute('data-children-fetched', 'true')

    // create menu 
    const threeDotMenu = addThreeDotMenu()
    childDiv.appendChild(threeDotMenu)





    //create expand icon 
    const expandIcon = document.createElement('span');
    expandIcon.textContent = '► ';
    expandIcon.classList.add('expand-collapse-button');
    childDiv.appendChild(expandIcon);
    expandIcon.style.visibility = "hidden"

    // Add a bullet icon for child
    const bulletIcon = document.createElement('i');
    bulletIcon.classList.add("ri-checkbox-blank-circle-fill")
    bulletIcon.classList.add("bullet-icon")
    // bulletIcon.innerHTML = '<i class="ri-record-circle-fill bullet-icon"></i>'
    childDiv.appendChild(bulletIcon);


    if (child.children && child.children.length > 0) {
      // Add an expand icon
      expandIcon.style.visibility = "visible";
      bulletIcon.style.border = "3px solid #C0C5C7";
      bulletIcon.style.backgroundColor = "#C0C5C7"

    }


    const childText = document.createElement('span');
    childText.contentEditable = true
    childText.dataset.id = child.entityId;
    childText.textContent = child.title;
    childDiv.appendChild(childText);

    const children = document.createElement("div")
    children.classList.add("childrenContainer")
    childDiv.appendChild(children)

    main.appendChild(childDiv);
    renderTree(child.entityId, childDiv)

  }
}

// function to create tree in canvas
async function renderTree(parentId, parentElement) {


  const allDocuments = await IndexedDB.GetAll('MyDatabase', 'documents');
  let docs = allDocuments.filter(doc => doc.parentId === parentId)

  // Create and append a div for each child document
  for (let child of docs) {
    const childDiv = document.createElement('div');
    childDiv.dataset.id = child.entityId;
    childDiv.classList.add('bullet-point');

    const expandIcon = document.createElement('span');
    expandIcon.textContent = '► ';
    expandIcon.classList.add('expand-collapse-button');
    childDiv.appendChild(expandIcon);
    expandIcon.style.visibility = "hidden"

    if (child.children && child.children.length > 0) {

      // Add an expand icon
      expandIcon.style.visibility = "visible"
    }

    // Add a bullet icon for child
    const bulletIcon = document.createElement('i');
    bulletIcon.classList.add("ri-checkbox-blank-circle-fill")
    bulletIcon.classList.add("bullet-icon")
    // bulletIcon.innerHTML = '<i class="ri-record-circle-fill bullet-icon"></i>'
    childDiv.appendChild(bulletIcon);

    const childText = document.createElement('span');
    childText.contentEditable = true
    childText.dataset.id = child.entityId;
    childText.textContent = child.title;
    childDiv.appendChild(childText);

    const children = document.createElement("div")
    children.classList.add("childrenContainer")
    childDiv.appendChild(children)
    console.log(parentElement);
    parentElement.querySelector('.childrenContainer').appendChild(childDiv);


  }
}

function addThreeDotMenu() {

  const threeDotMenu = document.createElement('span');
  threeDotMenu.classList.add('three-dot-menu');

  const icon = document.createElement('i');
  icon.classList.add('ri-more-fill');
  threeDotMenu.appendChild(icon);

  const menuOptions = document.createElement('div');
  menuOptions.classList.add('menu-options');
  ["Option 1", "Option 2", "Option 3"].forEach(optionText => {
    const option = document.createElement('a');
    option.href = "#";
    option.textContent = optionText;
    menuOptions.appendChild(option);
  });

  threeDotMenu.appendChild(menuOptions);
  return threeDotMenu






}

// Call the function to add the three-dot menu
addThreeDotMenu();


// Function to create kanban cards for startup screen
function renderKanbanCard(doc) {
  // Create the card element
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('kanban-card');

  // Set the card title
  const cardTitle = document.createElement('h3');
  cardTitle.textContent = doc.title;
  cardDiv.appendChild(cardTitle);

  // Add the card to the Kanban container
  const kanbanContainer = document.querySelector('#kanban-container');
  kanbanContainer.appendChild(cardDiv);
}

// Function to save the changes to the server
async function saveChanges(documentId, updatedText) {

  try {
    // Fetch the existing document from IndexedDB
    const existingDocument = await IndexedDB.GetByID('MyDatabase', 'documents', documentId);
    console.log(existingDocument);
    // Update the title of the document
    existingDocument.title = updatedText;
    if (existingDocument.syncStatus === "synced") {
      existingDocument.syncStatus = "updated"
    }

    // Update the document in IndexedDB
    await IndexedDB.Update('MyDatabase', 'documents', existingDocument);

    // Update the title of the document in the sidebar
    const sidebarDocTitle = document.querySelector(`.doc[data-id="${documentId}"]`);
    if (sidebarDocTitle) {
      let title = sidebarDocTitle.querySelector(".doc-title");
      title.innerText = updatedText;
    }


    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }
    // Schedule a sync with the server 10 seconds after saveChanges completes
    syncTimeout = setTimeout(syncWithServer, 10 * 500);  // 10 seconds in milliseconds

    console.log('Document updated successfully in IndexedDB.');
  } catch (error) {
    console.error('Error updating document in IndexedDB:', error);
  }

}

// Function to loadDocument with id 
async function loadDocument() {
  console.log("document loaded");
  try {
    let document = await IndexedDB.GetByID('MyDatabase', 'documents', ids.rootId);
    tree.renderDocument(document, sidebar, ids.rootId)
    if (ids.nodeId) {
      tree.displayMainNode(ids.nodeId)
    }
    console.log('Fetched document:');
    return document;
  } catch (error) {
    console.error('Error fetching document:', error);
    alert("Failed to load document.");
  }
}

function setUpModal() {
  // Open the modal
  openShareModal.onclick = function () {
    modal.style.display = "block";
  }
  // When the user clicks on the close button, close the modal
  close.onclick = function () {
    modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

async function shareDocument(req) {
  try {
    const data = await apiRequest('http://localhost:5000/shareDocument', 'POST', req)
    modal.style.display = "none"
  } catch (error) {
    alert('Failed to share document: ' + error.message);
  }
}

async function serverToClient() {
  try {
    // 1. Fetch latest documents from server

    const serverDocuments = await apiRequest("/api/fetchUserDocuments", "GET")

    // 2. Get all documents from IndexedDB
    const localDocuments = await IndexedDB.GetAll('MyDatabase', 'documents');

    // 3. Compare and update
    for (const serverDoc of serverDocuments) {
      const localDoc = localDocuments.find(doc => doc.entityId === serverDoc.entityId);

      // If localDoc doesn't exist, it's a new document from the server, so add it
      if (!localDoc) {
        await IndexedDB.Create('MyDatabase', 'documents', serverDoc);
        continue;
      }

      // Compare lastModified timestamps
      const serverLastModified = new Date(serverDoc.lastModified).getTime();
      const localLastModified = new Date(localDoc.lastModified).getTime();

      if (serverLastModified > localLastModified) {
        // Server has a newer version, so update the local version
        localDoc.title = serverDoc.title
        localDoc.lastModified = serverDoc.lastModified
        localDoc.syncStatus = "syncd"
        await IndexedDB.Update('MyDatabase', 'documents', localDoc);
      }
    }

    console.log("Server to Client sync done");
  } catch (error) {
    console.error('Error syncing with server:', error);
  }
}

// Call the sync function periodically or on certain events
// setInterval(serverToClient, 10000);  // Sync every 10 seconds for example


//sync
async function syncWithServer() {
  if (!navigator.onLine) {
    console.log("Offline. Sync postponed.");
    return;
  }

  try {
    const unsyncedDocs = await IndexedDB.GetAll('MyDatabase', 'documents');

    const newDocsToSync = [];
    const updatedDocsToSync = [];

    for (let doc of unsyncedDocs) {
      if (doc.syncStatus === "new") {
        newDocsToSync.push(doc);
      } else if (doc.syncStatus === "updated") {
        updatedDocsToSync.push(doc);
      }
      doc.lastModified = Date.now();
      doc.syncStatus = "synced";
    }

    const requests = [];
    if (newDocsToSync.length) {
      requests.push(apiRequest('/api/uploadDocuments', 'POST', newDocsToSync));
    }
    if (updatedDocsToSync.length) {
      requests.push(apiRequest('/api/updateDocuments', 'PUT', updatedDocsToSync));
    }

    await Promise.all(requests);

    if (unsyncedDocs.length) {
      for (let doc of unsyncedDocs) {
        doc.lastModified = Date.now();
        doc.syncStatus = "synced";

        await IndexedDB.Update('MyDatabase', 'documents', doc);
      }

    }

    console.log('Synced with server successfully.');
  } catch (error) {
    console.error('Error syncing with server:', error);
  }
}


function logOut() {
  auth.signOut()
}

async function chatWithGPT(apiKey, userMessage) {
  const url = "https://api.openai.com/v1/chat/completions";

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${api}`
  };

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant."
      },
      {
        role: "user",
        content: userMessage
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(responseData);
    return responseData.choices[0].message.content;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error.message);
  }
}

function insertOneBullet(elm, entityId, title) {
  console.log(title);
  const childDiv = document.createElement('div');
  childDiv.dataset.id = entityId;
  childDiv.classList.add('bullet-point');
  const expandIcon = document.createElement('button');
  expandIcon.textContent = '► ';
  expandIcon.classList.add('expand-collapse-button');
  childDiv.appendChild(expandIcon);
  expandIcon.style.visibility = "hidden"

  // if (child.children && child.children.length > 0) {
  //   // Add an expand icon
  //   expandIcon.style.visibility = "visible"
  // }

  // Add a bullet icon for child
  const bulletIcon = document.createElement('i');
  bulletIcon.classList.add("ri-checkbox-blank-circle-fill")

  bulletIcon.classList.add("bullet-icon")
  // bulletIcon.innerHTML = '<i class="ri-record-circle-fill bullet-icon"></i>'
  childDiv.appendChild(bulletIcon);

  const childText = document.createElement('span');
  childText.contentEditable = true
  childText.dataset.id = entityId;
  if (title) {
    childText.innerText = title
  }
  childDiv.appendChild(childText);

  // Focus on the new bullet point
  setTimeout(() => childText.focus(), 0);
  console.log(elm.nextSibling);
  //  if (elm.nextSibling) {
  //   elm.insertBefore(childDiv, elm.nextSibling);
  //  } else {
  //   elm.appendChild(childDiv);
  //  }
  elm.appendChild(childDiv)

}

function setupEventListener() {

  document.getElementById('openaiForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    // Extract data from the form
    const mainElement = document.getElementById("main");
    const selectedElement = mainElement.querySelector(`[data-id="${clickedDoc}"]`);
    const text = selectedElement.innerText;
    console.log(text);
    try {
      
      let data = {prompt:text}
      let output = await apiRequest("/ask", "POST",data);
      console.log(output);
        if (output.data) {
          let node =await tree.createNode(output.data, clickedDoc);console.log(node);
          let bullet = tree.createBulletPoint(node.entityId, node.title)
          selectedElement.querySelector(".childrenContainer").append(bullet)
        }
      

    } catch (error) {
      console.error("Error sending data to OpenAI:", error);
    }
  });

  document.getElementById('openaiButton').addEventListener('click', function () {
    
    const sidebar = document.getElementById('openaiSidebar');
    sidebar.classList.toggle('open');
  });


  window.addEventListener('beforeunload', function (event) {
    // Trigger the sync function
    syncWithServer();
    // Note: Some browsers might not execute asynchronous operations within 'beforeunload',
    // so the sync function might need to be synchronous or you may need to delay the closing 
    // slightly to ensure the sync completes (though this might degrade user experience).
  });

  window.addEventListener("hashchange", async function () {
    ids = await getIdsFromURL()
    console.log("hashchanged");
    tree.displayMainNode(ids.nodeId)

  });


  // When a document title is clicked, change the hash 
  document.getElementById('main').addEventListener('click', async (event) => {
    if (event.target.classList.contains('bullet-icon')) {
      // Get the document ID
      const docId = event.target.parentNode.dataset.id;
      selectedDocId = docId
      window.location.hash = `#/${ids.rootId}/${selectedDocId}`
    }
  });

  // Listen for the input event on the textarea
  main.addEventListener('input', (e) => {
    // Save the changes after a delay to avoid saving too frequently
    // If a timer is already running, clear it
    if (saveTimeoutId) clearTimeout(saveTimeoutId);
    // Start a new timer
    saveTimeoutId = setTimeout(() => {
      // Call the update function
      tree.saveChanges(e.target.dataset.id, e.target.innerText);
      // Clear the timeoutId
      timeoutId = null;
    }, 10);; // Adjust the delay as needed
  });

  // When an "Add Node" button is clicked, create a new document
  sidebar.addEventListener('click', async function (event) {
    if (event.target.matches('.addNode')) {
      // stop the original event
      event.stopPropagation();
      // trigger the click event on the parent button
      event.target.parentNode.click();
      return; // Exit function after triggering the click event
    }
    if (event.target.matches('.add-node-button')) {
      const parentElement = event.target.parentElement;
      const parentId = parentElement.dataset.id;

      const newNodeTitle = prompt('Enter new node title');
      if (newNodeTitle === null || newNodeTitle.trim() === '') return;

      let createdNode = await tree.createNode(newNodeTitle, parentId)
      tree.renderDocument(createdNode, parentElement.querySelector('.doc-children'), ids.rootId);
    }
  });

  // When an expand/collapse button is clicked, fetch the children of its document and toggle their visibility
  sidebar.addEventListener('click', async function (event) {
    if (event.target.classList.contains('expand-collapse-button')) {
      let parentNode = event.target.parentNode;
      let parentNodeId = parentNode.dataset.id;
      // Fetch the children from the server if they haven't been fetched yet
      let childrenContainer = parentNode.querySelector('.doc-children');

      if (event.target.parentElement.getAttribute('data-children-fetched') === 'true') {

        if (childrenContainer.style.display === 'none') {
          childrenContainer.style.display = 'block';

          event.target.textContent = '▼';
        } else {
          childrenContainer.style.display = 'none';
          event.target.textContent = '►';
        }
      } else {
        let children
        // let children = await apiRequest(`/documents/${parentNodeId}/children`, "GET")
        try {
          const allDocuments = await IndexedDB.GetAll('MyDatabase', 'documents');
          children = allDocuments.filter(doc => doc.parentId === parentNodeId);
          console.log(children);
          // Process or render the fetched documents as required
        } catch (error) {
          console.error('Error fetching documents by parentId:', error);
        }

        for (let child of children) {
          tree.renderDocument(child, childrenContainer, ids.rootId);
        }
        event.target.parentElement.setAttribute('data-children-fetched', 'true');
        event.target.textContent = '▼';
      }
    }
  });

  main.addEventListener('click', async function (event) {
    if (event.target.classList.contains('expand-collapse-button')) {
      let parentNode = event.target.parentNode;
      let parentNodeId = parentNode.dataset.id;
      // Fetch the children from the server if they haven't been fetched yet
      let childrenContainer = parentNode.querySelector('.childrenContainer');

      if (event.target.parentElement.getAttribute('data-children-fetched') === 'true') {

        if (childrenContainer.style.display === 'none') {
          childrenContainer.style.display = 'block';

          event.target.textContent = '▼';
        } else {
          childrenContainer.style.display = 'none';
          event.target.textContent = '►';
        }
      } else {
        let children
        // let children = await apiRequest(`/documents/${parentNodeId}/children`, "GET")
        tree.displayChildNodes(parentNodeId, childrenContainer)


        event.target.parentElement.setAttribute('data-children-fetched', 'true');
        event.target.textContent = '▼';
      }
    }
  });



  // function to open dropdown
  main.addEventListener('keyup', function (event) {
    const text = main.textContent;
    const slashIndex = text.lastIndexOf('/');

    if (event.key === '/') {

      // Get cursor position
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const rect = range.getClientRects()[0];

      if (rect) {
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.top = `${rect.bottom + 10}px`;
        dropdown.style.display = 'block';
      }

    } else if (dropdown.style.display === 'block' && event.key === 'Escape') {
      dropdown.style.display = 'none';
    }
  });

  // fucntion to close dropdown
  dropdown.addEventListener('click', function (event) {
    if (event.target !== dropdown) {
      document.execCommand('insertHTML', false, event.target.textContent);
      dropdown.style.display = 'none';
    }
  });

  // Handle enter and tab events for bullet points.
  document.getElementById('doc-content').addEventListener('keydown', async function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();

      let node

      if (!e.target.parentElement.parentElement.dataset.id) {
        node = await tree.createNode("untitled", e.target.dataset.id)
        tree.insertOneBulletPoint(node, e.target)

      } else {
        node = await tree.createNode("untitled", e.target.parentElement.parentElement.dataset.id)
        tree.insertOneBulletPoint(node, e.target.parentNode)

      }


      // Update the title of the document in the sidebar
      const sidebarDoc = document.querySelector(`.doc[data-id="${node.parentId}"]`)
      if (sidebarDoc) {
        const childrenContainer = sidebarDoc.parentNode.querySelector('.doc-children');

        tree.renderDocument(node, childrenContainer, ids.rootId)
      }



    } else if (e.key === 'Tab') {
      e.preventDefault();

      // Indent the current line to create a nested bullet point.
      e.target.style.marginLeft = (parseInt(e.target.style.marginLeft || '0') + 20) + 'px';
    }
  });

  document.getElementById("backBtn").addEventListener("click", function () {
    window.history.back();
  });

  document.getElementById("forwardBtn").addEventListener("click", function () {
    window.history.forward();
  });


  // Handle click events for bullet points.
  document.getElementById('doc-content').addEventListener('click', function (e) {
    clickedDoc = e.target.dataset.id
    if (e.target.classList.contains('bullet-point')) {
      // Select the clicked bullet point.
      let range = document.createRange();
      range.selectNodeContents(e.target);
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });


  //shre the document 
  document.getElementById('share-button').addEventListener('click', () => {
    const emailToShare = document.getElementById('shareEmail').value;
    const permission = document.getElementById('shareRole').value;
    let data = {
      entityId: ids.rootId,
      emailToShare: emailToShare,
      role: permission
    }
    shareDocument(data);
  });



  document.getElementById("logOutBtn").addEventListener("click", logOut)
  document.getElementById("explorer").addEventListener("click",()=>{
    
    window.location.href = "/"
  })

}



async function start() {
  // Fetch and render the root document when the page loads
  await loadDocument()

  Loader.hideLoader()
  setupEventListener()
  setUpModal()

  syncWithServer()
  serverToClient()
}

window.onload = checkAuthentication;
document.addEventListener('DOMContentLoaded', start);






