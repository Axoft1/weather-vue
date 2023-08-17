<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { API_KEY, BASE_URL } from '../constants'
import WeatherSummary from '../components/WeatherSummary.vue';
import Highlights from '../components/Highlights.vue';
import Humidity from '../components/Humidity.vue';
import Coords from '../components/Coords.vue';
import { capitalizeFirstLetter } from '../utils'
import Settings from '../components/Settings.vue'
import { IItems, IWeatherInfo } from '../types'

const city = ref<string>('')
const citys = ref<IItems[]>([])
const weatherInfo = ref<IWeatherInfo | null>(null)
const settingsShow = ref(false)
const isError = computed(() => weatherInfo.value?.cod !== 200)

watch(citys, () => {
    localStorage.setItem('citys', JSON.stringify(citys.value))
}, { deep: true })
function geolocationOfCity(lat: number, lon: number) {
    fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        .then((response) => response.json())
        .then((data) => weatherInfo.value = data)
}
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
        geolocationOfCity(position.coords.latitude, position.coords.longitude);
    });
} else {
    console.log('not geolocation')
}

function getWeather() {
    let value = ''
    if (city.value) {
        value = city.value
    } else if (citys?.value[0]?.name) {
        value = citys?.value[0]?.name
    }

    fetch(`${BASE_URL}?q=${value}&units=metric&appid=${API_KEY}`)
        .then((response) => response.json())
        .then((data) => weatherInfo.value = data)
}
function getLocal() {
    const local = localStorage.getItem('citys');
    if (local === 'undefined') {
        localStorage.removeItem('citys');
    } else if (local !== null) {
        citys.value = JSON.parse(local)
    }
}
function searchCity(str: string) {
    city.value = str
    getWeather()
}
function deleteItem(id: number) {
    citys.value = citys.value!.filter(e => e.id !== id)
}
function addCity(str: string) {
    if (!str) {
        return
    }
    const id = Math.round(Math.random() * 10) as number
    const findindex = citys.value ? citys.value!.findIndex(ite => ite.id === id) : -1
    if (findindex === -1) {
        citys.value.push({ id: id, name: str })
    } else {
        addCity(str)
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
onMounted(() => { getLocal(); getWeather() })
const png = 'src/assets/weather-main/cross.png'

</script>

<template>
    <div class="page">
        <main class="main">
            <div class="container">
                <div class="laptop">
                    <div class="sections">
                        <div @click="settingsShow = !settingsShow" class="settinsButton"
                            :style="`background-image: url('/public/weather-main/${settingsShow ? 'cross' : 'settings'}.png')`">
                        </div>
                        <Settings v-show="settingsShow" :citys="citys" :citySetting="'citySetting'" :onDrop="onDrop"
                            :deleteItem="deleteItem" :addCity="addCity" :searchCity="searchCity" />
                        <section :class="['section', 'section-left', { 'section-error': isError }]">
                            <div class="info">
                                <div class="city-inner">
                                    <input v-model="city" type="text" class="search" @keyup.enter="getWeather">
                                </div>
                                <WeatherSummary v-if="!isError" :weatherInfo="weatherInfo" />
                                <div v-else class="error">
                                    <div class="error-title">Ooops! Something went wrong</div>
                                    <div v-if="weatherInfo?.message" class="error-message">{{
                                        capitalizeFirstLetter(weatherInfo?.message) }}
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section v-if="!isError" class="section section-right">
                            <Highlights :weatherInfo="weatherInfo" />
                        </section>
                    </div>
                    <div v-if="!isError" class="sections">
                        <Coords :coord="weatherInfo!.coord" />
                        <Humidity :humidity="weatherInfo!.main.humidity" />
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style lang="sass" scoped>
@import '../assets/styles/main'
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
    background: url('../assets/img/search.svg') no-repeat 50% 50%
    background-size: contain
    transform: translateY(50%)
    cursor: pointer
  @media (max-width: 767px)
    width: 80%
.info
  height: 100%
  padding: 16px
  background: url('../assets/img/gradient-1.jpg') no-repeat 50% 50%
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
