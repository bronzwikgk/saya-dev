const searchComponent = `
<button>
<i class="ri-search-eye-line"></i>
</button>
<input searchComponent type="text" placeholder="Search" />
<fieldset id="searchDrop">
{{#each this}}
<label for="{{name}}">{{label}}</label>
<input type="text" name="{{name}}" placeholder="{{placeholder}}" />
{{/each}}
</fieldset>
`

export { searchComponent }