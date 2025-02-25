from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text
import random
from datetime import datetime, timedelta

# Helper function to generate random date in the last 6 months
def generate_random_date():
    # Get the current date
    today = datetime.now()

    # Generate a random number of days between 0 and 180 (6 months in days)
    random_days = random.randint(0, 180)

    # Get the random date by subtracting random_days from today
    random_date = today - timedelta(days=random_days)

    return random_date

def seed_reviews():


    # Helper function to generate random date in the last 6 months
    def generate_random_date():
        # Get the current date
        today = datetime.now()

        # Generate a random number of days between 0 and 180 (6 months in days)
        random_days = random.randint(0, 180)

        # Get the random date by subtracting random_days from today
        random_date = today - timedelta(days=random_days)

        return random_date

    # Manually populate the review data for each book
    reviews_data = [
        # Priory of the Orange Tree by Samantha Shannon
            Review(bookId= 1, userId= 2, review= "Amazing world-building and characters!", rating= 5, createdAt=generate_random_date()),
            Review(bookId=1, userId= 3, review= "A bit long, but the story was great.", rating= 4, createdAt=generate_random_date()),
            Review(bookId=1, userId= 4, review= "I struggled with the pacing, but enjoyed it overall.", rating= 3, createdAt=generate_random_date()),
            Review(bookId=1, userId= 5, review= "Couldn’t put it down. One of my favorites!", rating= 5, createdAt=generate_random_date()),
        
        
        # Fourth Wing by Rebecca Yarros
            Review(bookId= 2, userId= 2, review= "A thrilling ride, loved every moment of it!", rating= 5, createdAt=generate_random_date()),
            Review(bookId= 2, userId= 3, review= "A bit too predictable, but enjoyable nonetheless.", rating= 3, createdAt=generate_random_date()),
            Review(bookId= 2, userId= 4, review= "Really heartwarming. A great book for anyone who loves romance.", rating= 4, createdAt=generate_random_date()),
            Review(bookId= 2, userId= 5, review= "I didn't love it as much as I thought I would.", rating= 2, createdAt=generate_random_date()),
        
        
        # The Bone Season by Samantha Shannon
            Review(bookId= 3, userId= 2, review= "Intriguing world, but I found it a little confusing at times.", rating= 3, createdAt=generate_random_date()),
            Review(bookId= 3, userId= 3, review= "Unique plot, but I had high expectations that it didn’t meet.", rating= 4, createdAt=generate_random_date()),
            Review(bookId= 3, userId= 4, review= "Definitely a series I’m interested in continuing!", rating= 5, createdAt=generate_random_date()),
            Review(bookId= 3, userId= 5, review= "I didn’t connect with the characters as much as I wanted to.", rating= 2, createdAt=generate_random_date()),
        
        # Water Moon by Samantha Sotto Yambao
            Review(bookId= 4, userId= 2, review= "A beautiful and emotional story. I loved it.", rating= 5),
            Review(bookId= 4, userId= 3, review= "I had a hard time connecting with the plot, but the writing was lovely.", rating= 3, createdAt=generate_random_date()),
            Review(bookId= 4, userId= 4, review= "Great characters and a lot of heart. A little slow at times.", rating= 4, createdAt=generate_random_date()),
            Review(bookId= 4, userId= 5, review= "Not my cup of tea, but I can see why people would enjoy it.", rating= 2, createdAt=generate_random_date()),
        
        # The Night Ends with Fire by K.X. Song
        Review(bookId=5, userId=2, review="A gripping story, couldn't stop reading!", rating=5, createdAt=generate_random_date()),
        Review(bookId=5, userId=3, review="I enjoyed the action scenes, but the romance felt forced.", rating=3, createdAt=generate_random_date()),
        Review(bookId=5, userId=4, review="Interesting take on the genre, will look out for more from this author.", rating=4, createdAt=generate_random_date()),
        Review(bookId=5, userId=5, review="Too predictable for me, didn't love it as much as others did.", rating=2, createdAt=generate_random_date()),

        # God Killer by Hannah Kaner
        Review(bookId=6, userId=2, review="I really loved this one! It’s intense and mysterious.", rating=5, createdAt=generate_random_date()),
        Review(bookId=6, userId=3, review="Not as good as I expected. The plot didn’t hook me.", rating=3, createdAt=generate_random_date()),
        Review(bookId=6, userId=4, review="I enjoyed the world-building, but the pacing was a bit slow.", rating=4, createdAt=generate_random_date()),
        Review(bookId=6, userId=5, review="I wasn’t invested in the story, unfortunately.", rating=2, createdAt=generate_random_date()),

        # Wolfsong by T.J. Klune
        Review(bookId=7, userId=2, review="Absolutely loved this one! T.J. Klune's writing is fantastic.", rating=5, createdAt=generate_random_date()),
        Review(bookId=7, userId=3, review="Great characters and emotional depth, but I didn’t love the pacing.", rating=4, createdAt=generate_random_date()),
        Review(bookId=7, userId=4, review="The world-building was top-notch. I couldn’t put it down.", rating=5, createdAt=generate_random_date()),
        Review(bookId=7, userId=5, review="It was good, but I felt the plot was a bit too slow at times.", rating=3, createdAt=generate_random_date()),

        # House of Earth and Blood by Sarah J. Maas
        Review(bookId=8, userId=2, review="A fast-paced, action-packed adventure. Loved every moment!", rating=5, createdAt=generate_random_date()),
        Review(bookId=8, userId=3, review="The romance was a bit cliché, but the story was engaging.", rating=4, createdAt=generate_random_date()),
        Review(bookId=8, userId=4, review="I had a hard time connecting with the characters, but the world was fascinating.", rating=3, createdAt=generate_random_date()),
        Review(bookId=8, userId=5, review="One of the best books I’ve read this year. Highly recommend!", rating=5, createdAt=generate_random_date()),

        # The Invisible Life of Addie LaRue by V. E. Schwab
        Review(bookId=9, userId=2, review="A beautifully tragic story. I couldn’t stop thinking about it.", rating=5, createdAt=generate_random_date()),
        Review(bookId=9, userId=3, review="Interesting concept but the pacing was a little slow for me.", rating=3, createdAt=generate_random_date()),
        Review(bookId=9, userId=4, review="An enchanting book with deep, reflective themes. Loved it!", rating=4, createdAt=generate_random_date()),
        Review(bookId=9, userId=5, review="It was good, but I didn't connect with the main character as much as I expected.", rating=2, createdAt=generate_random_date()),

        # The Eye of the World by Robert Jordan
        Review(bookId=38, userId=2, review="An epic fantasy with amazing world-building. Loved it!", rating=5, createdAt=generate_random_date()),
        Review(bookId=38, userId=3, review="Really enjoyed this, but it took me a while to get into the story.", rating=4, createdAt=generate_random_date()),
        Review(bookId=38, userId=4, review="A bit slow at first, but the world-building is worth it.", rating=3, createdAt=generate_random_date()),
        Review(bookId=38, userId=5, review="A classic for a reason. Excited to continue the journey.", rating=4, createdAt=generate_random_date()),

        # Deep End by Ali Hazelwood
        Review(bookId=10, userId=2, review="A steamy, sweet romance. I couldn’t put it down!", rating=5, createdAt=generate_random_date()),
        Review(bookId=10, userId=3, review="The plot was fun, but it felt a bit predictable.", rating=3, createdAt=generate_random_date()),
        Review(bookId=10, userId=4, review="I loved the chemistry between the characters. Really engaging!", rating=4, createdAt=generate_random_date()),
        Review(bookId=10, userId=5, review="It wasn’t as good as I hoped it would be, but still enjoyable.", rating=2, createdAt=generate_random_date()),

        # Happiness for Beginners by Katherine Center
        Review(bookId=11, userId=2, review="Heartwarming and funny. A perfect summer read!", rating=5, createdAt=generate_random_date()),
        Review(bookId=11, userId=3, review="Not my favorite, but it had its moments.", rating=3, createdAt=generate_random_date()),
        Review(bookId=11, userId=4, review="A light read with a lot of heart. Really enjoyed it!", rating=4, createdAt=generate_random_date()),
        Review(bookId=11, userId=5, review="It was a little too predictable for my taste.", rating=2, createdAt=generate_random_date()),

        # Love and Other Words by Christina Lauren
        Review(bookId=12, userId=2, review="I loved this book! The emotions and the love story were beautifully written.", rating=5, createdAt=generate_random_date()),
        Review(bookId=12, userId=3, review="Cute and emotional, but it didn’t have the depth I was hoping for.", rating=4, createdAt=generate_random_date()),
        Review(bookId=12, userId=4, review="The characters were well-developed, and I loved the chemistry between them.", rating=5, createdAt=generate_random_date()),
        Review(bookId=12, userId=5, review="A bit too dramatic for my taste, but still a solid romance novel.", rating=3, createdAt=generate_random_date()),

        # Not Another Love Song by Julie Soto
        Review(bookId=13, userId=2, review="A fun, lighthearted romance with great characters!", rating=5, createdAt=generate_random_date()),
        Review(bookId=13, userId=3, review="I enjoyed it, but it felt a bit predictable.", rating=3, createdAt=generate_random_date()),
        Review(bookId=13, userId=4, review="A sweet and fun romance that made me smile.", rating=4, createdAt=generate_random_date()),
        Review(bookId=13, userId=5, review="It was cute, but not very memorable in the long run.", rating=2, createdAt=generate_random_date()),

        # Forget Me Not by Julie Soto
        Review(bookId=14, userId=2, review="Such a touching story, with a lot of emotion!", rating=5, createdAt=generate_random_date()),
        Review(bookId=14, userId=3, review="I couldn’t put it down! The story really pulled me in.", rating=4, createdAt=generate_random_date()),
        Review(bookId=14, userId=4, review="Sweet, but I found it a little predictable.", rating=3, createdAt=generate_random_date()),
        Review(bookId=14, userId=5, review="Not for me, but I can see why others would like it.", rating=2),

        # The Seven Year Slip by Ashley Poston
        Review(bookId=15, userId=2, review="A beautifully crafted story with a unique premise.", rating=5, createdAt=generate_random_date()),
        Review(bookId=15, userId=3, review="It was fun, but I felt like I couldn’t connect with the characters.", rating=3, createdAt=generate_random_date()),
        Review(bookId=15, userId=4, review="A great read, full of surprises and emotional depth.", rating=4, createdAt=generate_random_date()),
        Review(bookId=15, userId=5, review="Too slow for my taste, but the writing was nice.", rating=2, createdAt=generate_random_date()),

        # The Ex Hex by Erin Sterling
        Review(bookId=16, userId=2, review="A hilarious and magical romance! I loved every second.", rating=5, createdAt=generate_random_date()),
        Review(bookId=16, userId=3, review="A fun, light read. I enjoyed it but didn’t love it.", rating=3, createdAt=generate_random_date()),
        Review(bookId=16, userId=4, review="Such a fun, quirky story with great characters.", rating=4, createdAt=generate_random_date()),
        Review(bookId=16, userId=5, review="It was okay, but I found the plot a little predictable.", rating=2, createdAt=generate_random_date()),

        # The Dead Romantics by Ashley Poston
        Review(bookId=17, userId=2, review="A unique, emotional read with a lot of heart. Loved it!", rating=5, createdAt=generate_random_date()),
        Review(bookId=17, userId=3, review="Sweet and charming, though the pacing was a little slow at times.", rating=4, createdAt=generate_random_date()),
        Review(bookId=17, userId=4, review="Really enjoyed the characters, but the plot didn’t quite grip me.", rating=3, createdAt=generate_random_date()),
        Review(bookId=17, userId=5, review="Not my favorite, but I can see the appeal for others.", rating=2, createdAt=generate_random_date()),

        # Not in Love by Ali Hazelwood
        Review(bookId=18, userId=2, review="A quick, easy romance with fun characters.", rating=4, createdAt=generate_random_date()),
        Review(bookId=18, userId=3, review="I liked it, but it was a little too cliché for me.", rating=3, createdAt=generate_random_date()),
        Review(bookId=18, userId=4, review="A cute, enjoyable read, though not groundbreaking.", rating=4, createdAt=generate_random_date()),
        Review(bookId=18, userId=5, review="It didn’t really do it for me. Felt predictable and shallow.", rating=2, createdAt=generate_random_date()),

        # The Women by Kristin Hannah
        Review(bookId=19, userId=2, review="Such a powerful and emotional story. One of my favorites!", rating=5, createdAt=generate_random_date()),
        Review(bookId=19, userId=3, review="A beautifully written, heart-wrenching novel. Loved it!", rating=5, createdAt=generate_random_date()),
        Review(bookId=19, userId=4, review="The story was great, but it was a bit too long for me.", rating=3, createdAt=generate_random_date()),
        Review(bookId=19, userId=5, review="A slow burn, but really moving once it picks up.", rating=4, createdAt=generate_random_date()),

        # The Nightingale by Kristin Hannah
        Review(bookId=20, userId=2, review="A breathtaking historical fiction novel. Highly recommend!", rating=5, createdAt=generate_random_date()),
        Review(bookId=20, userId=3, review="One of the most moving books I’ve ever read. Loved every minute.", rating=5, createdAt=generate_random_date()),
        Review(bookId=20, userId=4, review="A beautiful story, but it took a while to get into.", rating=3, createdAt=generate_random_date()),
        Review(bookId=20, userId=5, review="Great characters and setting, though it was a bit slow in parts.", rating=4, createdAt=generate_random_date()),

        # The Frozen River by Ariel Lawhon
        Review(bookId=21, userId=2, review="An intriguing historical mystery. Kept me hooked the whole time.", rating=5, createdAt=generate_random_date()),
        Review(bookId=21, userId=3, review="A good read, but it felt like it dragged in some parts.", rating=3, createdAt=generate_random_date()),
        Review(bookId=21, userId=4, review="Loved the suspense and how the story unfolded.", rating=4, createdAt=generate_random_date()),
        Review(bookId=21, userId=5, review="Interesting concept, but I wasn’t fully captivated by the plot.", rating=2, createdAt=generate_random_date()),

        # The Quiet Librarian by Allen Eskens
        Review(bookId=22, userId=2, review="Such a unique and captivating story. Highly recommend!", rating=5, createdAt=generate_random_date()),
        Review(bookId=22, userId=3, review="Great mystery! I didn’t see the twists coming.", rating=4, createdAt=generate_random_date()),
        Review(bookId=22, userId=4, review="Interesting, but I didn’t find myself super invested.", rating=3, createdAt=generate_random_date()),
        Review(bookId=22, userId=5, review="I loved the main character and the twists in the plot.", rating=4, createdAt=generate_random_date()),

        # Lady Clementine by Marie Benedict
        Review(bookId=23, userId=2, review="A wonderful historical fiction. Lady Clementine is such a compelling figure.", rating=5, createdAt=generate_random_date()),
        Review(bookId=23, userId=3, review="I enjoyed the story, but the pacing was a bit slow at times.", rating=3, createdAt=generate_random_date()),
        Review(bookId=23, userId=4, review="A powerful narrative about a fascinating woman in history.", rating=4, createdAt=generate_random_date()),
        Review(bookId=23, userId=5, review="Well-written but not as engaging as I hoped it would be.", rating=2, createdAt=generate_random_date()),

        # The Silk House by Kayte Nunn
        Review(bookId=24, userId=2, review="A beautifully atmospheric novel with great character development.", rating=5, createdAt=generate_random_date()),
        Review(bookId=24, userId=3, review="I loved the setting and the eerie mystery, but the plot was a little too slow.", rating=3, createdAt=generate_random_date()),
        Review(bookId=24, userId=4, review="The combination of historical fiction and mystery was fascinating.", rating=4, createdAt=generate_random_date()),
        Review(bookId=24, userId=5, review="Not my favorite book, but I can see why others would enjoy it.", rating=2, createdAt=generate_random_date()),

        # James by Percival Everett
        Review(bookId=25, userId=2, review="A deep and thoughtful story. I loved the writing and characters.", rating=5, createdAt=generate_random_date()),
        Review(bookId=25, userId=3, review="A bit hard to follow at times, but it’s a beautifully written novel.", rating=3, createdAt=generate_random_date()),
        Review(bookId=25, userId=4, review="It’s a unique read with an interesting perspective on life.", rating=4, createdAt=generate_random_date()),
        Review(bookId=25, userId=5, review="Not my cup of tea. I struggled to get into the plot.", rating=2, createdAt=generate_random_date()),

        # The Prison Healer by Lynette Noni
        Review(bookId=26, userId=1, review="The world-building was so immersive, and the suspense kept me hooked the whole time!", rating=5, createdAt=generate_random_date()),
        Review(bookId=26, userId=2, review="A great fantasy story with well-developed characters. I couldn’t stop reading it.", rating=4, createdAt=generate_random_date()),
        Review(bookId=26, userId=3, review="While exciting, some parts of the plot felt rushed and could have used more depth.", rating=3, createdAt=generate_random_date()),
        Review(bookId=26, userId=4, review="It was a bit too predictable for my taste, but I still had fun reading it.", rating=2, createdAt=generate_random_date()),

        # The Guilded Cage
        Review(bookId=27, userId=1, review="A captivating story with a fresh take on magic and power. Really enjoyed it.", rating=5, createdAt=generate_random_date()),
        Review(bookId=27, userId=2, review="The concept was interesting, but I didn’t really connect with the characters like I wanted to.", rating=3, createdAt=generate_random_date()),
        Review(bookId=27, userId=3, review="The world-building and plot were fantastic, and I can’t wait for the next installment.", rating=4, createdAt=generate_random_date()),
        Review(bookId=27, userId=4, review="It was decent, though I felt the pacing was a little too slow for me.", rating=2, createdAt=generate_random_date()),

        # The Blood Traitor
        Review(bookId=28, userId=1, review="This book was such an emotional rollercoaster. The character development was phenomenal!", rating=5, createdAt=generate_random_date()),
        Review(bookId=28, userId=2, review="A fast-paced, exciting read with lots of twists. Some parts were a bit predictable, though.", rating=4, createdAt=generate_random_date()),
        Review(bookId=28, userId=3, review="It was a solid read, but the pacing seemed a bit uneven in places.", rating=3, createdAt=generate_random_date()),
        Review(bookId=28, userId=4, review="Not my favorite. The book felt a bit repetitive and didn’t hold my attention fully.", rating=2, createdAt=generate_random_date()),

        # Six Crimson Cranes by Elizabeth Lim
        Review(bookId=29, userId=1, review="Absolutely adored this book! The magic and characters were so well done.", rating=5, createdAt=generate_random_date()),
        Review(bookId=29, userId=2, review="Such a beautiful story with rich lore and exciting adventures. Highly recommend!", rating=4, createdAt=generate_random_date()),
        Review(bookId=29, userId=3, review="The concept was fantastic, but I felt the plot dragged a bit at times.", rating=3, createdAt=generate_random_date()),
        Review(bookId=29, userId=4, review="Loved the characters and the world, but the pacing was a little slow.", rating=4, createdAt=generate_random_date()),

        # Howl's Moving Castle by Diana Wynne Jones
        Review(bookId=30, userId=1, review="A whimsical and fun fantasy. Howl is such a fascinating character!", rating=5, createdAt=generate_random_date()),
        Review(bookId=30, userId=2, review="A quirky and heartwarming tale. I really enjoyed it.", rating=4, createdAt=generate_random_date()),
        Review(bookId=30, userId=3, review="A bit weird for my taste, but I can see why others like it.", rating=3, createdAt=generate_random_date()),
        Review(bookId=30, userId=4, review="I didn’t love it as much as I expected to, but it was still enjoyable.", rating=3, createdAt=generate_random_date()),

        # Flamecaster by Cinda Williams Chima
        Review(bookId=31, userId=1, review="Action-packed and full of surprises! I couldn’t put it down.", rating=5, createdAt=generate_random_date()),
        Review(bookId=31, userId=2, review="A great fantasy with strong characters and an engaging plot.", rating=4, createdAt=generate_random_date()),
        Review(bookId=31, userId=3, review="A solid read, but it felt a bit rushed towards the end.", rating=3, createdAt=generate_random_date()),
        Review(bookId=31, userId=4, review="I liked it, but some of the relationships felt underdeveloped.", rating=3, createdAt=generate_random_date()),

        # Shadowcaster by Cinda Williams Chima
        Review(bookId=32, userId=1, review="Really enjoyed this sequel! So much action and tension!", rating=5, createdAt=generate_random_date()),
        Review(bookId=32, userId=2, review="A great continuation of the series. The characters keep evolving.", rating=4, createdAt=generate_random_date()),
        Review(bookId=32, userId=3, review="It was okay, but some plot points felt a bit forced.", rating=3, createdAt=generate_random_date()),
        Review(bookId=32, userId=4, review="A strong follow-up to the first book. Loved the magic system.", rating=4, createdAt=generate_random_date()),

        # Stormcaster by Cinda Williams Chima
        Review(bookId=33, userId=1, review="An intense and thrilling read! The plot twists kept me on edge.", rating=5, createdAt=generate_random_date()),
        Review(bookId=33, userId=2, review="The action in this one was fantastic, though the pacing slowed in places.", rating=4, createdAt=generate_random_date()),
        Review(bookId=33, userId=3, review="A great series, but this book felt a little too long.", rating=3, createdAt=generate_random_date()),
        Review(bookId=33, userId=4, review="Loved the emotional depth and growth of the characters.", rating=4, createdAt=generate_random_date()),

        # Deathcaster by Cinda Williams Chima
        Review(bookId=34, userId=1, review="A fantastic conclusion to the series! Highly recommend.", rating=5, createdAt=generate_random_date()),
        Review(bookId=34, userId=2, review="A solid finish to the series. Some parts were a bit predictable, though.", rating=4, createdAt=generate_random_date()),
        Review(bookId=34, userId=3, review="I liked it, but I was hoping for a bit more action towards the end.", rating=3, createdAt=generate_random_date()),
        Review(bookId=34, userId=4, review="A great end to the story, but the pacing was a bit uneven in places.", rating=4, createdAt=generate_random_date()),

        # The Hitchhiker’s Guide to the Galaxy by Douglas Adams
        Review(bookId=35, userId=1, review="A hilarious and absurd journey through space. Loved it!", rating=5, createdAt=generate_random_date()),
        Review(bookId=35, userId=2, review="Funny and weird, though it wasn’t always my style.", rating=3, createdAt=generate_random_date()),
        Review(bookId=35, userId=3, review="Absolutely loved this! It’s a classic for a reason.", rating=5, createdAt=generate_random_date()),
        Review(bookId=35, userId=4, review="I didn’t enjoy it as much as others, but I can see the appeal.", rating=3, createdAt=generate_random_date()),

        # The Martian by Andy Weir
        Review(bookId=36, userId=1, review="A gripping, realistic survival story. Couldn’t put it down.", rating=5, createdAt=generate_random_date()),
        Review(bookId=36, userId=2, review="Great pacing and character development. Really enjoyable!", rating=4, createdAt=generate_random_date()),
        Review(bookId=36, userId=3, review="A fun read, though the science parts got a bit technical for me.", rating=3, createdAt=generate_random_date()),
        Review(bookId=36, userId=4, review="Interesting concept, but I wasn’t as invested as I hoped.", rating=2, createdAt=generate_random_date()),

        # The Three-Body Problem by Liu Cixin
        Review(bookId=37, userId=1, review="A complex, mind-bending sci-fi novel. Absolutely loved it.", rating=5, createdAt=generate_random_date()),
        Review(bookId=37, userId=2, review="Incredible world-building, though the science was hard to follow at times.", rating=4, createdAt=generate_random_date()),
        Review(bookId=37, userId=3, review="Very interesting, but it took a while for me to get into it.", rating=3, createdAt=generate_random_date()),
        Review(bookId=37, userId=4, review="A dense read. It was good, but I struggled with the complexity.", rating=3, createdAt=generate_random_date()),

        # Project Hail Mary by Andy Weir
        Review(bookId=38, userId=1, review="An absolutely thrilling ride from start to finish! Loved it.", rating=5, createdAt=generate_random_date()),
        Review(bookId=38, userId=2, review="A solid read with a great protagonist. Some parts felt a bit long, but I enjoyed it.", rating=4, createdAt=generate_random_date()),
        Review(bookId=38, userId=3, review="A great concept, but the pacing was a little slow at times.", rating=3, createdAt=generate_random_date()),
        Review(bookId=38, userId=4, review="I enjoyed the scientific elements, but the plot was a bit predictable.", rating=3, createdAt=generate_random_date()),

        # Leviathan Wakes by James S. A. Corey
        Review(bookId=39, userId=1, review="A fantastic space opera with fantastic world-building and characters.", rating=5, createdAt=generate_random_date()),
        Review(bookId=39, userId=2, review="One of the best space operas I’ve read in a while. Loved the twists!", rating=5, createdAt=generate_random_date()),
        Review(bookId=39, userId=3, review="Really fun and fast-paced, though some parts felt a little too slow.", rating=4, createdAt=generate_random_date()),
        Review(bookId=39, userId=4, review="Great start to a series, though I wasn’t hooked immediately.", rating=3, createdAt=generate_random_date()),

        # Caliban's War by James S. A. Corey
        Review(bookId=40, userId=1, review="An intense sequel with even more action. Loved the deeper character exploration.", rating=5, createdAt=generate_random_date()),
        Review(bookId=40, userId=2, review="This was a wild ride. I liked it better than the first book!", rating=5, createdAt=generate_random_date()),
        Review(bookId=40, userId=3, review="The pacing was better, but some of the plot points felt a little far-fetched.", rating=4, createdAt=generate_random_date()),
        Review(bookId=40, userId=4, review="Great character development and world-building, but some aspects were predictable.", rating=4, createdAt=generate_random_date()),
    ]

    # Insert the reviews into the database
    for review in reviews_data:
        db.session.add(review)

    db.session.commit()
    print("Reviews have been seeded!")



def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.genres RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))
      
    db.session.commit()