// Import request from supertest
const request = require('supertest');
// Importing server file
const app = require('../index');

// admin token
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTRmMzRmNjQwOGI1ODQ1ZjI2NTZiNCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyMzYyODc3NX0.MHOrQcfAPZI61pyOV9ZfaDEQh70-mQuMBT6l_Qi7tnw';

describe('API testing', () => {
  // // Testing '/test' API
  // it("GET /CineEase | Response with text", async () => {
  //   const response = await request(app).get("/CineEase");

  //   expect(response.statusCode).toBe(200);
  //   expect(response.text).toEqual("Test API is Working!");
  // });

  // Test Case 1: User Registration - Missing Details
  it('POST User Registration | Response with body', async () => {
    const response = await request(app).post('/api/user/create').send({
      username: 'Marcus',
      phoneNumber: '9845012345',
      email: 'rashford@gmail.com',
      password: 'rashford10',
    });
    // if condition
    if (!response.body.success) {
      expect(response.body.message).toEqual('User Already Exists!');
    } else {
      expect(response.body.message).toEqual('User Created Successfully!');
    }
  });

  // Test Case 2: User Login - Incorrect Email or Password
  it('POST User Login | Incorrect credentials', async () => {
    // Mock user data
    const loginUser = {
      email: 'wrong.email@example.com',
      password: 'incorrectpassword',
    };

    const response = await request(app).post('/api/user/login').send(loginUser);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('User does not exist!');
  });

  // Test Case 3: User login -
  it('POST User Login | Successful login should return token and user data', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: 'rashford@gmail.com',
      password: 'rashford10',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toEqual('User Logged in Successfully');
    expect(response.body.token).toBeDefined();
    expect(response.body.token.length).toBeGreaterThan(0);
    expect(response.body.userData).toBeDefined();
    expect(response.body.userData.email).toEqual('rashford@gmail.com');
    expect(response.body.userData.password).toBeUndefined();
  });

  // Test Case 4: Get single profile(user)
  it('GET Single profile | Fetch single profile', async () => {
    const response = await request(app)
      .get('/api/user/get_single_profile')
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('User fetched');
  });

  // Test Case 5: Get all movies
  it('GET All movies | Fetch all movies', async () => {
    const response = await request(app)
      .get('/api/movie/get_all_movies')
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Movies fetched successfully');
  });

  // Test Case 6: Get single movie
  it('GET Single movie | Fetch single movie', async () => {
    const response = await request(app)
      .get('/api/movie/get_single_movie/668e7070a890df8a10facc99')
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Movie fetched');
  });

  // Test Case 7: Get all shows
  it('GET All shows | Fetch all shows', async () => {
    const response = await request(app)
      .get('/api/shows/get_all')
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Shows fetched successfully');
  });

  // Test Case 8: Get single show by movie id
  it('GET Single show | Fetch single show by movie id', async () => {
    const response = await request(app)
      .get('/api/shows/get_by_movie/668e7070a890df8a10facc99')
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Shows fetched successfully');
  });

  // Test Case 9: Get all bookings
  it('GET All bookings | Fetch all bookings', async () => {
    const response = await request(app)
      .get('/api/booking/get_all_bookings')
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual(
      'Booked tickets fetched successfully'
    );
  });

  // Test Case 10: Add booking
  it('POST Add booking | Add booking', async () => {
    const response = await request(app)
      .post('/api/booking/create')
      .set('authorization', `Bearer ${token}`)
      .send({
        show: '668e7070a890df8a10facc99',
        price: 1000,
        seats: ['668e8d101c03c4359a03e49c', '668e8d101c03c4359a03e4a0'],
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual('Booking added successfully');
  });
});
