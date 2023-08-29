const explorerList = `
{{#each this}}
<article data-flex-btw-cnt="" hov-dark="">
              <article data-flex-btw-cnt="" gap-1="">
                <input type="checkbox">
                <i icn-lg-bl="" class="ri-file-text-line"></i>
                <div>
                  <h6><a href="/editor.html#/{{this.entityId}}">{{this.title}}</a></h6>
                  <p small-dark="">{{moto}} | content: <span>{{content}}</span> | logo: <span>{{logo}}</span></p>
                </div>
              </article>
              <a>
                <i class="ri-more-fill"></i>
                <ul class="meatballMenu" small-dark="">
                  <li rid ={{this.entityId}} action="get" eid="/updateOrg" ><i class="ri-pencil-fill"></i> Update</li>
                  <li><i class="ri-drag-move-2-line"></i> Move</li>
                  <li><i class="ri-file-copy-2-fill"></i> Copy</li>
                  <li rid ={{this.entityId}} action="get" eid="/assignRoleToOrg"><i class="ri-share-box-fill"></i> Share</li>
                  <li><i class="ri-star-line"></i> Add to My Shortcuts</li>
                  <hr>
                  <li><i class="ri-history-line"></i> See version history</li>
                  <li>
                    <i class="ri-file-text-fill"></i> Make doc into a template
                  </li>
                  <li  rid ={{this.entityId}} id="ehh-ent-org-did" action="deleteOneById" method="DELETE" ><i class="ri-delete-bin-fill"></i> Delete</li>
                </ul>
              </a>
            </article>
 {{/each}}
`

export {explorerList}