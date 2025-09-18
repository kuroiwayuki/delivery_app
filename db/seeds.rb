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
  { name: "港南区", slug: "konan" },駅
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
