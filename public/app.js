const xd = document.getElementById('search-input');
const order = document.getElementById('order');
const add = document.getElementById('add');
const arrows = document.querySelectorAll('#order span');
const menu = document.querySelector('.select-options');
const dropdownValue = document.querySelector('.dropdown_filter_select');
const selecValue = document.querySelector('.select-trigger span');
const bookEdit = document.querySelectorAll('.book_edit');
if(xd){
    xd.addEventListener('focus',()=>{
        xd.dataset.placeholder = xd.placeholder;
        xd.placeholder = '';
    });
    
    xd.addEventListener('blur',()=>{
        xd.placeholder = xd.dataset.placeholder;
    });
}



if(order){
    order.addEventListener('click', (e) => {
        menu.classList.toggle('active');
       
        arrows.forEach(a =>{
            a.classList.toggle('active');
        });
    });
    document.addEventListener('click', (e) => {
        if (!order.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active');
    
            arrows.forEach(a => {
                a.classList.remove('active');
            });
        }
    });
}

const dropdwon = document.querySelector('.dropdown_container');



if(dropdwon){
document.addEventListener('click', (e) => {
    if (!dropdwon.contains(e.target)) {
        dropdwon.classList.remove('active');
    }
});
}






const li = document.querySelectorAll('.select-options li');

li.forEach(l=>{
    l.addEventListener('click',()=>{
        console.log('testkk',l.dataset.value);
        selecValue.textContent = l.textContent;
        menu.classList.remove('active');
        sortBooks(l.dataset.value);
        arrows.forEach(a => {
            a.classList.remove('active');
        });
    });
});
function sortBooks(value){
    console.log('sortuje');
  const books =  Array.from(document.querySelectorAll('.book_card'));
    books.sort((a,b) =>{
        if(value === "rating"){
            const bookA = a.dataset.rating;
            const bookB = b.dataset.rating;
                 return    Number(bookB) -  Number(bookA)
        }
        if(value === "recency"){
            const dateA = a.dataset.recency;
            const dateB = b.dataset.recency;
           return new Date(dateB) - new Date(dateA)
        }
        if(value === "title"){
            const titleA = a.dataset.title;
            const titleB = b.dataset.title;
            return titleA.localeCompare(titleB)
        }
    });
    // console.log(books.map(book => ({
    //     title: book.dataset.title,
    //     rating: book.dataset.rating,
    //     date: book.dataset.recency
    // })));
    const columns = document.querySelectorAll('.books_column');
    console.log(columns);
    columns.forEach(column => {
        column.innerHTML = '';
    });
    books.forEach((book, index) =>{
        columns[index % columns.length].appendChild(book);
    });
}

//sortBooks("rating");
//sortBooks("recency");
//sortBooks("title");
//mayube change to a href 

// bookEdit.forEach(book =>{
//     book.addEventListener('click',(e)=>{
//         const bookCard = e.currentTarget.closest('.book_card');
//         window.location.href = `/book/${bookCard.id}`;
      
//     })
// });


const bookContainer = document.querySelector('.books_content');

bookContainer.addEventListener('click',(e)=>{
    console.log('target',e.target);
    const edit = e.target.closest('.book_edit');
    console.log('edittt', edit);
    if(!edit) return;
    const book = edit.closest('.book_card');
    console.log(book);
    const bookid = book.dataset.id;
    console.log('edit btn ',bookid);
    window.location.href = `/book/${bookid}/edit`;
});







const dateInput = document.getElementById("date_read");
if(dateInput){
    dateInput.addEventListener("click", () => {
        dateInput.showPicker();
    });
}

let validT;
const formId = document.getElementById('addForm');
const field = document.querySelector('fieldset');
const addBtn = document.getElementById('addBtn');
if(formId){
    formId.addEventListener('submit',()=>{
        const valid = isValidRadio();
        if(valid){
            addBtn.textContent = 'Adding...'
            addBtn.classList.add('loading');
            formId.classList.add('loading')
         //   field.disabled = true;
          //  field.style.filter = "blur(1px)";
           
        }else{
            return false;
        }
    })
}
function isValidRadio() {
    clearTimeout(validT);

    const rating = document.querySelector('.rating');
   
    const radios = document.querySelectorAll('.rating input[name="rating"]');

    rating.classList.remove('error');
    rating.classList.add('reset');
    void rating.offsetWidth;
    
    rating.classList.remove('reset');
    let valid = formId.checkValidity();

    if (!valid) {
        formId.reportValidity();
    }
    const selected = [...radios].some(r => r.checked);

    if (!selected) {
        rating.classList.add('error');

        validT = setTimeout(() => {
            rating.classList.remove('error');
        }, 3000);

        valid = false;
    }

    return valid;
}


