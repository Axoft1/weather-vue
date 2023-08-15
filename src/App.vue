<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { API_KEY, BASE_URL } from './constants'
import WeatherSummary from './components/weathersummary.vue';
import Highlights from './components/Highlights.vue';
import Humidity from './components/Humidity.vue';
import Coords from './components/Coords.vue';
import { capitalizeFirstLetter } from './utils'
import Settings from './components/Settings.vue'
import {IItems} from './types'

const city = ref('Novosibirsk')
const citys = ref<IItems[] | null>(null)
const weatherInfo = ref(null)
const settingsShow = ref(true)
const isError = computed(() => weatherInfo.value?.cod !== 200)

watch(citys,()=>{
  console.log(citys);
  localStorage.setItem('citys', JSON.stringify(citys.value))
})

function getWeather() {
  fetch(`${BASE_URL}?q=${city.value}&units=metric&appid=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => weatherInfo.value = data)
}
function getLocal() {
  const local = localStorage.getItem('citys');  
  if(local !== null){
    citys.value = JSON.parse(local)
  }
}

function deleteItem(id: number) {
  citys.value = citys.value!.filter(e => e.id !== id)
}
function addCity(city) {
  console.log(city);
  if (!city) {    
    return
  }
  
  const id = Math.round(Math.random() * 10)
  const findindex = citys.value!.findIndex(ite => ite.id === id)
  if (findindex === -1) {
    citys.value!.push({ id: id, name: city })
    
  } else {
    addCity(city)
  }
}
function onDrop(e: DragEvent, item: number) {
  const itemId = parseInt(e.dataTransfer!.getData('itemId'))
  const swappedElementIndex = citys.value!.findIndex(ite => ite.id === itemId);
  const elementIndex = citys.value!.findIndex(ite => ite.id == item);
  const copycitys = [...citys.value!]
  // Меняем местами элементы
  copycitys.splice(elementIndex, 1, citys.value![swappedElementIndex])
  copycitys.splice(swappedElementIndex, 1, citys.value![elementIndex])
  citys.value = copycitys
}
onMounted(() => { getWeather(); getLocal() })
</script>

<template>
  <div class="page">
    <main class="main">
      <div class="container">
        <div class="laptop">
          <div class="sections">
            <div @click="settingsShow = !settingsShow" class="settinsButton"
              :style="`background-image: url('/weather-main/${settingsShow ? 'cross' : 'settings'}.png')`"></div>
            <Settings v-show="settingsShow" :citys="citys" :onDrop="onDrop" :deleteItem="deleteItem" :addCity="addCity"/>
            <section :class="['section', 'section-left', { 'section-error': isError }]">
              <div class="info">
                <div class="city-inner">
                  <input v-model="city" type="text" class="search" @keyup.enter="getWeather">
                </div>
                <WeatherSummary v-if="!isError" :weatherInfo="weatherInfo" />
                <div v-else class="error">
                  <div class="error-title">Ooops! Something went wrong</div>
                  <div v-if="weatherInfo?.message" class="error-message">{{ capitalizeFirstLetter(weatherInfo?.message) }}
                  </div>
                </div>
              </div>
            </section>
            <section v-if="!isError" class="section section-right">
              <Highlights :weatherInfo="weatherInfo" />
            </section>
          </div>
          <div v-if="!isError" class="sections">
            <Coords :coord="weatherInfo.coord" />
            <Humidity :humidity="weatherInfo.main.humidity" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="sass" scoped>
@import './assets/styles/main'
.page
  position: relative
  display: flex
  justify-content: center
  align-citys: center
  min-height: 100vh
  padding: 20px 0
  background-color: #59585d

.laptop
  width: 100%
  padding: 20px
  background-color: #0e100f
  border-radius: 25px
.settinsButton
  position: absolute
  top: 0
  right: 0
  width: 38px
  height: 38px
  margin: 10px 10px 0px 12px
  background-repeat: no-repeat
  background-position: 50% 50%
  background-size: contain
  cursor: pointer
  z-index: 11
.sections
  position: relative
  display: flex
  width: 100%

  @media (max-width: 767px)
    flex-direction: column

.section-left
  width: 30%
  padding-right: 10px

  @media (max-width: 767px)
    width: 100%
    padding-right: 0
  &.section-error
    min-width: 235px
    width: auto
    padding-right: 0
.section-right
  width: 70%
  padding-left: 10px

  @media (max-width: 767px)
    width: 100%
    margin-top: 16px
    padding-left: 0

.city-inner
  position: relative
  display: inline-block
  width: 100%

  &::after
    content: ''
    position: absolute
    top: 0
    right: 10px
    width: 25px
    height: 25px
    background: url('./assets/img/search.svg') no-repeat 50% 50%
    background-size: contain
    transform: translateY(50%)
    cursor: pointer
  @media (max-width: 767px)
    width: 80%
.info
  height: 100%
  padding: 16px
  background: url('./assets/img/gradient-1.jpg') no-repeat 50% 50%
  background-size: cover
  border-radius: 25px

.search
  width: 100%
  padding: 16px
  font-family: 'Inter', Arial, sans-serif
  color: $white
  background-color: rgba(0, 0, 0, 0.75)
  border-radius: 16px
  border: none
  outline: none

.section-bottom
  width: 50%
  margin-top: 16px

  @media (max-width: 767px)
    width: 100%

.error
  padding-top: 20px
  &-title
    font-size: 18px
    font-weight: 700
  &-message
    padding-top: 10px
    font-size: 14px
    font-weight: 500
</style>
