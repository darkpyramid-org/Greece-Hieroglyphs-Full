export const nav = {
  en: {
    collection: "COLLECTION",
    story: "STORY",
    culture: "CULTURE",
    contact: "CONTACT",
    notif: {
      title: "Notifications",
      markAll: "Mark all read",
      items: [
        { title: "New Drop!", msg: "ANKH TEE restocked — limited units", time: "2h ago" },
        { title: "Order Shipped", msg: "Order #OHN-1734 is on the way", time: "1d ago" },
        { title: "Flash Sale", msg: "20% off all Hoodies this weekend", time: "3d ago" },
      ],
    },
  },
  ar: {
    collection: "المجموعة",
    story: "قصتنا",
    culture: "الثقافة",
    contact: "تواصل",
    notif: {
      title: "الإشعارات",
      markAll: "تعيين الكل كمقروء",
      items: [
        { title: "وصول جديد!", msg: "تيشيرت ANKH عاد — كميات محدودة", time: "منذ ساعتين" },
        { title: "تم الشحن", msg: "طلبك #OHN-1734 في الطريق إليك", time: "منذ يوم" },
        { title: "تخفيضات سريعة", msg: "خصم 20% على الهوديز نهاية الأسبوع", time: "منذ 3 أيام" },
      ],
    },
  },
} as const;
