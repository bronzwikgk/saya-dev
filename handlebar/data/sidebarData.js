const sidebarData = {
    logoSrc: "https://preview.keenthemes.com/keen/demo1/assets/media/logos/default-dark.svg",
    section:[
      {
        name:"Dashboard",
        sections: [
          {
            iconClass: "ri-time-fill",
            pageName: "Recent",
            subItems: []
          },
          {
            iconClass: "ri-pencil-line",
            pageName: "Drafts",
            subItems: ["Item 1", "Item 2"]
          },
          {
            iconClass: "ri-star-line",
            pageName: "Starred",
            subItems: ["Item 1", "Item 2", "Item 3"]
          },
          {
            iconClass: "ri-user-shared-line",
            pageName: "Shared with me",
            id:"shared-with-me"
          },
          {
            iconClass: "ri-stack-line",
            pageName: "My Collection",
            subItems: ["Item 1", "Item 2", "Item 3", "Item 4"]
          },
          {
            iconClass: "ri-delete-bin-line",
            pageName: "Trash",
            subItems: ["Item 1", "Item 2"]
          }
        ],
      },
      {
        name:"Folders",
        sections:[
          {
            pageName:"My Folder 1",
            iconClass:"ri-folder-line"
          },
          {
            pageName:"My Folder 2",
            iconClass:"ri-folder-line"
          }
        ]
      }
    ]
    
    ,
    items: [
      {
        icon: 'ri-star-line',
        name: "Shared with me",
        eid:"ehh-assoc-usr-gon-all",
        action:"getOne",
        method:"get",
        id: "sharedWithMe",
        association:"tickets",
        rid:"$cookies.userId"
      },
      {
        icon: 'ri-file-copy-2-fill',
        name: "Ticket",
        id: "manageTemplates",
        subItem:[
         "Pack 1", "Pack 2"
        ]
      },
      
      {
        icon: 'ri-tools-fill',
        name: "Workspace Settings",
        id: "workspaceSettings",
      },
    ],
    folders: [
      {
        icon: 'ri-folder-line',
        name: "My folder 1",
      },
      {
        icon: 'ri-folder-line',
        name: "My folder 2",
      },
      {
        icon: 'ri-folder-line',
        name: "My folder 3",
      },
    ],
    pages: [
      { icon: "../data/images/clipboard.png", name: "page 1" },
      { icon: "../data/images/clipboard.png", name: "page 2" },
      { icon: "../data/images/clipboard.png", name: "page 3" },
      { icon: "../data/images/clipboard.png", name: "page 4" },
      { icon: "../data/images/clipboard.png", name: "page 5" },
      { icon: "../data/images/clipboard.png", name: "page 6" },
      { icon: "../data/images/clipboard.png", name: "page 7" },
    ],
  };
  
  
  
  export { sidebarData };
  