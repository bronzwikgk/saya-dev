const navbarTemplate = `
<nav>

          <div>
          <i id="backBtn" class="ri-arrow-left-s-line navIc"></i>
          <i id="forwardBtn" style="margin-left:10px" class="ri-arrow-right-s-line navIc"></i>
          
        </div>
  <form search>
          <button>
            <i class="ri-search-eye-line"></i>
          </button>
          <input eid="ehh-ent-org-smbq" action="searchManyByQuery" method="post" searchcomponent type="text" placeholder="Search">
          <ul id="searchDrop">
            <li data-flex-flx-str>
              <i class="ri-history-line"></i>
              <p>actionSpace</p>
            </li>
            <li data-flex-flx-str>
              <i class="ri-history-line"></i>
              <p>Ehh structure</p>
            </li>
            <li data-flex-flx-str>
              <i class="ri-history-line"></i>
              <p>Pari css</p>
            </li>
            
            
            
            
          </ul>
          <input type="checkbox" id="filter-toggle">
          <fieldset id="advanceSearch">
            <label for="type">Type</label>
            <input type="text" name="type" placeholder="Any">

            <label for="type">Owner</label>
            <input type="text" name="type" placeholder="Any">

            <label for="type">Has the words</label>
            <input type="text" name="type" placeholder="Any">
          </fieldset>
          <span>
            <label for="filter-toggle">
              <i class="ri-equalizer-line"></i>
            </label>
          </span>
         
        </form>
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
      <li id="{{this.id}}" action="{{this.action}}"><i class="{{this.icon}}"></i>{{this.name}}<kbd>{{this.shortKey}}</kbd> 
      {{#if this.subItems}}
        <ul id="entityDropdown">
          {{#each this.subItems}}
            <li id="{{this.id}}" action="{{this.action}}">{{this.name}}
            {{#if this.subItems}}
            <ul>
            {{#each this.subItems}}
            <li id="{{this.id}}" action="{{this.action}}"><i class="{{this.icon}}"></i>{{this.name}}<kbd>{{this.shortKey}}</kbd> 
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

export { navbarTemplate }