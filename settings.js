
const CUSTOM_EVENTS = [82, 88, 83, 27, 32, 39, 72, 38, 40];
const NUMS = [...Array(10).keys()].map((n) => n+48); //[48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

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

var cellColor = document.getElementById("colorPicker");
cellColor.addEventListener('change', (event) => {
  line_color = cellColor.value;
});

var showMazeVisited = document.getElementById("input_show_maze");
showMazeVisited.addEventListener('change', (event) => {
  setShowMaze(showMazeVisited.checked);
});

var cs = document.getElementById("input_cell_size");
cs.addEventListener('change', (event) => {
  setCellSize(parseInt(cs.value));
});


function closeAllPages(){
  document.getElementById("settingsPage").style.visibility = "hidden";
  document.getElementById("helpPage").style.visibility = "hidden";
}

function toggleSettings(){
  closeAllPages();

  settingsIsOpen = !settingsIsOpen;
  var option = settingsIsOpen ? "visible" : "hidden";
  document.getElementById("settingsPage").style.opacity = Math.max(...[0, int(settingsIsOpen)-0.05]);
  document.getElementById("settingsPage").style.visibility = option;
}

function toggleHelp(){
  closeAllPages();

  helpIsOpen = !helpIsOpen;
  var option = helpIsOpen ? "visible" : "hidden";
  document.getElementById("helpPage").style.opacity = int(helpIsOpen);
  document.getElementById("helpPage").style.visibility = option;
}

function generateFileName(){
  var file_type = "png";
  var infos = [selected_algorithm, cell_size, line_color, "by_eren"];
  return infos.join("_") + "." + file_type;
}

function downloadCanvasImage(){
  var link = document.createElement("a");
  var file_name = generateFileName();
  link.setAttribute('download', file_name);
  link.setAttribute('href', document.getElementById("defaultCanvas0").toDataURL("image/png"));//.replace("image/png", "image/octet-stream"));
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function initializeValues(){

  //Set input values to values from sketch
  fr.value = frame_rate;
  spf.value = steps_per_frame;
  cellColor.value = line_color;
  cs.value = cell_size;

  //Set selected Option to default Algorithm
  document.getElementById("input_selected_algorithm").value = DEFAULT_ALGORITHM;
}


function KeyPress(e) {

	var evtobj = window.event ? event : e

	if(!CUSTOM_EVENTS.includes(evtobj.keyCode) && !NUMS.includes(evtobj.keyCode)){
		return;
	}


  if(NUMS.includes(evtobj.keyCode)){
    setSelectedAlgorithm(evtobj.keyCode - 49);
  }else {
    e.preventDefault();
  }

	if ((evtobj.keyCode == 82 && evtobj.ctrlKey) || evtobj.keyCode == 116)  location.reload();

  if (evtobj.keyCode == 88 && evtobj.ctrlKey) resetCanvas();

  if (evtobj.keyCode == 27) toggleSettings();


  if(evtobj.keyCode == 72) toggleHelp();

	if (evtobj.keyCode == 83 && evtobj.ctrlKey) downloadCanvasImage();

  if (evtobj.keyCode == 83 && !evtobj.ctrlKey) setShowMaze(!show_maze);

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
