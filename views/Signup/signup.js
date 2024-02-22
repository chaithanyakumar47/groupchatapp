

async function userSignup(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;

    const userData = {
        username,
        email,
        phone,
        password
    };
    // console.log(userData);
    
    try {
        const data = await axios.post('http://localhost:3000/user/signup',userData);

        // window.location.href = '../Login/login.html'
        


    } catch(err) {
        console.log(err);
        const parent = document.getElementById('error');
        const child = `${err.message}`;
        parent.innerHTML = parent.innerHTML + child;

    }

}


