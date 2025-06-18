import { Language } from '@/stores/plantStore'

// 翻訳辞書の型定義
interface TranslationDict {
  [key: string]: {
    ja: string
    en: string
  }
}

// 翻訳辞書
export const translations: TranslationDict = {
  // 共通
  'settings': { ja: '設定', en: 'Settings' },
  'close': { ja: '閉じる', en: 'Close' },
  'save': { ja: '保存', en: 'Save' },
  'cancel': { ja: 'キャンセル', en: 'Cancel' },
  'delete': { ja: '削除', en: 'Delete' },
  'confirm': { ja: '確認', en: 'Confirm' },
  'yes': { ja: 'はい', en: 'Yes' },
  'no': { ja: 'いいえ', en: 'No' },
  
  // 時間帯の挨拶
  'greeting.morning.main': { ja: 'おはようございます、あなた！', en: 'Good morning!' },
  'greeting.morning.sub': { ja: '新しい一日の始まり。植物たちも朝の光を待っています ☀️', en: 'A new day begins. Your plants are waiting for the morning light ☀️' },
  'greeting.afternoon.main': { ja: 'こんにちは、あなた！', en: 'Good afternoon!' },
  'greeting.afternoon.sub': { ja: 'お疲れさまです。植物たちとの時間で心をリフレッシュしませんか？ 🌿', en: 'Hope you\'re having a great day. Time to refresh with your plants? 🌿' },
  'greeting.evening.main': { ja: 'お疲れさまでした、あなた', en: 'Good evening!' },
  'greeting.evening.sub': { ja: '一日の終わりに、植物たちと穏やかな時間を過ごしましょう 🌅', en: 'Let\'s spend some peaceful time with your plants at the end of the day 🌅' },
  'greeting.night.main': { ja: 'こんばんは、あなた', en: 'Good night!' },
  'greeting.night.sub': { ja: '静かな夜に、植物たちの成長を見守る特別な時間です 🌙', en: 'A special quiet time to watch your plants grow 🌙' },
  
  // メインタイトル・サブタイトル
  'subtitle': { ja: 'デジタルの庭で、あなただけの植物を育てましょう', en: 'Grow your own plants in a digital garden' },
  'description': { ja: '水やりと日光管理で植物を育て、癒やしの時間を楽しめます', en: 'Water, give sunlight and enjoy a relaxing plant-care journey' },
  'start.button': { ja: '植物を育て始める', en: 'Start Growing Plants' },
  'add.plant': { ja: '新しい植物を追加', en: 'Add New Plant' },
  
  // 植物の状態
  'health': { ja: '元気', en: 'Health' },
  'love': { ja: '愛情度', en: 'Love Level' },
  'growth.stage': { ja: '成長段階', en: 'Growth Stage' },
  
  // 成長段階
  'growth.seed': { ja: '種', en: 'Seed' },
  'growth.sprout': { ja: '新芽', en: 'Sprout' },
  'growth.small_leaves': { ja: '若葉', en: 'Small Leaves' },
  'growth.large_leaves': { ja: '青葉', en: 'Large Leaves' },
  'growth.flower': { ja: '開花', en: 'Flower' },
  
  // 成長段階の詩的表現
  'poetry.seed': { ja: '小さな希望を宿した種', en: 'A seed holding small hopes' },
  'poetry.sprout': { ja: '命あふれる新芽', en: 'A sprout full of life' },
  'poetry.small_leaves': { ja: '若葉色の歌声', en: 'The song of young green leaves' },
  'poetry.large_leaves': { ja: '深緑の豊かな歌声', en: 'The rich song of deep green' },
  'poetry.flower': { ja: '花ひらく生命の詩', en: 'A poem of life in bloom' },
  
  // ケアアクション
  'care.water': { ja: '水やり', en: 'Water' },
  'care.sunlight': { ja: '日光浴', en: 'Sunlight' },
  'care.talk': { ja: '話しかける', en: 'Talk' },
  'care.needed': { ja: 'が必要！', en: ' needed!' },
  
  // ケア状態メッセージ
  'water.thirsty': { ja: 'のどがからからです', en: 'Very thirsty!' },
  'water.wants': { ja: 'そろそろお水が欲しいかも', en: 'Could use some water soon' },
  'sun.misses': { ja: 'お日様が恋しそう', en: 'Missing the sunlight' },
  'sun.wants': { ja: '光を浴びたそう', en: 'Wants some light' },
  'talk.lonely': { ja: 'とても寂しそう', en: 'Feeling very lonely' },
  'talk.wants': { ja: '話を聞いて欲しそう', en: 'Wants someone to talk to' },
  'care.happy': { ja: '元気に過ごしています', en: 'Doing great!' },
  
  // 感情メッセージ
  'emotion.very_happy': { ja: 'あなたの愛情に包まれて、今日もすくすくと育っています', en: 'Growing happily surrounded by your love today' },
  'emotion.happy': { ja: '心地よい日差しを感じています。ありがとう', en: 'Feeling the pleasant sunlight. Thank you' },
  'emotion.worried': { ja: 'もう少し優しさをください...', en: 'Could use a little more care...' },
  'emotion.calm': { ja: 'そばにいてくれるだけで嬉しいです', en: 'Happy just to have you nearby' },
  'emotion.resting': { ja: '静かに回復の時を待っています', en: 'Quietly waiting for recovery time' },
  
  // 植物タイプ選択
  'select.plant.title': { ja: '育てたい植物を選んでください', en: 'Choose a plant to grow' },
  'select.plant.subtitle': { ja: 'それぞれ異なる特徴と個性を持っています', en: 'Each has different characteristics and personality' },
  'characteristics': { ja: '特徴', en: 'Characteristics' },
  'growth.speed': { ja: '成長速度', en: 'Growth Speed' },
  'growth.speed.slow': { ja: 'ゆっくり', en: 'Slow' },
  'growth.speed.medium': { ja: '普通', en: 'Medium' },
  'growth.speed.fast': { ja: '早い', en: 'Fast' },
  'care.requirements': { ja: 'お世話のポイント', en: 'Care Requirements' },
  'water.frequency': { ja: '水やり頻度', en: 'Watering' },
  'sun.requirement': { ja: '必要な日光', en: 'Sunlight' },
  'talk.bonus': { ja: '話しかけ効果', en: 'Talk Bonus' },
  'select.this.plant': { ja: 'この植物を選ぶ', en: 'Select This Plant' },
  
  // 植物の特徴
  'char.beginner': { ja: '初心者向け', en: 'Beginner-friendly' },
  'char.drought_resistant': { ja: '乾燥に強い', en: 'Drought resistant' },
  'char.easy_care': { ja: '手入れが簡単', en: 'Easy care' },
  'char.vertical_growth': { ja: '縦成長', en: 'Vertical growth' },
  'char.space_saving': { ja: '場所を取らない', en: 'Space-saving' },
  'char.air_purifying': { ja: '空気清浄', en: 'Air purifying' },
  'char.round_leaves': { ja: '丸い葉', en: 'Round leaves' },
  'char.presence': { ja: '存在感', en: 'Strong presence' },
  'char.fast_growth': { ja: '成長が早い', en: 'Fast growing' },
  'char.shade_tolerant': { ja: '耐陰性', en: 'Shade tolerant' },
  'char.low_maintenance': { ja: '手間いらず', en: 'Low maintenance' },
  'char.tropical': { ja: '南国風', en: 'Tropical style' },
  'char.heart_shaped': { ja: 'ハート型葉', en: 'Heart-shaped leaves' },
  'char.lucky': { ja: '幸運の象徴', en: 'Symbol of luck' },
  'char.unique': { ja: '個性的', en: 'Unique' },
  
  // 設定項目
  'settings.notifications': { ja: '通知設定', en: 'Notifications' },
  'settings.theme': { ja: 'テーマ設定', en: 'Theme' },
  'settings.language': { ja: '言語設定', en: 'Language' },
  'settings.volume': { ja: 'サウンド (BGM / 効果音)', en: 'Sound (BGM / SFX)' },
  'settings.data_export': { ja: 'データエクスポート', en: 'Data Export' },
  
  'notification.care_reminders': { ja: '植物のケア時間をお知らせ', en: 'Plant care reminders' },
  'theme.auto': { ja: '自動', en: 'Auto' },
  'theme.light': { ja: 'ライト', en: 'Light' },
  'theme.dark': { ja: 'ダーク', en: 'Dark' },
  
  'export.description': { ja: '植物のデータと設定をバックアップファイルとしてダウンロードできます', en: 'Download your plant data and settings as a backup file' },
  'export.button': { ja: 'データをエクスポート', en: 'Export Data' },
  'export.plants_count': { ja: '匹の植物', en: 'plants' },
  
  'app.version': { ja: 'Version 1.0.0 - 植物との特別な時間をお楽しみください', en: 'Version 1.0.0 - Enjoy your special time with plants' },
  
  // 追加のUI要素
  'empty.garden.title': { ja: 'あなたの庭は空っぽです', en: 'Your garden is empty' },
  'empty.garden.subtitle': { ja: '特別な成長の物語を始めませんか？', en: 'Ready to start growing?' },
  'plants.waiting': { ja: '匹の植物たちが、あなたを待っています', en: 'plants are waiting for you' },
  'urgent.care': { ja: 'が緊急ケア待ち', en: 'needs urgent care' },
  
  // 植物名
  'plant.pachira': { ja: 'パキラ', en: 'Pachira' },
  'plant.sansevieria': { ja: 'サンスベリア', en: 'Sansevieria' },
  'plant.rubber_tree': { ja: 'ゴムの木', en: 'Rubber Tree' },
  'plant.kentia_palm': { ja: 'ケンチャヤシ', en: 'Kentia Palm' },
  'plant.monstera': { ja: 'モンステラ', en: 'Monstera' },
  
  // 削除確認
  'delete.title': { ja: 'とのお別れ', en: 'Farewell' },
  'delete.message': { ja: '本当にお別れしますか？一緒に過ごした思い出は永遠に失われてしまいます...', en: 'Are you sure you want to say goodbye? The memories you\'ve shared will be lost forever...' },
  'delete.confirm': { ja: 'お別れする', en: 'Say Goodbye' },
  'delete.cancel': { ja: 'もう少し一緒にいる', en: 'Stay Together' },
  
  // 水やり頻度
  'water.every_days': { ja: '日に1回', en: ' days' },
  'water.every': { ja: '', en: 'every ' },
  'water.daily': { ja: '毎日', en: 'daily' },
  'sun.hours': { ja: '時間', en: 'hours' },
  'talk.effective': { ja: '効果的', en: 'effective' },
  'talk.not_much': { ja: 'あまり効果なし', en: 'not much effect' },
  'water.interval': { ja: '{num}日ごと', en: 'every {num} days' },
  
  // ASCII Art説明
  'art.seed_state': { ja: '種の状態', en: 'Seed state' },
  'art.sprouting': { ja: '発芽', en: 'Sprouting' },
  'art.small_leaves': { ja: '小さな葉', en: 'Small leaves' },
  'art.growing': { ja: '成長中', en: 'Growing' },
  'art.vertical_growth': { ja: '縦に成長中', en: 'Growing vertically' },
  'art.one_trunk_pachira': { ja: '一本立ちパキラ', en: 'Single-trunk Pachira' },
  'art.sansevieria': { ja: 'サンスベリア', en: 'Sansevieria' },
  'art.magnificent_sansevieria': { ja: '立派なサンスベリア', en: 'Magnificent Sansevieria' },
  'art.unknown_plant': { ja: '不明な植物', en: 'Unknown plant' },
}

// 翻訳関数
export const t = (key: string, language: Language): string => {
  const translation = translations[key]
  if (!translation) {
    console.warn(`Translation key "${key}" not found`)
    return key
  }
  return translation[language]
}

// パラメータ付き翻訳関数（{placeholder}を置換）
export const tp = (key: string, language: Language, params: Record<string, string | number>): string => {
  let text = t(key, language)
  Object.entries(params).forEach(([param, value]) => {
    text = text.replace(`{${param}}`, String(value))
  })
  return text
} 