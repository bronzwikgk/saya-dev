const explorerHeader = `
<article>
    <h1>{{title}}</h1>
    <p>{{description}}</p>
  </article>
  <article>
  {{#if buttons}}
  {{#each buttons}}
  <button id="{{this.id}}"><i class="{{this.icon}}"></i>{{this.title}}</button>
  {{/each}}
  {{/if}}
    
    
  </article>
`

export {explorerHeader}