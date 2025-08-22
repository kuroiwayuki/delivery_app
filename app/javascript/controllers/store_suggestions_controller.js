import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["suggestions"]
  static values = { url: String }

  search(event) {
    const query = event.target.value.trim()
    
    if (query.length < 2) {
      this.hideSuggestions()
      return
    }

    this.fetchSuggestions(query)
  }

  async fetchSuggestions(query) {
    try {
      const response = await fetch(`${this.urlValue}?q=${encodeURIComponent(query)}`)
      const suggestions = await response.json()
      
      this.displaySuggestions(suggestions)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      this.hideSuggestions()
    }
  }

  displaySuggestions(suggestions) {
    if (suggestions.length === 0) {
      this.hideSuggestions()
      return
    }

    const suggestionsHTML = suggestions.map(suggestion => 
      `<div class="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0" 
           data-action="click->store-suggestions#selectSuggestion" 
           data-suggestion="${suggestion}">
         ${suggestion}
       </div>`
    ).join('')

    this.suggestionsTarget.innerHTML = suggestionsHTML
    this.suggestionsTarget.classList.remove('hidden')
  }

  selectSuggestion(event) {
    const suggestion = event.currentTarget.dataset.suggestion
    this.element.value = suggestion
    this.hideSuggestions()
  }

  hideSuggestions() {
    this.suggestionsTarget.classList.add('hidden')
  }

  // フォーカスアウト時にサジェストを非表示
  blur() {
    setTimeout(() => {
      this.hideSuggestions()
    }, 200)
  }
}
