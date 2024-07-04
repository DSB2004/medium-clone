
-- TEST CREDENTIAL FOR USERS
-- Inserting 4 users
INSERT INTO USERS (NAME, EMAIL, BIO, WORK_TYPE, PROFILE_PIC) VALUES 
('Alice', 'alice@example.com', 'Bio for Alice', 'Developer', 'profile_pic_alice.jpg'),
('Bob', 'bob@example.com', 'Bio for Bob', 'Designer', 'profile_pic_bob.jpg'),
('Charlie', 'charlie@example.com', 'Bio for Charlie', 'Manager', 'profile_pic_charlie.jpg'),
('Dave', 'dave@example.com', 'Bio for Dave', 'Tester', 'profile_pic_dave.jpg'),
('Eve', 'eve@example.com', 'Bio for Eve', 'Developer', 'profile_pic_eve.jpg'),
('Frank', 'frank@example.com', 'Bio for Frank', 'Designer', 'profile_pic_frank.jpg'),
('Grace', 'grace@example.com', 'Bio for Grace', 'Manager', 'profile_pic_grace.jpg'),
('Hank', 'hank@example.com', 'Bio for Hank', 'Tester', 'profile_pic_hank.jpg');


-- Adding social links (2 for 2 users and 1 user with no social links)
INSERT INTO SOCIAL_LINKS (USER_EMAIL, LINK) VALUES 
('alice@example.com', 'https://twitter.com/alice'),
('alice@example.com', 'https://linkedin.com/in/alice'),
('bob@example.com', 'https://twitter.com/bob'),
('bob@example.com', 'https://linkedin.com/in/bob'),
('eve@example.com', 'https://twitter.com/eve'),
('eve@example.com', 'https://linkedin.com/in/eve'),
('frank@example.com', 'https://twitter.com/frank'),
('frank@example.com', 'https://linkedin.com/in/frank');

-- Assigning followers randomly
INSERT INTO FOLLOWERS (USER_EMAIL, FOLLOWER_EMAIL) VALUES 
('alice@example.com', 'bob@example.com'),
('bob@example.com', 'alice@example.com'),
('charlie@example.com', 'dave@example.com'),
('dave@example.com', 'charlie@example.com'),
('eve@example.com', 'grace@example.com'),
('grace@example.com', 'eve@example.com'),
('frank@example.com', 'hank@example.com'),
('hank@example.com', 'frank@example.com'),
('alice@example.com', 'grace@example.com'),
('alice@example.com', 'hank@example.com'),
('bob@example.com', 'eve@example.com'),
('bob@example.com', 'grace@example.com'),
('charlie@example.com', 'bob@example.com'),
('charlie@example.com', 'hank@example.com'),
('dave@example.com', 'alice@example.com'),
('dave@example.com', 'eve@example.com'),
('eve@example.com', 'charlie@example.com'),
('frank@example.com', 'dave@example.com'),
('grace@example.com', 'alice@example.com'),
('hank@example.com', 'bob@example.com'),
('eve@example.com', 'hank@example.com'),
('frank@example.com', 'grace@example.com'),
('grace@example.com', 'frank@example.com');
-- Adding 3 blogs with their images, search keys, likes, and comments
INSERT INTO BLOGS (ID, USER_EMAIL, HEADER, INTRO, INTRO_IMAGE, BODY) VALUES 
('blog1', 'alice@example.com', 'Blog 1 Header', 'Intro for blog 1', 'intro_image_blog1.jpg', 'Body of blog 1'),
('blog2', 'bob@example.com', 'Blog 2 Header', 'Intro for blog 2', 'intro_image_blog2.jpg', 'Body of blog 2'),
('blog3', 'charlie@example.com', 'Blog 3 Header', 'Intro for blog 3', 'intro_image_blog3.jpg', 'Body of blog 3'),
('blog4', 'eve@example.com', 'Blog 4 Header', 'Intro for blog 4', 'intro_image_blog4.jpg', 'Body of blog 4'),
('blog5', 'frank@example.com', 'Blog 5 Header', 'Intro for blog 5', 'intro_image_blog5.jpg', 'Body of blog 5'),
('blog6', 'grace@example.com', 'Blog 6 Header', 'Intro for blog 6', 'intro_image_blog6.jpg', 'Body of blog 6'),
('blog7', 'hank@example.com', 'Blog 7 Header', 'Intro for blog 7', 'intro_image_blog7.jpg', 'Body of blog 7'),
('blog8', 'eve@example.com', 'Blog 8 Header', 'Intro for blog 8', 'intro_image_blog8.jpg', 'Body of blog 8'),
('blog9', 'frank@example.com', 'Blog 9 Header', 'Intro for blog 9', 'intro_image_blog9.jpg', 'Body of blog 9'),
('blog10', 'grace@example.com', 'Blog 10 Header', 'Intro for blog 10', 'intro_image_blog10.jpg', 'Body of blog 10'),
('blog11', 'hank@example.com', 'Blog 11 Header', 'Intro for blog 11', 'intro_image_blog11.jpg', 'Body of blog 11'),
('blog12', 'eve@example.com', 'Blog 12 Header', 'Intro for blog 12', 'intro_image_blog12.jpg', 'Body of blog 12'),
('blog13', 'frank@example.com', 'Blog 13 Header', 'Intro for blog 13', 'intro_image_blog13.jpg', 'Body of blog 13'),
('blog14', 'grace@example.com', 'Blog 14 Header', 'Intro for blog 14', 'intro_image_blog14.jpg', 'Body of blog 14'),
('blog15', 'hank@example.com', 'Blog 15 Header', 'Intro for blog 15', 'intro_image_blog15.jpg', 'Body of blog 15'),
('blog16', 'eve@example.com', 'Blog 16 Header', 'Intro for blog 16', 'intro_image_blog16.jpg', 'Body of blog 16');

