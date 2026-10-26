import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Item from '../src/models/Item.js';
import ContactRequest from '../src/models/ContactRequest.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await ContactRequest.deleteMany({});
  await Item.deleteMany({});
  await User.deleteMany({});
});

describe('FindIt Backend API Test Suite', () => {
  describe('GET /api/health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('FindIt API');
    });
  });

  describe('Authentication Endpoints', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Student',
          email: 'test@student.edu',
          password: 'Password123!',
          phone: '9876543210',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('test@student.edu');
      expect(res.body.user.passwordHash).toBeUndefined(); // Should never expose password hash
    });

    it('should reject registration with duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'First User',
          email: 'unique@student.edu',
          password: 'Password123!',
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Second User',
          email: 'unique@student.edu',
          password: 'Password123!',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('should login an existing user and return token', async () => {
      // First register
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Tester',
          email: 'login@student.edu',
          password: 'CorrectPassword123!',
        });

      // Then login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@student.edu',
          password: 'CorrectPassword123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Tester 2',
          email: 'login2@student.edu',
          password: 'CorrectPassword123!',
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login2@student.edu',
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should block access to /api/auth/me without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Item CRUD and Ownership Enforcement', () => {
    let userA_Token;
    let userB_Token;

    beforeEach(async () => {
      // Create User A
      const regA = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User A',
          email: 'userA@college.edu',
          password: 'Password123!',
        });
      userA_Token = regA.body.token;

      // Create User B
      const regB = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User B',
          email: 'userB@college.edu',
          password: 'Password123!',
        });
      userB_Token = regB.body.token;
    });

    it('should allow authenticated User A to report a lost item', async () => {
      const res = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${userA_Token}`)
        .send({
          title: 'Lost Calculator in Math Class',
          type: 'LOST',
          category: 'Electronics',
          description: 'Casio fx-991EX scientific calculator with stickers',
          location: 'Block A Room 101',
          incidentDate: '2026-10-25',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.item.title).toBe('Lost Calculator in Math Class');
      expect(res.body.item.status).toBe('ACTIVE');
    });

    it('should list items publicly with search and filter support', async () => {
      // Create an item
      await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${userA_Token}`)
        .send({
          title: 'Found Blue Umbrella',
          type: 'FOUND',
          category: 'Other',
          description: 'Navy blue folding umbrella found in main hallway',
          location: 'Main Hallway',
          incidentDate: '2026-10-24',
        });

      const res = await request(app).get('/api/items?type=FOUND');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.items.length).toBe(1);
      expect(res.body.items[0].title).toBe('Found Blue Umbrella');
    });

    it('SECURITY TEST: Prevent User B from editing User A item', async () => {
      // User A creates an item
      const itemRes = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${userA_Token}`)
        .send({
          title: 'User A Laptop Bag',
          type: 'LOST',
          category: 'Bags and Backpacks',
          description: 'Grey laptop bag',
          location: 'Library',
          incidentDate: '2026-10-25',
        });

      const itemId = itemRes.body.item._id;

      // User B tries to update it
      const attackRes = await request(app)
        .patch(`/api/items/${itemId}`)
        .set('Authorization', `Bearer ${userB_Token}`)
        .send({
          title: 'Hacked by User B',
        });

      expect(attackRes.status).toBe(403);
      expect(attackRes.body.success).toBe(false);
      expect(attackRes.body.message).toMatch(/Unauthorized/i);
    });

    it('SECURITY TEST: Prevent User B from deleting User A item', async () => {
      // User A creates an item
      const itemRes = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${userA_Token}`)
        .send({
          title: 'User A Keys',
          type: 'FOUND',
          category: 'Keys',
          description: 'Room keys',
          location: 'Cafeteria',
          incidentDate: '2026-10-25',
        });

      const itemId = itemRes.body.item._id;

      // User B attempts to delete
      const deleteRes = await request(app)
        .delete(`/api/items/${itemId}`)
        .set('Authorization', `Bearer ${userB_Token}`);

      expect(deleteRes.status).toBe(403);
      expect(deleteRes.body.success).toBe(false);
    });

    it('should allow Owner to mark item as RESOLVED', async () => {
      const itemRes = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${userA_Token}`)
        .send({
          title: 'User A Water Bottle',
          type: 'LOST',
          category: 'Other',
          description: 'Metal bottle',
          location: 'Gym',
          incidentDate: '2026-10-25',
        });

      const itemId = itemRes.body.item._id;

      const resolveRes = await request(app)
        .patch(`/api/items/${itemId}/resolve`)
        .set('Authorization', `Bearer ${userA_Token}`);

      expect(resolveRes.status).toBe(200);
      expect(resolveRes.body.item.status).toBe('RESOLVED');
    });
  });

  describe('Contact Request Workflow', () => {
    it('should allow User B to send a contact request to User A item and reject self-contact', async () => {
      // User A
      const regA = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Owner User',
          email: 'owner@college.edu',
          password: 'Password123!',
        });

      // User B
      const regB = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Finder User',
          email: 'finder@college.edu',
          password: 'Password123!',
        });

      // Owner posts item
      const itemRes = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${regA.body.token}`)
        .send({
          title: 'Lost Smart Watch',
          type: 'LOST',
          category: 'Electronics',
          description: 'Black smartwatch with silicone band',
          location: 'Sports Field',
          incidentDate: '2026-10-25',
        });

      const itemId = itemRes.body.item._id;

      // Owner tries to contact themselves -> Should fail
      const selfRes = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${regA.body.token}`)
        .send({
          itemId,
          message: 'Trying to contact myself',
        });
      expect(selfRes.status).toBe(400);

      // Finder sends message to Owner -> Should succeed
      const contactRes = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${regB.body.token}`)
        .send({
          itemId,
          message: 'Hi, I found your smartwatch near the football bleachers!',
          senderContact: 'finder@college.edu',
        });

      expect(contactRes.status).toBe(201);
      expect(contactRes.body.success).toBe(true);
      expect(contactRes.body.contactRequest.status).toBe('PENDING');
    });
  });
});
