import { Lock, Search, Globe, Cpu } from 'lucide-react';

export const modulesData = [
    {
        id: 'patents',
        title: 'Patents',
        description: 'Protect your inventions. Learn about utility, design, and plant patents, and the application process.',
        icon: Lock,
        color: 'text-blue-400',
        path: '/modules/patents',
        games: [
            {
                type: 'sorter',
                title: 'Patent Scanner',
                description: 'Sort inventions into "Patentable" vs "Not Patentable".',
                data: {
                    categories: {
                        left: { id: 'patentable', label: 'Patentable' },
                        right: { id: 'not_patentable', label: 'Not Patentable' }
                    },
                    items: {
                        easy: [
                            { text: "Improved Water Bottle Cap Design", correctCategory: "patentable" },
                            { text: "Pure Mathematical Equation", correctCategory: "not_patentable" },
                            { text: "Mobile Phone Charging Circuit", correctCategory: "patentable" },
                            { text: "Scientific Theory", correctCategory: "not_patentable" },
                            { text: "Mechanical Gear System", correctCategory: "patentable" },
                            { text: "Idea for a New Business Model", correctCategory: "not_patentable" }
                        ],
                        medium: [
                            { text: "AI-Based Traffic Signal Optimization System", correctCategory: "patentable" },
                            { text: "Algorithm for Sorting Numbers", correctCategory: "not_patentable" },
                            { text: "Wearable Device for Monitoring Heart Rate", correctCategory: "patentable" },
                            { text: "Natural Discovery of a New Star", correctCategory: "not_patentable" },
                            { text: "Improved Battery Cooling Mechanism", correctCategory: "patentable" },
                            { text: "Mental Method for Solving Puzzles", correctCategory: "not_patentable" }
                        ],
                        hard: [
                            { text: "Software-Controlled Washing Machine Cycle", correctCategory: "patentable" },
                            { text: "Business Method for Online Advertising", correctCategory: "not_patentable" },
                            { text: "Autonomous Drone Navigation Hardware", correctCategory: "patentable" },
                            { text: "Presentation of Information on a Screen", correctCategory: "not_patentable" },
                            { text: "Smart Irrigation System Using Sensors", correctCategory: "patentable" },
                            { text: "Rule Set for a Board Game", correctCategory: "not_patentable" }
                        ]
                    }
                }
            },
            {
                type: 'quiz',
                title: 'Inventor\'s Exam',
                description: 'Test your knowledge on patent laws and durations.',
                data: {
                    questions: [
                        { text: "How long does a utility patent last?", options: ["14 years", "20 years", "70 years", "Forever"], correctAnswer: 1 },
                        { text: "Which patent protects the visual look of an item?", options: ["Utility", "Plant", "Design", "Provisional"], correctAnswer: 2 }
                    ]
                }
            },
            {
                type: 'spin',
                title: 'Patent Roulette',
                description: 'Spin to answer a question on a specific patent topic.',
                data: {
                    segments: [
                        { label: "Utility", question: { text: "What does a utility patent protect?", options: ["Functional aspects", "Visual design", "Plant varieties", "Brand names"], correctAnswer: 0 } },
                        { label: "Design", question: { text: "Can you patent a T-shirt design?", options: ["Yes, if ornamental", "No, never", "Only if it has a logo", "Only if it flies"], correctAnswer: 0 } },
                        { label: "Filing", question: { text: "Who gets the patent?", options: ["First to invent", "First to file", "First to sell", "Rich people"], correctAnswer: 1 } },
                        { label: "Infringement", question: { text: "Using a patented invention without permission is:", options: ["Fair Use", "Infringement", "Public Domain", "Smart"], correctAnswer: 1 } }
                    ]
                }
            }
        ]
    },
    {
        id: 'copyrights',
        title: 'Copyrights',
        description: 'Safeguard your creative works. Understand rights for literary, artistic, educational, and musical content.',
        icon: Cpu,
        color: 'text-rose-400',
        path: '/modules/copyrights',
        games: [
            {
                type: 'match',
                title: 'Term Matcher',
                description: 'Match copyright terms to their legal definitions.',
                data: {
                    pairs: [
                        { term: "Public Domain", definition: "Works with no IP rights" },
                        { term: "Fair Use", definition: "Limited use without permission" },
                        { term: "Term", definition: "Life + 70 years" },
                        { term: "Infringement", definition: "Unauthorized use" }
                    ]
                }
            },
            {
                type: 'quiz',
                title: 'Creator\'s Quiz',
                description: 'Solve scenarios related to ownership and registration.',
                data: {
                    questions: [
                        { text: "When does copyright begin?", options: ["Registration", "Publication", "Creation", "1 year later"], correctAnswer: 2 },
                        { text: "Can you copyright an idea?", options: ["Yes", "No", "Maybe", "Only if written"], correctAnswer: 1 }
                    ]
                }
            },
            {
                type: 'spin',
                title: 'Rights Roulette',
                description: 'Spin for a question on copyright limitations and rights.',
                data: {
                    segments: [
                        { label: "Fair Use", question: { text: "Is parody considered fair use?", options: ["Usually Yes", "Never", "Only for songs", "Only for books"], correctAnswer: 0 } },
                        { label: "Duration", question: { text: "Copyright lasts for...", options: ["50 years", "Life + 70y", "Forever", "10 years"], correctAnswer: 1 } },
                        { label: "Registration", question: { text: "Is registration required to sue?", options: ["Yes", "No", "Sometimes", "Only in Europe"], correctAnswer: 0 } },
                        { label: "Works", question: { text: "Software code is protected as...", options: ["Literary work", "Machine", "Idea", "Patent"], correctAnswer: 0 } }
                    ]
                }
            },
            {
                type: 'guess',
                title: 'IP Detective',
                description: 'Deduce the IP type based on climbing clues.',
                data: {
                    scenarios: [
                        {
                            correctId: 'fair_use',
                            clues: [
                                "I am not a right granted to the creator, but a limitation on their rights.",
                                "I allow you to use protected works without permission for criticism or education.",
                                "Parody and News Reporting heavily rely on me."
                            ]
                        },
                        {
                            correctId: 'patent',
                            clues: [
                                "I protect new inventions and functional improvements.",
                                "My protection typically lasts for 20 years from filing.",
                                "To get me, you must prove your idea is novel, useful, and non-obvious."
                            ]
                        },
                        {
                            correctId: 'trademark',
                            clues: [
                                "I protect brand names, logos, and slogans.",
                                "I can last forever as long as I am used in commerce and renewed.",
                                "I help consumers distinguish one company's goods from another."
                            ]
                        },
                        {
                            correctId: 'trade_secret',
                            clues: [
                                "I protect confidential business information.",
                                "I have no expiration date, but once leaked, I am gone forever.",
                                "The recipe for Coca-Cola is a famous example of me."
                            ]
                        },
                        {
                            correctId: 'public_domain',
                            clues: [
                                "I belong to everyone; no one owns me.",
                                "Old works enter my realm after their copyright expires.",
                                "You can use me freely without asking for permission."
                            ]
                        },
                        {
                            correctId: 'copyright',
                            clues: [
                                "I automatically protect original artistic and literary works upon creation.",
                                "I give the creator exclusive rights to reproduce and perform their work.",
                                "For individuals, I last for the life of the author plus 70 years."
                            ]
                        }
                    ],
                    characters: [
                        { id: 'copyright', name: 'Copyright', icon: '©️' },
                        { id: 'patent', name: 'Patent', icon: '⚙️' },
                        { id: 'trademark', name: 'Trademark', icon: '™️' },
                        { id: 'trade_secret', name: 'Trade Secret', icon: '🤫' },
                        { id: 'public_domain', name: 'Public Domain', icon: '🏛️' },
                        { id: 'fair_use', name: 'Fair Use', icon: '⚖️' }
                    ]
                }
            }
        ]
    },
    {
        id: 'trademarks',
        title: 'Trademarks',
        description: 'Secure your brand identity. distinctive signs, names, and symbols that distinguish your goods.',
        icon: Globe,
        color: 'text-purple-400',
        path: '/modules/trademarks',
        games: [
            {
                type: 'quiz',
                title: 'Brand Defense',
                description: 'Identify correct trademark usages and violations.',
                data: {
                    questions: [
                        { text: "Which symbol is for registered trademarks?", options: ["TM", "R in circle", "C in circle", "SM"], correctAnswer: 1 },
                        { text: "Trademarks protect...", options: ["Inventions", "Brand Names", "Songs", "Recipes"], correctAnswer: 1 }
                    ]
                }
            },
            {
                type: 'sorter',
                title: 'Mark Sorter',
                description: 'Sort items into "Strong Mark" vs "Weak Mark".',
                data: {
                    categories: {
                        left: { id: 'strong', label: 'Strong Mark' },
                        right: { id: 'weak', label: 'Weak Mark' }
                    },
                    items: [
                        { text: "Made Up Word (e.g. Kodak)", correctCategory: 'strong' },
                        { text: "Descriptive (e.g. Best Pizza)", correctCategory: 'weak' },
                        { text: "Generic (e.g. Apple for apples)", correctCategory: 'weak' },
                        { text: "Arbitrary (e.g. Apple for computers)", correctCategory: 'strong' }
                    ]
                }
            },
            {
                type: 'spin',
                title: 'Symbol Spin',
                description: 'Test your knowledge on trademark symbols and types.',
                data: {
                    segments: [
                        { label: "Symbols", question: { text: "What does SM stand for?", options: ["Service Mark", "Small Mark", "Standard Mark", "Super Mark"], correctAnswer: 0 } },
                        { label: "Types", question: { text: "A sound can be a trademark.", options: ["True", "False", "Only in movies", "Never"], correctAnswer: 0 } },
                        { label: "Renewal", question: { text: "How often must you renew?", options: ["Every 10 years", "Never", "Every year", "Every 50 years"], correctAnswer: 0 } },
                        { label: "Generic", question: { text: "Can a mark become generic?", options: ["Yes (e.g. Escalator)", "No", "Only if abandoned", "If sold"], correctAnswer: 0 } }
                    ]
                }
            }
        ]
    },
    {
        id: 'trade-secrets',
        title: 'Trade Secrets',
        description: 'Keep your competitive edge. Protect confidential business information and know-how.',
        icon: Search,
        color: 'text-emerald-400',
        path: '/modules/trade-secrets',
        games: [
            {
                type: 'quiz',
                title: 'Secret Keeper',
                description: 'Best practices for keeping secrets.',
                data: {
                    questions: [
                        { text: "NDA stands for...", options: ["Non-Disclosure Agreement", "No Data Access", "New Deal Act", "None"], correctAnswer: 0 },
                        { text: "Reverse engineering is...", options: ["Legal", "Illegal", "Unethical", "Impossible"], correctAnswer: 0 }
                    ]
                }
            },
            {
                type: 'match',
                title: 'Secret Match',
                description: 'Match trade secret terms.',
                data: {
                    pairs: [
                        { term: "NDA", definition: "Contract to keep secrets" },
                        { term: "Misappropriation", definition: "Stealing a secret" },
                        { term: "Reverse Engineering", definition: "Figuring out how it works" },
                        { term: "Economic Value", definition: "Secret makes money" }
                    ]
                }
            },
            {
                type: 'spin',
                title: 'Secrecy Spin',
                description: 'Roulette of trade secret scenarios.',
                data: {
                    segments: [
                        { label: "Protection", question: { text: "Does a trade secret expire?", options: ["No, if kept secret", "Yes, 20 years", "Yes, 70 years", "Yes, 10 years"], correctAnswer: 0 } },
                        { label: "Examples", question: { text: "Which is a trade secret?", options: ["Google Search Algo", "iPhone Design", "Harry Potter Book", "Nike Logo"], correctAnswer: 0 } },
                        { label: "Loss", question: { text: "How can you lose a secret?", options: ["Employee leak", "Filing a patent", "Accidental post", "All of above"], correctAnswer: 3 } },
                        { label: "Legal", question: { text: "Is it a federal crime to steal secrets?", options: ["Yes (DTSA)", "No", "Only in NY", "Only computer files"], correctAnswer: 0 } }
                    ]
                }
            }
        ]
    }
];
