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
  var heart = document.querySelector('.loveHeart')

  window.config = {
    canMove: true,
    canPat: true,
    petX: String(innerWidth / 2 - 80),
    petY: '-85'
  }

  widthCentre = innerWidth / 2
  pet.style.transform = 'translateX(' + window.config.petX + 'px) translateY(' + window.config.petY + 'px)'
  petBack.style.transform = 'translateX(' + window.config.petX + 'px) translateY(' + window.config.petY + 'px)'

  if (!('Notification' in window)) {
    console.log('Can not notify, browser unsupported');
  } else if (Notification.permission == 'denied'){
    console.log('Can not notify, user denies')
  } else if (Notification.permision == 'granted'){
    window.config.canNotify = true
  } else {
    Notification.requestPermission(function (permission) {
      window.location.reload()
    });
  }

  if (window.config.canNotify) {
    setInterval(() => {
      var num = Math.floor(Math.random() * 200) + 1
      if (num === 200) {
        var not = new Notification('Your pet misses you!', {
          body: 'Come and see ' + localStorage.getItem('petName') + ' now!',
          icon: 'images/egg_happy_256.png'
        });
      }
    }, 1000)
  }

  setTimeout(() => {
    pet.style.transition = 'transform 2.5s'
    petBack.style.transition = 'transform 2.5s'
  }, 100)

  // if there's no name stored, set the name to 'My Pet'
  if (localStorage.getItem('petName') === null) {
    localStorage.setItem('petName', 'My Pet')
  }

  saveNameLink.style.display = 'none'
  name.innerText = localStorage.getItem('petName')

  // show the pet's name in the document's title
  document.title = localStorage.getItem('petName') + ' - VirtualPet'

  // if there's no colour stored, set it to yellow
  if (localStorage.getItem('petColour') === null) {
    localStorage.setItem('petColour', '#ffd400')
  }

  petBack.style.backgroundColor = localStorage.getItem('petColour')

  // when 'Edit Name' is clicked
  editNameLink.addEventListener('click', (ev) => {
    name.setAttribute('contentEditable', '')
    name.focus()
    ev.target.style.display = 'none'
    saveNameLink.style.display = 'inline'
  })

  // when 'Save Name' is clicked
  saveNameLink.addEventListener('click', (ev) => {
    name.removeAttribute('contentEditable')
    localStorage.setItem('petName', name.innerText)
    ev.target.style.display = 'none'
    editNameLink.style.display = 'inline'
    document.title = localStorage.getItem('petName') + ' - VirtualPet'
  })

  // when the colour slider is changed
  colSlider.addEventListener('input', (ev) => {
    var hue = -1 * ev.target.value
    colPreview.style.backgroundColor = 'hsl(' + hue + ', 85%, 50%)'
  })

  // when 'Pet Colour' is clicked
  changeColour.addEventListener('click', (ev) => {
    config.canMove = false
    colPanel.style.bottom = '0'
  })

  // when 'Save Colour' is clicked
  colSave.addEventListener('click', (ev) => {
    setTimeout(() => {
      config.canMove = true
    }, 500)
    colPanel.style.bottom = '-80px'
    hue = -1 * colSlider.value
    localStorage.setItem('petColour', 'hsl(' + hue + ', 85%, 50%)')
    petBack.style.backgroundColor = 'hsl(' + hue + ', 85%, 50%)'
  })

  // clicking to move the pet
  document.body.addEventListener('click', (ev) => {
    // if the click is under the floor or on the controls, cancel
    if (ev.clientY > (innerHeight - 80) || ev.clientY < 140 || config.canMove !== true) {
      return
    }

    // if the click has a similar X to the pet, cancel
    if (Math.abs(ev.clientX - window.config.petX - 80) < 60) {
      return
    }

    window.config.isMoving = true
    window.config.petX = String(ev.clientX - 80)

    setTimeout(() => {
      window.config.isMoving = false
    }, 2500)

    pet.style.transform = 'translateX(' + window.config.petX + 'px) translateY(' + window.config.petY + 'px)'
    petBack.style.transform = 'translateX(' + window.config.petX + 'px) translateY(' + window.config.petY + 'px)'
  })

  function heartPulse() {
    setTimeout(() => {
      window.config.canMove = true
      window.config.canPat = true
      heart.style.display = 'none'
      pet.style.backgroundImage = 'url(images/egg_happy_tr.png)'
      heart.setAttribute('class', 'loveHeart')
    }, 1500)
    heart.style.display = 'block'
    heart.style.left = Number(window.config.petX.replace('px', '')) + 52.5
    heart.style.bottom = '240px'
    pet.style.backgroundImage = 'url(images/egg_laugh_tr.png)'
    heart.setAttribute('class', 'loveHeart pulse')
  }

  pet.addEventListener('click', () => {
    if (!window.config.canPat) {
      return
    }
    window.config.canMove = false
    window.config.canPat = false
    if (window.config.isMoving) {
      setTimeout(heartPulse, 2300)
    } else {
      heartPulse()
    }
  })
})