-- Adding images for blogs
INSERT INTO BLOG_IMAGES (BLOG_ID, IMAGE_LINK) VALUES 
('blog1', 'image1_blog1.jpg'),
('blog1', 'image2_blog1.jpg'),
('blog2', 'image1_blog2.jpg'),
('blog2', 'image2_blog2.jpg'),
('blog3', 'image1_blog3.jpg'),
('blog3', 'image2_blog3.jpg'),
('blog4', 'image1_blog4.jpg'),
('blog4', 'image2_blog4.jpg'),
('blog5', 'image1_blog5.jpg'),
('blog5', 'image2_blog5.jpg'),
('blog6', 'image1_blog6.jpg'),
('blog6', 'image2_blog6.jpg'),
('blog7', 'image1_blog7.jpg'),
('blog7', 'image2_blog7.jpg'),
('blog8', 'image1_blog8.jpg'),
('blog8', 'image2_blog8.jpg'),
('blog9', 'image1_blog9.jpg'),
('blog9', 'image2_blog9.jpg'),
('blog10', 'image1_blog10.jpg'),
('blog10', 'image2_blog10.jpg'),
('blog11', 'image1_blog11.jpg'),
('blog11', 'image2_blog11.jpg'),
('blog12', 'image1_blog12.jpg'),
('blog12', 'image2_blog12.jpg'),
('blog13', 'image1_blog13.jpg'),
('blog13', 'image2_blog13.jpg'),
('blog14', 'image1_blog14.jpg'),
('blog14', 'image2_blog14.jpg'),
('blog15', 'image1_blog15.jpg'),
('blog15', 'image2_blog15.jpg'),
('blog16', 'image1_blog16.jpg'),
('blog16', 'image2_blog16.jpg');

-- Inserting search keys without USER_EMAIL
INSERT INTO SEARCH_KEY (BLOG_ID, SEARCH_KEY) VALUES 
('blog1', 'TECH'),
('blog1', 'HEALTH'),
('blog1', 'NATURE'),
('blog2', 'DESIGN'),
('blog2', 'ART'),
('blog3', 'FOOD'),
('blog4', 'TRAVEL'),
('blog4', 'LIFESTYLE'),
('blog4', 'CULTURE'),
('blog5', 'MUSIC'),
('blog5', 'PHOTOGRAPHY'),
('blog6', 'MANAGEMENT'),
('blog7', 'TECH'),
('blog7', 'GADGETS'),
('blog7', 'REVIEWS'),
('blog8', 'HEALTH'),
('blog8', 'WELLNESS'),
('blog9', 'DESIGN'),
('blog9', 'INSPIRATION'),
('blog10', 'NATURE'),
('blog10', 'ENVIRONMENT'),
('blog11', 'TECH'),
('blog11', 'INNOVATION'),
('blog12', 'TRAVEL'),
('blog12', 'ADVENTURE'),
('blog13', 'ART'),
('blog13', 'EXHIBITIONS'),
('blog14', 'FOOD'),
('blog14', 'RECIPES'),
('blog15', 'MUSIC'),
('blog15', 'REVIEWS'),
('blog16', 'LIFESTYLE'),
('blog16', 'TIPS');
-- Adding likes for blogs
INSERT INTO BLOG_LIKES (BLOG_ID, USER_EMAIL) VALUES 
('blog1', 'bob@example.com'),
('blog1', 'charlie@example.com'),
('blog2', 'alice@example.com'),
('blog2', 'dave@example.com'),
('blog3', 'alice@example.com'),
('blog3', 'bob@example.com'),
('blog4', 'frank@example.com'),
('blog4', 'grace@example.com'),
('blog5', 'eve@example.com'),
('blog5', 'hank@example.com'),
('blog6', 'eve@example.com'),
('blog6', 'frank@example.com'),
('blog7', 'alice@example.com'),
('blog7', 'bob@example.com'),
('blog8', 'charlie@example.com'),
('blog8', 'dave@example.com'),
('blog9', 'eve@example.com'),
('blog9', 'hank@example.com'),
('blog10', 'frank@example.com'),
('blog10', 'grace@example.com'),
('blog11', 'alice@example.com'),
('blog11', 'bob@example.com'),
('blog12', 'charlie@example.com'),
('blog12', 'dave@example.com'),
('blog13', 'eve@example.com'),
('blog13', 'hank@example.com'),
('blog14', 'frank@example.com'),
('blog14', 'grace@example.com'),
('blog15', 'alice@example.com'),
('blog15', 'bob@example.com'),
('blog16', 'charlie@example.com'),
('blog16', 'dave@example.com');


