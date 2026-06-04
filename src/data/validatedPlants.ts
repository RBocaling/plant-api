export type ValidatedPlant = {
  id: number;
  primaryName: string;
  commonNames: string[];
  scientificName: string;
  family: string;
  origin: string;
  physicalDescription: string;
  careRequirements: string;
  uses: string;
  notes: string;
  citations: string[];
  aliases: string[];
};

export const VALIDATED_PLANTS: ValidatedPlant[] = [
  {
    id: 1,
    primaryName: "Aglaonema Fugui Red",
    commonNames: ["Aglaonema Fugui Red", "Chinese Evergreen"],
    scientificName: "Aglaonema sp. 'Fugui Red' (Schott, genus 1829)",
    family: "Araceae",
    origin:
      "Hybrid cultivar; genus native to tropical and subtropical Asia and New Guinea. 'Fugui Red' is propagated commercially in China.",
    physicalDescription:
      "Evergreen perennial shrub. Leaves are large, lance-shaped, and boldly marked with vibrant crimson-red and green variegation; coloration intensifies with maturity. Grows erect with stems decumbent or creeping at the base. Inflorescence is a spadix with a white spathe; fruit is a red berry.",
    careRequirements:
      "Light: Low to bright indirect light (tolerates shade). Water: Allow soil to slightly dry between waterings; avoid overwatering. Soil: Well-draining organic potting mix. Temperature: 18–29°C; sensitive to cold drafts.",
    uses:
      "Primarily ornamental; widely used as an indoor decorative plant in homes and offices. Considered a good-luck plant in Asian culture (feng shui). Known for its air-purifying qualities.",
    notes:
      "A commercial hybrid cultivar popular in the Philippine ornamental plant trade. The trade name 'Fugui' derives from Chinese, meaning wealth and prosperity.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[4] C. V. Asios, Plants of the Philippines. Manila: Philippine Government Publication, 1991, ISBN 91298D.",
    ],
    aliases: [
      "aglaonema fugui red",
      "aglaonema",
      "fugui red",
      "chinese evergreen",
    ],
  },
  {
    id: 2,
    primaryName: "Aloe Vera",
    commonNames: ["Aloe Vera", "Burn Plant", "Medicinal Aloe"],
    scientificName: "Aloe vera (L.) Burm.f.",
    family: "Asphodelaceae (formerly Liliaceae / Xanthorrhoeaceae)",
    origin:
      "Arabian Peninsula (originally); now naturalized and widely cultivated throughout the tropics and subtropics worldwide, including the Philippines.",
    physicalDescription:
      "Stemless or short-stemmed succulent perennial, 60–100 cm tall. Leaves are thick, fleshy, lance-shaped, bluish-green with whitish speckles when young, serrated margins with white teeth. Produces tall racemose spikes of tubular yellow to orange flowers. Sap (gel) is clear and mucilaginous.",
    careRequirements:
      "Light: Full sun to bright indirect light. Water: Drought-tolerant; water deeply but infrequently; allow soil to dry completely. Soil: Sandy, well-drained cactus or succulent mix. Temperature: 13–27°C; frost-sensitive.",
    uses:
      "Widely used medicinally for burns, skin irritation, and wound healing. Gel is a major ingredient in cosmetics, pharmaceuticals, and food supplements. Grown as an ornamental succulent and traditional medicinal plant throughout the Philippines.",
    notes:
      "One of the most economically important medicinal plants worldwide. The Philippine Department of Agriculture (DA) recognizes Aloe vera as an important medicinal crop.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[2] C. Earley, Plants. Minneapolis, MN: Hungry Tomato / Lerner Publishing, 2022, ISBN 978-1-638-97834-3.",
      "[3] I. R. Castro, A Guide on Families of Common Flowering Plants in the Philippines. Los Baños, Laguna: University of the Philippines Los Baños, 2006, ISBN 978-971-542-525-4.",
    ],
    aliases: ["aloe vera", "aloe", "burn plant", "medicinal aloe"],
  },
  {
    id: 3,
    primaryName: "Anahaw",
    commonNames: [
      "Anahaw",
      "Luyong",
      "Fan Palm",
      "Table Palm",
      "Serdang Palm",
    ],
    scientificName:
      "Saribus rotundifolius (Lam.) Blume (syn. Livistona rotundifolia (Lam.) Mart.)",
    family: "Arecaceae",
    origin:
      "Southeast Asia: Philippines, Borneo, Sulawesi, Maluku, and Lesser Sunda Islands. Found in mountainous pluvial forests at low to medium altitudes.",
    physicalDescription:
      "Medium to large solitary palm, reaching 20–30 m in natural habitat; garden specimens usually shorter. Trunk solitary, smooth, brown, 20–25 cm diameter, marked by prominent leaf-scar rings. Leaves large, rounded, palmate, glossy dark green, shallowly divided with numerous stiff lobes; petioles armed with spines.",
    careRequirements:
      "Light: Full sun exposure. Water: Moderate; tolerates seasonal dryness. Soil: Rich, well-drained loam. Temperature: Tropical; sensitive to prolonged frost. Propagation from seed.",
    uses:
      "Culturally significant as the National Leaf of the Philippines. Leaves traditionally used for thatching, weaving hats, fans, and containers. Bud eaten as a vegetable. Trunk used as timber for construction, flooring, and tool handles.",
    notes:
      "Recognized in Castro (2006) under Arecaceae as a prominent Philippine palm. The genus Saribus was re-established in 2011 by DNA research.",
    citations: [
      "[3] I. R. Castro, A Guide on Families of Common Flowering Plants in the Philippines. Los Baños, Laguna: University of the Philippines Los Baños, 2006, ISBN 978-971-542-525-4.",
      "[4] C. V. Asios, Plants of the Philippines. Manila: Philippine Government Publication, 1991, ISBN 91298D.",
    ],
    aliases: [
      "anahaw",
      "luyong",
      "fan palm",
      "serdang",
      "livistona rotundifolia",
      "saribus rotundifolius",
    ],
  },
  {
    id: 4,
    primaryName: "Anthurium",
    commonNames: [
      "Anthurium",
      "Flamingo Flower",
      "Tailflower",
      "Painter's Palette",
    ],
    scientificName: "Anthurium andraeanum Linden ex André (and related species/hybrids)",
    family: "Araceae",
    origin:
      "Tropical regions of Central and South America (Colombia and Ecuador for A. andraeanum). Grows as epiphytes or terrestrials in humid tropical forests.",
    physicalDescription:
      "Evergreen perennial herb. Leaves large, dark glossy green, heart-shaped to arrow-shaped, leathery. The distinctive inflorescence consists of a waxy, shiny spathe in shades of red, pink, orange, white, or green, and a slender, elongated spadix bearing tiny true flowers.",
    careRequirements:
      "Light: Bright indirect light; avoid direct sun. Water: Keep moist but well-drained; reduce in winter. Soil: Loose, well-draining mix with orchid bark or perlite. Temperature: 18–29°C; high humidity preferred.",
    uses:
      "Major ornamental and cut-flower crop worldwide. The spathes are long-lasting in arrangements. Commercially important in the Philippines for floriculture.",
    notes:
      "Described in Pollock & Griffith (2005) under Araceae. Numerous cultivars and hybrids are available in Philippine markets.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[3] I. R. Castro, A Guide on Families of Common Flowering Plants in the Philippines. Los Baños, Laguna: University of the Philippines Los Baños, 2006, ISBN 978-971-542-525-4.",
    ],
    aliases: [
      "anthurium",
      "flamingo flower",
      "tailflower",
      "painter's palette",
      "andraeanum",
    ],
  },
  {
    id: 5,
    primaryName: "Sansevieria Bacularis (Money Catcher)",
    commonNames: [
      "Snake Plant Bacularis",
      "Money Catcher",
      "Rod-Leaved Snake Plant",
    ],
    scientificName:
      "Dracaena bacularis (Mikl.) Byng & Christenh. (syn. Sansevieria bacularis Mikl.)",
    family: "Asparagaceae",
    origin:
      "Native to tropical West Africa (Nigeria, Congo region) and parts of southern Asia. Also cultivated commercially in Costa Rica, Guatemala, Thailand, and China.",
    physicalDescription:
      "Stemless succulent perennial. Leaves are cylindrical, erect, dark green with subtle lighter green horizontal stripes, growing in clusters from rhizomes. Leaves reach up to 2 m in natural habitat; commonly 30–60 cm as a houseplant.",
    careRequirements:
      "Light: Bright indirect light preferred; tolerates low light. Water: Allow soil to dry completely between waterings; highly drought-tolerant. Soil: Well-draining sandy or cactus mix. Temperature: Above 13°C (55°F); frost-sensitive.",
    uses:
      "Popular ornamental houseplant prized for its modern, minimalist appearance and low-maintenance requirements. Widely sold in Philippine plant shops as 'Money Catcher' due to feng shui associations with attracting wealth.",
    notes:
      "The name 'Bacularis' derives from Latin baculum (stick), describing the cylindrical leaves. It is now officially reclassified under Dracaena following molecular phylogenetic studies.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[2] C. Earley, Plants. Minneapolis, MN: Hungry Tomato / Lerner Publishing, 2022, ISBN 978-1-638-97834-3.",
    ],
    aliases: [
      "sansevieria bacularis",
      "bacularis",
      "money catcher",
      "dracaena bacularis",
      "rod-leaved snake plant",
    ],
  },
  {
    id: 6,
    primaryName: "Bromeliad",
    commonNames: ["Bromeliad", "Vase Plant", "Air Pine"],
    scientificName:
      "Various genera and species of family Bromeliaceae (e.g., Guzmania spp., Neoregelia spp., Vriesea spp., Aechmea fasciata Bak.)",
    family: "Bromeliaceae",
    origin:
      "Primarily tropical and subtropical Americas; a few species from West Africa. Grow as epiphytes, lithophytes, or terrestrials in diverse habitats from rainforests to deserts.",
    physicalDescription:
      "Rosette-forming plants with stiff, strap-like leaves often arranged in a water-holding central cup (tank). Leaf colors range from green to red, burgundy, striped, or banded. Inflorescence is central, often brightly colored with small true flowers.",
    careRequirements:
      "Light: Bright indirect light to partial shade. Water: Keep central cup filled with water; water substrate sparingly. Soil: Epiphytic or loose, free-draining medium. Temperature: Tropical; 18–27°C preferred.",
    uses:
      "Highly popular ornamental plants in the Philippines and worldwide for their colorful, long-lasting inflorescences. Used in indoor decoration, landscaping, and as cut flowers.",
    notes:
      "'Bromeliad' is a collective common name for hundreds of species. Philippine plant markets trade various Guzmania and Neoregelia cultivars.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[2] C. Earley, Plants. Minneapolis, MN: Hungry Tomato / Lerner Publishing, 2022, ISBN 978-1-638-97834-3.",
    ],
    aliases: [
      "bromeliad",
      "bromeliad lipstick",
      "vase plant",
      "air pine",
      "guzmania",
      "neoregelia",
    ],
  },
  {
    id: 7,
    primaryName: "Calathea Dottie",
    commonNames: ["Calathea Dottie", "Rose-Painted Calathea", "Prayer Plant Dottie"],
    scientificName:
      "Goeppertia roseopicta 'Dottie' (Linden) Borchs. & S.Suárez (syn. Calathea roseopicta 'Dottie')",
    family: "Marantaceae",
    origin:
      "Species native to the tropical rainforests of South America (Brazil, Colombia, Ecuador, Peru). 'Dottie' is a cultivar discovered in Apopka, Florida (USA) in 1998 as a natural mutation.",
    physicalDescription:
      "Bushy herbaceous perennial, 30–90 cm tall and up to 60 cm wide. Leaves broad, round, thick, dark green to almost black with vivid pink or fuchsia outlines along midrib and margins. Leaf undersides are deep purple-maroon.",
    careRequirements:
      "Light: Bright to medium indirect light; avoid direct sun. Water: Keep soil consistently moist with soft, filtered, or rainwater. Soil: Well-draining peat/coir-based mix. Temperature: 18–27°C; requires high humidity.",
    uses:
      "Prized ornamental houseplant for its striking, nearly-black foliage with vivid pink markings. Pet-friendly (non-toxic to cats and dogs). Adds dramatic color contrast to indoor spaces.",
    notes:
      "The genus Goeppertia was resurrected in 2012 following molecular phylogenetic studies reclassifying most Calathea species. The trade name 'Calathea Dottie' remains in wide use.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[2] C. Earley, Plants. Minneapolis, MN: Hungry Tomato / Lerner Publishing, 2022, ISBN 978-1-638-97834-3.",
    ],
    aliases: ["calathea dottie", "dottie", "goeppertia roseopicta", "prayer plant dottie"],
  },
  {
    id: 8,
    primaryName: "Dendrobium Orchid",
    commonNames: ["Dendrobium Orchid", "Cane Orchid"],
    scientificName: "Dendrobium Sw. (genus; type species D. moniliforme (L.) Sw.)",
    family: "Orchidaceae",
    origin:
      "Widely distributed across Asia, Australia, and the Pacific; major diversity centers in the Himalayan region, Southeast Asia, and Australia. Many Philippine-native species exist.",
    physicalDescription:
      "Epiphytic or lithophytic orchids with sympodial growth. Pseudobulbs (canes) erect to pendulous, leafy when young. Leaves narrow to oblong, arranged alternately. Flowers produced in clusters along canes or at apex, highly variable in color.",
    careRequirements:
      "Light: Bright indirect light to filtered full sun. Water: Water freely in growth season; reduce in dry/cool season. Soil/medium: Epiphytic mix (bark, perlite). Temperature: Warm-growing types 18–32°C.",
    uses:
      "Dendrobium is one of the largest orchid genera (>1,800 species). Highly important in the Philippine ornamental flower trade and cultural celebrations. Used in cut-flower industry and as potted ornamentals.",
    notes:
      "The Philippines is a center of orchid diversity with many endemic Dendrobium species. Recognized in Pollock & Griffith (2005) and extensively covered in Castro (2006).",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[3] I. R. Castro, A Guide on Families of Common Flowering Plants in the Philippines. Los Baños, Laguna: University of the Philippines Los Baños, 2006, ISBN 978-971-542-525-4.",
    ],
    aliases: ["dendrobium orchid", "dendrobium", "cane orchid"],
  },
  {
    id: 9,
    primaryName: "Fortune Plant",
    commonNames: [
      "Fortune Plant",
      "Lucky Bamboo",
      "Friendship Bamboo",
      "Chinese Water Bamboo",
    ],
    scientificName: "Dracaena sanderiana Sander ex Mast.",
    family: "Asparagaceae",
    origin:
      "Native to tropical western Africa (equatorial region). Despite common names suggesting Asian origin, it is an African species now widely cultivated throughout Asia.",
    physicalDescription:
      "Perennial herb reaching 60–100 cm tall. Stems slender, fleshy, bamboo-like (not true bamboo), capable of being trained into spirals or braids. Leaves lance-shaped, slightly twisted, gray-green, 15–23 cm long.",
    careRequirements:
      "Light: Low to moderate indirect light. Water: Can grow hydroponically in water or in moist well-drained soil; change water weekly if grown in water. Soil: Optional; moist, well-drained mix if potted. Temperature: 18–32°C.",
    uses:
      "Hugely popular ornamental plant in the Philippines and throughout Asia, strongly associated with feng shui. Number of stalks carries symbolic meaning. Common gift for homes and businesses.",
    notes:
      "Despite the common name 'Lucky Bamboo,' D. sanderiana is not related to bamboo (family Poaceae). The Philippine trade widely uses the name 'Fortune Plant.'",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[2] C. Earley, Plants. Minneapolis, MN: Hungry Tomato / Lerner Publishing, 2022, ISBN 978-1-638-97834-3.",
    ],
    aliases: [
      "fortune plant",
      "lucky bamboo",
      "dracaena sanderiana",
      "friendship bamboo",
      "chinese water bamboo",
    ],
  },
  {
    id: 10,
    primaryName: "Mirror Magic",
    commonNames: ["Mirror Magic", "Philodendron Mirror Magic", "Jungle Boogie"],
    scientificName:
      "Philodendron 'Mirror Magic' (hort.) — a hybrid/cultivar of the genus Philodendron Schott",
    family: "Araceae",
    origin:
      "Genus native to tropical Americas (Caribbean, Central and South America). 'Mirror Magic' is a horticultural hybrid widely produced in Asian nurseries.",
    physicalDescription:
      "Upright to semi-climbing evergreen tropical plant. Leaves are large, deeply lobed, shiny dark green with a reflective, mirror-like surface sheen (giving the cultivar its name). Petioles are firm. Growth is moderate as a potted houseplant.",
    careRequirements:
      "Light: Bright indirect light preferred; tolerates moderate shade. Water: Water when top inch of soil dries; avoid waterlogging. Soil: Well-draining, aerated potting mix. Temperature: 18–29°C; tropical humidity beneficial.",
    uses:
      "Ornamental houseplant; popular as an indoor statement plant in the Philippines. The glossy leaf surface gives a distinctive decorative effect.",
    notes:
      "'Mirror Magic' is a trade/cultivar name that does not correspond to a formally described botanical species. Also sold in Philippine markets as 'Alocasia Magic Mirror.'",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
    ],
    aliases: [
      "mirror magic",
      "philodendron mirror magic",
      "jungle boogie",
      "alocasia magic mirror",
      "magic mirror",
    ],
  },
  {
    id: 11,
    primaryName: "Orbifolia",
    commonNames: ["Orbifolia", "Prayer Plant", "Calathea Orbifolia"],
    scientificName:
      "Goeppertia orbifolia (Linden) Borchs. & S.Suárez (syn. Calathea orbifolia (Linden) H.Kenn.)",
    family: "Marantaceae",
    origin:
      "Native to the tropical rainforests of Bolivia (and possibly adjacent Brazil). Grows on the humid forest floor under dense canopy.",
    physicalDescription:
      "Herbaceous perennial, 60–90 cm tall and wide. Leaves large, round to oval, pale to medium green with broad silvery-green bands, slightly wavy margins; individual stems arise from soil.",
    careRequirements:
      "Light: Bright to medium indirect light; avoid direct sun. Water: Consistently moist but not soggy; use filtered or rainwater. Soil: Two parts peat/coir plus one part perlite. Temperature: 18–24°C; high humidity essential.",
    uses:
      "Highly prized ornamental houseplant for its bold, graphic foliage. Non-toxic to pets and humans. One of the most popular Calathea types in the Philippine indoor plant market.",
    notes:
      "Reclassified from Calathea to Goeppertia in 2012 following molecular studies. Remains commonly marketed as 'Calathea orbifolia' in trade.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[2] C. Earley, Plants. Minneapolis, MN: Hungry Tomato / Lerner Publishing, 2022, ISBN 978-1-638-97834-3.",
    ],
    aliases: ["orbifolia", "calathea orbifolia", "goeppertia orbifolia", "prayer plant orbifolia"],
  },
  {
    id: 12,
    primaryName: "Peace Lily",
    commonNames: [
      "Peace Lily",
      "White Anthurium",
      "White Sails",
      "Spathe Flower",
    ],
    scientificName:
      "Spathiphyllum wallisii Regel (and S. floribundum, and commercial hybrids)",
    family: "Araceae",
    origin:
      "Tropical Americas (Colombia, Venezuela) and Southeast Asia (some species). Grows in moist tropical forests, often in shaded, humid understories.",
    physicalDescription:
      "Evergreen clump-forming perennial, typically 40–90 cm tall. Leaves lance-shaped, dark glossy green, arising from soil. Produces conspicuous white spathes surrounding a white to cream spadix bearing tiny fragrant flowers.",
    careRequirements:
      "Light: Moderate to low indirect light; tolerates low light. Water: Keep moist; wilts visibly when water-stressed but recovers quickly. Soil: Rich, well-draining mix. Temperature: 18–29°C; high humidity preferred.",
    uses:
      "One of the most popular indoor ornamental plants globally and in the Philippines. Valued for its elegant white flowers, dark glossy foliage, and air-purifying properties.",
    notes:
      "Recognized in Pollock & Griffith (2005). Castro (2006) notes Spathiphyllum under Araceae as a cultivated ornamental in the Philippines.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[3] I. R. Castro, A Guide on Families of Common Flowering Plants in the Philippines. Los Baños, Laguna: University of the Philippines Los Baños, 2006, ISBN 978-971-542-525-4.",
    ],
    aliases: [
      "peace lily",
      "spathiphyllum",
      "white sails",
      "spathe flower",
      "white anthurium",
    ],
  },
  {
    id: 13,
    primaryName: "Philodendron Birkin",
    commonNames: ["Philodendron Birkin", "White Wave Philodendron"],
    scientificName:
      "Philodendron 'Birkin' (hort.) — hybrid/cultivar; closely related to Philodendron erubescens K.Koch & Augustin",
    family: "Araceae",
    origin:
      "Horticultural hybrid; genus native to tropical America (Colombia and surrounding regions for the parent species).",
    physicalDescription:
      "Compact, upright evergreen perennial. Leaves are rounded to oval, dark green with distinctive creamy-white to pale yellow pinstripes radiating from the midrib outward. Mature leaves can develop pink or red coloration near the center.",
    careRequirements:
      "Light: Bright indirect light; pinstripe variegation most vivid with adequate light. Water: Water when top inch dries; drought-sensitive. Soil: Loose, well-draining mix. Temperature: 18–29°C.",
    uses:
      "Highly popular ornamental houseplant in the Philippines and worldwide, prized for its distinctive pinstripe pattern. Relatively compact size makes it suitable for shelves and small spaces.",
    notes:
      "'Birkin' originated as a spontaneous mutation from 'Rojo Congo' Philodendron. It is a registered trade variety, not a wild species.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
    ],
    aliases: ["philodendron birkin", "birkin", "white wave philodendron"],
  },
  {
    id: 14,
    primaryName: "Rubber Fig",
    commonNames: ["Rubber Fig", "Rubber Plant", "Rubber Tree", "Indian Rubber Bush"],
    scientificName: "Ficus elastica Roxb. ex Hornem.",
    family: "Moraceae",
    origin:
      "Native to eastern South Asia and Southeast Asia (India, Nepal, Bhutan, Myanmar, southern China, Malaysia, Indonesia). Grows in tropical and subtropical moist forests.",
    physicalDescription:
      "Large evergreen tree to 30–40 m in the wild; maintained as a shrub or small tree indoors (1–3 m). Leaves large, thick, leathery, glossy dark green to burgundy, oblong-elliptic, 10–35 cm long. Exudes white latex when cut.",
    careRequirements:
      "Light: Bright indirect light; tolerates moderate shade. Water: Allow top 2–3 cm of soil to dry between waterings. Soil: Well-draining potting mix. Temperature: 15–30°C; avoid cold drafts.",
    uses:
      "Popular indoor ornamental plant worldwide including the Philippines, for its bold foliage and architectural form. Latex used historically for rubber production before Hevea brasiliensis became dominant.",
    notes:
      "Pollock & Griffith (2005) describe Ficus elastica as a significant ornamental tree. Castro (2006) lists Ficus under Moraceae in the Philippine context.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[3] I. R. Castro, A Guide on Families of Common Flowering Plants in the Philippines. Los Baños, Laguna: University of the Philippines Los Baños, 2006, ISBN 978-971-542-525-4.",
    ],
    aliases: [
      "rubber fig",
      "rubber plant",
      "rubber tree",
      "ficus elastica",
      "rubber",
    ],
  },
  {
    id: 15,
    primaryName: "Sahod Yaman",
    commonNames: [
      "Sahod Yaman",
      "Split-Leaf Philodendron",
      "Tree Philodendron",
      "Lacy Tree Philodendron",
      "Philodendron Hope",
    ],
    scientificName:
      "Thaumatophyllum bipinnatifidum (Schott ex Endl.) Sakur., Calazans & Mayo (syn. Philodendron bipinnatifidum Schott ex Endl.; P. selloum K.Koch)",
    family: "Araceae",
    origin:
      "Native to South Brazil, Paraguay, Argentina, and Bolivia. Found in tropical and subtropical moist forests.",
    physicalDescription:
      "Large, robust evergreen perennial forming a self-heading rosette. Leaves very large (up to 90 cm), deeply lobed and pinnately divided, dark shiny green, on long petioles. With age develops a trunk-like stem.",
    careRequirements:
      "Light: Bright indirect light; tolerates partial shade. Water: Moist but not soggy soil; reduce in dry periods. Soil: Rich, well-draining potting mix. Temperature: 18–30°C; frost-sensitive.",
    uses:
      "Very popular ornamental in the Philippines where it is marketed as 'Sahod Yaman' (literally 'receiving wealth'), reflecting its cultural association with prosperity. Used as a large statement plant for living rooms and office interiors.",
    notes:
      "The genus name was changed from Philodendron to Thaumatophyllum following molecular phylogenetic research published in 2018. The Philippine trade name 'Sahod Yaman' is unique to the local market.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[3] I. R. Castro, A Guide on Families of Common Flowering Plants in the Philippines. Los Baños, Laguna: University of the Philippines Los Baños, 2006, ISBN 978-971-542-525-4.",
    ],
    aliases: [
      "sahod yaman",
      "philodendron selloum",
      "selloum",
      "split-leaf philodendron",
      "tree philodendron",
      "thaumatophyllum bipinnatifidum",
      "philodendron hope",
    ],
  },
  {
    id: 16,
    primaryName: "San Francisco Plant",
    commonNames: [
      "San Francisco Plant",
      "Croton",
      "Garden Croton",
      "Sagilala",
      "Tuwi",
      "Deliciosa",
    ],
    scientificName: "Codiaeum variegatum (L.) Rumph. ex A.Juss.",
    family: "Euphorbiaceae",
    origin:
      "Native to Southeast Asia (Malesia: Indonesia, Malaysia, Philippines, Sulawesi, Borneo, Maluku, Papuasia, Queensland, and Pacific islands). Found in open forests and scrub.",
    physicalDescription:
      "Tropical evergreen shrub, 1–3 m tall. Leaves alternate, leathery, highly variable in shape and color (red, orange, yellow, green, purple, brown, variegated); several hundred cultivars exist.",
    careRequirements:
      "Light: Full sun to bright indirect light; best color in good light. Water: Moderate; keep soil moist but drained; sensitive to drying out. Soil: Rich, well-draining mix. Temperature: Tropical; 18–30°C.",
    uses:
      "One of the most commonly cultivated ornamental shrubs in the Philippines. Known locally as 'San Francisco plant' and 'Sagilala.' Used extensively as a hedge, border plant, and potted ornamental.",
    notes:
      "Castro (2006) includes Euphorbiaceae prominently in Philippine flowering plant families, with Codiaeum as a key ornamental genus. The 'San Francisco' name is specific to Philippine trade nomenclature.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[3] I. R. Castro, A Guide on Families of Common Flowering Plants in the Philippines. Los Baños, Laguna: University of the Philippines Los Baños, 2006, ISBN 978-971-542-525-4.",
      "[4] C. V. Asios, Plants of the Philippines. Manila: Philippine Government Publication, 1991, ISBN 91298D.",
    ],
    aliases: [
      "san francisco plant",
      "san francisco",
      "croton",
      "codiaeum variegatum",
      "sagilala",
      "garden croton",
    ],
  },
  {
    id: 17,
    primaryName: "Saplera",
    commonNames: [
      "Saplera",
      "Suplera",
      "Umbrella Plant",
      "Umbrella Tree",
      "Dwarf Umbrella Tree",
    ],
    scientificName:
      "Schefflera arboricola (Hayata) Merr. (syn. Heptapleurum arboricola Hayata)",
    family: "Araliaceae",
    origin:
      "Native to Taiwan and Hainan (China). Widely cultivated throughout tropical and subtropical regions, including the Philippines.",
    physicalDescription:
      "Shrubby evergreen perennial, typically 1–4 m as a potted plant. Leaves palmately compound with 7–9 oblong, glossy leaflets arranged in an umbrella or wheel shape.",
    careRequirements:
      "Light: Bright indirect to partial sun; variegated types need more light for color retention. Water: Water when top soil dries; drought-tolerant once established. Soil: Sandy, well-draining medium-moisture mix. Temperature: 15–30°C.",
    uses:
      "Very popular ornamental houseplant throughout the Philippines and South Asia. Used in interior design and landscaping. Variegated cultivar 'Gold Capella' particularly popular in Philippine markets as 'Saplera.'",
    notes:
      "'Saplera/Suplera' is the local Philippine and South Asian trade name for Schefflera arboricola. The species was formally described by Hayata and transferred to Schefflera by E.D. Merrill.",
    citations: [
      "[3] I. R. Castro, A Guide on Families of Common Flowering Plants in the Philippines. Los Baños, Laguna: University of the Philippines Los Baños, 2006, ISBN 978-971-542-525-4.",
    ],
    aliases: [
      "saplera",
      "suplera",
      "schefflera arboricola",
      "umbrella plant",
      "umbrella tree",
      "dwarf umbrella tree",
    ],
  },
  {
    id: 18,
    primaryName: "Golden Flame Snake Plant",
    commonNames: [
      "Golden Flame Snake Plant",
      "Golden Flame Sansevieria",
    ],
    scientificName:
      "Dracaena trifasciata 'Golden Flame' (Prain) Mabb. (syn. Sansevieria trifasciata 'Golden Flame' Prain)",
    family: "Asparagaceae",
    origin:
      "Species native to tropical West Africa. 'Golden Flame' is a cultivated variety.",
    physicalDescription:
      "Upright evergreen perennial. Leaves sword-shaped, forming a central rosette, typically 40–80 cm tall. Young leaves emerge brilliant yellow to golden-orange, gradually deepening to dark green with silver-grey tiger-stripe banding at maturity.",
    careRequirements:
      "Light: Moderate to bright indirect light; best golden color in bright light; adapts to low light. Water: Allow soil to dry completely between waterings; highly drought-tolerant. Soil: Well-draining, sandy cactus mix. Temperature: 15–35°C; frost-sensitive.",
    uses:
      "Highly ornamental houseplant valued for its dramatic golden-green color contrast. Air-purifying (filters benzene, formaldehyde). Low-maintenance; suitable for beginners.",
    notes:
      "The species Sansevieria trifasciata was reclassified as Dracaena trifasciata in 2017 following molecular research. 'Golden Flame' is a named cultivar widely available in Philippine plant shops.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[2] C. Earley, Plants. Minneapolis, MN: Hungry Tomato / Lerner Publishing, 2022, ISBN 978-1-638-97834-3.",
    ],
    aliases: [
      "golden flame snake plant",
      "golden flame sansevieria",
      "golden flame",
      "dracaena trifasciata golden flame",
      "sansevieria trifasciata golden flame",
      "snake plant golden flame",
    ],
  },
  {
    id: 19,
    primaryName: "Variegated Money Tree",
    commonNames: [
      "Variegated Money Tree",
      "Money Tree",
      "Guiana Chestnut",
      "Malabar Chestnut",
    ],
    scientificName: "Pachira aquatica Aubl. 'Variegata'",
    family: "Malvaceae (formerly Bombacaceae)",
    origin:
      "Species native to tropical wetlands and swamps of Central and South America (Mexico to Brazil). Grown worldwide as an ornamental.",
    physicalDescription:
      "Tropical evergreen tree; as a houseplant typically 0.5–2 m. Leaves palmately compound, usually 5–7 lance-shaped, shiny green leaflets; in 'Variegata' cultivar, leaflets are marbled with creamy white or yellow variegation.",
    careRequirements:
      "Light: Bright indirect light (brighter light maintains variegation). Water: Allow top few inches of soil to dry between waterings; do not overwater. Soil: Well-draining potting mix. Temperature: 18–30°C; 40–50% humidity.",
    uses:
      "Very popular as a feng shui plant associated with prosperity and good fortune in the Philippines and throughout Asia. Braided trunk symbolizes unity and growth. Seeds edible (taste similar to peanuts).",
    notes:
      "The braided money tree form was first popularized by a truck driver in Taiwan in the 1980s, quickly spreading to Japan and throughout East Asia. Widely sold in Philippine plant shops and nurseries.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[2] C. Earley, Plants. Minneapolis, MN: Hungry Tomato / Lerner Publishing, 2022, ISBN 978-1-638-97834-3.",
    ],
    aliases: [
      "variegated money tree",
      "money tree",
      "pachira aquatica",
      "guiana chestnut",
      "malabar chestnut",
    ],
  },
  {
    id: 20,
    primaryName: "Welcome Plant",
    commonNames: [
      "Welcome Plant",
      "Peace Lily",
      "White Anthurium",
      "Spathe Flower",
      "White Sails",
    ],
    scientificName:
      "Spathiphyllum wallisii Regel (and commercial hybrids; Schott, genus 1832)",
    family: "Araceae",
    origin:
      "Tropical Americas (Colombia, Venezuela) and parts of Southeast Asia. In Philippine context, refers to Spathiphyllum cultivars commonly placed at home entrances.",
    physicalDescription:
      "Evergreen perennial herb, typically 45–90 cm tall (larger hybrid cultivars to 120 cm). Leaves lance-shaped, dark glossy green, on long petioles. Inflorescence: prominent white to greenish-white spathe with an erect creamy-white spadix.",
    careRequirements:
      "Light: Low to moderate indirect light; one of the few flowering plants that blooms in low light. Water: Keep consistently moist; shows drooping when thirsty. Soil: Rich, well-draining organic mix. Temperature: 18–29°C; high humidity.",
    uses:
      "The 'Welcome Plant' trade name in the Philippines specifically refers to Peace Lily cultivars used near doorways and entrances of homes, offices, and businesses for their feng shui significance. Widely used as a housewarming gift.",
    notes:
      "Peace Lily and Welcome Plant refer to the same botanical species — Spathiphyllum wallisii and its commercial hybrids — but are listed separately as distinct trade names used in the Philippine ornamental plant market.",
    citations: [
      "[1] M. Pollock and M. Griffith, Illustrated Dictionary of Gardening. London: Dorling Kindersley, 2005, ISBN 0-7566-1480-5.",
      "[3] I. R. Castro, A Guide on Families of Common Flowering Plants in the Philippines. Los Baños, Laguna: University of the Philippines Los Baños, 2006, ISBN 978-971-542-525-4.",
    ],
    aliases: ["welcome plant", "welcome"],
  },
];

export const PRIORITY_PLANT_NAMES = VALIDATED_PLANTS.map(
  (plant) => plant.primaryName
);
