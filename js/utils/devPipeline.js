import { DynamicForm } from "./schemaToForm.js";

class devPipeline{

    constructor() {
this.DynamicForm = DynamicForm
    }

 initTabs() {
        const tabData = [
            { label: 'Discover',schema: {
                title: "Discover",
                fields: [
                  {
                    type: "select",
                    label: "Action",
                    name: "action",
                    options: ["Select an Option", "New", "Process"],
                  },
                  {
                    type: "chainedSelect",
                    label: "New",
                    name: "new",
                    dependsOn: "action",
                    options: {
                      New: [
                        "Select an Option",
                        "Prompt",
                        "Image",
                        "code",
                        "Manifest",
                        "chat",
                      ],
                      Process: ["Transcribe Audio", "Image to Html"],
                    },
                  },
                  {
                    type: "chainedSelect",
                    label: "Usecase",
                    name: "usecase",
                    dependsOn: "new",
                    options: {
                      Prompt: [
                        "Product Manifest Prompt Generator",
                        "Code Prompt Generator",
                        "Design Prompt generator",
                        "Voice Prompt Generator",
                        "Idea Prompt generator",
                        "Music Prompt generator",
                        "Flow Prompt Generator",
                      ],
                      Image: ["Form Prompt"],
                      code: ["From text"],
                      Manifest: [
                        "Product Manifest",
                        "Library Comparison",
                        "Recommended Library",
                        "Create Flow",
                        "Competitor Comparison",
                        "Discovery doc",
                      ],
                    },
                    next: {
                      // This 'next' property defines what should appear based on the chosen option
                      "Create Flow": {
                        type: "select",
                        label: "Flow For",
                        name: "flowFor",
                        options: ["select an option", "For ActionEngine"],
                        next: {
                          "For ActionEngine": {
                            type: "select",
                            label: "ActionEngine Task",
                            name: "actionEngineTask",
                            options: [
                              "select an option",
                              "signUp",
                              "signIn",
                              "CreateQr",
                              "shareQr",
                            ],
                          },
                        },
                      },
                    },
                    required: true,
                  },
                  {
                    type: "select",
                    label: "Open Api Listdown",
                    name: "openApis",
                    options: ["GPT-4",
    "gpt-4-32k",
    "GPT-3.5",
    "gpt-3.5-turbo-16k",
    "DALL·E",
    "Whisper",
    "Embeddings",
    "Moderation"],
                  },
                 
                  {
                    type: "button",
                    label: "Submit", // This is the text that will be displayed on the button
                    action: "submit", // This can define the type or action of the button. For now, let's keep it simple with "submit"
                  },
        
                ],
              } },
            { label: 'Design', schema: {
                title: "Design",
                fields: [
                  {
                    type: "select",
                    label: "Action",
                    name: "action",
                    options: ["Select an Option", "New", "Process"],
                  },
                  {
                    type: "chainedSelect",
                    label: "New",
                    name: "new",
                    dependsOn: "action",
                    options: {
                      New: [
                        "Select an Option",
                        "Prompt",
                        "Image",
                        "code",
                        "Manifest",
                        "chat",
                      ],
                      Process: ["Transcribe Audio", "Image to Html"],
                    },
                  },
                  {
                    type: "chainedSelect",
                    label: "Usecase",
                    name: "usecase",
                    dependsOn: "new",
                    options: {
                      Prompt: [
                        "Product Manifest Prompt Generator",
                        "Code Prompt Generator",
                        "Design Prompt generator",
                        "Voice Prompt Generator",
                        "Idea Prompt generator",
                        "Music Prompt generator",
                        "Flow Prompt Generator",
                      ],
                      Image: ["Form Prompt"],
                      code: ["From text"],
                      Manifest: [
                        "Product Manifest",
                        "Library Comparison",
                        "Recommended Library",
                        "Create Flow",
                        "Competitor Comparison",
                        "Discovery doc",
                      ],
                    },
                    next: {
                      // This 'next' property defines what should appear based on the chosen option
                      "Create Flow": {
                        type: "select",
                        label: "Flow For",
                        name: "flowFor",
                        options: ["select an option", "For ActionEngine"],
                        next: {
                          "For ActionEngine": {
                            type: "select",
                            label: "ActionEngine Task",
                            name: "actionEngineTask",
                            options: [
                              "select an option",
                              "signUp",
                              "signIn",
                              "CreateQr",
                              "shareQr",
                            ],
                          },
                        },
                      },
                    },
                    required: true,
                  },
                  {
                    type: "select",
                    label: "Open Api Listdown",
                    name: "openApis",
                    options: ["GPT-4",
                    "gpt-4-32k",
                    "GPT-3.5",
                    "gpt-3.5-turbo-16k",
                    "DALL·E",
                    "Whisper",
                    "Embeddings",
                    "Moderation"],
                  },
                 
                  {
                    type: "button",
                    label: "Submit", // This is the text that will be displayed on the button
                    action: "submit", // This can define the type or action of the button. For now, let's keep it simple with "submit"
                  },
        
                ],
              } },
              { label: 'Develop', schema: {
                title: "Development",
                fields: [
                  {
                    type: "select",
                    label: "Action",
                    name: "action",
                    options: ["Select an Option", "New", "Process"],
                  },
                  {
                    type: "chainedSelect",
                    label: "New",
                    name: "new",
                    dependsOn: "action",
                    options: {
                      New: [
                        "Select an Option",
                        "Prompt",
                        "Image",
                        "code",
                        "Manifest",
                        "chat",
                      ],
                      Process: ["Transcribe Audio", "Image to Html"],
                    },
                  },
                  {
                    type: "chainedSelect",
                    label: "Usecase",
                    name: "usecase",
                    dependsOn: "new",
                    options: {
                      Prompt: [
                        "Product Manifest Prompt Generator",
                        "Code Prompt Generator",
                        "Design Prompt generator",
                        "Voice Prompt Generator",
                        "Idea Prompt generator",
                        "Music Prompt generator",
                        "Flow Prompt Generator",
                      ],
                      Image: ["Form Prompt"],
                      code: ["From text"],
                      Manifest: [
                        "Product Manifest",
                        "Library Comparison",
                        "Recommended Library",
                        "Create Flow",
                        "Competitor Comparison",
                        "Discovery doc",
                      ],
                    },
                    next: {
                      // This 'next' property defines what should appear based on the chosen option
                      "Create Flow": {
                        type: "select",
                        label: "Flow For",
                        name: "flowFor",
                        options: ["select an option", "For ActionEngine"],
                        next: {
                          "For ActionEngine": {
                            type: "select",
                            label: "ActionEngine Task",
                            name: "actionEngineTask",
                            options: [
                              "select an option",
                              "signUp",
                              "signIn",
                              "CreateQr",
                              "shareQr",
                            ],
                          },
                        },
                      },
                    },
                    required: true,
                  },
                  {
                    type: "select",
                    label: "Open Api Listdown",
                    name: "openApis",
                    options: ["GPT-4",
    "gpt-4-32k",
    "GPT-3.5",
    "gpt-3.5-turbo-16k",
    "DALL·E",
    "Whisper",
    "Embeddings",
    "Moderation"],
                  },
                 
                  {
                    type: "button",
                    label: "Submit", // This is the text that will be displayed on the button
                    action: "submit", // This can define the type or action of the button. For now, let's keep it simple with "submit"
                  },
        
                ],
              } },
              { label: 'Deploy', schema: {
                title: "Deployment",
                fields: [
                  {
                    type: "select",
                    label: "Action",
                    name: "action",
                    options: ["Select an Option", "New", "Process"],
                  },
                  {
                    type: "chainedSelect",
                    label: "New",
                    name: "new",
                    dependsOn: "action",
                    options: {
                      New: [
                        "Select an Option",
                        "Prompt",
                        "Image",
                        "code",
                        "Manifest",
                        "chat",
                      ],
                      Process: ["Transcribe Audio", "Image to Html"],
                    },
                  },
                  {
                    type: "chainedSelect",
                    label: "Usecase",
                    name: "usecase",
                    dependsOn: "new",
                    options: {
                      Prompt: [
                        "Product Manifest Prompt Generator",
                        "Code Prompt Generator",
                        "Design Prompt generator",
                        "Voice Prompt Generator",
                        "Idea Prompt generator",
                        "Music Prompt generator",
                        "Flow Prompt Generator",
                      ],
                      Image: ["Form Prompt"],
                      code: ["From text"],
                      Manifest: [
                        "Product Manifest",
                        "Library Comparison",
                        "Recommended Library",
                        "Create Flow",
                        "Competitor Comparison",
                        "Discovery doc",
                      ],
                    },
                    next: {
                      // This 'next' property defines what should appear based on the chosen option
                      "Create Flow": {
                        type: "select",
                        label: "Flow For",
                        name: "flowFor",
                        options: ["select an option", "For ActionEngine"],
                        next: {
                          "For ActionEngine": {
                            type: "select",
                            label: "ActionEngine Task",
                            name: "actionEngineTask",
                            options: [
                              "select an option",
                              "signUp",
                              "signIn",
                              "CreateQr",
                              "shareQr",
                            ],
                          },
                        },
                      },
                    },
                    required: true,
                  },
                  {
                    type: "select",
                    label: "Open Api Listdown",
                    name: "openApis",
                    options: ["GPT-4",
    "gpt-4-32k",
    "GPT-3.5",
    "gpt-3.5-turbo-16k",
    "DALL·E",
    "Whisper",
    "Embeddings",
    "Moderation"],
                  },
                 
                  {
                    type: "button",
                    label: "Submit", // This is the text that will be displayed on the button
                    action: "submit", // This can define the type or action of the button. For now, let's keep it simple with "submit"
                  },
        
                ],
              } },
            // Add more tabs as needed
        ];
    
        const tabsNav = document.querySelector('.tabs-nav');
        const tabsContent = document.querySelector('.tabs-content');
    
        tabData.forEach((tab, index) => {
            // Create tab button
            const tabButton = document.createElement('span');
            tabButton.className = 'tab-button';
            tabButton.textContent = tab.label;
            tabButton.setAttribute('data-target', `#tab${index + 1}`);
            tabsNav.appendChild(tabButton);
    
            // Create tab content
            const tabDiv = document.createElement('div');
            tabDiv.className = 'tab';
            tabDiv.id = `tab${index + 1}`;
            console.log(this.DynamicForm);
            tabDiv.appendChild(this.DynamicForm.generate(tab.schema));
            tabsContent.appendChild(tabDiv);
        });
    
        // Activate the first tab
        tabsNav.querySelector('.tab-button').classList.add('active');
        tabsContent.querySelector('.tab').classList.add('active');
    
        // Add event listeners to the tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabs = document.querySelectorAll('.tab');
    
        tabButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                // Deactivate all tabs and buttons
                tabButtons.forEach(button => button.classList.remove('active'));
                tabs.forEach(tab => tab.classList.remove('active'));
    
                // Activate clicked tab and button
                btn.classList.add('active');
                document.querySelector(btn.getAttribute('data-target')).classList.add('active');
            });
        });
    }
    
   
}

export {devPipeline}