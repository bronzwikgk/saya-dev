class Router {
    constructor(routes) {
        this.routes = routes;
        this._loadInitialRoute();
        this._initializeListeners();
    }

    _matchUrlToRoute(urlSegs) {
        for (let route of this.routes) {
            const routePathSegs = route.path.split('/').slice(1);

            if (routePathSegs.length !== urlSegs.length) {
                continue;
            }

            const isMatch = routePathSegs.every((routePathSeg, i) => {
                return routePathSeg.startsWith(':') || routePathSeg === urlSegs[i];
            });

            if (isMatch) {
                return route;
            }
        }

        return null;
    }

    _loadInitialRoute() {
        // If there's a hash present in the URL, use it; otherwise, default to the root path
        const hashFragment = window.location.hash.substring(1) || '/';
        const pathNameSplit = hashFragment.split('/');
        const pathSegs = pathNameSplit.length > 1 ? pathNameSplit.slice(1) : [];
        this.loadRoute(false, ...pathSegs);
    }

    _updateActiveCSS(cssFiles) {
        const head = document.querySelector('head');
        // Remove old links
        const oldLinks = Array.from(head.querySelectorAll('link.dynamic-css'));
        oldLinks.forEach(link => head.removeChild(link));
      
        // Add new links
        cssFiles.forEach(file => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = file;
            link.className = 'dynamic-css'; // so that we can identify these later
            head.appendChild(link);
        });
    }
    
    _updateActiveScripts(scriptFiles) {
        const body = document.querySelector('body');
        // Remove old scripts
        const oldScripts = Array.from(body.querySelectorAll('script.dynamic-script'));
        oldScripts.forEach(script => body.removeChild(script));
      
        // Add new scripts
        scriptFiles.forEach(file => {
            const script = document.createElement('script');
            script.src = file;
            script.className = 'dynamic-script'; // so that we can identify these later
            body.appendChild(script);
        });
    }
    
    loadRoute(updateHistory = true, ...urlSegs) {
        if (updateHistory) {
            const url = '/' + urlSegs.join('/');
            window.location.hash = url;
        }

        const matchedRoute = this._matchUrlToRoute(urlSegs);

        if (matchedRoute) {
            this._updateActiveCSS(matchedRoute.css || []);
            this._renderComponents(matchedRoute.components);
            this._updateActiveScripts(matchedRoute.scripts || []);
        } else {
            this._renderError();
        }
    }


    _renderComponents(components) {
        for (let section in components) {
            const sectionElement = document.querySelector(`[data-router="${section}"]`);


            if (!sectionElement) {
                console.error(`Element with id "${section}" not found.`);
                continue;
            }

            // Determine if a section's components need to be rendered or replaced
            let componentNames = Array.isArray(components[section])
                ? components[section].map(comp => comp.name).join(',')
                : components[section].name;

            // Check if the section exists in the DOM and if it needs to be replaced
            if (sectionElement.getAttribute('data-component') !== componentNames) {
                sectionElement.innerHTML = '';

                if (Array.isArray(components[section])) {
                    for (const component of components[section]) {
                        sectionElement.innerHTML += component.html;
                    }
                } else {
                    sectionElement.innerHTML = components[section].html;
                }

                // Update the section with a data attribute denoting which components it has
                sectionElement.setAttribute('data-component', componentNames);
            }
        }
    }


    _renderError() {
        const appDiv = document.querySelector('[data-router="app"]');

        if (appDiv) {
            appDiv.innerHTML = "Error: Route not found.";
        } else {
            console.error("Element with id 'app' not found.");
        }
    }

    _initializeListeners() {
        document.body.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                const href = event.target.getAttribute('href');
                if (this._isAppRoute(href)) {
                    event.preventDefault();
                    this.loadRoute(true, ...href.split('/').slice(1));
                }
            }
        });

        window.addEventListener('hashchange', () => {
            console.log("hash changed");
            const pathName = window.location.hash.split('#')[1] || "/"
            const pathNameSplit = pathName.split('/');
            console.log(pathNameSplit);
            const pathSegs = pathNameSplit ? pathNameSplit.slice(1) : [];
            this.loadRoute(false, ...pathSegs);
        });

    }

    _isAppRoute(href) {
        return this.routes.some(route => route.path === href);
    }
}


export { Router }