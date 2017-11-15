document.addEventListener('DOMContentLoaded', (ev) => {
  var editNameLink = document.querySelector('.edit')
  var saveNameLink = document.querySelector('.save')
  var name = document.querySelector('.name')
  var pet = document.querySelector('.pet')

  widthCentre = innerWidth / 2
  pet.style.transform = 'translateX(' + String(innerWidth / 2 - 80) + 'px) translateY(' + String(innerHeight - 90 - 153.5) + 'px)'

  if (localStorage.getItem('petName') === null) {
    localStorage.setItem('petName', 'My Pet')
  }

  saveNameLink.style.display = 'none'
  name.innerText = localStorage.getItem('petName')

  editNameLink.addEventListener('click', (ev) => {
    name.setAttribute('contentEditable', '')
    name.focus()
    ev.target.style.display = 'none'
    saveNameLink.style.display = 'inline'
  })

  saveNameLink.addEventListener('click', (ev) => {
    name.removeAttribute('contentEditable')
    localStorage.setItem('petName', name.innerText)
    ev.target.style.display = 'none'
    editNameLink.style.display = 'inline'
  })
})
