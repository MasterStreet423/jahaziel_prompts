import './style.css'
import {  lastPrompted } from './types/Responses';
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
let current: number = -1;


const URL = window.location.origin

function formatTitle(id: number) {
  return `N° ${id}`
}
function fetchImage(id: number): string {
  return URL + "/image/" + id
}
async function getLastPrompted(): Promise<lastPrompted> {
  const response = await fetch(URL + "/last")
  const data = await response.json()
  return data as lastPrompted
}
async function promptImage(id: number, prompt: string) {
  const response = await fetch(URL + "/prompt", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, prompt }) })
  const data = await response.json()
  return data as lastPrompted
}

const leftButton = document.querySelector("#left-button") as HTMLButtonElement
const rightButton = document.querySelector("#right-button") as HTMLButtonElement
const form = document.querySelector("form") as HTMLFormElement
const image = document.querySelector("#image") as HTMLImageElement
const title = document.querySelector("h1") as HTMLHeadingElement



function updateImage(id: number) {
  image.src = fetchImage(id)
  title.innerText = formatTitle(id)
}

(async ()=>{
  return await getLastPrompted()
})().then((data) => {
  current = data.id
  updateImage(current)
})
rightButton.addEventListener("click", () => {
  if (current > 0) {
    current++
    updateImage(current)
  }
})
leftButton.addEventListener("click", () => {
  if (current > 1 && current !== -1) {
    current--
    updateImage(current)
  }
})
form.addEventListener("submit", (e) => {
  e.preventDefault()
  const formData = new FormData(form)
  const prompt = formData.get("prompt") as string

  form.reset()
  promptImage(current, prompt).then(() => {
    Toastify({
      text: "Prompt Enviado correctamente",
      duration: 3000,
      gravity: "top",
      position: "right",
    }).showToast()
    current++
updateImage(current)

  }).catch(() => {
    Toastify({
      text: "Error al enviar el prompt",
      duration: 3000,
      gravity: "top",
      style:{
        background: "red"
      },
      position: "right",
    }).showToast()
  })
  


})

