
const form = document.querySelector('form');

form.addEventListener('submit',async (e)=>{
    e.preventDefault();

    // get the values
    const email = form.email.value;
    const password=form.email.value;

    console.log(email,password);

    try{
        const res = fetch('/signup',{
            method:'POST',
            body:JSON.stringify({email,password}),
            headers:{'Content-Type':'application/json'}
        })
        console.log("Done");
    }catch(err){
        console.log(err);
    }

})