import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "deliveriesTable", "kpiCards"]

  connect() {
    console.log('FilterModalController connected!')
    
    // 現在のフィルタ状態を復元
    this.restoreFilters()
    
    // 初期表示時はフィルタ状態表示を表示しない
    // フィルタが実際に適用された場合のみ表示する
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

  async apply() {
    const filters = this.collectFilters()
    
    try {
      // ローディング状態を表示
      this.showLoading()
      
      // 非同期でフィルタを適用
      const response = await fetch('/dashboard/index', {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: new URLSearchParams(filters)
      })
      
      if (response.ok) {
        const html = await response.text()
        this.updatePageContent(html)
        this.updateURL(filters)
        this.close()
      } else {
        console.error('Filter application failed')
      }
    } catch (error) {
      console.error('Error applying filters:', error)
    } finally {
      this.hideLoading()
    }
  }

  clear() {
    // フィルタをクリア
    this.clearAllInputs()
    
    // フィルタ状態表示を削除
    const filterStatusElement = document.querySelector('.bg-blue-50')
    if (filterStatusElement) {
      filterStatusElement.remove()
    }
    
    // クリアされた状態で適用
    this.apply()
  }

  collectFilters() {
    const filters = {}
    
    // 日付範囲
    const dateFrom = document.getElementById('date_from')?.value
    const dateTo = document.getElementById('date_to')?.value
    
    if (dateFrom) filters.date_from = dateFrom
    if (dateTo) filters.date_to = dateTo
    
    // 地区（複数選択）
    const areaSelect = document.getElementById('area_ids')
    if (areaSelect) {
      const selectedAreas = Array.from(areaSelect.selectedOptions).map(option => option.value)
      if (selectedAreas.length > 0) {
        filters.area_ids = selectedAreas
      }
    }
    
    // 店舗名
    const storeName = document.getElementById('store_name')?.value?.trim()
    if (storeName) filters.store_name = storeName
    
    return filters
  }

  clearAllInputs() {
    // 日付フィールドをクリア
    document.getElementById('date_from').value = ''
    document.getElementById('date_to').value = ''
    
    // 地区選択をクリア
    const areaSelect = document.getElementById('area_ids')
    if (areaSelect) {
      Array.from(areaSelect.options).forEach(option => {
        option.selected = false
      })
    }
    
    // 店舗名フィールドをクリア
    document.getElementById('store_name').value = ''
  }

  updateURL(filters) {
    const url = new URL(window.location)
    
    // 既存のフィルタパラメータをクリア
    const filterParams = ['date_from', 'date_to', 'area_ids', 'store_name']
    filterParams.forEach(param => {
      url.searchParams.delete(param)
    })
    
    // 新しいフィルタパラメータを追加
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v))
      } else if (value) {
        url.searchParams.set(key, value)
      }
    })
    
    // URLを更新（ページリロードなし）
    window.history.pushState({}, '', url)
  }

  updatePageContent(html) {
    // 部分テンプレートの内容でダッシュボードコンテンツを更新
    const dashboardContent = document.getElementById('dashboard-content')
    if (dashboardContent) {
      dashboardContent.innerHTML = html
    }
    
    // フィルタ適用後にフィルタ状態表示を表示
    const filters = this.collectFilters()
    if (Object.keys(filters).length > 0) {
      this.showFilterStatus(filters)
    }
  }


  showFilterStatus(filters) {
    // 既存のフィルタ状態表示を削除
    const existingFilterStatus = document.querySelector('.bg-blue-50')
    if (existingFilterStatus) {
      existingFilterStatus.remove()
    }
    
    // フィルタ状態表示を作成
    const filterStatusHTML = this.createFilterStatusHTML(filters)
    
    // KPIカードの前に挿入
    const kpiCards = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4')
    if (kpiCards) {
      kpiCards.insertAdjacentHTML('beforebegin', filterStatusHTML)
    }
  }

  createFilterStatusHTML(filters) {
    let statusHTML = `
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            <span class="text-sm font-medium text-blue-800">フィルタが適用されています</span>
          </div>
          <button type="button" class="text-sm text-blue-600 hover:text-blue-800 underline" onclick="window.location.href='/dashboard/index'">
            フィルタをクリア
          </button>
        </div>
        <div class="mt-2 text-sm text-blue-700">
    `
    
    // 各フィルタの状態を表示
    if (filters.date_from || filters.date_to) {
      statusHTML += `
        <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
          期間: ${filters.date_from || ''} 〜 ${filters.date_to || ''}
        </span>
      `
    }
    
    if (filters.area_ids && filters.area_ids.length > 0) {
      // 地区名を取得（簡易実装）
      const areaNames = filters.area_ids.map(id => `地区${id}`).join(', ')
      statusHTML += `
        <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
          地区: ${areaNames}
        </span>
      `
    }
    
    if (filters.store_name) {
      statusHTML += `
        <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
          店舗: ${filters.store_name}
        </span>
      `
    }
    
    statusHTML += `
        </div>
      </div>
    `
    
    return statusHTML
  }

  showLoading() {
    // ローディング状態を表示（簡単な実装）
    const button = document.querySelector('[data-action*="apply"]')
    if (button) {
      button.disabled = true
      button.textContent = '適用中...'
    }
  }

  hideLoading() {
    // ローディング状態を非表示
    const button = document.querySelector('[data-action*="apply"]')
    if (button) {
      button.disabled = false
      button.textContent = '適用'
    }
  }

  restoreFilters() {
    const urlParams = new URLSearchParams(window.location.search)
    
    // 日付フィールドを復元
    const dateFrom = urlParams.get('date_from')
    const dateTo = urlParams.get('date_to')
    
    if (dateFrom) {
      document.getElementById('date_from').value = dateFrom
    }
    
    if (dateTo) {
      document.getElementById('date_to').value = dateTo
    }
    
    // 地区選択を復元
    const areaIds = urlParams.getAll('area_ids')
    if (areaIds.length > 0) {
      const areaSelect = document.getElementById('area_ids')
      if (areaSelect) {
        Array.from(areaSelect.options).forEach(option => {
          option.selected = areaIds.includes(option.value)
        })
      }
    }
    
    // 店舗名を復元
    const storeName = urlParams.get('store_name')
    if (storeName) {
      document.getElementById('store_name').value = storeName
    }
  }

  // モーダル外をクリックしたら閉じる
  clickOutside(event) {
    if (event.target === this.modalTarget) {
      this.close()
    }
  }
}
