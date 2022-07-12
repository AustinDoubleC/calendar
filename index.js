const calendarDOM = document.getElementById("calendar")
const btnNext = document.getElementById("next")
const btnBack = document.getElementById("back")
const modal = document.getElementById("modal-background")
const btnAdd = document.getElementById("btn-add")
const btnUpdate = document.getElementById("btn-update")
const btnDelete = document.getElementById("btn-delete")
const btnCancel = document.getElementById("btn-cancel")
const eventInput = document.getElementById("event-input")
const eventTitle =document.getElementById("event-title")

let currentMonth = 0
let events = localStorage.getItem(`events`)?JSON.parse(localStorage.getItem(`events`)):[]
let eventDate = ""
let eventLength = 30

btnNext.addEventListener("click",()=>{
    currentMonth++
    loadPage()
})
btnBack.addEventListener("click",()=>{
    currentMonth--
    loadPage()
})

btnCancel.addEventListener("click",()=>{
    closeModal()
})

btnAdd.addEventListener("click",()=>addEvent())

btnDelete.addEventListener("click",()=>deleteEvent())
btnUpdate.addEventListener("click",()=>updateEvent())

const loadPage=()=>{
    const today = new Date()

    if(currentMonth!==0){
        today.setMonth(new Date().getMonth()+currentMonth)
    }

    const day = today.getDate()
    const month = today.getMonth()
    const year = today.getFullYear()
    
    const daysInMonth = new Date(year, month+1, 0).getDate() //last day of month

    const firstDay = new Date(year,month,1).getDay() //
    document.getElementById("month-title").innerText = `${today.toLocaleDateString("en-gb",{month:"long"})} ${year}`
    calendar.innerHTML = "" // clear calendar before loading

    for (let i=0;i<daysInMonth+firstDay;i++){
        const daySquare = document.createElement("div")
        daySquare.classList.add("calendar-day")
        const dayString = `${i-firstDay+1<10?"0"+(i-firstDay+1).toString():i-firstDay+1}/${month+1?"0"+(month+1).toString():month+1}/${year}`

        if (i<firstDay){
            daySquare.classList.add("lastMonth") //add style for last month days
        }else{
            const dayText = document.createElement("p")
            dayText.classList.add("day-text")
            dayText.id=dayString
            dayText.innerText=i-firstDay+1

            const eventForDay = events.find(e=>e.date ===dayString)
            daySquare.appendChild(dayText)
            //add id to square with 2 digits date, month as id
            daySquare.id = dayString
            daySquare.addEventListener("click",()=>openModal(event.target.id))

            if (i-firstDay+1 ===day && currentMonth===0){
                daySquare.classList.add("today")
            }
            if(i===7 || i % 7===0){
                daySquare.classList.add("sunday")
            }
            if (currentMonth<0){
                daySquare.classList.add("passed")
            }else if(i-firstDay+1 <day){
                daySquare.classList.add("passed")
            }
            

            if(eventForDay) {
                const eventDiv = document.createElement("p")
                eventDiv.classList.add("event")
                eventDiv.id=dayString
                if (eventForDay.title.length<=eventLength){
                    eventDiv.innerText=eventForDay.title
                }else{
                    eventDiv.innerText=eventForDay.title.slice(0,eventLength)
                }
                daySquare.appendChild(eventDiv)
                
            }

        }
        calendarDOM.appendChild(daySquare)
    }
}

const openModal = (date)=>{
    eventDate=date
    modal.style.display="block"
    const eventForDay = events.find(e=>e.date ===eventDate)
    if (eventForDay){
        eventTitle.innerText=  eventForDay.title
        btnAdd.style.display="none"
    }else{
        btnUpdate.style.display="none"
        btnDelete.style.display="none"
    }
    
}

const closeModal =()=>{
    modal.style.display="none"
    eventInput.value=""
    eventTitle.innerText=""
    btnAdd.style.display="block"
    btnUpdate.style.display="block"
    btnDelete.style.display="block"
}

const addEvent =()=>{
    events.push({
        date:eventDate,
        title:eventInput.value
    })
    localStorage.setItem("events",JSON.stringify(events))
    
    closeModal()
    loadPage()
}

const deleteEvent = ()=>{
    events = events.filter(e=>e.date!==eventDate)
    localStorage.setItem("events",JSON.stringify(events))
    closeModal()
    loadPage()
}

const updateEvent =()=>{
    events = events.filter(e=>e.date!==eventDate)
    events.push({
        date:eventDate,
        title:eventInput.value
    })
    localStorage.setItem("events",JSON.stringify(events))
    closeModal()
    loadPage()
}
loadPage()

function reportWindowSize() {
  if (window.innerWidth>800 && eventLength!==30){
    eventLength=30
    loadPage()
  }
  if (window.innerWidth<800 && eventLength!==20){
    eventLength=20
    loadPage()
  }
  if (window.innerWidth<640 && eventLength!==15){
    eventLength=15
    loadPage()
  }
  if (window.innerWidth<520 && eventLength!==8){
    eventLength=8
    loadPage()
  }
}

window.onresize = reportWindowSize;
window.onload = reportWindowSize;