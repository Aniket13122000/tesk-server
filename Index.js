const express =require('express');
const PORT =8080;
const app = express();
const bodyParser =require('body-parser')
const cors =require('cors')
const jwt = require("jsonwebtoken");
const secret='test_secret'
const {db,auth}=require('./firebase');
const { async } = require('@firebase/util');
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.get('/',(req,res)=>{
    res.send('server is running');
})

app.post('/login',(req,res)=>{
const{email,password}=req.body;
db.collection('users').doc(email).get().then((resp)=>{
    if(resp.data()=='undefined'||resp.data()==''||resp.data()==null){
        return res.send({message:'Invalid Credential'});

    }else{
        console.log(resp.data());
        if(password==resp.data().password){
            token = jwt.sign(
                { email: resp.data().email },
                secret,
                {
                  expiresIn: "1h",
                }
              );
              return res.send(token);
        }else{
            return res.send({message:'Invalid Credential'});
    
        }
    }
  
}).catch(err=>{
    console.log(err);
})
})
app.post('/register',(req,res)=>{
    const{email,password}=req.body;
    db.collection('users').doc(email).set({
        email:email,
        password:password
    }).then((response)=>{
        token = jwt.sign(
            { email:email },
            secret,
            {
              expiresIn: "1h",
            }
          );
          return res.send(token);
            }).catch((err)=>{
        res.send(err)
    })
    })
    app.get('/getTask',(req,res)=>{
        var data = [];
  console.log("run");
  db.collection("task")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((element) => {
        data.push(element.data());

        // return data;
      });
    })
    .then(() => {
      console.log(data);
      return res.send(data);
    });
    })
app.post('/addtask',(req,res)=>{
    console.log(req.body);
    db.collection('task').doc().set(req.body).then((resp)=>{
        console.log(resp);
        res.send('ok')
    }).catch((err)=>{
        console.log(err);
    })
})
app.post('/complete',async(req,res)=>{
    const collectionRef = db.collection('task');
console.log(req.body.title);
    try {
      const querySnapshot = await collectionRef.where('title', '==', req.body.title).get();
  
      if (querySnapshot.docs.length > 0) {
        const docRef = querySnapshot.docs[0].ref;
  
        // Update the 'yourFieldToUpdate' field with the new value
        await docRef.update({
          status: 'Completed', // replace with the new value
        });
  
        console.log('Document updated successfully!');
      } else {
        console.log('Document with title "new" not found.');
      }
    } catch (error) {
      console.error('Error updating document: ', error);
    }})

    
app.post('/delete',async(req,res)=>{
    const titleToDelete = req.body.title;

    try {
      // Find the document with the specified title
      const querySnapshot = await db.collection('task').where('title', '==', titleToDelete).get();
  
      if (querySnapshot.docs.length > 0) {
        // Delete the document
        await querySnapshot.docs[0].ref.delete();
        res.status(200).json({ message: 'Document deleted successfully.' });
      } else {
        res.status(404).json({ message: 'Document not found.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
})


app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`))