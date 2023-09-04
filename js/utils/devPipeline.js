
import { DynamicForm } from "./schemaToForm.js";

class devPipeline {

    constructor() {
        this.DynamicForm = DynamicForm
    }

    initTabs() {
        const tabData = [
            {
                label: 'Discover', schema: {
                    id: 'discoverForm',
                    title: "Discover",
                    fields: [
                        {
                            type: "select",
                            label: "Action",
                            name: "action",
                            options: [
                                "Select an Option",
                                "Product_Manifest_Prompt_Generator",
                                "Code_Prompt_Generator",
                                "Design_Prompt_generator",
                                "Voice_Prompt_Generator",
                                "Idea_Prompt_generator",
                                "Music_Prompt_generator",
                                "Flow_Prompt_Generator",
                                "image_From_Text",
                                "Generate_code_From_Prompt",
                                "Product_Manifest",
                                "Library_Comparison",
                                "Recommend_Library",
                                "Create Flow",
                                "competitor_comparison",
                                "discovery_doc",
                                "Transcribe_Audio",
                                "Image_to_html"
                            ],
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
                        },

                        {
                            type: "chainedSelect",
                            label: "Prefix",
                            name: "prefix",
                            dependsOn: "action",
                            options: {
                                Product_Manifest_Prompt_Generator: ["Select an option", "Act as a product manager"],
                                Code_Prompt_Generator: ["Select an option", "Act as a software engineer"],
                                Design_Prompt_generator: ["Select an option", "Act as a UI/UX designer"],
                                Voice_Prompt_Generator: ["Select an option", "Act as a voiceover artist"],
                                Idea_Prompt_generator: ["Select an option", "Act as an innovator"],
                                Music_Prompt_generator: ["Select an option", "Act as a musician"],
                                Flow_Prompt_Generator: ["Select an option", "Act as a workflow designer"],
                                image_From_Text: ["Select an option", "Act as a graphic designer"],
                                Generate_code_From_Prompt: ["Select an option", "Act as a developer"],
                                Product_Manifest: ["Select an option", "Act as a product owner"],
                                Library_Comparison: ["Select an option", "Act as a backend developer"],
                                Recommend_Library: ["Select an option", "Act as a software architect"],
                                Create_Flow: ["Select an option", "Act as a process engineer"],
                                competitor_comparison: ["Select an option", "Act as a market analyst"],
                                discovery_doc: ["Select an option", "Act as a researcher"],
                                Transcribe_Audio: ["Select an option", "Act as a transcriptionist"],
                                Image_to_html: ["Select an option", "Act as a frontend developer"]
                            },
                        },


                        {
                            type: "button",
                            label: "Submit", // This is the text that will be displayed on the button
                            action: "submit", // This can define the type or action of the button. For now, let's keep it simple with "submit"
                        },

                    ],
                }
            },
            {
                label: 'Design', schema: {
                    id: 'designForm',
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
                }
            },
            {
                label: 'Develop', schema: {
                    id: 'developmentForm',
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
                }
            },
            {
                label: 'Deploy', schema: {
                    id: 'deployForm',
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
                }
            },
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

    promptGenerator(prompt, action, prefix) {
        return `${prefix}, Provide ${action.replace(/_/g, ' ').toLowerCase()} for Product - ${JSON.stringify(prompt)}. Note:- Provide your response in json in this format - {"fileName":"todoManifest.{fomatName-md,js,html,css,gs,py}","data":"{content}"}. Every file shoud be provided in seperate json, so you could provide an array of jsons`;
    }

    promptForm(e, prompt) {

        let formData = new FormData(event.target);

        let action = formData.get('action');
        let prefix = formData.get('prefix')

        // Define the schema for the second form
        const schema = {
            title: "Prompt",
            id: "openaiform",
            fields: [
                // Define the fields for the second form based on the extracted data or any other criteria
                {
                    type: "textarea",
                    label: "prompt",
                    name: "prompt",
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

            ]
        };

        // Generate the second form using the DynamicForm class
        const secondForm = DynamicForm.generate(schema);

        let generatedPrompt = this.promptGenerator(prompt, action, prefix);

        secondForm.prompt.value = generatedPrompt


        e.target.parentNode.appendChild(secondForm)

    }

    parseGPTResponse(response) {
        const codeRegex = /```(.*?)```/gs;
        let match;
        const codeSnippets = [];

        while ((match = codeRegex.exec(response)) !== null) {
            codeSnippets.push(match[1].trim());
        }

        const textParts = response.split(/```.*?```/gs).map(part => part.trim());

        return { textParts, codeSnippets };
    }

    constructHTML(parsedResponse) {
        let html = '';

        parsedResponse.textParts.forEach((text, index) => {
            html += `<div class="text-part">${text}</div>`;
            if (parsedResponse.codeSnippets[index]) {
                html += `<pre class="code-part">${parsedResponse.codeSnippets[index]}</pre>`;
            }
        });

        return html;
    }

    saveToCache(fileName, data) {
        // Fetch the existing data for this file from localStorage
        const existingData = localStorage.getItem(fileName);

        let mergedData;

        // Check if the document exists in localStorage
        if (existingData) {
            // If the document exists, merge the new data with the existing data
            mergedData = existingData + "\n" + data;
        } else {
            // If the document doesn't exist, create a new one with the provided data
            mergedData = data;
        }

        // Store the merged data (or new data) in localStorage
        localStorage.setItem(fileName, mergedData);

        console.log(fileName + " successfully saved in local storage");
    }   

    isValidFormat(response) {
        const validExtensions = ['.md', '.js', '.html', '.css', '.gs', '.py'];

        if (Array.isArray(response)) {
            console.log("its an array")
            for (let item of response) {
                if (!item.hasOwnProperty('fileName') || !item.hasOwnProperty('data')) {

                    console.log("Don't have corrent format of json")
                    return false;
                }

                const fileName = item.fileName;
                const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);

                if (typeof fileName !== 'string' || !validExtensions.includes(`.${fileExtension}`)) {
                    console.log("not a valid extention ")
                    return false;
                }

                if (typeof item.data !== 'string') {
                    console.log("Data is not in string  ")
                    return false;
                }
            }
            console.log("Its in valid format")
            return true; // All items in the array are valid
        }

        // If not an array, check if it's an individual object in the desired format
        if (!response.hasOwnProperty('fileName') || !response.hasOwnProperty('data')) {
            return false;
        }

        const fileName = response.fileName;
        const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);

        if (typeof fileName !== 'string' || !validExtensions.includes(`.${fileExtension}`)) {
            return false;
        }

        if (typeof response.data !== 'string') {
            return false;
        }

        return true; // The individual object is valid
    }


    extractValidJsonObjects(inputString) {
        console.log(inputString);
        if (typeof inputString !== 'string') {
            console.error("Provided input is not a string.");
            return [];
        }

        let parse = JSON.parse(inputString)
        let isValid = this.isValidFormat(parse)
        if (isValid) {
            return parse
        }

        const potentialMatches = inputString.match(/{[^{}]+}/g) || [];
        const validResponses = [];

        potentialMatches.forEach(jsonString => {
            try {
                const parsedData = JSON.parse(jsonString);
                if (isValidFormat(jsonString)) {
                    validResponses.push(parsedData);
                }
            } catch (err) {
                // If parsing fails, the string isn't valid JSON. Continue to the next.
            }
        });

        return validResponses;
    }



}

export { devPipeline }