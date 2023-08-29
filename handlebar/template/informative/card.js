const cardTemplate = ` 
{{#each this}}
 <article data-card="">
<figure>
  <img src="{{imageUrl}}" alt="card">
</figure>
<header>
  <h4>{{name}}</h4>
</header>
<section>
  <p>{{content}}</p>
  <p>{{moto}}</p>
  
</section>
<button>View</button>
<footer>
  <small>{{footer}}</small>
</footer>
</article>
{{/each}}`

export { cardTemplate }