import { Lock, Search, Globe, Cpu } from 'lucide-react';

export const modulesData = [
    {
        id: 'patents',
        title: 'Patents',
        description: 'Protect your inventions. Learn about utility, design, and plant patents, and the application process.',
        icon: Lock,
        color: 'text-quest-primary',
        path: '/modules/patents',
        games: [
            // EASY: quiz (L1-3)
            {
                type: 'quiz',
                title: 'Patent Basics I',
                description: 'L1: Core concepts of patent law.',
                data: {
                    questions: [
                        { text: "What is the primary purpose of a patent?", options: ["Grant a monopoly", "Reward inventors", "Protect brand names", "Encourage public disclosure"], correctAnswer: 3 },
                        { text: "Which type of patent protects the visual look of an item?", options: ["Utility", "Plant", "Design", "Trade Secret"], correctAnswer: 2 },
                        { text: "How long is a utility patent typically valid?", options: ["14 years", "20 years", "70 years", "Forever"], correctAnswer: 1 },
                        { text: "Who issues patents in the United States?", options: ["WIPO", "Copyright Office", "USPTO", "Supreme Court"], correctAnswer: 2 },
                        { text: "A provisional patent application lasts for...", options: ["6 months", "12 months", "2 years", "10 years"], correctAnswer: 1 }
                    ]
                }
            },
            {
                type: 'quiz',
                title: 'Patent Basics II',
                description: 'L2: Requirements for patentability.',
                data: {
                    questions: [
                        { text: "To be patentable, an invention must be...", options: ["Simple", "Novel", "Expensive", "Large"], correctAnswer: 1 },
                        { text: "What does 'non-obvious' mean in patent law?", options: ["Too complex to understand", "Not predictable to someone in the field", "Highly valuable", "Secret"], correctAnswer: 1 },
                        { text: "The first step to get a patent is...", options: ["Selling the product", "Filing an application", "Marketing", "Applying for copyright"], correctAnswer: 1 },
                        { text: "Can you patent a discovery of a new element?", options: ["Yes", "No", "Only if you name it", "Maybe"], correctAnswer: 1 },
                        { text: "What is 'Prior Art'?", options: ["Old paintings", "Existing knowledge before the filing", "Famous inventions", "Legal fees"], correctAnswer: 1 }
                    ]
                }
            },
            {
                type: 'quiz',
                title: 'Patent Basics III',
                description: 'L3: Rights and international filing.',
                data: {
                    questions: [
                        { text: "Is a patent valid worldwide?", options: ["Yes", "No, it's territorial", "Only in the UN", "Only in the US and UK"], correctAnswer: 1 },
                        { text: "What is the PCT (Patent Cooperation Treaty)?", options: ["A global patent office", "A unified filing process for many countries", "A ban on patents", "A trade agreement"], correctAnswer: 1 },
                        { text: "Using a patented invention without permission is:", options: ["Fair Use", "Infringement", "Legal", "Smart"], correctAnswer: 1 },
                        { text: "A 'patent troll' is usually someone who:", options: ["Invents many things", "Enforces patents without making products", "Works for the USPTO", "Opposes patents"], correctAnswer: 1 },
                        { text: "When does a patent enter the public domain?", options: ["After 5 years", "Upon the inventor's death", "When it expires", "After registration"], correctAnswer: 2 }
                    ]
                }
            },
            // MEDIUM: sorter (L4-6)
            {
                type: 'sorter',
                title: 'Patent Sorter I',
                description: 'L4: Patentable vs Not Patentable.',
                data: {
                    categories: {
                        left: { id: 'patentable', label: 'Patentable' },
                        right: { id: 'not_patentable', label: 'Not Patentable' }
                    },
                    items: [
                        { text: "New Engine Cooling System", correctCategory: "patentable" },
                        { text: "Scientific Theory", correctCategory: "not_patentable" },
                        { text: "Smart Toothbrush Circuitry", correctCategory: "patentable" },
                        { text: "Mathematical Equation", correctCategory: "not_patentable" },
                        { text: "Method for Business Organization", correctCategory: "not_patentable" }
                    ]
                }
            },
            {
                type: 'sorter',
                title: 'Patent Sorter II',
                description: 'L5: Utility vs Design Patents.',
                data: {
                    categories: {
                        left: { id: 'utility', label: 'Utility' },
                        right: { id: 'design', label: 'Design' }
                    },
                    items: [
                        { text: "Shape of a Cola Bottle", correctCategory: "design" },
                        { text: "Battery Chemistry", correctCategory: "utility" },
                        { text: "Furniture Ornamentation", correctCategory: "design" },
                        { text: "Encryption Algorithm Hardware", correctCategory: "utility" },
                        { text: "Shoe Sole Tread Pattern (Function)", correctCategory: "utility" }
                    ]
                }
            },
            {
                type: 'sorter',
                title: 'Patent Sorter III',
                description: 'L6: Novel vs Obvious Steps.',
                data: {
                    categories: {
                        left: { id: 'novel', label: 'Likely Patentable' },
                        right: { id: 'obvious', label: 'Likely Unpatentable' }
                    },
                    items: [
                        { text: "Making a spoon out of gold instead of steel", correctCategory: "obvious" },
                        { text: "First fold-able glass screen", correctCategory: "novel" },
                        { text: "Adding a light to a pen (already exists)", correctCategory: "obvious" },
                        { text: "Room temperature superconductor", correctCategory: "novel" },
                        { text: "Painting a car a different color", correctCategory: "obvious" }
                    ]
                }
            },
            // HARD: reverse-hangman (L7-9)
            {
                type: 'reverse-hangman',
                title: 'Patent Guardian I',
                description: 'L7: Legal terms and advanced concepts.',
                data: {
                    questions: [
                        { text: "The document describing the invention in detail is the...", options: ["Specification", "Diary", "Contract", "Manifesto"], correctAnswer: 0 },
                        { text: "These define the legal boundaries of the patent protection:", options: ["Titles", "Claims", "Abstracts", "Drawings"], correctAnswer: 1 },
                        { text: "A patent for a new variety of flower would be a:", options: ["Utility", "Design", "Plant", "Business"], correctAnswer: 2 },
                        { text: "If an invention is made by an employee, who usually owns the patent?", options: ["The Employee", "The Employer", "The Government", "The Public"], correctAnswer: 1 },
                        { text: "The date when the patent application is submitted is the...", options: ["Expiry Date", "Filing Date", "Release Date", "Copyright Date"], correctAnswer: 1 }
                    ]
                }
            },
            {
                type: 'reverse-hangman',
                title: 'Patent Guardian II',
                description: 'L8: Infringement and litigation.',
                data: {
                    questions: [
                        { text: "Willful infringement can result in...", options: ["Treble damages", "No penalty", "Apology", "Medal"], correctAnswer: 0 },
                        { text: "A 'Cease and Desist' letter is:", options: ["An invitation to lunch", "A demand to stop infringement", "A patent grant", "A tax bill"], correctAnswer: 1 },
                        { text: "Which court typically hears patent cases in the US?", options: ["Family Court", "Federal District Court", "Traffic Court", "Small Claims"], correctAnswer: 1 },
                        { text: "A patent owner can grant permission via a...", options: ["Lien", "License", "Mortgage", "Deed"], correctAnswer: 1 },
                        { text: "If a patent is found invalid by a court, it is:", options: ["Still active", "Unenforceable", "Doubled in time", "Hidden"], correctAnswer: 1 }
                    ]
                }
            },
            {
                type: 'reverse-hangman',
                title: 'Patent Guardian III',
                description: 'L9: Grand Master Patent Trivia.',
                data: {
                    questions: [
                        { text: "Who signed the first US patent?", options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "Elon Musk"], correctAnswer: 0 },
                        { text: "The first patent ever granted in the US was for...", options: ["Potash (fertilizer)", "Light bulb", "Telephone", "Cotton Gin"], correctAnswer: 0 },
                        { text: "Which inventor held over 1,000 patents?", options: ["Edison", "Tesla", "Newton", "Franklin"], correctAnswer: 0 },
                        { text: "Can software be patented in most jurisdictions?", options: ["No, only code", "Yes, if it has a technical effect", "Never", "Only if written in C++"], correctAnswer: 1 },
                        { text: "What is a 'Patent Thicket'?", options: ["A forest of trees", "Overlapping patent rights", "A patent office", "A legal textbook"], correctAnswer: 1 }
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
        color: 'text-quest-accent',
        path: '/modules/copyrights',
        games: [
            // EASY: match (L1-3)
            {
                type: 'match',
                title: 'Copyright Match I',
                description: 'L1: Core definitions.',
                data: {
                    pairs: [
                        { term: "Literary Work", definition: "Books and code" },
                        { term: "Artistic Work", definition: "Paintings and photos" },
                        { term: "Musical Work", definition: "Compositions" },
                        { term: "Public Domain", definition: "No copyright" },
                        { term: "Author", definition: "Original creator" }
                    ]
                }
            },
            {
                type: 'match',
                title: 'Copyright Match II',
                description: 'L2: Rights and Duration.',
                data: {
                    pairs: [
                        { term: "Reproduction", definition: "Right to copy" },
                        { term: "Derivatives", definition: "Adaptations" },
                        { term: "Term", definition: "Duration of protection" },
                        { term: "Distribution", definition: "Selling copies" },
                        { term: "Performance", definition: "Public showing" }
                    ]
                }
            },
            {
                type: 'match',
                title: 'Copyright Match III',
                description: 'L3: Advanced Concepts.',
                data: {
                    pairs: [
                        { term: "Fair Use", definition: "Legal exception" },
                        { term: "Work for Hire", definition: "Employer owns it" },
                        { term: "Safe Harbor", definition: "ISP protection" },
                        { term: "DMCA", definition: "Takedown law" },
                        { term: "Moral Rights", definition: "Right to attribution" }
                    ]
                }
            },
            // MEDIUM: memory (L4-6)
            {
                type: 'memory',
                title: 'Copyright Memory I',
                description: 'L4: Protected vs Unprotected.',
                data: {
                    pairs: [
                        { term: "Idea", definition: "Not copyrightable" },
                        { term: "Creation", definition: "When protection begins" },
                        { term: "© Symbol", definition: "Visible copyright notice" },
                        { term: "Recipe List", definition: "Not protected by copyright" },
                        { term: "Registration", definition: "Not strictly required for protection" }
                    ]
                }
            },
            {
                type: 'memory',
                title: 'Copyright Memory II',
                description: 'L5: Ownership and transfer.',
                data: {
                    pairs: [
                        { term: "Duration", definition: "Life + 70 years" },
                        { term: "Painting Sale", definition: "Doesn't include copyright transfer" },
                        { term: "Inheritance", definition: "Copyrights can be passed to heirs" },
                        { term: "Joint Authorship", definition: "Multiple creators sharing rights" },
                        { term: "Litigation", definition: "Requires formal registration first" }
                    ]
                }
            },
            {
                type: 'memory',
                title: 'Copyright Memory III',
                description: 'L6: Digital age copyrights.',
                data: {
                    pairs: [
                        { term: "Piracy", definition: "Illegal unauthorized downloading" },
                        { term: "Creative Commons", definition: "Flexible licensing templates" },
                        { term: "Gov Works", definition: "Typically in the Public Domain" },
                        { term: "Software Code", definition: "Protected as a literary work" },
                        { term: "Review Snippet", definition: "Typically considered Fair Use" }
                    ]
                }
            },
            // HARD: snake (L7-9)
            {
                type: 'snake',
                title: 'Copyright Climb I',
                description: 'L7: Infringement details.',
                data: {
                    questions: [
                        { text: "Unauthorized copying of a work is:", options: ["Innovation", "Infringement", "Borrowing", "Fairness"], correctAnswer: 1 },
                        { text: "Plagiarism is the same as copyright infringement.", options: ["True", "False (Ethical vs Legal)", "They are unrelated", "Always"], correctAnswer: 1 },
                        { text: "Statutory damages can reach up to...", options: ["$500", "$150,000 per work", "$1,000", "$5,000"], correctAnswer: 1 },
                        { text: "Is 'Good Faith' a total defense for infringement?", options: ["Yes", "No", "Only for students", "Only for kids"], correctAnswer: 1 },
                        { text: "What is secondary liability?", options: ["Theft", "Facilitating infringement by others", "Writing a sequel", "Buying a copy"], correctAnswer: 1 }
                    ]
                }
            },
            {
                type: 'snake',
                title: 'Copyright Climb II',
                description: 'L8: Fair Use factors.',
                data: {
                    questions: [
                        { text: "How many factors are used to determine Fair Use?", options: ["1", "4", "7", "10"], correctAnswer: 1 },
                        { text: "Which is NOT a Fair Use factor?", options: ["Purpose of use", "Nature of work", "Amount used", "Color of paper"], correctAnswer: 3 },
                        { text: "Transformative use is...", options: ["Adding new meaning/expression", "Changing file format", "Deleting lines", "Scanning it"], correctAnswer: 0 },
                        { text: "Is parody usually considered Fair Use?", options: ["Never", "Always", "Usually Yes", "Only if silent"], correctAnswer: 2 },
                        { text: "Does commercial use automatically kill Fair Use?", options: ["Yes", "No, but it's a factor", "Only for music", "Only for TV"], correctAnswer: 1 }
                    ]
                }
            },
            {
                type: 'snake',
                title: 'Copyright Climb III',
                description: 'L9: International Copyright.',
                data: {
                    questions: [
                        { text: "The major international copyright treaty is the:", options: ["Berne Convention", "Red Cross", "Paris Accord", "NATO"], correctAnswer: 0 },
                        { text: "Does the Berne Convention require formalities (like ©)?", options: ["Yes", "No", "Only for books", "Only for US"], correctAnswer: 1 },
                        { text: "What is 'Moral Rights'?", options: ["Right to money", "Right to preserve work's integrity", "Religion", "Ethics"], correctAnswer: 1 },
                        { text: "Which country has the longest copyright term?", options: ["China", "Mexico (Life + 100y)", "USA", "UK"], correctAnswer: 1 },
                        { text: "Can you copyright a dance?", options: ["No", "Yes (Choreography)", "Only if on TikTok", "Only if it is a solo"], correctAnswer: 1 }
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
        color: 'text-quest-secondary',
        path: '/modules/trademarks',
        games: [
            // EASY: spin (L1-3)
            {
                type: 'spin',
                title: 'Trademark Spin I',
                description: 'L1: Basics and Symbols.',
                data: {
                    segments: [
                        { label: "TM Symbol", question: { text: "What does the TM symbol represent?", options: ["Registered Mark", "Unregistered Mark", "Trade Money", "Temporary Mark"], correctAnswer: 1 } },
                        { label: "R Symbol", question: { text: "What does the (R) symbol represent?", options: ["Registered Mark", "Rare Mark", "Right Mark", "Retail"], correctAnswer: 0 } },
                        { label: "Purpose", question: { text: "What is the primary goal of trademarks?", options: ["Protect inventors", "Prevent consumer confusion", "Monopoly", "Taxing brands"], correctAnswer: 1 } },
                        { label: "Service Mark", question: { text: "What is an SM?", options: ["Small Mark", "Service Mark", "Standard Mark", "Secret Mark"], correctAnswer: 1 } },
                        { label: "Duration", question: { text: "How long can a trademark last?", options: ["20 years", "Forever if used/renewed", "70 years", "10 years"], correctAnswer: 1 } }
                    ]
                }
            },
            {
                type: 'spin',
                title: 'Trademark Spin II',
                description: 'L2: Distinctiveness.',
                data: {
                    segments: [
                        { label: "Arbitrary", question: { text: "Apple for computers is an example of an ___ mark.", options: ["Generic", "Descriptive", "Arbitrary", "Suggestive"], correctAnswer: 2 } },
                        { label: "Fanciful", question: { text: "Kodak is an example of a ___ mark.", options: ["Generic", "Fanciful (Made up)", "Descriptive", "Suggestive"], correctAnswer: 1 } },
                        { label: "Generic", question: { text: "Can 'Computer' be a trademark for a computer store?", options: ["Yes", "No (Generic)", "Maybe", "Only if green"], correctAnswer: 1 } },
                        { label: "Suggestive", question: { text: "Netflix for streaming is:", options: ["Generic", "Suggestive", "Descriptive", "Fanciful"], correctAnswer: 1 } },
                        { label: "Descriptive", question: { text: "Best Pizza for a pizza shop is:", options: ["Strong", "Descriptive (Weak)", "Fanciful", "Arbitrary"], correctAnswer: 1 } }
                    ]
                }
            },
            {
                type: 'spin',
                title: 'Trademark Spin III',
                description: 'L3: Filing and Use.',
                data: {
                    segments: [
                        { label: "USPTO", question: { text: "Who handles US trademark registration?", options: ["NASA", "USPTO", "FBI", "Post Office"], correctAnswer: 1 } },
                        { label: "Use in Commerce", question: { text: "Is 'Use' required in the US?", options: ["Yes", "No", "Only for logos", "Only for big companies"], correctAnswer: 0 } },
                        { label: "Renewal", question: { text: "Registration must be renewed every:", options: ["5 years", "10 years", "20 years", "Lifetime"], correctAnswer: 1 } },
                        { label: "Specimen", question: { text: "A sample showing how the mark is used is a:", options: ["Specimen", "Draft", "Proof", "Evidence"], correctAnswer: 0 } },
                        { label: "Intent to Use", question: { text: "What is an ITU application?", options: ["I intend to use this mark", "I Took U", "In The USPTO", "International Treaty Use"], correctAnswer: 0 } }
                    ]
                }
            },
            // MEDIUM: guess (L4-6)
            {
                type: 'guess',
                title: 'Brand Detective I',
                description: 'L4: Recognizable brands.',
                data: {
                    scenarios: [
                        {
                            correctId: 'trademark',
                            clues: [
                                "I am the golden arches of McDonald's.",
                                "I identify the source of goods.",
                                "I help you pick your favorite cola."
                            ]
                        }
                    ],
                    characters: [
                        { id: 'trademark', name: 'Trademark', icon: '™️' },
                        { id: 'trade_dress', name: 'Trade Dress', icon: '👗' },
                        { id: 'genericide', name: 'Genericide', icon: '💀' },
                        { id: 'patent', name: 'Patent', icon: '⚙️' },
                        { id: 'copyright', name: 'Copyright', icon: '©️' },
                        { id: 'renewal', name: 'Renewal', icon: '♻️' }
                    ]
                }
            },
            {
                type: 'guess',
                title: 'Brand Detective II',
                description: 'L5: Trademark Types.',
                data: {
                    scenarios: [
                        {
                            correctId: 'trade_dress',
                            clues: [
                                "I protect the overall look and feel of a product.",
                                "The shape of a Coca-Cola bottle is a classic example.",
                                "I can include interior decor of a restaurant."
                            ]
                        }
                    ],
                    characters: [
                        { id: 'trademark', name: 'Trademark', icon: '™️' },
                        { id: 'trade_dress', name: 'Trade Dress', icon: '👗' },
                        { id: 'genericide', name: 'Genericide', icon: '💀' },
                        { id: 'patent', name: 'Patent', icon: '⚙️' },
                        { id: 'copyright', name: 'Copyright', icon: '©️' },
                        { id: 'renewal', name: 'Renewal', icon: '♻️' }
                    ]
                }
            },
            {
                type: 'guess',
                title: 'Brand Detective III',
                description: 'L6: Loss of protection.',
                data: {
                    scenarios: [
                        {
                            correctId: 'genericide',
                            clues: [
                                "I happen when a brand becomes the common name for a product.",
                                "Escalator and Aspirin suffered from me.",
                                "I destroy trademark rights forever."
                            ]
                        }
                    ],
                    characters: [
                        { id: 'trademark', name: 'Trademark', icon: '™️' },
                        { id: 'trade_dress', name: 'Trade Dress', icon: '👗' },
                        { id: 'genericide', name: 'Genericide', icon: '💀' },
                        { id: 'patent', name: 'Patent', icon: '⚙️' },
                        { id: 'copyright', name: 'Copyright', icon: '©️' },
                        { id: 'renewal', name: 'Renewal', icon: '♻️' }
                    ]
                }
            },
            // HARD: quiz (L7-9)
            {
                type: 'quiz',
                title: 'Trademark Trial I',
                description: 'L7: Infringement details.',
                data: {
                    questions: [
                        { text: "The 'Likelihood of Confusion' test determines:", options: ["Patent validity", "Trademark infringement", "Copyright term", "Tax rates"], correctAnswer: 1 },
                        { text: "What is 'Trademark Dilution'?", options: ["Watering down a logo", "Weakening of a famous mark's distinctiveness", "Selling a brand", "Improving a logo"], correctAnswer: 1 },
                        { text: "Cybersquatting involves illegal use of:", options: ["Domain names", "Apartments", "Computers", "Satellites"], correctAnswer: 0 },
                        { text: "Is a sound a valid trademark?", options: ["No, only visual", "Yes (e.g. MGM Lion's roar)", "Only for songs", "Only for podcasts"], correctAnswer: 1 }
                    ]
                }
            },
            {
                type: 'quiz',
                title: 'Trademark Trial II',
                description: 'L8: Defensive strategies.',
                data: {
                    questions: [
                        { text: "What is a 'Watch Service'?", options: ["Selling watches", "Monitoring for infringing filings", "Security guards", "Cleaning logos"], correctAnswer: 1 },
                        { text: "Trademark abandonment happens after non-use for:", options: ["1 month", "3 years (presumptive)", "70 years", "Forever"], correctAnswer: 1 },
                        { text: "Which act governs Federal trademark law in the US?", options: ["Lanham Act", "Copyright Act", "Patent Act", "Tax Act"], correctAnswer: 0 },
                        { text: "Can smells be trademarked?", options: ["Never", "Yes, if they identify the source/product", "Only in perfumes", "Only in bakeries"], correctAnswer: 1 }
                    ]
                }
            },
            {
                type: 'quiz',
                title: 'Trademark Trial III',
                description: 'L9: International Trademarks.',
                data: {
                    questions: [
                        { text: "The Madrid Protocol allows for:", options: ["Cheap coffee", "International trademark registration", "Spanish laws", "Logo design"], correctAnswer: 1 },
                        { text: "What is 'First to File' in international TM?", options: ["Early bird special", "Priority to the first applicant", "First to use gets rights", "First to pay"], correctAnswer: 1 },
                        { text: "Collective marks represent:", options: ["A library", "Members of an association", "Everything", "Groups of kids"], correctAnswer: 1 },
                        { text: "Can you trademark a color?", options: ["No", "Yes, if it acquires secondary meaning (e.g. UPS Brown)", "Only for crayons", "Only for paints"], correctAnswer: 1 }
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
        color: 'text-quest-text',
        path: '/modules/trade-secrets',
        games: [
            // EASY: sorter (L1-3)
            {
                type: 'sorter',
                title: 'Secret Sorter I',
                description: 'L1: Secret vs Public.',
                data: {
                    categories: {
                        left: { id: 'secret', label: 'Trade Secret' },
                        right: { id: 'public', label: 'Public Info' }
                    },
                    items: [
                        { text: "Coca-Cola Recipe", correctCategory: "secret" },
                        { text: "Phone Number in Directory", correctCategory: "public" },
                        { text: "Customer List (Private)", correctCategory: "secret" },
                        { text: "Stock Market Prices", correctCategory: "public" },
                        { text: "Manufacturing Process (Unique)", correctCategory: "secret" }
                    ]
                }
            },
            {
                type: 'sorter',
                title: 'Secret Sorter II',
                description: 'L2: Protecting Secrets.',
                data: {
                    categories: {
                        left: { id: 'good', label: 'Good Practice' },
                        right: { id: 'bad', label: 'Risky Practice' }
                    },
                    items: [
                        { text: "Signing an NDA", correctCategory: "good" },
                        { text: "Posting Code on Github Private Repos", correctCategory: "good" },
                        { text: "Using 'Password123'", correctCategory: "bad" },
                        { text: "Locking the Office", correctCategory: "good" },
                        { text: "Sharing plans on public WiFi", correctCategory: "bad" }
                    ]
                }
            },
            {
                type: 'sorter',
                title: 'Secret Sorter III',
                description: 'L3: Secret vs Patent.',
                data: {
                    categories: {
                        left: { id: 'secret', label: 'Trade Secret' },
                        right: { id: 'patent', label: 'Patent' }
                    },
                    items: [
                        { text: "Protected for 20 years", correctCategory: "patent" },
                        { text: "Protected as long as kept secret", correctCategory: "secret" },
                        { text: "Must be disclosed to the public", correctCategory: "patent" },
                        { text: "Formula for a soda", correctCategory: "secret" },
                        { text: "Mechanism for folding phones", correctCategory: "patent" }
                    ]
                }
            },
            // MEDIUM: match (L4-6)
            {
                type: 'match',
                title: 'Secrecy Match I',
                description: 'L4: Legal Terms.',
                data: {
                    pairs: [
                        { term: "NDA", definition: "Confidentiality agreement" },
                        { term: "Non-Compete", definition: "Prevents working for rival" },
                        { term: "Misappropriation", definition: "Stealing a secret" },
                        { term: "Audit", definition: "Security check" },
                        { term: "Clean Room", definition: "Safe dev environment" }
                    ]
                }
            },
            {
                type: 'match',
                title: 'Secrecy Match II',
                description: 'L5: Protection Methods.',
                data: {
                    pairs: [
                        { term: "Encryption", definition: "Digital locking" },
                        { term: "Watermarking", definition: "Tracking copies" },
                        { term: "Need to Know", definition: "Access restriction" },
                        { term: "Physical Security", definition: "Locks and guards" },
                        { term: "Cybersecurity", definition: "Firewalls and software" }
                    ]
                }
            },
            {
                type: 'match',
                title: 'Secrecy Match III',
                description: 'L6: Economic Value.',
                data: {
                    pairs: [
                        { term: "Competitor Advantage", definition: "Staying ahead" },
                        { term: "Cost savings", definition: "Efficient methods" },
                        { term: "R&D Protection", definition: "Keeping research safe" },
                        { term: "Monetization", definition: "Making money" },
                        { term: "Injunction", definition: "Court-ordered stop" }
                    ]
                }
            },
            // HARD: spin (L7-9)
            {
                type: 'spin',
                title: 'Vault Spin I',
                description: 'L7: Laws and Consequences.',
                data: {
                    segments: [
                        { label: "DTSA", question: { text: "What is the Defend Trade Secrets Act?", options: ["A US Federal Law", "A spy novel", "A tax code", "A city"], correctAnswer: 0 } },
                        { label: "Damages", question: { text: "Can you be sued for lost profits?", options: ["Yes", "No", "Only if you sign", "Only in NY"], correctAnswer: 0 } },
                        { label: "Inevitable Disclosure", question: { text: "What is the Inevitable Disclosure doctrine?", options: ["Secrets will eventually leak", "Court prevents employee from moving to rival", "A type of patent", "A movie"], correctAnswer: 1 } },
                        { label: "Criminal Penalties", question: { text: "Is industrial espionage a crime?", options: ["Yes (EEA)", "No, just business", "Only in movies", "Only if caught"], correctAnswer: 0 } },
                        { label: "Duration", question: { text: "Trade secrets last for:", options: ["20 years", "Forever if secret", "Life + 70y", "10 years"], correctAnswer: 1 } }
                    ]
                }
            },
            {
                type: 'spin',
                title: 'Vault Spin II',
                description: 'L8: Famous Cases.',
                data: {
                    segments: [
                        { label: "Coca-Cola", question: { text: "Which secret is least documented?", options: ["Coke Recipe", "Google Search", "Tesla Battery", "Harry Potter Plot"], correctAnswer: 0 } },
                        { label: "Algorithm", question: { text: "PageRank is a:", options: ["Patent & Trade Secret", "Book", "Law", "Car"], correctAnswer: 0 } },
                        { label: "Recipes", question: { text: "KFC's 11 herbs and spices is a:", options: ["Trade Secret", "Copyright", "Patent", "Trademark"], correctAnswer: 0 } },
                        { label: "Losses", question: { text: "Accidental publication kills a trade secret.", options: ["True", "False", "Only if online", "Only if in English"], correctAnswer: 0 } },
                        { label: "Reverse Engineering", question: { text: "Reverse engineering a legally obtained product is:", options: ["Usually Legal", "Theft", "Piracy", "Impossible"], correctAnswer: 0 } }
                    ]
                }
            },
            {
                type: 'spin',
                title: 'Vault Spin III',
                description: 'L9: Grand Master Secrecy.',
                data: {
                    segments: [
                        { label: "Cybersecurity", question: { text: "Most trade secret theft happens via:", options: ["Hacking", "Insiders/Employees", "Physical breaking", "Satellite"], correctAnswer: 1 } },
                        { label: "Economic Espionage", question: { text: "Targeting US companies for foreign governments is:", options: ["Economic Espionage", "Trade", "Diplomacy", "Marketing"], correctAnswer: 0 } },
                        { label: "Protection Duty", question: { text: "Owner must take '___' measures to protect.", options: ["Reasonable", "Infinite", "Zero", "Magical"], correctAnswer: 0 } },
                        { label: "Loss of Secrecy", question: { text: "If a secret is 'readily ascertainable', it is:", options: ["Lost", "Stronger", "A patent", "Protected"], correctAnswer: 0 } },
                        { label: "Uniform Law", question: { text: "UTSA stands for:", options: ["Uniform Trade Secrets Act", "United States Secret Agency", "Under The Sea", "UT State Act"], correctAnswer: 0 } }
                    ]
                }
            }
        ]
    }
];
