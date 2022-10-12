const CUSTOM_EVENTS = [82, 88, 65, 90, 32, 83, 27];

var isOpen = false;

function toggleSettings(){
  isOpen = !isOpen;
  var option = isOpen ? "visible" : "hidden";
  document.getElementById("settingsPage").style.opacity = int(isOpen);
  document.getElementById("settingsPage").style.visibility = option;
}


function KeyPress(e) {
	var evtobj = window.event ? event : e

	if(!CUSTOM_EVENTS.includes(evtobj.keyCode)){
		return;
	}

	e.preventDefault();

	if ((evtobj.keyCode == 82 && evtobj.ctrlKey) || evtobj.keyCode == 116)  location.reload();

  if (evtobj.keyCode == 88 && evtobj.ctrlKey) reset();

  if (evtobj.keyCode == 27) toggleSettings();

	if (evtobj.keyCode == 83 && evtobj.ctrlKey){
		var link = document.createElement("a");
  		link.setAttribute('download', 'maze.png');
		link.setAttribute('href', document.getElementById("defaultCanvas0").toDataURL("image/png"));//.replace("image/png", "image/octet-stream"));
		document.body.appendChild(link);
  		link.click();
  		link.remove();
      }
}

document.onkeydown = KeyPress;
