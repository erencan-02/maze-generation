var isOpen = false;


function toggleSettings(){
  isOpen = !isOpen;
  var option = isOpen ? "visible" : "hidden";
  document.getElementById("settingsPage").style.opacity = int(isOpen);
  document.getElementById("settingsPage").style.visibility = option;
}
