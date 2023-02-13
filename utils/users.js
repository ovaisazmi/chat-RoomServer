let users=[];


function userjoin(id,username,room){
    users.push({id,username,room});
    return {id,username,room};
}

function getRoomUsers(room){
    return users.filter(elem=>elem.room==room)
}

function getUser(id){
    return users.find(elem=>{
        return elem.id==id
    })
}

function deleteUser(id){
    users=users.filter(elem=>{
        if(elem.id!=id){
            return elem
        }
    })
}


module.exports={userjoin,getRoomUsers,getUser,deleteUser}