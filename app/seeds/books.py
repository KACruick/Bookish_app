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
            coverPicture="https://images.penguinrandomhouse.com/cover/9781635570302",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/71Fzv92s2aL.jpg",
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
            coverPicture="https://images.penguinrandomhouse.com/cover/9781408857492",
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
            coverPicture="https://www.samanthasotto.com/WaterMoonCover.jpg",
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
            coverPicture="https://covers.openlibrary.org/b/id/9508056-L.jpg",
            yearPublished=2016,
            description="A gripping fantasy where the fate of the world rests on a young hero's shoulders."
        ),
        Book(
            title="God Killer",
            author="Hannah Kaner",
            userId=1,
            genreId=1,  # Fantasy
            isbn=9780593333629,
            pages=400,
            chapters=40,
            coverPicture="https://m.media-amazon.com/images/I/91rxqAs1JUL.jpg",
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
            coverPicture="https://m.media-amazon.com/images/I/91iqCzdxLoL.jpg",
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
            coverPicture="https://images.penguinrandomhouse.com/cover/9781635572221",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/71lFzI6JlwL.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://m.media-amazon.com/images/I/91Tn4bftJrL.jpg",
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
            coverPicture="https://m.media-amazon.com/images/I/81fWGQDbWzL.jpg", 
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
            coverPicture="https://m.media-amazon.com/images/I/71wXtFwK1UL.jpg",
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
            coverPicture="https://m.media-amazon.com/images/I/91fh5o7El9L.jpg",
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
            coverPicture="https://m.media-amazon.com/images/I/81cD+grVmsL.jpg",
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
            coverPicture="https://m.media-amazon.com/images/I/91SH6V3HwLL.jpg",
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
            coverPicture="https://m.media-amazon.com/images/I/71lmZyxfmKL.jpg",
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
            coverPicture="https://m.media-amazon.com/images/I/91ItqVbHlqL.jpg",
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
            coverPicture="https://m.media-amazon.com/images/I/91Uu3gOp-XL.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/71lgQvE1TQL.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/81wPbTnPoPL.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91IR4PYY6WL.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/81aFhWUBTLL.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/71hbICxZhfL.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91xltRtNT0L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
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
            coverPicture="https://images-na.ssl-images-amazon.com/images/I/91yvnFj9g9L.jpg",
            yearPublished=2012
        )
    ]

    for book in books:
        db.session.add(book)

    db.session.commit()




def undo_books():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.books RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM books"))
      
    db.session.commit()