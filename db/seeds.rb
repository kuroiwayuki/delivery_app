# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# 横浜市18区のデータ
areas_data = [
  { name: "青葉区", slug: "aoba" },
  { name: "旭区", slug: "asahi" },
  { name: "泉区", slug: "izumi" },
  { name: "磯子区", slug: "isogo" },
  { name: "神奈川区", slug: "kanagawa" },
  { name: "金沢区", slug: "kanazawa" },
  { name: "港北区", slug: "kohoku" },
  { name: "港南区", slug: "konan" },
  { name: "栄区", slug: "sakae" },
  { name: "瀬谷区", slug: "seya" },
  { name: "都筑区", slug: "tsuzuki" },
  { name: "鶴見区", slug: "tsurumi" },
  { name: "戸塚区", slug: "totsuka" },
  { name: "中区", slug: "naka" },
  { name: "西区", slug: "nishi" },
  { name: "保土ケ谷区", slug: "hodogaya" },
  { name: "緑区", slug: "midori" },
  { name: "南区", slug: "minami" }
]

areas_data.each do |area_data|
  Area.find_or_create_by!(slug: area_data[:slug]) do |area|
    area.name = area_data[:name]
  end
end

puts "横浜市18区のデータを作成しました。"

# テストユーザーを作成
user = User.find_or_create_by!(email: "test@example.com") do |u|
  u.password = "password123"
  u.password_confirmation = "password123"
end

puts "テストユーザーを作成しました: #{user.email}"

# 店舗名のリスト
store_names = [
  "マクドナルド", "ケンタッキーフライドチキン", "ドミノピザ", "ピザハット", "すき家", "吉野家", "松屋",
  "ココイチ", "はま寿司", "くら寿司", "スシロー", "回転寿司 活", "海鮮丼 つじ半", "天下一品",
  "ラーメン横綱", "一風堂", "博多一幸舎", "ラーメン二郎", "つけ麺屋 やすべえ", "麺屋武蔵",
  "スターバックス", "タリーズコーヒー", "ドトールコーヒー", "コメダ珈琲店", "カフェ・ド・クリエ",
  "ファミリーマート", "セブンイレブン", "ローソン", "ミニストップ", "デイリーヤマザキ",
  "イオン", "イトーヨーカドー", "西友", "ライフ", "マツキヨ", "サンドラッグ", "ツルハドラッグ",
  "ユニクロ", "GU", "しまむら", "ワークマン", "コジマ", "ヤマダ電機", "ビックカメラ",
  "アマゾン", "楽天", "メルカリ", "ヤフオク", "ZOZOTOWN", "ユニクロ", "無印良品"
]

# 2000件の配達データを生成
puts "配達データを生成中..."

2000.times do |i|
  # ランダムな日時（過去1年間）
  delivered_at = rand(1.year.ago..Time.current)
  
  # ランダムな地区
  area = Area.all.sample
  
  # ランダムな店舗名
  store_name = store_names.sample
  
  # ランダムな料金（300円〜3000円）
  price_yen = rand(300..3000)
  
  # ランダムな配達時間（10分〜60分）
  duration_min = rand(10..60)
  
  # ランダムなメモ（50%の確率でメモあり）
  memo = if rand < 0.5
    [
      "お客様不在のため再配達", "玄関先に置き配", "インターホンで対応", "電話で確認済み",
      "雨の日でした", "暑い日でした", "寒い日でした", "混雑していました", "空いていました",
      "お客様が優しかった", "道に迷いました", "早めに到着", "遅延しました", "スムーズでした"
    ].sample
  end
  
  delivery = Delivery.create!(
    user: user,
    area: area,
    store_name: store_name,
    delivered_at: delivered_at,
    price_yen: price_yen,
    duration_min: duration_min,
    memo: memo
  )
  
  # 進捗表示（100件ごと）
  if (i + 1) % 100 == 0
    puts "#{i + 1}件作成完了"
  end
end

puts "2000件の配達データを作成しました！"
puts "総売上: ¥#{Delivery.sum(:price_yen).to_s.reverse.gsub(/(\d{3})(?=.)/, '\1,').reverse}"
puts "平均単価: ¥#{Delivery.average(:price_yen).to_i.to_s.reverse.gsub(/(\d{3})(?=.)/, '\1,').reverse}"
puts "平均配達時間: #{Delivery.average(:duration_min).to_i}分"
