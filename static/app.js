var Ractive  = require("ractive");
window.Papa = require('papaparse');
window.FileSaver = require('file-saver');
//import Ractive from 'ractive';

//Ractive.defaults.isolated=true;
Ractive.prototype.unset = function(keypath){
    var lastDot = keypath.lastIndexOf( '.' ),
        parent = keypath.substr( 0, lastDot ),
        property = keypath.substring( lastDot + 1 );

    this.set(keypath);
    delete this.get(parent)[property];
    return this.update(keypath);
}

console.log('ke')
window.alertify = require('alertifyjs')
require('ion-sound')
alertify.defaults = {
    notifier:{
        // auto-dismiss wait time (in seconds)  
        delay:5,
        // default position
        position:'top-right',
        // adds a close button to notifier messages
        closeButton: false
    }
};

alertify.notify('Šifra je vec očitana', 'warning', 3);

ion.sound({
    sounds: [ { name: "vecpostoji" }, { name: "no" } ],
    volume: 0.5,
    path: "/",
    preload: true
});

Ractive.components.Root                    =  require('./Root.html');

var ractive = new Ractive.components.Root({
    el: 'body',
    append: false,
    data:function() {
        return {
            isMobile: isMobile.any
            , scancode:''
            , scanhistoryarr:[]
            , scanhistoryfromserver:[]
            , filename:''
            , cards:{} // : { '0800':{title:"0800", arr:[...]} }
            , keyz:[]
        }
    }
});

if (document.getElementById("scancode"))  document.getElementById("scancode").autofocus = true; 
/*
setInterval(function(){
    if (document.getElementById("scancode")) document.getElementById("scancode").focus(); 
},3000)
*/

window.sifarnik = {};
window.scanhistorykv = {}; 
window.scanhistory = []; 

//  S O C K E T S 
window.socket = io.connect();
socket.on('sifarnik', function (data) {
    sifarnik = data;
    console.log('sifarnik');
    //socket.emit('my other event', { my: 'data' });
});

socket.on('scan', function (scan) {
    console.log('scan', scan);
    ractive.set('scanhistoryfromserver', scan);
    ractive.set('scanhistoryarr', scan);
    for (var i=0; i<scan.length;i++)
        scanhistorykv[ scan[i][3] ] = true
});

socket.on('addscan', function (addscan) {
    console.log('addscan', addscan);
    ractive.splice('scanhistoryfromserver', 0,0,addscan);
});

socket.on('save2server', function () {
    console.log('save2server');
    ractive.fire('save2disk');
});

socket.on('clearscan', function () {
    console.log('clearscan from sock');
    ractive.set('scanhistoryfromserver', []);       
    ractive.set('scanhistoryarr', []);   
    scanhistorykv = {}          
});

/*
document.onkeypress = function (e) {
    console.log('onkeypress',e)
    if (e.key!='Unidentified') ractive.push('keyz', e.key)
}
document.addEventListener("paste", function(e){
    console.log('paste',e)
    ractive.push('keyz', 'PASTE')
});
*/