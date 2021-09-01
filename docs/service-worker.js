var user;

self.addEventListener('install', function (event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function (event) {
  console.log('Activated', event);
});


notify = function (title, message) {
  if (user!=null && user.notifications==true && Notification.permission == 'granted')
    self.registration.showNotification(title, {
      body: message,
      vibrate: [100, 50, 100],
      icon:user?user.pic:null
    });
}


self.addEventListener('message', function(event){
    message = event.data;
    console.log("Service worker : Message Recieved",message);
    if(message.type=="DATA"){
      user=message.user;
      console.log("Service worker : User Updated",user);
    }
});

