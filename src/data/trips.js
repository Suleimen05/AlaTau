export const trips = [
  {
    id: 1,
    routeTitle: "Большое Алматинское озеро",
    date: "28 февраля 2026",
    status: "confirmed",
    guide: "Айгерим Турсын",
    services: ["Гид", "Трансфер"],
    totalPrice: 23000,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"
  },
  {
    id: 2,
    routeTitle: "Пик Фурманова",
    date: "15 марта 2026",
    status: "pending",
    guide: "Нурлан Серкебаев",
    services: ["Гид", "Снаряжение"],
    totalPrice: 35000,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
  },
  {
    id: 3,
    routeTitle: "Ущелье Чарын",
    date: "10 января 2026",
    status: "completed",
    guide: "Дана Оспанова",
    services: ["Гид", "Трансфер", "Жильё"],
    totalPrice: 28000,
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&q=80"
  }
]

export const statusLabels = {
  confirmed: "Подтверждено",
  pending: "Ожидает",
  completed: "Завершено"
}
