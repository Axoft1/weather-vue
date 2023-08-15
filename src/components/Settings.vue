<script lang="ts" setup>
import { PropType, ref } from 'vue'
import { onDragStart } from '../utils'

const props = defineProps({
  citys: {
    type: Object,
    required: true
  },
  onDrop:{
    type: Object,
    required: true
  },
  deleteItem:{
    type: Object,
    required: true
  },
  addCity:{
    type: Object,
    required: true
  }
})
const city = ref('')
</script>
<template>
  <div class="settings">
    Settings
    <div v-for="item in citys" @drop="onDrop($event, item.id)" class="droppable" @dragover.prevent @dragenter.prevent>
      <div @click="deleteItem(item.id)"
        style="background: url('/public/weather-main/delete.png') no-repeat; background-size: contain; width: 20px; height: 20px;">
      </div>
      <div :key="item.id" @dragstart="onDragStart($event, item)" class="draggable" draggable="true">
        <p>{{ item.name }}</p>
        <div
          style="background: url('/public/weather-main/burger.png') no-repeat; background-size: contain; width: 20px; height: 20px;">
        </div>
      </div>
    </div>
    <div>
      <label for="">Add Location:</label>
      <input v-model="city" class="inputCity" type="text" placeholder="City" @keyup.enter="addCity(city)">
    </div>
  </div>
</template>
<style lang="sass" scoped>
.settings
  width: 40%
  position: absolute
  top: 0
  right: 0
  overflow: auto
  height: 100%
  padding: 40px 50px 20px 20px 
  background: url('../assets/img/gradient-1.jpg') no-repeat 50% 50%
  background-size: cover
  border-radius: 25px
  z-index: 10
  @media (max-width: 767px)
    width: 80%
.droppable
  display: flex
  justify-content: end
  gap: 15px
  align-items: center
.draggable
  display: flex
  gap: 10px
  align-items: center
  cursor: pointer
.inputCity
  width: 100%
  margin-top: 10px
  padding: 16px
  font-family: 'Inter', Arial, sans-serif
  background-color: rgba(0, 0, 0, 0.75)
  border-radius: 16px
  color: white
  border: none
  outline: none
</style>