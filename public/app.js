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
const dropdownTag = document.querySelector('#tag_dropdown');



if(dropdwon){
document.addEventListener('click', (e) => {
    if (!dropdwon.contains(e.target)) {
        dropdwon.classList.remove('active');
    }
});
}

//tagger
if(dropdownTag){
    document.addEventListener('click', (e) => {
        if (!dropdownTag.contains(e.target)) {
            dropdownTag.classList.remove('active');
        }
    });
    const editor = document.querySelector('.tagger_textarea');
    dropdownTag.addEventListener('mousedown', (e) => {
        if (e.target.closest('.book_card_result')) {
            e.preventDefault();
        }
    });


    dropdownTag.addEventListener('click',(e)=>{
        const item = e.target.closest('.book_card_result');
        if(!item) return;

        const result = item.querySelector('.text_search');
        if(!result || !editor) return;
        console.log('result dropTag :' ,result);
        const id  = result.dataset.id;
        const name  = result.textContent.trim();

        console.log({id, name});

        const selection  = window.getSelection();
        if(selection && selection.isCollapsed){
            const node = selection.anchorNode;
            const offset = selection.anchorOffset;
            if(node && node.nodeType === Node.TEXT_NODE){
                const textBeforeCaret = node.textContent.slice(0, offset);
                 const match = textBeforeCaret.match(/@([\p{L}\p{N}_]{3,})$/u);
                 console.log('before:', textBeforeCaret);
                console.log('matche: ',match);
                const start = offset - match[0].length;
                const range = document.createRange();

                range.setStart(node, start);
                range.setEnd(node, offset);

                console.log(range.toString());

                const mention = document.createElement('span');

                mention.className = 'mention';
                mention.dataset.id = id;
                mention.textContent = `@${name}`;
                mention.contentEditable = 'false';

                range.deleteContents();
                range.insertNode(mention);
                dropdownTag.classList.remove('active');

                    //cursor set
                const space = document.createTextNode('\u00A0');
                mention.after(space);
                const caret = document.createRange();
                caret.setStartAfter(space);
                caret.collapse(true);

                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(caret);

                editor.focus();
            }
        }
        

        console.log(cursor);
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
if(bookContainer){
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
}







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
        //czyszczenie poprzednich wynikow
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

function renderDropdownTagResults(results, count){
    const resultsContainer = document.querySelector('#tag_dropdown .search_results');
     const headerCount = document.querySelector('#tag_dropdown .header_search_results');

    console.log('test search ',results);

        headerCount.textContent = count;
        //czyszczenie poprzednich wynikow
        resultsContainer.innerHTML = '';

        results.slice(0, 5).forEach(book => {
            const item = document.createElement('ul');
            item.classList.add('search_result_item');

            item.innerHTML = `
             <li class="book_card_result">
                 <span class ="text_search" data-id="${book.id}"></span>
             </li>
         `;
         item.querySelector('.text_search').textContent= book.title;
         resultsContainer.appendChild(item);
        });
}






async function dataReadTag(value){
    const data =   await gameSearch(value)
      console.log('dane szukaj ',data);
      if(data === undefined){
          console.log('undeigned szukaj');
          return;
      }
      if (!data){
          console.log('Error');
          renderMessage('Error');
          showDropdownTag();
          return;
      }
      if(data.length === 0){
          console.log('0 szukaj');
          //dodac klasa zeby bylo na srodku 
          renderMessage('No data',0);
          showDropdownTag();
          return;
      }
        renderDropdownTagResults(data,data.length);
          showDropdownTag();
  }




function showDropdown(){
   // const rect = formek.getBoundingClientRect();
    dropdwon.classList.add('active');
  //  dropdwon.style.left = `${rect.left + window.scrollX}px`;
//dropdwon.style.width = `${rect.width}px`;
}
function showDropdownTag(){
    dropdownTag.classList.add('active');
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
const editBtn = document.querySelector('#editBtn');


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


//tag area 
function tagArea(){
const tag = document.querySelector('#tag');
const textarea = document.querySelector('.area_wrapper');
const textareaData = document.querySelector('.area_wrapper .tagger_textarea');
let debounceTag;
if (!tag || !textarea) return;

    tag.addEventListener('click', () => {
        textarea.hidden = !textarea.hidden;
      
        if (!textarea.hidden) {
            textareaData.focus();
        }
    });
    textarea.addEventListener('input',(e)=>{
       // const value = e.target.value.trim();
        const value = textarea.textContent.trim();
        console.log('value: ',value);
        const match = value.match(/@([\p{L}\p{N}_]{3,})$/u);

        if (!match) {
            clearTimeout(debounceTag);
            if(controller){
                controller.abort()
             } 
             dropdownTag.classList.remove('active');
            return;
        }
        const searchValue = match[1];
            clearTimeout(debounceTag)
            debounceTag = setTimeout(()=>dataReadTag(searchValue) ,300);
    
     });
  
    document.addEventListener('click', (e) => {
        if (!tag.contains(e.target) && !textarea.contains(e.target)) {
            console.log('Text area');
            textarea.hidden = true;
        }
    });
}

function extractAttributes(element) {
    let attr =[]
   

    for (const match of element.matchAll(/(\w+)="([^"]*)"/g)) {
        attr.push(`${match[1]}, ${match[2]}`);
    }
    return attr;
   
  }


  extractAttributes('<span class="red"></span>')

  extractAttributes('<meta charset="UTF-8" />')



  function calculateTips(mealPrice, customTip) {
      let ddd = mealPrice.slice(1);
      let val = Number(ddd);
    let value =[];
    [15,20,parseFloat(customTip)].forEach(e=>{
        let m = e*val/100
        value.push(`$${m.toFixed(2)}`)
    })
    return value;
  }

  calculateTips("$10.00", "25%")



  function adjustThermostat(currentF, targetC) {
    let data  = (targetC * 1.8) + 32;
    console.log(data);
    if(data === currentF){
        return 'Hold'
    }else if(data > currentF){
        let sub  = data - currentF
        return `Heat: ${sub.toFixed(1)} degrees Fahrenheit`
    }else{
        let re  = currentF - data
        return `Cool: ${re.toFixed(1)} degrees Fahrenheit`
    }

  
  }
  adjustThermostat(72, 18)
  adjustThermostat(70, 25)
  //adjustThermostat(32, 0)

  function sockPairs(pairs, cycles) {
      let initalCount = pairs*2
    for(let i =cycles;i>0;i--){
        if(i %2 === 0){
            initalCount--
            if(initalCount === 0){
                return 0;
            }
        }
        if(i %3 === 0){
            initalCount++
        }
        if(i %5 === 0){
            initalCount--
            if(initalCount === 0){
                return 0;
            }
        }
        if(i %10 === 0){
            initalCount+=2
        }
    }
    return  Math.floor(initalCount/2);
  }

  sockPairs(2, 5)


  function mask(card) {
      let dd = card.slice(-4);
      let first  = card.slice(0,-4)
        
     return first.replace(/\d/g,'*')+dd;
  }
  mask("4012-8888-8888-1881")



  function wiseSpeak(sentence) {
      let words = ["have", "must", "are", "will", "can"]

      //fot
      let punctuation = sentence.slice(-1);
      //without dot 
      let text = sentence.slice(0, -1);
      //split data 
      let sentenceWords = text.split(" ");

     let data =  sentenceWords.findIndex(word => words.includes(word.toLowerCase()))
    console.log(data);

    let wordData  = sentenceWords.slice(0,data+1)
    let wordData2 = sentenceWords.slice(data+1)
    
    let ddd = wordData.map(w => w.toLowerCase())
    let one = wordData2[0] = wordData2[0][0].toUpperCase() + wordData2[0].slice(1);
    return `${one} ${wordData2.slice(1).join(" ")}, ${ddd.join(" ")}${punctuation}`;
  }


  wiseSpeak("You must speak wisely.")



  function validate(email) {
    let check  =  email.split('@');
    if(check.length != 2){
        return false;
    }
    let [local, domain] = email.split("@");

   
    if(!/^[a-zA-Z0-9._-]+$/.test(local)){
        return false;
    } 
    
    if(local.startsWith('.') || local.includes('..') || local.endsWith('.')){
        return false;
    }
    if(!/\.[a-zA-Z]{2,}$/.test(domain)){
        return false;
    } 
    if(domain.startsWith('.') || domain.includes('..')){
        return false;
    }
    return true;
  }


  validate("a@b.cd")


  function favoriteSongs(playlist) {
  
    return playlist.sort((a,b)=> b.plays -a.plays).slice(0, 2).map(e=>e.title);
  }
  favoriteSongs([{"title": "Sync or Swim", "plays": 3}, {"title": "Byte Me", "plays": 1}, {"title": "Earbud Blues", "plays": 2} ])


  function stripTags(html) {

    return html.replace(/<[^>]*>/g,'');
  }
  stripTags('<a href="#">Click here</a>')


  function count(text, pattern) {
      let count = 0
      let index = text.indexOf(pattern);
    while(index !== -1){
       
        
            count++;
            index = text.indexOf(pattern, index + 1);
        
    }
    return count;
  }

  count('101010101010101010101', '101')


  function to12(time) {
    let h = Number(time.slice(0,2))
    let m = time.slice(2)
    let check;
    console.log(h,m);
  
    if(h> 12){
        h=h-12
        check = 'PM'
    }else if(h ===0){
        h =12;
        check = 'AM'
    }else if(h===12){
        
        check = 'PM'
    }else{
        check = 'AM'
    }
    return `${h}:${m} ${check}`;
  }

  to12("0030");



  function dive(map, coordinates) {
    const [row, col] = coordinates;
    const cell = map[row][col];
    if(cell === 'O'){
        
        return map.flat().filter(e => e === "O").length === 1 ?  "Recovered" : "Found";
    }else if(cell === '-'){
        return"Empty";
    }else{
        return"Found";
    }
  }



    dive([[ "-", "X"], [ "-", "X"], [ "-", "O"]], [2, 0])



    function battle(ourTeam, opponent) {
        let words1 = ourTeam.split(' ');
        let words2 = opponent.split(' ');
        let oW =0;
        let oppW = 0;
       
        for(let i=0;i<words1.length;i++){
            let ourScore = 0;
            let opponentScore = 0;
            for (const letter of words1[i]) {
               let  value = letter.toLowerCase().charCodeAt(0) - 96;

               if(letter === letter.toUpperCase()){
                   value *=2;
               }
               ourScore+= value
            }
            for (const letter of words2[i]) {
                let  value = letter.toLowerCase().charCodeAt(0) - 96;

                if(letter === letter.toUpperCase()){
                    value *=2;
                }
                opponentScore+= value
            }
            if(opponentScore > ourScore){
                oppW++;
            }else if(opponentScore< ourScore){
                oW++;
            }

        }

        if(oW>oppW){
            return 'We win'
        }else if(oppW>oW){
            return 'We lose'
        }else{
            return 'Draw'
        }

      }


      battle("hello world", "hello word");



      function hexToDecimal(hex) {
          let value;
          let result=0;
        for (const letter of hex) {
            if(letter >='0' && letter <= '9'){
                value = Number(letter);
            }else{
                value = letter.toUpperCase().charCodeAt(0) - 55;
            }
            result = result * 16 + value;
        }

        return result;
      }   




      hexToDecimal("15")




      function launchFuel(payload) {

        return payload;
      }