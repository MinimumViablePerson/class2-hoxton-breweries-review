type Brewery = {
  id: string
  name: string
  brewery_type: string
  street: string | null
  address_2: string | null
  address_3: string | null
  city: string
  state: string
  county_province: string | null
  postal_code: string
  country: string
  longitude: string | null
  latitude: string | null
  phone: string | null
  website_url: string | null
  updated_at: string
  created_at: string
}

type State = {
  USState: string
  search: string
  breweries: Brewery[]
}

let state: State = {
  USState: '',
  search: '',
  breweries: []
}

// Q: Which state are we looking for? state.USState
// Q: What breweries do we need to display? state.breweries

function getBreweriesForState () {
  fetch(
    `https://api.openbrewerydb.org/breweries?by_state=${state.USState}&per_page=10`
  )
    .then(resp => resp.json())
    .then(breweries => {
      state.breweries = breweries
      render()
    })
}

function getSearchedBreweries () {
  fetch(
    `https://api.openbrewerydb.org/breweries?by_name=${state.search}&by_state=${state.USState}`
  )
    .then(resp => resp.json())
    .then(breweries => {
      state.breweries = breweries
      render()
    })
}

function renderHeader () {
  let mainEl = document.querySelector('main')
  if (mainEl === null) return

  let titleEl = document.createElement('h1')
  titleEl.textContent = 'List of Breweries'

  let searchBarHeader = document.createElement('header')
  searchBarHeader.className = 'search-bar'

  let searchBreweriesForm = document.createElement('form')
  searchBreweriesForm.id = 'search-breweries-form'
  searchBreweriesForm.autocomplete = 'off'
  searchBreweriesForm.addEventListener('submit', function (event) {
    event.preventDefault()
    // find and and display only the breweries from the current state
    // that match our search

    // Strategy 1: Get them from the server
    // https://api.openbrewerydb.org/breweries?by_name=brew&by_state=texas
    state.search = searchBreweriesInput.value
    getSearchedBreweries()

    // Stragegy 2 : Filter the breweries we have in state
  })

  let searchBreweriesLabel = document.createElement('label')
  searchBreweriesLabel.htmlFor = 'search-breweries'

  let searchBreweriesH2 = document.createElement('h2')
  searchBreweriesH2.textContent = 'Search breweries:'

  let searchBreweriesInput = document.createElement('input')
  searchBreweriesInput.id = 'search-breweries'
  searchBreweriesInput.name = 'search-breweries'
  searchBreweriesInput.type = 'text'

  searchBreweriesLabel.append(searchBreweriesH2)
  searchBreweriesForm.append(searchBreweriesLabel, searchBreweriesInput)
  searchBarHeader.append(searchBreweriesForm)

  mainEl.append(titleEl, searchBarHeader)
}

function createMessageH2 (text: string) {
  let messageEl = document.createElement('h2')
  messageEl.className = 'message'
  messageEl.textContent = text

  return messageEl
}

function renderBreweryList () {
  let mainEl = document.querySelector('main')
  if (mainEl === null) return

  if (state.breweries.length === 0) {
    let messageEl = createMessageH2(
      `No breweries found for ${state.search} in ${state.USState}.`
    )
    mainEl.append(messageEl)
  } else {
    let articleEl = document.createElement('article')

    let breweriesUl = document.createElement('ul')
    breweriesUl.className = 'breweries-list'

    for (let brewery of state.breweries) {
      let liEl = createSingleBreweryLi(brewery)
      breweriesUl.append(liEl)
    }

    articleEl.append(breweriesUl)
    mainEl.append(articleEl)
  }
}

// Previous:
// input: brewery, list
// action: creates an li and appends it to the list
// output: undefined

// Current:
// input: brewery
// action: creates an li
// output: li
function createSingleBreweryLi (brewery: Brewery) {
  let breweryLi = document.createElement('li')

  let breweryTitle = document.createElement('h2')
  breweryTitle.textContent = brewery.name

  let breweryTypeDiv = document.createElement('div')
  breweryTypeDiv.className = 'type'
  breweryTypeDiv.textContent = brewery.brewery_type

  let breweryAddressSection = document.createElement('section')
  breweryAddressSection.className = 'address'

  let breweryAddressTitle = document.createElement('h3')
  breweryAddressTitle.textContent = 'Address:'

  let breweryAddressLine1 = document.createElement('p')
  breweryAddressLine1.textContent = brewery.street

  let breweryAddressLine2 = document.createElement('p')

  let breweryAddressLine2Strong = document.createElement('strong')
  breweryAddressLine2Strong.textContent = `${brewery.city}, ${brewery.postal_code}`

  let breweryPhoneSection = document.createElement('section')
  breweryPhoneSection.className = 'phone'

  let breweryPhoneTitle = document.createElement('h3')
  breweryPhoneTitle.textContent = 'Phone:'

  let breweryPhoneP = document.createElement('p')
  breweryPhoneP.textContent = brewery.phone ? brewery.phone : 'N/A'

  let breweryLinkSection = document.createElement('section')
  breweryLinkSection.className = 'link'

  let breweryLinkA = document.createElement('a')
  if (brewery.website_url) {
    breweryLinkA.href = brewery.website_url ? brewery.website_url : '#'
    breweryLinkA.target = '_blank'
    breweryLinkA.textContent = 'Visit Website'
  } else {
    breweryLinkA.textContent = 'No Website'
  }

  breweryLi.append(
    breweryTitle,
    breweryTypeDiv,
    breweryAddressSection,
    breweryPhoneSection,
    breweryLinkSection
  )
  breweryAddressSection.append(
    breweryAddressTitle,
    breweryAddressLine1,
    breweryAddressLine2
  )
  breweryAddressLine2.append(breweryAddressLine2Strong)
  breweryPhoneSection.append(breweryPhoneTitle, breweryPhoneP)
  breweryLinkSection.append(breweryLinkA)

  return breweryLi
}

function render () {
  let mainEl = document.querySelector('main')
  if (mainEl === null) return
  mainEl.textContent = ''

  renderHeader()
  renderBreweryList()
}

function listenToSelectStateForm () {
  let formEl = document.querySelector<HTMLFormElement>('#select-state-form')
  formEl?.addEventListener('submit', function (event) {
    event.preventDefault()
    if (formEl === null) return
    let USState = formEl['select-state'].value
    state.USState = USState
    getBreweriesForState()
  })
}

listenToSelectStateForm()

// Step 1: Prevent the search form from refreshing the page ✅
// Step 2: Trigger some action when the form submits ✅
