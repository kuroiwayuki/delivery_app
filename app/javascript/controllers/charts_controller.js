import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["areaDeliveryChart", "areaPriceChart"]

  connect() {
    console.log('ChartsController connected!')
    console.log('Chart.js available:', typeof Chart !== 'undefined')
    
    // 既に初期化済みの場合はスキップ
    if (this.initialized) {
      console.log('Charts already initialized, skipping...')
      return
    }

    this.initialized = true
    this.initializeChartsWithDelay()
  }

  disconnect() {
    console.log('ChartsController disconnected!')
    this.destroyCharts()
    this.initialized = false
  }

  initializeChartsWithDelay() {
    // Chart.jsの読み込みを待つ
    if (typeof Chart === 'undefined') {
      console.log('Waiting for Chart.js to load...')
      setTimeout(() => {
        this.initializeChartsWithDelay()
      }, 100)
    } else {
      console.log('Chart.js is now available!')
      setTimeout(() => {
        this.initializeCharts()
      }, 100)
    }
  }

  initializeCharts() {
    console.log('Initializing charts...')
    
    // 既存のチャートを破棄
    this.destroyCharts()

    // Area Delivery Count Chart
    if (this.hasAreaDeliveryChartTarget) {
      this.createAreaDeliveryChart()
    }

    // Area Average Price Chart
    if (this.hasAreaPriceChartTarget) {
      this.createAreaPriceChart()
    }
  }

  destroyCharts() {
    console.log('Destroying existing charts...')
    if (window.areaDeliveryChart) {
      window.areaDeliveryChart.destroy()
      window.areaDeliveryChart = null
    }
    if (window.areaPriceChart) {
      window.areaPriceChart.destroy()
      window.areaPriceChart = null
    }
  }

  createAreaDeliveryChart() {
    const ctx = this.areaDeliveryChartTarget
    if (!ctx) {
      console.log('Area delivery chart canvas not found')
      return
    }

    console.log('Creating area delivery chart...')
    const data = JSON.parse(ctx.dataset.chartData || '{}')
    console.log('Chart data:', data)

    if (Object.keys(data).length === 0) {
      console.log('No data available for area delivery chart - showing empty chart')
      // 空のチャートを表示
      window.areaDeliveryChart = new Chart(ctx, {
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

    window.areaDeliveryChart = new Chart(ctx, {
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
          duration: 800,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toLocaleString();
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              color: '#6B7280'
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.2)'
            }
          }
        }
      }
    })
  }

  createAreaPriceChart() {
    const ctx = this.areaPriceChartTarget
    if (!ctx) {
      console.log('Area price chart canvas not found')
      return
    }

    console.log('Creating area price chart...')
    const data = JSON.parse(ctx.dataset.chartData || '{}')
    console.log('Chart data:', data)

    if (Object.keys(data).length === 0) {
      console.log('No data available for area price chart - showing empty chart')
      // 空のチャートを表示
      window.areaPriceChart = new Chart(ctx, {
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

    window.areaPriceChart = new Chart(ctx, {
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
          duration: 800,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += '¥' + context.parsed.y.toLocaleString();
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '¥' + value.toLocaleString();
              },
              color: '#6B7280'
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.2)'
            }
          }
        }
      }
    })
  }
}
