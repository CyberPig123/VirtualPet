document.addEventListener('DOMContentLoaded', (ev) => {
  var editNameLink = document.querySelector('.edit')
  var saveNameLink = document.querySelector('.save')
  var petColourLink = document.querySelector('.colour')
  var name = document.querySelector('.name')
  var pet = document.querySelector('.pet')
  var petBack = document.querySelector('.petBack')
  var colSlider = document.querySelector('.colSlider')
  var colPreview = document.querySelector('.colPreview')
  var colSave = document.querySelector('.colSave')
  var changeColour = document.querySelector('.colour')
  var colPanel = document.querySelector('.petColour')
  window.config = {
    canMove: true
  }

  widthCentre = innerWidth / 2
  pet.style.transform = 'translateX(' + String(innerWidth / 2 - 80) + 'px) translateY(-85px)'
  petBack.style.transform = 'translateX(' + String(innerWidth / 2 - 80) + 'px) translateY(-85px)'

  setTimeout(() => {
    pet.style.transition = 'transform 1.5s ease-in-out'
    petBack.style.transition = 'transform 1.5s ease-in-out'
  }, 100)

  if (localStorage.getItem('petName') === null) {
    localStorage.setItem('petName', 'My Pet')
  }

  if (localStorage.getItem('petColour') === null) {
    localStorage.setItem('petColour', '#ffd400')
  }

  petBack.style.backgroundColor = localStorage.getItem('petColour')

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

  colSlider.addEventListener('input', (ev) => {
    var hue = -1 * ev.target.value
    colPreview.style.backgroundColor = 'hsl(' + hue + ', 85%, 50%)'
  })

  changeColour.addEventListener('click', (ev) => {
    config.canMove = false
    colPanel.style.bottom = '80px'
  })

  colSave.addEventListener('click', (ev) => {
    setTimeout(() => {
      config.canMove = true
    }, 500)
    colPanel.style.bottom = '0'
    hue = -1 * colSlider.value
    localStorage.setItem('petColour', 'hsl(' + hue + ', 85%, 50%)')
    petBack.style.backgroundColor = 'hsl(' + hue + ', 85%, 50%)'
  })

  document.body.addEventListener('click', (ev) => {
    if (ev.clientY > (innerHeight - 80) || ev.clientY < 140 || config.canMove !== true) {
      return
    }
    pet.style.transform = 'none'
    petBack.style.transform = 'translateX(' + (ev.clientY - 80) + 'px) translateY(-85px)'

    pet.style.transform = 'translateX(' + (ev.clientX - 80) + 'px) translateY(-85px)'
    petBack.style.transform = 'translateX(' + (ev.clientX - 80) + 'px) translateY(-85px)'
  })
})
