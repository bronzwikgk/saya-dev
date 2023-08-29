const siteNav = `

<nav>

<div>
SAYA

</div>
 
  <input type="checkbox" id="nav-toggle" />
  <span>
    <label for="nav-toggle">
      <span></span>
      <span></span>
      <span></span>
    </label>
  </span>
  <ul nav-list>
    {{#each menuItems}}    
      <li eid="{{this.eid}}" action="{{this.action}}"><i class="{{this.icon}}"></i><a href="{{this.href}}">{{this.name}}</a><kbd>{{this.shortKey}}</kbd> 
      {{#if this.subItems}}
        <ul id="entityDropdown">
          {{#each this.subItems}}
            <li eid="{{this.eid}}" action="{{this.action}}"><i class="{{this.icon}}"></i>{{this.name}}<kbd>{{this.shortKey}}</kbd> 
            {{#if this.subItems}}
            <ul>
            {{#each this.subItems}}
            <li eid="{{this.eid}}" action="{{this.action}}"><i class="{{this.icon}}"></i>{{this.name}}<kbd>{{this.shortKey}}</kbd> 
            {{#if this.subItems}}
            <ul>
            {{#each this.subItems}}
            <li eid="{{this.eid}}" action="{{this.action}}"><i class="{{this.icon}}"></i>{{this.name}}<kbd>{{this.shortKey}}</kbd></li>
          {{/each}}
          </ul>
            {{/if}}
            </li>
          {{/each}}
          </ul>
            {{/if}}
            </li>
           
          {{/each}}
        </ul>
      {{/if}}
      {{#if this.subMenu}}
      <ul>
      <span data-flex-spc-evn>
      <ol>
      {{#each this.subMenu}}
          <li>
            <article data-picto2>
              <img src="{{img}}" />
              <div>
                <h5>{{name}}</h5>
                <p>{{text}}</p>
              </div>
            </article>
          </li>
          {{/each}}
        </ol>
      </span>
      </ul>
    {{/if}}
    {{#if this.subTab}}
    <ul>
    <section data-tabs>
    {{#each this.subTab}}
    <input type="radio" name="tabs1" id="{{this.id}}" {{#if this.checked}}checked{{/if}} />
    <label for="{{this.id}}">{{this.label}}</label>
    <article class="tab">
      <span data-flex-spc-evn>
        {{{this.content}}}
      </span>
    </article>
    {{/each}}
  </section>
  
  </ul>
    {{/if}}
      </li>
    {{/each}}
  </ul>

</nav>


`

export { siteNav }