$(document).ready(function(){
    i = 0;
    function printmsg(){
        console.log("TODEL test js "+ i);
        i ++;
    }
    setInterval(printmsg,1000);
});