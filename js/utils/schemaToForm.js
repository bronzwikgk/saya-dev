class DynamicForm {
    static generate(schema) {
        const form = document.createElement("form");
        // const targetElement = document.querySelector(target);

        const title = document.createElement("h2");
        title.textContent = schema.title;
        form.appendChild(title);
        form.id = schema.id

        schema.fields.forEach((field) => {
            switch (field.type) {
                case "text":
                case "date":
                case "email":
                case "password":
                    DynamicForm.addInputField(form, field);
                    break;
                case "select":
                    DynamicForm.addSelectField(form, field);
                    break;
                case "chainedSelect":
                    DynamicForm.addChainedSelectField(form, field);
                    break;
                case "radio":
                    DynamicForm.addRadioField(form, field);
                    break;
                case "checkbox":
                    DynamicForm.addCheckboxField(form, field);
                    break;
                case "fieldset":
                    DynamicForm.addFieldset(form, field);
                    break;
                case "textarea":
                    DynamicForm.addTextarea(form, field);
                    break;
                case "button":
                    DynamicForm.addButton(form, field);
                    break;
                case "file":
                    DynamicForm.addFileField(form, field);
                    break;
            }
        });

        // targetElement.appendChild(form);
        return form
    }

    static addInputField(form, field) {
        const label = document.createElement("label");
        label.textContent = field.label;

        const input = document.createElement("input");
        input.type = field.type;
        input.name = field.name;

        if (field.required) input.required = true;

        label.appendChild(input);
        form.appendChild(label);
    }



    static addSelectField(form, field) {
        const label = document.createElement("label");
        label.textContent = field.label;

        const select = document.createElement("select");
        select.name = field.name;
        field.options.forEach((option) => {
            const optElement = document.createElement("option");
            optElement.value = option;
            optElement.textContent = option;
            select.appendChild(optElement);
        });

        if (field.next) {
            select.addEventListener("change", (event) => {
                DynamicForm.handleCascadingDropdown(form, event.target.value, field, select);
            });
        }

        label.appendChild(select);
        form.appendChild(label);
    }

    static addChainedSelectField(form, field) {
        const label = document.createElement("label");
        label.textContent = field.label;

        const select = document.createElement("select");
        select.name = field.name;

        DynamicForm.populateChainedSelect(select, field, "");

        const dependencySelect = form.querySelector(`[name="${field.dependsOn}"]`);
        if (dependencySelect) {
            dependencySelect.addEventListener("change", (event) => {
                DynamicForm.populateChainedSelect(select, field, event.target.value);
            });
        }

        if (field.next) {
            select.addEventListener("change", (event) => {
                DynamicForm.handleCascadingDropdown(form, event.target.value, field, select);
            });
        }

        label.appendChild(select);
        form.appendChild(label);
    }

    static populateChainedSelect(select, field, dependencyValue) {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }

        const options = field.options[dependencyValue] || [];
        options.forEach((option) => {
            const optElement = document.createElement("option");
            optElement.value = option;
            optElement.textContent = option;
            select.appendChild(optElement);
        });
    }

    static addButton(form, field) {
        const button = document.createElement("button");
        button.textContent = field.label;

        switch (field.action) {
            case "submit":
                button.type = "submit";
                break;
            default:
                button.type = "button";
                break;
        }

        form.appendChild(button);
    }

    static addRadioField(form, field) {
        const fieldWrapper = document.createElement("div");
        fieldWrapper.textContent = field.label;

        field.options.forEach((option) => {
            const label = document.createElement("label");
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = field.name;
            radio.value = option;

            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            fieldWrapper.appendChild(label);
        });

        form.appendChild(fieldWrapper);
    }

    static addCheckboxField(form, field) {
        const label = document.createElement("label");
        label.textContent = field.label;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = field.name;

        label.prepend(checkbox);
        form.appendChild(label);
    }

    static removeCascadingFields(form, fieldName) {
        const cascadingField = form.querySelector(`[data-cascade="${fieldName}"]`);
        if (cascadingField) {
            form.removeChild(cascadingField);
            DynamicForm.removeCascadingFields(form, cascadingField.querySelector("select, input").name);
        }
    }

    static handleCascadingDropdown(form, value, field, previousSelect) {
        DynamicForm.removeCascadingFields(form, field.name);

        const nextField = field.next[value];
        if (nextField) {
            switch (nextField.type) {
                case "select":
                case "chainSelect":
                    DynamicForm.addChainSelectFieldAfter(form, nextField, previousSelect);
                    break;
            }
        }
    }

    static addChainSelectFieldAfter(form, field, previousSelect) {
        const label = document.createElement("label");
        label.textContent = field.label;
        label.setAttribute("data-cascade-from", previousSelect.name);

        const select = document.createElement("select");
        select.name = field.name;

        field.options.forEach((option) => {
            const optElement = document.createElement("option");
            optElement.value = option;
            optElement.textContent = option;
            select.appendChild(optElement);
        });

        if (field.next) {
            select.addEventListener("change", (event) => {
                DynamicForm.handleCascadingDropdown(form, event.target.value, field, select);
            });
        }

        label.appendChild(select);
        form.insertBefore(label, previousSelect.parentNode.nextSibling);
    }

    static addTextarea(form, field) {
        const label = document.createElement("label");
        label.textContent = field.label;

        const textarea = document.createElement("textarea");
        textarea.name = field.name;

        label.appendChild(textarea);
        form.appendChild(label);
    }

    static addFileField(form, field) {
        const label = document.createElement("label");
        label.textContent = field.label;

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.name = field.name;
        if (field.accept) {
            fileInput.accept = field.accept;
        }

        label.appendChild(fileInput);
        form.appendChild(label);
    }




}


export { DynamicForm }