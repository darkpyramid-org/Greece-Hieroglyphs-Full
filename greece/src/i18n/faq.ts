export const faq = {
  en: {
    pageTitle: "FREQUENTLY ASKED",
    pageTitleGold: "QUESTIONS",
    categories: [
      {
        category: "ORDERS & PAYMENTS",
        items: [
          { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards (Visa, Mastercard), PayPal, Fawry, and cash on delivery within Egypt." },
          { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 2 hours of placement. Contact us immediately at support@greece.com." },
          { q: "Is my payment information secure?", a: "All payments are processed by Stripe. We never store your card details." },
        ],
      },
      {
        category: "SHIPPING & DELIVERY",
        items: [
          { q: "How long does delivery take within Egypt?", a: "Standard delivery within Cairo/Giza takes 2–3 business days. Other governorates take 4–6 business days." },
          { q: "Do you ship internationally?", a: "Yes, we ship to Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, and Jordan. International orders take 7–14 business days." },
          { q: "How much does shipping cost?", a: "Free shipping on orders above EGP 1,500 within Egypt. Standard shipping costs EGP 50–80 depending on governorate." },
        ],
      },
      {
        category: "RETURNS & EXCHANGES",
        items: [
          { q: "What is your return policy?", a: "We accept returns within 14 days of delivery for unworn, unwashed items with original tags attached." },
          { q: "How do I initiate a return?", a: "Email returns@greece-hieroglyphs.com with your order ID and reason for return. We'll guide you through the process." },
          { q: "Do you offer exchanges?", a: "Yes! We exchange for different sizes or colors within 14 days. Availability depends on current stock." },
        ],
      },
    ],
  },
  ar: {
    pageTitle: "الأسئلة",
    pageTitleGold: "الشائعة",
    categories: [
      {
        category: "الطلبات والدفع",
        items: [
          { q: "ما طرق الدفع المتاحة؟", a: "نقبل جميع بطاقات الائتمان/الخصم الرئيسية (فيزا، ماستركارد)، PayPal، فوري، والدفع عند الاستلام داخل مصر." },
          { q: "هل يمكنني تغيير أو إلغاء طلبي؟", a: "يمكن تعديل أو إلغاء الطلبات خلال ساعتين من تقديمها. تواصل معنا فوراً على support@greece.com" },
          { q: "هل معلومات الدفع الخاصة بي آمنة؟", a: "جميع المدفوعات تعالج عبر Stripe. لا نحتفظ ببيانات بطاقتك أبداً." },
        ],
      },
      {
        category: "الشحن والتوصيل",
        items: [
          { q: "كم يستغرق التوصيل داخل مصر؟", a: "التوصيل المعياري داخل القاهرة/الجيزة يستغرق 2–3 أيام عمل. المحافظات الأخرى 4–6 أيام عمل." },
          { q: "هل تشحنون للخارج؟", a: "نعم، نشحن للسعودية والإمارات والكويت وقطر والبحرين والأردن. الطلبات الدولية تستغرق 7–14 يوم عمل." },
          { q: "كم تكلفة الشحن؟", a: "شحن مجاني للطلبات فوق 1,500 جنيه داخل مصر. تكلفة الشحن المعياري 50–80 جنيهاً حسب المحافظة." },
        ],
      },
      {
        category: "الإرجاع والاستبدال",
        items: [
          { q: "ما سياسة الإرجاع لديكم؟", a: "نقبل الإرجاع خلال 14 يوماً من التسليم للمنتجات غير المستخدمة مع الملصقات الأصلية." },
          { q: "كيف أبدأ عملية الإرجاع؟", a: "راسلنا على returns@greece.com برقم طلبك وسبب الإرجاع وسنرشدك خلال العملية." },
          { q: "هل تقدمون استبدالاً؟", a: "نعم! نستبدل بمقاسات أو ألوان مختلفة خلال 14 يوماً حسب المخزون المتاح." },
        ],
      },
    ],
  },
} as const;
