
export const translations = {
  ua: {
    header: { subtitle: "Соціальний асистент", online: "В мережі" },
    nav: { home: "Головна", explore: "Локації", groups: "Групи", profile: "Профіль" },
    onboarding: {
      findingTribe: "Шукаємо вашу компанію...",
      aiAnalyzing: "ШІ аналізує вашу соціальну ДНК, щоб знайти ідеальні співпадіння.",
      stepInfo: "Питання {step}",
      placeholder: "Напишіть відповідь...",
      next: "Далі",
      complete: "Завершити",
      beYourself: "Просто будьте собою. Ми шукаємо живих людей.",
      intro: "Привіт! Я твій координатор Meet.ai. Давай познайомимося ближче, щоб я міг підібрати тобі ідеальну компанію для офлайн-зустрічі."
    },
    dashboard: {
      myArchetype: "Ваш соціальний профіль",
      archetypeDesc: "Аналіз завершено. Ми готові підібрати групу за вашим темпом та форматом.",
      upcoming: "Пропозиція зустрічі",
      enterChat: "Обговорити деталі",
      noMeetings: "Пошук групи",
      noMeetingsDesc: "Я перевіряю сумісність учасників поблизу. Повернуся з конкретною пропозицією.",
      boost: "Активувати пріоритет",
      benefits: "Чому Meet.ai?",
      socialFactor: "Спільнота",
      attendance: "Якісні зустрічі",
      safety: "Безпека",
      verified: "Верифіковані учасники",
      distance: "{d} км від вас",
      eta: "~ {t} хв",
      locPermission: "Потрібна локація для розрахунку шляху"
    },
    chat: {
      moderating: "ШІ-координатор на зв'язку",
      callTaxi: "Викликати таксі",
      splitBill: "Бюджет",
      suggestTime: "Час",
      placeholder: "Напишіть...",
      aiThinking: "Координатор думає...",
      getRoute: "Маршрут",
      payWithGPay: "Оплатити через GPay",
      poolStatus: "Зібрано: {c} з {t} ₴",
      checkingAvailability: "Перевіряю вільні столики в {v}...",
      tableReady: "Стіл заброньовано! Ось ваш QR-код на знижку 15%:",
      taxiPrompt: "Зустріч підтверджено на {t}. Бажаєте викликати таксі прямо зараз?",
      rollCall: "Привіт, {u}! Наша група: {m}. {s}",
      searchingMore: "Ще шукаю +1 для повного складу...",
      allSet: "Всі в зборі!"
    },
    explore: {
      title: "Локації-партнери",
      desc: "Перевірені місця з оптимальною атмосферою для груп.",
      meetupsHeld: "зустрічей",
      viewAvailability: "Наявність місць",
      optimal: "ШІ вибрав це місце як найзручніше для всіх учасників"
    },
    archetypes: {
      Party: "Тусовочний",
      Active: "Активний",
      Conscious: "Усвідомлений",
      Creative: "Творчий",
      Business: "Діловий",
      "Pending...": "Обробка..."
    }
  },
  en: {
    header: { subtitle: "Social Assistant", online: "Online" },
    nav: { home: "Home", explore: "Explore", groups: "Groups", profile: "Profile" },
    onboarding: {
      findingTribe: "Finding your tribe...",
      aiAnalyzing: "AI is analyzing your social DNA to find perfect matches.",
      stepInfo: "Step {step}",
      placeholder: "Type your answer...",
      next: "Next",
      complete: "Complete",
      beYourself: "Just be yourself. We're looking for real people.",
      intro: "Hi! I'm your Meet.ai coordinator. Let's get to know each other so I can find the perfect company for an offline meetup."
    },
    dashboard: {
      myArchetype: "Your Social Profile",
      archetypeDesc: "Analysis complete. We're ready to match a group by your pace and format.",
      upcoming: "Meetup Proposal",
      enterChat: "Discuss Details",
      noMeetings: "Finding Group",
      noMeetingsDesc: "I'm checking compatibility of nearby participants. I'll be back with a proposal.",
      boost: "Activate Priority",
      benefits: "Why Meet.ai?",
      socialFactor: "Community",
      attendance: "Quality Meetings",
      safety: "Safety",
      verified: "Verified Members",
      distance: "{d} km away",
      eta: "~ {t} min",
      locPermission: "Location needed for routing"
    },
    chat: {
      moderating: "AI COORDINATOR ACTIVE",
      callTaxi: "Call Taxi",
      splitBill: "Budget",
      suggestTime: "Time",
      placeholder: "Type...",
      aiThinking: "Coordinator is thinking...",
      getRoute: "Route",
      payWithGPay: "Pay with GPay",
      poolStatus: "Collected: {c} of {t} $",
      checkingAvailability: "Checking table availability at {v}...",
      tableReady: "Table reserved! Here is your 15% discount QR code:",
      taxiPrompt: "Meeting confirmed for {t}. Would you like to call a taxi now?",
      rollCall: "Hi {u}! Our group: {m}. {s}",
      searchingMore: "Still looking for +1 to fill the group...",
      allSet: "Everyone is here!"
    },
    explore: {
      title: "Partner Venues",
      desc: "Vetted spots with the optimal atmosphere for groups.",
      meetupsHeld: "meetups",
      viewAvailability: "Check Availability",
      optimal: "AI selected this spot as the most convenient for everyone"
    },
    archetypes: {
      Party: "Party",
      Active: "Active",
      Conscious: "Conscious",
      Creative: "Creative",
      Business: "Business",
      "Pending...": "Pending..."
    }
  }
};

export type Language = 'ua' | 'en';