//resize observer 
const book_content = document.querySelector('.books_content');
let columnCount = 0;
let targetColumn = 0;
const observer = new ResizeObserver(([entry])=>{
const {width} = entry.contentRect
    console.log(`W: ${width}px`);
   
    if(width >= 1450){
        columnCount=4;
    }else if(width >=1200){
        columnCount=3;
    }else if(width >= 850){
        columnCount=2;
    }else{
        columnCount=1;
    }
    if(targetColumn !== columnCount){
        targetColumn = columnCount;
        modeLayout(targetColumn)
    }
});

observer.observe(book_content);

function modeLayout(columCount){
    const allBookCard = Array.from(book_content.querySelectorAll('.book_card'));
    book_content.innerHTML = '';

    const columnsElements = [];
    for(let i =0;i<columCount;i++){
        const col = document.createElement('div');
        col.className = 'books_column';
        book_content.appendChild(col);
        columnsElements.push(col); 
    }
    allBookCard.forEach((card, index) => {
             const targetColumnIndex = index % columCount;
             columnsElements[targetColumnIndex].appendChild(card);
           });
}

///search bar 

const formek  = document.querySelector('form');
const formekWidth  = formek.getBoundingClientRect().width;
 const rect = formek.getBoundingClientRect();
 const left = rect.left + window.scrollX;
 console.log('left px: ',left);


const searchInput = document.getElementById('search-input');



let debounce;

let controller;

searchInput.addEventListener('input',(e)=>{
    const value = e.target.value.trim();
    console.log('value: ',value);
    if (value.length < 3) {
        clearTimeout(debounce);
        if(controller){
            controller.abort()
         } 
        dropdwon.classList.remove('active');
        return;
    }
        clearTimeout(debounce)
        debounce = setTimeout(()=>dataRead(value) ,300);

 });


function renderDropdownResults(results, count){
    const resultsContainer = document.querySelector('.search_results');
     const headerCount = document.querySelector('.header_search_results');

    console.log('test search ',results);

        headerCount.textContent = count;
        //czyszcenie poprzednich wynikow
        resultsContainer.innerHTML = '';

        results.slice(0, 5).forEach(book => {
            const item = document.createElement('div');
            item.classList.add('search_result_item');

            item.innerHTML = `
             <div class="book_card_result">
                 <div class="book_card_compact_info">
                    <a href="/book/${book.id}">
                         <span class="img_book"></span>
                    </a>
                 </div>
                 <a class ="text_search" href="/book/${book.id}"></a>
             </div>
         `;
         item.querySelector('.text_search').textContent= book.title;
         resultsContainer.appendChild(item);


        });
}

async function dataRead(value){
  const data =   await gameSearch(value)
    console.log('dane szukaj ',data);
    if(data === undefined){
        console.log('undeigned szukaj');
        return;
    }
    if (!data){
        console.log('Error');
        renderMessage('Error');
        showDropdown();
        return;
    }
    if(data.length === 0){
        console.log('0 szukaj');
        //dodac klasa zeby bylo na srodku 
        renderMessage('No data',0);
        showDropdown();
        return;
    }
        renderDropdownResults(data,data.length);
        showDropdown();
}
function showDropdown(){
   // const rect = formek.getBoundingClientRect();
    dropdwon.classList.add('active');
  //  dropdwon.style.left = `${rect.left + window.scrollX}px`;
//dropdwon.style.width = `${rect.width}px`;
}
function renderMessage(text,count = ''){
    const resultsContainer = document.querySelector('.search_results');
    const headerCount = document.querySelector('.header_search_results');

    headerCount.textContent = count;

    resultsContainer.innerHTML = '';

    const message = document.createElement('div');
    message.classList.add('search_result_item');
    message.textContent = text;
    resultsContainer.appendChild(message);

}
 async function gameSearch(value){
     if(controller){
        controller.abort()
     } 
     controller = new AbortController();
    try{
       const res = await fetch(`/api/search?value=${encodeURIComponent(value)}`,{
           signal: controller.signal
       });
       console.log('rest',res);
       if (!res.ok) {
           throw new Error(`Server returned ${res.status}`);
       }
     
       const data = await res.json();
     
       return data;   
       
       }catch(err){
        if (err.name === 'AbortError') {
            console.log('Request was cancelled');
            return undefined
          } else {
            console.log('Request failed:', err);
          }
        return null;
    }
 }


 //update 


 // -> books_column
const editBtn = document.querySelector('$editBtn');


if(editBtn){
    editBtn.addEventListener('submit',(e)=>{
        const bookID = document.querySelector('#editForm').getAttribute('data-id');
        e.preventDefault();
        editFormdb(bookID)
    })
}



async function editFormdb(id){
    try{
        const res = await fetch(`/edit/${id}`,{
            method: 'PATCH',
            body: JSON.stringify()
        });
        console.log('rest',res);
             
        }catch(err){
            console.log(err);
     }
}
