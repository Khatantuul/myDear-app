import app from './app/app.js';



const port = 9000;

app.disable('x-powered-by');

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
})