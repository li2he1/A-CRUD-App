var app = new function() {
    this.el = document.getElementById('item-list');
  
    this.tasks = [];
  
    this.FetchAll = function() {
        this.el.innerHTML = '';
        //var data = '';
      if (this.tasks.length > 0) {
        for (i = 0; i < this.tasks.length; i++) {
        //   data += '<tr>';
        //   data += '<td>'+(i+1)+". " + this.tasks[i].content + '</td>';
        //   data += '<td><button onclick="app.Edit(' + i + ')"  class="btn btn-warning">Edit</button></td>';
        //   data += '<td><button onclick="app.Delete(' + i + ')"  class="btn btn-danger">Delete</button></td>';
        //   data += '</tr>';
         addItem(this.el, this.tasks[i],i);

        }
      }
      console.log(this.tasks);
      //return this.el.innerHTML = data;
    };
  
    this.Add = function () {
      el = document.getElementById('add-todo');
      // Get the value
      var text = el.value;
  
      if (text) {
        // Add the new value
        let newTask={content:text.trim(),favorite: false};
        this.tasks.push(newTask);
        // Reset input value
        el.value = '';
        // Dislay the new list
        this.FetchAll();
      }
    };
  
    this.Edit = function (item) {
      var el = document.getElementById('edit-todo');
      // Display value in the field
      el.value = this.tasks[item].content;
      // Display fields
      document.getElementById('edit-box').style.display = 'block';
      self = this;
  
      document.getElementById('save-edit').onsubmit = function() {
        // Get value
        var text = el.value;
  
        if (text) {
          // Edit value
          self.tasks[item].content=text.trim();
          // Display the new list
          self.FetchAll();
          // Hide fields
          CloseInput();
        }
      }
    };
  
    this.Delete = function (item) {
      // Delete the current row
      this.tasks.splice(item, 1);
      // Display the new list
      this.FetchAll();
    };
    
    
    
    
}
  
app.FetchAll();

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

function addItem(itemList, item,i) {
    

    // create the <li> tag and specify the class attributes
    var li = $create('li', {
      id: 'item-' + i,
      className: 'item'
    });

    // set the data attribute ex. <li data-item_id="G5vYZ4kxGQVCR" data-favorite="true">
    li.dataset.item_id = i;
    li.dataset.favorite = item.favorite;

    // favorite link
    var favLink = $create('p', {
        className: 'fav-link'
    });

    favLink.onclick = function() {
        changeFavoriteItem(item,i);
    };

    favLink.appendChild($create('i', {
    id: 'fav-icon-' + i,
    className: item.favorite ? 'fa fa-heart' : 'fa fa-heart-o'
    }));

    li.appendChild(favLink);
    
    // content
    var content = $create('p', {
      className: 'item-content'
    });
    content.innerHTML =  (i+1)+". "+item.content;
    li.appendChild(content);

    // edit button
    var edit = $create('button', {
        className: 'btn btn-warning'
    });
    
    edit.onclick = function() {
        app.Edit( i );
      };
    edit.innerHTML = 'Edit';
    li.appendChild(edit);

    // delete button
    var deleteSection = $create('button', {
        className: 'btn btn-danger'
    });
    
    deleteSection.onclick = function() {
        app.Delete( i );
    }; 
    deleteSection.innerHTML = "Delete";
    li.appendChild(deleteSection);
    itemList.appendChild(li);
    console.log(itemList);
    console.log(item);

}
function changeFavoriteItem(item,item_id) {
    // check whether this item has been visited or not
    var li = document.querySelector('#item-' + item_id);
    var favIcon = document.querySelector('#fav-icon-' + item_id);
    var favorite = !(li.dataset.favorite === 'true');

    item.favorite=favorite;
    li.dataset.favorite = favorite;
    favIcon.className = favorite ? 'fa fa-heart' : 'fa fa-heart-o';
      
}