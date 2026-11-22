export const categories = [
    {
        id: 'emergency',
        name: 'Emergency',
        phrases: [
            {
                id: 'phrase_001',
                translations: {
                    english: 'I need an ambulance.',
                    es: 'Necesito una ambulancia.',
                    fr: "J'ai besoin d'une ambulance.",
                    ur: 'مجھے ایمبولینس کی ضرورت ہے۔',
                    zh: '我需要救护车。',
                    pa: 'ਮੈਨੂੰ ਐਂਬੂਲੈਂਸ ਦੀ ਲੋੜ ਹੈ।',
                },
            },
            {
                id: 'phrase_002',
                translations: {
                    english: 'Call the police.',
                    es: 'Llame a la policía.',
                    fr: 'Appelez la police.',
                    ur: 'پولیس کو فون کریں۔',
                    zh: '请报警。',
                    pa: 'ਪੁਲਿਸ ਨੂੰ ਫ਼ੋਨ ਕਰੋ।',
                },
            },
            {
                id: 'phrase_003',
                translations: {
                    english: 'I need a doctor.',
                    es: 'Necesito un médico.',
                    fr: "J'ai besoin d'un médecin.",
                    ur: 'مجھے ڈاکٹر کی ضرورت ہے۔',
                    zh: '我需要医生。',
                    pa: 'ਮੈਨੂੰ ਡਾਕਟਰ ਦੀ ਲੋੜ ਹੈ।',
                },
            },
            {
                id: 'phrase_004',
                translations: {
                    english: 'I am lost.',
                    es: 'Estoy perdido/a.',
                    fr: 'Je suis perdu(e).',
                    ur: 'میں راستہ بھول گیا/گئی ہوں۔',
                    zh: '我迷路了。',
                    pa: 'ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।',
                },
                // Audio uses the masculine form; the card still shows both.
                spoken: {
                    es: 'Estoy perdido.',
                    fr: 'Je suis perdu.',
                    ur: 'میں راستہ بھول گیا ہوں۔',
                    pa: 'ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ ਹਾਂ।',
                },
            },
            {
                id: 'phrase_005',
                translations: {
                    english: 'Please help me.',
                    es: 'Por favor, ayúdeme.',
                    fr: "Aidez-moi, s'il vous plaît.",
                    ur: 'براہ کرم میری مدد کریں۔',
                    zh: '请帮帮我。',
                    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰੋ।',
                },
            },
            {
                id: 'phrase_006',
                translations: {
                    english: 'Where is the nearest hospital?',
                    es: '¿Dónde está el hospital más cercano?',
                    fr: "Où se trouve l'hôpital le plus proche ?",
                    ur: 'سب سے قریبی ہسپتال کہاں ہے؟',
                    zh: '最近的医院在哪里？',
                    pa: 'ਸਭ ਤੋਂ ਨੇੜਲਾ ਹਸਪਤਾਲ ਕਿੱਥੇ ਹੈ?',
                },
            },
        ],
    },
    {
        id: 'greetings',
        name: 'Greetings',
        phrases: [
            {
                id: 'phrase_001',
                translations: {
                    english: 'Hello',
                    es: 'Hola',
                    fr: 'Bonjour',
                    ur: 'السلام علیکم',
                    zh: '你好',
                    pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
                },
            },
            {
                id: 'phrase_002',
                translations: {
                    english: 'Good morning.',
                    es: 'Buenos días.',
                    fr: 'Bonjour.',
                    ur: 'صبح بخیر۔',
                    zh: '早上好。',
                    pa: 'ਸ਼ੁਭ ਸਵੇਰ।',
                },
            },
            {
                id: 'phrase_003',
                translations: {
                    english: 'Good evening.',
                    es: 'Buenas noches.',
                    fr: 'Bonsoir.',
                    ur: 'شام بخیر۔',
                    zh: '晚上好。',
                    pa: 'ਸ਼ੁਭ ਸ਼ਾਮ।',
                },
            },
            {
                id: 'phrase_004',
                translations: {
                    english: 'Thank you.',
                    es: 'Gracias.',
                    fr: 'Merci.',
                    ur: 'شکریہ۔',
                    zh: '谢谢。',
                    pa: 'ਧੰਨਵਾਦ।',
                },
            },
            {
                id: 'phrase_005',
                translations: {
                    english: 'Please.',
                    es: 'Por favor.',
                    fr: "S'il vous plaît.",
                    ur: 'براہ کرم۔',
                    zh: '请。',
                    pa: 'ਕਿਰਪਾ ਕਰਕੇ।',
                },
            },
            {
                id: 'phrase_006',
                translations: {
                    english: 'Goodbye.',
                    es: 'Adiós.',
                    fr: 'Au revoir.',
                    ur: 'خدا حافظ۔',
                    zh: '再见。',
                    pa: 'ਅਲਵਿਦਾ।',
                },
            },
        ],
    },
    {
        id: 'transportation',
        name: 'Transportation',
        phrases: [
            {
                id: 'phrase_001',
                translations: {
                    english: 'Where is the nearest bus stop?',
                    es: '¿Dónde está la parada de autobús más cercana?',
                    fr: "Où se trouve l'arrêt de bus le plus proche ?",
                    ur: 'سب سے قریبی بس اسٹاپ کہاں ہے؟',
                    zh: '最近的公交车站在哪里？',
                    pa: 'ਸਭ ਤੋਂ ਨੇੜਲਾ ਬੱਸ ਸਟਾਪ ਕਿੱਥੇ ਹੈ?',
                },
            },
            {
                id: 'phrase_002',
                translations: {
                    english: 'How much is a ticket?',
                    es: '¿Cuánto cuesta un billete?',
                    fr: 'Combien coûte un billet ?',
                    ur: 'ٹکٹ کتنے کا ہے؟',
                    zh: '一张票多少钱？',
                    pa: 'ਟਿਕਟ ਕਿੰਨੇ ਦੀ ਹੈ?',
                },
            },
            {
                id: 'phrase_003',
                translations: {
                    english: 'Does this bus go to the city center?',
                    es: '¿Este autobús va al centro de la ciudad?',
                    fr: 'Ce bus va-t-il au centre-ville ?',
                    ur: 'کیا یہ بس شہر کے مرکز تک جاتی ہے؟',
                    zh: '这辆公交车去市中心吗？',
                    pa: 'ਕੀ ਇਹ ਬੱਸ ਸ਼ਹਿਰ ਦੇ ਕੇਂਦਰ ਤੱਕ ਜਾਂਦੀ ਹੈ?',
                },
            },
            {
                id: 'phrase_004',
                translations: {
                    english: 'Where can I buy a ticket?',
                    es: '¿Dónde puedo comprar un billete?',
                    fr: 'Où puis-je acheter un billet ?',
                    ur: 'میں ٹکٹ کہاں سے خرید سکتا/سکتی ہوں؟',
                    zh: '我在哪里可以买票？',
                    pa: 'ਮੈਂ ਟਿਕਟ ਕਿੱਥੋਂ ਖਰੀਦ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?',
                },
                // Audio uses the masculine form; the card still shows both.
                spoken: {
                    ur: 'میں ٹکٹ کہاں سے خرید سکتا ہوں؟',
                    pa: 'ਮੈਂ ਟਿਕਟ ਕਿੱਥੋਂ ਖਰੀਦ ਸਕਦਾ ਹਾਂ?',
                },
            },
            {
                id: 'phrase_005',
                translations: {
                    english: 'Please take me to this address.',
                    es: 'Lléveme a esta dirección, por favor.',
                    fr: "Emmenez-moi à cette adresse, s'il vous plaît.",
                    ur: 'براہ کرم مجھے اس پتے پر لے چلیں۔',
                    zh: '请带我去这个地址。',
                    pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਇਸ ਪਤੇ 'ਤੇ ਲੈ ਚੱਲੋ।",
                },
            },
            {
                id: 'phrase_006',
                translations: {
                    english: 'When is the next train?',
                    es: '¿Cuándo sale el próximo tren?',
                    fr: 'Quand part le prochain train ?',
                    ur: 'اگلی ٹرین کب ہے؟',
                    zh: '下一班火车什么时候发车？',
                    pa: 'ਅਗਲੀ ਰੇਲਗੱਡੀ ਕਦੋਂ ਚੱਲੇਗੀ?',
                },
            },
        ],
    },
    {
        id: 'restaurants',
        name: 'Restaurants',
        phrases: [
            {
                id: 'phrase_001',
                translations: {
                    english: 'Can I see the menu, please?',
                    es: '¿Me puede mostrar el menú, por favor?',
                    fr: "Puis-je voir le menu, s'il vous plaît ?",
                    ur: 'کیا میں مینو دیکھ سکتا/سکتی ہوں؟',
                    zh: '请问可以给我看一下菜单吗？',
                    pa: 'ਕੀ ਮੈਂ ਮੀਨੂ ਦੇਖ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?',
                },
                // Audio uses the masculine form; the card still shows both.
                spoken: {
                    ur: 'کیا میں مینو دیکھ سکتا ہوں؟',
                    pa: 'ਕੀ ਮੈਂ ਮੀਨੂ ਦੇਖ ਸਕਦਾ ਹਾਂ?',
                },
            },
            {
                id: 'phrase_002',
                translations: {
                    english: "I'd like to order this dish.",
                    es: 'Me gustaría pedir este plato.',
                    fr: 'Je voudrais commander ce plat.',
                    ur: 'میں یہ ڈش آرڈر کرنا چاہتا/چاہتی ہوں۔',
                    zh: '我想点这道菜。',
                    pa: 'ਮੈਂ ਇਹ ਪਕਵਾਨ ਮੰਗਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।',
                },
                // Audio uses the masculine form; the card still shows both.
                spoken: {
                    ur: 'میں یہ ڈش آرڈر کرنا چاہتا ہوں۔',
                    pa: 'ਮੈਂ ਇਹ ਪਕਵਾਨ ਮੰਗਵਾਉਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।',
                },
            },
            {
                id: 'phrase_003',
                translations: {
                    english: 'Do you have vegetarian options?',
                    es: '¿Tienen opciones vegetarianas?',
                    fr: 'Avez-vous des plats végétariens ?',
                    ur: 'کیا آپ کے پاس سبزی خوروں کے لیے کھانا ہے؟',
                    zh: '你们有素食吗？',
                    pa: 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਸ਼ਾਕਾਹਾਰੀ ਖਾਣੇ ਦੇ ਵਿਕਲਪ ਹਨ?',
                },
            },
            {
                id: 'phrase_004',
                translations: {
                    english: 'I am allergic to peanuts.',
                    es: 'Soy alérgico/a a los cacahuetes.',
                    fr: 'Je suis allergique aux arachides.',
                    ur: 'مجھے مونگ پھلی سے الرجی ہے۔',
                    zh: '我对花生过敏。',
                    pa: 'ਮੈਨੂੰ ਮੂੰਗਫਲੀ ਤੋਂ ਐਲਰਜੀ ਹੈ।',
                },
                // Audio uses the masculine form; the card still shows both.
                spoken: {
                    es: 'Soy alérgico a los cacahuetes.',
                },
            },
            {
                id: 'phrase_005',
                translations: {
                    english: 'Could I have the bill, please?',
                    es: '¿Me trae la cuenta, por favor?',
                    fr: "L'addition, s'il vous plaît.",
                    ur: 'براہ کرم مجھے بل دے دیں۔',
                    zh: '请给我账单。',
                    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਬਿੱਲ ਦੇ ਦਿਓ।',
                },
            },
            {
                id: 'phrase_006',
                translations: {
                    english: 'Is this dish spicy?',
                    es: '¿Este plato es picante?',
                    fr: 'Ce plat est-il épicé ?',
                    ur: 'کیا یہ ڈش تیکھی ہے؟',
                    zh: '这道菜辣吗？',
                    pa: 'ਕੀ ਇਹ ਪਕਵਾਨ ਤਿੱਖਾ ਹੈ?',
                },
            },
        ],
    },
    {
        id: 'accommodation',
        name: 'Accommodation',
        phrases: [
            {
                id: 'phrase_001',
                translations: {
                    english: 'I have a reservation.',
                    es: 'Tengo una reserva.',
                    fr: "J'ai une réservation.",
                    ur: 'میری بکنگ ہے۔',
                    zh: '我有预订。',
                    pa: 'ਮੇਰੀ ਬੁਕਿੰਗ ਹੈ।',
                },
            },
            {
                id: 'phrase_002',
                translations: {
                    english: "I'd like to check in.",
                    es: 'Me gustaría registrarme.',
                    fr: 'Je voudrais faire mon enregistrement.',
                    ur: 'میں چیک اِن کرنا چاہتا/چاہتی ہوں۔',
                    zh: '我想办理入住。',
                    pa: 'ਮੈਂ ਚੈੱਕ-ਇਨ ਕਰਨਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।',
                },
                // Audio uses the masculine form; the card still shows both.
                spoken: {
                    ur: 'میں چیک اِن کرنا چاہتا ہوں۔',
                    pa: 'ਮੈਂ ਚੈੱਕ-ਇਨ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।',
                },
            },
            {
                id: 'phrase_003',
                translations: {
                    english: 'What time is check-out?',
                    es: '¿A qué hora es la salida?',
                    fr: 'À quelle heure doit-on libérer la chambre ?',
                    ur: 'چیک آؤٹ کتنے بجے ہے؟',
                    zh: '退房时间是几点？',
                    pa: 'ਚੈੱਕ-ਆਊਟ ਕਿੰਨੇ ਵਜੇ ਹੈ?',
                },
            },
            {
                id: 'phrase_004',
                translations: {
                    english: 'Is breakfast included?',
                    es: '¿Está incluido el desayuno?',
                    fr: 'Le petit-déjeuner est-il inclus ?',
                    ur: 'کیا ناشتہ شامل ہے؟',
                    zh: '包含早餐吗？',
                    pa: 'ਕੀ ਨਾਸ਼ਤਾ ਸ਼ਾਮਲ ਹੈ?',
                },
            },
            {
                id: 'phrase_005',
                translations: {
                    english: 'The room key is not working.',
                    es: 'La llave de la habitación no funciona.',
                    fr: 'La clé de la chambre ne fonctionne pas.',
                    ur: 'کمرے کی چابی کام نہیں کر رہی۔',
                    zh: '房间钥匙不能用了。',
                    pa: 'ਕਮਰੇ ਦੀ ਚਾਬੀ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।',
                },
            },
            {
                id: 'phrase_006',
                translations: {
                    english: 'Could I have an extra towel?',
                    es: '¿Me puede dar una toalla extra?',
                    fr: 'Pourrais-je avoir une serviette supplémentaire ?',
                    ur: 'کیا مجھے ایک اور تولیہ مل سکتا ہے؟',
                    zh: '可以再给我一条毛巾吗？',
                    pa: 'ਕੀ ਮੈਨੂੰ ਇੱਕ ਹੋਰ ਤੌਲੀਆ ਮਿਲ ਸਕਦਾ ਹੈ?',
                },
            },
        ],
    },
];
