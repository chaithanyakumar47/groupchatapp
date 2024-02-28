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
  try {
    
    const savedChats = JSON.parse(localStorage.getItem('chats')) || [];

    
    const chatId = savedChats.length > 0 ? savedChats[savedChats.length - 1].id : 0;

    
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:3000/user/getChats/${chatId}`, { headers: { 'Authorization': token } });
    const data = response.data;

    
    const recentChats = data.slice(0, Math.min(data.length, 10)); 

    
    const stringifiedData = JSON.stringify(recentChats);
    localStorage.setItem("chats", stringifiedData);

    
    getChats(recentChats);

    
    setInterval(async () => {
      try {
        
        const latestChats = JSON.parse(localStorage.getItem('chats')) || [];
        if(latestChats.length <= 10) {

          const latestChatId = latestChats.length > 0 ? latestChats[latestChats.length - 1].id : 0;
  
          
          const newResponse = await axios.get(`http://localhost:3000/user/getChats/${latestChatId}`, { headers: { 'Authorization': token } });
          const newChats = newResponse.data;
  
          
          const limitedNewChats = newChats.slice(0, Math.min(newChats.length, 10 - latestChats.length)); 
          
          
          const updatedChats = latestChats.concat(newChats);
          const updatedStringifiedData = JSON.stringify(updatedChats);
          localStorage.setItem("chats", updatedStringifiedData);
  
          
          
          getChats(updatedChats);
        }
        else{

          const clearing = JSON.parse(localStorage.getItem('chats'))
          const cleared = clearing.slice(10);
          const stringifiedcleared = JSON.stringify(cleared)
          localStorage.setItem("chats", stringifiedcleared)
        }
      } catch (error) {
        console.error('Error fetching new chats:', error);
      }
    }, 5000); 
  } catch (err) {
    console.error('Error in chat handling:', err);
  }
});
