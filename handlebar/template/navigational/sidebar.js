const sidebarTemplate = `

  
  <header>
    <img src="{{logoSrc}}" alt="" />
  </header>
  {{#each section}}
  <section>
    <small>{{name}}</small>
    <div data-tree="">
      {{#each sections}}
        <details>
          <summary>
            <span>
              <i class="{{this.iconClass}}"></i>
              <span id="{{this.id}}" class="pageName">{{this.pageName}}</span>
            </span>
            {{#if this.subItems}}
              <i class="ri-arrow-down-s-line"></i>
            {{/if}}
          </summary>
          {{#if this.subItems}}
          {{#each this.subItems}}
            <details>
                <summary>
                  <p>{{this}}</p>
                </summary>
                </details>
                {{/each}}
          {{/if}}
        </details>
      {{/each}}
    </div>
  </section>
{{/each}}
 



`
export { sidebarTemplate };
