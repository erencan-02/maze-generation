
const CUSTOM_EVENTS = [82, 88, 83, 27, 32, 39, 72, 38, 40];

var settingsIsOpen = false;
var helpIsOpen = false;

//Listeners
var fr = document.getElementById("input_frame_rate")
fr.addEventListener('change', (event) => {
  frame_rate = parseInt(fr.value);
});

var spf = document.getElementById("input_steps_per_frame")
spf.addEventListener('change', (event) => {
  steps_per_frame = parseInt(spf.value);
});


function closeAllPages(){
  document.getElementById("settingsPage").style.visibility = "hidden";
  document.getElementById("helpPage").style.visibility = "hidden";
}

function toggleSettings(){
  closeAllPages();

  settingsIsOpen = !settingsIsOpen;
  var option = settingsIsOpen ? "visible" : "hidden";
  document.getElementById("settingsPage").style.opacity = int(settingsIsOpen);
  document.getElementById("settingsPage").style.visibility = option;
}

function toggleHelp(){
  closeAllPages();

  helpIsOpen = !helpIsOpen;
  var option = helpIsOpen ? "visible" : "hidden";
  document.getElementById("helpPage").style.opacity = int(helpIsOpen);
  document.getElementById("helpPage").style.visibility = option;
}

function downloadCanvasImage(){
  var link = document.createElement("a");
  link.setAttribute('download', 'maze.png');
  link.setAttribute('href', document.getElementById("defaultCanvas0").toDataURL("image/png"));//.replace("image/png", "image/octet-stream"));
  document.body.appendChild(link);
  link.click();
  link.remove();
}



function KeyPress(e) {

	var evtobj = window.event ? event : e

	if(!CUSTOM_EVENTS.includes(evtobj.keyCode)){
		return;
	}

	e.preventDefault();

	if ((evtobj.keyCode == 82 && evtobj.ctrlKey) || evtobj.keyCode == 116)  location.reload();

  if (evtobj.keyCode == 88 && evtobj.ctrlKey) resetCanvas();

  if (evtobj.keyCode == 27) toggleSettings();

  if(evtobj.keyCode == 72) toggleHelp();

	if (evtobj.keyCode == 83 && evtobj.ctrlKey) downloadCanvasImage();

  if(evtobj.keyCode == 32) setPause(!is_paused);

  if(evtobj.keyCode == 38){
    setStepsPerFrame(++steps_per_frame);
  }

  if(evtobj.keyCode == 40){
    setStepsPerFrame(--steps_per_frame);
  }

  if(evtobj.keyCode == 39){
    if(maze_gen !== undefined && !maze_gen.is_done && is_paused){
      maze_gen.step();
    }
  }
}

document.onkeydown = KeyPress;
