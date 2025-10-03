import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["areaDeliveryChart", "areaPriceChart"]
  static values = { update: Boolean }

  connect() {
    // 重複初期化の回避
    if (window.chartsInitialized && !this.updateValue) {
      return
    }

    this.initialized = true
    window.chartsInitialized = true
    this.retryCount = 0
    this.maxRetries = 20
    this.initializeChartsWithDelay()
  }

  disconnect() {
    this.destroyCharts()
    this.initialized = false
    window.chartsInitialized = false
    this.retryCount = 0
  }

  initializeChartsWithDelay() {
    if (typeof Chart === 'undefined') {
      this.retryCount++
      if (this.retryCount < this.maxRetries) {
        setTimeout(() => {
          this.initializeChartsWithDelay()
        }, 100)
      } else {
        console.warn('Chart.js failed to load after maximum retries')
      }
    } else {
      this.initializeCharts()
    }
  }

  initializeCharts() {
    // 既存チャートを破棄してから描画
    this.destroyCharts()

    if (this.hasAreaDeliveryChartTarget) {
      this.createAreaDeliveryChart()
    }

    if (this.hasAreaPriceChartTarget) {
      this.createAreaPriceChart()
    }
  }

  destroyCharts() {
    if (this.areaDeliveryChart) {
      this.areaDeliveryChart.destroy()
      this.areaDeliveryChart = null
    }
    if (this.areaPriceChart) {
      this.areaPriceChart.destroy()
      this.areaPriceChart = null
    }
  }

  createAreaDeliveryChart() {
    const ctx = this.areaDeliveryChartTarget
    if (!ctx) {
      return
    }

    const data = JSON.parse(ctx.dataset.chartData || '{}')

    if (Object.keys(data).length === 0) {
      this.areaDeliveryChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['データなし'],
          datasets: [{
            label: '配達件数',
            data: [0],
            backgroundColor: 'rgba(200, 200, 200, 0.8)',
            borderColor: 'rgba(200, 200, 200, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          animation: { duration: 0 },
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }
      })
      return
    }

    this.areaDeliveryChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: '配達件数',
          data: Object.values(data),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(34, 197, 94, 0.8)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(6, 182, 212, 1)',
            'rgba(34, 197, 94, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        animation: {
          duration: 0,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) label += context.parsed.y.toLocaleString();
                return label;
              }
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#6B7280' } },
          y: { beginAtZero: true, ticks: { precision: 0, color: '#6B7280' }, grid: { color: 'rgba(200, 200, 200, 0.2)' } }
        }
      }
    })
  }

  createAreaPriceChart() {
    const ctx = this.areaPriceChartTarget
    if (!ctx) {
      return
    }

    const data = JSON.parse(ctx.dataset.chartData || '{}')

    if (Object.keys(data).length === 0) {
      this.areaPriceChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['データなし'],
          datasets: [{
            label: '平均単価 (円)',
            data: [0],
            backgroundColor: 'rgba(200, 200, 200, 0.8)',
            borderColor: 'rgba(200, 200, 200, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          animation: { duration: 0 },
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { callback: function(value) { return '¥' + value.toLocaleString() } } } }
        }
      })
      return
    }

    this.areaPriceChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: '平均単価 (円)',
          data: Object.values(data),
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(34, 197, 94, 0.8)'
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(6, 182, 212, 1)',
            'rgba(34, 197, 94, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        animation: {
          duration: 0,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) label += '¥' + context.parsed.y.toLocaleString();
                return label;
              }
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#6B7280' } },
          y: { beginAtZero: true, ticks: { callback: function(value) { return '¥' + value.toLocaleString() }, color: '#6B7280' }, grid: { color: 'rgba(200, 200, 200, 0.2)' } }
        }
      }
    })
  }
}