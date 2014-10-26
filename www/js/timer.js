/**
 * Created by Brodie Gilmour on 26/10/2014.
 */
var count = 300;

var counter = setInterval(timer, 10); //10 will  run it every 100th of a second

function timer()
{
    if (count <= 0)
    {
        clearInterval(counter);
        return;
    }
    count--;
    document.getElementById("timer").innerHTML=count /100+ " secs";
}