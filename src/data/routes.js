export const routes = [
  {
    id: 1,
    title: "Пик Фурманова",
    description: "Классический маршрут с потрясающими видами на Большое Алматинское озеро",
    difficulty: "medium",
    duration: "6-8 часов",
    distance: "14 км",
    elevation: "3050 м",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    services: { guides: 3, equipment: 2 }
  },
  {
    id: 2,
    title: "Большое Алматинское озеро",
    description: "Живописное высокогорное озеро в окружении величественных пиков",
    difficulty: "easy",
    duration: "4-5 часов",
    distance: "10 км",
    elevation: "2500 м",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    services: { guides: 5, equipment: 3 }
  },
  {
    id: 3,
    title: "Пик Талгар",
    description: "Самая высокая точка Заилийского Алатау для опытных альпинистов",
    difficulty: "hard",
    duration: "2-3 дня",
    distance: "25 км",
    elevation: "4973 м",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
    services: { guides: 2, equipment: 4 }
  },
  {
    id: 4,
    title: "Ущелье Чарын",
    description: "Мини-Гранд-Каньон Казахстана с уникальными скальными образованиями",
    difficulty: "easy",
    duration: "3-4 часа",
    distance: "5 км",
    elevation: "1200 м",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
    services: { guides: 4, equipment: 1 }
  },
  {
    id: 5,
    title: "Кольсайские озера",
    description: "Три живописных горных озера в сосновом лесу",
    difficulty: "easy",
    duration: "5-6 часов",
    distance: "12 км",
    elevation: "1800 м",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    services: { guides: 3, equipment: 2 }
  }
]

export const difficultyLabels = {
  easy: "Лёгкий",
  medium: "Средний",
  hard: "Сложный"
}
