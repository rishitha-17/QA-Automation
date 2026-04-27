/** Generates a random integer between 100_000 and 999_999 to avoid ID collisions */
export function randomId(): number {
  return Math.floor(Math.random() * 900_000) + 100_000;
}

/** Generates a unique username using a timestamp + random suffix */
export function randomUsername(): string {
  return `testuser_${Date.now()}_${Math.floor(Math.random() * 999)}`;
}

/** Builds a Pet payload matching the Petstore Pet schema */
export function buildPet(
  id: number,
  name: string,
  status: 'available' | 'pending' | 'sold' = 'available',
) {
  return {
    id,
    name,
    category: { id: 1, name: 'Dogs' },
    photoUrls: ['https://example.com/photo.jpg'],
    tags: [{ id: 1, name: 'automation' }],
    status,
  };
}

/** Builds an Order payload matching the Petstore Order schema */
export function buildOrder(orderId: number, petId: number) {
  return {
    id: orderId,
    petId,
    quantity: 2,
    shipDate: new Date().toISOString(),
    status: 'placed',
    complete: false,
  };
}

/** Builds a User payload matching the Petstore User schema */
export function buildUser(userId: number, username: string, password = 'Test@1234') {
  return {
    id: userId,
    username,
    firstName: 'Test',
    lastName: 'User',
    email: `${username}@example.com`,
    password,
    phone: '9876543210',
    userStatus: 1,
  };
}
