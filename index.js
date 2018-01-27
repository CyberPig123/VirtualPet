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
  var expBar = document.querySelector('.expBar')
  var expLevel = document.querySelector('.expLevel')

  window.config = {
    canMove: true,
    canPat: true,
    canFeed: true,
    petX: String(innerWidth / 2 - 80),
    petY: '-85'
  }

  key.filter = function(event) {
    var tagName = (event.target || event.srcElement).tagName;
    return !(tagName == 'SELECT' || tagName == 'TEXTAREA');
  }

  localStorage.setItem('timeWasted', localStorage.getItem('timeWasted') || 0)
  localStorage.setItem('focusedTimeWasted', localStorage.getItem('focusedTimeWasted') || 0)

  setInterval(() => {
    localStorage.setItem('timeWasted', Number(localStorage.getItem('timeWasted')) + 10)
    if (!document.hidden) {
      localStorage.setItem('focusedTimeWasted', Number(localStorage.getItem('focusedTimeWasted')) + 10)
    }
  }, 10000)

  for (var i = 0; i < 15; i++) {
    var el = document.createElement('div')
    el.style.backgroundImage = 'url(images/exp_bar' + i + '.png)'
    document.querySelector('.offScreen').appendChild(el)
  }

  var img = ['egg_happy_tr', 'egg_sad_tr', 'egg_laugh_tr', 'egg_sleep_tr', 'egg_apple_food_half_eaten', 'egg_cake_food_half_eaten', 'egg_cat_food_half_eaten']
  for (var i = 0; i < img.length; i++) {
    var el = document.createElement('div')
    el.style.backgroundImage = 'url(images/' + img[i] + '.png)'
    document.querySelector('.offScreen').appendChild(el)
  }

  widthCentre = innerWidth / 2
  pet.style.transform = 'translateX(' + window.config.petX + 'px) translateY(' + window.config.petY + 'px)'
  petBack.style.transform = 'translateX(' + window.config.petX + 'px) translateY(' + window.config.petY + 'px)'

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

  if (localStorage.getItem('expLevel') === null) {
    localStorage.setItem('expLevel', 0)
    localStorage.setItem('expContent', 0)
  }

  function checkFoodsUnlocked() {
    if (Number(localStorage.getItem('expLevel')) > 9) {
      document.querySelector('.food2').classList.remove('hidden')
    }
    if (Number(localStorage.getItem('expLevel')) > 39) {
      document.querySelector('.food3').classList.remove('hidden')
    }
  }

  checkFoodsUnlocked()

  expBar.style.backgroundImage = 'url(images/exp_bar' + localStorage.getItem('expContent') + '.png)'
  expLevel.innerText = localStorage.getItem('expLevel')

  if (Number(localStorage.getItem('expLevel')) >= 9) {
    expLevel.setAttribute('class', 'expLevel twodig')
  }

  // show the pet's name in the document's title
  document.title = localStorage.getItem('petName') + ' - VirtualPet'

  // if there's no colour stored, set it to yellow
  if (localStorage.getItem('petColour') === null) {
    localStorage.setItem('petColour', '#ffd400')
  }

  petBack.style.backgroundColor = localStorage.getItem('petColour')

  window.expAdd = function(num) {
    expcontent = Number(localStorage.getItem('expContent')) + num
    explevel = Number(localStorage.getItem('expLevel'))

    if (expcontent > 13) {
      expcontent = expcontent - 14
      explevel++
    }

    localStorage.setItem('expContent', expcontent)
    localStorage.setItem('expLevel', explevel)
    expBar.style.backgroundImage = 'url(images/exp_bar' + localStorage.getItem('expContent') + '.png)'
    expLevel.innerText = localStorage.getItem('expLevel')

    if (Number(localStorage.getItem('expLevel')) >= 9) {
      expLevel.classList.add('twodig')
    }

    expBar.classList.add('pulse')
    setTimeout(() => {
      expBar.classList.remove('pulse')
    }, 600)

    checkFoodsUnlocked()
  }

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

  key(',', () => {
    config.canMove = false
    colPanel.style.bottom = '0'
  })

  key('.', saveColour)

  // when 'Pet Colour' is clicked
  changeColour.addEventListener('click', (ev) => {
    config.canMove = false
    colPanel.style.bottom = '0'
  })

  function saveColour() {
    setTimeout(() => {
      config.canMove = true
    }, 500)
    colPanel.style.bottom = '-80px'
    hue = -1 * colSlider.value
    localStorage.setItem('petColour', 'hsl(' + hue + ', 85%, 50%)')
    petBack.style.backgroundColor = 'hsl(' + hue + ', 85%, 50%)'
  }

  // when 'Save Colour' is clicked
  colSave.addEventListener('click', saveColour)

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
      expAdd(1)
      window.config.canMove = true
      window.config.canPat = true
      window.config.canFeed = true
      heart.style.display = 'none'
      pet.style.backgroundImage = 'url(images/egg_happy_tr.png)'
      heart.setAttribute('class', 'loveHeart')
    }, 3000)
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
    window.config.canFeed = false
    if (window.config.isMoving) {
      setTimeout(heartPulse, 2300)
    } else {
      heartPulse()
    }
  })

  key('space', () => {
    if (!window.config.canPat) {
      return
    }
    window.config.canMove = false
    window.config.canPat = false
    window.config.canFeed = false
    if (window.config.isMoving) {
      setTimeout(heartPulse, 2300)
    } else {
      heartPulse()
    }
  })

  // foods

  document.querySelector('.food1').addEventListener('click', () => {
    food = document.querySelector('.foodFood')
    food.style.display = 'block'

    if (!window.config.canFeed || window.config.isMoving) return
    window.config.canPat = false
    window.config.canMove = false
    window.config.canFeed = false

    let foodX = Math.floor(Math.random() * window.innerWidth)

    food.style.left = (foodX - 80) + 'px'
    food.style.transition = 'none'
    food.style.transform = 'translateY(-' + (window.innerHeight - 175) + 'px)'

    setTimeout(() => {
      food.style.transition = 'transform 2s'
      food.style.transform = 'none'
      setTimeout(() => {
        food.style.transition = 'none'
        setTimeout(() => {
          food.classList.add('half')
          setTimeout(() => {
            food.classList.remove('half')
            food.classList.add('gone')
            setTimeout(() => {
              expAdd(1)
              food.classList.remove('gone')
              food.style.left = '-200px'
              window.config.canPat = true
              window.config.canMove = true
              window.config.canFeed = true
            }, 500)
          }, 1000)
        }, 1000)
      }, 2000)
    }, 500)

    window.config.petX = foodX - 80

    pet.style.transform = 'translateX(' + window.config.petX + 'px) translateY(' + window.config.petY + 'px)'
    petBack.style.transform = 'translateX(' + window.config.petX + 'px) translateY(' + window.config.petY + 'px)'
  })
})
