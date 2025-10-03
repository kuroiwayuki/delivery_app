import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  navigate(event) {
    const url = this.element.dataset.url
    if (url) {
      window.location.href = url
    }
  }

  stopPropagation(event) {
    event.stopPropagation()
  }
}
