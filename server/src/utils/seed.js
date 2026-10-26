import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Item from '../models/Item.js';
import ContactRequest from '../models/ContactRequest.js';
import { connectDB, closeDB } from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('--- FindIt Portal Seed Script ---');
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing existing data (if any)...');
    await ContactRequest.deleteMany({});
    await Item.deleteMany({});
    await User.deleteMany({});

    console.log('Creating demo student users...');
    const passwordHash = await User.hashPassword('DemoStudent123!');

    const user1 = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav.sharma@college.edu',
      passwordHash,
      phone: '+91 98765 43210',
    });

    const user2 = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@college.edu',
      passwordHash,
      phone: '+91 98123 45678',
    });

    const user3 = await User.create({
      name: 'Rohan Verma',
      email: 'rohan.verma@college.edu',
      passwordHash,
      phone: '+91 91234 56789',
    });

    console.log('Creating realistic sample lost and found items...');
    const items = [
      {
        title: 'Leather Wallet found near Central Library',
        type: 'FOUND',
        category: 'Wallets and Money',
        description:
          'Found a dark brown bifold leather wallet on a bench outside the central library reading room. Contains some cash and campus cards. Please contact with card name to claim.',
        location: 'Central Library, Ground Floor East Bench',
        incidentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
        status: 'ACTIVE',
        userId: user1._id,
      },
      {
        title: 'College Student ID Card Lost in Classroom 302',
        type: 'LOST',
        category: 'Documents and ID Cards',
        description:
          'Lost my Computer Science Department student identity card (Roll No. CS24-108). Kept it on desk in Classroom 302 during afternoon lecture.',
        location: 'Academic Block B, Room 302',
        incidentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
        status: 'ACTIVE',
        userId: user2._id,
      },
      {
        title: 'Blue Stainless Steel Water Bottle in Cafeteria',
        type: 'FOUND',
        category: 'Other',
        description:
          'Found an insulated 750ml blue metallic water bottle with a silver cap on table #14 in the main college cafeteria during lunch hour.',
        location: 'Main College Cafeteria, Table 14',
        incidentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
        status: 'ACTIVE',
        userId: user3._id,
      },
      {
        title: 'Sony Wireless Noise Cancelling Headphones Lost in Physics Lab',
        type: 'LOST',
        category: 'Electronics',
        description:
          'Misplaced black over-ear Sony wireless headphones in a protective zip case. Last used in Physics Optics Laboratory 2 during Tuesday morning session.',
        location: 'Science Building, Physics Optics Lab 2',
        incidentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        status: 'ACTIVE',
        userId: user1._id,
      },
      {
        title: 'Black HP Laptop Backpack Found near College Main Gate',
        type: 'FOUND',
        category: 'Bags and Backpacks',
        description:
          'Found a sturdy black HP backpack with a spiral notebook and scientific calculator near the security guard booth at the college main gate.',
        location: 'College Main Gate Security Desk',
        incidentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
        status: 'ACTIVE',
        userId: user2._id,
      },
      {
        title: 'Set of 3 Keys on Silver Ring with Blue Tag',
        type: 'FOUND',
        category: 'Keys',
        description:
          'Found a bunch of keys on a metallic ring with a miniature bike keychain on the basketball court bleachers.',
        location: 'Sports Complex, Basketball Court Bleachers',
        incidentDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
        status: 'ACTIVE',
        userId: user1._id,
      },
      {
        title: 'Calculus Textbook & Lecture Notes Lost in Seminar Hall',
        type: 'LOST',
        category: 'Books and Stationery',
        description:
          'Thomas Calculus 14th Edition with handwritten spiral notes inside front cover. Left on front row chairs during morning seminar.',
        location: 'Auditorium / Seminar Hall 1',
        incidentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        status: 'RESOLVED',
        userId: user3._id,
      },
      {
        title: 'Fastrack Silver Analog Wrist Watch',
        type: 'FOUND',
        category: 'Jewellery and Accessories',
        description:
          'Found a silver metal strap watch in the indoor badminton court changing room. Safely submitted with sports faculty.',
        location: 'Gymnasium Indoor Badminton Locker Room',
        incidentDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
        status: 'RESOLVED',
        userId: user2._id,
      },
    ];

    const createdItems = await Item.insertMany(items);
    console.log(`Successfully seeded ${createdItems.length} items.`);

    console.log('Creating sample contact request...');
    await ContactRequest.create({
      itemId: createdItems[0]._id, // Wallet found by user1
      senderId: user2._id, // sent by user2
      recipientId: user1._id, // to user1
      message: 'Hello! I lost my brown wallet around that time. It has a student metro card inside with my name Priya. Is that still with you?',
      senderContact: 'priya.patel@college.edu',
      status: 'PENDING',
    });

    console.log('--------------------------------------------------');
    console.log('Seed completed successfully!');
    console.log('Sample Demo Accounts:');
    console.log('1. Email: aarav.sharma@college.edu | Password: DemoStudent123!');
    console.log('2. Email: priya.patel@college.edu  | Password: DemoStudent123!');
    console.log('3. Email: rohan.verma@college.edu  | Password: DemoStudent123!');
    console.log('--------------------------------------------------');

    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
};

seedData();
