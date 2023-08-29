import { explorerList } from "../handlebar/template/informative/explorerList.js";
import { generateUniqueId } from "./utils/uniqueId.js";
import { IndexedDB } from "./utils/idb.js";
import { Loader } from "./utils/loader.js";
import { Auth } from "./auth.js";
import { TreeEditor } from "./tree.js";

const baseUrl = ""
const auth = new Auth()
const tree = new TreeEditor()


async function initializeDatabase() {
    try {
        let db = await IndexedDB.Open('MyDatabase', ['documents'], { closeOnUpgrade: true });
        console.log('Database initialized and closed.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}




// Genric apiRequest Function 
async function apiRequest(url, method, data) {

    try {
        const response = await fetch(baseUrl+url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // assuming the token is stored in localStorage
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Error making API request:", error);
        return null;
    }
}

// render template with handlebar 
function renderHandlebarsTemplate(template, data, selector) {
    // Compile the Handlebars template
    const compiledTemplate = Handlebars.compile(template);
    // Render the template with the data
    const renderedHtml = compiledTemplate(data);
    // Inject html into dom 
    document.querySelector(selector).innerHTML = renderedHtml
}

//fetch root documents
async function fetchRootDocuments() {
    // const documents = await apiRequest('/api/documents/roots', 'GET');
    // console.log(documents);
    try {
        const allDocuments = await IndexedDB.GetAll('MyDatabase', 'documents');
        let rootDocuments = allDocuments.filter(doc => doc.parentId === null);
        renderHandlebarsTemplate(explorerList, rootDocuments, "#explorerList")
    } catch (error) {
        console.error('Error fetching root documents:', error);
        return [];
    }
}

// fucntion to checkAuthentication 
function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/landingPage.html';  // Redirect to sign-in page
    }
}


// function to get shareed with me docs
async function getSharedDocuments() {
    const sharedDocuments = await apiRequest('/sharedWithMe', 'GET');

    if (sharedDocuments && sharedDocuments.length) {
        renderHandlebarsTemplate(explorerList, sharedDocuments, "#explorerList")
    } else {
        alert('No shared documents found.');
    }
}


async function createNewDocument() {
    // Create a new root document object
    let newRootDocument = {
        entityId: generateUniqueId(),  // Assuming you have a function to generate unique IDs
        title: "Untitled",
        parentId: null,
        isRoot: true,
        syncStatus: "new",
        lastModified: Date.now(),
        children: []
        // ... any other necessary properties
    };
    // Add this document to IndexedDB
    const doc = await IndexedDB.Create('MyDatabase', 'documents', newRootDocument);
    console.log(doc);
    // navigate user to new doucment page 
    if (doc && doc.entityId) {
        window.location.href = `/editor.html#/${doc.entityId}`;
    } else {
        alert("Failed to create a new document.");
    }


}

// async function fetchAndPopulateDocuments() {
//     try {
//         const allDocuments = await IndexedDB.GetAll('MyDatabase', 'documents');
//         let rootDocuments = allDocuments.filter(doc => doc.parentId === null);

//         if (!rootDocuments || rootDocuments.length == "0") {
//             console.log("Trying to fetch docs");
//             const documents = await apiRequest("/api/fetchUserDocuments", "GET")
//             console.log(documents);
//             // Add documents to IndexedDB
//             await IndexedDB.BulkCreate('MyDatabase', 'documents', documents);
//             console.log("All documents have been added to IndexedDB!");
//         }

//     } catch (error) {
//         console.error("Error fetching and populating documents:", error);
//     }

// }

async function serverToClient() {
    try {
        // 1. Fetch latest documents from server
        const serverDocuments = await apiRequest("/api/fetchUserDocuments", "GET")

        // 2. Get all documents from IndexedDB
        const localDocuments = await IndexedDB.GetAll('MyDatabase', 'documents');

        // Lists to batch the operations
        const docsToCreate = [];
        const docsToUpdate = [];

        // 3. Compare and update
        for (const serverDoc of serverDocuments) {
            const localDoc = localDocuments.find(doc => doc.entityId === serverDoc.entityId);
console.log(localDoc);
console.log(serverDoc);
            // If localDoc doesn't exist, it's a new document from the server
            if (!localDoc) {
                docsToCreate.push(serverDoc);
                continue;
            }

            // Compare lastModified timestamps
            const serverLastModified = new Date(serverDoc.lastModified).getTime();
            const localLastModified = new Date(localDoc.lastModified).getTime();

            if (serverLastModified > localLastModified) {
                // Server has a newer version, so update the local version
                localDoc.title = serverDoc.title;
                localDoc.lastModified = serverDoc.lastModified;
                localDoc.syncStatus = "synced";
                docsToUpdate.push(localDoc);
            }
        }

        // ... [rest of the function]

        // Use transactions for batched operations
        await IndexedDB.Transaction('MyDatabase', ['documents'], 'readwrite', (transaction) => {
            const objectStore = transaction.objectStore('documents');

            // Batch add for truly new documents
            docsToCreate.forEach(doc => objectStore.add(doc));

            // Batch update or add
            docsToUpdate.forEach(doc => objectStore.put(doc));
        });

        console.log("Server to Client sync done");
    } catch (error) {
        console.error('Error syncing with server:', error);
    }
}


function logOut() {
    auth.signOut()
}



function setupEventListener() {
    // create new root documetn 
    document.getElementById('create-document').addEventListener('click', createNewDocument)
    // This could be a simple POST to create a new blank root document
    // const response = await apiRequest('/api/documents/createRoot', 'POST');
    // if (response && response._id) {
    //     window.location.href = `/editor.html?id=${response._id}`;
    // } else {
    //     alert("Failed to create a new document.");
    // }


    // get shred docs
    document.getElementById("shared-with-me").addEventListener("click", getSharedDocuments)
    document.getElementById("logOutBtn").addEventListener("click", logOut)
}


async function start() {
    await initializeDatabase()
    Loader.hideLoader()
    // Call this function after successful sign-up/sign-in and after confirming that the IndexedDB is empty.
    await serverToClient()
    await fetchRootDocuments()

    setupEventListener()
}



window.onload = checkAuthentication;
document.addEventListener('DOMContentLoaded', start);













