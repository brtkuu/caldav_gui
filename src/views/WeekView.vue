<template>
    <div class="weekDisplay"> 
        <week-display v-on:weekChange="renderDays()"></week-display>
        <div class="weekTable">
            <div class="dayLable">Sun</div>
            <div class="dayLable">Mon</div>
            <div class="dayLable">Tue</div>
            <div class="dayLable">Wed</div>
            <div class="dayLable">Thu</div>
            <div class="dayLable">Fri</div>
            <div class="dayLable">Sat</div>
            <div class="dayBody" @dblclick="openAddView()"></div>
            <div class="dayBody" @dblclick="openAddView()"></div>
            <div class="dayBody" @dblclick="openAddView()"></div>
            <div class="dayBody" @dblclick="openAddView()"></div>
            <div class="dayBody" @dblclick="openAddView()"></div>
            <div class="dayBody" @dblclick="openAddView()"></div>
            <div class="dayBody" @dblclick="openAddView()"></div>
        </div>
         <add-event v-if="this.$store.state.modals.addEventModal" class="addEvent"></add-event>
        <event-info
            class="eventInfo"
            v-if="this.$store.state.modals.eventInfoModal && clickedEvent"
            v-bind:event="clickedEvent"
        ></event-info>
        <update-event class="updateEvent" v-if="this.$store.state.modals.updateEventModal"  v-bind:event='clickedEvent'></update-event>
    </div>

</template>
<script>
    import WeekDisplay from "../components/weekDisplay";
    import AddEvent from "../components/addEvent";
    import EventModal from "../components/eventModal";
    import UpdateEvent from "../components/updateEvent";

    export default {
        name: "WeekView",
        components: {
            "week-display": WeekDisplay,
            "add-event": AddEvent,
            "event-info": EventModal,
            "update-event": UpdateEvent,
        },
        data() {
		    return {
			    clickedEvent: undefined,
		    };
	    },
        methods: {
            renderDays() {
                if(!this.$store.state.clickedDate){
                    this.$store.state.clickedDate = this.$store.state.currentDate;
                }
                const date = new Date(this.$store.state.currentYear,this.$store.state.currentMonth,this.$store.state.clickedDate);
                this.$store.state.clickedDate = this.$store.state.clickedDate - (date.getDay());
                const dayBodies = document.querySelectorAll(".dayBody");
                for(let i=0; i<7; i++){
                    dayBodies[i].innerHTML='';
                    const weekDay = new Date(this.$store.state.currentYear,this.$store.state.currentMonth,date.getDate() - (date.getDay()) + i );
                    const dateLabel = document.createElement("div");
                    dayBodies[i].id = date.getDate() - date.getDay() + i;
                    dateLabel.textContent=`${weekDay.getDate()}-${weekDay.getMonth() +1}-${weekDay.getFullYear()}`;
                    dayBodies[i].appendChild(dateLabel);
                    
                    this.$store.state.events.forEach((ele, index) => {
                        const event = this.createEvent(ele, weekDay);
                        if (event) {
                            event.addEventListener('click', () => {
                                this.clickedEvent = this.$store.state.events[index];
                                this.$store.commit("toggleInfoEventView");
                            })
                            dayBodies[i].appendChild(event);
                        }
                    });
                }
            },
            createEvent(ele, d) {
                const eventDateStart = new Date(ele.start);
                const eventDateEnd = new Date(ele.end);
                if (this.$isDate(ele, d)) {
                    const eventLabel = document.createElement("div");
                    const dates = this.$setDates(eventDateEnd, eventDateStart);
                    
                    eventLabel.innerHTML = `${
                        dates.startHour &&
                        dates.startMinutes &&
                        (dates.startHour != dates.endHour ||
                            dates.startMinutes != dates.endMinutes)
                            ? dates.startHour + ":" + dates.startMinutes
                            : ""
                    } ${ele.summary}`;
                    eventLabel.classList.add("weekViewElement");
                    return eventLabel;
                }
                return null;
		    },
            openAddView() {
                this.$store.state.clickedDate = event.target.id;
			    this.$store.commit("toggleAddEventView");
            },
        },
        mounted() {
            if(!this.$store.state.clickedDate){
            this.$store.state.clickedDate = this.$store.state.currentDate.getDate(); 
            }
            this.renderDays();
        }
    }
</script>
<style>
    .weekTable{
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: 30px 100vh;
    }
    .dayLable{
        text-align: center;
        line-height: 30px;
        border-right: 1px solid black;
    }
    .dayBody{
        text-align: center;
        line-height: 30px;
        border-right: 1px solid black;
        height: 100%;
    }
    .weekViewElement{
        background-color:RGB(239, 239, 245);
        width: auto;
        height: 60px;
        margin: 5px;
        line-height: 60px;
    }
</style>

