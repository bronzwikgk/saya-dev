const dashBoard = `

<header>
  <h6>{{dashboardTitle}}</h6>
</header>
<article data-grid-2>
  {{#each articles}}
  <article data-flex-col-btw{{#if bgPrimary}} bg-primary{{/if}}>
    <article data-picto2>
      <div>
        <h2>{{heading}}</h2>
        <p>{{subheading}}</p>
      </div>
    </article>
    <article>
      <small data-flex-spc-btw>Percentage <span>{{percentage}}</span></small>
      <progress id="file" value="{{percentageValue}}" max="100">{{percentage}}</progress>
    </article>
  </article>
  {{/each}}
</article>
<br>
{{#if teamMembers}}
<article data-flex-col-evn>
  <h5>Team members</h5>
  {{#each teamMembers}}
  <article data-picto2 mgy-1>
    <img src="{{imageSrc}}">
    <div>
      <h5>{{name}}</h5>
      <p>{{role}}</p>
    </div>
    <a>
      <i class="ri-arrow-right-fill"></i>
    </a>
  </article>
  {{/each}}
</article>
<br>
{{/if}}
{{#if visitCountries}}
<article data-flex-col-evn>
  <h6>Visits by Country</h6>
  <small>{{visitStats}}</small>
  <table table-2d>
    <tbody>
      {{#each visitCountries}}
      <tr>
        <td>
          <article data-picto2>
            <img src="{{countryImage}}">
            <div>
              <h5>{{country}}</h5>
              <p>{{somethingElse}}</p>
            </div>
          </article>
        </td>
        <td>
          <div>{{visitCount}}</div>
        </td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</article>
<br>
{{/if}}
{{#if projectStats}}
<article>
  <h5>Project Stats</h5>
  <small>{{updateTime}}</small>
  <table bd-none>
    <thead>
      <tr>
        <th>
          <div>Item</div>
        </th>
        <th>
          <div>Budget</div>
        </th>
        <th>
          <div>Progress</div>
        </th>
      </tr>
    </thead>
    <tbody>
      {{#each projectStats}}
      <tr>
        <td>
          <div>{{date}}</div>
        </td>
        <td>
          <div>{{location}}</div>
        </td>
        <td>
          <div>{{name}}</div>
        </td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</article>
{{/if}}

`

export {dashBoard}