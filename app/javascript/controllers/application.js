import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.debug = true  // デバッグを有効化
window.Stimulus   = application

console.log('=== Stimulus Application Started ===')
console.log('Application:', application)

export { application }
