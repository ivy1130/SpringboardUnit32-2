process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let skittles = { name: "skittles",
                 price: 1.00 };

beforeEach(function () {
  items.push(skittles);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get('/items')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({items: [skittles]})
    })
})

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${skittles.name}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({item: skittles})
    })
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).get('/items/invaliditem')
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () => {
    test("Create an item", async () => {
        const res = await request(app).post('/items').send({name: "kitkat", price: 2})
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({item:{name: "kitkat", price: 2}})
    })
    test("Responds with 400 if name is missing", async () => {
        const res = await request(app).post("/items").send({price: 3})
        expect(res.statusCode).toBe(400)
    })
    test("Responds with 400 if price is missing", async () => {
        const res = await request(app).post("/items").send({name: "snickers"});
        expect(res.statusCode).toBe(400)
    })
})

describe("/PATCH /items/:name", () => {
    test("Updating an item's name", async () => {
      const res = await request(app).patch(`/items/${skittles.name}`).send({name: "twix", price: Number(`${skittles.price}`)})
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({ item: {name: "twix", price: Number(`${skittles.price}`)}})
    })
    test("Updating an item's price", async () => {
      const res = await request(app).patch(`/items/${skittles.name}`).send({name: `${skittles.name}`, price: 20})
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({ item: {name: `${skittles.name}`, price: 20}})
    })
    test("Responds with 404 for invalid name", async () => {
      const res = await request(app).patch(`/items/skiddles`).send({ name: "twix", price: 10 })
      expect(res.statusCode).toBe(404)
    })
  })
  
  describe("/DELETE /items/:name", () => {
    test("Deleting an item", async () => {
      const res = await request(app).delete(`/items/${skittles.name}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: `${skittles.name} has been deleted`})
    })
    test("Responds with 404 for deleting invalid item", async () => {
      const res = await request(app).delete(`/items/blahblah`)
      expect(res.statusCode).toBe(404)
    })
  })