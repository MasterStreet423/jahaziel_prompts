import './style.css'
import { Image, lastPrompted } from './types/Responses';

async function fetchImage(id: number): Promise<Image> {
  const response = await fetch(URL + "/image/" + id)
  const parsed = await response.json()
  return parsed as Image
}

async function getLastPrompted(): Promise<lastPrompted> {
  const response = await fetch(URL + "/last")
  const data = await response.json()
  return data as lastPrompted
}
async function promptImage(id: number, prompt: string) {
  const response = await fetch(URL + "/prompt")

}
