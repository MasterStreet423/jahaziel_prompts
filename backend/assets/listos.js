const URL = window.location.origin
const bodyTable = document.querySelector("#tableBody")

function createRow(img,description,idx) {
    const row = document.createElement("tr")
    row.innerHTML = `
        <td>${idx}</td>
        <td><img src="${img}" class="img-thumbnail" width="150" height="150"></td>
        <td>${description}</td>
    `
    bodyTable.appendChild(row)
}

fetch(`${URL}/ready`).then(response => response.json()).then(data => {
    const sortedImageData = data.sort((a,b) => parseInt(a.image.split("/")[2]) - parseInt(b.image.split("/")[2]))
    sortedImageData.forEach((item) => {
        createRow(item.image, item.prompt,item.image.split("/")[2])
    })
})