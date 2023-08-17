<script lang="ts" setup>
import { onDragStart } from '../utils'

const props = defineProps({
  citys: {
    type: Object || null,
    required: true
  },
  citySetting: {
    type: String,
    required: true
  },
  onDrop: {
    type: Function,
    required: true
  },
  deleteItem: {
    type: Function,
    required: true
  },
  addCity: {
    type: Function,
    required: true
  },
  searchCity: {
    type: Function,
    required: true
  }
})
</script>
<template>
  <div class="settings">
    Settings
    <div v-for="item in citys" @drop="onDrop($event, item.id)" class="droppable" @dragover.prevent @dragenter.prevent>
      <div @click="deleteItem(item.id)"
        style="background: url('/public/weather-main/delete.png') no-repeat; background-size: contain; width: 20px; height: 20px;">
      </div>
      <div :key="item.id" @dragstart="onDragStart($event, item)" class="draggable" draggable="true">
        <p @click="searchCity(item.name)">{{ item.name }}</p>
        <div
          style="background: url('/public/weather-main/burger.png') no-repeat; background-size: contain; width: 20px; height: 20px;">
        </div>
      </div>
    </div>
    <div>
      <label for="">Add Location:</label>
      <input class="inputCity" type="text" placeholder="City"
        @keyup.enter="event => { 
          const target = event.target as HTMLTextAreaElement; 
          addCity(target.value ? target.value : ''); 
          target.value = '' 
          }">
    </div>
  </div>
</template>
<style lang="sass" scoped>
.settings
  width: 300px
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
  &:first-child
    color: yellow
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