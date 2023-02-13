const moment = require("moment");



function getTime(username,text){

    return{
        username,
        text,
        time:moment().format("h:mm a")
    }

}
module.exports={getTime}