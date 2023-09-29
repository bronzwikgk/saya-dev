class JSONToHTMLConverter {

    static convert(template, data) {
        return JSONToHTMLConverter.convertNode(template, data);
    }

    static interpolate(template, data) {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data.hasOwnProperty(key) ? data[key] : match;
        });
    }


    static convertNode(nodeData, data) {
        let html = "";

        // If the node has a repeat directive, repeat the entire node
        if (nodeData.repeat && data[nodeData.repeat]) {
            const repeatedData = data[nodeData.repeat];
            repeatedData.forEach(dataItem => {
                html += JSONToHTMLConverter.convertNode(nodeData, dataItem);  // Pass the specific item data here
            });
        } else {
            html = `<${nodeData.tag}`;

            // Handle additional attributes like class and other properties
            if (nodeData.attributes) {
                for (const attrName in nodeData.attributes) {
                    const attrValue = JSONToHTMLConverter.interpolate(nodeData.attributes[attrName], data);
                    html += ` ${attrName}="${attrValue}"`;
                }
            }

            html += '>';

            if (nodeData.content) {
                html += JSONToHTMLConverter.interpolate(nodeData.content, data);
            }

            if (nodeData.children && nodeData.children.length > 0) {
                nodeData.children.forEach((childNode) => {
                    // Check if the child node should be repeated based on a property
                    if (childNode.repeat && !data[childNode.repeat]) {
                        return; // Skip this child node if the property does not exist
                    }
                    html += JSONToHTMLConverter.convertNode(childNode, data);  // Pass the original data here
                });
            }

            html += `</${nodeData.tag}>`;
        }

        return html;
    }


}




export { JSONToHTMLConverter }