-- Adding likes for the new blogs (random number from existing users)


-- Adding comments for blogs
INSERT INTO BLOG_COMMENTS (ID, BLOG_ID, USER_EMAIL, BODY) VALUES 
('comment1', 'blog1', 'bob@example.com', 'Comment by Bob on blog 1'),
('comment2', 'blog1', 'charlie@example.com', 'Comment by Charlie on blog 1'),
('comment3', 'blog2', 'alice@example.com', 'Comment by Alice on blog 2'),
('comment4', 'blog2', 'dave@example.com', 'Comment by Dave on blog 2'),
('comment5', 'blog3', 'alice@example.com', 'Comment by Alice on blog 3'),
('comment6', 'blog3', 'bob@example.com', 'Comment by Bob on blog 3'),
('comment7', 'blog4', 'frank@example.com', 'Comment by Frank on blog 4'),
('comment8', 'blog4', 'grace@example.com', 'Comment by Grace on blog 4'),
('comment9', 'blog5', 'eve@example.com', 'Comment by Eve on blog 5'),
('comment10', 'blog5', 'hank@example.com', 'Comment by Hank on blog 5'),
('comment11', 'blog6', 'eve@example.com', 'Comment by Eve on blog 6'),
('comment12', 'blog6', 'frank@example.com', 'Comment by Frank on blog 6'),
('comment13', 'blog7', 'alice@example.com', 'Comment by Alice on blog 7'),
('comment14', 'blog7', 'bob@example.com', 'Comment by Bob on blog 7'),
('comment15', 'blog8', 'charlie@example.com', 'Comment by Charlie on blog 8'),
('comment16', 'blog8', 'dave@example.com', 'Comment by Dave on blog 8'),
('comment17', 'blog9', 'eve@example.com', 'Comment by Eve on blog 9'),
('comment18', 'blog9', 'hank@example.com', 'Comment by Hank on blog 9'),
('comment19', 'blog10', 'frank@example.com', 'Comment by Frank on blog 10'),
('comment20', 'blog10', 'grace@example.com', 'Comment by Grace on blog 10'),
('comment21', 'blog11', 'alice@example.com', 'Comment by Alice on blog 11'),
('comment22', 'blog11', 'bob@example.com', 'Comment by Bob on blog 11'),
('comment23', 'blog12', 'charlie@example.com', 'Comment by Charlie on blog 12'),
('comment24', 'blog12', 'dave@example.com', 'Comment by Dave on blog 12'),
('comment25', 'blog13', 'eve@example.com', 'Comment by Eve on blog 13'),
('comment26', 'blog13', 'hank@example.com', 'Comment by Hank on blog 13'),
('comment27', 'blog14', 'frank@example.com', 'Comment by Frank on blog 14'),
('comment28', 'blog14', 'grace@example.com', 'Comment by Grace on blog 14'),
('comment29', 'blog15', 'alice@example.com', 'Comment by Alice on blog 15'),
('comment30', 'blog15', 'bob@example.com', 'Comment by Bob on blog 15'),
('comment31', 'blog16', 'charlie@example.com', 'Comment by Charlie on blog 16'),
('comment32', 'blog16', 'dave@example.com', 'Comment by Dave on blog 16');




