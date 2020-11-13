<template>
   <div class="dateDisplayContainer">
    <div class="agendaNav">
      <button class="agendaNavBtn" @click="prevWeek()">BACK</button>
      <button class="agendaNavBtn" @click="nextWeek()">NEXT</button>
    </div>
    <p class="agendaHeader">
      {{this.$store.state.months[this.$store.state.currentMonth]}} {{this.$store.state.currentYear}}
    </p>
</div>
</template>
<script>
export default {
    name: "WeekDisplay",
    methods: {
        nextWeek() {
            for(let i=0; i<7; i++){
            this.$store.commit("incrementClkDay");
            }
            this.$emit("weekChange");
        },
        prevWeek() {
            for(let i=0; i<7; i++){
            this.$store.commit("decrementClkDay");
            }
            this.$emit("weekChange");
        }
    }
}
</script>
