import { IndexedDB } from "./utils/idb.js";
import { generateUniqueId } from "./utils/uniqueId.js";

class TreeEditor {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.main = document.getElementById('doc-content');
        this.generateUniqueId = generateUniqueId
        this.selectedDocId = null;
        this.ids = null;
        this.clickedDoc = null;
        this.syncTimeout = null
    }

    async getIdsFromURL() {
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

    async loadDocument() {
        console.log("document loaded");
        try {
            this.ids = await this.getIdsFromURL()
            let document = await IndexedDB.GetByID('MyDatabase', 'documents', this.ids.rootId);
            renderDocument(document, sidebar)
            if (this.ids.nodeId) {
                this.displayMainNode(this.ids.nodeId)
            }
            console.log('Fetched document:');
            return document;
        } catch (error) {
            console.error('Error fetching document:', error);
            alert("Failed to load document.");
        }
    }

    async displayMainNode(docId) {
        // Fetch the documents from the server
        let doc = await IndexedDB.GetByID('MyDatabase', 'documents', docId);

        // Get the main content area
        this.main.dataset.id = docId
        this.main.innerHTML = '';  // Clear the main content area

        // create and append a div for parent 
        const parentDiv = document.createElement('div');
        parentDiv.contentEditable = true;
        parentDiv.dataset.id = doc.entityId;
        parentDiv.classList.add('bullet-head');
        parentDiv.textContent = doc.title;
        this.main.appendChild(parentDiv);
        this.displayChildNodes(docId, this.main)


    }

    async displayChildNodes(docId, parentElement) {
        // fetch children 
        const allDocuments = await IndexedDB.GetAll('MyDatabase', 'documents');
        let children = allDocuments.filter(doc => doc.parentId === docId);
        // Create and append a div for each child document
        for (let child of children) {
            let hasChildren = (child.children && child.children.length > 0);
            console.log(hasChildren);
            let childDiv = this.createBulletPoint(child.entityId, child.title, hasChildren);
            parentElement.appendChild(childDiv);
            // if (hasChildren) {
            //     let childrenContainer = childDiv.querySelector(".childrenContainer")
            //     childDiv.setAttribute('data-children-fetched', 'true')
            //     await this.displayChildNodes(child.entityId, childrenContainer)
            // }

        }
    }

    insertOneBulletPoint(node, elm) {
        let bullet = this.createBulletPoint(node.entityId, node.title)
        // Focus on the new bullet point
        setTimeout(() => bullet.querySelector(".title").focus(), 0);

        if (elm.nextSibling) {
            elm.parentNode.insertBefore(bullet, elm.nextSibling);
        } else {
            elm.parentNode.appendChild(bullet);
        }

    }

    createBulletPoint(entityId, title, hasChildren = false) {
        const bulletDiv = document.createElement('div');
        bulletDiv.dataset.id = entityId;
        bulletDiv.classList.add('bullet-point');

        // create menu 
        const threeDotMenu = this.addThreeDotMenu()
        bulletDiv.appendChild(threeDotMenu)

        const expandIcon = this.createExpandIcon(hasChildren);
        bulletDiv.appendChild(expandIcon);

        const bulletIcon = this.createBulletIcon();
        bulletDiv.appendChild(bulletIcon);

        if (hasChildren) {
            // Add an expand icon
            expandIcon.style.visibility = "visible";
            bulletIcon.style.border = "3px solid #C0C5C7";
            bulletIcon.style.backgroundColor = "#C0C5C7"
        }

        const bulletText = this.createBulletText(entityId, title);
        bulletDiv.appendChild(bulletText);

        const childrenDiv = document.createElement("div");
        childrenDiv.classList.add("childrenContainer");
        bulletDiv.appendChild(childrenDiv);

        return bulletDiv;
    }

    createExpandIcon(visible) {
        const icon = document.createElement('span');
        icon.textContent = '►';
        icon.classList.add('expand-collapse-button');
        icon.style.visibility = visible ? "visible" : "hidden";
        return icon;
    }

    createBulletIcon() {
        const icon = document.createElement('i');
        icon.classList.add("ri-checkbox-blank-circle-fill", "bullet-icon");
        return icon;
    }

    createBulletText(entityId, title) {
        const text = document.createElement('span');
        text.classList.add("title")
        text.contentEditable = true;
        text.dataset.id = entityId;
        if (title) {
            text.textContent = title;
        }
        return text;
    }

    addThreeDotMenu() {
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


    // Function to create nodes

    async createNode(newNodeTitle, parentId) {

        try {
            // Sample data for the new node, modify according to your requirements
            const newNodeData = {
                title: newNodeTitle,
                parentId: parentId,
                entityId: this.generateUniqueId(),
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

    // Recursive function to render a document and its children
    async renderDocument(doc, parentElement, rootId) {
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
        titleElement.href = `#/${rootId}/${doc.entityId}`
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

    async chatWithGPT(apiKey, userMessage) {
        const url = "https://api.openai.com/v1/chat/completions";

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
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

    async saveChanges(documentId, updatedText) {
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
            let sidebarDocTitle = document.querySelector(`.doc[data-id="${documentId}"]`);
            if (sidebarDocTitle) {
                let title = sidebarDocTitle.querySelector(".doc-title");
                title.innerText = updatedText;
            }
            if (this.syncTimeout) {
                clearTimeout(this.syncTimeout);
            }
            // Schedule a sync with the server 10 seconds after saveChanges completes
            this.syncTimeout = setTimeout(this.syncWithServer, 10 * 500);  // 10 seconds in milliseconds
            console.log('Document updated successfully in IndexedDB.');
        } catch (error) {
            console.error('Error updating document in IndexedDB:', error);
        }

    }

    // async serverToClient() {
    //     try {
    //         // 1. Fetch latest documents from server

    //         const serverDocuments = await this.apiRequest("/api/fetchUserDocuments", "GET")

    //         // 2. Get all documents from IndexedDB
    //         const localDocuments = await IndexedDB.GetAll('MyDatabase', 'documents');

    //         // 3. Compare and update
    //         for (const serverDoc of serverDocuments) {
    //             const localDoc = localDocuments.find(doc => doc.entityId === serverDoc.entityId);

    //             // If localDoc doesn't exist, it's a new document from the server, so add it
    //             if (!localDoc) {
    //                 await IndexedDB.Create('MyDatabase', 'documents', serverDoc);
    //                 continue;
    //             }

    //             // Compare lastModified timestamps
    //             const serverLastModified = new Date(serverDoc.lastModified).getTime();
    //             const localLastModified = new Date(localDoc.lastModified).getTime();

    //             if (serverLastModified > localLastModified) {
    //                 // Server has a newer version, so update the local version
    //                 localDoc.title = serverDoc.title
    //                 localDoc.lastModified = serverDoc.lastModified
    //                 localDoc.syncStatus = "syncd"
    //                 await IndexedDB.Update('MyDatabase', 'documents', localDoc);
    //             }
    //         }

    //         console.log("Server to Client sync done");
    //     } catch (error) {
    //         console.error('Error syncing with server:', error);
    //     }
    // }

    // async syncWithServer() {
    //     if (!navigator.onLine) {
    //         console.log("Offline. Sync postponed.");
    //         return;
    //     }

    //     try {
    //         const unsyncedDocs = await IndexedDB.GetAll('MyDatabase', 'documents');

    //         const newDocsToSync = [];
    //         const updatedDocsToSync = [];

    //         for (let doc of unsyncedDocs) {
    //             if (doc.syncStatus === "new") {
    //                 newDocsToSync.push(doc);
    //             } else if (doc.syncStatus === "updated") {
    //                 updatedDocsToSync.push(doc);
    //             }
    //             doc.lastModified = Date.now();
    //             doc.syncStatus = "synced";
    //         }

    //         const requests = [];
    //         if (newDocsToSync.length) {
    //             requests.push(this.apiRequest('/api/uploadDocuments', 'POST', newDocsToSync));
    //         }
    //         if (updatedDocsToSync.length) {
    //             requests.push(this.apiRequest('/api/updateDocuments', 'PUT', updatedDocsToSync));
    //         }

    //         await Promise.all(requests);

    //         if (unsyncedDocs.length) {
    //             for (let doc of unsyncedDocs) {
    //                 doc.lastModified = Date.now();
    //                 doc.syncStatus = "synced";

    //                 await IndexedDB.Update('MyDatabase', 'documents', doc);
    //             }

    //         }

    //         console.log('Synced with server successfully.');
    //     } catch (error) {
    //         console.error('Error syncing with server:', error);
    //     }
    // }


    async apiRequest(url, method, data) {
        this.ids = this.getIdsFromURL()
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'), // assuming the token is stored in localStorage
                    'docid': this.ids.rootId
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

}

export { TreeEditor }