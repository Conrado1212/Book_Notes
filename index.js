import express from "express";
import axios from "axios"
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  db.connect();



const API_URL = "https://openlibrary.org/search.json?"



app.use(bodyParser.urlencoded({ extended: true }));


// app.use((req,res, next)=>{
//   console.log('Request Headers:', req.headers);
//   const resSend = res.send;
//   res.send = function(body){
//       console.log('Res Body:', body);
//       resSend.call(this, body);
//   }
//   next();
// });

app.use(express.json());



app.use(express.static("public"));



app.get("/", async (req, res) => {
    try{
      const result  = await db.query(
        "SELECT  * FROM books order by rating desc limit 20");
        const counter = await db.query("select count(*) from books")
        console.log('db', result.rows);
        console.log('db1', counter.rows[0].count);
        res.render("index.ejs",{
          result: result,
          count: counter.rows[0].count
        });
    }catch(e){
     console.log(e);
    }
     
   });


   
app.get("/book/:id/edit", async (req, res) => {

  const paramid = req.params.id

  if(!/^\d+$/.test(paramid)){
    return res.status(404).send("Invalid id")
  }

  const id = Number(paramid);

  if(id > 2147483647){
    return res.status(404).send("Invalid id")
  }
try{
  const result = await db.query(
    "SELECT * FROM books WHERE id = $1",
    [id]
);

if (result.rows.length === 0) {
  return res.status(404).send("Book not found");
}

res.render("edit.ejs",{
  book: result.rows[0]
});
}catch(e){
  console.log(e);
  res.status(500).send( `API error: something gone wrong, contact your administrator`);
}
  
});
//add
app.get("/add", (req, res) => {
  res.render("add.ejs");
});



   app.post("/add", async (req, res) => {
    const { title, author, rating,review,date_read } = req.body;
     
        if([title,author,review].some(i=> !i?.trim())){
          return  res.status(400).json({
            message: "Title, author and review are required."
          });
        }

        const ratingNumber = Number(rating);
        if (!rating?.trim() || ratingNumber < 1 || ratingNumber > 5 || !Number.isInteger(ratingNumber)) {
          return  res.status(400).json({
            message: "Rating must be between 1-5"
          });
      }
      
    
      if(!date_read?.trim()){
        return  res.status(400).json({
          message: "Date is empty"
        });
      }
        const date = new Date();

        const readDate = new Date(date_read);

        const isvalidDate  = readDate.getTime();

        if(Number.isNaN(isvalidDate)){
          return res.status(400).json({
            message: "Invalid Date"
        });
        }
        date.setHours(0,0,0,0)

        readDate.setHours(0,0,0,0)

        if(readDate > date){
          return res.status(400).json({
            message: "Date cannot be in the future"
        });
        
      }
    try{
      let  result = await axios.get(API_URL,{
        params:{
          title: title,
        author: author,
        sort: "new",
        fields: "title,author_name,cover_i,first_publish_year,edition_key",
        limit: 100
        }
      });
      if (result.data.docs.length === 0) {
        result = await axios.get(API_URL, {
            params: {
                title: title,
                fields: "title,author_name,cover_i,first_publish_year,edition_key",
                limit: 100
            }
        });
    }
    const coverId = result.data.docs.find(b => b.cover_i)?.cover_i;
    //  console.log('cover',coverId);
      await db.query(
        `Insert into books (title, author, rating, review, date_read, isbn) values($1,$2,$3,$4,$5,$6)`,
        [title, author, rating, review, date_read, coverId]
    );
    res.redirect("/");
    console.log(req.body);
    }catch(e){
      console.log(e);
    }
    
   
});
//edit

//search 
app.get("/api/search", async (req, res) => {
  const {value } = req.query;
  console.log('search value:',value);
  try{
    const result = await db.query(
      "SELECT id, title, date_read FROM books WHERE lower(title) LIKE '%' || $1 || '%';",
      [value.toLowerCase()]
  );
  console.log('data search', result.rows);
    res.json(result.rows);      
  }catch(e){   
    console.error(e);
    res.status(500).json({error: `API error ${e}`});
  }
});


app.patch("/edit/:id", async (req,res)=>{

  const id = req.params.id;
    const { title, author, rating,review,date_read } = req.body;

    if([title,author,review,date_read].some(i=> !i?.trim())){
      return  res.status(400).json({
        message: "Title, author and review are required."
      });
    }

    const ratingNumber = Number(rating);
        if (!rating?.trim() || ratingNumber < 1 || ratingNumber > 5 || !Number.isInteger(ratingNumber)) {
          return  res.status(400).json({
            message: "Rating must be between 1-5"
          });
      }


      if(!date_read?.trim()){
        return  res.status(400).json({
          message: "Date is empty"
        });
      }

      const date = new Date();

        const readDate = new Date(date_read);

        const isvalidDate  = readDate.getTime();

        if(Number.isNaN(isvalidDate)){
          return res.status(400).json({
            message: "Invalid Date"
        });
        }
        date.setHours(0,0,0,0)

        readDate.setHours(0,0,0,0)

        if(readDate > date){
          return res.status(400).json({
            message: "Date cannot be in the future"
        });
        
        }

try{
  await db.query(
    `UPDATE books
     SET title = $1,
         author = $2
     WHERE id = $3`,
    [title, author, id]
);
res.json({ success: true });
//res.redirect('/');
}catch(e){
  console.log(e);
}
});


//del
app.delete("/delete/:id",(req,res)=>{
  const id = req.params.id;
})
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  