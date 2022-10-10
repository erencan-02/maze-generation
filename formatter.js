
function checkDOMChange()
{
    // check for any new element being inserted here,
    // or a particular node being modified
    let x = document.getElementById("defaultCanvas0");

    if(x != null){
      x.style.width = "90%";
      x.style.height = "90%";
    }
    else{
      // call the function again after 100 milliseconds
      setTimeout(checkDOMChange, 100);
    }
}

checkDOMChange();
