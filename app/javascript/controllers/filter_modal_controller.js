import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal"]

  connect() {
    console.log('FilterModalController connected!')
  }

  open() {
    console.log('FilterModalController open() called!')
    this.modalTarget.classList.remove("hidden")
    document.body.style.overflow = "hidden" // スクロールを無効化
  }

  close() {
    this.modalTarget.classList.add("hidden")
    document.body.style.overflow = "auto" // スクロールを有効化
  }

  // Turboが自動的にフォーム送信を処理するため、手動のfetchは不要
  // フォーム送信後にモーダルを閉じる処理は、Turbo Streamで制御
}