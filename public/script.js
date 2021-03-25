const socket=io('/')
const peers={};
const mypeer=new Peer(undefined,{
    host:'https://superultraomeganodejs.herokuapp.com',
    port:'9901'
})

mypeer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id)

})
socket.on('user-disconnect',userId=>{
    console.log(userId)
    if(peers[userId]) peers[userId].close()
})
const grid=document.getElementById('grid')
const myvideo=document.createElement('video')
myvideo.muted=true;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{

    adduservideo(myvideo,stream)
    mypeer.on('call',call=>{
        call.answer(stream)
        const video=document.createElement('video')
        call.on('stream',userstreams =>{
            adduservideo(video,userstreams)
        })
    })
    socket.on('user-connected',userId=>{
        

        setTimeout(connecttouser,1000,userId,stream)

    })
    
    
})











function adduservideo(video,stream){
    video.srcObject=stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    grid.append(video)

}

function connecttouser(userId,stream){
    const call=mypeer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',userstream=>{
        adduservideo(video,userstream)
        
    })
    call.on('close',()=>{
        video.remove()
    })
    peers[userId]=call

}