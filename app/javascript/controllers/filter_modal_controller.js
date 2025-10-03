import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal"]

  connect() {
    // 画面スクロールのロックを解除
    if (document && document.body) {
      document.body.style.overflow = "auto"
    }
  }

  // 送信完了時にモーダルを閉じる
  submitted() {
    this.close()
  }

  open() {
    this.modalTarget.classList.remove("hidden")
    document.body.style.overflow = "hidden"
  }

  close() {
    this.modalTarget.classList.add("hidden")
    document.body.style.overflow = "auto"
  }
}