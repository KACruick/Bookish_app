from app.models import db, Book, environment, SCHEMA
from sqlalchemy.sql import text

def seed_books():
    books = [
        Book(
            title="Priory of the Orange Tree",
            author="Samantha Shannon",
            userId=1,  # Kendra
            genreId=1,  # Fantasy
            isbn=9781635570302,
            pages=848,
            chapters=50,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1700221964i/40275288.jpg",
            yearPublished=2019,
            description="A stunning epic fantasy about a world on the brink of war and the unexpected heroes who will rise to fight for their survival."
        ),
        Book(
            title="Fourth Wing",
            author="Rebecca Yarros",
            userId=2,  # Olivia
            genreId=1,  # Fantasy
            isbn=9781542029454,
            pages=400,
            chapters=42,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1701980900i/61431922.jpg",
            yearPublished=2023,
            description="A gripping novel that follows two people whose lives intertwine in the world of war, loss, and survival."
        ),
        Book(
            title="The Bone Season",
            author="Samantha Shannon",
            userId=3,  # Jaime
            genreId=1,  # Fantasy
            isbn=9781408857492,
            pages=480,
            chapters=50,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1708967938i/195391688.jpg",
            yearPublished=2013,
            description="A dark fantasy series set in a world where clairvoyants are hunted by the government, but some of them are hiding a much larger secret."
        ),
        Book(
            title="Water Moon",
            author="Samantha Sotto Yambao",
            userId=4,  # Laura
            genreId=1,  # Fantasy
            isbn=9780984637599,
            pages=306,
            chapters=40,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1713235038i/211479192.jpg",
            yearPublished=2011,
            description="A young woman embarks on a quest to uncover the secrets of her family's past while battling forces beyond her control."
        ),
        Book(
            title="The Night Ends with Fire",
            author="K.X. Song",
            userId=5,  # Donna
            genreId=1,  # Fantasy
            isbn=9780999457592,
            pages=232,
            chapters=23,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1717503808i/201129898.jpg",
            yearPublished=2016,
            description="A gripping fantasy where the fate of the world rests on a young hero's shoulders."
        ),
        Book(
            title="Godkiller",
            author="Hannah Kaner",
            userId=1,
            genreId=1,  # Fantasy
            isbn=9780593333629,
            pages=400,
            chapters=40,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659863757i/61244268.jpg",
            yearPublished=2022,
            description="A dark fantasy novel that delves into gods, mortals, and the revenge of a woman driven by loss."
        ),
        Book(
            title="Wolfsong",
            author="T.J. Klune",
            userId=2,
            genreId=1,  # Fantasy
            isbn=9781644053405,
            pages=384,
            chapters=30,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1686575943i/62039417.jpg",
            yearPublished=2016,
            description="A werewolf story that explores love, loyalty, and the bonds that can never be broken."
        ),
        Book(
            title="House of Earth and Blood",
            author="Sarah J. Maas",
            userId=3,
            genreId=1,  # Fantasy
            isbn=9781635572221,
            pages=803,
            chapters=80,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1559142847i/44778083.jpg",
            yearPublished=2020,
            description="A fast-paced urban fantasy that tells the story of Bryce Quinlan, who seeks revenge in a world of danger and betrayal."
        ),
        Book(
            title="The Invisible Life of Addie LaRue",
            author="V.E. Schwab",
            userId=4,
            genreId=1,  # Fantasy
            isbn=9780765387561,
            pages=448,
            chapters=40,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1584633432i/50623864.jpg",
            yearPublished=2020,
            description="A beautifully tragic story of a woman cursed to be forgotten by everyone she meets until she crosses paths with someone who remembers."
        ),
        Book(
            title="The Eye of the World",
            author="Robert Jordan",
            userId=5,
            genreId=2,  # Fantasy
            isbn=9780765302306,
            pages=800,
            chapters=50,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1638972287i/58267955.jpg",
            yearPublished=1990,
            description="The first book in the Wheel of Time series, following Rand al'Thor as he is swept up into an epic battle between good and evil."
        ),
        Book(
            title="Deep End",
            author="Ali Hazelwood",
            userId=1,
            genreId=3,  # Romance
            isbn=9780593438973,
            pages=336,
            chapters=30,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1718998299i/212808709.jpg",
            yearPublished=2023,
            description="A thrilling romance that focuses on two people with starkly different goals who find themselves drawn to each other unexpectedly."
        ),
        Book(
            title="Happiness for Beginners",
            author="Katherine Center", 
            userId=2,
            genreId=3,  # Romance
            isbn=9781250781461, 
            pages=352, 
            chapters=30, 
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1656355023i/61361515.jpg", 
            yearPublished=2023, 
            description="A feel-good romance about a woman who, after a life-changing event, heads into the wilderness on a hiking trip with strangers and finds more than she expected."
        ),
        Book(
            title="Love and Other Words",
            author="Christina Lauren",
            userId=3,
            genreId=3,  # Romance
            isbn=9781982168008,
            pages=432,
            chapters=40,
            coverPicture="",
            yearPublished=2018,
            description="A heartwarming story of love, loss, and second chances, told through the lens of a childhood romance that remains a pivotal part of the heroine’s life."
        ),
        Book(
            title="Not Another Love Song",
            author="Julie Soto",
            userId=4,
            genreId=3,  # Romance
            isbn=9780593422286,
            pages=352,
            chapters=32,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1705055802i/201627074.jpg",
            yearPublished=2023,
            description="A coming-of-age romance that follows a young woman grappling with the desire for love and a passion for songwriting."
        ),
        Book(
            title="Forget Me Not",
            author="Julie Soto",
            userId=5,
            genreId=3,  # Romance
            isbn=9780593422309,
            pages=320,
            chapters=28,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1667451611i/61618737.jpg",
            yearPublished=2023,
            description="A romance about two people trying to forget their past while realizing that their hearts are tied in ways they can't control."
        ),
        Book(
            title="The Seven Year Slip",
            author="Ashley Poston",
            userId=1,
            genreId=3,  # Romance
            isbn=9780593337344,
            pages=336,
            chapters=29,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1685350807i/62926938.jpg",
            yearPublished=2023,
            description="A magical romance about love, loss, and second chances that explores the impact of time and fate on relationships."
        ),
        Book(
            title="The Ex Hex",
            author="Erin Sterling",
            userId=2,
            genreId=3,  # Romance
            isbn=9780063030256,
            pages=368,
            chapters=30,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1619305366i/56554626.jpg",
            yearPublished=2021,
            description="A witchy romance about a young woman who accidentally curses her ex-boyfriend and must face the consequences when he returns to town."
        ),
        Book(
            title="The Dead Romantics",
            author="Ashley Poston",
            userId=3,
            genreId=3,  # Romance
            isbn=9780593337245,
            pages=400,
            chapters=36,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1649027850i/58885776.jpg",
            yearPublished=2022,
            description="A romance with a supernatural twist that follows a ghostwriter for romance novels as she comes to terms with her own love life and the ghosts that haunt her."
        ),
        Book(
            title="Not in Love",
            author="Ali Hazelwood",
            userId=4,
            genreId=3,  # Romance
            isbn=9780593495761,
            pages=384,
            chapters=34,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1696574108i/198716261.jpg",
            yearPublished=2023,
            description="A heartwarming romance about a woman who has sworn off love, but the universe seems determined to prove her wrong."
        ),
        Book(
            title="The Women",
            author="Kristin Hannah",
            description="Set against the backdrop of World War II, 'The Women' focuses on the lives of a group of women caught up in the tragedy of war and the complexities of their emotional and personal journeys.",
            userId=5,
            genreId=8,  # Historical Fiction
            isbn=9781250277010,
            pages=400,
            chapters=30,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1733493019i/127305853.jpg",
            yearPublished=2021
        ),
        Book(
            title="The Nightingale",
            author="Kristin Hannah",
            description="The Nightingale tells the story of two sisters in France during World War II, exploring their personal struggles and the impact of the war on their lives.",
            userId=1, 
            genreId=8,  # Historical Fiction
            isbn=9780312577227,
            pages=440,
            chapters=29,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1681839850i/21853621.jpg",
            yearPublished=2015
        ),
        Book(
            title="The Frozen River",
            author="Ariel Lawhon",
            description="'The Frozen River' is a historical fiction novel that explores the lives of women in a small American town during the Civil War era, and how their lives intersect during a tragic event.",
            userId=2, 
            genreId=8,  # Historical Fiction
            isbn=9780399586734,
            pages=352,
            chapters=30,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1730395034i/112975658.jpg",
            yearPublished=2020
        ),
        Book(
            title="The Quiet Librarian",
            author="Allen Eskens",
            description="The Quiet Librarian tells the story of a woman who has lived a quiet life but is forced to confront dark secrets from her past as she unravels a mystery.",
            userId=3,  
            genreId=8,  # Historical Fiction
            isbn=9781476724488,
            pages=352,
            chapters=32,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1730748199i/214175092.jpg",
            yearPublished=2021
        ),
        Book(
            title="Lady Clementine",
            author="Marie Benedict",
            description="This historical novel focuses on the life of Clementine Churchill, wife of Winston Churchill, highlighting her role in World War II and the personal sacrifices she made.",
            userId=4, 
            genreId=8,  # Historical Fiction
            isbn=9781492678882,
            pages=400,
            chapters=30,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1557531518i/45007887.jpg",
            yearPublished=2020
        ),
        Book(
            title="The Silk House",
            author="Kayte Nunn",
            description="'The Silk House' is a tale set in England, where a woman uncovers hidden secrets as she explores an ancient house tied to an old, unsolved mystery.",
            userId=5, 
            genreId=8,  # Historical Fiction
            isbn=9781492689512,
            pages=432,
            chapters=35,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586137191i/52972463.jpg",
            yearPublished=2020
        ),
        Book(
            title="James",
            author="Percival Everett",
            description="'James' is a historical novel by Percival Everett that explores the complexities of race, identity, and family in the United States during a time of social unrest.",
            userId=1,  
            genreId=8,  # Historical Fiction
            isbn=9781643751394,
            pages=304,
            chapters=22,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1704107491i/173754979.jpg",
            yearPublished=2020
        ),
        Book(
            title="The Prison Healer",
            author="Lynette Noni",
            description="Seventeen-year-old Kiva Meridan has spent the last ten years fighting for survival in the notorious death prison, Zalindov, working as the prison healer.",
            userId=2,
            genreId=4,  # Fantasy
            isbn=9781922330006,
            pages=400,
            chapters=30,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1593147576i/53968496.jpg",
            yearPublished=2021
        ),
        Book(
            title="The Gilded Cage",
            author="Lynette Noni",
            description="Kiva Meridan is a survivor. She survived not only Zalindov prison, but also the deadly Trial by Ordeal. Now Kiva's purpose goes beyond survival to vengeance.",
            userId=3,
            genreId=4,  # Fantasy
            isbn=9781922330013,
            pages=400,
            chapters=30,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1608472691i/50882354.jpg",
            yearPublished=2022
        ),
        Book(
            title="Six Crimson Cranes",
            author="Elizabeth Lim",
            description="Shiori, the only princess of Kiata, has a secret: she can shape-shift into a crane. When her stepmother discovers her magic, she banishes Shiori and her six brothers, turning them into cranes.",
            userId=4,
            genreId=4,  # Fantasy
            isbn=9780593300912,
            pages=496,
            chapters=40,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1603387427i/53457092.jpg",
            yearPublished=2021
        ),
        Book(
            title="Howl's Moving Castle",
            author="Diana Wynne Jones",
            description="Sophie Hatter, cursed by a witch to become an old woman, seeks refuge in the moving castle of the mysterious wizard Howl.",
            userId=5,
            genreId=4,  # Fantasy
            isbn=9780061478789,
            pages=329,
            chapters=25,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1630502935i/6294.jpg",
            yearPublished=1986
        ),
        Book(
            title="Flamecaster",
            author="Cinda Williams Chima",
            description="A high fantasy novel set in the Seven Realms, following the journey of Ash, a young man with a dangerous secret.",
            userId=1,
            genreId=4,  # Fantasy
            isbn=9780062380946,
            pages=496,
            chapters=40,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553252988i/30531840.jpg",
            yearPublished=2016
        ),
        Book(
            title="Shadowcaster",
            author="Cinda Williams Chima",
            description="The sequel to Flamecaster, continuing the epic tale of Ash and his companions.",
            userId=1,
            genreId=4,  # Fantasy
            isbn=9780062380953,
            pages=496,
            chapters=40,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1483546794i/30253091.jpg",
            yearPublished=2017
        ),
        Book(
            title="Stormcaster",
            author="Cinda Williams Chima",
            description="The third installment in the Seven Realms series, following the adventures of Ash and his allies.",
            userId=1,
            genreId=4,  # Fantasy
            isbn=9780062380960,
            pages=496,
            chapters=40,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1500578312i/33816845.jpg",
            yearPublished=2018
        ),
        Book(
            title="Deathcaster",
            author="Cinda Williams Chima",
            description="The final book in the Seven Realms series, concluding the epic saga of Ash and his companions.",
            userId=1,
            genreId=4,  # Fantasy
            isbn=9780062380977,
            pages=496,
            chapters=40,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1529823092i/39320115.jpg",
            yearPublished=2019
        ),
        Book(
            title="The Hitchhiker’s Guide to the Galaxy",
            author="Douglas Adams",
            description="Arthur Dent is swept off Earth just before it's destroyed to make way for a hyperspace bypass, embarking on a cosmic adventure.",
            userId=2,
            genreId=2,  # Science Fiction
            isbn=9780345391803,
            pages=224,
            chapters=35,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1540169016i/42410904.jpg",
            yearPublished=1979
        ),
        Book(
            title="The Martian",
            author="Andy Weir",
            description="Astronaut Mark Watney is stranded on Mars and must find a way to survive while awaiting rescue.",
            userId=3,
            genreId=2,  # Science Fiction
            isbn=9780553418026,
            pages=384,
            chapters=30,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1413706054i/18007564.jpg",
            yearPublished=2011
        ),
        Book(
            title="The Three-Body Problem",
            author="Liu Cixin",
            description="A Chinese physicist is caught up in an alien invasion when the Earth makes contact with a distant star system.",
            userId=4,
            genreId=2,  # Science Fiction
            isbn=9780765377067,
            pages=400,
            chapters=40,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1415428227i/20518872.jpg",
            yearPublished=2008
        ),
        Book(
            title="Project Hail Mary",
            author="Andy Weir",
            description="Ryland Grace is an astronaut sent to save humanity, but he wakes up with no memory and learns he is the last hope for Earth.",
            userId=5,
            genreId=2,  # Science Fiction
            isbn=9780593135204,
            pages=496,
            chapters=40,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
            yearPublished=2021
        ),
        Book(
            title="Leviathan Wakes",
            author="James S. A. Corey",
            description="The first book in the Expanse series, focusing on the tensions between Earth, Mars, and the Asteroid Belt.",
            userId=3,
            genreId=2,  # Science Fiction
            isbn=9780316334754,
            pages=592,
            chapters=40,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1411013134i/8855321.jpg",
            yearPublished=2011
        ),
        Book(
            title="Caliban's War",
            author="James S. A. Corey",
            description="The second book in the Expanse series, continuing the saga of humanity's colonization of the solar system.",
            userId=2,
            genreId=2,  # Science Fiction
            isbn=9780316334755,
            pages=592,
            chapters=40,
            coverPicture="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1407572377i/12591698.jpg",
            yearPublished=2012
        )
    ]

    for book in books:
        db.session.add(book)

    db.session.commit()
    print("Books have been seeded!")



def undo_books():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.books RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM books"))
      
    db.session.commit()