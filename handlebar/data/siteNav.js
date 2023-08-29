const siteNavData = {
    iconItem: [
      { icon: 'ri-notification-fill' },
      { icon: 'ri-message-fill' },
      { icon: 'ri-notification-badge-fill' },
      { icon: 'ri-moon-fill' },
      { icon: 'ri-profile-fill' }
    ],
    menuItems: [
     
      {
        name: "Product",
        subTab: [
            {
                id: "tabone",
                
                content: '<ol><p>Client Management</p><li>CRM</li><li>Scheduling</li><li>proposals</li><li>Contracts</li><li>Forms</li></ol><ol><p>Project Management</p><li>Time tracking</li><li>Tasks</li><li>File sharing</li><li>Client portal</li><li>Collaboration</li></ol><ol><p>Financial Management</p><li>Invoicing</li><li>Payments</li><li>Accounting</li><li>Taxes</li><li>Banking</li></ol>',
                checked:"true"
            },
           
           


        ]
        
      },
      {
        name: "Possiility",
        subItems: [
          { name: "inventory management" },
          { name: "sales" },
          { name: "HRMS" },
          { name: "Project Management" },
        ]
      },
      {
        name:"Pricing"
      },
      {
        name:"Purchase"
      },
      {
        name:"SignUp",
        href:"/auth.html",
        eid:"/signUp",
        action:"get",
        method:"get"
      },
      {
        name:"SignIn",
        href:"/auth.html",
        eid:"/signIn",
        action:"get",
        method:"get"
      }
  
  
  
  
    ],
  }
  export { siteNavData }