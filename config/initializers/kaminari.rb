# frozen_string_literal: true

Kaminari.configure do |config|
  # 1ページあたりのデフォルト件数
  config.default_per_page = 25
  
  # 最大件数
  config.max_per_page = 100
  
  # ウィンドウサイズ（現在のページの前後に表示するページ数）
  config.window = 4
  
  # 外側のページ数（最初と最後に表示するページ数）
  config.outer_window = 0
  
  # 左側の外側のページ数
  config.left = 0
  
  # 右側の外側のページ数
  config.right = 0
  
  # ページネーションのテーマ
  config.page_method_name = :page
  config.param_name = :page
end
