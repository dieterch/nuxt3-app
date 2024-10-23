const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

async function main() {
  // Kategorien erstellen
  const hotelCategory = await prisma.category.create({
    data: {
      name: 'Hotel',
      icon: 'mdi-bed',
    },
  });

  const restaurantCategory = await prisma.category.create({
    data: {
      name: 'Restaurant',
      icon: 'mdi-silverware-fork-knife',
    },
  });

  const transportationCategory = await prisma.category.create({
    data: {
      name: 'Transportation',
      icon: 'mdi-train-car',
    },
  });

  const winterCategory = await prisma.category.create({
    data: {
      name: 'Winter',
      icon: 'mdi-snowflake-thermometer',
    },
  });

  // Benutzer erstellen
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'carol@example.com',
      name: 'Carol',
    },
  });

  // Reise erstellen
  const trip1 = await prisma.trip.create({
    data: {
      name: 'Trip to Paris',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-10'),
      users: {
        create: [
          { userId: user1.id },
          { userId: user2.id },
          { userId: user3.id },
        ],
      },
    },
  });

  // Prozentuale Aufteilung der Tripkosten auf die Benutzer
  await prisma.tripShare.createMany({
    data: [
      { tripId: trip1.id, userId: user1.id, percentage: 33.33 },
      { tripId: trip1.id, userId: user2.id, percentage: 33.33 },
      { tripId: trip1.id, userId: user3.id, percentage: 33.34 },
    ],
  });

  // Ausgaben erstellen (keine Beträge für einzelne Shares mehr nötig)

  // Beispiel 1: Hotel-Ausgabe
  const expense1 = await prisma.expense.create({
    data: {
      amount: 300.0,
      currency: '€',
      date: new Date('2024-09-02'),
      location: 'Paris',
      categoryId: hotelCategory.id, // Kategorie: Hotel
      description: 'Hotel for 3 nights',
      tripId: trip1.id,
      userId: user1.id, // Alice hat diese Ausgabe getätigt
    },
  });

  // Beispiel 2: Restaurant-Ausgabe
  const expense2 = await prisma.expense.create({
    data: {
      amount: 150.0,
      currency: '€',
      date: new Date('2024-09-03'),
      location: 'Paris',
      categoryId: restaurantCategory.id, // Kategorie: Restaurant
      description: 'Dinner at a restaurant',
      tripId: trip1.id,
      userId: user2.id, // Bob hat diese Ausgabe getätigt
    },
  });

  // Weitere Beispiel-Reise und Ausgabe
  const trip2 = await prisma.trip.create({
    data: {
      name: 'Trip to Tokyo',
      startDate: new Date('2024-10-05'),
      endDate: new Date('2024-10-15'),
      users: {
        create: [
          { userId: user1.id },
          { userId: user3.id },
        ],
      },
    },
  });

  // Prozentuale Aufteilung der Tripkosten auf die Benutzer (Trip 2)
  await prisma.tripShare.createMany({
    data: [
      { tripId: trip2.id, userId: user1.id, percentage: 50.0 },
      { tripId: trip2.id, userId: user3.id, percentage: 50.0 },
    ],
  });

  const expense3 = await prisma.expense.create({
    data: {
      amount: 200.0,
      currency: '¥',
      date: new Date('2024-10-07'),
      location: 'Tokyo',
      categoryId: transportationCategory.id, // Kategorie: Transport
      description: 'Train tickets',
      tripId: trip2.id,
      userId: user3.id, // Carol hat diese Ausgabe getätigt
    },
  });

  console.log('Seed data with categories and trips created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
