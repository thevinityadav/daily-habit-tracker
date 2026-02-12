const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const habitList = document.getElementById("habitList");
const noHabit = document.getElementById("noHabit");

// Modal Elements
const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const addBtn = document.getElementById("addBtn");
const habitNameInput = document.getElementById("habitName");
const habitDescInput = document.getElementById("habitDesc");

// Load demo habits if localStorage empty
let habits = JSON.parse(localStorage.getItem("habits") || "[]");
if(habits.length===0){
  habits = [
    { name: "Drink Water", desc: "8 glasses a day", week:[true,false,true,false,true,false,true] },
    { name: "Morning Walk", desc: "30 minutes daily", week:[false,true,true,false,true,false,false] },
    { name: "Read Book", desc: "At least 20 min", week:[true,true,false,true,false,true,false] }
  ];
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Open/Close modal
openModalBtn.onclick = () => modal.style.display = "flex";
closeModalBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if(e.target === modal) modal.style.display = "none"; };

// Add Habit
addBtn.onclick = () => {
  const name = habitNameInput.value.trim();
  const desc = habitDescInput.value.trim();
  if(!name) return;
  habits.push({ name, desc, week: Array(7).fill(false) });
  habitNameInput.value = "";
  habitDescInput.value = "";
  modal.style.display = "none";
  saveAndRender();
};

// Toggle day
function toggleDay(hIndex, dIndex) {
  habits[hIndex].week[dIndex] = !habits[hIndex].week[dIndex];
  saveAndRender();
}

// Delete habit
function deleteHabit(index) {
  habits.splice(index,1);
  saveAndRender();
}

// Save and render
function saveAndRender(){
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}

// Calculate progress
function getProgress(week){
  const completed = week.filter(Boolean).length;
  return Math.round((completed/7)*100);
}

// Highlight today
const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay()-1; // Mon=0

// Render
function renderHabits(){
  habitList.innerHTML = "";
  if(habits.length===0){habitList.appendChild(noHabit); return;}
  habits.forEach((habit,hIndex)=>{
    const card = document.createElement("div"); card.className="habit-card";

    const header = document.createElement("div"); header.className="habit-header";
    const h3 = document.createElement("h3"); h3.textContent=habit.name;
    const delBtn = document.createElement("button"); delBtn.className="delete"; delBtn.innerHTML="&times;";
    delBtn.onclick = ()=>deleteHabit(hIndex);
    header.appendChild(h3); header.appendChild(delBtn); card.appendChild(header);

    if(habit.desc){const desc = document.createElement("p"); desc.className="desc"; desc.textContent=habit.desc; card.appendChild(desc);}

    const weekDiv = document.createElement("div"); weekDiv.className="week";
    days.forEach((day,dIndex)=>{
      const dayDiv = document.createElement("div"); dayDiv.className="day"; dayDiv.textContent=day;
      if(habit.week[dIndex]) dayDiv.classList.add("done");
      if(dIndex===todayIndex) dayDiv.classList.add("today");
      dayDiv.onclick = ()=>toggleDay(hIndex,dIndex);
      weekDiv.appendChild(dayDiv);
    });
    card.appendChild(weekDiv);

    const progressDiv = document.createElement("div"); progressDiv.className="progress";
    const progressVal = getProgress(habit.week);
    const progressText = document.createTextNode(`Progress: ${progressVal}%`);
    const progressBar = document.createElement("div"); progressBar.className="progress-bar";
    const fill = document.createElement("div"); fill.className="fill"; fill.style.width=`${progressVal}%`;

    if(progressVal<=30) fill.style.background="#ff6b00";
    else if(progressVal<=70) fill.style.background="#ffc107";
    else fill.style.background="#28a745";

    progressBar.appendChild(fill); progressDiv.appendChild(progressText); progressDiv.appendChild(progressBar);
    card.appendChild(progressDiv);

    habitList.appendChild(card);
  });
}

renderHabits();
