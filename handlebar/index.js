import { sidebarData } from "./data/sidebar.js";
import { sidebarTemplate } from "./template/navigational/sidebar.js";
import { navbarData } from "./data/navbar.js";
import { navbarTemplate } from "./template/navigational/navbar.js";
import { siteNav } from "./template/navigational/siteNav.js";
import { siteNavData } from "./data/siteNav.js";
import { cardData } from "./data/card.js";
import { cardTemplate } from "./template/informative/card.js";
import { searchComponent } from "./template/functional/search.js";
import { searchData } from "./data/search.js";
import { explorerHeader } from "./template/informative/explorerHeader.js";
import { explorerHeaderData } from "./data/explorerHeader.js";
import { explorerList } from "./template/informative/explorerList.js";
import { explorerListData } from "./data/explorerList.js";
import { dashData } from "./data/dashData.js";
import { dashBoard } from "./template/informative/dashcard.js";
import { profileHeaderData } from "./data/profileHeader.js";

const engine = [
    {
        template: navbarTemplate,
        data: navbarData,
        sel: "#navbar"
    },
    {
        template:sidebarTemplate,
        data:sidebarData,
        sel:"#sidebarPari"
    },
    {
        template: siteNav,
        data:siteNavData,
        sel:"#landNav"
    },
    {
        template: explorerHeader,
        data:explorerHeaderData,
        sel:"#header"
    },
    // {
    //     template:explorerList,
    //     data:explorerListData,
    //     sel:"#explorerList"
    // },
   
]

function renderHandlebarsTemplate(template, data, selector) {

    // Compile the Handlebars template
    const compiledTemplate = Handlebars.compile(template);

    // Render the template with the data
    const renderedHtml = compiledTemplate(data);

    // Inject html into dom 

    document.querySelector(selector).innerHTML = renderedHtml

    // Return the rendered HTML
    // return renderedHtml;
}


engine.forEach((element) => {
    if (document.querySelector(element.sel)) {
        renderHandlebarsTemplate(element.template, element.data, element.sel)
    }

})

