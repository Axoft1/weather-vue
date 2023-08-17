import {IItems} from '../types'

export const capitalizeFirstLetter = (str) => {
    if(!str) return ''
    return str.charAt(0).toUpperCase()+str.slice(1)
}

const PRESSURE_UNITS = 0.750062

export const getPressureMm = (hpa) => {
    return Math.round(hpa * PRESSURE_UNITS);
}

export const getTime = (second) => {
    return new Date (second * 1000).toLocaleTimeString('ru-RU',{timeZone:'Atlantic/Reykjavik'})
}

export const onDragStart = (e: DragEvent, item: IItems)=> {
  e.dataTransfer!.dropEffect = "move"
  e.dataTransfer!.effectAllowed = "move"
  e.dataTransfer?.setData('itemId', item.id.toString())
}


// function deleteItem(id: number) {
//   citys.value = citys.value!.filter((e) => e.id !== id);
// }

// const citys = ref();

// function addCity(str: string) { 
//     citys.value.push({ id: 1, name: str }); 
// }

// watch(citys, () => {
//   localStorage.setItem("citys", JSON.stringify(citys.value));
// });