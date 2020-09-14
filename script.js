var app = new function() {
    this.el = document.getElementById('item-list');
    
    this.tasks = [];
  
    this.FetchAll = function(todos) {
        this.el.innerHTML = '';
        //var data = '';
      if (this.tasks.length > 0) {
        for (i = 0; i < todos.length; i++) {
         addItem(this.el, todos[i]);
        }
      }
      console.log(todos);
      console.log(this);
      //return this.el.innerHTML = data;
    };

    
  
    this.Add = function () {
      el = document.getElementById('add-todo');
      // Get the value
      var text = el.value;
  
      if (text) {
        // Add the new value
        let newTask={id: this.tasks.length, content:text.trim(),favorite: false};
        this.tasks.push(newTask);
        // Reset input value
        el.value = '';
        // Dislay the new list
        //this.FetchAll();
        pagination.render();
        pagination.gotoLastPage();
      }
    };
  
    this.Edit = function (item_id) {
      var el = document.getElementById('edit-todo');
      // Display value in the field
      el.value = this.tasks[item_id].content;
      // Display fields
      document.getElementById('edit-box').style.display = 'block';
      self = this;
  
      document.getElementById('save-edit').onsubmit = function() {
        // Get value
        var text = el.value;
  
        if (text) {
          // Edit value
          self.tasks[item_id].content=text.trim();
          // Display the new list
          //self.FetchAll();
          // Hide fields
          pagination.render();
          pagination.gotoCurrentPage();
          CloseInput();
        }
      }
    };
  
    this.Delete = function (item_id) {
      // Delete the current row
      this.tasks.splice(item_id, 1);
      // Display the new list
      pagination.render();
      pagination.gotoCurrentPage();
    };

    this.getTodosCount=function () {
        return this.tasks.length;
    }
    this.getPagedData=function (pageNo, pageLength) {
        let startOfRecord = (pageNo - 1) * pageLength;
        let endOfRecord = startOfRecord + pageLength;

        let pagedData = this.tasks.slice(startOfRecord, endOfRecord);
        return pagedData;
    }
    
    
    
}
  
app.FetchAll(app.getPagedData(1, 10));

function CloseInput() {
    document.getElementById('edit-box').style.display = 'none';
}

function $create(tag, options) {
    var element = document.createElement(tag);
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        element[key] = options[key];
      }
    }
    return element;
}

function addItem(itemList, item) {
    

    // create the <li> tag and specify the class attributes
    var li = $create('li', {
      id: 'item-' + item.id,
      className: 'item'
    });

    // set the data attribute ex. <li data-item_id="G5vYZ4kxGQVCR" data-favorite="true">
    li.dataset.item_id = item.id;
    li.dataset.favorite = item.favorite;

    // favorite link
    var favLink = $create('p', {
        className: 'fav-link'
    });

    favLink.onclick = function() {
        changeFavoriteItem(item);
    };

    favLink.appendChild($create('i', {
    id: 'fav-icon-' + item.id,
    className: item.favorite ? 'fa fa-heart' : 'fa fa-heart-o'
    }));

    li.appendChild(favLink);
    
    // content
    var content = $create('p', {
      className: 'item-content'
    });
    content.innerHTML =  item.content;
    li.appendChild(content);

    // edit button
    var edit = $create('button', {
        className: 'btn btn-warning'
    });
    
    edit.onclick = function() {
        app.Edit( item.id );
      };
    edit.innerHTML = 'Edit';
    li.appendChild(edit);

    // delete button
    var deleteSection = $create('button', {
        className: 'btn btn-danger'
    });
    
    deleteSection.onclick = function() {
        app.Delete( item.id );
    }; 
    deleteSection.innerHTML = "Delete";
    li.appendChild(deleteSection);
    itemList.appendChild(li);
    console.log(itemList);
    console.log(item);

}
function changeFavoriteItem(item) {
    // check whether this item has been visited or not
    var li = document.querySelector('#item-' + item.id);
    var favIcon = document.querySelector('#fav-icon-' + item.id);
    var favorite = !(li.dataset.favorite === 'true');

    item.favorite=favorite;
    li.dataset.favorite = favorite;
    favIcon.className = favorite ? 'fa fa-heart' : 'fa fa-heart-o';
      
}

var elPag = document.getElementById("pagination");

var pagination = new function(){
    this.currentPage =1;
    this.pageLength =10;
    this.totalRecords =0;
    this.render=function () {
        this.totalRecords = app.getTodosCount();
        let pages = Math.ceil(this.totalRecords / this.pageLength);
        this.pages = pages;

        let buttons = '';
        buttons += `
            <button class="pagination-btn prev"
                onclick="pagination.prev(this)"
                type="button">
                prev
            </button>
        `;

        for(let i = 1; i <= pages; i++) {
            buttons += this.getButton(i);
        }

        buttons += `
        <button class="pagination-btn next"
            onclick="pagination.next(this)"
            type="button">
            next
        </button>
    `;

    elPag.innerHTML = buttons;

    },

    this.getPageLength=function(){
        return this.pageLength;
    }

    this.getButton=function (text) {
        let classNames = 'pagination-btn';
        if (this.currentPage == text) {
            classNames += ' current-page';
        }
        let html = `
            <button id="btn-${text}"
                class="${classNames}"
                type="button"
                onclick="pagination.gotoPage(this, ${text})"
            >${text}
            </button>
        `;

        return html;
    },
    this.next=function (btn) {
        if (this.currentPage > this.pages - 1) return;
        this.currentPage = this.currentPage + 1;
        let currentPageBtn = document.getElementById(`btn-${this.currentPage}`);
        this.gotoPage(currentPageBtn, this.currentPage);

    },
    this.prev=function (btn) {
        if (this.currentPage == 1) return;
        this.currentPage = this.currentPage - 1;
        let currentPageBtn = document.getElementById(`btn-${this.currentPage}`);
        this.gotoPage(currentPageBtn, this.currentPage);
        
    },

    this.gotoPage=function (btn, pageNo) {
        this.currentPage = pageNo;
        let paginationButtons = document.querySelectorAll(".pagination-btn");
        for(let i = 0; i < paginationButtons.length; i++) {
            paginationButtons[i].classList.remove("current-page");
        }
        btn.classList.add("current-page");

        let pagedData = app.getPagedData(pageNo, this.pageLength);

        app.FetchAll(pagedData);
    },
    this.gotoLastPage=function () {
        this.currentPage =  this.pages;
        let currentPageBtn = document.getElementById(`btn-${this.currentPage}`);
        this.gotoPage(currentPageBtn, this.currentPage);
    }
    this.gotoCurrentPage=function () {
        let currentPageBtn = document.getElementById(`btn-${this.currentPage}`);
        this.gotoPage(currentPageBtn, this.currentPage);
    }

}
pagination.render();



