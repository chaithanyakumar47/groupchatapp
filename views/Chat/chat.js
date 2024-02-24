async function sendMessage(event) {
    event.preventDefault();
    const message = event.target.message.value;
    const messageData = {
        message
    }

    try {
        const token = localStorage.getItem('token')
        const data = await axios.post('http://localhost:3000/user/chat',messageData, { headers: { 'Authorization': token }});
        console.log(data)
    } catch (err) {
        console.log(err)
    }

}

function getChats(chatData) {
    const parent = document.getElementById('messages');
    parent.innerHTML = ''
    for(let i=0; i<chatData.length; i++) {
        const child = `<li>${chatData[i].user.username} : ${chatData[i].message}</li>`
        parent.innerHTML+=child;
    }
}



window.addEventListener("DOMContentLoaded", async () => {
    try{
        const token = localStorage.getItem('token');
        const data = await axios.get(`http://localhost:3000/user/getChats`, { headers: { 'Authorization': token}})
        getChats(data.data)
        console.log(data)
    } catch (err) {
        console.log(err)
    }
});